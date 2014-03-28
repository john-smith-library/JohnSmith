describe('unit - views - jquery - JQueryMarkupResolver', function(){
    "use strict";

    var resolver;
    beforeEach(function(){
        resolver = new js.JQueryMarkupResolver();
    });

    describe('resolve', function(){
        it('Returns inner html if selector provided', function(){
            ui('<script id="template" type="text/view">' +
                   '<div class="container">content</div>' +
               '</script>');

            var resolvedHtml = resolver.resolve("#template");

            expect(resolvedHtml).toBe('<div class="container">content</div>');
        });

        it('Returns inner html if jQuery object provided', function(){
            ui('<script id="template" type="text/view">' +
                   '<div class="container">content</div>' +
               '</script>');

            var resolvedHtml = resolver.resolve($('#template'));

            expect(resolvedHtml).toBe('<div class="container">content</div>');
        });

        it('Returns outer html if plain markup provided', function(){
            var resolvedHtml = resolver.resolve('<div class="container">content</div>');

            expect(resolvedHtml).toBe('<div class="container">content</div>');
        });

        /** It tests markup that is problem for Sizzle */
        it('Returns outer html if plain markup with mixed text provided', function(){
            var resolvedHtml = resolver.resolve('content <div class="container">content</div>');

            expect(resolvedHtml).toBe('content <div class="container">content</div>');
        });

        it('Returns outer html if orphan jQuery object provided', function(){
            var resolvedHtml = resolver.resolve($('<div class="container">content</div>'));

            expect(resolvedHtml).toBe('<div class="container">content</div>');
        });

        it('Returns outer html if orphan constructed jQuery object provided', function(){
            var resolvedHtml = resolver.resolve($("<div>").addClass("container").text("content"));

            expect(resolvedHtml).toBe('<div class="container">content</div>');
        });
    });
});
