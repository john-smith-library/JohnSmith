describe('api - js.dom(selector).on("click")', function(){
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

    it('should respect context', function(){
        var ViewModel = function(){
            this.foo = 'bar';
            this.callback = function(){
                expect(this).toBeDefined();
                expect(this.foo).toBe('bar');
            };
        };

        var viewModel = new ViewModel();

        js.dom('#send').on('click').react(viewModel.callback, viewModel);
        doClick();
    });

    it('respects view scope', function(){
        ui('<a id="link1" class="link">click me</a>' +
           '<div id="target"></div>');

        var linkSelector = ".link";

        var ViewModelWithFunction = function(){
            this.send = jasmine.createSpy('send');
        };

        var View = function(){
            this.template = "<a id='link2' class='link'>click me</a>";

            this.init = function(dom, viewModel){
                dom(linkSelector).on('click').react(viewModel.send);
            };
        };

        var viewModel = new ViewModelWithFunction();
        js.dom('#target').render(View, viewModel);

        // just check if both view and global links return with the selector
        expect($(linkSelector).length).toBeGreaterThan(1);

        // this click should not trigger the command
        // because the link is out of the view scope
        $("#link1").click();

        expect(viewModel.send).not.toHaveBeenCalled();

        // this click should trigger the command
        $("#link2").click();

        expect(viewModel.send).toHaveBeenCalled();
    });
});