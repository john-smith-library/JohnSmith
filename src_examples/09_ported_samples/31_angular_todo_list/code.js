/*************
 * View Models
 **************/

var TodoItemViewModel = function(text, done){
    this.text = text;
    this.done = js.bindableValue();

    this.initState = function(){
        if (done === true)
        {
            this.done.setValue(true);
        } else {
            this.done.setValue(false);
        }
    };
};

var TodoListViewModel = function(){
    this.items = js.bindableList();
    this.todoText = js.bindableValue();

    var items = this.items;
    this.remaining = js.dependentValue(
        this.items,
        function(itemsArray){
            var result = 0;
            for (var i = 0; i < items.getValue().length; i++) {
                if (items.getValue()[i].done.getValue() === false) {
                    result++;
                }
            }

            for (var i = 0; i < itemsArray.length; i++) {
                this.setupDependencyListener(itemsArray[i].done);
            }

            return result;
        });

    this.addTodo = function(){
        this.items.add(new TodoItemViewModel(this.todoText.getValue()));
        this.todoText.setValue("");
    };

    this.initState = function(){
        this.items.add(
            new TodoItemViewModel("learn angular", true),
            new TodoItemViewModel("build an angular app", true),
            new TodoItemViewModel("learn JohnSmith"),
            new TodoItemViewModel("build JohnSmith app"));
    };
};

/*************
 * Views
 **************/

var TodoItemView = function(){
    this.template = "<li><input type='checkbox' /><label></label></li>";
    this.init = function(viewModel){
        this.bind(viewModel.text).to("label");
        this.bind(viewModel.done).to("input");
    };
};

var TodoListView = function(){
    this.template = "#todoListViewTemplate";
    this.init = function(viewModel){
        this.bind(viewModel.items).to("ul", TodoItemView);
        this.bind(viewModel.items.count()).to(".total");
        this.bind(viewModel.remaining).to(".remaining");
        this.bind(viewModel.todoText).to("#todoText");

        this.on("#addButton", "click").do(viewModel.addTodo);
    };
};

/*************
 * Composing the app
 **************/

js.renderView(TodoListView, new TodoListViewModel()).to("#todoApp");