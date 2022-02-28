import {setupAppContainerAndRender} from './_helpers';
import { HtmlDefinition, View } from '../src/view';
import { Value } from '../src/view/components/value';
import '../src/view/jsx';

class Shape {}
class Rectangle extends Shape {}
class Circle extends Shape {}

class ViewModel {
    constructor(public shape: Shape) {
    }
}

class ApplicationView implements View {
    constructor(private viewModel: ViewModel) {
    }

    template(): HtmlDefinition {
        return <section>
                   <Value
                       view={(shape: Shape) => {
                           if (shape instanceof Circle) {
                               return <span>Circle</span>;
                           }
                           if (shape instanceof Rectangle) {
                               return <span>Rectangle</span>;
                           }

                           return <span>Unknown shape</span>
                       }}
                       model={this.viewModel.shape}>{
                   }</Value>
               </section>;
    }
}

describe('polymorphic view model rendering', () => {
    it('should render circle',
       setupAppContainerAndRender(ApplicationView, new ViewModel(new Circle()), (container) => {
           expect(container.innerHTML).toBe('<section><span>Circle</span></section>')
       }));
    it('should render rectangle',
       setupAppContainerAndRender(ApplicationView, new ViewModel(new Rectangle()), (container) => {
           expect(container.innerHTML).toBe('<section><span>Rectangle</span></section>')
       }));
});
