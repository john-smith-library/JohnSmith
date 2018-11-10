import {setupAppContainerAndRender} from './_helpers';
import { HtmlDefinition, View } from '../src/view';
import { DynamicView } from '../src/view/standard';

class Shape {}
class Rectangle extends Shape {}
class Circle extends Shape {}

class ViewModel {
    constructor(public shape: Shape) {
    }
}

class ApplicationView implements View<ViewModel> {
    template(viewModel: ViewModel): HtmlDefinition {
        return <section>
                   <DynamicView viewModel={viewModel.shape}>{
                       (shape: Shape) => {
                           if (shape instanceof Circle) {
                               return <span>Circle</span>;
                           }
                           if (shape instanceof Rectangle) {
                               return <span>Rectangle</span>;
                           }

                           return <span>Unknown shape</span>
                        }
                   }</DynamicView>
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