/**
 * @module common
 */

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
 * Disposable implementation that does nothing.
 */
export const NoopDisposable: Disposable = {
    /**
     * This method does nothing.
     */
    dispose: () => {}
};