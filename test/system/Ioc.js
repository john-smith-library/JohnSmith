var testCase = new TestCase("system.Ioc");

testCase.prototype.setUp = function(){
    this.ioc = js.createIocContainer();
}

testCase.prototype.testRegister_NoDependencies_CanResolve = function(){
    var foo = "foo";

    this.ioc.register("foo", foo);

    var resolvedFoo = this.ioc.resolve("foo");

    assertNotNull("Resolved service", resolvedFoo);
    assertEquals("Resolved service", foo, resolvedFoo);
};

testCase.prototype.testRegister_WithDependencies_CanResolve = function(){
    var foo = "foo";

    this.ioc.registerWithDependencies(
        "foo",
        function(fooDep){
            return foo;
        },
        "fooDep");

    this.ioc.register("fooDep", "fooDepValue");

    var resolvedFoo = this.ioc.resolve("foo");

    assertNotNull("Resolved service", resolvedFoo);
    assertEquals("Resolved service", foo, resolvedFoo);
};

testCase.prototype.testRegister_WithPreRegisteredDependencies_CanResolve = function(){
    var foo = "foo";

    this.ioc.register("fooDep", "fooDepValue");

    this.ioc.registerWithDependencies(
        "foo",
        function(fooDep){
            return foo;
        },
        "fooDep");

    var resolvedFoo = this.ioc.resolve("foo");

    assertNotNull("Resolved service", resolvedFoo);
    assertEquals("Resolved service", foo, resolvedFoo);
};

testCase.prototype.testRegister_WithDependencies_ShouldPassDependenciesToCallback = function(){
    var foo = "foo";

    this.ioc.registerWithDependencies(
        "foo",
        function(fooDep){
            assertEquals("Dependency in callback", "fooDepValue", fooDep);
            return foo;
        },
        "fooDep");

    this.ioc.register("fooDep", "fooDepValue");

    var resolvedFoo = this.ioc.resolve("foo");
};

testCase.prototype.testResolve_NoServiceRegistered__ShouldReturnNull = function(){
    var resolvedFoo = js.ioc.resolve("no_such_object");

    assertNull("Resolved service", resolvedFoo);
};

testCase.prototype.test_CallbackRegisteredBeforeDependencies_ShouldCallCallback = function(){
    var callbackCalled = false;

    this.ioc.withRegistered(
        function(foo, bar){
            callbackCalled = true;
            assertEquals("Foo in callback", "fooValue", foo);
            assertEquals("Bar in callback", "barValue", bar);
        },
        "foo",
        "bar");

    this.ioc.register("foo", "fooValue");
    this.ioc.register("bar", "barValue");

    assertTrue("Callback called", callbackCalled);
};
