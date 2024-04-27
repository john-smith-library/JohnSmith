import { setupAppContainerAndRender } from './_helpers';
import '../src/view/jsx';

it(
  'should render static string from vm',
  setupAppContainerAndRender(
    vm => <div>{vm.message}</div>,
    { message: 'Hello, John Smith!' },
    container => {
      expect(container.innerHTML).toBe('<div>Hello, John Smith!</div>');
    }
  )
);

it(
  'should render static string from vm wrapped by regular text',
  setupAppContainerAndRender(
    vm => <div>The message is: {vm.message} Thank you.</div>,
    { message: 'Hello, John Smith!' },
    container => {
      expect(container.innerHTML).toBe(
        '<div>The message is: Hello, John Smith! Thank you.</div>'
      );
    }
  )
);

it(
  'should render non-string primitives',
  setupAppContainerAndRender(
    vm => <div>The message is: {vm.message}</div>,
    { message: 42 },
    container => {
      expect(container.innerHTML).toBe('<div>The message is: 42</div>');
    }
  )
);

it(
  'should render objects with toString',
  setupAppContainerAndRender(
    vm => <div>The message is: {vm.message}</div>,
    { message: { toString: () => 'toString' } },
    container => {
      expect(container.innerHTML).toBe('<div>The message is: toString</div>');
    }
  )
);
