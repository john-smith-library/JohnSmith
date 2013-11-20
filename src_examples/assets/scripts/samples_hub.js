
////////////////////////////////////////////////////////////
// View Model

function ApplicationViewModel(data){
    this.contentWidth = js.bindableValue();
    this.contentHeight = js.bindableValue();
    this.tableOfContentVisible = js.bindableValue();
}

ApplicationViewModel.prototype.updateWidth = function(width){
    var actualWidth = Math.min(1400, width);
    this.contentWidth.setValue(actualWidth);
};

ApplicationViewModel.prototype.updateHeight = function(height){
    this.contentHeight.setValue(height);
};

ApplicationViewModel.prototype.initState = function(){
};

ApplicationViewModel.prototype.showTableOfContents = function(){
    if (this.tableOfContentVisible.getValue()) {
        this.tableOfContentVisible.setValue(false);
    } else {
        this.tableOfContentVisible.setValue(true);
    }
};

ApplicationViewModel.prototype.hideTableOfContents = function(){
    this.tableOfContentVisible.setValue(false);
};

////////////////////////////////////////////////////////////
// View

function ApplicationView(){
}

ApplicationView.prototype.init = function(viewModel){
    var NAV_PANEL_WIDTH = 188;

    var $window = $(window);
    var $appContent = $(".appContent");
    var $fullHeight = $(".fullHeight");
    var $sourceContent = $(".sourceContent");
    var $navPanel = $("#mainNavigation");
    var root = this.getRootElement();

    var reactOnResize = function(){
        viewModel.updateWidth($window.width());
        viewModel.updateHeight(
            $window.height() - 65 - 85 - 60
        );
    };

    $window.resize(reactOnResize);

    this.on("#browseAll", "click").call(viewModel.showTableOfContents);
    this.on("#tableOfContentsOverlay", "click").call(viewModel.hideTableOfContents);

    this.bind(viewModel.tableOfContentVisible).to(function(visible){
        var $tableOfContents = $("#tableOfContents");
        if (visible) {
            $tableOfContents.css("height", ($("#result").height() - 50) + "px");
            setTimeout(function(){
                $tableOfContents.addClass("shown");
            }, 1000);
            $("#tableOfContentsOverlay").fadeIn("slow");
                //.addClass("visible");
        } else {
            $tableOfContents
                .removeClass("shown")
                .css("height", "0");
            $("#tableOfContentsOverlay").fadeOut("slow");
                //.removeClass("visible");
        }
    });

    this.bind(viewModel.contentWidth).to(function(width){
        var clientWidth = width - 40;

        $appContent.css("width", width + "px");
        $fullHeight.css("width", (width - 40 - 15) / 2);
        $navPanel.css("left", (clientWidth/2 + clientWidth/4 - NAV_PANEL_WIDTH/2) + 'px');

    });

    this.bind(viewModel.contentHeight).to(function(height){
        $fullHeight.css("height", height + "px");
        $sourceContent.css("height", (height - 30 * 2)/2);
    });

    reactOnResize();
};

ApplicationView.prototype.template = "#applicationTemplate";

////////////////////////////////////////////////////////////
// Main

function runApplication(data){
    var viewModel = new ApplicationViewModel(data);
    var view = new ApplicationView();

    js.createView(view, viewModel).attachTo("#application");
}