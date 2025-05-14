import {
  expectedSingleElement,
  noComments,
  setupAppContainerAndRender,
} from './_helpers';
import { HtmlDefinition, View } from '../src/view';
import { VirtualNode } from '../src/view/components/virtual-node';
import { Value, List } from '../src/view/components';
import '../src/view/jsx';
import '@testing-library/jest-dom';

class ViewModel {}

class ApplicationView implements View {
  constructor(private viewModel: ViewModel) {}

  public template(): HtmlDefinition {
    return (
      <VirtualNode
        children={[<section>Section 1</section>, <section>Section 2</section>]}
      ></VirtualNode>
    );
  }
}

describe('multiple roots static html', () => {
  it(
    'should render',
    setupAppContainerAndRender(ApplicationView, new ViewModel(), container => {
      expect(container.children.length).toBe(2);
      expect(container).toContainHTML('<section>Section 1</section>');
      expect(container).toContainHTML('<section>Section 2</section>');
    })
  );
});

class ApplicationViewMixedNodes implements View {
  constructor(private viewModel: ViewModel) {}

  public template(): HtmlDefinition {
    return (
      <VirtualNode
        children={[
          <section>Section 1</section>,
          <Value
            view={text => <section>{text}</section>}
            model={'Test'}
          ></Value>,
          <section>Section 3</section>,
        ]}
      ></VirtualNode>
    );
  }
}

describe('multiple roots mixed nodes', () => {
  it(
    'should render',
    setupAppContainerAndRender(
      ApplicationViewMixedNodes,
      new ViewModel(),
      container => {
        // expect(container.children.length).toBe(3);
        expect(container).toContainHTML('<section>Section 1</section>');
        expect(container).toContainHTML('<section>Test</section>');
        expect(container).toContainHTML('<section>Section 3</section>');
      }
    )
  );
});

const MultipleRootTable = (viewModel: ViewModel) => (
  <table>
    <tbody data-testid="tbody">
      <List
        view={number => (
          <VirtualNode
            children={[
              <tr>
                <td>{number}</td>
              </tr>,
              <tr>
                <td>The number is {number}</td>
              </tr>,
            ]}
          ></VirtualNode>
        )}
        model={[1, 2, 3]}
      ></List>
    </tbody>
  </table>
);

describe('multiple roots table', () => {
  it(
    'should render',
    setupAppContainerAndRender(
      MultipleRootTable,
      new ViewModel(),
      container => {
        const table = expectedSingleElement(container, 'table');
        const tbody = expectedSingleElement(table, 'tbody');

        expect(tbody.children.length).toBe(6);

        expect(noComments(tbody.innerHTML)).toBe(
          '<tr><td>1</td></tr><tr><td>The number is 1</td></tr>' +
            '<tr><td>2</td></tr><tr><td>The number is 2</td></tr>' +
            '<tr><td>3</td></tr><tr><td>The number is 3</td></tr>'
        );
      }
    )
  );
});
