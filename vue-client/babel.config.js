module.exports = {
  presets: [
    "@babel/env",
    '@vue/app',
    {
      "targets": {
        "ie": "11",
      }
    }
  ]
}
