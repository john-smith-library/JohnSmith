var ViewModel = function(){
    this.firstName = "John";
    this.lastName = "Smith";
};

// Define Vew class
var PersonView = function(){
    // Set template selector
    this.template = "#personTemplate";

    this.init = function(viewModel){
        this.bind(viewModel.firstName).to(".firstName");
        this.bind(viewModel.lastName).to(".lastName");
    };
};

// Create view instance
var view = js.createView(PersonView, new ViewModel());

// Render view instance
view.renderTo("#me");