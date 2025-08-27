import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { 
    files: ["src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"], 
    languageOptions: { globals: globals.browser },
    ignores: ["dist/**", "node_modules/**", "**/*.min.js"],
    rules: {
			"no-unused-vars": "warn",
		},
  },
  tseslint.configs.recommended,
]);
