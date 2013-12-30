var testCase = new TestCase("unit.EventTests");

testCase.prototype.testTrigger_HasNoArgsListener_ShouldTriggerListener = function(){
    var event = new JohnSmith.Events.Event();
    var listener = sinon.spy();

    event.listen(listener);
    event.trigger();

    assertTrue("listener called once", listener.calledOnce);
};

testCase.prototype.testTrigger_HasListenerWithArg_ShouldTriggerListener = function(){
    var event = new JohnSmith.Events.Event();
    var listener = sinon.spy();

    event.listen(listener);
    event.trigger("foo");

    assertTrue("listener called with foo argument", listener.calledWithExactly("foo"));
};

testCase.prototype.testGetListenersCount_AddListeners_ShouldIncrease = function(){
    var event = new JohnSmith.Events.Event();

    assertEquals("listeners count", 0, event.getListenersCount());

    event.listen(function(){});
    assertEquals("listeners count", 1, event.getListenersCount());

    event.listen(function(){});
    assertEquals("listeners count", 2, event.getListenersCount());
};

testCase.prototype.testHasListeners_NewEvent_ShouldReturnFalse = function(){
    var event = new JohnSmith.Events.Event();

    assertFalse("has listeners", event.hasListeners());
};

testCase.prototype.testHasListeners_EventWithListener_ShouldReturnTrue = function(){
    var event = new JohnSmith.Events.Event();
    event.listen(function(){});
    assertTrue("has listeners", event.hasListeners());
};

testCase.prototype.testDisposeSubscription_HasListener_ShouldDecreaseListenersCount = function(){
    var event = new JohnSmith.Events.Event();
    var subscription = event.listen(function(){});

    assertNotNull(subscription); // just double-check
    subscription.dispose();

    assertFalse("has listeners", event.hasListeners());
    assertEquals("listeners count", 0, event.getListenersCount());
};
