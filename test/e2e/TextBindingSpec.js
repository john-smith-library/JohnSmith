(function(){
    "use strict";

    describe('js.dom', function(){
        this.beforeEach(function(){
            ui('<div id="target"></div>');
        });

        var domText = alias(
            '(selector).text(target)',
            function(target){
                js.dom('#target').text(target);
            });

        var domTextObserves = alias(
            '(selector).text.observes(target)',
            function(target){
                js.dom('#target').text.observes(target);
            });

        var domHtml = alias(
            '(selector).html(target)',
            function(target){
                js.dom('#target').html(target);
            });

        var domHtmlObserves = alias(
            '(selector).html.observes(target)',
            function(target){
                js.dom('#target').html.observes(target);
            });

        var domSelf = alias(
            '(selector)(static)',
            function(text, opt){
                js.dom('#target')(text, opt);
            });

        var domObserves = alias(
            '(selector).observes(static)',
            function(text, opt){
                js.dom('#target').observes(text, opt);
            });

        /**
         * Describes common text binding functionality for
         * static and observable values.
         */
        aliases()
            .add(domText)
            .add(domTextObserves)
            .add(domHtml)
            .add(domHtmlObserves)
            .add(domSelf)
            .add(domObserves)
            .describeAll(function(callback){

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

                it('Should update text on change', function(){
                    var observable = js.observableValue();
                    callback(observable);
                    observable.setValue('foo');

                    expect($('#target').text()).toBe('foo');
                });

                it('Should render default observable value', function(){
                    var observable = js.observableValue();
                    observable.setValue('foo');
                    callback(observable);

                    expect($('#target').text()).toBe('foo');
                });
            });

        /**
         * Describes HTML-encoding functionality
         */
        aliases()
            .add(domText)
            .add(domTextObserves)
            .add(domSelf)
            .add(domObserves)
            .describeAll(function(callback){
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

        aliases()
            .add(domSelf)
            .add(domObserves)
            .describeAll(function(callback){
                it('Should encode html by default', function(){
                    callback('<span>content</span>');
                    expect($('#target').text()).toBe('<span>content</span>');
                });

                it('Should render html if flag set', function(){
                    callback('<span>content</span>', { encode: false });
                    expect($('#target').html()).toBe('<span>content</span>');
                });
            });

        /**
         * Test aliases for HTML rendering
         */
        aliases()
            .add(domHtml)
            .add(domHtmlObserves)
            .describeAll(function(callback){

                it('Should render html', function(){
                    callback('<b>foo</b>');
                    expect($('#target').html()).toBe('<b>foo</b>');
                });
            });
    });
})();