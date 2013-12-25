var friend = js.bindableValue();

var FriendView = function(){
    this.template = "#friendTemplate";

    this.init = function(view, viewModel){
        view.bind(viewModel.firstName).to(".firstName");
        view.bind(viewModel.lastName).to(".lastName");
    };
};

js.bind(friend).to("#myFriend", FriendView);

friend.setValue({
    firstName: "Joe",
    lastName: "Bloggs"
});
