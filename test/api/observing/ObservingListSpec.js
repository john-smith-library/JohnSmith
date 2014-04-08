(function(){
    "use strict";

    var SimpleView = function(){
        this.template = '<li></li>';
        this.init = function(dom, viewModel){
        };
    };

    var domSelf = function(text, opt){
        js.dom('#target')(text, opt);
    };

    var domObserves = function(text, opt){
        js.dom('#target').observes(text, opt);
    };

    input('(selector)(list, View)', domSelf);
    input('(selector).observes(list, View)', domObserves);
    describeInputs('api - js.dom', function(callback){
        var list;

        beforeEach(function(){
            ui('<ul id="target"></ul>');

            list = js.observableList();
            callback(list, SimpleView);
        });

        it('renders items on add', function(){
            list.add('foo', 'bar');
            expect($("#target").find("li").length).toBe(2);
        });

        it('cleans markup on remove', function(){
            list.add('foo', 'bar');
            list.remove('foo');

            expect($("#target").find("li").length).toBe(1);
        });

        it('disposes view on remove', function(){
            var ViewModel = function(name){
                this.releaseState = jasmine.createSpy(name + ' dispose');
            };

            var item1 = new ViewModel('foo');
            var item2 = new ViewModel('bar');
            list.add(item1, item2);

            // just double-check it was rendered
            expect($("#target").find("li").length).toBe(2);

            list.remove(item1);

            expect(item1.releaseState).toHaveBeenCalled();
            expect(item2.releaseState).not.toHaveBeenCalled();
        });

        /** This is a regression test that checks if the same element could be added/removed multiple times. */
        it('can add and remove the same object', function(){
            var item = 'baz';

            list.add('foo', 'bar', item);

            list.remove(item);
            expect($("#target").find("li").length).toBe(2);

            list.add(item);
            expect($("#target").find("li").length).toBe(3);

            list.remove(item);
            expect($("#target").find("li").length).toBe(2);
        });
    });
})();
