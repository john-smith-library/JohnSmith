import { ObservableValue } from "./observable-value";
import { DataChangeReason } from "./listenable";

it('can attach listeners', () => {
    const observable = new ObservableValue();
    observable.listen(() => {});

    expect(observable.getListenersCount()).toBe(1);
});

it('can dispose listeners', () => {
    const observable = new ObservableValue();
    const link = observable.listen(() => {});
    link.dispose();
    expect(observable.getListenersCount()).toBe(0);
});

it('stores value', () => {
    const observable = new ObservableValue();
    observable.setValue('foo');
    expect(observable.getValue()).toBe('foo');
});

it('notifies listeners about initial value by default', () => {
    const observable = new ObservableValue();
    const callback = jasmine.createSpy('listener');

    observable.setValue('foo');
    observable.listen(callback);

    expect(callback).toHaveBeenCalled();
    expect(callback.calls.mostRecent().args[0]).toBe('foo');
});

it('does not notify listeners about initial if flag set', () => {
    const observable = new ObservableValue();
    const callback = jasmine.createSpy();

    observable.setValue('foo');
    observable.listen(callback, false);

    expect(callback).not.toHaveBeenCalled();
});

it('passes new value to listener', () => {
    const observable = new ObservableValue();
    const listener = jasmine.createSpy('listener');

    observable.setValue('foo');
    observable.listen(listener, false);
    observable.setValue('bar');

    expect(listener).toHaveBeenCalled();
    expect(listener.calls.mostRecent().args[0]).toBe('bar');
});

it('passes old value to listener', () => {
    const observable = new ObservableValue();
    const listener = jasmine.createSpy('listener');
    observable.setValue('foo');
    observable.listen(listener, false);
    observable.setValue('bar');

    expect(listener).toHaveBeenCalled();
    expect(listener.calls.mostRecent().args[1]).toBe('foo');
});

it('passes changes details to listener', () => {
    const observable = new ObservableValue();
    const listener = jasmine.createSpy('listener');

    observable.setValue('foo');
    observable.listen(listener, false);
    observable.setValue('bar');

    expect(listener).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String), { reason: DataChangeReason.replace, portion: 'bar' });
});

describe('hasValue', () => {
    it('returns false if value is null', () => {
        const observable = new ObservableValue<any>();
        observable.setValue(null);
        expect(observable.hasValue()).toBe(false);
    });

    it('returns false if value is undefined', () => {
        const observable = new ObservableValue<any|undefined>();
        observable.setValue(undefined);
        expect(observable.hasValue()).toBe(false);
    });

    it('returns true if value is foo', () => {
        const observable = new ObservableValue();
        observable.setValue('foo');
        expect(observable.hasValue()).toBe(true);
    });
});