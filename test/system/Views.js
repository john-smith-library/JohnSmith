var testCase = new TestCase("Views");

testCase.prototype.testSimpleViewShouldAppendTemplateDestination = function(){
    $("body").append(
        "<script id='simpleView' type='text/view'>" +
            "<div>view content</div>" +
        "</script>");

    $("body").append("<div id='viewDestination'></div>");

    var view = js.createView("#simpleView");
    view.renderTo("#viewDestination");

    assertEquals("Rendered view", "view content", $("#viewDestination").text());
};

testCase.prototype.testViewWithBindingShouldRenderTemplate = function(){
    $("body").append(
        "<script id='simpleView' type='text/view'>" +
            "<div class='value'></div>" +
        "</script>");

    $("body").append("<div id='viewDestination'></div>");

    var view = js.createView(
        "#simpleView",
        function(view){
            view.bind("foo").to(".value");
        });

    view.renderTo("#viewDestination");

    assertEquals("Value elements count", 1, $("#viewDestination .value").length);
    assertEquals("Rendered value", "foo", $("#viewDestination .value").text());
};

testCase.prototype.testViewWithViewModelShouldRenderTemplate = function(){
    $("body").append(
        "<script id='simpleView' type='text/view'>" +
            "<div class='value'></div>" +
        "</script>");

    $("body").append("<div id='viewDestination'></div>");

    var viewModel = {
        value: js.bindableValue()
    };

    var view = js.createView(
        "#simpleView",
        function(view, viewModel){
            view.bind(viewModel.value).to(".value");
        },
        viewModel);

    view.renderTo("#viewDestination");

    viewModel.value.setValue("bar");

    assertEquals("Value elements count", 1, $("#viewDestination .value").length);
    assertEquals("Rendered value", "bar", $("#viewDestination .value").text());
};

testCase.prototype.testViewWithResetStateShouldRenderTemplate = function(){
    $("body").append(
        "<script id='simpleView' type='text/view'>" +
            "<div class='value'></div>" +
        "</script>");

    $("body").append("<div id='viewDestination'></div>");

    var viewModel = {
        value: js.bindableValue(),
        resetState: function(){
            viewModel.value.setValue("bar2");
        }
    };

    var view = js.createView(
        "#simpleView",
        function(view, viewModel){
            view.bind(viewModel.value).to(".value");
        },
        viewModel);

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
            viewModel.value.setValue("foo");
        }
    };

    var childView = js.createView(
        "#childView",
        function(view, childViewModel){
            view.bind(childViewModel.value).to(".value");
        },
        viewModel
    )

    var parentView = js.createView("#parentView");
    parentView.addChild(".parent", childView);

    parentView.renderTo("#viewDestination");

    assertTrue("Page contains parent view", $("#viewDestination .parent").length === 1);
    assertTrue("Parent contains child", $("#viewDestination .parent .child").length === 1);
    assertEquals("Rendered value", "foo", $("#viewDestination .parent .child .value").text());
};
