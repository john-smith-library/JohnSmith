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
        observable.setValue("foo");
        expect(observable.getValue()).toBe("foo");
    });

    it('notifies listeners on value change', function(){
        var callback = sinon.spy();
        observable.listen(callback);
        observable.setValue('foo');

        expect(callback.calledOnce);
    });

    it('passes new and old values to listener', function(){
        var callback = sinon.spy();
        observable.setValue('foo');
        observable.listen(callback);
        observable.setValue('bar');

        expect(callback.calledWith('bar', 'foo'));
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
            expect(observable.hasValue());
        });
    });
});
