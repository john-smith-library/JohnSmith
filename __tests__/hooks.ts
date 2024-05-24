import { DomElement, HtmlDefinition, View } from '../src/view';
import { OnBeforeInit } from '../src/view/hooks';
import { setupAppContainerAndRender } from './_helpers';
import { DomEngine } from '../src/view/dom-engine';

import '../src/view/jsx';
import { OptionalDisposables } from '../src/common';

describe('onBeforeInit', () => {
  class ViewModel {
    constructor(
      public onBeforeInit: (
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

    public onBeforeInit(root: DomElement | null, domEngine: DomEngine) {
      this.viewModel.onBeforeInit(root, domEngine);
    }
  }

  class ApplicationViewChangingRootDom implements View, OnBeforeInit {
    public template(): HtmlDefinition {
      return JS.d('div');
    }

    public onBeforeInit(root: DomElement | null) {
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
