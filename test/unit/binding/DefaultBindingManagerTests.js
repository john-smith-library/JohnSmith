var testCase = TestCase("Binding.DefaultBindingManager");

testCase.prototype.testShouldCreateWireIfFactoriesProvided = function() {
    var bindable = {};
    var handler = {};

    var bindableFactories = new JohnSmith.Common.ArrayList();
    bindableFactories.add({
        createBindable: function(data){
            return bindable;
        }
    });

    var handlerFactories = new JohnSmith.Common.ArrayList();
    handlerFactories.add({
        createHandler: function(data){
            return handler;
        }
    });

    var manager = new JohnSmith.Binding.DefaultBindingManager(bindableFactories, handlerFactories);

    var wire = manager.bind({
        bindableData: {foo: "bar"},
        handlerData: {foo: 42}
    });

    assertNotNull("Created wire", wire);
    assertEquals("Wire bindable", bindable, wire.getBindable());
    assertEquals("Wire handler", handler, wire.getHandler());
};

testCase.prototype.testNoHandlerFactoryShouldThrowError = function() {
    var bindable = {};
    var handler = {};

    var bindableFactories = new JohnSmith.Common.ArrayList();
    bindableFactories.add({
        createBindable: function(data){
            return bindable;
        }
    });

    var handlerFactories = new JohnSmith.Common.ArrayList();
    var manager = new JohnSmith.Binding.DefaultBindingManager(bindableFactories, handlerFactories, []);

    assertException(
        "Try to create a wire",
        function(){
            manager.bind({foo: "bar"}, "[handler]");
        });
};

testCase.prototype.testNoBindableFactoryShouldThrowError = function() {
    var bindable = {};
    var handler = {};

    var bindableFactories = new JohnSmith.Common.ArrayList();
    var handlerFactories = new JohnSmith.Common.ArrayList();
    handlerFactories.add({
        createHandler: function(data){
            return new JohnSmith.Binding.HandlerFactoryResult(handler, null);
        }
    });

    var manager = new JohnSmith.Binding.DefaultBindingManager(bindableFactories, handlerFactories, []);

    assertException(
        "Try to create a wire",
        function(){
            manager.bind({foo: "bar"}, "[handler]");
        });
};
