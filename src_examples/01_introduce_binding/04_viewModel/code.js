// Declare view model class
var PersonViewModel = function(){
    this.firstName = js.bindableValue();
    this.lastName = js.bindableValue();

    this.doSomething = function(){
        this.firstName.setValue("John");
        this.lastName.setValue("Smith");
    }
}

// Create view model instance
var meViewModel = new PersonViewModel();

// Using view model instance
js.bind(meViewModel.firstName).to("#viewModel .firstName");
js.bind(meViewModel.lastName).to("#viewModel .lastName");

meViewModel.doSomething();