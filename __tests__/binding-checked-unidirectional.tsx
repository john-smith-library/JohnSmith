import { HtmlDefinition } from '../src/view';
import { ObservableValue } from '../src/reactive';
import { findInput, setupAppContainerAndRender } from './_helpers';
import '../src/view/jsx';

class ViewModel {
  active: ObservableValue<boolean | null>;

  constructor(initial: boolean) {
    this.active = new ObservableValue<boolean | null>(initial);
  }
}

const ApplicationView = (viewModel: ViewModel): HtmlDefinition => (
  <form>
    <input id="checkboxInput" type="checkbox" $checked={viewModel.active} />
  </form>
);

it(
  'should render initial value',
  setupAppContainerAndRender(ApplicationView, new ViewModel(true), () => {
    expect(findInput('checkboxInput').checked).toBe(true);
  })
);

it(
  'should update on change',
  setupAppContainerAndRender(
    ApplicationView,
    new ViewModel(true),
    (container, viewModel) => {
      viewModel.active.setValue(false);
      expect(findInput('checkboxInput').checked).toBe(false);
    }
  )
);

it(
  'should clear on null',
  setupAppContainerAndRender(
    ApplicationView,
    new ViewModel(true),
    (container, viewModel) => {
      viewModel.active.setValue(null);
      expect(findInput('checkboxInput').checked).toBe(false);
    }
  )
);

it(
  'should clean listeners on dispose',
  setupAppContainerAndRender(
    ApplicationView,
    new ViewModel(true),
    (container, viewModel, view) => {
      expect(viewModel.active.getListenersCount()).toBeGreaterThan(0);
      view.dispose();
      expect(viewModel.active.getListenersCount()).toBe(0);
    }
  )
);
