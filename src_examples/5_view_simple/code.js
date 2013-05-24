var viewModel = {
    firstName: "John",
    lastName: "Smith"
};

var PersonView = function(){
    this.template = "#personTemplate";
    this.init = function(viewModel){
        this.bind(viewModel.firstName).to(".firstName");
        this.bind(viewModel.lastName).to(".lastName");
    }
};

var view = js.createView(PersonView, viewModel);

view.renderTo("#me");