var friend = js.bindableValue();

var friendViewFactory = function(friend){
    return js.createView(
        "#friendTemplate",
        function(view, viewModel){
            view.bind(viewModel.firstName).to(".firstName");
            view.bind(viewModel.lastName).to(".lastName");
        },
        friend
    );
}

js.bind(friend).to("#myFriend", friendViewFactory);

friend.setValue({
    firstName: "Joe",
    lastName: "Bloggs"
});
