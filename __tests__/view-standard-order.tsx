import { setupAppContainerAndRender } from './_helpers';
import { HtmlDefinition, View } from '../src/view';
import { Value } from '../src/view/components';
import '../src/view/jsx';

class ViewModel {
  constructor() {}
}

class NestedView implements View {
  constructor(private readonly viewModel: ViewModel) {}

  public template(): HtmlDefinition {
    return <span>View</span>;
  }
}

class ApplicationView implements View {
  constructor(private viewModel: ViewModel) {}

  public template(): HtmlDefinition {
    return (
      <section>
        <h1>Header</h1>
        <Value view={NestedView} model={this.viewModel}></Value>
        <footer>Footer</footer>
      </section>
    );
  }
}

describe('view with siblings', () => {
  it(
    'should preserve order',
    setupAppContainerAndRender(ApplicationView, new ViewModel(), container => {
      expect(container.innerHTML).toBe(
        '<section><h1>Header</h1><span>View</span><footer>Footer</footer></section>'
      );
    })
  );
});
