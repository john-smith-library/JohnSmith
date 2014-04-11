var testCase = TestCase("system.JS_BIND.FormFieldTextBidirectional");

testCase.prototype.setUp = function(){
    /*:DOC += <form>
                  <input id="textbox" type="text" />
              </form>*/

    this.bindable = js.bindableValue();
};

testCase.prototype.changeTextbox = function(value){
    $("#textbox").val(value).change();
};
/*
testCase.prototype.testTextBidirectional_NoOptions_ShouldChangeValue = function(){
    js.bind(this.bindable).to("#textbox");
    this.changeTextbox("bar");
    assertEquals("Bindable value", "bar", this.bindable.getValue());
};*/

/*
testCase.prototype.testTextBidirectional_CustomCommand_ShouldCallCommand = function(){
    var command = sinon.spy();

    js.bind(this.bindable).to("#textbox", { command: command });
    this.changeTextbox("bar");
    assertTrue("Custom command was called", command.calledOnce);
    assertTrue("Custom command was called with value", command.calledWithExactly("bar"));
};*/

testCase.prototype.testTextBidirectional_CustomCommandAndContext_ShouldCallCommandOnContext = function(){
    var viewModel = {
        doCommand: sinon.spy()
    };

    js.bind(this.bindable).to("#textbox", { command: viewModel.doCommand, commandContext: viewModel });

    this.changeTextbox("bar");
    assertTrue("Custom command was called", viewModel.doCommand.calledOnce);
    assertTrue("Custom command was called on view model", viewModel.doCommand.calledOn(viewModel));
};

testCase.prototype.testTextBidirectional_CustomEvent_ShouldChangeValueOnCustomEventOnly = function(){
    this.bindable.setValue("foo");
    js.bind(this.bindable).to("#textbox", { event: "keyup" });
    this.changeTextbox("bar");
    assertEquals("Bindable value after change", "foo", this.bindable.getValue());
    $("#textbox").trigger("keyup");
    assertEquals("Bindable value after keyup", "bar", this.bindable.getValue());
};

testCase.prototype.testTextBidirectional_NoBidirectional_ShouldNotChangeValue = function(){
    this.bindable.setValue("foo");
    js.bind(this.bindable).to("#textbox", { bidirectional: false });
    this.changeTextbox("bar");
    assertEquals("Bindable value", "foo", this.bindable.getValue());
};