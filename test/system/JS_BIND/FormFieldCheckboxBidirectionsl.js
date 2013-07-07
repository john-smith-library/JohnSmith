var testCase = TestCase("system.JS_BIND.FormFieldCheckboxBidirectional");

testCase.prototype.setUp = function(){
    /*:DOC += <form>
                  <input id="checkbox" type="checkbox" />
              </form> */

    this.bindable = js.bindableValue();
};

testCase.prototype.testCheck_ShouldSetValueToTrue = function(){
    var bindable = js.bindableValue();

    js.bind(bindable).to("#checkbox");

    $("#checkbox").attr("checked", true).change();

    assertEquals("Bindable value", true, bindable.getValue());
};

testCase.prototype.testUncheck_ShouldSetValueToFalse = function(){
    var bindable = js.bindableValue();

    js.bind(bindable).to("#checkbox");

    $("#checkbox").attr("checked", false).change();

    assertEquals("Bindable value", false, bindable.getValue());
};
