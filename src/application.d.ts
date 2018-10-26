import { View } from "./dom/view";
export declare class Application {
    render<TApplicationViewModel>(element: HTMLElement, view: {
        new (): View<TApplicationViewModel>;
    }, viewModel: TApplicationViewModel): void;
    private transform;
}
