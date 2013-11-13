var testCase = new TestCase("system.JS_CREATE_VIEW.InitState");

testCase.prototype.testViewWithInitStateShouldRenderTemplate = function(){
    $("body").append(
        "<script id='simpleView' type='text/view'>" +
            "<div class='value'></div>" +
        "</script>");

    $("body").append("<div id='viewDestination'></div>");

    var viewModel = {
        value: js.bindableValue(),
        initState: function(){
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
