/**
 * @class
 * Class to manipulate number
 */
export class NumberUtils {

    public static equalsOneOf(expression : number | undefined, values: number[]) {
        if ( expression ) {
            return values.includes(expression);
        } else {
            return false;
        }
    }
}