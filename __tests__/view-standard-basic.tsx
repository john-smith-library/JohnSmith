import { setupAppContainerAndRender } from './_helpers';
import { HtmlDefinition, View } from '../src/view';
import '../src/view/jsx';

class ViewModel {
  constructor() {}
}

class ApplicationView implements View {
  constructor(private viewModel: ViewModel) {}

  public template(): HtmlDefinition {
    return <section>View</section>;
  }
}

describe('view', () => {
  it(
    'renders markup',
    setupAppContainerAndRender(ApplicationView, new ViewModel(), container => {
      expect(container.innerHTML).toBe('<section>View</section>');
    })
  );
});
