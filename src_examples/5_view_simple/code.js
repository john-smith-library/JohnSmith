var viewModel = {
    firstName: "John",
    lastName: "Smith"
};

var view = js.createView(
    "#personTemplate",
    function(view, viewModel){
        view.bind(viewModel.firstName).to(".firstName");
        view.bind(viewModel.lastName).to(".lastName");
    },
    viewModel);

view.renderTo("#me");