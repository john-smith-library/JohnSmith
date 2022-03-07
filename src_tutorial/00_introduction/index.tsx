import { Application } from 'john-smith';
import 'john-smith/view/jsx';
import {ObservableList, ObservableValue} from "john-smith/reactive";
import { List } from "john-smith/view/components/list";
import { Value } from "john-smith/view/components/value";
import {HtmlDefinition} from "john-smith/view";

class UserViewModel {
    constructor(
        public readonly firstName: string,
        public readonly lastName: string,
    ) {
    }
}

class ApplicationViewModel {
    users = new ObservableList<UserViewModel>([
        new UserViewModel("John", "Smith"),
        new UserViewModel("Joe", "Doe"),
    ]);

    selectedUser = new ObservableValue<UserViewModel|null>(null);

    select(user: UserViewModel) {
        this.selectedUser.setValue(user);
    }
}

class UserDetailsView {
    constructor(private viewModel: UserViewModel|null) {
    }

    template(): HtmlDefinition {
        return this.viewModel === null ? <p>Please select a User</p> : <section>
            <p>First Name: {this.viewModel.firstName}</p>
            <p>First Name: {this.viewModel.lastName}</p>
        </section>;
    }
}

const ApplicationView = (viewModel: ApplicationViewModel) =>
    <section>
        <h1>Users Registry</h1>

        <aside>
            <ul>
                <List
                    model={viewModel.users}
                    view={
                        u => <li>
                                <a _click={() => {viewModel.select(u);}}>{u.firstName} {u.lastName}</a>
                            </li>
                    }/>
            </ul>
        </aside>

        <main>
            <Value view={UserDetailsView} model={viewModel.selectedUser} />
        </main>

    </section>;

const
    application = new Application(),
    applicationViewModel = new ApplicationViewModel();

application.render(
    'root',
    ApplicationView,
    applicationViewModel);
