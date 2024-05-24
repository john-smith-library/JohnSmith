import { Application } from "../src";
import { DomElement } from "../src/view";
import { View } from "../src/view";
import "../src/view/jsx";
import { ObservableValue, BidirectionalValue } from '../src/reactive';
import {OnInit} from '../src/view/hooks';
import {Value} from '../src/view/components/value';

class DetailsViewModel {
    message: string;

    constructor(message: string) {
        this.message = message;
    }
}

//
class DetailsView implements View, OnInit {
    constructor(private vm: DetailsViewModel) {
    }

    template = () =>
        <section>
            <header>Details View2</header>
            <section>Details content {this.vm.message}</section>
            <section $bind={this.bindSection} $unknown={'1'}  $unknown2={'1'}   $unknown3={'1'} class="active">
                Error section
            </section>
        </section>;

    bindSection(dom: DomElement) {
        dom.setInnerText('Custom dom manipulation  ');

        dom.setAttribute('style', 'color: green');
    }

    onInit(): void {
    }
}

class ApplicationViewModel {
    firstName = new BidirectionalValue<string>(() => {}, '');
    lastName = new ObservableValue<any>(null);
    rememberMe = new BidirectionalValue<boolean>(() => {}, true);

    details = new ObservableValue<DetailsViewModel|null>(null);

    update() {
        this.firstName.setValue(this.firstName.getValue() + '1');
        this.details.setValue(new DetailsViewModel('Updated message from ' + this.firstName.getValue()));
    }
}

const ApplicationView = (vw: ApplicationViewModel) =>
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
            <Value view={DetailsView} model={vw.details}/>
        </section>

        <section>
            <input $value={[vw.firstName, 'keyup']}/>
        </section>

        <section>Checked: {vw.rememberMe}</section>

        <section>
            <input type="checkbox" $checked={vw.rememberMe} />
        </section>
    </section>;

    const application = new Application();
    const applicationViewModel = new ApplicationViewModel();

    application.render(
        'app',
        ApplicationView,
        applicationViewModel);

    applicationViewModel.firstName.setValue('John');
    applicationViewModel.lastName.setValue('Smith');

    setTimeout(() => {
        applicationViewModel.firstName.setValue('Eugene');

        applicationViewModel.lastName.setValue('Guryanov');
    }, 3000);
//}
