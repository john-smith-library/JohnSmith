(function(){
    "use strict";

    describe('js.dom', function(){
        describe('(selector).observes(observable)', function(){
            it('should update dom on chage', function(){
                ui('<span id="value"></span>');
                var value = js.observableValue();
                js.dom('#value').observes(value);
            });
        });
    });
})();