var employee = js.bindableList();

var View = function(){
    this.template = "#listItemTemplate";
    this.init = function(viewModel){
        this.bind(viewModel.name).to("li");
    };
}
js.bind(employee).to("#employee", View);

var joeBloggs          = { name: "Joe Bloggs" };
var fredBloggs         = { name: "Fred Bloggs" };
var bobSoap            = { name: "Bob Soap" };
var charlieFarnsbarns  = { name: "Charlie Farnsbarns" };
var johnQPublic        = { name: "John Q. Public" };
var joePublic          = { name: "Joe Public" };

employee.add(joeBloggs, fredBloggs, bobSoap);
employee.add(charlieFarnsbarns);
employee.add(johnQPublic);
employee.add(joePublic);

employee.remove(fredBloggs, johnQPublic);