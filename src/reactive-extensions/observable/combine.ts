import {DataChangeReason, ListenerCallback, Observable} from '../../reactive/listenable';
import {Disposable, Owner} from "../../common";

Observable.prototype.combine = function<TRight, TResult>(right: Observable<TRight>, transform: (left: any|null, right: TRight|null) => TResult) : Observable<TResult|null> {
    return new DependantObservableValue(this, right, transform);
};

declare module '../../reactive/listenable' {
    interface Observable<T> {
        combine<TRight, TResult>(right: Observable<TRight>, transform: (left: T|null, right: TRight|null) => TResult) : Observable<TResult|null>;
    }
}

class DependantObservableValue<TLeft, TRight, TResult> extends Observable<TResult|null> {
    constructor(
        private left: Observable<TLeft>,
        private right: Observable<TRight>,
        private transformer: (valueLeft: TLeft|null, valueRight: TRight|null) => TResult) {

        super();
    }

    getValue(): TResult {
        return this.transformer(this.left.getValue(), this.right.getValue());
    }

    listen(listener: ListenerCallback<TResult|null>, raiseInitial?: boolean): Disposable {
        let leftOld: TLeft|null = this.left.getValue(),
            rightOld: TRight|null = this.right.getValue(),
            transformedOld: TResult|null = this.transformer(leftOld, rightOld);

        if (raiseInitial === undefined || raiseInitial === true) {
            listener(
                transformedOld,
                null,
                { reason: DataChangeReason.initial })
        }

        return new Owner([
            this.left.listen((newValue) => {
                let transformedNew = this.transformer(newValue, rightOld);

                listener(
                    transformedNew,
                    transformedOld,
                    { reason: DataChangeReason.replace });

                transformedOld = transformedNew;
                leftOld = newValue;
            }, false),
            this.right.listen((newValue) => {
                let transformedNew = this.transformer(leftOld, newValue);

                listener(
                    transformedNew,
                    transformedOld,
                    { reason: DataChangeReason.replace });

                transformedOld = transformedNew;
                rightOld = newValue;
            }, false),
            {
                dispose: () => {
                    leftOld = null;
                    rightOld = null;
                    transformedOld = null;
                }
            }
        ]);
    }
}