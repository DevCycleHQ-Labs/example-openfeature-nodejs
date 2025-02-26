const { OpenFeature, Client } = require('@openfeature/server-sdk')
const { DevCycleProvider } = require('@devcycle/nodejs-server-sdk')
const DEVCYCLE_SERVER_SDK_KEY = process.env.DEVCYCLE_SERVER_SDK_KEY

let devcycleProvider, openFeatureClient

async function initializeDevCycleWithOpenFeature() {
    devcycleProvider = new DevCycleProvider(
        DEVCYCLE_SERVER_SDK_KEY,
        {
            logLevel: 'info',
            // Controls the polling interval in milliseconds to fetch new environment config changes
            configPollingIntervalMS: 5 * 1000,
            // Controls the interval between flushing events to the DevCycle servers
            eventFlushIntervalMS: 1000
        },
    )
    await OpenFeature.setProviderAndWait(devcycleProvider)
    openFeatureClient = OpenFeature.getClient()

    return { devcycleProvider, openFeatureClient }
}

function getDevCycleProvider() {
    return devcycleProvider
}

function getOpenFeatureClient() {
    return openFeatureClient
}

module.exports = {
    initializeDevCycle: initializeDevCycleWithOpenFeature,
    getDevCycleProvider,
    getOpenFeatureClient
}
