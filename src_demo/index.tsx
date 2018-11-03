import {Application} from "../src/application";
import {HtmlDefinition, View} from "../src/dom/view";

import '../src/jsx';

import {ObservableValue} from "../src/reactive";


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
            <section $innerText="test">Details content {vm.message}</section>
        </section>
}

class ApplicationViewModel {
    firstName = new ObservableValue();
    lastName = new ObservableValue();

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
                <button _click={() => vw.update()}>Update</button>
            </div>

            <section>
                <DetailsView>{new DetailsViewModel('Hello, John Smith!')}</DetailsView>
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
