(function(){
    "use strict";

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
            });
    });
})();
