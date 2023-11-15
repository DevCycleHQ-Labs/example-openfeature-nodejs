const mockClient = {
    variableValue: jest.fn().mockImplementation((user, variableName, defaultValue) => {
        return defaultValue
    })
}

module.exports = {
    initializeDevCycle: jest.fn().mockReturnValue({
        onClientInitialized: jest.fn().mockResolvedValue(mockClient)
    }),
}
