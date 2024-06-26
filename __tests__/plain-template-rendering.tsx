import { Application } from '../src/application';
import { HtmlDefinition } from '../src/view';
import { setupAppContainer } from './_helpers';
import '../src/view/jsx';

const ApplicationView = (): HtmlDefinition => <div>John Smith</div>;

const ApplicationViewWithAttributes = (): HtmlDefinition => (
  <div id="appRoot" class="app-container">
    John Smith
  </div>
);

const ApplicationViewWithNestedMarkup = (): HtmlDefinition => (
  <div>
    <h1>
      <b>John Smith</b>
    </h1>
  </div>
);

const ApplicationViewWithNoValueAttribute = (): HtmlDefinition => (
  <input type="checkbox" checked />
);

const ApplicationViewFunction = () => <div>John Smith Function</div>;

it(
  'should render',
  setupAppContainer(container => {
    new Application().render('app', ApplicationView, {});
    expect(container.innerHTML).toBe('<div>John Smith</div>');
  }, 'app')
);

it(
  'should allow passing target as HTMLElement',
  setupAppContainer(container => {
    new Application().render(container, ApplicationView, {});
    expect(container.innerHTML).toBe('<div>John Smith</div>');
  })
);

it(
  'should allow function as a view',
  setupAppContainer(container => {
    new Application().render(container, ApplicationViewFunction, {});
    expect(container.innerHTML).toBe('<div>John Smith Function</div>');
  })
);

it(
  'should apply attributes',
  setupAppContainer(container => {
    const view = new Application().render(
      container,
      ApplicationViewFunction,
      {}
    );
    view.dispose();

    expect(container.innerHTML).toBe('');
  })
);

it(
  'should render nested markup',
  setupAppContainer(container => {
    new Application().render(container, ApplicationViewWithNestedMarkup, {});
    expect(container.innerHTML).toBe('<div><h1><b>John Smith</b></h1></div>');
  })
);

it(
  'should render nested self-closing tg',
  setupAppContainer(container => {
    new Application().render(container, () => <article />, {});
    expect(container.innerHTML).toBe('<article></article>');
  })
);

it(
  'should clean on dispose',
  setupAppContainer(container => {
    new Application().render(container, ApplicationViewWithAttributes, {});

    expect(container.innerHTML).toBe(
      '<div id="appRoot" class="app-container">John Smith</div>'
    );
  })
);

it(
  'should respect no-value attributes',
  setupAppContainer(container => {
    new Application().render(
      container,
      ApplicationViewWithNoValueAttribute,
      {}
    );

    expect(document.getElementsByTagName('input')[0].checked).toBeTruthy();
  })
);
