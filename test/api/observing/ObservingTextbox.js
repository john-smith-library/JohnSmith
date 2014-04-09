describe('api - js.dom(textbox).observes(target)', function(){
    "use strict";

    beforeEach(function(){
        ui('<input id="textbox" type="text" />');
    });

    it('should change textbox value if fetches value', function(){
        js.dom('#textbox').observes('foo', { fetch: "value" });

        expect($('#textbox').val()).toBe('foo');
    });

    it('should change textbox value by default', function(){
        js.dom('#textbox').observes('foo');

        expect($('#textbox').val()).toBe('foo');
    });
});