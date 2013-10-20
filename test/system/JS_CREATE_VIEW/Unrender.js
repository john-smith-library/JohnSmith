var testCase = TestCase("system.JS_CREATE_VIEW.Unrender");

testCase.prototype.setUp = function(){
    /** Add view template markup */
    /*:DOC += <script id="viewTemplate" type="text/view">
                <div class='renderedView'>
                </div>
             </script> */

    /** Add view destination markup */
    /*:DOC += <div id="viewDestination"></div> */
};

testCase.prototype.testValueView_UnrenderConfigured_ShouldCallUnrenderOnChange = function(){
    var bindable = js.bindableValue();
    var unrender = sinon.spy();

    var view = function(){
        this.template = "#viewTemplate";
        this.unrender = unrender;
    };

    js.bind(bindable).to("#viewDestination", view);

    bindable.setValue("value1");
    assertTrue("Unrender not called on first set", unrender.notCalled);

    bindable.setValue("value2");
    assertTrue("Unrender called on second set", unrender.calledOnce);

    bindable.setValue("value3");
    assertTrue("Unrender called on every next set", unrender.calledTwice);
};

testCase.prototype.testListView_UnrenderConfigured_ShouldCallUnrenderOnDeletingItems = function(){
    var bindable = js.bindableList();
    var unrender = sinon.spy();

    var view = function(){
        this.template = "#viewTemplate";
        this.unrender = unrender;
    };

    js.bind(bindable).to("#viewDestination", view);

    bindable.setValue([1, 2, 3]);
    assertTrue("Unrender not called on first set", unrender.notCalled);

    bindable.remove(2, 3);
    assertTrue("Unrender called for every removed item", unrender.calledTwice);
};