const { configureToMatchImageSnapshot } = require('jest-image-snapshot');

const toMatchImageSnapshot = configureToMatchImageSnapshot({
  customDiffConfig: {
    threshold: 0.14
  },
  noColors: true
});

expect.extend({ toMatchImageSnapshot });
