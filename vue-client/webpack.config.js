module.exports = {
  resolve: {
    // Add `.ts` as a resolvable extension.
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      // ... other rules omitted
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: { appendTsSuffixTo: [/\.vue$/] }
      }
    ]
  },
  // ... plugin omitted
}