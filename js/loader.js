(function() {

$(window).on("load", function() {
    var loader = $(".loader-wrapper");
    loader.fadeOut();
    setTimeout(function() {
        loader.remove();
        $("body").css({overflow: "scroll"});
    }, 400);
});

})();
