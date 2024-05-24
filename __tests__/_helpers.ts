import { ViewDefinition } from '../src/view';
import { Application } from '../src';
import { Disposable } from '../src/common';

export type ContainerCallback = (container: HTMLElement) => void;
export type ViewCallback<ViewModel> = (
  container: HTMLElement,
  viewModel: ViewModel,
  view: Disposable
) => void;

export const setupAppContainer = (
  callback: ContainerCallback,
  containerId = 'app'
) => {
  return () => {
    document.body.innerHTML = '<div id="' + containerId + '"></div>';

    const container = document.getElementById(containerId);
    if (container === null) {
      throw new Error('Can not initialize dom for testing');
    }

    callback(container);
  };
};

export function setupAppContainerAndRender<ViewModel>(
  viewDefinition: ViewDefinition<ViewModel>,
  viewModel: ViewModel,
  callback: ViewCallback<ViewModel>,
  containerId = 'app'
) {
  return setupAppContainer(container => {
    const view = new Application().render(container, viewDefinition, viewModel);
    callback(container, viewModel, view);
  }, containerId);
}

export function findInput(id: string): HTMLInputElement {
  const result = document.getElementById(id);
  if (result === null) {
    throw new Error('required input not found');
  }

  return result as HTMLInputElement;
}

export function dispatchChange(element: HTMLElement) {
  const event = new Event('change');
  element.dispatchEvent(event);
}

export class DisposableStub implements Disposable {
  disposed = false;

  public dispose(): void {
    this.disposed = true;
  }
}

export const expectedSingleElement = (
  container: HTMLElement,
  tag: string
): HTMLElement => {
  expect(container.firstElementChild).not.toBeNull();
  expect(container.firstElementChild!.nextElementSibling).toBeNull();
  expect(container.firstElementChild!.tagName.toLowerCase()).toBe(
    tag.toLowerCase()
  );

  return container.firstElementChild! as HTMLElement;
};
