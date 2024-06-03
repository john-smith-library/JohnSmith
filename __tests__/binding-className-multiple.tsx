import { ObservableValue } from '../src/reactive';
import { setupAppContainerAndRender } from './_helpers';
import '../src/view/jsx';

class ViewModel {
  public readonly status1: ObservableValue<boolean>;
  public readonly status2: ObservableValue<boolean>;

  constructor(status1: boolean, status2: boolean) {
    this.status1 = new ObservableValue<boolean>(status1);
    this.status2 = new ObservableValue<boolean>(status2);
  }
}

const ApplicationView = (viewModel: ViewModel) => (
  <div
    $className={{
      'status-1': viewModel.status1,
      'status-2': viewModel.status2,
    }}
  />
);

describe('$className with record', () => {
  it(
    'should render initial class attribute',
    setupAppContainerAndRender(
      ApplicationView,
      new ViewModel(true, true),
      container => {
        expect(container.innerHTML).toBe(
          '<div class="status-1 status-2"></div>'
        );
      }
    )
  );

  it(
    'should activate only classes with true value',
    setupAppContainerAndRender(
      ApplicationView,
      new ViewModel(true, false),
      container => {
        expect(container.innerHTML).toBe('<div class="status-1"></div>');
      }
    )
  );

  it(
    'should update on ViewModel mutations',
    setupAppContainerAndRender(
      ApplicationView,
      new ViewModel(true, true),
      (container, viewModel) => {
        viewModel.status2.setValue(false);
        expect(container.innerHTML).toBe('<div class="status-1"></div>');
        viewModel.status1.setValue(false);
        viewModel.status2.setValue(true);
        expect(container.innerHTML).toBe('<div class="status-2"></div>');
      }
    )
  );

  it(
    'supports constant value',
    setupAppContainerAndRender(
      () => <span $className={{ active: true, rounded: false }}></span>,
      undefined,
      container => {
        expect(container.innerHTML).toBe('<span class="active"></span>');
      }
    )
  );
});
