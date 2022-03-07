import {DomElement, HtmlDefinition, View} from '../src/view';
import {dispatchChange, DisposableStub, findInput, setupAppContainerAndRender} from './_helpers';
import '../src/view/jsx';
import '../src/binding/ext/bind';

class ViewModel {
    constructor(public callback: any) {
    }
}

const ApplicationView = (viewModel: ViewModel) => <p $bind={viewModel.callback}/>;

it('should call callback',
    setupAppContainerAndRender(ApplicationView, new ViewModel(jest.fn()),(container, viewModel) => {

    expect(viewModel.callback).toHaveBeenCalled();
}));

it('should allow DOM modifications in callback',
    setupAppContainerAndRender(ApplicationView, new ViewModel(function (el: DomElement) {
        el.setInnerHtml('updated');
    }),(container) => {

    expect(container.innerHTML).toBe('<p>updated</p>');
}));

it('should dispose single disposable from callback on view disposing',
    () => {
        const disposable = new DisposableStub();

        setupAppContainerAndRender(
            ApplicationView,
            new ViewModel(() => disposable),
            (container, viewModel, view) => {

            view.dispose();
        })();

        expect(disposable.disposed).toBeTruthy();
    });

it('should dispose multiple disposables from callback on view disposing',
    () => {
        const disposable1 = new DisposableStub();
        const disposable2 = new DisposableStub();

        setupAppContainerAndRender(
            ApplicationView,
            new ViewModel(() => [disposable1, disposable2]),
            (container, viewModel, view) => {

            view.dispose();
        })();

        expect(disposable1.disposed).toBeTruthy();
        expect(disposable2.disposed).toBeTruthy();
    });
