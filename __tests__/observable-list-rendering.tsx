import {setupAppContainerAndRender} from './_helpers';
import { List } from '../src/view/components/list';
import {ObservableList} from '../src/reactive';

class ViewModel {
    items:ObservableList<string>;

    constructor(items: string[]) {
        this.items = new ObservableList<string>(items)
    }
}

const ItemView = (viewModel: string) => <li>{viewModel}</li>;

const ListView = (viewModel: ViewModel) =>
    <ul>
        <List view={ItemView} model={viewModel.items} />
    </ul>;

it('should render initial value',
   setupAppContainerAndRender(ListView, new ViewModel(['initial 1', 'initial 2']),(container, viewModel) => {
       expect(container.innerHTML).toBe('<ul><li>initial 1</li><li>initial 2</li></ul>');
}));

it('should update on add',
   setupAppContainerAndRender(ListView, new ViewModel(['1', '2']),(container, viewModel) => {
       viewModel.items.add('3');
       expect(container.innerHTML).toBe('<ul><li>1</li><li>2</li><li>3</li></ul>');
}));

it('should update on set',
   setupAppContainerAndRender(ListView, new ViewModel(['1', '2']),(container, viewModel) => {
       viewModel.items.setValue(['3']);
       expect(container.innerHTML).toBe('<ul><li>3</li></ul>');
}));

it('should update on remove',
   setupAppContainerAndRender(ListView, new ViewModel(['1', '2', '3']),(container, viewModel) => {
       viewModel.items.remove('2');
       expect(container.innerHTML).toBe('<ul><li>1</li><li>3</li></ul>');
}));

it('should clean on clear',
   setupAppContainerAndRender(ListView, new ViewModel(['1', '2', '3']),(container, viewModel, view) => {
       viewModel.items.clear();
       expect(container.innerHTML).toBe('<ul></ul>');
}));

it('should clean listeners on dispose',
    setupAppContainerAndRender(ListView, new ViewModel(['1', '2', '3']),(container, viewModel, view) => {
        expect(viewModel.items.getListenersCount()).toBeGreaterThan(0);
        view.dispose();
        expect(viewModel.items.getListenersCount()).toBe(0);
    }));
