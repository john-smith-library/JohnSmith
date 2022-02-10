import {setupAppContainerAndRender} from './_helpers';
import {View} from '../src/view';

class ViewModel {
    constructor(public callback: () => void) {
    }
}

class ApplicationView implements View<ViewModel>{
    template(viewModel: ViewModel) {
        return <a _click={viewModel.callback}>{viewModel}</a>;
    }
}

class ApplicationViewDoubleUnderscore implements View<ViewModel>{
    template(viewModel: ViewModel) {
        return <a __click={viewModel.callback}>{viewModel}</a>;
    }
}

describe('single underscore', () => {
    it('should call', setupAppContainerAndRender(ApplicationView, new ViewModel(jest.fn()),(container, viewModel) => {
        const anchor = container.getElementsByTagName('a')[0];
        dispatchClick(anchor);

        expect(viewModel.callback).toHaveBeenCalled();
    }));

    it('should use vm as context',
        setupAppContainerAndRender(
            ApplicationView,
            new ViewModel(assertContextIsVm),
            (container, viewModel) => {

        const anchor = container.getElementsByTagName('a')[0];
        dispatchClick(anchor);
    }));

    it('remove listener on view dispose',
        setupAppContainerAndRender(
            ApplicationView,
            new ViewModel(jest.fn()),
            (container, viewModel, view) => {

                const anchor = container.getElementsByTagName('a')[0];

                view.dispose();
                dispatchClick(anchor);

                expect(viewModel.callback).toHaveBeenCalledTimes(0);
            }));
});

describe('double underscore', () => {
    it('should call', setupAppContainerAndRender(ApplicationViewDoubleUnderscore, new ViewModel(jest.fn()),(container, viewModel) => {
        const anchor = container.getElementsByTagName('a')[0];
        dispatchClick(anchor);

        expect(viewModel.callback).toHaveBeenCalled();
    }));

    it('should use view as context',
        setupAppContainerAndRender(
            ApplicationViewDoubleUnderscore,
            new ViewModel(assertContextIsView),
            (container, viewModel) => {

        const anchor = container.getElementsByTagName('a')[0];
        dispatchClick(anchor);
    }));

    it('remove listener on view dispose',
        setupAppContainerAndRender(
            ApplicationViewDoubleUnderscore,
            new ViewModel(jest.fn()),
            (container, viewModel, view) => {

        const anchor = container.getElementsByTagName('a')[0];

        view.dispose();
        dispatchClick(anchor);

        expect(viewModel.callback).toHaveBeenCalledTimes(0);
    }));
});

function dispatchClick(element: HTMLElement) {
    const event = new MouseEvent('click');
    element.dispatchEvent(event);
}

function assertContextIsVm() {
    // @ts-ignore
    const that: any = this;

    expect(that).toBeDefined();
    expect(that).toBeInstanceOf(ViewModel);
};

function assertContextIsView() {
    // @ts-ignore
    const that: any = this;

    expect(that).toBeDefined();
    expect(that).toBeInstanceOf(ApplicationViewDoubleUnderscore);
};
