import { setupAppContainerAndRender } from './_helpers';
import { HtmlDefinition, View } from '../src/view';
import { Disposable } from '../src/common';
import '../src/view/jsx';

class ViewModel {
  constructor(public dispose: () => void) {}
}

class ApplicationView implements View, Disposable {
  constructor(private viewModel: ViewModel, ) {}

  public template(): HtmlDefinition {
    return <section>View</section>;
  }

  public dispose() {
    this.viewModel.dispose();
  }
}

describe('view with dispose', () => {
  it(
    'dispose called after unrender',
    setupAppContainerAndRender(ApplicationView, new ViewModel(jest.fn()), (container, viewModel, view) => {
      view.dispose();
      expect(viewModel.dispose).toHaveBeenCalled();
    })
  );
});
