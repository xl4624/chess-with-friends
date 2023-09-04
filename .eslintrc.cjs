module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
    mocha: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended",
    "plugin:mocha/recommended"
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname
  },
  globals: {
    document: "readonly",
    window: "readonly"
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  plugins: [
    "@typescript-eslint",
    "react",
    "react-hooks",
    "react-refresh",
    "prettier",
    "mocha"
  ],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true }
    ],
    "prettier/prettier": ["error", {
      "endOfLine": "auto"
    }]
  },
  overrides: [
    {
      files: ["**/*.test.ts", "**/*.test.js", "**/*.spec.ts", "**/*.spec.js"], // adjust this pattern to match your test files
      rules: {
        "mocha/no-nested-tests": "off"
      }
    }
  ]
};

