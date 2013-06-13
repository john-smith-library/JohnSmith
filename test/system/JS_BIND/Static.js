var testCase = TestCase("system.JS_BIND.Static");

testCase.prototype.test_Text_ShouldRenderValue = function(){
    /*:DOC+= <div id='testStaticBinding'><span class='value'></span></div> */

    js.bind("foo").to("#testStaticBinding .value");

    assertEquals("Bound value result", "foo", $("#testStaticBinding .value").text());
};

testCase.prototype.test_Html_ShouldRenderEncodedValue = function(){
    /*:DOC+= <div id='testStaticBinding'><span class='value'></span></div> */

    js.bind("<span>content</span>").to("#testStaticBinding .value");

    assertEquals("Bound value result", "<span>content</span>", $("#testStaticBinding .value").text());
};

testCase.prototype.test_HtmlEncode_ShouldRenderHtml = function(){
    /*:DOC+= <div id='testStaticBinding'><span class='value'></span></div> */

    js.bind("<span>content</span>").to("#testStaticBinding .value", { encode: false });

    assertEquals("Bound value result", "<span>content</span>", $("#testStaticBinding .value").html());
};
