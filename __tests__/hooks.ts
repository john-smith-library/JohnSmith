import {HtmlDefinition, RenderingContext, View} from '../src/view';
import {OnBeforeInit, StandardHook} from '../src/view/hooks';

describe('onBeforeInit', () => {
    class ViewModel {}

    class ApplicationView implements View<ViewModel>, OnBeforeInit<ViewModel> {
        template(viewModel: ViewModel): HtmlDefinition {
            return JS.d('div');
        }

        onBeforeInit(viewModel: ViewModel, context: RenderingContext) {

        }
    }
});