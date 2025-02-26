const run = require('./app')
const request = require('supertest')
const DevCycle = require('./devcycle')

jest.mock('./devcycle')
jest.mock('./utils/logVariation')

let mockDevCycleProvider = {
    onClientInitialized: jest.fn(),
    variableValue: jest.fn(),
};

let mockOpenFeatureClient = {
    getBooleanValue: jest.fn(),
    getStringValue: jest.fn(),
};

describe('greeting', () => {
    const mockVariableValue = (key, value, type) => {
        mockOpenFeatureClient.getStringValue.mockImplementation(async (variableKey, defaultValue) => {
            return (type === 'String' && variableKey === key) ? value : defaultValue
        })
    }

    beforeEach(() => {
        DevCycle.initializeDevCycle.mockReturnValue({
            devcycleProvider: mockDevCycleProvider,
            openFeatureClient: mockOpenFeatureClient
        })
        DevCycle.getOpenFeatureClient.mockReturnValue(mockOpenFeatureClient)
        DevCycle.getDevCycleProvider.mockReturnValue(mockDevCycleProvider)
    })

    test.each([
        'default',
        'step-1',
        'step-2',
        'step-3'
    ])('returns greeting for variable value "%s"', async (value) => {
        mockVariableValue('example-text', value, 'String')

        const app = await run()

        return request(app)
            .get('/')
            .then((response) => {
                expect(response.statusCode).toBe(200)
                expect(response.text).toMatchSnapshot()
            })
    })
})
