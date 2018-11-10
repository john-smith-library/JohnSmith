import {DefaultBindingRegistry} from '../registry';
import {DomElement} from '../../view';
import {Listenable} from '../../reactive';
import {AbstractBidirectionalConnector} from '../../view/connectors/abstract';
import {BidirectionalListenable} from '../../reactive';

DefaultBindingRegistry.prototype['$checked'] = (element: DomElement, bindingArgs: any) => {
    return new AbstractBidirectionalConnector(
        bindingArgs,
        element,
        (elem: DomElement) => elem.isChecked(),
        (elem: DomElement, value: any) => elem.setChecked(!!value),
        'change'
    )
};

declare module '../../view/jsx/default-intrinsic-element' {
    interface DefaultIntrinsicElements {
        $checked?: (BidirectionalListenable<boolean>)|(Listenable<any>)|string
    }
}