export type TemplatePayloadType = {
    registrationSuccess: {
        name: string,
        id: string,
        verificationLink: string
    },
    fxRateAlertEmailI: {
        timestamp: string,
        apiUrl: string,
        errorMessage: string,
        retryCount: number
    }
}