import {HtmlDefinition, RenderingContext, View} from '../src/view';
import {OnBeforeInit, StandardHook} from '../src/view/hooks';
import {setupAppContainerAndRender} from "./_helpers";

describe('onBeforeInit', () => {
    class ViewModel {}

    class ApplicationView implements View, OnBeforeInit {
        constructor(viewModel: ViewModel) {
        }

        template(): HtmlDefinition {
            return JS.d('div');
        }

        onBeforeInit = jest.fn();
    }

    it('should be called', () => {
        setupAppContainerAndRender(ApplicationView, new ViewModel(),(container, viewModel, view) => {
            const viewInstance: ApplicationView = <any>view;

            expect(viewInstance.onBeforeInit).toBeCalled();
        })
    });

});
