import {ViewDefinition} from "../view-definition";
import {Listenable} from "../../reactive";
import {ViewComponent} from "../view-component";
import {Disposable} from "../../common";
import {DomElement} from "../element";
import {ViewRenderer} from "../view-renderer";
import {NullViewConnector} from "../connectors/null-view-connector";

export interface NullData<T> {
    view: ViewDefinition<void>;
    model: T|Listenable<T|null|undefined>|null|undefined;
}

export class Null<T> implements ViewComponent<NullData<T>> {
    data: NullData<T>;

    constructor(data: NullData<T>) {
        this.data = data;
    }

    $$createBinding(parent: DomElement, renderer: ViewRenderer): Disposable {
        return new NullViewConnector(this.data.model, parent, this.data.view, renderer);
    }
}
