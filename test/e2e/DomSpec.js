(function(){
    "use strict";

    describe('API', function(){
        describe('js.dom', function(){
            aliases()
                .add('(selector)', js.dom('body'))
                .add('.find(selector)', js.dom.find('body'))
                .describeAll(function(dom){
                    it('should return object', function(){
                        expect(dom).toBeTruthy();
                    });

                    it('has $', function(){
                        expect(dom.$).toBeTruthy();
                        expect(dom.$.length).toBe(1);
                    });

                    describe('.render(view, viewModel)', function(){
//                        beforeEach(function(){
//                           ui('<script id="viewTemplate" type="text/view">' +
//                                  '<div class="person">' +
//                                      '<div class="firstName"></div>' +
//                                      '<div class="lastName"></div>' +
//                                  '</div>' +
//                              '</script>');
//                        });

                        it('Renders simple view', function(){
                            ui('<div id="target"></div>');
                            var View = function(){
                                this.init = function(d){
                                    d('span')('hello world!');
                                }

                                this.template = '<div>view<span></span></div>';
                            };

                            js.dom('#target').render(View);

                            expect($('#target').html()).toBe('<div>view</div>');
                        });
                    });
                });
        });
    });
})();
