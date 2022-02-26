import {DataChangeReason, Listenable, ListenerCallback } from '../../listenable';
import {Disposable, Owner} from "../../../common";

Listenable.prototype.combine = function<TRight, TResult>(
    right: Listenable<TRight>,
    transform: (left: unknown, right: TRight) => TResult) : Listenable<TResult> {

    return new DependantListenableValue(this, right, transform);
};

declare module '../../listenable' {
    interface Listenable<T> {
        /**
         * Combines two source listenables into one transforming the source values on every change.
         *
         *     const
         *         firstName = new ObservableValue<string>(),
         *         lastName = new ObservableValue<string>();
         *
         *     const combined = firstName.combine(
         *          lastName,
         *          (firstNameValue, lastNameValue) => (firstNameValue || '') + ' ' + (lastNameValue || ''));
         *
         *     combined.listen(v => console.log(v));
         *
         *     firstName.setValue('John');
         *     secondName.setValue('Smith');
         *
         *     // outputs 'John Smith'
         *
         * @param right second listenable to combine
         * @param transform the function to combine values
         */
        combine<TRight, TResult>(right: Listenable<TRight>, transform: (left: T, right: TRight) => TResult) : Listenable<TResult>;
    }
}

class DependantListenableValue<TLeft, TRight, TResult> extends Listenable<TResult> {
    private _listenersCount = 0;

    constructor(
        private left: Listenable<TLeft>,
        private right: Listenable<TRight>,
        private transformer: (valueLeft: TLeft, valueRight: TRight) => TResult) {

        super();
    }

    listen(listener: ListenerCallback<TResult>, raiseInitial?: boolean): Disposable {
        this._listenersCount++;

        let leftOld: TLeft|undefined,
            rightOld: TRight|undefined,
            transformedOld: TResult|undefined;

        const actualRaiseInitial = raiseInitial === undefined || raiseInitial === true;

        return new Owner([
            this.left.listen((newValue: TLeft, _, details) => {
                leftOld = newValue;

                if (rightOld !== undefined) {
                    const transformedNew = this.transformer(newValue, rightOld);

                    if (details.reason !== DataChangeReason.initial || actualRaiseInitial) {
                        listener(
                            transformedNew,
                            transformedOld,
                            {reason: DataChangeReason.replace, portion: transformedNew});
                    }

                    transformedOld = transformedNew;
                }

            }, true),
            this.right.listen((newValue: TRight, _, details) => {
                rightOld = newValue;

                if (leftOld !== undefined) {
                    const transformedNew = this.transformer(leftOld, newValue);

                    if (details.reason !== DataChangeReason.initial || actualRaiseInitial) {
                        listener(
                            transformedNew,
                            transformedOld,
                            {reason: DataChangeReason.replace, portion: transformedNew});
                    }

                    transformedOld = transformedNew;
                }
            }, true),
            {
                dispose: () => {
                    this._listenersCount--;
                    leftOld = undefined;
                    rightOld = undefined;
                    transformedOld = undefined;
                }
            }
        ]);
    }

    getListenersCount(): number {
        return this._listenersCount;
    }
}
