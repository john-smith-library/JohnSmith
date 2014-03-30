describe('api - js.dom(selector)(target, ViewClass)', function(){
    "use strict";

    var View = function(){
        this.template = '<span>foo</span>';
    };

    beforeEach(function(){
        ui('<div id="target"></div>');
    });

    it('should render view', function(){
        js.dom('#target')('bar', View);

        expect($('#target').html()).toBe('<span>foo</span>');
    });
});