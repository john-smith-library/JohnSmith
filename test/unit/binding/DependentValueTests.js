var testCase = TestCase("unit.binding.DependentValueTests");

testCase.prototype.testCallsListenerOnDependenciesChange = function() {
    var firstName = new JohnSmith.Binding.BindableValue();
    var lastName = new JohnSmith.Binding.BindableValue();
    var fullName = new JohnSmith.Binding.DependentValue(
        function(){ return null; },
        [firstName, lastName]);

    var changeSpy = sinon.spy();
    fullName.addListener({
        valueChanged: changeSpy
    });

    firstName.setValue("John");
    assertEquals("Change called", 1, changeSpy.callCount);

    lastName.setValue("Smith");
    assertEquals("Change called", 2, changeSpy.callCount);
};

testCase.prototype.test_getValue_shouldReturnEvaluatedValue = function() {
    var firstName = new JohnSmith.Binding.BindableValue();
    var lastName = new JohnSmith.Binding.BindableValue();
    var fullName = new JohnSmith.Binding.DependentValue(
        function(firstNameValue, lastNameValue){
            return firstNameValue + " " + lastNameValue;
        },
        [firstName, lastName]);

    firstName.setValue("John");
    lastName.setValue("Smith");

    assertEquals("Evaluated value", "John Smith", fullName.getValue());
};