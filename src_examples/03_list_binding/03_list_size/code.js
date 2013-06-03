// Create a list
var friendsList = js.bindableList();

// Bind list size to the markup
js.bind(friendsList.count()).to("#friendsCount span");

// Set list value to cause list size refresh
friendsList.setValue(["Friend1", "Friend2", "Friend3"]);