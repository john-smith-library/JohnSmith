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
        return <div $class={viewModel.status}></div>;
    }
}

class ApplicationViewWithCustomClasses implements View<ViewModel>{
    template(viewModel: ViewModel){
        return <div class="app" $class={viewModel.status}></div>;
    }
}

it('should render initial class attribute',
    setupAppContainerAndRender(ApplicationView, new ViewModel('active'),(container, viewModel) => {
        expect(container.innerHTML).toBe('<div class="active"></div>');
    }));

it('should update on change',
    setupAppContainerAndRender(ApplicationView, new ViewModel('active'),(container, viewModel) => {
        viewModel.status.setValue('new');
        expect(container.innerHTML).toBe('<div class="new"></div>');
    }));

it('should overwrite existing classes',
    setupAppContainerAndRender(ApplicationViewWithCustomClasses, new ViewModel('active'),(container, viewModel) => {
        expect(container.innerHTML).toBe('<div class="active"></div>');
    }));

it('should clear on null',
    setupAppContainerAndRender(ApplicationView, new ViewModel('active'),(container, viewModel) => {
        viewModel.status.setValue(null);
        expect(container.innerHTML).toBe('<div class=""></div>');
    }));