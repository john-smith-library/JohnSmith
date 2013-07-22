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

testCase.prototype.testRemove_ShouldDisposeView = function(){
    var views = [];

    // watch for rendered views to store references to it
    js.event.bus.addListener("viewRendered", function(data){
        views.push(data.view);
    });

    this.list.add("foo", "bar");

    assertEquals("Rendered views count", 2, views.length);

    // replace original views dispose method with the stub
    for (var i = 0; i < views.length; i++) {
        views[i].dispose = sinon.spy();
    }

    this.list.remove("foo");

    assertTrue("Foo view is disposed", views[0].dispose.calledOnce);
    assertFalse("Bar view is disposed", views[1].dispose.calledOnce);

};