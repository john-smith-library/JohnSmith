import {
  expectedSingleElement,
  noComments,
  setupAppContainerAndRender,
} from './_helpers';
import { List, Value } from '../src/view/components';
import { ObservableList } from '../src/reactive';
import '@testing-library/jest-dom';
import '../src/view/jsx';

class ViewModel {
  items: ObservableList<string>;

  constructor(items: string[]) {
    this.items = new ObservableList<string>(items);
  }
}

const ItemView = (viewModel: string) => <li>{viewModel}</li>;

const ListView = (viewModel: ViewModel) => (
  <ul>
    <List view={ItemView} model={viewModel.items} />
  </ul>
);

it(
  'should render initial value',
  setupAppContainerAndRender(
    ListView,
    new ViewModel(['initial 1', 'initial 2']),
    container => {
      expect(noComments(container.innerHTML)).toBe(
        '<ul><li>initial 1</li><li>initial 2</li></ul>'
      );
    }
  )
);

it(
  'should update on add',
  setupAppContainerAndRender(
    ListView,
    new ViewModel(['1', '2']),
    (container, viewModel) => {
      viewModel.items.add('3');
      expect(noComments(container.innerHTML)).toBe(
        '<ul><li>1</li><li>2</li><li>3</li></ul>'
      );
    }
  )
);

it(
  'should update on set',
  setupAppContainerAndRender(
    ListView,
    new ViewModel(['1', '2']),
    (container, viewModel) => {
      viewModel.items.setValue(['3']);
      expect(noComments(container.innerHTML)).toBe('<ul><li>3</li></ul>');
    }
  )
);

it(
  'should update on remove',
  setupAppContainerAndRender(
    ListView,
    new ViewModel(['1', '2', '3']),
    (container, viewModel) => {
      viewModel.items.remove('2');
      expect(noComments(container.innerHTML)).toBe(
        '<ul><li>1</li><li>3</li></ul>'
      );
    }
  )
);

it(
  'should clean on clear',
  setupAppContainerAndRender(
    ListView,
    new ViewModel(['1', '2', '3']),
    (container, viewModel) => {
      viewModel.items.clear();

      const ul = expectedSingleElement(container, 'ul');

      expect(ul).toBeEmptyDOMElement();
    }
  )
);

it(
  'should clean listeners on dispose',
  setupAppContainerAndRender(
    ListView,
    new ViewModel(['1', '2', '3']),
    (container, viewModel, view) => {
      expect(viewModel.items.getPartialListenersCount()).toBeGreaterThan(0);
      view.dispose();
      expect(viewModel.items.getPartialListenersCount()).toBe(0);
    }
  )
);

it(
  'continues rendering new items after clear (regression)',
  setupAppContainerAndRender(
    ListView,
    new ViewModel(['1', '2', '3']),
    (container, viewModel) => {
      viewModel.items.clear();
      viewModel.items.add('5');

      expect(noComments(container.innerHTML)).toBe('<ul><li>5</li></ul>');
    }
  )
);

describe('List/Value composition', () => {
  const TestView = (vm: ViewModel) => (
    // Please note the view we define here
    // It uses Value component as a direct root of the List view.
    // With this setup there are no physical DOM elements between
    // two components definitions (Value comes right under List).
    <List
      view={item => <Value view={x => <li>{x}</li>} model={item}></Value>}
      model={vm.items}
    ></List>
  );

  it(
    'renders single initial value',
    setupAppContainerAndRender(TestView, new ViewModel(['1']), container => {
      expect(noComments(container.innerHTML)).toBe('<li>1</li>');
    })
  );

  it(
    'renders single initial values in order',
    setupAppContainerAndRender(
      TestView,
      new ViewModel(['1', '2']),
      container => {
        expect(noComments(container.innerHTML)).toBe('<li>1</li><li>2</li>');
      }
    )
  );

  it(
    'renders initial values',
    setupAppContainerAndRender(
      TestView,
      new ViewModel(['1', '2', '3']),
      container => {
        expect(noComments(container.innerHTML)).toBe(
          '<li>1</li><li>2</li><li>3</li>'
        );
      }
    )
  );

  it(
    'continues rendering new items after clear with root Value (regression)',
    setupAppContainerAndRender(
      TestView,
      new ViewModel(['1', '2', '3']),
      (container, viewModel) => {
        console.log(container.innerHTML);
        viewModel.items.clear();
        viewModel.items.add('5');

        expect(noComments(container.innerHTML)).toBe('<li>5</li>');
      }
    )
  );
});
