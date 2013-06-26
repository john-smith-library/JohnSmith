var testCase = TestCase("system.JS_CREATE_VIEW.BindBidirectional");

testCase.prototype.testBindBidirectional_NoOptions_ShouldChangeViewModelOnChange = function(){
    var viewModel = {
        foo: js.bindableValue()
    };

    var View = function(){
        this.template = "<input id='viewFooInput' type='text'/>";
        this.init = function(viewModel){
            this.bind(viewModel.foo).to("#viewFooInput");
        };
    };

    var view = js.createView(View, viewModel);
    view.renderTo("body");

    $("#viewFooInput").val("bar").change();

    assertEquals("Value after change", "bar", viewModel.foo.getValue());
};

testCase.prototype.testBindBidirectional_CustomCommand_ShouldCallCommandOnChange = function(){
    var viewModel = {
        foo: js.bindableValue(),
        doCommand: sinon.spy()
    };

    var View = function(){
        this.template = "<input id='viewFooInput' type='text'/>";
        this.init = function(viewModel){
            this.bind(viewModel.foo).to("#viewFooInput", { command: viewModel.doCommand });
        };
    };

    var view = js.createView(View, viewModel);
    view.renderTo("body");

    $("#viewFooInput").val("bar").change();

    assertTrue("Command was called", viewModel.doCommand.calledOnce);
    assertTrue("Command was called with value", viewModel.doCommand.calledWith("bar"));
    assertTrue("Command was called on viewModel", viewModel.doCommand.calledOn(viewModel));
};
