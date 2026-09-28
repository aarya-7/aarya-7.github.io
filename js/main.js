/* ===================================================================
 * Tyndale 1.0.0 - Main JS
 *
 * ------------------------------------------------------------------- */

(function(html) {

    'use strict';


   /* animations
    * -------------------------------------------------- */
    const tl = anime.timeline( {
        easing: 'easeInOutCubic',
        duration: 400,
        autoplay: false
    })
    .add({
        targets: '#loader',
        opacity: 0,
        duration: 500,
        begin: function(anim) {
            window.scrollTo(0, 0);
        }
    })
    .add({
        targets: '#preloader',
        opacity: 0,
        complete: function(anim) {
            document.querySelector("#preloader").style.visibility = "hidden";
            document.querySelector("#preloader").style.display = "none";
        }
    })
    .add({
        targets: '.s-header',
        translateY: [-100, 0],
        opacity: [0, 1]
    }, '-=100')
    .add({
        targets: ['.s-intro__text', '.s-intro__about'],
        translateY: [100, 0],
        opacity: [0, 1],
        delay: anime.stagger(150)
    })
    .add({
        targets: '.s-intro__bg',
        opacity: [0, 1],
        duration: 500,
    })
    .add({
        targets: ['.s-intro__scroll-down'],
        opacity: [0, 1],
        duration: 250
    });


   /* preloader
    * -------------------------------------------------- */
    const ssPreloader = function() {

        const preloader = document.querySelector('#preloader');
        if (!preloader) return;

        html.classList.add('ss-preload');
        
        window.addEventListener('load', function() {
            html.classList.remove('ss-preload');
            html.classList.add('ss-loaded');
            tl.play();
        });

    }; // end ssPreloader


   /* intro headline rotator
    * -------------------------------------------------- */
    const ssIntroRotator = function() {

        const el = document.querySelector('#js-intro-rotator');
        if (!el) return;

        const lines = [
            'Finding the moment things <b>broke</b> — and the why behind it. <em>The data way.</em>',
            'Somewhere between a <b>skeptic</b> and a <em>storyteller</em>',
            'I\'m the friend who wants to know why you <b>left</b> the group chat. <em>Professionally, now.</em>',
            'Still not over the app that <b>lost me</b> at <em>onboarding</em>'
        ];

        const SCALE_FLOOR = 0.6;
        const SCALE_STEP = 0.05;

        // shrink font-size (via --rotator-scale) until the box's rendered
        // height fits back inside its fixed min-height, so a long line never
        // grows the box and shifts the background/scroll-down link below it
        function fitText() {
            const maxHeight = parseFloat(getComputedStyle(el).minHeight);
            let scale = 1;

            el.style.setProperty('--rotator-scale', scale);

            while (el.getBoundingClientRect().height > maxHeight && scale > SCALE_FLOOR) {
                scale = Math.round((scale - SCALE_STEP) * 100) / 100;
                el.style.setProperty('--rotator-scale', scale);
            }
        }

        let index = 0;

        // fit the line already in the HTML before any rotation happens
        fitText();

        setInterval(function() {

            // clear any inline opacity/transform left behind by the page-load
            // entrance animation so this CSS transition can take over cleanly
            el.style.opacity = '';
            el.style.transform = '';

            el.classList.add('is-fading');

            setTimeout(function() {
                index = (index + 1) % lines.length;
                el.innerHTML = lines[index];
                fitText();
                el.classList.remove('is-fading');
            }, 900);

        }, 4000);

        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(fitText, 150);
        });

    }; // end ssIntroRotator


   /* mobile menu
    * ---------------------------------------------------- */
    const ssMobileMenu = function() {

        const toggleButton = document.querySelector('.s-header__menu-toggle');
        const mainNavWrap = document.querySelector('.s-header__nav-wrap');
        const siteBody = document.querySelector('body');

        if (!(toggleButton && mainNavWrap)) return;

        toggleButton.addEventListener('click', function(event) {
            event.preventDefault();
            toggleButton.classList.toggle('is-clicked');
            siteBody.classList.toggle('menu-is-open');
        });

        mainNavWrap.querySelectorAll('.s-header__nav a').forEach(function(link) {

            link.addEventListener("click", function(event) {

                // at 900px and below
                if (window.matchMedia('(max-width: 900px)').matches) {
                    toggleButton.classList.toggle('is-clicked');
                    siteBody.classList.toggle('menu-is-open');
                }
            });
        });

        window.addEventListener('resize', function() {

            // above 900px
            if (window.matchMedia('(min-width: 901px)').matches) {
                if (siteBody.classList.contains('menu-is-open')) siteBody.classList.remove('menu-is-open');
                if (toggleButton.classList.contains('is-clicked')) toggleButton.classList.remove('is-clicked');
            }
        });

    }; // end ssMobileMenu


   /* highlight active menu link on pagescroll
    * ------------------------------------------------------ */
    const ssScrollSpy = function() {

        const sections = document.querySelectorAll('.target-section');

        // Add an event listener listening for scroll
        window.addEventListener('scroll', navHighlight);

        function navHighlight() {
        
            // Get current scroll position
            let scrollY = window.pageYOffset;
        
            // Loop through sections to get height(including padding and border), 
            // top and ID values for each
            sections.forEach(function(current) {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 50;
                const sectionId = current.getAttribute('id');
            
               /* If our current scroll position enters the space where current section 
                * on screen is, add .current class to parent element(li) of the thecorresponding 
                * navigation link, else remove it. To know which link is active, we use 
                * sectionId variable we are getting while looping through sections as 
                * an selector
                */
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelector('.s-header__nav a[href*=' + sectionId + ']').parentNode.classList.add('current');
                } else {
                    document.querySelector('.s-header__nav a[href*=' + sectionId + ']').parentNode.classList.remove('current');
                }
            });
        }

    }; // end ssScrollSpy


   /* add elevation to header once page is scrolled
    * ------------------------------------------------------ */
    const ssHeaderScrolled = function() {

        const header = document.querySelector('.s-header');
        if (!header) return;

        window.addEventListener('scroll', function() {
            header.classList.toggle('s-header--scrolled', window.pageYOffset > 40);
        });

    }; // end ssHeaderScrolled


   /* animate elements if in viewport
    * ------------------------------------------------------ */
    const ssAnimateOnScroll = function() {

        const blocks = document.querySelectorAll('[data-animate-block]');

        window.addEventListener('scroll', animateOnScroll);

        function animateOnScroll() {

            let scrollY = window.pageYOffset;

            blocks.forEach(function(current) {

                const viewportHeight = window.innerHeight;
                const triggerTop = (current.offsetTop + (viewportHeight * .2)) - viewportHeight;
                const blockHeight = current.offsetHeight;
                const blockSpace = triggerTop + blockHeight;
                const inView = scrollY > triggerTop && scrollY <= blockSpace;
                const isAnimated = current.classList.contains('ss-animated');

                if (inView && (!isAnimated)) {

                    anime({
                        targets: current.querySelectorAll('[data-animate-el]'),
                        opacity: [0, 1],
                        translateY: [100, 0],
                        delay: anime.stagger(200, {start: 200}),
                        duration: 800,
                        easing: 'easeInOutCubic',
                        begin: function(anim) {
                            current.classList.add('ss-animated');
                        }
                    });

                    if (current.classList.contains('about-stats')) {

                        let counters = current.querySelectorAll('[data-animate-el] .stats__count');

                        counters.forEach(function(counter, i) {

                            let val = +counter.dataset.counter;
                            let round = +(counter.dataset.round || 1);
                            let valSpan = counter.querySelectorAll('span')[0];

                            valSpan.innerText = '0';

                            setTimeout(function() {
                                anime({
                                    targets: valSpan,
                                    innerText: [0, val],
                                    easing: 'linear',
                                    round: round,
                                    duration: 2000
                                });
                            }, i * 200);

                        });
                    }
                }
            });
        }

    }; // end ssAnimateOnScroll




    /* project detail modal
    * ----------------------------------------------------- */
    const ssProjectDetail = function() {

        const folioItems = document.querySelectorAll('.folio-item');
        if (!folioItems.length) return;

        folioItems.forEach(function(folioItem) {

            let thumbLink = folioItem.querySelector('.folio-item__thumb-link');
            let detail = folioItem.querySelector('.folio-item__detail');

            if (!(thumbLink && detail)) return;

            thumbLink.addEventListener('click', function(event) {

                event.preventDefault();

                let instance = basicLightbox.create(
                    '<div class="project-detail-modal">' + detail.innerHTML + '</div>',
                    {
                        onShow: function() {
                            document.body.classList.add('modal-open');
                        },
                        onClose: function() {
                            document.body.classList.remove('modal-open');
                        }
                    }
                );
                instance.show();

            });

        });

    };  // end ssProjectDetail


   /* video Lightbox
    * ------------------------------------------------------ */
    const ssVideoLightbox = function() {

        const videoLink = document.querySelector('.video-link');
        if (!videoLink) return;

        videoLink.addEventListener('click', function(event) {

            const vLink = this.getAttribute('href');
            const iframe = "<iframe src='" + vLink + "' frameborder='0'></iframe>";

            event.preventDefault();

            const instance = basicLightbox.create(iframe);
            instance.show()

        });

    }; // end ssVideoLightbox


   /* show more projects
    * ------------------------------------------------------ */
    const ssFolioShowMore = function() {

        const button = document.querySelector('.js-folio-show-more');
        if (!button) return;

        const extras = document.querySelectorAll('.js-folio-extra');
        let isExpanded = false;

        button.addEventListener('click', function() {
            isExpanded = !isExpanded;

            extras.forEach(function(extra) {
                extra.classList.toggle('js-folio-extra', !isExpanded);
            });

            button.textContent = isExpanded ? 'Show Less' : 'Show More';
        });

    }; // end ssFolioShowMore


   /* quotes carousel — continuous distance-based scale/opacity
    * ------------------------------------------------------ */
    const ssQuotesCarouselScale = function() {

        const viewport = document.querySelector('.quotes-carousel__viewport');
        const cards = document.querySelectorAll('.quote-card');
        if (!(viewport && cards.length)) return;

        const MAX_SCALE   = 1.18;
        const MIN_SCALE   = 0.85;
        const SCALE_STEP  = 0.25;

        const MAX_OPACITY   = 1;
        const MIN_OPACITY   = 0.35;
        const OPACITY_STEP  = 0.28;

        let ticking = true;

        function frame() {
            if (!ticking) return;

            const viewportRect = viewport.getBoundingClientRect();
            const viewportCenter = viewportRect.left + viewportRect.width / 2;

            // read pass: measure every card's live position first...
            const measurements = [];
            cards.forEach(function(card) {
                const rect = card.getBoundingClientRect();
                const cardCenter = rect.left + rect.width / 2;
                measurements.push({ card: card, distancePx: Math.abs(cardCenter - viewportCenter) });
            });

            // getBoundingClientRect().width reflects layout size, not the
            // transform:scale() already applied, so this stays a stable
            // reference regardless of each card's current scale
            const cardWidth = cards[0].getBoundingClientRect().width;
            const trackGap = parseFloat(getComputedStyle(cards[0].parentElement).columnGap) || 0;
            const slotStep = cardWidth + trackGap;

            // ...write pass: apply the derived scale/opacity, kept separate
            // from the read pass above so measuring never forces a reflow
            // against a style we just wrote a moment ago
            measurements.forEach(function(m) {
                const distanceFromCenter = slotStep ? m.distancePx / slotStep : 0;

                const scale = Math.max(MAX_SCALE - (distanceFromCenter * SCALE_STEP), MIN_SCALE);
                const opacity = Math.max(MAX_OPACITY - (distanceFromCenter * OPACITY_STEP), MIN_OPACITY);

                m.card.style.setProperty('--card-scale', scale.toFixed(3));
                m.card.style.setProperty('--card-opacity', opacity.toFixed(3));
            });

            requestAnimationFrame(frame);
        }

        // only run the per-frame measuring loop while the carousel is
        // actually on screen, so it costs nothing while scrolled past
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && !ticking) {
                    ticking = true;
                    requestAnimationFrame(frame);
                } else if (!entry.isIntersecting) {
                    ticking = false;
                }
            });
        });

        observer.observe(viewport);

    }; // end ssQuotesCarouselScale


   /* alert boxes
    * ------------------------------------------------------ */
    const ssAlertBoxes = function() {

        const boxes = document.querySelectorAll('.alert-box');
  
        boxes.forEach(function(box){

            box.addEventListener('click', function(event) {
                if (event.target.matches('.alert-box__close')) {
                    event.stopPropagation();
                    event.target.parentElement.classList.add('hideit');

                    setTimeout(function(){
                        box.style.display = 'none';
                    }, 500)
                }
            });
        })

    }; // end ssAlertBoxes


   /* smoothscroll
    * ------------------------------------------------------ */
    const ssMoveTo = function(){

        const easeFunctions = {
            easeInQuad: function (t, b, c, d) {
                t /= d;
                return c * t * t + b;
            },
            easeOutQuad: function (t, b, c, d) {
                t /= d;
                return -c * t* (t - 2) + b;
            },
            easeInOutQuad: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t + b;
                t--;
                return -c/2 * (t*(t-2) - 1) + b;
            },
            easeInOutCubic: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t*t + b;
                t -= 2;
                return c/2*(t*t*t + 2) + b;
            }
        }

        const triggers = document.querySelectorAll('.smoothscroll');
        
        const moveTo = new MoveTo({
            tolerance: 0,
            duration: 1200,
            easing: 'easeInOutCubic',
            container: window
        }, easeFunctions);

        triggers.forEach(function(trigger) {
            moveTo.registerTrigger(trigger);
        });

    }; // end ssMoveTo


   /* Initialize
    * ------------------------------------------------------ */
    (function ssInit() {

        ssPreloader();
        ssIntroRotator();
        ssMobileMenu();
        ssScrollSpy();
        ssHeaderScrolled();
        ssAnimateOnScroll();
        ssProjectDetail();
        ssVideoLightbox();
        ssFolioShowMore();
        ssQuotesCarouselScale();
        ssAlertBoxes();
        ssMoveTo();

    })();

})(document.documentElement);