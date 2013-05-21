var testCase = TestCase("Binding/BindableList");

var ListenerMock = function(){
    this.calls = [];

    this.valueChanged = function(oldValue, newValue, changeType){
        this.calls.push({
            oldValue: oldValue,
            newValue: newValue,
            changeType: changeType
        });
    };
};

testCase.prototype.testSetValueThrowsErrorIfValueIsNotArray = function() {
    var bindable = new JohnSmith.Binding.BindableList();

    assertException(
        "Set value to string",
        function(){
            bindable.setValue("foo");
        }
    )
};

testCase.prototype.testHasValueByDefault = function() {
    var bindable = new JohnSmith.Binding.BindableList();

    assertNotNull("Value", bindable.getValue());
    assertArray("Value", bindable.getValue());
};

testCase.prototype.testCanAddMultipleItems = function() {
    var bindable = new JohnSmith.Binding.BindableList();

    bindable.add("foo", "bar");

    assertEquals("Items count", 2, bindable.getValue().length);
};

testCase.prototype.testCanDeleteMultipleItems = function() {
    var bindable = new JohnSmith.Binding.BindableList();

    bindable.setValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    bindable.remove(1, 3, 5, 7, 9);

    assertEquals("Items count", 5, bindable.getValue().length);
    assertEquals("Item[0]", 2, bindable.getValue()[0]);
    assertEquals("Item[1]", 4, bindable.getValue()[1]);
    assertEquals("Item[2]", 6, bindable.getValue()[2]);
    assertEquals("Item[3]", 8, bindable.getValue()[3]);
    assertEquals("Item[4]", 10, bindable.getValue()[4]);
};

testCase.prototype.testShouldNotifyListenerOnAdd = function() {
    var bindable = new JohnSmith.Binding.BindableList();
    var listener = new ListenerMock();

    bindable.addListener(listener);

    bindable.add("foo", "bar");

    assertEquals("Listener calls count", 1, listener.calls.length);
    assertArray("Listener new value", listener.calls[0].newValue);
    assertEquals("Listener change type", JohnSmith.Binding.DataChangeReason.add, listener.calls[0].changeType);
    assertEquals("foo", listener.calls[0].newValue[0]);
    assertEquals("bar", listener.calls[0].newValue[1]);
};

testCase.prototype.testShouldNotifyListenerOnDelete = function() {
    var bindable = new JohnSmith.Binding.BindableList();
    var listener = new ListenerMock();

    bindable.setValue([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    bindable.addListener(listener);
    bindable.remove(1, 3, 5, 7, 9);

    assertEquals("Listener calls count", 1, listener.calls.length);
    assertEquals("Listener change type", JohnSmith.Binding.DataChangeReason.remove, listener.calls[0].changeType);
    assertArray("Listener new value", listener.calls[0].newValue);
    assertEquals("Listener new value size", 5, listener.calls[0].newValue.length);
    assertEquals(1, listener.calls[0].newValue[0]);
    assertEquals(3, listener.calls[0].newValue[1]);
    assertEquals(5, listener.calls[0].newValue[2]);
    assertEquals(7, listener.calls[0].newValue[3]);
    assertEquals(9, listener.calls[0].newValue[4]);
};