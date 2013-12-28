var testCase = TestCase("system.JS_CREATE_VIEW.Unrender");

testCase.prototype.setUp = function(){
    /** Add view template markup */
    /*:DOC += <script id="viewTemplate" type="text/view">
                <div class='renderedView'>
                </div>
             </script> */

    /** Add view destination markup */
    /*:DOC += <div id="viewDestination"></div> */

    var unrenderSpy = sinon.spy();

    this.unrenderSpy = unrenderSpy;
    this.view = function(){
        this.template = "#viewTemplate";
        this.unrender = unrenderSpy;
    };
};

testCase.prototype.testValueView_UnrenderConfigured_ShouldCallUnrenderOnChange = function(){
    var bindable = js.bindableValue();

    js.bind(bindable).to("#viewDestination", this.view);

    bindable.setValue("value1");
    assertTrue("Unrender not called on first set", this.unrenderSpy.notCalled);

    bindable.setValue("value2");
    assertTrue("Unrender called on second set", this.unrenderSpy.calledOnce);

    bindable.setValue("value3");
    assertTrue("Unrender called on every next set", this.unrenderSpy.calledTwice);
};

testCase.prototype.testValueView_UnrenderConfigured_ShouldCallUnrenderOnViewObject = function(){
    var bindable = js.bindableValue();

    js.bind(bindable).to("#viewDestination", this.view);

    bindable.setValue("value1");
    bindable.setValue("value2");
    assertNotUndefined("Unrender context", this.unrenderSpy.firstCall.thisValue);
    assertNotUndefined("Unrender called on view object", this.unrenderSpy.firstCall.thisValue.template);
};

testCase.prototype.testListView_UnrenderConfigured_ShouldCallUnrenderOnDeletingItems = function(){
    var bindable = js.bindableList();

    js.bind(bindable).to("#viewDestination", this.view);

    bindable.setValue([1, 2, 3]);
    assertTrue("Unrender not called on first set", this.unrenderSpy.notCalled);

    bindable.remove(2, 3);
    assertTrue("Unrender called for every removed item", this.unrenderSpy.calledTwice);
};