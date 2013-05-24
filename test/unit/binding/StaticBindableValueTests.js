var testCase = TestCase("unit.binding.StaticBindableValue");

testCase.prototype.testStoreValue = function() {
    var bindable = new JohnSmith.Binding.StaticBindableValue("foo");
    assertEquals("Value", "foo", bindable.getValue());
};

testCase.prototype.testStateIsNormal = function() {
    var bindable = new JohnSmith.Binding.StaticBindableValue("foo");
    assertEquals("Value", "normal", bindable.getState());
};

