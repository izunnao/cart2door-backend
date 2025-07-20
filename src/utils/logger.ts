// lib/logger.ts
import { createLogger, format, transports } from 'winston'

export const logger = createLogger({
  level: 'info', // you can change this to debug, warn, error
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(
      ({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()}: ${message}`
    )
  ),
  transports: [
    new transports.Console()
  ]
})
