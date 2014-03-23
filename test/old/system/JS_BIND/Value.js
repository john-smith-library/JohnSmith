var testCase = TestCase("system.JS_BIND.Value");

testCase.prototype.setUp = function(){
    /*:DOC += <div id='testDynamicBinding'><span class='value'></span></div>*/
    this.foo = js.bindableValue();
};

//testCase.prototype.testCanRenderEmptyString = function(){
//    js.bind(this.foo).to("#testDynamicBinding .value");
//    this.foo.setValue("");
//
//    assertEquals("Bound value result", "", $("#testDynamicBinding .value").text());
//};

testCase.prototype.testShouldRenderEncodedValue = function(){
    js.bind(this.foo).to("#testDynamicBinding .value");
    this.foo.setValue("<span>content</span>");

    assertEquals("Bound value result", "<span>content</span>", $("#testDynamicBinding .value").text());
};

testCase.prototype.testNoEncoding_ShouldRenderRawValue = function(){
    js.bind(this.foo).to("#testDynamicBinding .value", { encode: false });
    this.foo.setValue("<span>content</span>");

    assertEquals("Bound value result", "<span>content</span>", $("#testDynamicBinding .value").html());
};

//testCase.prototype.testShouldRenderValue = function(){
//    js.bind(this.foo).to("#testDynamicBinding .value");
//    this.foo.setValue("bar");
//
//    assertEquals("Bound value result", "bar", $("#testDynamicBinding .value").text());
//};

testCase.prototype.testShouldRenderDefaultValue = function(){
    this.foo.setValue("default bar");
    js.bind(this.foo).to("#testDynamicBinding .value");

    assertEquals("Bound value result", "default bar", $("#testDynamicBinding .value").text());
};

testCase.prototype.testCustomFormatterShouldRenderValue = function(){
    js.bind(this.foo).to({
        to: "#testDynamicBinding .value",
        formatter: {
            format: function(value) {
                return (value || "").toUpperCase();
            }
        }
    });

    this.foo.setValue("bar");

    assertEquals("Bound value result", "BAR", $("#testDynamicBinding .value").text());
};

testCase.prototype.testCustomFormatterReturnsJQueryObjectShouldRenderValue = function(){
    console.log('html before: ' + $("#testDynamicBinding")[0].outerHTML);

    $("#testDynamicBinding").empty();
    js.bind(this.foo).to({
        to: "#testDynamicBinding",
        valueType: "unknown",
        formatter: {
            format: function(value) {
                return $("<span></span>")
                        .css("color", "black")
                        .text((value || "").toString());
            }
        }
    });

    this.foo.setValue("bar");

    console.log('html is: ' + $("#testDynamicBinding")[0].outerHTML);
    assertEquals("Count of span elements", 1, $("#testDynamicBinding").find("span").length);
    assertEquals("Bound value", "bar", $("#testDynamicBinding").find("span").text());
    assertNotUndefined("Bound value", $("#testDynamicBinding").find("span").css("color"));
};