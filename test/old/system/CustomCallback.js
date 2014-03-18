var testCase = TestCase("system.CustomCallback");

testCase.prototype.test_bindToCallback_invokesCallbackOnChange = function(){
    var foo = js.bindableValue();
    var callback = sinon.spy();

    js.bind(foo).to(callback);

    foo.setValue("bar");

    assertTrue("Callback was called", callback.called);
};

testCase.prototype.test_bindToCallback_invokesCallbackOnEveryChange = function(){
    var foo = js.bindableValue();
    var callback = sinon.spy();

    js.bind(foo).to(callback);

    foo.setValue("bar");
    assertTrue("Callback was called twice", callback.calledTwice);

    foo.setValue("foo");
    assertEquals("Callback called", 3, callback.callCount);
};

testCase.prototype.test_bindToCallback_invokesCallbackOnceBeforeAnyChange = function(){
    var foo = js.bindableValue();
    var callback = sinon.spy();

    js.bind(foo).to(callback);

    assertTrue("Callback was called", callback.calledOnce);
};
