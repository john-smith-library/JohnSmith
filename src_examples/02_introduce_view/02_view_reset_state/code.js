var ViewModel = function(){
    this.firstName = js.bindableValue(),
    this.lastName = js.bindableValue(),
    this.resetState = function(){
        // this function will be called by the vew after rendering.
        this.firstName.setValue("John");
        this.lastName.setValue("Smith");
    };
};

var PersonView = function(){
    this.template = "#personTemplate";
    this.init = function(viewModel){
        this.bind(viewModel.firstName).to(".firstName");
        this.bind(viewModel.lastName).to(".lastName");
    };
};

var view = js.createView(PersonView, new ViewModel());

view.renderTo("#meDetails");