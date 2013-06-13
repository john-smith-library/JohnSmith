var testCase = new TestCase("unit.views.DefaultViewFactory");

testCase.prototype.setUp = function(){
    this.factory = new JohnSmith.Views.DefaultViewFactory(
        /* Set all dependencies to null because view factory does not use it directly */
        null, /* BindingManager */
        null, /* Element Factory */
        null, /* Event Bus */
        null  /* Markup resolver */);
};

testCase.prototype.testCreateView_ObjectViewData_ShouldCreateView = function(){
    var viewDescriptor = {
        template: "templateKey",
        init: function(){
        }
    };

    this.createAndAssertViewIsValid(viewDescriptor);
};

testCase.prototype.testCreateView_ClassViewData_ShouldCreateView = function(){
    var FooView = function(){
        this.template = "templateKey";
        this.init = function(){
        };
    };

    this.createAndAssertViewIsValid(FooView);
};

testCase.prototype.testCreateView_ClassInstanceViewData_ShouldCreateView = function(){
    var FooView = function(){
        this.template = "templateKey";
        this.init = function(){
        };
    };

    this.createAndAssertViewIsValid(new FooView());
};

testCase.prototype.createAndAssertViewIsValid = function(viewDescriptor){
    var view = this.factory.resolve(viewDescriptor);
    assertIsView(view);
}

function assertIsView(view){
    assertNotNull("View", view);
    assertInstanceOf("View type", JohnSmith.Views.DefaultView, view);
}
