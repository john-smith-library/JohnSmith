describe('api - js.dom(textarea).observes(target)', function(){
    "use strict";

    beforeEach(function(){
        ui('<textarea id="textarea"></textarea>');
    });

    it('should change textarea value if fetches value', function(){
        js.dom('#textarea').observes('foo', { fetch: "value" });

        expect($('#textarea').val()).toBe('foo');
    });

    it('should change textarea value by default', function(){
        js.dom('#textarea').observes('foo');

        expect($('#textarea').val()).toBe('foo');
    });
});
