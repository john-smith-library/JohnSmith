import { ObservableValue } from './observable-value';
import { BidirectionalListenable } from './listenable';

export type ChangeHandlerResult<T> = { newValue: T };
export type ChangeHandler<T> = (value: T) => boolean|null|undefined|void|ChangeHandlerResult<T>;

export class BidirectionalValue<T> extends ObservableValue<T> implements BidirectionalListenable<T> {
    constructor(private changeHandler: ChangeHandler<T>, value: T) {
        super(value);
    }

    requestUpdate(newValue: T) {
        const handlerResult = this.changeHandler(newValue);

        if (handlerResult === undefined || handlerResult === null || handlerResult === true) {
            this.setValue(newValue);
        } else if (handlerResult !== false && handlerResult.newValue !== undefined) {
            this.setValue(handlerResult.newValue);
        }
    }
}
