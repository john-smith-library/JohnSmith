import {ObservableValue} from '../src/reactive';
import {setupAppContainerAndRender} from './_helpers';
import {View} from '../src/dom';
import '../src/jsx';

class ViewModel {
    status: ObservableValue<string>;

    constructor(status: string|null) {
        this.status = new ObservableValue<string>(status);
    }
}

class ApplicationView implements View<ViewModel>{
    template(viewModel: ViewModel){
        return <div class={viewModel.status}></div>;
    }
}

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