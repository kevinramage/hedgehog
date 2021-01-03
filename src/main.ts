import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { Program } from "./program/program";

/**
 * npm start -- [program] [options]
 * program (request, spider, proxy)
 */
class Main {

    private init() {

        // Configure formats
        const logFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
            if (stack) {
                return `${timestamp} - ${level.toUpperCase()} - ${message} - ${stack}`;
            } else {
                return `${timestamp} - ${level.toUpperCase()} - ${message}`;
            }
        });
        const combinedFormat = winston.format.combine(winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}), winston.format.errors({ stack: true }), logFormat);
        const transportOption = { filename: "logs/Hedgehog_%DATE%.log", datePattern: 'YYYY-MM-DD', level: 'debug', zippedArchive: true, maxSize: '20m', maxFiles: '14d', format: combinedFormat};

        // Add loggers
        winston.remove(winston.transports.Console);
        winston.add(new winston.transports.DailyRotateFile(transportOption));
        winston.add(new winston.transports.Console({level: "info", stderrLevels: ["error"], format: combinedFormat}));

    }

    async run() {

        // Init
        this.init();

        // Run
        await Program.instance.run();
    }
}

new Main().run();