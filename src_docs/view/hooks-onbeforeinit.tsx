import { DomElement, HtmlDefinition, View } from 'john-smith/view';
import { OnBeforeInit } from 'john-smith/view/hooks';
import { DomEngine } from 'john-smith/view/dom-engine';
import { OptionalDisposables } from 'john-smith/common';
import { ObservableValue } from 'john-smith/reactive';

export class User {
  firstName = new ObservableValue<string>('');
}

export class UserView implements View, OnBeforeInit {
  constructor(private viewModel: User) {}

  public template(): HtmlDefinition {
    return <div>User</div>;
  }

  public onBeforeInit(
    destination: DomElement,
    root: DomElement | null,
    domEngine: DomEngine
  ): OptionalDisposables {
    // we can create/change DOM manually here
    const title = domEngine.createElement('h1');
    destination.appendChild(title);

    // If we create any Disposables we should return them as a result
    // so that they will be released once the View is unrendered.
    return this.viewModel.firstName.listen(firstName => {
      // my own listener logic goes here

      // a demo of manual reacting on View Model changes:
      title.setInnerText('My name is: ' + firstName);
    });
  }
}
