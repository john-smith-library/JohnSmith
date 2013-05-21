var testCase = new TestCase("system/DynamicBinding");

testCase.prototype.testShouldRenderValue = function(){
    $("body").append("<div id='testDynamicBinding'><span class='value'></span></div>");

    var foo = js.bindableValue();
    js.bind(foo).to("#testDynamicBinding .value");
    foo.setValue("bar");

    assertEquals("Bound value result", "bar", $("#testDynamicBinding .value").text());
}

testCase.prototype.testShouldRenderDefaultValue = function(){
    $("body").append("<div id='testDynamicBinding'><span class='value'></span></div>");

    var foo = js.bindableValue();
    foo.setValue("default bar");
    js.bind(foo).to("#testDynamicBinding .value");

    assertEquals("Bound value result", "default bar", $("#testDynamicBinding .value").text());
}

testCase.prototype.testCustomFormatterShouldRenderValue = function(){
    $("body").append("<div id='testDynamicBinding'><span class='value'></span></div>");

    var foo = js.bindableValue();

    js.bind(foo).to({
        to: "#testDynamicBinding .value",
        formatter: {
            format: function(value) {
                return value.toUpperCase();
            }
        }
    });

    foo.setValue("bar");

    assertEquals("Bound value result", "BAR", $("#testDynamicBinding .value").text());
}

testCase.prototype.testCustomFormatterReturnsJQueryObjectShouldRenderValue = function(){
    $("body").append("<div id='testDynamicBinding'></div>");

    var foo = js.bindableValue();

    js.bind(foo).to({
        to: "#testDynamicBinding",
        formatter: {
            format: function(value) {
                return $("<span></span>")
                    .css("color", "black")
                    .text(value.toString());
            }
        }
    });

    foo.setValue("bar");

    assertEquals("Count of span elements", 1, $("#testDynamicBinding").find("span").length);
    assertEquals("Bound value", "bar", $("#testDynamicBinding").find("span").text());
    assertNotUndefined("Bound value", $("#testDynamicBinding").find("span").css("color"));
}