describe('api - js.dom(textbox).observes(target)', function(){
    "use strict";

    beforeEach(function(){
        ui('<textarea id="textarea"></textarea>');
    });

    it('should change textbox value if fetches value', function(){
        js.dom('#textarea').observes('foo', { fetch: "value" });

        expect($('#textarea').val()).toBe('foo');
    });

    it('should change textbox value by default', function(){
        js.dom('#textarea').observes('foo');

        expect($('#textarea').val()).toBe('foo');
    });
});
