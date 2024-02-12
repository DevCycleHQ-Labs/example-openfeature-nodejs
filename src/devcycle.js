const { OpenFeature, Client } = require('@openfeature/server-sdk')
const DevCycle = require('@devcycle/nodejs-server-sdk')
const DEVCYCLE_SERVER_SDK_KEY = process.env.DEVCYCLE_SERVER_SDK_KEY

let devcycleClient, openFeatureClient

async function initializeDevCycleWithOpenFeature() {
    devcycleClient = DevCycle.initializeDevCycle(
        DEVCYCLE_SERVER_SDK_KEY,
        {
            logLevel: 'info',
            // Controls the polling interval in milliseconds to fetch new environment config changes
            configPollingIntervalMS: 5 * 1000,
            // Controls the interval between flushing events to the DevCycle servers
            eventFlushIntervalMS: 1000
        },
    )
    await OpenFeature.setProviderAndWait(await devcycleClient.getOpenFeatureProvider())
    openFeatureClient = OpenFeature.getClient()

    return { devcycleClient, openFeatureClient }
}

function getDevCycleClient() {
    return devcycleClient
}

function getOpenFeatureClient() {
    return openFeatureClient
}

module.exports = {
    initializeDevCycle: initializeDevCycleWithOpenFeature,
    getDevCycleClient,
    getOpenFeatureClient
}
