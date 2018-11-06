export interface Disposable {
    dispose(): void;
}

export const NoopDisposable: Disposable = {
    dispose: () => {}
}