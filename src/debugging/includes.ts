import {DebugTroubleshooter} from "./debug-troubleshooter";
import {DefaultViewRenderer} from "../view/default-view-renderer";
import {NativeDomEngine} from "../view/dom-engine-native";
import {DefaultBindingRegistry} from "../binding/registry";
import {NoopTroubleshooter} from "../troubleshooting/noop-troubleshooter";
import {ErrorsView} from "./errors-view";
import {ErrorsViewModel} from "./errors-view-model";

const LOG = console ? console.log : () => undefined;

const debuggerViewModel = new ErrorsViewModel();

(<any>(globalThis.JS || (globalThis.JS = <any>{}))).Troubleshooter = new DebugTroubleshooter(
    debuggerViewModel,
    () => {
        const domEngine = new NativeDomEngine();

        new DefaultViewRenderer(
            domEngine,
            new DefaultBindingRegistry(),
            new NoopTroubleshooter()
        ).render(domEngine.getRoot()!, ErrorsView, debuggerViewModel);
    });

const INITIALIZER = () => {
    LOG("");

    LOG("========================================================== ");
    LOG("       _       _              _____           _ _   _      ");
    LOG("      | |     | |            / ____|         (_) | | |     ");
    LOG("      | | ___ | |__  _ __   | (___  _ __ ___  _| |_| |__   ");
    LOG("  _   | |/ _ \\| '_ \\| '_ \\   \\___ \\| '_ ` _ \\| | __| '_ \\  ");
    LOG(" | |__| | (_) | | | | | | |  ____) | | | | | | | |_| | | | ");
    LOG("  \\____/ \\___/|_| |_|_| |_| |_____/|_| |_| |_|_|\\__|_| |_| ");
    LOG("========================================================== ");

    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
.js-debugger {
    position: fixed;
    top: 50px;
    right: 50px;
    background: rgba(255, 0, 0, 0.3);
    opacity: 0.5;
    width: 300px;
}

.js-debugger:hover {
    opacity: 1;
}

.js-debugger-error {
    background: rgba(255, 0, 0, 0.3);
}

    `;
    document.getElementsByTagName('head')[0].appendChild(style);
};

INITIALIZER();