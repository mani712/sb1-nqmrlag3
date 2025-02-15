module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      'test/**/*.js'
    ],
    browsers: ['Chrome'],
    singleRun: true,
    reporters: ['progress']
  });
};