import globals from "globals";
import pluginJs from "@eslint/js";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser"

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.ts', '**/*.js'], // Specify file patterns/extensions
    languageOptions: { 
      parser: parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: globals.node,
      ecmaVersion: 2021, 
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      "semi": ["error", "always"], // Example custom rule
    },
  },
  pluginJs.configs.recommended,
];