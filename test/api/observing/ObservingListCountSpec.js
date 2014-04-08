describe('api - js.dom(selector)(list.count)', function(){
    "use strict";

    beforeEach(function(){
        ui('<div id="size"></div>');
    });

    it('renders count on list change', function(){
        var list = js.observableList();
        js.dom('#size')(list.count());
        list.setValue([1, 2, 3]);
        expect($("#size").text()).toBe('3');
    });

    it('renders count on add', function(){
        var list = js.observableList();
        js.dom('#size')(list.count());

        list.setValue([1, 2, 3]);
        list.add(4);

        expect($("#size").text()).toBe('4');
    });

    it('renders count on remove', function(){
        var list = js.observableList();
        js.dom('#size')(list.count());

        list.setValue([1, 2, 3]);
        list.remove(1);

        expect($("#size").text()).toBe('2');
    });

    it('renders 0 if value is null', function(){
        var list = js.observableList();
        js.dom('#size')(list.count());

        list.setValue(null);

        expect($("#size").text()).toBe('0');
    });
});