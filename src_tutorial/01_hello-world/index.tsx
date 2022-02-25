import { Application } from 'john-smith';
import 'john-smith/view/jsx';

class ApplicationViewModel {
    message = 'Hello, World!';
}

const ApplicationView = (viewModel: ApplicationViewModel) =>
    <section>
        <h1>{viewModel.message}</h1>
    </section>;

const
    application = new Application(),
    applicationViewModel = new ApplicationViewModel();

application.render(
    'root',
    ApplicationView,
    applicationViewModel);
