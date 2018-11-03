import {setupAppContainerAndRender} from "./_helpers";
import {View} from '../src/view';

class ViewModel {
    constructor(public readonly items: number[]|null) {
    }
}

class ListItemView implements View<number> {
    template(vm: number) {
        return <li>{vm}</li>
    }
}

class ListView implements View<ViewModel>{
    template(viewModel: ViewModel){
        return <ul><ListItemView listViewModel={viewModel.items}/></ul>;
    }
}

it('should render', setupAppContainerAndRender(
    ListView,
    new ViewModel([1, 2, 3]),
    (container) => {

    expect(container.innerHTML).toBe('<ul><li>1</li><li>2</li><li>3</li></ul>');
}));

it('should render empty if null', setupAppContainerAndRender(
    ListView,
    new ViewModel(null),
    (container) => {

    expect(container.innerHTML).toBe('<ul></ul>');
}));