import {setupAppContainerAndRender} from './_helpers';
import {View} from '../src/view';

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
        return <div><PersonView viewModel={viewModel.person}/></div>;
    }
}

class ApplicationViewNoNestedViewModel implements View<ApplicationViewModel>{
    template(viewModel: ApplicationViewModel){
        return <span><PersonView /></span>;
    }
}

class ApplicationViewWithRootNested implements View<ApplicationViewModel>{
    template(viewModel: ApplicationViewModel){
        return <PersonView viewModel={viewModel.person}/>;
    }
}

const JOHN_SMITH = new Person('John', 'Smith');

it('should render static value',
    setupAppContainerAndRender(ApplicationView, new ApplicationViewModel(JOHN_SMITH),(container) => {
        expect(container.innerHTML).toBe('<div><article>John Smith</article></div>');
    }));

it('nested view can be the root',
    setupAppContainerAndRender(ApplicationViewWithRootNested, new ApplicationViewModel(JOHN_SMITH),(container) => {
        expect(container.innerHTML).toBe('<article>John Smith</article>');
    }));

it('should be empty on null',
    setupAppContainerAndRender(ApplicationView, new ApplicationViewModel(null),(container) => {
        expect(container.innerHTML).toBe('<div></div>');
    }));

it('should be empty if no viewModel provided',
    setupAppContainerAndRender(ApplicationViewNoNestedViewModel, new ApplicationViewModel(null),(container) => {
        expect(container.innerHTML).toBe('<span></span>');
    }));

