import { DomMarker, DomNode } from './element';
import { ViewDefinition } from './view-definition';
import { Disposable } from '../common';

export interface RenderedView extends Disposable {
  root: DomNode;
}

export interface ViewRenderer {
  /**
   * Renders a view into a DOM element and returns rendered disposable instance.
   *
   * @param placeholder - the DOM element to render to, will be replaced with the View if rendering is successful
   * @param view - the view definition to render
   * @param viewModel - the view model instance
   */
  render<ViewModel>(
    placeholder: DomMarker,
    view: ViewDefinition<ViewModel>,
    viewModel: ViewModel
  ): RenderedView;
}
