describe('js.dom(selector).className(class).observes(observable)', function(){
    beforeEach(function(){
        ui('<div id="target"></div>');
    });

    function assertHasClass(){
        expect($('#target').is('.active')).toBe(true);
    }

    function assertHasNoClass(){
        expect($('#target').is('.active')).toBe(false);
    }

    it('adds class if value is true', function(){
        js.dom('#target').className('active').observes(true);

        assertHasClass();
    });

    it('can remove existing class', function(){
        $('#target').addClass('active');
        assertHasClass();

        js.dom('#target').className('active').observes(false);

        assertHasNoClass();
    });

    it('works dynamically', function(){
        var observable = js.observableValue();
        js.dom('#target').className('active').observes(observable);

        assertHasNoClass();

        observable.setValue(true);
        assertHasClass();

        observable.setValue(false);
        assertHasNoClass();
    });
});