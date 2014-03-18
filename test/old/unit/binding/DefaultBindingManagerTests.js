var testCase = TestCase("unit.binding.DefaultBindingManager");

testCase.prototype.createFakeFactories = function(){
    var fakeHandler = {};

    return [{
        createHandler: function(){
            return fakeHandler;
        }
    }];
};

testCase.prototype.test_staticObject_shouldTransformTiBindable = function(){
    var manager = new JohnSmith.Binding.DefaultBindingManager(this.createFakeFactories(), []);

    var wire = manager.bind({
        bindableData: "foo",
        handlerData: [],
        context: null,
        commandHost: null
    });

    assertNotNull("Created wire", wire);
    assertNotNull("Wired bindable", wire.getBindable());
    assertNotNull("Wired bindable get method", wire.getBindable().getValue);
    assertEquals("Value", "foo", wire.getBindable().getValue());
};

testCase.prototype.test_bindableObject_shouldWireProvidedBindable = function(){
    var manager = new JohnSmith.Binding.DefaultBindingManager(this.createFakeFactories(), []);

    var fakeBindable = {
        getValue: function(){},
        addListener: function(){}
    };

    var wire = manager.bind({
        bindableData: fakeBindable,
        handlerData: [],
        context: null,
        commandHost: null
    });

    assertNotNull("Created wire", wire);
    assertEquals("Bindable", fakeBindable, wire.getBindable());
};

testCase.prototype.testShouldCreateWireIfFactoriesProvided = function() {
    var bindable = {};
    var handler = {};

    var handlerFactories = [];
    handlerFactories.push({
        createHandler: function(data){
            return handler;
        }
    });

    var manager = new JohnSmith.Binding.DefaultBindingManager(handlerFactories, []);

    var wire = manager.bind({
        bindableData: "foo",
        handlerData: []
    });

    assertNotNull("Created wire", wire);
    assertEquals("Wire handler", handler, wire.getHandler());
};

testCase.prototype.testNoHandlerFactoryShouldThrowError = function() {
    var handlerFactories = [];
    var manager = new JohnSmith.Binding.DefaultBindingManager(handlerFactories, []);

    assertException(
        "Try to create a wire",
        function(){
            manager.bind({
                bindableData: "foo",
                handlerData: []
            });
        });
};