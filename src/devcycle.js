const DevCycle = require('@devcycle/nodejs-server-sdk')
const DEVCYCLE_SERVER_SDK_KEY = process.env.DEVCYCLE_SERVER_SDK_KEY

let devcycleClient

async function initializeDevCycle() {
    devcycleClient = await DevCycle.initializeDevCycle(
        DEVCYCLE_SERVER_SDK_KEY,
        {
            logLevel: 'info',
            // Controls the polling interval in milliseconds to fetch new environment config changes
            configPollingIntervalMS: 5 * 1000,
            // Controls the interval between flushing events to the DevCycle servers
            eventFlushIntervalMS: 1000
        },
    ).onClientInitialized()
    return devcycleClient
}

function getDevCycleClient() {
    return devcycleClient
}

module.exports = {
    initializeDevCycle,
    getDevCycleClient,
}