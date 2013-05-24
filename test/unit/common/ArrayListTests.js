var testCase = TestCase("unit.common.ArrayList");

testCase.prototype.testCountIsZeroForEmptyList = function(){
    var list = new JohnSmith.Common.ArrayList();
    assertEquals("List size", list.count(), 0);
}

testCase.prototype.testCountIsOneIfAnItemAdded = function(){
    var list = new JohnSmith.Common.ArrayList();
    list.add("foo");
    assertEquals(list.count(), 1);
}

testCase.prototype.testCanAddMultipleElements = function(){
    var list = new JohnSmith.Common.ArrayList();
    list.add("foo");
    list.add("bar");
    assertEquals(list.count(), 2);
}

testCase.prototype.testCanGetElementByIndex = function(){
    var list = new JohnSmith.Common.ArrayList();
    list.add("foo");
    list.add("bar");
    assertEquals(list.getAt(0), "foo");
}

testCase.prototype.testCanSetElementByIndex = function(){
    var list = new JohnSmith.Common.ArrayList();
    list.add("foo");
    list.setAt(0, "bar");
    assertEquals(list.getAt(0), "bar");
}

testCase.prototype.testCanRemoveByIndex = function(){
    var list = new JohnSmith.Common.ArrayList();
    list.add("foo");
    list.add("bar");
    list.removeAt(0);
    assertEquals(list.count(), 1);
    assertEquals(list.getAt(0), "bar");
}

testCase.prototype.testCanRemoveFirstItem = function(){
    var list = new JohnSmith.Common.ArrayList();
    list.add("foo");
    list.removeAt(0);
    assertEquals(list.count(), 0);
}

testCase.prototype.testCanInsertAtIndex = function(){
    var list = new JohnSmith.Common.ArrayList();
    list.add("foo");
    list.add("bar");
    list.insertAt(1, 42);
    assertEquals(list.count(), 3);
    assertEquals(list.getAt(0), "foo");
    assertEquals(list.getAt(1), 42);
    assertEquals(list.getAt(2), "bar");
}

testCase.prototype.testClearRemovesAllItems = function(){
    var list = new JohnSmith.Common.ArrayList();
    list.add("foo");
    list.add("bar");
    list.clear();
    assertEquals(list.count(), 0);
}