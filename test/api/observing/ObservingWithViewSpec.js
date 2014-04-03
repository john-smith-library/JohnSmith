describe('api - js.dom(selector)(target, ViewClass)', function(){
    "use strict";

    beforeEach(function(){
        ui('<div id="target"></div>');
    });

    it('should render view with static value', function(){
        var View = function(){
            this.template = '<span>foo</span>';
        };

        js.dom('#target')('bar', View);

        expect($('#target').html()).toBe('<span>foo</span>');
    });

    it('should render view with observable value', function(){
        var View = function(){
            this.template = '<span>foo</span>';
        };

        var observable = js.observableValue();
        js.dom('#target')(observable, View);
        observable.setValue('bar');

        expect($('#target').html()).toBe('<span>foo</span>');
    });

    it('should pass target to view as a viewModel', function(){
        var initSpy = jasmine.createSpy('init');
        var View = function(){
            this.template = '<span>foo</span>';
            this.init = initSpy;
        };

        js.dom('#target')('bar', View);

        expect(initSpy).toHaveBeenCalledWith(jasmine.any(Function), 'bar');
    });

    it('should pass observable value to view as a viewModel', function(){
        var initSpy = jasmine.createSpy('init');
        var View = function(){
            this.template = '<span>foo</span>';
            this.init = initSpy;
        };

        var observable = js.observableValue();
        js.dom('#target')(observable, View);
        observable.setValue('foo');

        expect(initSpy).toHaveBeenCalledWith(jasmine.any(Function), 'foo');
    });

    it('should release viewModel on value change', function(){
        var ViewModel = function(){
            this.releaseState = jasmine.createSpy('releaseState');
        };

        var View = function(){
            this.template = '<div>foo</div>';
            this.init = function(){};
        };

        var observable = js.observableValue();

        js.dom('#target')(observable, View);

        var viewModelInstance = new ViewModel();

        // set value will cause view rendering
        observable.setValue(viewModelInstance);

        expect(viewModelInstance.releaseState).not.toHaveBeenCalled();

        // setting value to null will cause view unrendering
        observable.setValue(null);

        expect(viewModelInstance.releaseState).toHaveBeenCalled();
    });

    it('should release viewModel on dom disposing', function(){
        var ViewModel = function(){
            this.releaseState = jasmine.createSpy('releaseState');
        };

        var View = function(){
            this.template = '<div>foo</div>';
            this.init = function(){};
        };

        var observable = js.observableValue();

        js.dom('#target')(observable, View);

        var viewModelInstance = new ViewModel();

        // set value will cause view rendering
        observable.setValue(viewModelInstance);

        expect(viewModelInstance.releaseState).not.toHaveBeenCalled();

        js.dom.dispose();

        expect(viewModelInstance.releaseState).toHaveBeenCalled();
    });
});