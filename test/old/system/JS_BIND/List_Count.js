var testCase = TestCase("system.JS_BIND.List_Count");

testCase.prototype.setUp = function(){
    /*:DOC += <div id="size"></div> */
};

testCase.prototype.testSetValue_ShouldChangeCount = function(){
    var list = js.bindableList();

    js.bind(list.count()).to("#size");

    list.setValue([1, 2, 3]);

    assertEquals("Bound size value", "3", $("#size").text());
};

testCase.prototype.testAddItems_ShouldChangeCount = function(){
    var list = js.bindableList();

    js.bind(list.count()).to("#size");

    list.setValue([1, 2, 3]);
    list.add(4);

    assertEquals("Bound size value", "4", $("#size").text());
};

testCase.prototype.testRemoveItems_ShouldChangeCount = function(){
    var list = js.bindableList();

    js.bind(list.count()).to("#size");

    list.setValue([1, 2, 3]);
    list.remove(1);

    assertEquals("Bound size value", "2", $("#size").text());
};

testCase.prototype.testSetValueToNull_ShouldChangeCount = function(){
    var list = js.bindableList();

    js.bind(list.count()).to("#size");

    list.setValue(null);

    assertEquals("Bound size value", "0", $("#size").text());
};
