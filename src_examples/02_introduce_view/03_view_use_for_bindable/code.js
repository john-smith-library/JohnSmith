var friend = js.bindableValue();

var FriendView = function(){
    this.template = "#friendTemplate";

    this.init = function(viewModel){
        this.bind(viewModel.firstName).to(".firstName");
        this.bind(viewModel.lastName).to(".lastName");
    };
};

js.bind(friend).to("#myFriend", FriendView);

friend.setValue({
    firstName: "Joe",
    lastName: "Bloggs"
});
