var employee = js.bindableList();

js.bind(employee).to({
    handler: "render",
    type: "list",
    to: "#employee",
    formatter: {
        format: function(value){
            return $("<li class='person'></li>").text(value);
        }
    }
});

employee.add("Joe Bloggs", "Fred Bloggs", "Bob Soap");
employee.add("Charlie Farnsbarns");
employee.add("John Q. Public");
employee.add("Joe Public");

employee.remove("Fred Bloggs", "John Q. Public");