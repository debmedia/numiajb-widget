import VonageClient, { ClientConfig, ConfigRegion, ConversationEvent, GetConversationEventsParameters, LoggingLevel } from "@vonage/client-sdk";
import { ChatMessageType, MessageStatus, MessageType } from "../types";

const config = new ClientConfig(ConfigRegion.US);
export let client: VonageClient | null = null;
let vonageConversationID: string = "" 
let memberID: string = ""

export const connectSocket = async (
  token: string, 
  conversationId: string, 
  userId: string, 
  setMessages: React.Dispatch<React.SetStateAction<ChatMessageType[]>>,
  setIsWaitingForResponse: React.Dispatch<React.SetStateAction<boolean>>,
  setAllowToSendImgs: React.Dispatch<React.SetStateAction<boolean>>,
  setSendingMessage: React.Dispatch<React.SetStateAction<boolean>>,
  setLoader?: React.Dispatch<React.SetStateAction<boolean>>,
  setIsWebSocket?: React.Dispatch<React.SetStateAction<boolean>>,
): Promise<VonageClient> => {
  if (client) return client;

  client = new VonageClient({
    region: ConfigRegion.EU,
    loggingLevel: LoggingLevel.Debug,
  });
  client.setConfig(config);

  client.createSession(token)
  .then(sessionId => {
    loadPreviousMessages(userId, setMessages);
    setTimeout(() => {
      client!
      .joinConversation(conversationId)
      .then((memberId) => {
        memberID = memberId;
        setIsWaitingForResponse(true);
        setAllowToSendImgs(false);
        client!.on("conversationEvent", (event: ConversationEvent) => {
          if(event.conversationId === vonageConversationID) {
              handleEventsFromSocket(
              event, 
              userId, 
              setMessages,
              undefined, 
              setSendingMessage, 
              setLoader,
              setIsWebSocket,
              setIsWaitingForResponse,
            );
          }
        });
      }).catch(error => {
        console.error("Error joining conversation: ", error);
      })
    }, 1000);
  })
  .catch(error => {
    setMessages((prev: any) => [...prev, {
      message: "No se pudo conectar con el agente. Por favor, intente nuevamente más tarde.",
      isSend: false,
      hasError: true,
      timestamp: new Date().toISOString()
    }])
    setIsWebSocket && setIsWebSocket(false);
    console.error("Error creating session: ", error);
  });
  vonageConversationID = conversationId;
  return client;
};

export const loadPreviousMessages = (
  userId: string, 
  setMessages: React.Dispatch<React.SetStateAction<ChatMessageType[]>>
) => {

  const now = new Date().getTime();
  const params: GetConversationEventsParameters = { order: 'asc', pageSize: 100 };
  client!.getConversationEvents(vonageConversationID, params).then(history => {
    history.events.forEach(event => {
      const evt = event as any;
      const eventTimestamp = new Date(evt.timestamp).getTime();
      if(eventTimestamp < now) {
        handleEventsFromSocket(event, userId, setMessages, MessageStatus.SENT);
      }
    });
  });
}

export const sendMessageBySocket = (
  message: string,
) => {
  client!
  .sendMessageTextEvent(vonageConversationID, message)
}

export const handleEventsFromSocket = (
  event: any,
  userId: string,
  setMessages: React.Dispatch<React.SetStateAction<ChatMessageType[]>>,
  messageStatus: MessageStatus = MessageStatus.PENDING,
  setSendingMessage?: React.Dispatch<React.SetStateAction<boolean>>,
  setLoader?: React.Dispatch<React.SetStateAction<boolean>>,
  setIsWebSocket?: React.Dispatch<React.SetStateAction<boolean>>,
  setIsWaitingForResponse?: React.Dispatch<React.SetStateAction<boolean>>,
) => {
    if (event.body.text) {
      event.body.text = event.body.text.replace(/\\u0022/g, '"');
    }

    switch (event.kind) {
      case "member:joined":
      case "member:invited":
        break;
      case "member:left":
        client?.leaveConversation(vonageConversationID);
        break;
      case "message:text":
        let message = parseIfJSON(event.body.text);
        const senderId = (event.from as any)?.user?.id;

        if(senderId != userId) {
          setIsWaitingForResponse && setIsWaitingForResponse(false);
          setSendingMessage && setSendingMessage(false);
        }

        if(message.type === MessageType.DELIMITER) {
          if(message.msg == "FINISH" || message.msg == "REVOKE") {
            leaveConversation(setIsWebSocket);
            setMessages((prev: any) => [...prev, {
              message: message.msg == "REVOKE" ? "El agente ha finalizado la conversación por falta de respuesta." : "El agente ha finalizado la conversación.",
              isSend: false,
              timestamp: event.timestamp,
              sender: "Agent",
              id: event.id,
              status: messageStatus
            }])
            return;
          }
        }

        setMessages((prev: any) => [...prev, {
          message: message.msg,
          isSend: senderId == userId ? true : false,
          timestamp: event.timestamp,
          sender: (event.from as any)?.user?.name || "Agent",
          id: event.id,
          status: messageStatus
        }]);

       
        setLoader && setLoader(false);
        break;
      case "message:vcard":
      case "message:location":
      case "message:template":
        break;
      case "event:delete":
        setMessages((prev) => prev.filter(m => m.id !== event.body.eventId));
        break;

      case "message:seen":
        updateMessageStatus(setMessages, event.body.eventId, MessageStatus.SEEN);
        break;

      case "message:delivered":
        updateMessageStatus(setMessages, event.body.eventId, MessageStatus.SENT);
        break;

      case "message:undeliverable":
      case "message:rejected":
        updateMessageStatus(setMessages, event.body.eventId, MessageStatus.WARNING);
        break;

      case "message:submitted":
        updateMessageStatus(setMessages, event.body.eventId, MessageStatus.SENT);
        break;

      case "ephemeral":
        if (event.from.user.id !== userId) {
          if (event.body.typing) {
            if(setSendingMessage) setSendingMessage(true);
          } else {
            if(setSendingMessage) setSendingMessage(false);
          }
        } 
        break;
      case "custom":
        break;
      default:
        break;
    }
    setLoader && setLoader(false);
};

const parseIfJSON = (text: string): any => {
  try {
    return JSON.parse(text);
  } catch (e) {
    return { msg: text, type: MessageType.TEXT };
  }
}

const updateMessageStatus = (
  setMessages: React.Dispatch<React.SetStateAction<ChatMessageType[]>>,
  eventId: number,
  status: MessageStatus
) => {
  setMessages((prev) =>
    prev.map((m) => (m.id === eventId ? { ...m, status } : m))
  );
};

const leaveConversation = async (
  setIsWebSocket?: React.Dispatch<React.SetStateAction<boolean>>,  
) => {
  await client?.leaveConversation(vonageConversationID);
  await client?.deleteSession();
  setIsWebSocket && setIsWebSocket(false);
  client = null;
}