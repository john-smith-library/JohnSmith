var testCase = TestCase("unit.binding.BindingWire");

var FakeHandler = function() {
    var handler = this;

    this.wiredBindable = null;
    this.isDisposed = false;

    this.dispose = function(){
        handler.isDisposed = true;
    };

    this.wireWith = function(bindable){
        handler.wiredBindable = bindable;
    }

    this.unwireWith = function(){
        handler.wiredBindable = null;
    };
};

testCase.prototype.testStoreLinksToBindableAndHandler = function() {
    var bindable = {};
    var handler = new FakeHandler();

    var wire = new JohnSmith.Binding.BindingWire(bindable, handler);

    assertEquals("Stored bindable", bindable, wire.getBindable());
    assertEquals("Stored bindable", handler, wire.getHandler());
};

testCase.prototype.testDoesNotWireByDefault = function() {
    var bindable = {};
    var handler = new FakeHandler();

    var wire = new JohnSmith.Binding.BindingWire(bindable, handler);

    assertNull("Bound value", handler.wiredBindable);
};

testCase.prototype.testShouldWireOnInit = function() {
    var bindable = {};
    var handler = new FakeHandler();

    var wire = new JohnSmith.Binding.BindingWire(bindable, handler);
    wire.init();

    assertNotNull("Bound value", handler.wiredBindable);
    assertEquals("Bound value", bindable, handler.wiredBindable);
};

testCase.prototype.testShouldWireOnDispose = function() {
    var bindable = {};
    var handler = new FakeHandler();

    var wire = new JohnSmith.Binding.BindingWire(bindable, handler);
    wire.init();
    wire.dispose();

    assertNull("Bound value", handler.wiredBindable);
};

testCase.prototype.testShouldDisposeHandlerOnDispose = function() {
    var bindable = {};
    var handler = new FakeHandler();

    var wire = new JohnSmith.Binding.BindingWire(bindable, handler);
    wire.init();
    wire.dispose();

    assertTrue("Handler disposed", handler.isDisposed);
};
