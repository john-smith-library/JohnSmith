var testCase = TestCase("system.JS_ON.Checked");

testCase.prototype.setUp = function(){
    /*:DOC += <input id="checkbox" type="checkbox" /> */
};

testCase.prototype.doChange = function(checked){
    $("#checkbox")
        .attr("checked", checked)
        .change();
}

testCase.prototype.test_OnChangeFetchChecked_ShouldCallCallback = function(){
    var callback = sinon.spy();
    js.on("#checkbox", "change", { fetch: "checkedAttribute" }).do(callback);
    this.doChange();

    assertTrue("Value passed to callback", callback.calledOnce);
};

testCase.prototype.test_OnChangeFetchChecked_ShouldPassValueToCallback = function(){
    var callback = sinon.spy();
    js.on("#checkbox", "change", { fetch: "checkedAttribute" }).do(callback);

    this.doChange(true);
    assertTrue("True passed to callback", callback.calledWithExactly(true));

    this.doChange(false);
    assertTrue("False passed to callback", callback.calledWithExactly(false));
};