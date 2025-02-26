require('dotenv').config()
const express = require('express')

const { initializeDevCycle } = require('./devcycle')
const greetingHandler = require('./routes/greeting')
const { logVariation } = require('./utils/logVariation')

async function run() {
    const { devcycleProvider } = await initializeDevCycle()

    const app = express()
    app.use(express.urlencoded({ extended: false }))
    app.use(express.json())

    app.use((req, res, next) => {
        res.set({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Content-Type',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
        })
        next()
    })
    app.use((req, res, next) => {
        /**
         * In a real application you would build the user object based on the
         * authenticated user
         */
        req.user = {
            user_id: 'user123',
            name: 'Jane Doe',
            email: 'jane.doe@email.com'
        }
        next()
    })

    /**
     * Return a greeting based on the value of the example-text variable
     */
    app.get('/', greetingHandler)

    /**
     * Return all variable values for debugging purposes
     */
    app.get('/variables', (req, res) => {
        const variables = devcycleProvider.devcycleClient.allVariables(req.user)
        res.json(variables)
    })

    /**
     * Log togglebot to the console using the togglebot-spin and togglebot-wink
     * variables to control the output
     */
    logVariation()

    return app
}

module.exports = run
