/* create bindable values */
var firstName = js.bindableValue();
var lastName = js.bindableValue();
var fullName = js.dependentValue(
    firstName,
    lastName,
    function(firstNameValue, lastNameValue){
        return firstNameValue + " " + lastNameValue;
    });

/* do binding */
js.bind(firstName).to("#firstNameInput");
js.bind(lastName).to("#lastNameInput");
js.bind(fullName).to("#fullName");

/* put some values to bindables */
firstName.setValue("John");
lastName.setValue("Smith");