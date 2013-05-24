var testCase = new TestCase("system.ListBinding");

var SimpleFormatter = function(){
    this.format = function(value){
        return $("<li></li>").text(value);
    }
}

testCase.prototype.testStaticArrayShouldRenderValue = function(){
    $("body").append("<div id='listBinding'><ul></ul></div>");

    js.bind(["foo", "bar"]).to({
        to: "#listBinding ul",
        formatter: new SimpleFormatter()
    });

    assertEquals("Bound value", "<li class=\"dataItem\">foo</li><li class=\"dataItem\">bar</li>", $("#listBinding ul").html());
}

testCase.prototype.testShouldRenderValue = function(){
    $("body").append("<div id='listBinding'><ul></ul></div>");

    var list = js.bindableList();

    js.bind(list).to({
        to: "#listBinding ul",
        formatter: new SimpleFormatter()
    });

    list.add("foo", "bar");

    assertEquals("Bound value", "<li class=\"dataItem\">foo</li><li class=\"dataItem\">bar</li>", $("#listBinding ul").html());
}

testCase.prototype.testViewFormatterShouldRenderValue = function(){
    $("body").append(
        "<script id='fooView' type='text/view'>" +
            "<li>" +
                "<span class='value1'></span>" +
                "<span class='value2'></span>" +
            "</li>" +
        "</script>");

    $("body").append("<div id='listBinding'><ul></ul></div>");

    var viewModel = js.bindableList();

    var View = function(viewModel){
        this.template = "#fooView";
        this.init = function(viewModel){
            this.bind(viewModel.foo).to(".value1");
            this.bind(viewModel.bar).to(".value2");
        };
    };

    js.bind(viewModel).to("#listBinding ul", View);

    viewModel.add({
        foo: "foo1",
        bar: "bar1"
    }, {
        foo: "foo2",
        bar: "bar2"
    });

    console.log($("#listBinding ul").html());
    assertEquals("Bound value", 2, $("#listBinding ul li").length);
    assertEquals("Bound value", "foo1", $($("#listBinding ul li")[0]).find(".value1").text());
    assertEquals("Bound value", "bar1", $($("#listBinding ul li")[0]).find(".value2").text());
    assertEquals("Bound value", "foo2", $($("#listBinding ul li")[1]).find(".value1").text());
    assertEquals("Bound value", "bar2", $($("#listBinding ul li")[1]).find(".value2").text());
}

testCase.prototype.testAdvancedConfigShouldRenderValue = function(){
    $("body").append("<div id='listBinding'><ul></ul></div>");

    var list = js.bindableList();

    js.bind(list).to({
        handler: "render",
        type: "list",
        to: "#listBinding ul",
        formatter: new SimpleFormatter()
    });

    list.add("foo", "bar");

    assertEquals("Bound value", "<li class=\"dataItem\">foo</li><li class=\"dataItem\">bar</li>", $("#listBinding ul").html());
}

