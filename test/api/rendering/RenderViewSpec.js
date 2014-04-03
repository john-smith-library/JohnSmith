describe("api - js.dom(selector).render(ViewClass)", function(){
    it('Could render view with template selector', function(){
        ui('<script id="template" type="text/view"><span>view</span></script>' +
            '<div id="target"></div>');

        var View = function(){
            this.template = "#template";
        };

        js.dom("#target").render(View);
        expect($('#target').html()).toBe('<span>view</span>');
    });

    it('Could render view with inline markup', function(){
        ui('<div id="target"></div>');

        var View = function(){
            this.template = "<span>view</span>";
        };

        js.dom("#target").render(View);
        expect($('#target').html()).toBe('<span>view</span>');
    });

    it('Should call init view method', function(){
        ui('<div id="target"></div>');

        var initStateSpy = sinon.spy();
        var View = function(){
            this.template = "<span>view</span>";
            this.init = initStateSpy;
        };

        js.dom("#target").render(View);

        expect(initStateSpy.calledOnce).toBeTruthy();
    });

    it('Should pass dom to init view method', function(){
        ui('<div id="target"></div>');

        var initStateSpy = sinon.spy();

        var View = function(){
            this.template = "<span>view</span>";
            this.init = initStateSpy;
        };

        js.dom("#target").render(View);

        expect(initStateSpy.calledOnce).toBeTruthy();
        expect(initStateSpy.firstCall.args[0]).toBeTruthy();
        expect(initStateSpy.firstCall.args[0].find).toBeTruthy();
    });
});