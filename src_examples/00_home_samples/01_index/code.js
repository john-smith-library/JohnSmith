/* ViewModel */
var GreeterViewModel = function(){
    this.userName = /*(*/js.bindableValue()/*)*/;

    this.greetMessage = /*(*/js.dependentValue/*)*/(
        this.userName,
        function(userNameValue){
            if (userNameValue) {
                return "Hello, " + userNameValue + "!";
            }

            return "Please, enter your name";
        });
};

/* Views */
var GreeterView = function(){
    this./*(*/template/*)*/ =
        "<p>Enter your name: <input type='text'/></p>" +
        "<p class='message'></p>";

    this.init = function(viewModel){
        this.bind(viewModel.userName).to("input");
        this.bind(viewModel.greetMessage).to(".message");
    };
};

/* Render the view */
js.renderView(GreeterView, new GreeterViewModel()).to("#greeter");