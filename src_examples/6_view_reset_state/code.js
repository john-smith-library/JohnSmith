var viewModel = {
    firstName: js.bindableValue(),
    lastName: js.bindableValue(),
    resetState: function(){
        // this function will be called by the vew after rendering.
        this.firstName.setValue("John");
        this.lastName.setValue("Smith");
    }
};

var view = js.createView(
    "#personDetailsTemplate",
    function(view, viewModel){
        view.bind(viewModel.firstName).to(".firstName");
        view.bind(viewModel.lastName).to(".lastName");
    },
    viewModel);

view.renderTo("#meDetails");