import { combineAll } from './combine-all';
import { ObservableValue } from '../observable-value';

describe('combineAll observable', () => {
  it('should raise initial by default', () => {
    const combined = combineAll([
      new ObservableValue('John'),
      new ObservableValue(1),
    ]);

    const spy = jest.fn();

    combined.listen(spy);

    expect(spy).toHaveBeenCalledWith(['John', 1]);
  });

  it('should not raise initial if raiseInitial is false', () => {
    const combined = combineAll([
      new ObservableValue('John'),
      new ObservableValue(1),
    ]);

    const spy = jest.fn();

    combined.listen(spy, false);

    expect(spy).not.toHaveBeenCalled();
  });
});
