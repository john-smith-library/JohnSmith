/**
 * @module view
 */
 
import {DomElement} from "./element";
import {ViewDefinition} from "./view-definition";
import {Disposable} from "../common";

export interface ViewRenderer {
    /**
     * Renders a view into a DOM element and returns rendered disposable instance.
     *
     * @param element - the DOM element to render to
     * @param view - the view definition to render
     * @param viewModel - the view model instance
     */
    render<ViewModel>(
        element: DomElement,
        view: ViewDefinition<ViewModel>,
        viewModel: ViewModel): Disposable;
}
