const run = require('./app')
const request = require('supertest')
const DevCycle = require('./devcycle')

jest.mock('./devcycle')
jest.mock('./utils/logVariation')

describe('greeting', () => {
    let mockDevCycleClient = {
        onClientInitialized: jest.fn(),
        variableValue: jest.fn(),
    }

    const mockVariableValue = (variable, value) => {
        mockDevCycleClient.variableValue = jest.fn()
        mockDevCycleClient.variableValue.mockImplementation((user, variableName, defaultValue) => (
            variableName === variable ? value : defaultValue
        ))
    }

    beforeEach(() => {
        DevCycle.initializeDevCycle.mockReturnValue(mockDevCycleClient)
        DevCycle.getDevCycleClient.mockReturnValue(mockDevCycleClient)
    })

    test.each([
        'default',
        'step-1',
        'step-2',
        'step-3'
    ])('returns greeting for variable value "%s"', async (value) => {
        mockVariableValue('example-text', value)

        const app = await run()

        return request(app)
            .get('/')
            .then((response) => {
                expect(response.statusCode).toBe(200)
                expect(response.text).toMatchSnapshot()
            })
    })
})
