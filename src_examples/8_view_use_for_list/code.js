/* Model */

var Friend = function(firstName, lastName){
    this.firstName = firstName;
    this.lastName = lastName;
}

/* View Model */

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
    new Friend("Joe", "Bloggs"),
    new Friend("Fred",  "Bloggs"),
    new Friend("Bob", "Soap")
]);