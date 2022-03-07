import {ObservableValue} from '../src/reactive';
import {setupAppContainerAndRender} from './_helpers';
import '../src/view/jsx';

class ViewModel {
    status: ObservableValue<string|null>;

    constructor(status: string|null) {
        this.status = new ObservableValue<string|null>(status);
    }
}

const ApplicationView = (viewModel: ViewModel) => <div class={viewModel.status}/>;

it('should render initial class attribute',
    setupAppContainerAndRender(ApplicationView, new ViewModel('active'),(container, viewModel) => {
        expect(container.innerHTML).toBe('<div class="active"></div>');
    }));

it('should update class attribute',
    setupAppContainerAndRender(ApplicationView, new ViewModel('active'),(container, viewModel) => {
        viewModel.status.setValue('updated');
        expect(container.innerHTML).toBe('<div class="updated"></div>');
    }));

it('should set attribute to empty on null',
    setupAppContainerAndRender(ApplicationView, new ViewModel('active'),(container, viewModel) => {
        viewModel.status.setValue(null);
        expect(container.innerHTML).toBe('<div class=""></div>');
    }));

it('should clean listeners on dispose',
    setupAppContainerAndRender(ApplicationView, new ViewModel('active'),(container, viewModel, view) => {
        expect(viewModel.status.getListenersCount()).toBeGreaterThan(0);
        view.dispose();
        expect(viewModel.status.getListenersCount()).toBe(0);
    }));
