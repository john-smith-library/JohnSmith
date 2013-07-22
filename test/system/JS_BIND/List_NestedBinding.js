var testCase = TestCase("system.JS_BIND.List_NestedBinding");

/**
 * Regression test for #4 (Last list item binding).
 * See https://github.com/guryanovev/JohnSmith/issues/4
 */
testCase.prototype.testNestedBindingsShouldWorkForListItems = function(){
    /*:DOC+= <ul id="list"></ul> */

    var ItemModel = function(){
        this.value = js.bindableValue();
    };

    var ItemView = function(){
        this.template = "<li><span class='value'></span></li>";
        this.init = function(item){
            this.bind(item.value).to(".value");
        };
    };

    var list = js.bindableList();
    js.bind(list).to("#list", ItemView);

    list.setValue([
        new ItemModel(),
        new ItemModel(),
        new ItemModel()
    ]);

    list.getValue()[0].value.setValue("item1");
    list.getValue()[1].value.setValue("item2");
    list.getValue()[2].value.setValue("item3");

    console.log($("#list").html());

    assertEquals("Bound items count", 3, $("#list").find("li").length);
    assertEquals("First item value", "item1", $("#list li:eq(0)").find(".value").text());
    assertEquals("First item value", "item2", $("#list li:eq(1)").find(".value").text());
    assertEquals("First item value", "item3", $("#list li:eq(2)").find(".value").text());
};
