/** Tests different use cases of view rendering. */
var testCase = new TestCase("system.Views");

testCase.prototype.testViewWithResetStateShouldRenderTemplate = function(){
    $("body").append(
        "<script id='simpleView' type='text/view'>" +
            "<div class='value'></div>" +
        "</script>");

    $("body").append("<div id='viewDestination'></div>");

    var viewModel = {
        value: js.bindableValue(),
        resetState: function(){
            this.value.setValue("bar2");
        }
    };

    var view = js.createView({
        template: "#simpleView",
        init: function(viewModel){
            this.bind(viewModel.value).to(".value");
        }
    }, viewModel);

    view.renderTo("#viewDestination");

    assertEquals("Value elements count", 1, $("#viewDestination .value").length);
    assertEquals("Rendered value", "bar2", $("#viewDestination .value").text());
};

testCase.prototype.testNestedViewShouldRenderTemplate = function(){
    $("body").append(
        "<script id='parentView' type='text/view'>" +
            "<div class='parent'></div>" +
        "</script>");

    $("body").append(
        "<script id='childView' type='text/view'>" +
            "<div class='child'>" +
                "<div class='value'></div>" +
            "</div>" +
        "</script>");

    $("body").append("<div id='viewDestination'></div>");

    var viewModel = {
        value: js.bindableValue(),
        resetState: function(){
            this.value.setValue("foo");
        }
    };

    var childView = js.createView({
        template: "#childView",
        init: function(childViewModel){
            this.bind(childViewModel.value).to(".value");
        }},
        viewModel);

    var parentView = js.createView({template: "#parentView"});
    parentView.addChild(".parent", childView);

    parentView.renderTo("#viewDestination");

    assertTrue("Page contains parent view", $("#viewDestination .parent").length === 1);
    assertTrue("Parent contains child", $("#viewDestination .parent .child").length === 1);
    assertEquals("Rendered value", "foo", $("#viewDestination .parent .child .value").text());
};
