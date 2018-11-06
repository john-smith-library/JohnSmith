import {Application} from "../src/application";
import {HtmlDefinition, View} from "../src/view/view-definition";

import {ObservableValue} from "../src/reactive";
import {BidirectionalValue} from '../src/reactive/bidirectional-value';
import {DomElement} from '../src/view';


class DetailsViewModel {
    message: string;

    constructor(message: string) {
        this.message = message;
    }
}

class DetailsView implements View<DetailsViewModel> {
    template = (vm: DetailsViewModel) =>
        <section>
            <header>Details View</header>
            <section>Details content {vm.message}</section>
            <section $bind={this.bindSection}></section>
        </section>;

    bindSection(dom: DomElement, viewModel: DetailsViewModel) {
        dom.setInnerText('Custom dom manipulation');
        dom.setAttribute('style', 'color: green');
    }
}

class ApplicationViewModel {
    firstName = new BidirectionalValue<string>(() => {});
    lastName = new ObservableValue();
    rememberMe = new BidirectionalValue<boolean>(() => {});

    update() {
        this.firstName.setValue(this.firstName.getValue() + '1');
    }
}

class ApplicationView implements View<ApplicationViewModel> {
    template = (vw: ApplicationViewModel) =>
        <section>
            <h1>John Smith Demo</h1>
            <p>Lorem</p>
            <p>{vw.firstName}</p>
            <table>
                <tr>
                    <th>First Name:</th>
                    <td>{vw.firstName}</td>
                </tr>
                <tr>
                    <th>Last Name:</th>
                    <td>{vw.lastName}</td>
                </tr>
            </table>
            <div>
                <button _click={vw.update}>Update</button>
            </div>

            <section>
                <DetailsView viewModel={new DetailsViewModel('Hello, John Smith!')}></DetailsView>
            </section>

            <section>
                <input $value={[vw.firstName, 'keyup']}/>
            </section>

            <section>Checked: {vw.rememberMe}</section>

            <section>
                <input type="checkbox" $checked={vw.rememberMe} />
            </section>
        </section>
}

let $app = document.getElementById('app');
if ($app) {
    const
        application = new Application(),
        applicationViewModel = new ApplicationViewModel();

    application.render(
        $app,
        ApplicationView,
        applicationViewModel);

    applicationViewModel.firstName.setValue('John');
    applicationViewModel.lastName.setValue('Smith');

    setTimeout(() => {
        applicationViewModel.firstName.setValue('Eugene');
        applicationViewModel.lastName.setValue('Guryanov');
    }, 3000);
}
