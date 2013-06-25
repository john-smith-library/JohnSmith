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

testCase.prototype.testText_Bidirectional_ShouldChangeValue = function(){
    js.bind(this.bindable).to("#textbox");
    this.changeTextbox("bar");
    assertEquals("Bindable value", "bar", this.bindable.getValue());
};