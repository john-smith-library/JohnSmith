export class Utils {
    static wrapObjectWithSelfFunction<TTarget, TFunctionResult>(target: TTarget, payload: Function): any{
        var result = function (...args: any[]) {
            args.splice(0, 0, result);
            return payload.apply(this, args);
        };

        for (var key in target) {
//            if (typeof target[key] === 'function') {
//                (function(k){
//                    result[k] = function(){
//                        return target[k].apply(result, arguments);
//                    };
//                })(key);
//            } else {
                result[key] = target[key];
//            }
        }

        return result;
    }
}