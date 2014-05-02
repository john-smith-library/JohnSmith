describe('api - js.dom(selector).observes(observable, ViewClassWithUnrenderListener)', function(){
    var unrenderSpy = null;
    var View = function(){
        this.template = "#viewTemplate";
        this.init = function(dom){
            dom.onUnrender().listen(unrenderSpy);
        };
    };

    beforeEach(function(){
        ui('<script id="viewTemplate" type="text/view">' +
               '<div class="renderedView"></div>' +
           '</script>' +
           '<div id="viewDestination"></div>');

        unrenderSpy = jasmine.createSpy('unrenderCallback');
    });

    it('calls unrender on observable value change', function(){
        var observable = js.observableValue();

        js.dom('#viewDestination').observes(observable, View);

        observable.setValue("value1");
        expect(unrenderSpy).not.toHaveBeenCalled();

        observable.setValue("value2");
        expect(unrenderSpy).toHaveBeenCalled();
        expect(unrenderSpy.calls.count()).toBe(1);

        observable.setValue("value3");
        expect(unrenderSpy.calls.count()).toBe(2);
    });

    it('calls unrender on list item deleting', function(){
        var observable = js.observableList();

        js.dom('#viewDestination').observes(observable, View);

        observable.setValue([1, 2, 3]);
        expect(unrenderSpy).not.toHaveBeenCalled();

        observable.remove(2, 3);
        expect(unrenderSpy).toHaveBeenCalled();
        expect(unrenderSpy.calls.count()).toBe(2);
    });
});
