module.exports = {
  extends: ["standard", "prettier"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        singleQuote: true,
        semi: false,
        printWidth: 120
      }
    ]
  },
  env: { mocha: true }
}
