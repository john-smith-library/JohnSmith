var bindingBindableValue = TestCase("unit.binding.BindableValue");

bindingBindableValue.prototype.testCanAddListener = function() {
    var bindableValue = new JohnSmith.Binding.BindableValue();
    bindableValue.addListener({});
    assertEquals("Should contain single listener", 1, bindableValue.getListenersCount());
};

bindingBindableValue.prototype.testCanDeleteListener = function() {
    var bindableValue = new JohnSmith.Binding.BindableValue();
    var listener = {};
    bindableValue.addListener(listener);
    bindableValue.removeListener(listener);
    assertEquals("Listeners count", 0, bindableValue.getListenersCount());
};

bindingBindableValue.prototype.testCanReturnValue = function() {
    var bindableValue = new JohnSmith.Binding.BindableValue();
    bindableValue.setValue("foo");
    assertEquals("Actual value", "foo", bindableValue.getValue());
};

bindingBindableValue.prototype.testCanReturnState = function() {
    var bindableValue = new JohnSmith.Binding.BindableValue();
    bindableValue.setState("loading");
    assertEquals("Actual state", "loading", bindableValue.getState());
};

bindingBindableValue.prototype.testCallListenerOnValueChange = function() {
    var listenerWasCalled = false;
    var bindableValue = new JohnSmith.Binding.BindableValue();
    var listener = {
        valueChanged: function(oldValue, newValue, changeType){
            listenerWasCalled = true;
        }
    };

    bindableValue.addListener(listener);
    bindableValue.setValue("foo");
    assertTrue("Listener was called", listenerWasCalled);
};

bindingBindableValue.prototype.testPassNewAndOldValuesToListener = function() {
    var bindableValue = new JohnSmith.Binding.BindableValue();
    var listener = {
        valueChanged: function(oldValue, newValue, changeType){
            assertEquals("Old value", oldValue, "foo");
            assertEquals("New value", newValue, "bar");
        }
    };

    bindableValue.setValue("foo");
    bindableValue.addListener(listener);
    bindableValue.setValue("bar");
};

bindingBindableValue.prototype.testPassStateToListener = function() {
    var bindableValue = new JohnSmith.Binding.BindableValue();
    var listenerCalled = false;
    var listener = {
        stateChanged: function(oldValue, newValue){
            assertEquals("Old value", oldValue, "loading");
            assertEquals("New value", newValue, "ready");
            listenerCalled = true;
        }
    };

    bindableValue.setState("loading");
    bindableValue.addListener(listener);
    bindableValue.setState("ready");

    assertTrue("Listener called", listenerCalled)
};
