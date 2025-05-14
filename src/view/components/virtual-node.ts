import { HtmlDefinition, ViewDefinition } from '../view-definition';
import { ViewComponent } from '../view-component';
import { Disposable, Owner } from '../../common';
import { DomEngine } from '../dom-engine';
import { DomMarker } from '../element';
import { ViewRenderer } from '../view-renderer';

export interface VirtualNodeData {
  children: HtmlDefinition[];
}

export class VirtualNode implements ViewComponent<VirtualNodeData> {
  constructor(public data: VirtualNodeData) {}

  markerId = 'virtual';

  public $$createBinding(
    placeholder: DomMarker,
    renderer: ViewRenderer,
    domEngine: DomEngine
  ): Disposable {
    const owner = new Owner();
    const items = this.data.children;

    const placeholders: DomMarker[] = [placeholder];
    for (let i = 1; i < items.length; i++) {
      placeholders[i] = domEngine.createMarkerElement('virtual-node-' + i);
      placeholders[i - 1].insertAfter(placeholders[i]);
    }

    for (let i = 0; i < items.length; i++) {
      const virtualView: ViewDefinition<null> = () => items[i];

      const renderedVirtualItem = renderer.render(
        placeholders[i],
        virtualView,
        null
      );

      owner.own(renderedVirtualItem);
    }

    return owner;
  }
}
