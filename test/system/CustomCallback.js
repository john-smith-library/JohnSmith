var testCase = TestCase("system.CustomCallback");

testCase.prototype.testBindableValueShouldCallCustomCallback = function(){
    var foo = js.bindableValue();
    var wasCalled = false;

    js.bind(foo).to(function(){
        wasCalled = true;
    });

    foo.setValue("bar");

    assertTrue("Callback was called", wasCalled);
}
