export const CONFIG_PORT = process.env.PORT || 4000

export const CONFIG_MODE = process.env.MODE || "dev"

export const CONFIG_JWT_SECRET = process.env.JWT_SECRET || ""

// 
export const CONFIG_FX_RATE_MARGIN = 1.15

// REDIS
export const CONFIG_REDIS_HOST = ''
export const CONFIG_REDIS_PORT = 3000
export const CONFIG_REDIS_PASSWORD = ''


// PAYSTACK
export const CONFIG_PAYSTACK_API_URL = 'https://api.paystack.co'
export const CONFIG_PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY



// ZEPTOMAIL
export const CONFIG_ZEPTO_SMTP_HOST = process.env.ZEPTO_SMTP_HOST
export const CONFIG_ZEPTO_SMTP_PORT = process.env.ZEPTO_SMTP_PORT
export const CONFIG_ZEPTO_SMTP_USERNAME = process.env.ZEPTO_SMTP_USERNAME
export const CONFIG_ZEPTO_SMTP_PASSWORD = process.env.ZEPTO_SMTP_PASSWORD
export const CONFIG_ZEPTO_FROM_ADDRESS = process.env.ZEPTO_FROM_ADDRESS
