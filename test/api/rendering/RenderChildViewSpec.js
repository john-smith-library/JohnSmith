describe('api - js.dom(selector).render(ViewWithChildrenClass, viewModel)', function(){
    "user strict";

    var childInitSpy;
    var childDeep;

    var ParentView = function(){
        this.template = '<div class="parent"><section class="childTarget"></section></div>';
        this.init = function(dom){
            dom('.childTarget').render(ChildView, 'foo');
        };

    };

    var ChildView = function(){
        this.template = '<div class="child"></div>';
        this.init = childInitSpy;
        this.deep = childDeep;
    };

    beforeEach(function(){
        ui('<div id="target"></div>');
        childInitSpy = jasmine.createSpy('childInit');
        childDeep = undefined;
    });

    it('should render child view', function(){
        js.dom('#target').render(ParentView);

        expect($('#target .parent').length).toBe(1);
        expect($('#target .parent .child').length).toBe(1);
    });

    it('should pass view model to child init', function(){
        js.dom('#target').render(ParentView);

        expect(childInitSpy).toHaveBeenCalled();
        expect(childInitSpy.calls.mostRecent().args[1]).toBe('foo');
    });

    it('should pass parent view model to child if deep is 1', function(){
        childDeep = 1;

        js.dom('#target').render(ParentView, 'bar');

        expect(childInitSpy).toHaveBeenCalled();
        expect(childInitSpy.calls.mostRecent().args[1]).toBe('foo');
        expect(childInitSpy.calls.mostRecent().args[2]).toBe('bar');
    });
});