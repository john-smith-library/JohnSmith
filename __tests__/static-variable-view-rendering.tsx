import {setupAppContainerAndRender} from './_helpers';
import {View} from '../src/view';
import {Value} from '../src/view/components/value';

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

const PersonView = (viewModel: Person) =>
    <article>{viewModel.firstName} {viewModel.lastName}</article>;

const ApplicationView = (viewModel: ApplicationViewModel) =>
    <div>
        <Value view={PersonView} model={viewModel.person} />
    </div>;

const ApplicationViewNoNestedViewModel = (viewModel: ApplicationViewModel) =>
    <span>
        <Value view={PersonView} model={null}/>
    </span>;

const ApplicationViewWithRootNested = (viewModel: ApplicationViewModel) =>
    <Value view={PersonView} model={viewModel.person}/>;

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

