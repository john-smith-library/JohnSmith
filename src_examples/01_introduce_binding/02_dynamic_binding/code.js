var firstName = js.bindableValue();
var lastName = js.bindableValue();

js.bind(firstName).to("#dynamicBindingExample .firstName");
js.bind(lastName).to("#dynamicBindingExample .lastName");

firstName.setValue("John");
lastName.setValue("Smith");