var UserViewModel = function(){
    this.firstName = js.bindableValue();
    this.lastName = js.bindableValue();
    this.bio = js.bindableValue();
    this.rememberMe = js.bindableValue();

    this.setDefaultValues = function(){
        this.firstName.setValue("John");
        this.lastName.setValue("Smith");
        this.bio.setValue("text");
    };
};

var viewModel = new UserViewModel();

// Set up bindings
js.bind(viewModel.firstName)
    .to("#firstNameInput")
    .to("#summary .firstName");

js.bind(viewModel.lastName)
    .to("#lastNameInput", { event: "keyup" })
    .to("#summary .lastName");

js.bind(viewModel.bio)
    .to("#bioInput")
    .to("#summary .bio");

js.bind(viewModel.rememberMe)
    .to("#rememberMeInput")
    .to("#summary .rememberMe");

viewModel.setDefaultValues();
