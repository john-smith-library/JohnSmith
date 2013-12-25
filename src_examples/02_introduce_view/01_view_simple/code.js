var ViewModel = function(){
    this.firstName = "John";
    this.lastName = "Smith";
};

// Define Vew class
var PersonView = function(){
    // Set template selector
    this.template = "#personTemplate";

    this.init = function(view, viewModel){
        view.bind(viewModel.firstName).to(".firstName");
        view.bind(viewModel.lastName).to(".lastName");
    };
};

// Create view instance
var view = js.createView(PersonView, new ViewModel());

// Render view instance
view.renderTo("#me");