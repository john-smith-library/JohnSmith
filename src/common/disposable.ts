/**
 * Provides a way to release resources.
 */
export interface Disposable {
  /**
   * Performs resources releasing action.
   */
  dispose(): void;
}

/**
 * Defines a type of optional disposable or array of disposables.
 */
export type OptionalDisposables = void | undefined | Disposable | Disposable[];

/**
 * Disposable implementation that does nothing.
 */
export const NoopDisposable: Disposable = {
  /**
   * This method does nothing.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispose: () => {},
};

export const IsDisposable = (item: unknown): item is Disposable => {
  return (item as Disposable).dispose !== undefined;
};
