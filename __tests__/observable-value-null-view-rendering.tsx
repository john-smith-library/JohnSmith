import { ObservableValue } from '../src/reactive';
import { setupAppContainerAndRender } from './_helpers';
import { Null } from '../src/view/components';
import '@testing-library/jest-dom';
import '../src/view/jsx';

class ApplicationViewModel {
  person: ObservableValue<string | null>;

  constructor(person: string | null) {
    this.person = new ObservableValue<string | null>(person);
  }
}

const ApplicationView = (viewModel: ApplicationViewModel) => (
  <div>
    <Null view={() => <p>No data</p>} model={viewModel.person} />
  </div>
);

it(
  'should render nothing if value exists',
  setupAppContainerAndRender(
    ApplicationView,
    new ApplicationViewModel('John'),
    container => {
      expect(container.firstElementChild).toBeEmptyDOMElement();
    }
  )
);

it(
  'should render view if value is null',
  setupAppContainerAndRender(
    ApplicationView,
    new ApplicationViewModel(null),
    container => {
      expect(container.innerHTML).toBe('<div><p>No data</p></div>');
    }
  )
);
