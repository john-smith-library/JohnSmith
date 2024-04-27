import { Listenable, ListenerCallback, ListenersAware } from '../listenable';
import { Disposable, Owner } from '../../common';

/**
 * Combines two source listenables into one transforming the source values on every change.
 *
 *     const firstName = new ObservableValue<string>();
 *     const lastName = new ObservableValue<string>();
 *
 *     const combined = combine(
 *           firstName
 *          lastName,
 *          (firstNameValue, lastNameValue) => (firstNameValue || '') + ' ' + (lastNameValue || ''));
 *
 *     combined.listen(v => console.log(v));
 *
 *     firstName.setValue('John');
 *     secondName.setValue('Smith');
 *
 *     // outputs 'John Smith'
 *
 * @param left first listenable to combine
 * @param right second listenable to combine
 * @param transform the function to combine values
 */
export const combine = <TLeft, TRight, TResult>(
  left: Listenable<TLeft>,
  right: Listenable<TRight>,
  transform: (left: unknown, right: TRight) => TResult
): Listenable<TResult> & ListenersAware =>
  new DependantListenableValue(left, right, transform);

class DependantListenableValue<TLeft, TRight, TResult>
  extends Listenable<TResult>
  implements ListenersAware
{
  private _listenersCount = 0;

  constructor(
    private left: Listenable<TLeft>,
    private right: Listenable<TRight>,
    private transformer: (valueLeft: TLeft, valueRight: TRight) => TResult
  ) {
    super();
  }

  public listen(
    listener: ListenerCallback<TResult>,
    raiseInitial?: boolean
  ): Disposable {
    this._listenersCount++;

    let leftOld: TLeft | undefined, rightOld: TRight | undefined;

    const actualRaiseInitial = raiseInitial === undefined || raiseInitial;

    return new Owner([
      this.left.listen((newValue: TLeft) => {
        leftOld = newValue;

        if (rightOld !== undefined) {
          const transformedNew = this.transformer(newValue, rightOld);

          //if (actualRaiseInitial) {
          listener(transformedNew);
          //}
        }
      }, true),
      this.right.listen((newValue: TRight) => {
        const isInitial = rightOld === undefined;
        rightOld = newValue;

        if (leftOld !== undefined) {
          const transformedNew = this.transformer(leftOld, newValue);

          if ((isInitial && actualRaiseInitial) || !isInitial) {
            listener(transformedNew);
          }
        }
      }, true),
      {
        dispose: () => {
          this._listenersCount--;
          leftOld = undefined;
          rightOld = undefined;
        },
      },
    ]);
  }

  public getListenersCount(): number {
    return this._listenersCount;
  }
}
