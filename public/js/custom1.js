// menu script.
$ (document).ready(function() {
	var fixHeight = function() {
		$ (".navbar-nav").css(
			"max-height",
			document.documentElement.clientHeight - 150
		);
	};
	
		fixHeight();
		
	$(window).resize(function() {
		fixHeight();
	});
	
	$(".navbar .navbar-toggler").on("click", function() {
		fixHeight();
	});			

	$ (".navbar-toggler, .overlay").on("click", function() {
		$ (".mobileMenu, .overlay").toggleClass("open");
		console.log("clicked");
	});
});


// Nice Select
$(document).ready(function() { 			
	$('select').niceSelect();
});


// Owl Testimonials
$('.testi-owl').owlCarousel({
	loop:true,
	margin:10,
	nav:false,
	dots: true,	
	autoplay:true,
	autoplayTimeout:4000,
	autoplayHoverPause:true,
	responsive:{
		0:{
			items:1
		},
		600:{
			items:1
		},
		1000:{
			items:1
		}
	}
})


// Owl Related
$('.related-owl').owlCarousel({
	loop:true,
	margin:30,
	nav:true,
	navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
	responsive:{
		0:{
			items:1
		},
		600:{
			items:2
		},
		1000:{
			items:3
		}
	}
})


// Owl Organizer
$('.organizer-owl').owlCarousel({
	loop:true,
	margin:10,
	nav:true,
	navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
	responsive:{
		0:{
			items:1
		},
		600:{
			items:1
		},
		1000:{
			items:3
		}					
	}
})


// Owl Related
$('.blog-owl').owlCarousel({
	loop:true,
	margin:30,
	nav:true,
	navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
	responsive:{
		0:{
			items:1
		},
		600:{
			items:2
		},
		1000:{
			items:3
		},
		1200:{
			items:4
		}		
	}
})


// Owl widget
$('.widget-owl').owlCarousel({
				loop:true,
				margin:10,
				nav:true,
				navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
				responsive:{
					0:{
						items:1
					},
					600:{
						items:4
					},
					1000:{
						items:7
					}
				}
			})