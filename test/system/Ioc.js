var testCase = new TestCase("system.Ioc");

testCase.prototype.testCanResolveInstances = function(){
    var foo = "foo";
    js.ioc.register("foo", foo);
    var resolvedFoo = js.ioc.resolve("foo");

    assertNotNull("Resolved service", resolvedFoo);
    assertEquals("Resolved service", foo, resolvedFoo);
};

testCase.prototype.testNoDependencyRegistered_ShouldReturnNull = function(){
    var resolvedFoo = js.ioc.resolve("no_such_object");

    assertNull("Resolved service", resolvedFoo);
};

testCase.prototype.testCanResolveByProvider = function(){
    var foo = "foo";
    js.ioc.register(
        "foo",
        function(){
            return foo;
        });

    var resolvedFoo = js.ioc.resolve("foo");

    assertNotNull("Resolved service", resolvedFoo);
    assertEquals("Resolved service", foo, resolvedFoo);
};

testCase.prototype.testCanResolveByProviderWithDependencies = function(){
    var foo = {
        bar: null
    };

    var bar = {
        value: "bar value"
    };

    js.ioc.register("bar", bar);

    js.ioc.register(
        "foo",
        function(ioc){
            foo.bar = ioc.resolve("bar");
            return foo;
        });

    var resolvedFoo = js.ioc.resolve("foo");

    assertNotNull("Resolved service", resolvedFoo);
    assertEquals("Resolved service", foo, resolvedFoo);
    assertEquals("Resolved service dependency", bar, foo.bar);
};

testCase.prototype.testCallsProviderOnlyOnce = function(){
    var foo = {
        bar: "bar_value"
    };

    var providerCalledCount = 0;

    js.ioc.register(
        "foo",
        function(ioc){
            providerCalledCount++;
            return foo;
        });

    var resolvedFoo = js.ioc.resolve("foo");
    resolvedFoo = js.ioc.resolve("foo");
    resolvedFoo = js.ioc.resolve("foo");

    assertNotNull("Resolved service", resolvedFoo);
    assertEquals("Resolved service", foo, resolvedFoo);
    assertEquals("Provider called times", 1, providerCalledCount);
};
