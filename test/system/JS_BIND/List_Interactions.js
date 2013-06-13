var testCase = TestCase("system.JS_BIND.List_Interaction");

var SimpleView = function(){
    this.template = "#listItemTemplate";
    this.init = function(viewModel){
        this.bind(viewModel).to("li");
    };
};

testCase.prototype.setUp = function(){
    /*:DOC += <script id="listItemTemplate" type="text/view">
                <li></li>
              </script> */

    /*:DOC += <ul id="listDestination"></ul> */

    this.list = js.bindableList();

    js.bind(this.list).to("#listDestination", SimpleView);
};

testCase.prototype.testAdd_ShouldAppendItems = function(){
    this.list.add("foo", "bar");

    assertEquals("Rendered items count", 2, $("#listDestination").find("li").length);
};

testCase.prototype.testRemove_ShouldRemoveItems = function(){
    this.list.add("foo", "bar");
    this.list.remove("foo");

    assertEquals("Rendered items count", 1, $("#listDestination").find("li").length);
};
