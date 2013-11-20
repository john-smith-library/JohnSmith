var testCase = TestCase("system.JS_ON.Click");

testCase.prototype.setUp = function(){
    /*:DOC+= <a href="#" id="send">click me</a> */
};

testCase.prototype.doClick = function(){
    $("#send").click();
};

testCase.prototype.test_OnClickDoCommand_ShouldCallFunction = function(){
    var callback = sinon.spy();
    js.on("#send", "click").call({ execute: callback });
    this.doClick();
    assertTrue("Callback was called", callback.calledOnce);
};

testCase.prototype.test_OnClickDoFunction_ShouldCallFunction = function(){
    var callback = sinon.spy();
    js.on("#send", "click").call(callback);
    this.doClick();

    assertTrue("Callback was called", callback.calledOnce);
};

testCase.prototype.test_OnClickDoViewModelMethod_ShouldPreserveContext = function(){
    var ViewModel = function(){
        this.foo = "bar";
        this.send = sinon.spy();
    };

    var viewModelInstance = new ViewModel();
    js.on("#send", "click").call(viewModelInstance.send, viewModelInstance);
    this.doClick();

    assertTrue("Callback was called on viewModel", viewModelInstance.send.calledOn(viewModelInstance));
};

testCase.prototype.test_OnClickDoCommand_ShouldPreserveContext = function(){
    var command = {
        foo: "bar",
        execute: sinon.spy()
    };

    js.on("#send", "click").call(command);
    this.doClick();

    assertTrue("Callback was called on command", command.execute.calledOn(command));
};