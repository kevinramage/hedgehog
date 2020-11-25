/**
 * @class
 * StringUtils class help to manipulate string
 */
export class StringUtils {

    /**
     * Check if an expression contains one of the keyword present in the array
     * @param expression expression to check
     * @param keywords keywords to search
     * @returns return true if one of keywords find, false else
     */
    static containsOneOf(expression: string, keywords : Array<string>) : boolean {
        var result : boolean = false;
        keywords.forEach(k => {
            if ( expression.includes(k)) {
                result = true;
                return;
            }
        });
        return result;
    }

    static equalsOneOf(expression: string, keywords : Array<string>) : boolean {
        var result : boolean = false;
        keywords.forEach(k => {
            if ( expression == k ) {
                result = true;
                return;
            }
        });
        return result;
    }    

    /**
     * Fill a string with specific character x times
     * @param character character to repeat x times
     * @param length the repetition
     * @returns a new string filled
     */
    static fill (character: string, length: number) : string {
        var result = "";
        for (var i = 0; i < length; i++) {
            result += character;
        }
        return result;
    }
}