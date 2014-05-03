describe('js.dom(selector).listener().observes()', function(){
    "use strict";

    beforeEach(function(){
        ui('<div id="target"></div>');
    });

    it('calls listener for static value', function(){
        var callback = jasmine.createSpy('listener');
        js.dom('#target').listener(callback).observes('foo');

        expect(callback).toHaveBeenCalled();
    });

    it('passes static value and dom to listener', function(){
        js.dom('#target')
            .listener(function(elem, value){
                expect(value).toBe('foo');
                expect(elem.$).toBeDefined();
                expect(elem.$[0]).toBe($('#target')[0]);
            })
            .observes('foo');
    });

    it('passes default value and dom to listener', function(){
        var observable = js.observableValue();
        observable.setValue('bar');

        js.dom('#target')
            .listener(function(elem, value){
                expect(value).toBe('bar');
                expect(elem.$).toBeDefined();
                expect(elem.$[0]).toBe($('#target')[0]);
            })
            .observes(observable);
    });

    it('reacts on changes', function(){
        var callback = jasmine.createSpy('listener');
        var observable = js.observableValue();

        js.dom('#target')
            .listener(callback)
            .observes(observable);

        observable.setValue('foo');
        observable.setValue('bar');

        expect(callback).toHaveBeenCalled();
        expect(callback.calls.count()).toBe(3);
    });
});