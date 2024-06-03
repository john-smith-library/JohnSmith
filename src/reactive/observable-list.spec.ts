/**
 *
 */
import { ObservableList } from './observable-list';
import { DataChangeReason } from './listenable';

describe('forEach', () => {
  it('iterates over the list of items', () => {
    const observable = new ObservableList([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const results: number[] = [];

    observable.forEach(x => results.push(x));

    expect(results.length).toBe(10);
  });

  it('respects the context', () => {
    const observable = new ObservableList(['foo']);
    const context: unknown = {};

    const spy = jest.fn();
    observable.forEach(spy, context);

    expect(spy).toHaveBeenCalled();
    expect(spy.mock.contexts[0]).toBe(context);
  });
});

describe('setValue', () => {
  it('throws error if values is not an array', () => {
    const observable = new ObservableList<unknown>();
    expect(() => {
      observable.setValue('foo' as never);
    }).toThrow();
  });
});

describe('count', () => {
  it('Should be 0 by default', () => {
    const observable = new ObservableList();
    expect(observable.count().getValue()).toBe(0);
  });

  it('Should be equal to items count', () => {
    const observable = new ObservableList<number>();
    observable.setValue([1, 2, 3]);
    expect(observable.count().getValue()).toBe(3);
  });
});

it('has value by default', () => {
  const observable = new ObservableList();

  expect(observable.getValue()).toBeTruthy();
  expect(observable.getRequiredValue().length).toBe(0);
});

describe('add', () => {
  it('can add multiple items', () => {
    const observable = new ObservableList<string>();
    observable.add('foo', 'bar');
    expect(observable.getRequiredValue().length).toBe(2);
  });

  it('notifies listeners', () => {
    const observable = new ObservableList<string>();

    const listener = jest.fn();

    observable.add('baz');
    observable.listen(listener);
    observable.add('foo', 'bar');

    expect(listener).toHaveBeenCalled();
    expect(listener).toHaveBeenCalledWith(['baz', 'foo', 'bar']);
  });

  it('notifies partial listeners', () => {
    const observable = new ObservableList<string>();

    const listener = jest.fn();

    observable.add('baz');
    observable.listenPartial(listener);
    observable.add('foo', 'bar');

    expect(listener).toHaveBeenCalled();
    expect(listener).toHaveBeenCalledWith(['foo', 'bar'], DataChangeReason.add);
  });
});

describe('remove', () => {
  it('can delete multiple items', () => {
    const observable = new ObservableList<number>();

    observable.setValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    observable.remove(1, 3, 5, 7, 9);

    const value = observable.getRequiredValue();
    expect(value.length).toBe(5);
    expect(value[0]).toBe(2);
    expect(value[1]).toBe(4);
    expect(value[2]).toBe(6);
    expect(value[3]).toBe(8);
    expect(value[4]).toBe(10);
  });

  it('does nothing if value not in list', () => {
    const observable = new ObservableList<number>([1, 2, 3]);

    observable.remove(5);

    const value = observable.getRequiredValue();
    expect(value.length).toBe(3);
  });

  it('notifies listeners', () => {
    const observable = new ObservableList<number>();

    const listener = jest.fn();

    observable.setValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    observable.listen(listener);
    observable.remove(1, 3, 5, 7, 9);

    expect(listener).toHaveBeenCalled();
    expect(listener).toHaveBeenCalledWith([2, 4, 6, 8, 10]);
  });

  it('notifies partial listeners', () => {
    const observable = new ObservableList<number>();

    const listener = jest.fn();

    observable.setValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    observable.listenPartial(listener);
    observable.remove(1, 3, 5, 7, 9);

    expect(listener).toHaveBeenCalled();
    expect(listener).toHaveBeenCalledWith(
      [1, 3, 5, 7, 9],
      DataChangeReason.remove
    );
  });
});

describe('clear', () => {
  it('notifies listeners', () => {
    const observable = new ObservableList<number>();

    const listener = jest.fn();

    observable.setValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    observable.listen(listener);
    observable.clear();

    expect(listener).toHaveBeenCalled();
    expect(listener).toHaveBeenCalledWith([]);
  });

  it('notifies partial listeners', () => {
    const observable = new ObservableList<number>();

    const listener = jest.fn();

    observable.setValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    observable.listenPartial(listener);
    observable.clear();

    expect(listener).toHaveBeenCalled();
    expect(listener).toHaveBeenCalledWith(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      DataChangeReason.remove
    );
  });

  it('deletes all items', () => {
    const observable = new ObservableList<number>();
    observable.setValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    observable.clear();

    expect(observable.getRequiredValue().length).toBe(0);
  });
});

describe('getRequiredLast', () => {
  it('returns a value if list is not empty', () => {
    const observable = new ObservableList<number>([42]);

    expect(observable.getRequiredLast()).toBe(42);
  });

  it('returns last value if there are many', () => {
    const observable = new ObservableList<number>([1, 2, 3]);

    expect(observable.getRequiredLast()).toBe(3);
  });

  it('throws if list is empty', () => {
    const observable = new ObservableList<number>();

    expect(() => observable.getRequiredLast()).toThrow();
  });
});

describe('listenPartial', () => {
  it('respects raiseInitial', () => {
    const observable = new ObservableList<number>();
    observable.setValue([1, 2, 42, 101]);

    const callback = jest.fn();
    observable.listenPartial(callback, false);

    expect(callback).not.toHaveBeenCalled();
  });
});
