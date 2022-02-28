import {Listenable, ListenerCallback} from '../../listenable';
import {Disposable} from '../../../common';

Listenable.prototype.map = function<TResult>(mapper: (value: unknown) => TResult) {
    return new MappedListenable(this, mapper);
};

declare module '../../listenable' {
    interface Listenable<T> {
        /**
         * Creates new listenable that emits values applying the mapper function
         * to source listenable values.
         *
         *     const name = new ObservableValue<string>();
         *
         *     const uppercaseName = name.map(n => n == null ? null : n.toUpperCase());
         *
         *     uppercaseName.listen(x => console.log(x));
         *     name.setValue('John');
         *
         *     // Outputs: JOHN
         * @param mapper
         */
        map<TResult>(mapper: (value: T) => TResult) : Listenable<TResult>;
    }
}

class MappedListenable<TSource, TTarget> extends Listenable<TTarget> {
    constructor(private source: Listenable<TSource>, private mapper: (value: TSource) => TTarget) {
        super();
    }

    getListenersCount(): number {
        return this.source.getListenersCount();
    }

    listen(listener: ListenerCallback<TTarget>, raiseInitial?: boolean): Disposable {
        let cachedOldValue: TTarget|undefined = undefined;

        return this.source.listen(
            (value, oldValue, details) => {

                const
                    mappedNewValue: TTarget = this.mapper(value),
                    mappedOldValue = oldValue === undefined ? undefined : (cachedOldValue === undefined ? this.mapper(oldValue) : cachedOldValue),
                    mappedDetails = {
                        reason: details.reason,
                        portion: details.portion === value ? mappedNewValue : this.mapper(details.portion)
                };

                listener(
                    mappedNewValue,
                    mappedOldValue,
                    mappedDetails);

                cachedOldValue = mappedNewValue;
            }, raiseInitial);
    }
}
