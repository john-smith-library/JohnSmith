import { noComments, setupAppContainerAndRender } from './_helpers';
import { HtmlDefinition, View } from '../src/view';
import { Value } from '../src/view/components/value';
import '../src/view/jsx';

class ViewModel {}

class InnerView implements View {
  constructor(private viewModel: ViewModel) {}

  public template(): HtmlDefinition {
    return <span>inner</span>;
  }
}

class ApplicationView implements View {
  constructor(private viewModel: ViewModel) {}

  public template(): HtmlDefinition {
    return <Value model={this.viewModel} view={InnerView} />;
  }
}

describe('view', () => {
  it(
    'can render nested view as a root',
    setupAppContainerAndRender(ApplicationView, new ViewModel(), container => {
      expect(noComments(container.innerHTML)).toBe('<span>inner</span>');
    })
  );
});
