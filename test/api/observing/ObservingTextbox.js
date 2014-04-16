describe('api - js.dom(textbox).observes(target)', function(){
    "use strict";

    var changeTextbox = function(value){
        $("#textbox").val(value).change();
    };

    var observable;

    beforeEach(function(){
        ui('<input id="textbox" type="text" />');
        observable = js.observableValue();
    });

    it('should change textbox value if fetches value', function(){
        js.dom('#textbox').observes('foo', { fetch: "value" });

        expect($('#textbox').val()).toBe('foo');
    });

    it('should change textbox value by default', function(){
        js.dom('#textbox').observes('foo');

        expect($('#textbox').val()).toBe('foo');
    });

    it('should setup bidirectional wire by default', function(){
        js.dom('#textbox').observes(observable);
        changeTextbox('bar');
        expect(observable.getValue()).toBe('bar');
    });

    it('should call custom command on change if bidirectional', function(){
        var command = jasmine.createSpy('command');

        js.dom('#textbox').observes(observable, { command: command });

        changeTextbox("bar");

        expect(command).toHaveBeenCalled();
        expect(command).toHaveBeenCalledWith('bar');
    });

    it('should not be bidirectional if option flag is false', function(){
        observable.setValue('foo');

        js.dom('#textbox').observes(observable, { bidirectional: false });

        changeTextbox('bar');
        expect(observable.getValue()).toBe('foo');
    });

    it('should use custom event if set', function(){
        observable.setValue('foo');

        js.dom('#textbox').observes(observable, { event: 'keyup' });

        changeTextbox('bar');
        expect(observable.getValue()).toBe('foo');

        $('#textbox').trigger('keyup');
        expect(observable.getValue()).toBe('bar');
    });
});