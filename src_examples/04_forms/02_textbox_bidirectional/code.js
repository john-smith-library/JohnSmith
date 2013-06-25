var fullName = js.bindableValue();

js.bind(fullName).to("#fullNameTextbox");
js.bind(fullName).to("#fullNameGreeting");

fullName.setValue("John Smith");