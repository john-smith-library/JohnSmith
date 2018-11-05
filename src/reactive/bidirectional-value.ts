import { ObservableValue } from './observable-value';
import {BidirectionalListenable} from './listenable';

type ChangeHandlerResult<T> = { newValue: T };
type ChangeHandler<T> = (value: T|null) => boolean|null|undefined|void|ChangeHandlerResult<T>;

export class BidirectionalValue<T> extends ObservableValue<T> implements BidirectionalListenable<T|null> {
    constructor(private changeHandler: ChangeHandler<T>, value?: T | null) {
        super(value);
    }

    requestUpdate(newValue: T|null) {
        const handlerResult = this.changeHandler(newValue);

        if (handlerResult === undefined || handlerResult === null || handlerResult === true) {
            this.setValue(newValue);
        } else if ((<ChangeHandlerResult<T>>handlerResult).newValue !== undefined) {
            this.setValue((<ChangeHandlerResult<T>>handlerResult).newValue);
        }
    }
}