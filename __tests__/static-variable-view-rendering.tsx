import {ObservableValue} from '../src/reactive';
import {setupAppContainerAndRender} from './_helpers';
import {View} from '../src/dom';
import '../src/jsx';

class Person {
    constructor(
        public readonly firstName: string,
        public readonly lastName: string) {
    }
}

class ApplicationViewModel {
    constructor(public readonly person: Person|null) {
    }
}

class PersonView implements View<Person>{
    template(viewModel: Person){
        return <article>{viewModel.firstName} {viewModel.lastName}</article>;
    }
}

class ApplicationView implements View<ApplicationViewModel>{
    template(viewModel: ApplicationViewModel){
        return <div><PersonView>{viewModel.person}</PersonView></div>;
    }
}

const JOHN_SMITH = new Person('John', 'Smith');

it('should render static value',
    setupAppContainerAndRender(ApplicationView, new ApplicationViewModel(JOHN_SMITH),(container, viewModel) => {
        expect(container.innerHTML).toBe('<div><article>John Smith</article></div>');
    }));

it('should be empty on null',
    setupAppContainerAndRender(ApplicationView, new ApplicationViewModel(null),(container, viewModel) => {
        expect(container.innerHTML).toBe('<div></div>');
    }));

