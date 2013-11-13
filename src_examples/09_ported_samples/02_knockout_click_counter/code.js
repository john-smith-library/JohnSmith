var ClickViewModel = function(){
    this.numberOfClicks = js.bindableValue();

    this.hasClickedToManyTimes = js.dependentValue(
        this.numberOfClicks,
        function(numberOfClicksValue){
            return numberOfClicksValue >= 3;
        });

    this.registerClick = function(){
        var newClicksCount = this.numberOfClicks.getValue() + 1;

        this.numberOfClicks.setValue(newClicksCount);
    };

    this.resetClicks = function(){
        this.numberOfClicks.setValue(0);
    };

    this.initState = function(){
        this.numberOfClicks.setValue(0);
    };
};

var ClickView = function(){
    this.template = "#clickViewTemplate";
    this.init = function(viewModel){
        var toManyClicksPanel = this.find("#hasClickedTooManyTimes").getTarget();
        var clickMeButton = this.find("#clickMe").getTarget();

        this.bind(viewModel.numberOfClicks).to("#numberOfClicks");
        this.bind(viewModel.hasClickedToManyTimes).to(function(tooManyClicks){
            if (tooManyClicks) {
                toManyClicksPanel.show();
                clickMeButton.prop("disabled", true);
            } else {
                toManyClicksPanel.hide();
                clickMeButton.prop("disabled", false);
            }
        });

        this.on("#clickMe", "click").do(viewModel.registerClick);
        this.on("#resetClicks", "click").do(viewModel.resetClicks);
    };
};

js.renderView(ClickView, new ClickViewModel()).to("#sample");