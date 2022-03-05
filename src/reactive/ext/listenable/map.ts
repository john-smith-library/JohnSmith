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

    listen(listener: ListenerCallback<TTarget>, raiseInitial?: boolean): Disposable {
        return this.source.listen(
            (value) => {
                const mappedNewValue: TTarget = this.mapper(value);
                listener(mappedNewValue);
            }, raiseInitial);
    }
}
