'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScroll = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');

const tabContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(mod => mod.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  e.key === 'Escape' && !modal.classList.contains('hidden') ? closeModal() : '';
});


///////////////////////////////////////
// Cookies Section
const cookieBody = document.querySelector('body');
// Create Element 
const message = document.createElement('div');
// Add Content
message.innerHTML = 'We use cookies for anylitics and exprience <button class="btn btn--close--cookie">Got it!</button>'
message.classList.add('cookie-message');
message.style.height = "70px";
cookieBody.append(message);

// Add Event
const cookieClose = document.querySelector('.btn--close--cookie');
cookieClose.addEventListener('click', function () {
  message.remove();
});


///////////////////////////////////////
// Smooth Scroll
btnScroll.addEventListener('click', function (e) {
  const scoord1 = section1.getBoundingClientRect();
  window.scrollTo({
    left: scoord1.left + window.pageXOffset,
    top: scoord1.top + window.pageYOffset,
    behavior: "smooth"
  });
});


///////////////////////////////////////
// Nav links
document.querySelector('.nav__links').addEventListener('click', function (el) {
  el.preventDefault();
  if (el.target.classList.contains('nav__link')) {
    const id = el.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({
      behavior: "smooth"
    });
  }
});


///////////////////////////////////////
// Tabs Component
tabContainer.addEventListener('click', function (tab) {
  const clicked = tab.target.closest('.operations__tab');
  if (!clicked) return;
  // Remove Active Class
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabContent.forEach(c => c.classList.remove('operations__content--active'));
  // Active Class
  clicked.classList.add('operations__tab--active');
  // Content Active
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});


///////////////////////////////////////
// Nav Fade In animation
const hoverEnter = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const sibilings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    sibilings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
}
nav.addEventListener('mouseover', hoverEnter.bind(0.5));

// Sticky Nav Fade Out animation
nav.addEventListener('mouseout', hoverEnter.bind(1));

///////////////////////////////////////
// Sticky Navigation
const stickyHeader = document.querySelector('.header');
const stickyHeight = nav.getBoundingClientRect().height;

const stickyCallback = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
}

const stickyOptions = {
  root: null,
  rootMargin: `-${stickyHeight}px`,
  threshold: 0
}

const stickyObserver = new IntersectionObserver(stickyCallback, stickyOptions);
stickyObserver.observe(stickyHeader);


///////////////////////////////////////
// Reval Section
const allSection = document.querySelectorAll('.section');

const secCallback = function (entries, observer) {
  const [entry] = entries;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}
const revalSec = new IntersectionObserver(secCallback, {
  root: null,
  threshold: .15
});

allSection.forEach(section => {
  revalSec.observe(section);
  section.classList.add('section--hidden');
});

///////////////////////////////////////
// Image Lazy Loading 
const img = document.querySelectorAll('img[data-src]');
const imgLoad = function (entries, observer) {
  const [entry] = entries;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
}
const imgIntersec = new IntersectionObserver(imgLoad, {
  root: null,
  threshold: 0,
  rootMargin: "-200px"
});

img.forEach(img => {
  imgIntersec.observe(img);
});


// Slider
const slider = function () {
  const btnNext = document.querySelector('.slider__btn--right')
  const btnLeft = document.querySelector('.slider__btn--left');
  const slides = document.querySelectorAll('.slide');
  const dotContainer = document.querySelector('.dots');
  const maxSlide = slides.length;
  let currentSlide = 0;


  // Create Dots
  const createDots = function () {
    slides.forEach((__, i) => {
      dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`);
    })
  }


  // Activate Dots
  const dotsActivite = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dots => dots.classList.remove('dots__dot--active'));
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  }

  // Slide Loop
  const slideInit = function (slide) {
    slides.forEach((s, i) => (
      s.style.transform = `translateX(${100 * (i - slide)}%)`
    ));
  }


  // Slide Next Init
  const btnNextInit = function () {
    // Condition
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    // Loop function init
    slideInit(currentSlide);
    dotsActivite(currentSlide);
  }

  // Slide Prev Init
  const btnLeftInit = function () {
    // Condition
    if (currentSlide === 0) {
      currentSlide = 0;
    } else {
      currentSlide--;
    }
    // Loop function init
    slideInit(currentSlide);
    dotsActivite(currentSlide);
  }


  // Slide Init
  const init = function () {
    createDots();
    dotsActivite(0);
    slideInit(0);
  };
  init();

  // Slide Prev Click
  btnLeft.addEventListener('click', btnLeftInit);
  //Slide Next Click
  btnNext.addEventListener('click', btnNextInit);

  // Dots slide handler
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const {
        slide
      } = e.target.dataset;
      slideInit(slide);
      dotsActivite(slide);
    }
  });


  // Arrow control
  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowRight' && btnNextInit();
    e.key === 'ArrowLeft' && btnLeftInit()
  });
};
slider();


