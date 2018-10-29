import {ViewDefinition} from "../src/dom";
import {Application} from "../src";

export type ContainerCallback = (container: HTMLElement) => void;

export const setupAppContainer = (callback: ContainerCallback, containerId = 'app') => {
    return () => {
        document.body.innerHTML = '<div id="' + containerId + '"></div>';

        let container = document.getElementById(containerId);
        if (container === null) {
            throw new Error('Can not initialize dom for testing');
        }

        callback(container);
    };
}

export function setupAppContainerAndRender<ViewModel>(
    viewDefinition: ViewDefinition<ViewModel>,
    viewModel: ViewModel,
    callback: ContainerCallback,
    containerId = 'app') {

    return setupAppContainer(container => {
        new Application().render(container, viewDefinition, viewModel);
        callback(container);
    });
}