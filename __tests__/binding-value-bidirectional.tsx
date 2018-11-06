import {HtmlDefinition, View} from '../src/view';
import {ObservableValue} from '../src/reactive';
import {dispatchChange, findInput, setupAppContainerAndRender} from './_helpers';
import {BidirectionalValue, ChangeHandler} from '../src/reactive/bidirectional-value';

class ViewModel {
    firstName: ObservableValue<string>;

    constructor(public callback: ChangeHandler<string>, firstName: string|null = null) {
        this.firstName = new BidirectionalValue<string>(callback, firstName);
    }
}

class ApplicationView implements View<ViewModel> {
    template(viewModel: ViewModel): HtmlDefinition {
        return <form>
            <input id="textInput" $value={viewModel.firstName} />
        </form>;
    }
}

it('should update source on input change',
    setupAppContainerAndRender(ApplicationView, new ViewModel(() => {}),(container, viewModel) => {
        const input = findInput('textInput');

        input.value = 'John';

        dispatchChange(input);

        expect(viewModel.firstName.getValue()).toBe('John');
    }));