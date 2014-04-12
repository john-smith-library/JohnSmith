describe('api - js.dom.dispose()', function(){
    "use strict";

    beforeEach(function(){
        ui('<div id="target"></div>');
    });

    it('cleans rendered values', function(){
        var observable = js.observableValue();
        observable.setValue('foo');

        js.dom('#target').observes(observable);
        js.dom.dispose();

        expect($('#target').text()).toBe('');
    });

    it('disposes observable wires', function(){
        var observable = js.observableValue();

        js.dom('#target').observes(observable);
        js.dom.dispose();

        observable.setValue('bar');

        expect($('#target').text()).toBe('');
    });

    it('disposes observable list wires', function(){
        var observable = js.observableList();

        js.dom('#target').observes(observable);
        js.dom.dispose();

        observable.setValue(['foo', 'bar']);

        expect($('#target').text()).toBe('');
    });

    it('disposes rendered views', function(){
        var View = function(){
            this.template = '<span>foo</span>';
        };

        js.dom('#target').render(View);
        expect($('#target').html()).toBeTruthy();

        js.dom.dispose();

        expect($('#target').html()).toBe('');
    });
});