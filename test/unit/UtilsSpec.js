(function(){
    "use strict";

    describe('Utils', function(){
        describe('wrapObjectWithSelfFunction', function(){
            it('Should return function', function(){
                var wrapped = js.Utils.wrapObjectWithSelfFunction({}, sinon.spy());
                expect(wrapped).toBeDefined();
                expect(_.isFunction(wrapped));
            });

            it('Should preserve original properties', function(){
                var target = {
                    foo: 'foo',
                    info: { age: 42 }
                };

                var wrapped = js.Utils.wrapObjectWithSelfFunction(target, function(){});

                expect(wrapped.foo).toBe('foo');
                expect(wrapped['info']).toBe(target.info);
            });

            it('Should work with fully functional object', function(){
                var target = new js.ObservableValue();
                var wrapped = js.Utils.wrapObjectWithSelfFunction(target, function(t){
                    return t.getValue();
                });

                wrapped.setValue('foo');

                expect(wrapped.getValue()).toBe('foo');
                expect(wrapped()).toBe('foo');
            });
        });
    });
})();
