(function(){
    "use strict";

    describe('api - js.observableValue()', function(){
        it('should return observable value', function(){
            expect(js.observableValue() instanceof js.ObservableValue).toBeTruthy();
        });
    });

    describe('api - js.observableList()', function(){
        it('should return observable list', function(){
            expect(js.observableList() instanceof js.ObservableList).toBeTruthy();
        });
    });
})();