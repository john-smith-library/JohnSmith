describe('unit - views - DefaultViewFactory', function(){
    "use strict";

    var factory;

    beforeEach(function(){
        factory = new js.DefaultViewFactory(
            null, /* IMarkupResolver */
            null  /* RenderListenerFactory */);
    });

    function expectValidView(destination, view, viewModel) {
        var composedView = factory.resolve(destination, view, viewModel);

        expect(composedView).toBeTruthy();
        expect(composedView instanceof js.ComposedView);
    }

    describe('resolve', function(){
        it('Should resolve view data by object', function(){
            var viewDescriptor = {
                template: "templateKey",
                init: function(){
                }
            };

            expectValidView(js.dom('body'), viewDescriptor, null);
        });

        it('Should resolve view by class', function(){
            var FooView = function(){
                this.template = "templateKey";
                this.init = function(){
                };
            };

            expectValidView(js.dom('body'), FooView, null);
        });

        it('Should resolve view by class instance', function(){
            var FooView = function(){
                this.template = "templateKey";
                this.init = function(){
                };
            };

            expectValidView(js.dom('body'), new FooView(), null);
        });
    });
});
