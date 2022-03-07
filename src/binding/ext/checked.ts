import {DefaultBindingRegistry} from '../registry';
import {DomElement} from '../../view';
import {Listenable} from '../../reactive';
import {AbstractBidirectionalConnector} from '../../view/connectors/abstract';
import {BidirectionalListenable} from '../../reactive';

export type CheckedValue = (BidirectionalListenable<boolean|null>)|(Listenable<boolean|null>)|boolean|null;

DefaultBindingRegistry.prototype['$checked'] = (element: DomElement, bindingArgs: unknown) => {
    return new AbstractBidirectionalConnector(
        <CheckedValue> bindingArgs,
        element,
        (elem: DomElement) => elem.isChecked(),
        (elem: DomElement, value: boolean|null) => elem.setChecked(!!value),
        'change'
    )
};

declare module '../../view/jsx/default-intrinsic-element' {
    interface DefaultIntrinsicElements {
        $checked?: CheckedValue
    }
}