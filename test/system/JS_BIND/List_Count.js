var testCase = TestCase("system.JS_BIND.List_Count");

testCase.prototype.testCouldBindToListSize = function(){
    /*:DOC += <div id="size"></div> */

    var list = js.bindableList();

    js.bind(list.count()).to("#size");

    list.setValue([1, 2, 3]);

    assertEquals("Bound size value", "3", $("#size").text());
}
