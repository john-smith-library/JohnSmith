(function(){
    "use strict";

    var domText = function(target){
        js.dom('#target').text(target);
    };

    var domTextObserves = function(target){
        js.dom('#target').text.observes(target);
    };

    var domHtml = function(target){
        js.dom('#target').html(target);
    };

    var domHtmlObserves = function(target){
        js.dom('#target').html.observes(target);
    };

    var domSelf = function(text, opt){
        js.dom('#target')(text, opt);
    };

    var domObserves = function(text, opt){
        js.dom('#target').observes(text, opt);
    };

    input('(selector).text(target)', domText);
    input('(selector).text.observes(target)', domTextObserves);
    input('(selector).html(target)', domHtml);
    input('(selector).html.observes(target)', domHtmlObserves);
    input('(selector)(static)', domSelf);
    input('(selector).observes(static)', domObserves);

    /**
     * Describes common text binding functionality for
     * static and observable values.
     */
    describeInputs('api - js.dom', function(callback){
        this.beforeEach(function(){
            ui('<div id="target"></div>');
        });

        it('Should render static text', function(){
            callback('foo');
            expect($('#target').text()).toBe('foo');
        });

        /**
         * A regression test for #2 (Bind to empty string).
         * See https://github.com/guryanovev/JohnSmith/issues/2
         */
        it('Can render empty string', function(){
            callback('');
            expect($('#target').text()).toBe('');
        });

        it('Can render null', function(){
            callback(null);
            expect($('#target').text()).toBe('');
        });

        it('Should update text on change', function(){
            var observable = js.observableValue();
            callback(observable);
            observable.setValue('foo');

            expect($('#target').text()).toBe('foo');
        });

        it('Should update text on every change', function(){
            var observable = js.observableValue();
            callback(observable);

            observable.setValue('foo');
            expect($('#target').text()).toBe('foo');

            observable.setValue('bar');
            expect($('#target').text()).toBe('bar');
        });

        it('Should render default observable value', function(){
            var observable = js.observableValue();
            observable.setValue('foo');
            callback(observable);

            expect($('#target').text()).toBe('foo');
        });

        it('Could render custom observable', function(){
            var observable = {
                getValue: sinon.stub().returns('bar'),
                listen: function(listener){
                    listener(this.getValue(), null, {});
                }
            };

            callback(observable);
            expect($('#target').text()).toBe('bar');
        });
    });

    input('(selector).text(target)', domText);
    input('(selector).text.observes(target)', domTextObserves);
    input('(selector)(static)', domSelf);
    input('(selector).observes(static)', domObserves);

    /**
     * Describes HTML-encoding functionality
     */
    describeInputs('api - js.dom', function(callback){
        this.beforeEach(function(){
            ui('<div id="target"></div>');
        });

        it('Should encode html', function(){
            callback('<span>content</span>');
            expect($('#target').text()).toBe('<span>content</span>');
        });

        it('Should encode html on change', function(){
            var observable = js.observableValue();
            callback(observable);
            observable.setValue('<span>content</span>');

            expect($('#target').text()).toBe('<span>content</span>');
        });

        it('Can render empty string on change', function(){
            var observable = js.observableValue();
            callback(observable);
            observable.setValue('');

            expect($('#target').text()).toBe('');
        });
    });

    input('(selector)(static)', domSelf);
    input('(selector).observes(static)', domObserves);

    describeInputs('api - js.dom', function(callback){
        this.beforeEach(function(){
            ui('<div id="target"></div>');
        });

        it('Should encode html by default', function(){
            callback('<span>content</span>');
            expect($('#target').text()).toBe('<span>content</span>');
        });

        it('Should render html if flag set', function(){
            callback('<span>content</span>', { encode: false });
            expect($('#target').html()).toBe('<span>content</span>');
        });

        it('Should use custom formatter if it\'s defined in options', function(){
            var observable = js.observableValue();
            callback(
                observable,
                {
                    formatter: function(value){
                        return '$' + value;
                    }
                });

            observable.setValue('42');

            expect($('#target').text()).toBe('$42');
        });

        it('Formatter can return jQuery object', function(){
            var observable = js.observableValue();
            callback(
                observable,
                {
                    formatter: function(value){
                        return $("<span></span>").addClass("bar").text(value);
                    }
                });

            observable.setValue('foo');

            expect($('#target').find('.bar').length).toBe(1);
        });
    });

    input('(selector).html(target)', domHtml);
    input('(selector).html.observes(target)', domHtmlObserves);

    describeInputs('api - js.dom', function(callback){
        this.beforeEach(function(){
            ui('<div id="target"></div>');
        });

        it('Should render html', function(){
            callback('<b>foo</b>');
            expect($('#target').html()).toBe('<b>foo</b>');
        });
    });
})();