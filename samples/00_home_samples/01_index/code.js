/* ViewModel */
var GreeterViewModel = function(){
    this.userName = /*(*/js.observableValue()/*)*/;

    this.greetMessage = /*(*/'js.dependentValue'/*)*/;
//    (
//        this.userName,
//        function(userNameValue){
//            if (userNameValue) {
//                return "Hello, " + userNameValue + "!";
//            }
//
//            return "Please, enter your name";
//        });
};

/* Views */
var GreeterView = function(){
    this./*(*/template/*)*/ =
        "<p>Enter your name: <input type='text'/></p>" +
        "<p class='message'></p>";

    this.init = function(dom, viewModel){
        dom('input').observes(viewModel.userName);
        dom('.message').observes(viewModel.greetMessage);
    };
};

/* Render the view */
js.dom('#greeter').render(GreeterView, new GreeterViewModel());