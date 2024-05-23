import { DomElement, HtmlDefinition, View } from '../src/view';
import { OnBeforeInit } from '../src/view/hooks';
import { setupAppContainerAndRender } from './_helpers';
import { DomEngine } from '../src/view/dom-engine';

import '../src/debugging/includes';
import '../src/view/jsx';
import { OptionalDisposables } from '../src/common';

describe('onBeforeInit', () => {
  class ViewModel {
    constructor(
      public onBeforeInit: (
        host: DomElement,
        root: DomElement | null,
        domEngine: DomEngine
      ) => OptionalDisposables
    ) {}
  }

  class ApplicationView implements View, OnBeforeInit {
    constructor(private viewModel: ViewModel) {}

    public template(): HtmlDefinition {
      return JS.d('div');
    }

    public onBeforeInit(
      host: DomElement,
      root: DomElement | null,
      domEngine: DomEngine
    ) {
      this.viewModel.onBeforeInit(host, root, domEngine);
    }
  }

  class ApplicationViewChangingRootDom implements View, OnBeforeInit {
    public template(): HtmlDefinition {
      return JS.d('div');
    }

    public onBeforeInit(host: DomElement, root: DomElement | null) {
      if (root) {
        root.createClassNames().add('enter');
      }
    }
  }

  it(
    'should be called',
    setupAppContainerAndRender(
      ApplicationView,
      new ViewModel(jest.fn()),
      (container, viewModel) => {
        expect(viewModel.onBeforeInit).toHaveBeenCalled();
      }
    )
  );

  class ApplicationViewChangingHostDom implements View, OnBeforeInit {
    public template(): HtmlDefinition {
      return JS.d('div');
    }

    public onBeforeInit(
      host: DomElement,
      root: DomElement | null,
      domEngine: DomEngine
    ) {
      host.appendChild(domEngine.createTextNode('manual text'));
    }
  }

  it(
    'can modify host DOM',
    setupAppContainerAndRender(
      ApplicationViewChangingHostDom,
      {},
      container => {
        expect(container.innerHTML).toBe('<div></div>manual text');
      }
    )
  );

  it(
    'can modify root DOM',
    setupAppContainerAndRender(
      ApplicationViewChangingRootDom,
      {},
      container => {
        expect(container.innerHTML).toBe('<div class="enter"></div>');
      }
    )
  );
});
