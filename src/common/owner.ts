import { Disposable, IsDisposable, OptionalDisposables } from './disposable';

/**
 * A utility class to treat multiple Disposable objects
 * as a single Disposable.
 *
 * *Example*
 *
 *     const
 *          disposable1 = { dispose: () => console.log(1) },
 *          disposable1 = { dispose: () => console.log(2) },
 *          owner = new Owner([disposable1, disposable2]);
 *
 *     owner.own({ dispose: () => console.log(3) });
 *
 *     owner.dispose(); // outputs 1, 2, 3
 */
export class Owner implements Disposable {
  private _properties: Disposable[];

  /**
   * Creates new Owner instance with a specified array
   * of nested disposables. Alternatively you can use
   * `own` method to add disposable items.
   *
   * @param properties the nested disposables
   */
  constructor(properties?: Disposable[]) {
    this._properties = properties || [];
  }

  /**
   * Adds a disposable object to the owned queue. This method returns
   * the original object so it could be embedded to initialization
   * expressions:
   *
   *     const ownedDisposable = owner.own(createDisposable());
   *
   * @param property a disposable object to manage
   * @returns the original disposable object
   */
  public own<T extends Disposable>(property: T): T {
    this._properties.push(property);
    return property;
  }

  public ownIfNotNull<T extends Disposable>(
    property: T | null | undefined
  ): T | null | undefined {
    if (property) {
      return this.own(property);
    }

    return property;
  }

  /**
   * Disposes all the nested disposables.
   */
  public dispose() {
    for (let i = 0; i < this._properties.length; i++) {
      this._properties[i].dispose();
    }
  }
}

export const ToDisposable = (item: OptionalDisposables): Disposable | null => {
  if (item) {
    if (IsDisposable(item)) {
      return item;
    } else if (item.length) {
      return new Owner(item);
    }
  }

  return null;
};
