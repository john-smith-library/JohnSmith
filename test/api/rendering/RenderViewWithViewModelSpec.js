describe('api - js.dom(selector).render(ViewClass, viewModel)', function(){
    it('Should pass ViewModel to init view method', function(){
        ui('<div id="target"></div>');

        var init = sinon.spy();
        var viewModel = 'bar';

        var View = function(){
            this.template = "<span>view</span>";
            this.init = init;
        };

        js.dom('#target' ).render(View, viewModel);

        expect(init.calledOnce).toBeTruthy();
        expect(init.firstCall.args[1]).toBe(viewModel);
    });

    it('Should call init method of ViewModel object', function(){
        ui('<div id="target"></div>');

        var initStateSpy = jasmine.createSpy('initState');
        var viewModel = {
            initState: initStateSpy
        };

        var View = function(){
            this.template = "<span>view</span>";
            this.init = function(dom, viewModel){

            };
        };

        js.dom('#target' ).render(View, viewModel);

        expect(initStateSpy).toHaveBeenCalled();
    });
});