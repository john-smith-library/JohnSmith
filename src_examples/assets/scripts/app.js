$(function(){
    $(window).resize(function(){
        updateElementsLayout();
    });

    updateElementsLayout();
});

function updateElementsLayout(){
    var width = $(window).width();

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