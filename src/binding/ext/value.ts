import {DefaultBindingRegistry} from '../registry';
import {DomElement} from '../../view';
import {Listenable} from '../../reactive';
import {AbstractBidirectionalConnector} from '../../view/connectors/abstract';
import {BidirectionalListenable} from '../../reactive';

export type BidirectionalConfig = [BidirectionalListenable<string>, string];

DefaultBindingRegistry.prototype['$value'] = (element: DomElement, bindingArgs: any) => {
    const { event, source } = bindingArgs && (<BidirectionalConfig>bindingArgs).length === 2 ?
        { event: (<BidirectionalConfig>bindingArgs)[1], source: (<BidirectionalConfig>bindingArgs)[0] } :
        { event: 'change', source: bindingArgs };

    return new AbstractBidirectionalConnector(
        source,
        element,
        (elem: DomElement) => elem.getValue(),
        (elem: DomElement, value: string | null) => elem.setValue(value === null ? '' : value),
        event
    )
};

declare module '../../view/jsx/default-intrinsic-element' {
    interface DefaultIntrinsicElements {
        $value?: (BidirectionalListenable<string>)|(Listenable<string|null>)|string|([BidirectionalListenable<string|null>, string])
    }
}
