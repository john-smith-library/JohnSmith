/** Tests different signatures that bind the same list */
var testCase = TestCase("system.JS_BIND.List_Signatures");

var items = ["foo", "bar"];

var SimpleFormatter = function(){
    this.format = function(value){
        return $("<li></li>").text(value);
    };
};

var SimpleView = function(){
    this.template = "#listItemTemplate";
    this.init = function(context, viewModel){
        context.bind(viewModel).to("li");
    };
};

testCase.prototype.setUp = function(){
    /** We use the same markup in all tests: */
    /*:DOC += <script id="listItemTemplate" type="text/view">
                <li></li>
              </script> */

    /*:DOC += <ul id="listDestination"></ul> */

    this.list = js.bindableList();
};

testCase.prototype.tearDown = function(){
    this.list.setValue(items);

    assertEquals("Rendered items count", 2, $("#listDestination li").length);
    assertEquals("First rendered item", "foo", $("#listDestination li:eq(0)").text());
    assertEquals("First rendered item", "bar", $("#listDestination li:eq(1)").text());
};

testCase.prototype.testSelectorAndViewClass = function(){
    js.bind(this.list).to("#listDestination", SimpleView);
};

testCase.prototype.testConfigObjectWithSelectorAndViewClass = function(){
    js.bind(this.list).to({
        to: "#listDestination",
        view: SimpleView
    });
};

testCase.prototype.testConfigObjectWithSelectorAndFormatter = function(){
    js.bind(this.list).to({
        to: "#listDestination",
        valueType: "unknown",
        formatter: new SimpleFormatter()
    });
};

testCase.prototype.testStaticArrayConfigObjectWithSelectorAndFormatter = function(){
    js.bind(items).to({
        to: "#listDestination",
        valueType: "unknown",
        formatter: new SimpleFormatter()
    });
};

testCase.prototype.testConfigObjectFull = function(){
    js.bind(this.list).to({
        handler: "render",
        type: "list",
        valueType: "unknown",
        to: "#listDestination",
        formatter: new SimpleFormatter()
    });
};

testCase.prototype.testSelectorAndConfigObject = function(){
    js.bind(this.list).to(
        "#listDestination",
        {
            valueType: "unknown",
            formatter: new SimpleFormatter()
        });
};

testCase.prototype.testSelectorViewAndConfigObject = function(){
    js.bind(this.list).to(
        "#listDestination",
        SimpleView,
        {
            handler: "render"
        });
};

