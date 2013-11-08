/** Tests rendering of nested (parent-child) views */
var testCase = TestCase("system.JS_CREATE_VIEW.NestedViews");

/** Child view model class. Sets test bindable value on initState. */
var ChildViewModel = function() {
    this.value = js.bindableValue();
    this.initState = function(){
        this.value.setValue("foo");
    };
};

/* Child view class. Sets up binding of test value to child-related markup. */
var ChildView = function(){
    this.template = "#childTemplate";
    this.init = function(viewModel){
        this.bind(viewModel.value).to(".value");
    };
};

testCase.prototype.setUp = function(){
    /** Add view templates markup */
    /*:DOC += <script id="parentTemplate" type="text/view">
                 <div class="parent">
                 </div>
             </script> */

    /*:DOC += <script id="childTemplate" type="text/view">
                 <div class="child">
                    <span class="value"></span>
                 </div>
             </script> */

    /** Add view destination markup */
    /*:DOC += <div id="viewDestination"></div> */
};

testCase.prototype.testNestedView_ViewClassInInitData_ShouldRenderViewTree = function(){
    var parent = js.createView({
        template: "#parentTemplate",
        init: function(){
            this.addChild(".parent", ChildView, new ChildViewModel());
        }
    });

    this.assertCanRenderView(parent);
};

testCase.prototype.testNestedView_ViewInstanceInInitData_ShouldRenderViewTree = function(){
    var parent = js.createView({
        template: "#parentTemplate",
        init: function(){
            this.addChild(".parent", new ChildView(), new ChildViewModel());
        }
    });

    this.assertCanRenderView(parent);
};

testCase.prototype.testNestedView_ViewClassAddedToInstance_ShouldRenderViewTree = function(){
    var parent = js.createView({ template: "#parentTemplate" });
    parent.addChild(".parent", ChildView, new ChildViewModel());

    this.assertCanRenderView(parent);
};

testCase.prototype.testNestedView_ViewInstanceAddedToInstance_ShouldRenderViewTree = function(){
    var parent = js.createView({ template: "#parentTemplate" });
    parent.addChild(".parent", new ChildView(), new ChildViewModel());

    this.assertCanRenderView(parent);
};

testCase.prototype.assertCanRenderView = function(view){
    assertNotNull("View", view);

    view.renderTo("#viewDestination");

    assertTrue("Parent content rendered", $("#viewDestination .parent").length === 1);
    assertTrue("Child content rendered", $("#viewDestination .child").length === 1);
    assertEquals("Rendered value", "foo", $("#viewDestination .parent .child .value").text());
};