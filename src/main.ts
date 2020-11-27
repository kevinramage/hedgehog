import { Test } from "./test";

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
        const logFormat = winston.format.printf(({ level, message, timestamp }) => {
            return `${timestamp} - ${level.toUpperCase()} - ${message}`;
        });
        const consoleFormat = winston.format.printf(({ level, message }) => {
            return `${level.toUpperCase()} - ${message}`;
        });

        // Add loggers
        winston.remove(winston.transports.Console);
        winston.add(new winston.transports.DailyRotateFile({ filename: "logs/Hedgehog_%DATE%.log", datePattern: 'YYYY-MM-DD', level: 'debug', zippedArchive: true, maxSize: '20m', maxFiles: '14d', format: winston.format.combine(winston.format.timestamp(), logFormat)}));
        winston.add(new winston.transports.Console({level: "info", stderrLevels: ["error"], format: consoleFormat}));

    }

    async run() {

        // Init
        this.init();

        // Run
        await Program.instance.run();
    }
}

new Main().run();