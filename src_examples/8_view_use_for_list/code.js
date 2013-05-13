/* Model */

var Friend = function(firstName, lastName){
    this.firstName = firstName;
    this.lastName = lastName;
}

/* View Model */

var friends = js.bindableList();

/* View */

var friendViewFactory = function(friend){
    return js.createView(
        "#friendRowTemplate",
        function(view, viewModel){
            view.bind(viewModel.firstName).to(".firstName");
            view.bind(viewModel.lastName).to(".lastName");
        },
        friend
    );
}

js.bind(friends).to("#friendsTable tbody", friendViewFactory);

friends.setValue([
    new Friend("Joe", "Bloggs"),
    new Friend("Fred",  "Bloggs"),
    new Friend("Bob", "Soap")
]);