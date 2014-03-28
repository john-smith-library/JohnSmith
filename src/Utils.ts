export module Utils {
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
        var result = function (...args: any[]) {
            args.splice(0, 0, result);
            return payload.apply(this, args);
        };

        for (var key in target) {
            result[key] = target[key];
        }

        return result;
    }
}