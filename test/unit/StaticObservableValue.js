(function(){
    "use strict";

    describe('StaticObservableValue', function(){
        it('Stores value', function(){
            var observable = new js.StaticObservableValue('foo');
            expect(observable.getValue()).toBe('foo');
        });
    });
})();