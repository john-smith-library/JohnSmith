(function(){
    "use strict";

    describe('js.dom', function(){
        this.beforeEach(function(){
            ui('<div id="target"></div>');
        });

        /**
         * Test aliases for static text rendering
         */
        aliases()
            .add('(selector).text(static)',            function(text){ js.dom('#target').text(text); })
            .add('(selector).text.observes(static)',   function(text){ js.dom('#target').text.observes(text); })
            .describeAll(function(callback){

                it('Should render text', function(){
                    callback('foo');
                    expect($('#target').text()).toBe('foo');
                });

                it('should encode html', function(){
                    callback('<span>content</span>');
                    expect($('#target').text()).toBe('<span>content</span>');
                });
            });

        /**
         * Test aliases for static HTML rendering
         */
        aliases()
            .add('(selector).html(static)',            function(text){ js.dom('#target').html(text); })
            .add('(selector).html.observes(static)',   function(text){ js.dom('#target').html.observes(text); })
            .describeAll(function(callback){

                it('Should render html', function(){
                    callback('<b>foo</b>');
                    expect($('#target').html()).toBe('<b>foo</b>');
                });
            });

        /**
         * Test aliases for generic content rendering
         */
        aliases()
            .add('(selector)(static)',            function(text, opt){ js.dom('#target')(text, opt); })
            .add('(selector).observes(static)',   function(text, opt){ js.dom('#target').observes(text, opt); })
            .describeAll(function(callback){

                it('Should render text', function(){
                    callback('foo');
                    expect($('#target').text()).toBe('foo');
                });

                it('should encode html by default', function(){
                    callback('<span>content</span>');
                    expect($('#target').text()).toBe('<span>content</span>');
                });

                it('should render html if flag set', function(){
                    callback('<span>content</span>', { encode: false });
                    expect($('#target').html()).toBe('<span>content</span>');
                });

                /**
                 * A regression test for #2 (Bind to empty string).
                 * See https://github.com/guryanovev/JohnSmith/issues/2
                 */
                it('can render empty string', function(){
                    callback('');
                    expect($('#target').text()).toBe('');
                });
            });
    });
})();

