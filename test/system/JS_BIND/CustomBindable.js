var testCase = TestCase("system.JS_BIND.CustomBindable");

testCase.prototype.setUp = function(){
    /*:DOC += <div id="destination" /> */

    this.customBindable = {
        getValue: function(){
            return "foo";
        },
        addListener: function(listener){
            this.listener = listener;
        }
    };
};

testCase.prototype.test_CustomBindable_RendersDefaultValue = function(){
    js.bind(this.customBindable).to("#destination");
    assertEquals("Destination after poke", "foo", $("#destination").text());
};

testCase.prototype.test_CustomBindable_CouldRender = function(){
    this.customBindable.pokeListener = function(){
        if (this.listener) {
            this.listener.valueChanged("foo", "bar", JohnSmith.Binding.DataChangeReason.replace);
        }
    };

    js.bind(this.customBindable).to("#destination");
    this.customBindable.pokeListener();

    assertEquals("Destination after poke", "bar", $("#destination").text());
};