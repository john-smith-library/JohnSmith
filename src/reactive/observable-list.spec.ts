/**
 *
 */
import {ObservableList} from './observable-list';
import {DataChangeReason} from './listenable';

describe('forEach', function(){
    it('iterates over the list of items', function(){
        const observable = new ObservableList([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

        const results: number[] =   [];

        observable.forEach(x => results.push(x));

        expect(results.length).toBe(10);
    });

    it('respects the context', function(){
        const observable = new ObservableList(['foo']);
        const context: unknown = {};

        let actualContext: unknown = null;

        observable.forEach(
            function(this: unknown){
                actualContext = this;
            }, context);

        expect(actualContext).toBe(context);
    });
});

describe('setValue', function(){
    it('throws error if values is not an array', function(){
        const observable = new ObservableList();
        expect(function(){
            observable.setValue(<any>'foo');
        }).toThrowError();
    });
});

describe('count', function(){
    it('Should be 0 by default', function(){
        const observable = new ObservableList();
        expect(observable.count().getValue()).toBe(0);
    });

    /*
    it('Should be 0 if value is null', function(){
        const observable = new ObservableList();
        observable.setValue(null);
        expect(observable.count().getValue()).toBe(0);
    });*/

    it('Should be equal to items count', function(){
        const observable = new ObservableList<number>();
        observable.setValue([1, 2, 3]);
        expect(observable.count().getValue()).toBe(3);
    });
});

it('has value by default', function(){
    const observable = new ObservableList();

    expect(observable.getValue()).toBeTruthy();
    expect(observable.getRequiredValue().length).toBe(0);
});

describe('add', () => {
    /*
    it('can add even if initial is null', function(){
        const observable = new ObservableList<string>(null);
        observable.add('foo', 'bar');
        expect(observable.getRequiredValue().length).toBe(2);
    });*/

    it('can add multiple items', function(){
        const observable = new ObservableList<string>();
        observable.add('foo', 'bar');
        expect(observable.getRequiredValue().length).toBe(2);
    });

    /*
    it('replaces value if it is null', function(){
        const observable = new ObservableList<string>(null);
        observable.add('foo', 'bar');
        expect(observable.getRequiredValue().length).toBe(2);
    });*/

    it('notifies listeners', function(){
        const observable = new ObservableList<string>();

        const listener = jest.fn();

        observable.add('baz');
        observable.listen(listener);
        observable.add('foo', 'bar');

        expect(listener).toHaveBeenCalled();
        expect(listener).toHaveBeenCalledWith(['baz', 'foo', 'bar']);
    });

    it('notifies partial listeners', function(){
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
    it('can delete multiple items', function(){
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

    it('does nothing if value not in list', function(){
        const observable = new ObservableList<number>([1, 2, 3]);

        observable.remove(5);

        const value = observable.getRequiredValue();
        expect(value.length).toBe(3);
    });

    /*
    it('does nothing if value is null', () => {
        const observable = new ObservableList<number>(null);
        observable.remove(1, 2, 3);
        expect(observable.getValue()).toBeNull();
    });*/

    it('notifies listeners', function(){
        const observable = new ObservableList<number>();

        const listener = jest.fn();

        observable.setValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        observable.listen(listener);
        observable.remove(1, 3, 5, 7, 9);

        expect(listener).toHaveBeenCalled();
        expect(listener).toHaveBeenCalledWith([2, 4, 6, 8, 10]);
    });

    it('notifies partial listeners', function(){
        const observable = new ObservableList<number>();

        const listener = jest.fn();

        observable.setValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        observable.listenPartial(listener);
        observable.remove(1, 3, 5, 7, 9);

        expect(listener).toHaveBeenCalled();
        expect(listener).toHaveBeenCalledWith([1, 3, 5, 7, 9], DataChangeReason.remove);
    });
});

describe('clear', () => {
    it('notifies listeners', function(){
        const observable = new ObservableList<number>();

        const listener = jest.fn();

        observable.setValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        observable.listen(listener);
        observable.clear();

        expect(listener).toHaveBeenCalled();
        expect(listener).toHaveBeenCalledWith([]);
    });

    it('notifies partial listeners', function(){
        const observable = new ObservableList<number>();

        const listener = jest.fn();

        observable.setValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        observable.listenPartial(listener);
        observable.clear();

        expect(listener).toHaveBeenCalled();
        expect(listener).toHaveBeenCalledWith([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], DataChangeReason.remove);
    });

    it('deletes all items', function(){
        const observable = new ObservableList<number>();
        observable.setValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        observable.clear();

        expect(observable.getRequiredValue().length).toBe(0);
    });
});





