import { ObservableValue } from '../src/reactive';
import { setupAppContainerAndRender } from './_helpers';
import '../src/view/jsx';

class ViewModel {
  content: ObservableValue<string | null>;

  constructor(content: string | null) {
    this.content = new ObservableValue<string | null>(content);
  }
}

const ApplicationView = (viewModel: ViewModel) => (
  <div $innerHTML={viewModel.content} />
);

it(
  'should render initial markup',
  setupAppContainerAndRender(
    ApplicationView,
    new ViewModel('<b>markup</b>'),
    container => {
      expect(container.innerHTML).toBe('<div><b>markup</b></div>');
    }
  )
);

it(
  'should update on change',
  setupAppContainerAndRender(
    ApplicationView,
    new ViewModel('active'),
    (container, viewModel) => {
      viewModel.content.setValue('<b>updated</b>');
      expect(container.innerHTML).toBe('<div><b>updated</b></div>');
    }
  )
);

it(
  'should clear on null',
  setupAppContainerAndRender(
    ApplicationView,
    new ViewModel('active'),
    (container, viewModel) => {
      viewModel.content.setValue(null);
      expect(container.innerHTML).toBe('<div></div>');
    }
  )
);

it(
  'should clean listeners on dispose',
  setupAppContainerAndRender(
    ApplicationView,
    new ViewModel('active'),
    (container, viewModel, view) => {
      expect(viewModel.content.getListenersCount()).toBeGreaterThan(0);
      view.dispose();
      expect(viewModel.content.getListenersCount()).toBe(0);
    }
  )
);
