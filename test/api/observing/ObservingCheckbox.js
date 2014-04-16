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

    it('should be bidirectional and set value to true if checked', function(){
        var observable = js.observableValue();

        js.dom('#checkbox').observes(observable);

        $('#checkbox').attr('checked', true).change();

        expect(observable.getValue()).toBe(true);
    });

    it('should be bidirectional and set value to false if not checked', function(){
        var observable = js.observableValue();

        js.dom('#checkbox').observes(observable);

        $('#checkbox').attr('checked', false).change();

        expect(observable.getValue()).toBe(false);
    });
});
