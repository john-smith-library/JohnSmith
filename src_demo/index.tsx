import {Application} from "../src/application";
import {HtmlDefinition, View} from "../src/dom/view";

import '../src/jsx';

class ApplicationViewModel {

}

class ApplicationView implements View<ApplicationViewModel> {
    template = (vw: ApplicationViewModel) =>
        <section>
            <h1>John Smith Demo</h1>
            <p>Lorem</p>
        </section>

    // template(viewModel: ApplicationViewModel): HtmlDefinition {
    //     return {
    //         element: 'section',
    //         attributes: {},
    //         bindings: {},
    //         nested: [
    //             {
    //                 element: 'h1',
    //                 attributes: {},
    //                 bindings: {},
    //                 nested: [],
    //                 text: 'Hello, John Smith'
    //             },
    //             {
    //                 element: 'p',
    //                 attributes: {},
    //                 bindings: {},
    //                 nested: [],
    //                 text: 'Lorem ipsum dolor sit amet'
    //             }
    //         ]
    //     };
    // }
}

let $app = document.getElementById('app');
if ($app) {
    const application = new Application();
    application.render(
        $app,
        ApplicationView,
        new ApplicationViewModel());
}
