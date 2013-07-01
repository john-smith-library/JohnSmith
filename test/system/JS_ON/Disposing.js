(function(){
    var testCase = TestCase("system.JS_ON.Disposing");

    var View = function(){
        this.template = "<a id='button'>click me</a>";
        this.init = function(viewModel){
            this.on("#button", "click").do(function(){});
        };
    };

    testCase.prototype.getEventHandlersCount = function(selector, event){
        var target = $(selector);
        if (target.length === 0){
            throw new Error("Could not find anything by selector " + selector);
        }

        var element = target[0];
        var data = jQuery.hasData( element ) && jQuery._data( element );
        var events = data.events;
        if (!events){
            return 0;
        }

        var targetEvents = events[event];
        if (!targetEvents) {
            return 0;
        }

        return  targetEvents.length;
    };

    testCase.prototype.testDispose_ShouldUnbindEventHandler = function(){
        var view = js.createView(View, {});
        view.renderTo("body");

        assertTrue("Has one attached handler", this.getEventHandlersCount("#button", "click") === 1);

        view.dispose();

        assertTrue("Has no attached handler", this.getEventHandlersCount("#button", "click") === 0);
    };

    testCase.prototype.testDispose_ShouldNotUnbindForeignEventHandler = function(){
        var view = js.createView(View, {});
        view.renderTo("body");

        // bind a manual event handler
        var manualHandler = sinon.spy();
        $("#button").click(manualHandler);

        assertTrue("Has two attached handler", this.getEventHandlersCount("#button", "click") === 2);

        view.dispose();

        assertTrue("Has one attached handler", this.getEventHandlersCount("#button", "click") === 1);
        $("#button").click();
        assertTrue("Manual handler was called", manualHandler.called);
    };
})();


