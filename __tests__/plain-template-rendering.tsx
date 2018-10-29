import {Application} from "../src/application";
import {HtmlDefinition, View} from "../src/dom";
import {setupAppContainer} from './_helpers';
import '../src/jsx';

class ApplicationView implements View<{}>{
    template(viewModel: {}): HtmlDefinition {
        return <div>John Smith</div>;
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