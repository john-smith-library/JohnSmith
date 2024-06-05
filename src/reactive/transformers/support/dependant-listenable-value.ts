import { Listenable, ListenerCallback, ListenersAware } from '../../listenable';
import { Disposable, Owner } from '../../../common';
import { ListenerArray } from './listener-array';

export class DependantListenableValue<T extends unknown[], TResult>
  extends Listenable<TResult>
  implements ListenersAware
{
  private _listenersCount = 0;

  constructor(
    private readonly inputListeners: ListenerArray<T>,
    private transformer: (...mapperInput: T) => TResult
  ) {
    super();
  }

  public listen(
    listener: ListenerCallback<TResult>,
    raiseInitial?: boolean
  ): Disposable {
    this._listenersCount++;

    const initialLoaded: boolean[] = this.inputListeners.map(() => false);
    const values: T = this.inputListeners.map(() => undefined) as T;

    const raiseInitialPending = raiseInitial === undefined || raiseInitial;
    let initializedCount = 0;

    const result = new Owner(
      this.inputListeners.map((listenable, index) => {
        return listenable.listen(value => {
          values[index] = value;

          if (initializedCount === this.inputListeners.length) {
            listener(this.transformer(...values));
          } else {
            if (!initialLoaded[index]) {
              initialLoaded[index] = true;
              initializedCount++;

              if (
                initializedCount === this.inputListeners.length &&
                raiseInitialPending
              ) {
                listener(this.transformer(...values));
              }
            }
          }
        }, true);
      })
    );

    result.own({
      dispose: () => {
        this._listenersCount--;
      },
    });

    return result;

    // return new Owner([
    //   this.left.listen((newValue: TLeft) => {
    //     leftOld = newValue;
    //
    //     if (rightOld !== undefined) {
    //       const transformedNew = this.transformer(newValue, rightOld);
    //
    //       //if (actualRaiseInitial) {
    //       listener(transformedNew);
    //       //}
    //     }
    //   }, true),
    //   this.right.listen((newValue: TRight) => {
    //     const isInitial = rightOld === undefined;
    //     rightOld = newValue;
    //
    //     if (leftOld !== undefined) {
    //       const transformedNew = this.transformer(leftOld, newValue);
    //
    //       if ((isInitial && actualRaiseInitial) || !isInitial) {
    //         listener(transformedNew);
    //       }
    //     }
    //   }, true),
    //   {
    //     dispose: () => {
    //       this._listenersCount--;
    //       leftOld = undefined;
    //       rightOld = undefined;
    //     },
    //   },
    // ]);
  }

  public getListenersCount(): number {
    return this._listenersCount;
  }
}
