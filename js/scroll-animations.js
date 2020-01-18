(function() {

var animated = {
    default: $(".preanimated").not(".top-scrolled, .bottom-scrolled, .center-scrolled"),
    topScrolled: $(".preanimated.top-scrolled"),
    bottomScrolled: $(".preanimated.bottom-scrolled"),
    centerScrolled: $(".preanimated.center-scrolled")
}
var scrolled;

function checkTopScrolled(i, element) {
    element$ = $(element);
    if (element$.offset().top < scrolled) {
        element$.removeClass('preanimated');
    }
}

function checkBottomScrolled(i, element) {
    element$ = $(element);
    if (element$.offset().top + element$.height() < scrolled) {
        element$.removeClass('preanimated');
    }
}

function checkCenterScrolled(i, element) {
    element$ = $(element);
    if (element$.offset().top + element$.height()/2 < scrolled) {
        element$.removeClass('preanimated');
    }
}

function scrollHandler(e) {
    window$ = $(window);
    scrolled = window$.scrollTop() + window$.height();
    animated.default.each(checkCenterScrolled);
    animated.topScrolled.each(checkTopScrolled);
    animated.bottomScrolled.each(checkBottomScrolled);
    animated.centerScrolled.each(checkCenterScrolled);
}

$(window).on("scroll", scrollHandler);
$(window).trigger("scroll");

})();