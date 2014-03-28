describe('api - js.dom(selector).render(ViewClass, viewModel)', function(){
    it('Should pass ViewModel init view method', function(){
        ui('<div id="target"></div>');

        var initStateSpy = sinon.spy();
        var viewModel = 'bar';

        var View = function(){
            this.template = "<span>view</span>";
            this.init = initStateSpy;
        };

        js.dom('#target' ).render(View, viewModel);

        expect(initStateSpy.calledOnce).toBeTruthy();
        expect(initStateSpy.firstCall.args[1]).toBe(viewModel);
    });
});