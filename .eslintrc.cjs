module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
  globals: {
    document: "readonly",
    window: "readonly",
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ["@typescript-eslint", "react", "react-hooks", "react-refresh", "prettier"],
  rules: {
    'react/react-in-jsx-scope': 'off',
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "prettier/prettier": ["error", {
      "endOfLine": "auto"
    }]
  },
};
