const DevCycle = require('@devcycle/nodejs-server-sdk')
const DEVCYCLE_SERVER_SDK_KEY = process.env.DEVCYCLE_SERVER_SDK_KEY

let devcycleClient

async function initializeDevCycle() {
    devcycleClient = await DevCycle.initializeDevCycle(
        DEVCYCLE_SERVER_SDK_KEY,
        {
            logLevel: 'info',
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