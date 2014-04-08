describe('api - js.dom(selector).on("change")', function(){
    "use strict";

    var doChange = function doChange(){
        $('#textbox').val('foo').change();
    };

    beforeEach(function(){
        ui('<input id="textbox" type="text" />');
    });

    it('should call callback', function(){
        var callback = jasmine.createSpy('callback');
        js.dom('#textbox').on('change', { fetch: "value" }).react(callback);

        doChange();

        expect(callback).toHaveBeenCalled();
    });

    it('should pass value to callback', function(){
        var callback = jasmine.createSpy('callback');
        js.dom('#textbox').on('change', { fetch: "value" }).react(callback);

        doChange();

        expect(callback).toHaveBeenCalledWith('foo');
    });

    it('should detect event and call callback', function(){
        var callback = jasmine.createSpy('callback');
        js.dom('#textbox').on('change').react(callback);

        doChange();

        expect(callback).toHaveBeenCalled();
    });

    it('should detect event and pass value to callback', function(){
        var callback = jasmine.createSpy('callback');
        js.dom('#textbox').on('change').react(callback);

        doChange();

        expect(callback).toHaveBeenCalledWith('foo');
    });
});