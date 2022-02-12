import {RenderingContext, ViewDefinition} from "../view-definition";
import {Listenable} from "../../reactive";
import {ViewComponent} from "../view-component";
import {DomElement} from "../element";
import {ViewRenderer} from "../view-renderer";
import {Disposable} from "../../common";
import {ObservableListViewConnector } from "../connectors";

export interface ListData<T> {
    view: ViewDefinition<T>;
    model: T[]|Listenable<T[]|null>|null;
}

export class List<T> implements ViewComponent<ListData<T>> {
    data: ListData<T>;

    constructor(data: ListData<T>) {
        this.data = data;
    }

    $$createBinding(parent: DomElement, renderer: ViewRenderer, renderingContext: RenderingContext): Disposable {
        return new ObservableListViewConnector(this.data.model, parent, this.data.view, renderer, renderingContext);
    }
}
