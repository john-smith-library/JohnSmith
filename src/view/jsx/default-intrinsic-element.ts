import {DomElement} from '../element';
import {Disposable} from '../../common';

export interface DefaultIntrinsicElements {
    $bind?: (domElement: DomElement, viewModel: any) => void|Disposable|(Disposable[]);
}
