module.exports = {
  entry: './index.js',
  output: {
    filename: './dist.js',
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm.js',
    },
  },
}
