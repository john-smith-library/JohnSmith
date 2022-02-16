import {DomElement, HtmlDefinition, View} from '../../src/view';
import {OnBeforeInit} from "../../src/view/hooks";
import {DomEngine} from "../../src/view/dom-engine";
import {OptionalDisposables} from "../../src/common";
import {ObservableValue} from "../../src/reactive";

export class User {
    firstName = new ObservableValue();
}

export class UserView implements View, OnBeforeInit {
    constructor(
        private viewModel: User) {
    }

    template(): HtmlDefinition {
        return (<div>User</div>);
    }

    onBeforeInit(destination: DomElement, domEngine: DomEngine): OptionalDisposables {
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
