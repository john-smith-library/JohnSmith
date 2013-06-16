var testCase = TestCase("system.JS_BIND.FormField");

testCase.prototype.testText_ValueTypeIsFormField_ShouldChangeValue = function(){
    /*:DOC += <form>
                 <input id="textBox" type="text" />
               </form>*/

    js.bind("foo").to("#textBox", { valueType: "inputValue" });

    assertEquals("Bound value", "foo", $("#textBox").val());
};

testCase.prototype.testTextarea_ValueTypeIsFormField_ShouldChangeValue = function(){
    /*:DOC += <form>
                 <textarea id="textarea" />
               </form>*/

    js.bind("foo").to("#textarea", { valueType: "inputValue" });

    console.log($("#textarea").parent().html());

    assertEquals("Bound value", "foo", $("#textarea").val());
};

testCase.prototype.testCheckbox_ValueTypeIsFormField_ShouldChangeValue = function(){
    /*:DOC += <form>
                 <input id="checkbox" type="checkbox" />
               </form>*/

    var foo = js.bindableValue();
    js.bind(foo).to("#checkbox", { valueType: "checkedAttribute" });

    foo.setValue(true);

    console.log($("#checkbox").parent().html());
    assertTrue("Checkbox is checked", $("#checkbox").is(':checked'));

    foo.setValue(false);
    console.log($("#checkbox").parent().html());
    assertFalse("Checkbox is checked", $("#checkbox").is(':checked'));
};
