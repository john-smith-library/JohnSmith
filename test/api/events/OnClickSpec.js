describe('api - js.dom(selector).on(\'click\')', function(){
    "use strict";

    beforeEach(function(){
        ui('<a href="#" id="send">click me</a>');
    });

    var doClick = function doClick(){
        $('#send').click();
    };

    it('should execute callback on click', function(){
        var callback = jasmine.createSpy('callback');
        js.dom('#send').on('click').react(callback);
        doClick();

        expect(callback).toHaveBeenCalled();
    });
});