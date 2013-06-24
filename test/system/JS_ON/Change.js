var testCase = TestCase("system.JS_ON.Change");

testCase.prototype.setUp = function(){
    /*:DOC += <input id="textbox" type="text" /> */
};

testCase.prototype.doChange = function(){
    $("#textbox").val("foo").change();
}

testCase.prototype.test_OnChange_ShouldCallCallback = function(){
    var callback = sinon.spy();
    js.on("#textbox", "change", { fetch: "value" }).do(callback);
    this.doChange();

    assertTrue("Value passed to callback", callback.calledOnce);
};

testCase.prototype.test_OnChange_ShouldPassValueToCallback = function(){
    var callback = sinon.spy();
    js.on("#textbox", "change", { fetch: "value" }).do(callback);
    this.doChange();

    assertTrue("Value passed to callback", callback.calledWithExactly("foo"));
};
