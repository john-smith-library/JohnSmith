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
 * Defines a type of optional disposable or array of disposables.
 */
export type OptionalDisposables = void|undefined|Disposable|(Disposable[]);

/**
 * Disposable implementation that does nothing.
 */
export const NoopDisposable: Disposable = {
    /**
     * This method does nothing.
     */
    dispose: () => {}
};

export const IsDisposable = (item: OptionalDisposables): item is Disposable =>  {
    return !!(<any>item).dispose;
};

export const DisposeOptional = (item: OptionalDisposables) => {
    if (item) {
        if (IsDisposable(item)) {
            item.dispose()
        } else if (item.length) {
            for (let i = 0; i < item.length; i++) {
                item[i].dispose();
            }
        }
    }
};

