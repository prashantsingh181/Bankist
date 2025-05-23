'use strict';

// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const navLinks = document.querySelector('.nav__links');
const nav = document.querySelector('.nav');
const navLogo = document.querySelector('.nav__logo');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++) {
  btnsOpenModal[i].addEventListener('click', openModal);
}

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

// handling modal
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/*------ Handling Click in Nav ------*/
navLinks.addEventListener('click', function (e) {
  e.preventDefault();
  const navLink = e.target.closest('.nav__link');
  if (!navLink) return;
  const href = navLink.getAttribute('href');
  if (href && href !== '#') {
    const element = document.querySelector(href);

    // Two methods of scrolling-
    // either select an element and scroll into view
    // OR use window.scrollTo

    // Method 1
    // const rect = element.getBoundingClientRect();
    // window.scrollTo({ top: rect.top, left: rect.left, behavior: 'smooth' });

    // Method 2
    element.scrollIntoView({ behavior: 'smooth' });
  }
});

function handleNavLinkHover(e, opacity) {
  const navLink = e.target.closest('.nav__link');
  if (!navLink) return;

  const siblings = navLink.closest('.nav').querySelectorAll('.nav__link');
  navLogo.style.opacity = opacity;
  siblings.forEach(item => {
    if (item !== navLink) {
      item.style.opacity = opacity;
    }
  });
}

nav.addEventListener('mouseover', e => handleNavLinkHover(e, 0.5));
nav.addEventListener('mouseout', e => handleNavLinkHover(e, 1));

/*------ Handling Nav Sticky ------*/
const header = document.querySelector('.header');
const headerRect = header.getBoundingClientRect();
const navHeight = nav.getBoundingClientRect().height;

// Method 1
// window.addEventListener('scroll', function (e) {
//   if (this.window.scrollY > headerRect.height) {
//     nav.classList.add('sticky');
//   }
// });

function stickyNav(entries) {
  const [entry] = entries;
  if (entry.isIntersecting) {
    nav.classList.remove('sticky');
  } else {
    nav.classList.add('sticky');
  }
}

// Method 2
const observer = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: [0],
  rootMargin: `-${navHeight}px`,
});

observer.observe(header);

/*------ Handling Tab Selection ------*/
const operationTabs = document.querySelectorAll('.operations__tab');
const operationContents = document.querySelectorAll('.operations__content');
const operationsTab = document.querySelector('.operations__tab-container');
function changeTabs(e) {
  const tab = e.target.closest('.operations__tab');
  if (!tab) return;
  const tabIndex = tab.dataset.tab;
  const targetContent = document.querySelector(
    `.operations__content--${tabIndex}`
  );
  operationTabs.forEach(t => t.classList.remove('operations__tab--active'));
  tab.classList.add('operations__tab--active');
  operationContents.forEach(c =>
    c.classList.remove('operations__content--active')
  );
  targetContent.classList.add('operations__content--active');
}
operationsTab.addEventListener('click', changeTabs);

// animating element
const elementsToAnimate = document.querySelectorAll(
  '[data-animate], [data-animate-after]'
);
function animateElements(entries) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('animate');
    animateObserver.unobserve(entry.target);
  });
}
const animateObserver = new IntersectionObserver(animateElements, {
  root: null,
  threshold: 0,
  rootMargin: '-60px',
});

elementsToAnimate.forEach(element => animateObserver.observe(element));

const slider = function () {
  const slider = document.querySelector('.slider__container');
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slider.style.transform = `translateX(-${100 * slide}%)`;
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '100px',
});

imgTargets.forEach(img => imgObserver.observe(img));
