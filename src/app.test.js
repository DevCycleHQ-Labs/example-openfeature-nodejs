const run = require('./app')
const request = require('supertest')
const DevCycle = require('@devcycle/nodejs-server-sdk')

const mockVariableValue = (variable, value) => {
    DevCycle.initializeDevCycle.mockReturnValue({
        onClientInitialized: jest.fn().mockResolvedValue({
            variableValue: jest.fn().mockImplementation((user, variableKey, defaultValue) => {
                return variable === variableKey ? value : defaultValue
            })
        })
    })
}

describe('greeting', () => {
    it('returns greeting from variable value', async () => {
        mockVariableValue('greeting', 'Good day!')

        const app = await run()

        return request(app)
            .get('/greeting?user_id=1234')
            .then((response) => {
                expect(response.statusCode).toBe(200)
                expect(response.body.message).toBe('Good day!')
            })
    })
})

describe('secrets', () => {
    it('allows user to access secrets', async () => {
        mockVariableValue('allow-secrets', true)

        const app = await run()

        return request(app)
            .get('/secrets?user_id=1234')
            .then((response) => {
                expect(response.statusCode).toBe(200)
                expect(response.body.message).toBe('You may have the secrets')
            })
    })

    it('prevents user from accessing secrets', async () => {
        mockVariableValue('allow-secrets', false)

        const app = await run()

        return request(app)
            .get('/secrets?user_id=1234')
            .then((response) => {
                expect(response.statusCode).toBe(405)
                expect(response.body.message).toBe('Method not allowed')
            })
    })
})

describe('users', () => {
    it('returns full user object', async () => {
        mockVariableValue('allow-user-details', true)

        const app = await run()

        return request(app)
            .get('/users?user_id=1234')
            .then((response) => {
                expect(response.statusCode).toBe(200)
                expect(JSON.stringify(response.body)).toBe(JSON.stringify([
                    { id: 1, name: 'John Doe', role: 'admin' },
                    { id: 2, name: 'Jane Doe', role: 'member' },
                ]))
            })
    })

    it('returns partial user object', async () => {
        mockVariableValue('allow-user-details', false)

        const app = await run()

        return request(app)
            .get('/users?user_id=1234')
            .then((response) => {
                expect(response.statusCode).toBe(200)
                expect(JSON.stringify(response.body)).toBe(JSON.stringify([
                    { name: 'John Doe' },
                    { name: 'Jane Doe' },
                ]))
            })
    })
})