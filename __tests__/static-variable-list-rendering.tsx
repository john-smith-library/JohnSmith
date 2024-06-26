import {
  expectedSingleElement,
  noComments,
  setupAppContainerAndRender,
} from './_helpers';
import { List } from '../src/view/components/list';
import '@testing-library/jest-dom';
import '../src/view/jsx';

class ViewModel {
  constructor(public readonly items: number[] | null) {}
}

const ListItemView = (vm: number) => <li>{vm}</li>;

const ListView = (viewModel: ViewModel) => (
  <ul>
    <List view={ListItemView} model={viewModel.items}></List>
  </ul>
);

it(
  'should render',
  setupAppContainerAndRender(ListView, new ViewModel([1, 2, 3]), container => {
    expect(noComments(container.innerHTML)).toBe(
      '<ul><li>1</li><li>2</li><li>3</li></ul>'
    );
  })
);

it(
  'should render empty if null',
  setupAppContainerAndRender(ListView, new ViewModel(null), container => {
    expect(expectedSingleElement(container, 'ul')).toBeEmptyDOMElement();
  })
);
