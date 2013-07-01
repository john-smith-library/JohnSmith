var testCase = TestCase("system.JS_ON.ClickView");

var ViewModelWithFunction = function(){
    this.send = sinon.spy();
};

var ViewModelWithCommand = function(){
    this.send = {
        execute: sinon.spy()
    };
};

var View = function(){
    this.template = "<a id='send'>click me</a>";
    this.init = function(viewModel){
        this.on("a", "click").do(viewModel.send);
    };
};

testCase.prototype.doClick = function(){
    $("#send").click();
};

testCase.prototype.renderView = function(viewClass, viewModel){
    var view = js.createView(new viewClass(), viewModel);
    view.renderTo("body");
}

testCase.prototype.test_OnClickDoFunction_ShouldCallCallback = function(){
    var viewModel = new ViewModelWithFunction();
    this.renderView(View, viewModel);
    this.doClick();

    assertTrue("Callback was called", viewModel.send.called);
};

testCase.prototype.test_OnClickDoFunction_ShouldCallOnViewModel = function(){
    var viewModel = new ViewModelWithFunction();
    this.renderView(View, viewModel);

    this.doClick();

    assertTrue("Callback was called", viewModel.send.calledOn(viewModel));
};

testCase.prototype.test_OnClickDoCommand_ShouldCallCallback = function(){
    var viewModel = new ViewModelWithCommand();
    this.renderView(View, viewModel);
    this.doClick();

    assertTrue("Callback was called", viewModel.send.execute.calledOnce);
};

testCase.prototype.test_OnClickDoCommand_ShouldCallOnCommand = function(){
    var viewModel = new ViewModelWithCommand();
    this.renderView(View, viewModel);
    this.doClick();

    assertTrue("Callback was called", viewModel.send.execute.calledOn(viewModel));
};

testCase.prototype.test_OnClick_ShouldRespectViewContext = function(){
    /*:DOC += <a id="link1" class="link">click me</a> */

    var linkSelector = ".link";

    var View = function(){
        this.template = "<a id='link2' class='link'>click me</a>";

        this.init = function(viewModel){

            this.on(linkSelector, "click").do(viewModel.send);
        };
    };

    var viewModel = new ViewModelWithFunction();
    this.renderView(View, viewModel);

    // just check if both view and global links return with the selector
    assertTrue("Can get multiple links with the selector", $(linkSelector).length > 1);

    // this click should not trigger the command
    // because the link is out of the view scope
    $("#link1").click();

    assertTrue("Callback was not called", viewModel.send.notCalled);

    // this click should trigger the command
    $("#link2").click();

    assertTrue("Callback was called", viewModel.send.called);
};