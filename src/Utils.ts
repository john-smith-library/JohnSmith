export module Utils {
    export var isNullOrUndefined = function(value: any){
        return value === null || value === undefined;
    };

    /**
     * Checks if provided object is a function.
     * @param target An object to check.
     * @returns {boolean}
     */
    export var isFunction = function(target: any){
        var getType = {};
        return (target && getType.toString.call(target) === '[object Function]');
    }

    /**
     *
     */
    export var wrapObjectWithSelfFunction = function<TTarget, TFunctionResult>(target: TTarget, payload: Function): any{
        var result: any = function (...args: any[]) {
            args.splice(0, 0, result);
            return payload.apply(this, args);
        };

        for (var key in target) {
            result[key] = target[key];
        }

        return result;
    }
}

export module ArrayUtils
{
    export var removeItem = function<T>(array: T[], itemToRemove:T):void {
        var indexToRemove: number = -1;
        for (var i = 0; i < array.length; i++) {
            if (array[i] === itemToRemove) {
                indexToRemove = i;
            }
        }

        if (indexToRemove >= 0) {
            array.splice(indexToRemove, 1);
        }
    }
}

export module DisposingUtils {
    export var noop = () => {};
    export var noopDisposable: IDisposable = {
        dispose: noop
    };
}