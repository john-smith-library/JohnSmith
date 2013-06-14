/* List view */
var ListView = function(){
    this.template = "<li><a href='#'></a></li>";

    this.init = function(viewModel){
        this.bind(viewModel.name).to("a");
    };
};

/* View Model */
var ViewModel = function(){
    this.people = js.bindableList();
};

/* Create view model instance */
var viewModel = new ViewModel();

/* Setup binding */
js.bind(viewModel.people).to("#listSelection_simple", ListView, { selectable: true });

/* Put some values to list */
var johnSmith = { name: "John Smith" };

viewModel.people.setValue([
    johnSmith,
    { name: "Joe Bloggs" },
    { name: "Fred Bloggs" },
    { name: "Bob Soap" }
]);

/* Pick selected item */
viewModel.people.selectedItem().setValue(johnSmith);