/* Create a bindable list */
var friends = js.bindableList();

/* View */
var FriendView = function(){
    this.template = "#friendRowTemplate";
    this.init = function(viewModel){
        this.bind(viewModel.firstName).to(".firstName");
        this.bind(viewModel.lastName).to(".lastName");
    };
}

js.bind(friends).to("#friendsTable tbody", FriendView);

friends.setValue([
    { firstName: "Joe", lastName: "Bloggs"},
    { firstName: "Fred", lastName: "Bloggs"},
    { firstName: "Bob", lastName: "Soap"}
]);