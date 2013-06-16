// View model class
var FormViewModel = function(){
    this.firstName = js.bindableValue();
    this.rememberMe = js.bindableValue();
    this.bio = js.bindableValue();

    this.resetState = function(){
        // set initial values
        this.firstName.setValue("John Smith");
        this.rememberMe.setValue(true);
        this.bio.setValue("Admiral of New England was an English soldier, explorer, and author. He was knighted for his services to Sigismund Bathory, Prince of Transylvania and his friend Mózes Székely.");
    };
};

// View class
var FormView = function(){
    this.template = "#formTemplate";
    this.init = function(viewModel){
        // bind firstName to text input
        this.bind(viewModel.firstName).to(
            "input[type='text']",
            { valueType: "inputValue" });

        // bind rememberMe to checkbox
        this.bind(viewModel.rememberMe).to(
            "input[type='checkbox']",
            { valueType: "checkedAttribute" });

        // bind bio to textarea
        this.bind(viewModel.bio).to(
            "textarea",
            { valueType: "inputValue" });
    };
};

// Create and render view
var view = js.createView(FormView, new FormViewModel());
view.renderTo("#formApp");