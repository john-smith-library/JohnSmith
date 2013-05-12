var people = js.bindableList();

js.bind(people).to({
    handler: "render",
    type: "list",
    to: "#people",
    formatter: {
        format: function(value){
            return $("<li class='person'></li>").text(value);
        }
    }
});

people.setValue(["John Smith", "Marilyn Manson"]);