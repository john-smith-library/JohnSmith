import {ObservableValue} from '../src/reactive';
import {setupAppContainerAndRender} from './_helpers';

class ViewModel {
    status: ObservableValue<string>;

    constructor(status: string|null) {
        this.status = new ObservableValue<string>(status);
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

it('should remove attribute on null',
    setupAppContainerAndRender(ApplicationView, new ViewModel('active'),(container, viewModel) => {
        viewModel.status.setValue(null);
        expect(container.innerHTML).toBe('<div></div>');
    }));

it('should clean listeners on dispose',
    setupAppContainerAndRender(ApplicationView, new ViewModel('active'),(container, viewModel, view) => {
        expect(viewModel.status.getListenersCount()).toBeGreaterThan(0);
        view.dispose();
        expect(viewModel.status.getListenersCount()).toBe(0);
    }));
