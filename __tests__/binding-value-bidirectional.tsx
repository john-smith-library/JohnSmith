import { HtmlDefinition } from '../src/view';
import { ObservableValue } from '../src/reactive';
import {
  dispatchChange,
  findInput,
  setupAppContainerAndRender,
} from './_helpers';
import { BidirectionalValue, ChangeHandler } from '../src/reactive';
import '../src/view/jsx';

class ViewModel {
  firstName: ObservableValue<string | null>;

  constructor(
    public callback: ChangeHandler<string | null>,
    firstName: string | null = null
  ) {
    this.firstName = new BidirectionalValue<string | null>(callback, firstName);
  }
}

const ApplicationView = (viewModel: ViewModel): HtmlDefinition => (
  <form>
    <input id="textInput" $value={viewModel.firstName} />
  </form>
);

it(
  'should update source on input change',
  setupAppContainerAndRender(
    ApplicationView,
    new ViewModel(() => {}),
    (container, viewModel) => {
      const input = findInput('textInput');

      input.value = 'John';

      dispatchChange(input);

      expect(viewModel.firstName.getValue()).toBe('John');
    }
  )
);
