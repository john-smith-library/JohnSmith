describe('unit - Event', function(){
    "use strrict";

    var event;
    beforeEach(function(){
        event = new js.Event();
    });

    describe('trigger', function(){
        it('can trigger listeners without arguments', function(){
            var listener = sinon.spy();

            event.listen(listener);
            event.trigger();

            expect(listener.calledOnce).toBe(true);
        });

        it('passes argument to listener', function(){
            var listener = sinon.spy();

            event.listen(listener);
            event.trigger("foo");

            expect(listener.calledWithExactly("foo")).toBe(true);
        });
    });

    describe('getListenersCount', function(){
        it('should increase on adding listeners', function(){
            expect(event.getListenersCount()).toBe(0);

            event.listen(function(){});
            expect(event.getListenersCount()).toBe(1);

            event.listen(function(){});
            expect(event.getListenersCount()).toBe(2);
        });

        it('should decrease on disposing listeners', function(){
            expect(event.getListenersCount()).toBe(0);

            var link = event.listen(function(){});
            expect(event.getListenersCount()).toBe(1);

            link.dispose();
            expect(event.getListenersCount()).toBe(0);
        });
    });

    describe('hasListeners', function(){
        it('should be false by default', function(){
            expect(event.hasListeners()).toBe(false);
        });

        it('should be true if listeners added', function(){
            event.listen(function(){});
            expect(event.hasListeners()).toBe(true);
        });
    });

    describe('dispose', function(){
        it('should clear listeners', function(){
            event.listen(function(){});
            event.dispose();

            expect(event.hasListeners()).toBe(false);
            expect(event.getListenersCount()).toBe(0);
        });
    });
});
