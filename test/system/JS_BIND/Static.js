var testCase = TestCase("system.JS_BIND.Static");

testCase.prototype.setUp = function(){
    /*:DOC+= <div id='testStaticBinding'><span class='value'></span></div> */
}

testCase.prototype.test_Text_ShouldRenderValue = function(){
    js.bind("foo").to("#testStaticBinding .value");
    assertEquals("Bound value result", "foo", $("#testStaticBinding .value").text());
};

testCase.prototype.test_Html_ShouldRenderEncodedValue = function(){
    js.bind("<span>content</span>").to("#testStaticBinding .value");
    assertEquals("Bound value result", "<span>content</span>", $("#testStaticBinding .value").text());
};

testCase.prototype.test_HtmlEncode_ShouldRenderHtml = function(){
    js.bind("<span>content</span>").to("#testStaticBinding .value", { encode: false });
    assertEquals("Bound value result", "<span>content</span>", $("#testStaticBinding .value").html());
};

/**
 * A regression test for #2 (Bind to empty string).
 * See https://github.com/guryanovev/JohnSmith/issues/2
 */
testCase.prototype.testCanBindEmptyString = function(){
    js.bind("").to("#testStaticBinding .value");
    assertEquals("Bound value result", "", $("#testStaticBinding .value").text());
}
