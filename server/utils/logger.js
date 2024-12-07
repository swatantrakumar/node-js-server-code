const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

// Define your custom format
const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

// Create the logger
const logger = createLogger({
  level: 'info',  // Change the logging level as needed (e.g., 'error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly')
  format: combine(
    label({ label: 'right meow!' }),
    timestamp(),
    myFormat
  ),
  transports: [
    new transports.Console(),  // Log to the console
    new transports.File({ filename: 'error.log', level: 'error' }),  // Log errors to a file
    new transports.File({ filename: 'combined.log' })  // Log everything to a file
  ]
});

module.exports = logger;
