import {ObservableValue} from '../src/reactive';
import {setupAppContainerAndRender} from './_helpers';
import {View} from '../src/view';
//import '../src/view/jsx';

class ViewModel {
    message = new ObservableValue<string>('initial');
}

class ViewModelWithStatic extends ViewModel {
    static = 'static string';
}

class TestView implements View<ViewModel>{
    template(viewModel: ViewModel){
        return <div>{viewModel.message}</div>;
    }
}

class TestViewWithStatic implements View<ViewModelWithStatic>{
    template(viewModel: ViewModelWithStatic){
        return <div>Message1: {viewModel.message}, message2: {viewModel.static}</div>;
    }
}

it('should render initial value',
   setupAppContainerAndRender(TestView, new ViewModel(),(container, viewModel) => {
       expect(container.innerHTML).toBe('<div>initial</div>');
}));

it('should update on change',
   setupAppContainerAndRender(TestView, new ViewModel(),(container, viewModel) => {
       viewModel.message.setValue('updated');
       expect(container.innerHTML).toBe('<div>updated</div>');
}));

it('can mix text, static variables and observable inside a single element',
   setupAppContainerAndRender(TestViewWithStatic, new ViewModelWithStatic(),(container, viewModel) => {
       viewModel.message.setValue('updated');
       expect(container.innerHTML).toBe('<div>Message1: updated, message2: static string</div>');
}));

it('should clean listeners on dispose',
    setupAppContainerAndRender(TestView, new ViewModel(),(container, viewModel, view) => {
        expect(viewModel.message.getListenersCount()).toBeGreaterThan(0);
        view.dispose();
        expect(viewModel.message.getListenersCount()).toBe(0);
    }));