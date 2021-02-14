module.exports = {
  plugins: {
    'postcss-preset-env': {
      stages: 0,
      features: {
        'nesting-rules': true,
      },
    },
  },
};
