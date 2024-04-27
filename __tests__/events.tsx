import { setupAppContainerAndRender } from './_helpers';
import { View } from '../src/view';
import '../src/view/jsx';

class ViewModel {
  constructor(public callback: () => void) {}
}

const ApplicationView = (viewModel: ViewModel) => (
  <a _click={viewModel.callback}>{viewModel}</a>
);

class ApplicationViewDoubleUnderscore implements View {
  constructor(private viewModel: ViewModel) {}

  public template() {
    return <a __click={this.viewModel.callback}>{this.viewModel}</a>;
  }
}

describe('single underscore', () => {
  it(
    'should call',
    setupAppContainerAndRender(
      ApplicationView,
      new ViewModel(jest.fn()),
      (container, viewModel) => {
        const anchor = container.getElementsByTagName('a')[0];
        dispatchClick(anchor);

        expect(viewModel.callback).toHaveBeenCalled();
      }
    )
  );

  it(
    'should use vm as context',
    setupAppContainerAndRender(
      ApplicationView,
      new ViewModel(assertContextIsVm),
      container => {
        const anchor = container.getElementsByTagName('a')[0];
        dispatchClick(anchor);
      }
    )
  );

  it(
    'remove listener on view dispose',
    setupAppContainerAndRender(
      ApplicationView,
      new ViewModel(jest.fn()),
      (container, viewModel, view) => {
        const anchor = container.getElementsByTagName('a')[0];

        view.dispose();
        dispatchClick(anchor);

        expect(viewModel.callback).toHaveBeenCalledTimes(0);
      }
    )
  );
});

describe('double underscore', () => {
  it(
    'should call',
    setupAppContainerAndRender(
      ApplicationViewDoubleUnderscore,
      new ViewModel(jest.fn()),
      (container, viewModel) => {
        const anchor = container.getElementsByTagName('a')[0];
        dispatchClick(anchor);

        expect(viewModel.callback).toHaveBeenCalled();
      }
    )
  );

  it(
    'should use view as context',
    setupAppContainerAndRender(
      ApplicationViewDoubleUnderscore,
      new ViewModel(assertContextIsView),
      container => {
        const anchor = container.getElementsByTagName('a')[0];
        dispatchClick(anchor);
      }
    )
  );

  it(
    'remove listener on view dispose',
    setupAppContainerAndRender(
      ApplicationViewDoubleUnderscore,
      new ViewModel(jest.fn()),
      (container, viewModel, view) => {
        const anchor = container.getElementsByTagName('a')[0];

        view.dispose();
        dispatchClick(anchor);

        expect(viewModel.callback).toHaveBeenCalledTimes(0);
      }
    )
  );
});

function dispatchClick(element: HTMLElement) {
  const event = new MouseEvent('click');
  element.dispatchEvent(event);
}

function assertContextIsVm() {
  expect(this).toBeDefined();
  expect(this).toBeInstanceOf(ViewModel);
}

function assertContextIsView() {
  expect(this).toBeDefined();
  expect(this).toBeInstanceOf(ApplicationViewDoubleUnderscore);
}
