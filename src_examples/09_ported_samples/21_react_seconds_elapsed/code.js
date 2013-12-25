/* Declare view model */
var TimerViewModel = function(){
    this.secondsElapsed = js.bindableValue();

    this.initState = function(){
        this.secondsElapsed.setValue(0);

        var that = this;
        this.timer = setInterval(function(){that.tick();}, 1000);
    };

    this.tick = function(){
        this.secondsElapsed.setValue(this.secondsElapsed.getValue() + 1);
    };

    /* releaseState is a special function that called by JS before
    *  view un-rendering. It says ViewModel to stop using any bindables. */
    this.releaseState = function(){
        clearInterval(this.timer);
    };
};

/* Declare view */
var TimerView = function(){
    // view is very simple, so we use inline template here
    this.template = "<p>Seconds Elapsed: <span></span></p>";

    this.init = function(view, viewModel){
        view.bind(viewModel.secondsElapsed).to("span");
    };
};

/* Render the vew */
js.renderView(TimerView, new TimerViewModel()).to("#sample");