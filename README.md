## Prerequisites

- Docker
- WSL2

## How to run

1. `npm start` to run a standalone node of Chromium
1. `npm test` to run the test

## Jest lifecycle functions

1. Main thread: `globalSetup`
1. Runner thread:
   1. `setupFiles`
   1. `TestEnvironment.async`
   1. `setupFilesAfterEnv`
   1. `TestEnvironment.teardown`
1. Main thread: `globalTeardown`
