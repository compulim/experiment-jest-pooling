## Background

This repository is experimenting an approach to pool expensive resources used by multiple workers in Jest.

Since Jest use [`vm`](https://nodejs.org/api/vm.html) to isolate workers, we need to set up a server to pool resources. It could be HTTP, Web Socket, or IPC.

We have a few focus areas:

- [x] The lifetime of the pool will be same as Jest
- [x] When multiple workers are running, multiple resources will be available
- [x] When worker stopped unexpectedly, the resource will be recycled or decommissioned
- [ ] A single pool will support multiple type of resources
   - Regardless of resource type, pool will have a maximum capacity
   - When the pool reach maximum capacity, pool will decommission an existing resource when a new type of resources is being requested

## Prerequisites

- Docker
- [Windows Subsystem for Linux 2](https://aka.ms/wsl2)

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
