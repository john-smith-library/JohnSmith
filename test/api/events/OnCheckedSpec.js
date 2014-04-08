describe('api - js.dom(selector).on("change", { fetch: "checkedAttribute" })', function(){
    "use strict";

    var doChange = function doChange(checked){
        $('#checkbox')
            .attr('checked', checked)
            .change();
    };

    beforeEach(function(){
        ui('<input id="checkbox" type="checkbox" />');
    });

    it('should call callback', function(){
        var callback = jasmine.createSpy('callback');
        js.dom('#checkbox').on('change', { fetch: "checkedAttribute" }).react(callback);

        doChange(true);

        expect(callback).toHaveBeenCalled();
    });

    it('should pass value to callback', function(){
        var callback = jasmine.createSpy('callback');
        js.dom('#checkbox').on('change', { fetch: "checkedAttribute" }).react(callback);

        doChange(true);
        expect(callback.calls.mostRecent().args).toEqual([true]);

        doChange(false);
        expect(callback.calls.mostRecent().args).toEqual([false]);
    });

    it('should detect event and pass value to callback', function(){
        var callback = jasmine.createSpy('callback');
        js.dom('#checkbox').on('change').react(callback);

        doChange(true);
        expect(callback.calls.mostRecent().args).toEqual([true]);

        doChange(false);
        expect(callback.calls.mostRecent().args).toEqual([false]);
    });
});