require('dotenv').config()
const express = require('express')
const { initializeDevCycle } = require('./devcycle')


async function run() {
    const devcycleClient = await initializeDevCycle()

    const app = express()
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
    }

    app.use(express.urlencoded({ extended: false }))
    app.use(express.json())

    function getRequestUser(req, res) {
        let user = {}
        const queryParams = req.query || {}

        for (const key in queryParams) {
            user[key] = queryParams[key]
        }
        if (!user.user_id) {
            res.status(400)
            res.send(JSON.stringify({ message: 'user_id query param is required' }))
        }
        return user
    }

    // Using a variable to control the response content
    app.get('/greeting', (req, res) => {
        res.set(defaultHeaders)

        const user = getRequestUser(req, res)
        const greeting = devcycleClient.variableValue(user, 'greeting', 'Hello World')

        res.send(JSON.stringify({ message: greeting }))
    })

    // Using a variable to control access to an endpoint
    app.get('/secrets', (req, res) => {
        res.set(defaultHeaders)

        const user = getRequestUser(req, res)
        const allowSecrets = devcycleClient.variableValue(user, 'allow-secrets', false)

        if (allowSecrets) {
            res.send(JSON.stringify({ message: 'You may have the secrets' }))
        } else {
            res.status(405)
            res.send(JSON.stringify({ message: 'Method not allowed' }))
        }
    })

    // Using a variable to hide additional properties from a response
    app.get('/users', (req, res) => {
        res.set(defaultHeaders)

        const user = getRequestUser(req, res)
        const allowUserDetails = devcycleClient.variableValue(user, 'allow-user-details', false)

        const users = [
            { id: 1, name: 'John Doe', role: 'admin' },
            { id: 2, name: 'Jane Doe', role: 'member' },
        ]

        if (allowUserDetails) {
            res.send(users)
        } else {
            res.send(users.map((u) => ({ name: u.name })))
        }
    })

    return app
}

module.exports = run
