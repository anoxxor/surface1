(function() {

var slider = {
    defaults: {
        animationDuration: 300
    },

    isBusyNow: false,

    goToSlide: function(index, sliderItems) {
        var slideSize = $(".slider-items__item").outerWidth();
        this.isBusyNow = true;
        
        $(sliderItems).animate({left: -index * slideSize}, slider.defaults.animationDuration);
        setTimeout(function() {
            slider.isBusyNow = false
            
        }, slider.defaults.animationDuration);
    },

    init: function() {
        var defaults = {
            maxSwipeTime: 500,
            maxOffsetY: 50,
            minOffsetX: 50
        }
        var touchstartPosX;
        var touchstartPosY;
        var touchstartLeft;
        var touchstartTime;
        var touchstartPageScrollTop;

        function pageScrollTop() {
            return $("body").scrollTop() || $("html").scrollTop();
        }

        function handleInvalidSwipe(sliderItems, slide, touch) {
            var isValidOffsetX =  Math.abs(touch.posX - touchstartPosX) > defaults.minOffsetX;
            var isValidOffsetY = Math.abs(touch.posY - touchstartPosY) < defaults.maxOffsetY;
            var isPageScrollingY = touchstartPageScrollTop !== pageScrollTop();

            if (isValidOffsetX && isValidOffsetY && !isPageScrollingY) {
                return false;
            }

            return destSlideIndex = Math.round(Math.abs(touchstartLeft/slide.width));
        }

        function handleFastSwipe(sliderItems, slide) {
            if (Date.now() - touchstartTime > defaults.maxSwipeTime) return false;
            if (sliderItems.left < touchstartLeft) {
                destSlideIndex = Math.trunc(sliderItems.left*-1/slide.width) + 1;
            } else {
                destSlideIndex = Math.trunc(sliderItems.left*-1/slide.width);
            }
            return destSlideIndex;
        }

        function handleSlowSwipe(sliderItems, slide) {
            var destSlideIndex;
            if (Math.abs(sliderItems.left % slide.width) > slide.width/2) {
                destSlideIndex = Math.trunc(sliderItems.left*-1/slide.width) + 1;
            } else {
                destSlideIndex = Math.trunc(sliderItems.left*-1/slide.width);
            }
            return destSlideIndex;
        }

        function changeActiveIndicator(sliderItems$, slideIndex) {
            var sliderIndicators$ = sliderItems$.siblings(".slider-indicators");
            var activeIndicator$ = sliderIndicators$.children(".slider-indicators__item.active");
            var neededIndicator = sliderIndicators$.children(".slider-indicators__item").get(slideIndex);
            
            activeIndicator$.toggleClass("active");
            neededIndicator.classList.add("active");
        }

        $(".slider").on("touchstart", function(e) {
            if (slider.isBusyNow) return;

            var thi$ = $(this).children(".slider-items");
            var touch = {};
            touch.posX = e.changedTouches[0].pageX;
            touch.posY = e.changedTouches[0].pageY;

            touchstartPosX = touch.posX;
            touchstartPosY = touch.posY;
            touchstartLeft = thi$.position().left;
            touchstartTime = Date.now();
            touchstartPageScrollTop = pageScrollTop();
        })
        
        $(".slider").on("touchend", function(e) {
            if (slider.isBusyNow) return;

            var thi$ = $(this).children(".slider-items");

            var touch = {};
            touch.posX = e.changedTouches[0].pageX;
            touch.posY = e.changedTouches[0].pageY;

            var slide = {};
            slide.width = $(".slider-items__item").outerWidth();
            
            var sliderItems = {};
            sliderItems.left = thi$.position().left;
            sliderItems.itemsNumber = thi$.children().length;
            
            var destSlideIndex = handleInvalidSwipe(sliderItems, slide, touch);
            if (destSlideIndex === false) {
                destSlideIndex = handleFastSwipe(sliderItems, slide)
            }
            if (destSlideIndex === false) {
                destSlideIndex = handleSlowSwipe(sliderItems, slide);
            }

            if (destSlideIndex < 0) {
                destSlideIndex = 0;
            }

            if (destSlideIndex > sliderItems.itemsNumber-1) {
                destSlideIndex = sliderItems.itemsNumber-1;
            }

            slider.goToSlide(destSlideIndex, thi$.get(0));

            changeActiveIndicator(thi$, destSlideIndex);
        });
        
        $(".slider").on("touchmove", function(e) {
            if (slider.isBusyNow) return;

            if (touchstartPageScrollTop !== pageScrollTop()) {
                return;
            }

            thi$ = $(this).children(".slider-items");
            
            var touch = {};
            touch.posX = e.changedTouches[0].pageX;
            thi$.css('left', touchstartLeft + touch.posX - touchstartPosX);
        });
    }
}

slider.init();

})();