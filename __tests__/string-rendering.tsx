import '../src/jsx';
import {setupAppContainerAndRender} from "./_helpers";

it('should render static string from vm', setupAppContainerAndRender(
    vm => <div>{vm.message}</div>,
    { message: 'Hello, John Smith!' },
    (container) => {

    expect(container.innerHTML).toBe('<div>Hello, John Smith!</div>');
}));

it('should render static string from vm wrapped by regular text', setupAppContainerAndRender(
    vm => <div>The message is: {vm.message} Thank you.</div>,
    { message: 'Hello, John Smith!' },
    (container) => {

    expect(container.innerHTML).toBe('<div>The message is: Hello, John Smith! Thank you.</div>');
}));