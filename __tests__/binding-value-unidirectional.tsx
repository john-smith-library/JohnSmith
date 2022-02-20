import {HtmlDefinition, View} from '../src/view';
import {ObservableValue} from '../src/reactive';
import {findInput, setupAppContainerAndRender} from './_helpers';
import '../src/view/jsx';

class ViewModel {
    firstName: ObservableValue<string>;

    constructor(firstName: string) {
        this.firstName = new ObservableValue<string>(firstName);
    }
}

const ApplicationView = (viewModel: ViewModel): HtmlDefinition =>
    <form>
        <input id="textInput" $value={viewModel.firstName}/>
    </form>;

it('should render initial value',
    setupAppContainerAndRender(ApplicationView, new ViewModel('John'),(container, viewModel) => {
        expect(findInput('textInput').value).toBe('John');
    }));

it('should update on change',
    setupAppContainerAndRender(ApplicationView, new ViewModel('John'),(container, viewModel) => {
        viewModel.firstName.setValue('New');
        expect(findInput('textInput').value).toBe('New');
    }));

it('should clear on null',
    setupAppContainerAndRender(ApplicationView, new ViewModel('active'),(container, viewModel) => {
        viewModel.firstName.setValue(null);
        expect(findInput('textInput').value).toBe('');
    }));

it('should clean listeners on dispose',
    setupAppContainerAndRender(ApplicationView, new ViewModel('active'),(container, viewModel, view) => {
        expect(viewModel.firstName.getListenersCount()).toBeGreaterThan(0);
        view.dispose();
        expect(viewModel.firstName.getListenersCount()).toBe(0);
    }));
