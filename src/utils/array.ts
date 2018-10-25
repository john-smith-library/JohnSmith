export class ArrayUtils {
    static removeItem<T>(array: T[], itemToRemove:T):void {
        let indexToRemove: number = -1;

        for (let i = 0; i < array.length; i++) {
            if (array[i] === itemToRemove) {
                indexToRemove = i;
            }
        }

        if (indexToRemove >= 0) {
            array.splice(indexToRemove, 1);
        }
    }
}