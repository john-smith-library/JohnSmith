var testCase = TestCase("system.JS_BIND.FormFieldSelectBidirectional");

testCase.prototype.setUp = function(){
    /*:DOC += <form>
                  <select id="select">
                    <option value="1">option1</option>
                    <option value="2">option2</option>
                  </select>
              </form>*/

    this.bindable = js.bindableValue();
};

testCase.prototype.testSelectBidirectional_ChangeBindable_ShouldChangeSelectedOption = function(){
    js.bind(this.bindable).to("#select");

    console.log($("#select").outerHTML);
    this.bindable.setValue("1");

    assertEquals("Selected option", "1", $("#select").val());
};