import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import { fixupConfigRules } from "@eslint/compat";

export default [
  {
    languageOptions: {
      globals: globals.browser,
      parser: "@typescript-eslint/parser", // Добавляем парсер TypeScript
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    plugins: ["@typescript-eslint", "react"], // Добавляем плагины
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:react/recommended",
    ],
    rules: {
      // Ваши собственные правила ESLint
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
];
