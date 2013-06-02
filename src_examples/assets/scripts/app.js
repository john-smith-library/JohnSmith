var Topic = function(id){
    this.id = id;
    this.jsonFilePath = "ajax/" + id + ".json";
    this.htmlFilePath = id + ".html";

    this.setData = function(topicData){
        this.topicData = topicData;
    };
};

var TopicViewModel = function(){
    this.currentTopic = js.bindableValue();
    this.isLoading = js.bindableValue();

    this.setCurrentTopic = function(topic){
        var viewModel = this;

        this.isLoading.setValue(true);
        $.ajax({
            dataType: "json",
            url: topic.jsonFilePath,
            success: function(topicData){
                topic.setData(topicData);
                viewModel.currentTopic.setValue(topic);
                viewModel.isLoading.setValue(false);
            },
            error: function(){
                window.location = topic.htmlFilePath;
            }
        });
    };
};

var AppViewModel = function(){
    this.clientAreaHeight = js.bindableValue();

    this.setHeight = function(height){
        this.clientAreaHeight.setValue(height);
    };
}

$(function(){
    var topicViewModel = new TopicViewModel();
    var appViewModel = new AppViewModel();



    $(".topicLink").click(function(e){
        if(e.ctrlKey) {
            return true;
        }

        var href = $(this).attr("href");
        var id = href.replace(".html", "");
        var topic = new Topic(id);
        topicViewModel.setCurrentTopic(topic);

        return false;
    });

    js.bind(topicViewModel.currentTopic).to(function(topic){
        var $currentTopic = $("#topic");
        $currentTopic.find("h2").text(topic.topicData.title);
        $currentTopic.find(".description .content").html(topic.topicData.description);

        $("aside a.selected").removeClass("selected");
        $("aside #" + topic.id + "Link").addClass("selected");

        if (topic.topicData.code) {
            $currentTopic.find(".javascript code").text(topic.topicData.code);
            $currentTopic.find(".html code").text(topic.topicData.markup);
            $currentTopic.find(".resultContent").html(topic.topicData.markup);

            $currentTopic.find("#example").show();
            $currentTopic.find("#article").hide();

            eval(topic.topicData.code);
        } else {
            $currentTopic.find("#example").hide();
            $currentTopic.find("#article").show();
        }

        $('pre code').each(function(i, e) {
            hljs.highlightBlock(e);
        });
    });

    js.bind(topicViewModel.isLoading).to(function(isLoading){
        if (isLoading) {
            $("#overlay").show();
        } else {
            $("#overlay").fadeOut();
        }
    });

    var $mainContainer = $("#topic, aside");
    var $sections = $("#topic section");
    var $article = $("#topic #article section");

    js.bind(appViewModel.clientAreaHeight).to(function(height){
        $mainContainer.height(height);
        $sections.height((height - 70 - 40)/2);
        $article.height(height - 70 - 20);
    });

    $(window).resize(function(){
        updateElementsLayout(appViewModel);
    });

    updateElementsLayout(appViewModel);
});

function updateElementsLayout(appViewModel){
    var width = $(window).width();
    var height = $(window).height() - $("#mainHeader").height();

    appViewModel.setHeight(height);

    if (width < 1500) {
        $(".topic header").removeClass("span6");
    } else {
        $(".topic header").addClass("span6");
    }
    if (width < 1000) {
        $(".topic .block").removeClass("span6");
    } else {
        $(".topic .block").addClass("span6");
    }
}