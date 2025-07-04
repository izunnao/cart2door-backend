export const extractErrorMessage = (error: any) => {
    return error.message ?? error.data.message
}