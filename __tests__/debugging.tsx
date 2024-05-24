import '../src/debugging/includes';
import '../src/view/jsx';
import '@testing-library/jest-dom';
import { setupAppContainer, setupAppContainerAndRender } from './_helpers';
import { Application } from '../src';
import { Value } from '../src/view/components/value';

const findDebugger = (): Element | null => {
  const debuggerUi = document.getElementsByClassName('js-debugger');

  return debuggerUi.length === 0 ? null : debuggerUi[0];
};

describe('debugger', () => {
  it(
    'should not be available until no errors thrown',
    setupAppContainerAndRender(
      () => <span></span>,
      {},
      container => {
        expect(findDebugger()).toBeNull();
        expect(container.firstElementChild).toContainHTML('<span></span>');
      }
    )
  );

  it(
    'should display on missing element',
    setupAppContainer(() => {
      new Application().render('willNotFindThis', () => <span></span>, {});
      expect(findDebugger()).not.toBeNull();
    })
  );

  it(
    'should keep original app markup on error',
    setupAppContainerAndRender(
      () => (
        <section>
          <h1>Header</h1>
          <Value
            model={1}
            view={() => <span $unknownBinding={true}></span>}
          ></Value>
        </section>
      ),
      {},
      container => {
        expect(findDebugger()).not.toBeNull();
        expect(container).toContainHTML('<h1>Header</h1>');
      }
    )
  );
});
