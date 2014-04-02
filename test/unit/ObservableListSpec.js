describe('unit - observable - ObservableList', function(){
    var observable;

    beforeEach(function(){
        observable = new js.ObservableList();
    });

    /**
     *
     */
    describe('forEach', function(){
        it('iterates over the list of items', function(){
            var callback = sinon.spy();
            observable.setValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            observable.forEach(callback);

            expect(callback.callCount).toBe(10);
        });

        it('respects the context', function(){
            var callback = sinon.spy();
            var context = {};

            observable.setValue(['foo']);
            observable.forEach(callback, context);

            expect(callback.calledOn(context)).toBe(true);
        });
    });

    /**
     *
     */
    describe('setValue', function(){
        it('throws error if values is not an array', function(){
            expect(function(){ observable.setValue('foo'); }).toThrowError();
        });
    });

    describe('count', function(){
        it('Should be 0 by default', function(){
            expect(observable.count().getValue()).toBe(0);
        });

        it('Should be 0 if value is null', function(){
            observable.setValue(null);
            expect(observable.count().getValue()).toBe(0);
        });

        it('Should be equal to items count', function(){
            observable.setValue([1, 2, 3]);
            expect(observable.count().getValue()).toBe(3);
        });
    });

    it('has value by default', function(){
        expect(observable.getValue()).toBeTruthy();
        expect(observable.getValue().length).toBe(0);
    });

    it('can add multiple items', function(){
        observable.add('foo', 'bar');
        expect(observable.getValue().length).toBe(2);
    });

    it('can delete multiple items', function(){
        observable.setValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        observable.remove(1, 3, 5, 7, 9);

        expect(observable.getValue().length).toBe(5);
        expect(observable.getValue()[0]).toBe(2);
        expect(observable.getValue()[1]).toBe(4);
        expect(observable.getValue()[2]).toBe(6);
        expect(observable.getValue()[3]).toBe(8);
        expect(observable.getValue()[4]).toBe(10);
    });

    it('notifies listeners on add', function(){
        var listener = jasmine.createSpy('listener');

        observable.add('baz');
        observable.listen(listener);
        observable.add('foo', 'bar');

        expect(listener).toHaveBeenCalled();
        expect(listener).toHaveBeenCalledWith(['baz', 'foo', 'bar'], ['baz'], { reason: js.DataChangeReason.add, portion: ['foo', 'bar']});
    });

    it('notifies listeners on remove', function(){
        var listener = jasmine.createSpy('listener');

        observable.setValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        observable.listen(listener);
        observable.remove(1, 3, 5, 7, 9);

        expect(listener).toHaveBeenCalled();
        expect(listener).toHaveBeenCalledWith([2, 4, 6, 8, 10], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], { reason: js.DataChangeReason.remove, portion: [1, 3, 5, 7, 9] });
    });

    it('notifies listeners on clear', function(){
        var listener = jasmine.createSpy('listener');

        observable.setValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        observable.listen(listener);
        observable.clear();

        expect(listener).toHaveBeenCalled();
        expect(listener).toHaveBeenCalledWith([], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], { reason: js.DataChangeReason.remove, portion: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]});
    });

    it('deletes all items on clear', function(){
        observable.setValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        observable.clear();

        expect(observable.getValue().length).toBe(0);
    });
});

