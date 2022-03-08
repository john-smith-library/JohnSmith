/**
 * The following code is just a quick demo of
 * John Smith approach.
 */

import { Application } from 'john-smith';
import { ObservableList, ObservableValue } from 'john-smith/reactive';
import { Null, Value, List } from 'john-smith/view/components';

import 'john-smith/view/jsx';
import 'john-smith/reactive/ext/listenable/map';

class UserViewModel {
    constructor(
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly bio: string) {
    }
}

class ApplicationViewModel {
    users = new ObservableList<UserViewModel>([
        new UserViewModel(
            'John',
            'Smith',
            `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Praesent quis risus nunc. Praesent nulla massa, tincidunt ut
            nisi a, lobortis auctor risus. In tincidunt id massa sit amet finibus.`),

        new UserViewModel(
            'Joe',
            'Doe',
            `Sed et bibendum mi. Sed aliquet, libero eget posuere iaculis,
            lectus massa consequat eros, vel sagittis ligula sem at lectus.
            Aenean porttitor suscipit consequat.`),
    ]);

    selectedUser = new ObservableValue<UserViewModel|null>(null);

    select(user: UserViewModel) {
        this.selectedUser.setValue(user);
    }
}

/**
 * User Details View defined as a class.
 */
class UserDetailsView {
    constructor(private viewModel: UserViewModel) {
    }

    template() {
        return <section>
            <h2>User Details</h2>
            <p>First Name: {this.viewModel.firstName}</p>
            <p>First Name: {this.viewModel.lastName}</p>
            <h3>Bio</h3>
            <p>{this.viewModel.bio}</p>
        </section>;
    }
}

/**
 * Application View defined as an arrow function (compact form)
 */
const ApplicationView = (viewModel: ApplicationViewModel) =>
    <section class="app">
        <h1>Users Registry</h1>

        <section class="application__content">
            <aside>
                <ul>
                    <List
                        model={viewModel.users}
                        view={ u =>
                            <li $className={viewModel.selectedUser
                                .map(x => x === u ? 'active' : null)}>

                                <a _click={() => {viewModel.select(u);}}>
                                    {u.firstName} {u.lastName}
                                </a>
                            </li>
                        }/>
                </ul>
            </aside>

            <main>
                <Null
                    view={() => <p>Please select a User</p>}
                    model={viewModel.selectedUser} />

                <Value view={UserDetailsView} model={viewModel.selectedUser} />
            </main>
        </section>
    </section>;

const
    application = new Application(),
    applicationViewModel = new ApplicationViewModel();

/**
 * Main entry point -- rendering the application
 * to #root element.
 */
application.render(
    'root',
    ApplicationView,
    applicationViewModel);
