describe('api - js.dom(checkbox).observes(target)', function(){
    "use strict";

    beforeEach(function(){
        ui('<input id="checkbox" type="checkbox" />');
    });

    it('should change checkbox value if fetches checkedAttribute', function(){
        var foo = js.observableValue();
        js.dom('#checkbox').observes(foo, { fetch: "checkedAttribute" });

        foo.setValue(true);
        expect($("#checkbox").is(':checked')).toBe(true);

        foo.setValue(false);
        expect($("#checkbox").is(':checked')).toBe(false);
    });

    it('should change checkbox value by default', function(){
        var foo = js.observableValue();
        js.dom('#checkbox').observes(foo, { fetch: "checkedAttribute" });

        foo.setValue(true);
        expect($("#checkbox").is(':checked')).toBe(true);

        foo.setValue(false);
        expect($("#checkbox").is(':checked')).toBe(false);
    });
});
