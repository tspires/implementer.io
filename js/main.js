/*Theme Scripts */

(function($){ "use strict";
             
    $(window).on('load', function() {
        $('body').addClass('loaded');
    });
             
/*=========================================================================
	Sticky Header
=========================================================================*/
    function headerHeight(){
        var height = $("#header").height();
        $('.header-height').css('height', height+'px');
    }

	$(function() {
		var header = $("#header"),
			yOffset = 0,
			triggerPoint = 80;
        headerHeight();
        $(window).resize(headerHeight);
		$(window).on( 'scroll', function() {
			yOffset = $(window).scrollTop();

			if (yOffset >= triggerPoint) {
				header.addClass("navbar-fixed-top animated slideInDown");
			} else {
				header.removeClass("navbar-fixed-top animated slideInDown");
			}

		});
	});


/*=========================================================================
        Mobile Menu
=========================================================================*/  
    $('.mainmenu ul.nav').slicknav({
        prependTo: '.header-section .navbar',
        label: '',
        allowParentLinks: true
    });
             
/*=========================================================================
    Sponsor Carousel
=========================================================================*/
    $('.sponsor-carousel').owlCarousel({
        loop: true,
        margin: 5,
        center: false,
        autoplay: true,
        smartSpeed: 500,
        nav: false,
        dots: false,
        responsive : {
            0 : {
                items: 2
            },
            480 : {
                items: 3,
            },
            768 : {
                items: 3,
            },
            992 : {
                items: 4,
            }
        }
    });
             
/*=========================================================================
	Counter Up Active
=========================================================================*/
	var counterSelector = $('.counter');
	counterSelector.counterUp({
		delay: 10,
		time: 1000
	});
                            
/*=========================================================================
	Initialize smoothscroll plugin
=========================================================================*/
	smoothScroll.init({
		offset: 60
	});
	 
/*=========================================================================
	Scroll To Top
=========================================================================*/ 
    $(window).on( 'scroll', function () {
        if ($(this).scrollTop() > 100) {
            $('#scroll-to-top').fadeIn();
        } else {
            $('#scroll-to-top').fadeOut();
        }
    });

/*=========================================================================
	WOW Active
=========================================================================*/ 
   new WOW().init();

})(jQuery);
