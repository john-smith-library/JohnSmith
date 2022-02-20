import {DomElement, HtmlDefinition, View} from '../src/view';
import {OnBeforeInit} from '../src/view/hooks';
import {setupAppContainerAndRender} from "./_helpers";
import {DomEngine} from "../src/view/dom-engine";

import '../src/debugging/includes';
import '../src/view/jsx';

describe('onBeforeInit', () => {
    class ViewModel {
        constructor(
            public onBeforeInit: any) {
        }
    }

    class ApplicationView implements View, OnBeforeInit {
        constructor(private viewModel: ViewModel) {
        }

        template(): HtmlDefinition {
            return JS.d('div');
        }

        onBeforeInit(host: DomElement, root: DomElement|null, domEngine: DomEngine) {
            this.viewModel.onBeforeInit(host, domEngine);
        }
    }

    class ApplicationViewChangingHostDom implements View, OnBeforeInit {
        constructor() {
        }

        template(): HtmlDefinition {
            return JS.d('div');
        }

        onBeforeInit(host: DomElement, root: DomElement|null, domEngine: DomEngine) {
            host.appendText(domEngine.createTextNode("manual text"));
        }
    }

    class ApplicationViewChangingRootDom implements View, OnBeforeInit {
        constructor() {
        }

        template(): HtmlDefinition {
            return JS.d('div');
        }

        onBeforeInit(host: DomElement, root: DomElement|null, domEngine: DomEngine) {
            if (root)
            {
                root.createClassNames().add('enter');
            }
        }
    }

    it('should be called',
        setupAppContainerAndRender(ApplicationView, new ViewModel(jest.fn()),(container, viewModel, view) => {
            expect(viewModel.onBeforeInit).toBeCalled();
        }));

    it('can modify host DOM',
        setupAppContainerAndRender(
            ApplicationViewChangingHostDom,
            {},
            (container, viewModel, view) => {
                expect(container.innerHTML).toBe('<div></div>manual text')
            }));

    it('can modify root DOM',
        setupAppContainerAndRender(
            ApplicationViewChangingRootDom,
            {},
            (container, viewModel, view) => {
                expect(container.innerHTML).toBe('<div class="enter"></div>')
            }));

});
