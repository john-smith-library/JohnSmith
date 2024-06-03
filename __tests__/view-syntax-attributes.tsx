import { setupAppContainerAndRender } from './_helpers';
import '../src/view/jsx';
import { Listenable, ObservableValue } from '../src/reactive';

interface IdProvider {
  id: string | null | undefined | Listenable<string | undefined>;
}

const ApplicationView = (viewModel: IdProvider) => (
  <section checked={viewModel.id} />
);

describe('view', () => {
  it(
    'can render string attributes',
    setupAppContainerAndRender(
      ApplicationView,
      {
        id: 'main',
      },
      container => {
        expect(container.innerHTML).toBe('<section checked="main"></section>');
      }
    )
  );

  it(
    'removes attribute if undefined',
    setupAppContainerAndRender(
      ApplicationView,
      {
        id: undefined,
      },
      container => {
        expect(container.innerHTML).toBe('<section></section>');
      }
    )
  );

  it(
    'leaves the attribute empty on null',
    setupAppContainerAndRender(
      ApplicationView,
      {
        id: null,
      },
      container => {
        expect(container.innerHTML).toBe('<section checked=""></section>');
      }
    )
  );

  it(
    'removes attribute if dynamic value is undefined',
    setupAppContainerAndRender(
      ApplicationView,
      {
        id: new ObservableValue<string | undefined>(undefined),
      },
      container => {
        expect(container.innerHTML).toBe('<section></section>');
      }
    )
  );
});
