describe('unit - observable - ObservableValue', function(){
    var observable;

    beforeEach(function(){
        observable = new js.ObservableValue();
    });

    it('can attach listeners', function(){
        observable.listen(function(){});
        expect(observable.getListenersCount()).toBe(1);
    });

    it('can dispose listeners', function(){
        var link = observable.listen(function(){});
        link.dispose();
        expect(observable.getListenersCount()).toBe(0);
    });

    it('stores value', function(){
        observable.setValue('foo');
        expect(observable.getValue()).toBe('foo');
    });

    it('notifies listeners about initial value by default', function(){
        var callback = jasmine.createSpy('listener');
        observable.setValue('foo');
        observable.listen(callback);

        expect(callback).toHaveBeenCalled();
        expect(callback.calls.mostRecent().args[0]).toBe('foo');
    });

    it('does not notify listeners about initial if flag set', function(){
        var callback = jasmine.createSpy();
        observable.setValue('foo');
        observable.listen(callback, false);

        expect(callback).not.toHaveBeenCalled();
    });

    it('passes new value to listener', function(){
        var listener = jasmine.createSpy('listener');
        observable.setValue('foo');
        observable.listen(listener, false);
        observable.setValue('bar');

        expect(listener).toHaveBeenCalled();
        expect(listener.calls.mostRecent().args[0]).toBe('bar');
    });

    it('passes old value to listener', function(){
        var listener = jasmine.createSpy('listener');
        observable.setValue('foo');
        observable.listen(listener, false);
        observable.setValue('bar');

        expect(listener).toHaveBeenCalled();
        expect(listener.calls.mostRecent().args[1]).toBe('foo');
    });

    it('passes changes details to listener', function(){
        var listener = jasmine.createSpy('listener');

        observable.setValue('foo');
        observable.listen(listener, false);
        observable.setValue('bar');

        expect(listener).toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String), { reason: js.DataChangeReason.replace, portion: 'bar' });
    });

    describe('hasValue', function(){
        it('returns false if value is null', function(){
            observable.setValue(null);
            expect(observable.hasValue()).toBe(false);
        });

        it('returns false if value is undefined', function(){
            observable.setValue(undefined);
            expect(observable.hasValue()).toBe(false);
        });

        it('returns true if value is foo', function(){
            observable.setValue('foo');
            expect(observable.hasValue()).toBe(true);
        });
    });
});
