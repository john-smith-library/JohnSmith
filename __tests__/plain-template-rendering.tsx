import {Application} from "../src/application";
import {HtmlDefinition, View} from "../src/view";
import {setupAppContainer} from './_helpers';

class ApplicationView implements View<{}>{
    template(viewModel: {}): HtmlDefinition {
        return <div>John Smith</div>;
    }
}

class ApplicationViewWithAttributes implements View<{}>{
    template(viewModel: {}): HtmlDefinition {
        return <div id="appRoot" class="app-container">John Smith</div>;
    }
}

class ApplicationViewWithNestedMarkup implements View<{}>{
    template(viewModel: {}): HtmlDefinition {
        return <div><h1><b>John Smith</b></h1></div>;
    }
}

const ApplicationViewFunction = (vm: {}) => <div>John Smith Function</div>;

it('should render', setupAppContainer((container) => {
    new Application().render('app', ApplicationView, {});
    expect(container.innerHTML).toBe('<div>John Smith</div>');
}, 'app'));

it('should allow passing target as HTMLElement', setupAppContainer((container) => {
    new Application().render(container, ApplicationView, {});
    expect(container.innerHTML).toBe('<div>John Smith</div>');
}));

it('should allow function as a view', setupAppContainer((container) => {
    new Application().render(container, ApplicationViewFunction, {});
    expect(container.innerHTML).toBe('<div>John Smith Function</div>');
}));

it('should apply attributes', setupAppContainer((container) => {
    const view = new Application().render(container, ApplicationViewFunction, {});
    view.dispose();

    expect(container.innerHTML).toBe('');
}));

it('should render nested markup', setupAppContainer((container) => {
    new Application().render(container, ApplicationViewWithNestedMarkup, {});
    expect(container.innerHTML).toBe('<div><h1><b>John Smith</b></h1></div>');
}));

it('should render nested self-closing tg',
    setupAppContainer((container) => {
    new Application().render(container, vm => <article/>, {});
    expect(container.innerHTML).toBe('<article></article>');
}));

it('should clean on dispose', setupAppContainer((container) => {
    new Application().render(container, ApplicationViewWithAttributes, {});

    expect(container.innerHTML).toBe('<div id="appRoot" class="app-container">John Smith</div>');
}));