import { HtmlDefinition, View } from '../../src/view';

export class User {} // this is a View Model

export class UserView implements View {
  constructor(private viewModel: User) {}

  public template(): HtmlDefinition {
    return <div>User</div>;
  }
}
