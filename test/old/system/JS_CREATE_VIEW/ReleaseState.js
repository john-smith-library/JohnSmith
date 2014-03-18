var testCase = new TestCase("system.JS_CREATE_VIEW.ReleaseState");

testCase.prototype.test_disposeView_shouldCallReleaseState = function(){
    var ViewModel = function(){
        this.releaseState = sinon.spy();
    };

    var View = function(){
        this.template = "<div>template</div>";
        this.init = function(){};
    };

    var viewModelInstance = new ViewModel();
    var viewInstance = js.createView(View, viewModelInstance);

    viewInstance.renderTo("body");

    assertTrue("releaseState was not called", viewModelInstance.releaseState.notCalled);

    viewInstance.dispose();

    assertTrue("releaseState was called", viewModelInstance.releaseState.calledOnce);
};

testCase.prototype.test_unrenderView_shouldCallReleaseState = function(){
    var ViewModel = function(){
        this.releaseState = sinon.spy();
    };

    var View = function(){
        this.template = "<div>template</div>";
        this.init = function(){};
    };

    var bindable = js.bindableValue();

    js.bind(bindable).to("body", View);

    var viewModelInstance = new ViewModel();

    // set value will cause view rendering
    bindable.setValue(viewModelInstance);

    assertTrue("releaseState was not called", viewModelInstance.releaseState.notCalled);

    // setting value to null will cause view unrendering
    bindable.setValue(null);

    assertTrue("releaseState was called", viewModelInstance.releaseState.calledOnce);
};
