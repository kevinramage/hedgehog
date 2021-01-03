import * as winston from "winston";

export class Evaluator {
    private static _regex = /\{\{\s*([\w|\-|\\.]*)\s*\}\}/g;
    private static _loopRegex = /\{\{\s*LOOP condition=([\w|\-|\\.]*) content=([\w<>\/\s\{\}='":\.\(\),;?!]*)END\}\}/g;

    public static evaluate(variables: {[key: string]: any }, content: string) {
        winston.debug("Evaluator.evaluate");
        let newContent = Evaluator.evaluateLoop(variables, content.replace(/\r/g, ""));
        newContent = Evaluator.evaluateSimpleExpressions(variables, newContent);
        return newContent;
    }

    private static evaluateSimpleExpressions(variables: {[key: string]: any }, content: string) {
        winston.debug("Evaluator.evaluateSimpleExpressions");
        let newContent = content;
        let previousContent = content;
        do {
            previousContent = newContent;
            newContent = Evaluator.evaluateSimpleExpression(variables, newContent);
        } while (newContent !== previousContent);
        return newContent;
    }

    private static evaluateSimpleExpression(variables: {[key: string]: any }, content: string) {
        winston.debug("Evaluator.evaluateSimpleExpression");
        const regex = Evaluator._regex;
        let newContent = content;
        let match = regex.exec(content);
        while (match != null && match.length >= 2) {
            const keyName = match[1];
            const key = Object.keys(variables).find(v => { return v === keyName; });
            if (key) {
                newContent = content.replace(match[0], variables[key]);
            }
            match = regex.exec(content);
        }
        return newContent;
    }

    private static evaluateLoop(variables: {[key: string]: any }, content: string) {
        winston.debug("Evaluator.evaluateLoop");
        const match = Evaluator._loopRegex.exec(content);
        if (match && match.length >= 1) {
            const conditionKey = Object.keys(variables).find(v => { return v === match[1]; });
            const templateContent = match[2];
            if (conditionKey) {
                const conditionValue = variables[conditionKey];
                if (conditionValue && conditionValue.length) {
                    const conditionArray = conditionValue as any[];
                    const loopContent = conditionArray.map((i : any) => {
                        return Evaluator.evaluateLoopItem(i, templateContent);
                    }).join("");
                    return content.replace(match[0], loopContent);
                }
            }
        }

        return content;
    }

    private static evaluateLoopItem(item: any, templateContent: string) : string {
        winston.debug("Evaluator.evaluateLoopItem");
        return Evaluator.evaluateSimpleExpressions(item, templateContent);
    }
}