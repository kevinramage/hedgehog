import { Test } from "./test";

import * as winston from 'winston';
import 'winston-daily-rotate-file';

/**
 * npm start -- [program] [options]
 * program (request, spider, proxy)
 */
class Main {

    private init() {

         // Configure logs
         const myFormat = winston.format.printf(({ level, message, timestamp }) => {
            return `${timestamp} - ${level.toUpperCase()} - ${message}`;
        });
        winston.add(new winston.transports.DailyRotateFile({ filename: "logs/Hedgehog_%DATE%.log", datePattern: 'YYYY-MM-DD', 
            level: 'debug', zippedArchive: true, maxSize: '20m', maxFiles: '14d', format: winston.format.combine(winston.format.timestamp(), myFormat)}));
        winston.remove(winston.transports.Console);
        winston.add(new winston.transports.Console({level: "info", stderrLevels: ["error"], format: winston.format.combine(winston.format.timestamp(), myFormat) }));
        
    }

    async run() {

        // Init
        this.init();
        
        // Run 
        winston.info("Start");
        await new Test().run();
        winston.info("End");
    }
}

new Main().run();