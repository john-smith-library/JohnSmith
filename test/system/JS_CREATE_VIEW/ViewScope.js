var testCase = TestCase("system.JS_CREATE_VIEW.ViewScope");

testCase.prototype.test_bindShouldNotChangeMarkupWhileInsideInitFunction = function(){
    var Child = function(){
        this.template = "<div class='child'></div>";
        this.init = function(){
        };
    };

    var Parent = function(){
        this.template = "<div class='parent'></div>";
        this.init = function(){
            this.bind("").to(".parent", Child);

            assertFalse("Child markup detected", this.find(".child").getTarget().length > 0);
        };
    };

    js.renderView(Parent).to("body");
};
