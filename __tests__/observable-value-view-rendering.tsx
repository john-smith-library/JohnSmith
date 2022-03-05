import {ObservableValue} from '../src/reactive';
import {setupAppContainerAndRender} from './_helpers';
import {Value} from '../src/view/components/value';
import '../src/view/jsx';

class PersonViewModel {
    constructor(
        public readonly firstName: string,
        public readonly lastName: string) {
    }
}

class ApplicationViewModel {
    person: ObservableValue<PersonViewModel|null>;

    constructor(person: PersonViewModel|null) {
        this.person = new ObservableValue<PersonViewModel|null>(person);
    }
}

const PersonView = (viewModel: PersonViewModel) =>
    <article>{viewModel.firstName} {viewModel.lastName}</article>;

const ApplicationView = (viewModel: ApplicationViewModel) =>
    <div>
        <Value view={PersonView} model={viewModel.person}/>
    </div>;

const JOHN_SMITH = new PersonViewModel('John', 'Smith');
const FRED_BLOGGS = new PersonViewModel('Fred', 'Bloggs');

it('should render initial value',
    setupAppContainerAndRender(ApplicationView, new ApplicationViewModel(JOHN_SMITH),(container, viewModel) => {
        expect(container.innerHTML).toBe('<div><article>John Smith</article></div>');
    }));

it('should update on change',
    setupAppContainerAndRender(ApplicationView, new ApplicationViewModel(JOHN_SMITH),(container, viewModel) => {
        viewModel.person.setValue(FRED_BLOGGS);
        expect(container.innerHTML).toBe('<div><article>Fred Bloggs</article></div>');
    }));

it('should be empty on null',
    setupAppContainerAndRender(ApplicationView, new ApplicationViewModel(null),(container, viewModel) => {
        expect(container.innerHTML).toBe('<div></div>');
    }));

