## Prerequisites

- Docker
- [https://aka.ms/wsl2](Windows Subsystem for Linux 2)

## How to run

1. `npm start` to run a standalone node of Chromium in background
1. `npm test` to run the test
1. `npm stop` to stop the Chromium

## Jest lifecycle functions

1. Main thread: `globalSetup`
1. Runner thread:
   1. `setupFiles`
   1. `TestEnvironment.async`
   1. `setupFilesAfterEnv`
   1. `TestEnvironment.teardown`
1. Main thread: `globalTeardown`
