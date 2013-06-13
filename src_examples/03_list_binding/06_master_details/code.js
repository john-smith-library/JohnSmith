/* Model - List item class */
var ProgrammingLanguage= function(name, intendedUse, paradigms, typeChecking){
    this.name = name;
    this.intendedUse = intendedUse;
    this.paradigms = paradigms;
    this.typeChecking = typeChecking;
};

/* View Model */
var programmingLanguages = js.bindableList();

/* View */
var ListView = function(){
    this.template = "#languageListTemplate";

    this.init = function(viewModel){
        this.bind(viewModel.name).to("a");
    };
};

var DetailsView = function(){
    this.template = "#languageDetailsTemplate";

    this.init = function(viewModel){
        this.bind(viewModel.name).to("h2");
        this.bind(viewModel.intendedUse).to(".intendedUse");
        this.bind(viewModel.paradigms).to(".paradigms");
        this.bind(viewModel.typeChecking).to(".typeChecking");
    };
};

/* Getting it all together */

js.bind(programmingLanguages).to("#programmingLanguages ul", ListView, { selectable: true });
js.bind(programmingLanguages.selectedItem()).to("#programmingLanguages .details", DetailsView);

/* Nothing interesting here... */
programmingLanguages.add(
    new ProgrammingLanguage(
        "ActionScript",
        "Application, client-side, Web",
        "event-driven, imperative, object-oriented", "static"),
    new ProgrammingLanguage(
        "C++",
        "Application, system",
        "generic, imperative, object-oriented, procedural, functional",
        "static"),
    new ProgrammingLanguage(
        "C#",
        "Application, business, client-side, general, server-side, Web, Robotics",
        "structured, functional,generic, imperative, object-oriented, reflective, concurrent, event-driven",
        "static"),
    new ProgrammingLanguage(
        "Java",
        "Application, business, client-side, general, server-side, Web",
        "generic, imperative, object-oriented, reflective",
        "static"),
    new ProgrammingLanguage(
        "JavaScript",
        "Client-side, Server-side, Web",
        "functional, imperative, prototype-based, reflective",
        "dynamic"));

programmingLanguages.selectedItem().setValue(programmingLanguages.getValue()[4]);