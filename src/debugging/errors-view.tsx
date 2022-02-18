import {HtmlDefinition, View} from "../view";
import {ErrorsViewModel} from "./errors-view-model";
import { List } from '../view/components/list';

export class ErrorsView implements View {
    constructor(private viewModel: ErrorsViewModel) {
    }

    template(): HtmlDefinition {
        return <section class="js-debugger">
                    <header>JohnSmith Debugger</header>
                    <ul>
                        <List view={error => {
                            return <li _mouseenter={() => error.element.createClassNames().add('js-debugger-error') }>{error.message}</li>;
                        }} model={this.viewModel.errors} />
                    </ul>
                </section>;
    }

}