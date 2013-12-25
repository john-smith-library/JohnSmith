var ViewModel = function(){
    this.firstName = js.bindableValue(),
    this.lastName = js.bindableValue(),
    this.initState = function(){
        // this function will be called by the vew after rendering.
        this.firstName.setValue("John");
        this.lastName.setValue("Smith");
    };
};

var PersonView = function(){
    this.template = "#personDetailsTemplate";
    this.init = function(view, viewModel){
        view.bind(viewModel.firstName).to(".firstName");
        view.bind(viewModel.lastName).to(".lastName");
    };
};

var view = js.createView(PersonView, new ViewModel());

view.renderTo("#meDetails");