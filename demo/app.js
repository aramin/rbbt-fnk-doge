import ContentSlider from "../src/ContentSlider";

new ContentSlider({
  // Doge Options
  content: ".c-content-slider__image",
  overlay: ".c-content-slider__overlay",
  bemBlockName: "c-content-slider",
  swiperBemBlockName: "c-swiper"
}, {
  // Doge CSS Classes
  element: "c-content-slider__element",
  wrapper: "c-content-slider__wrapper",
  overlay: "c-content-slider__overlay",
  overlayModVisible: "c-content-slider__overlay--is-visible",
  nav: "c-content-slider__nav",
  navPosition: "c-content-slider__nav-position",
  description: "c-content-slider__description",
  descriptionModVisible: "c-content-slider__description--is-visible",
  elementContainer: "c-content-slider__element-container",
  icon: "c-content-slider__icon",
  toggleDescriptionIcon: "c-content-slider__toggle-description-icon",
  prevIcon: "c-content-slider__prev-icon",
  nextIcon: "c-content-slider__next-icon",
  closeIcon: "c-content-slider__close-icon",
  elementContainerForceRedraw: "c-content-slider__element-container--force-redraw"
}, {
  // Swiper Options
  direction: 'horizontal',
  slidesPerView: 1,

  // set prev- and next buttons to buttons provided by content-slider
  nextButton: '.c-content-slider__next-icon',
  prevButton: '.c-content-slider__prev-icon',

  // Swiper CSS Classes
  containerModifierClass: 'c-swiper__container-',
  slideClass: 'c-swiper__slide',
  slideActiveClass: 'c-swiper__slide--is-active',
  slideDuplicateActiveClass: 'c-swiper__slide--is-duplicate-active',
  slideVisibleClass: 'c-swiper__slide--is-visible',
  slideDuplicateClass: 'c-swiper__slide--is-duplicate',
  slideNextClass: 'c-swiper__slide--is-next',
  slideDuplicateNextClass: 'c-swiper__slide--is-duplicate-next',
  slidePrevClass: 'c-swiper__slide--is-prev',
  slideDuplicatePrevClass: 'c-swiper__slide--is-duplicate-prev',
  noSwipingClass: 'c-swiper__no-swiping',
  wrapperClass: 'c-swiper__wrapper',
  bulletClass: 'c-swiper__pagination-bullet',
  bulletActiveClass: 'c-swiper__pagination-bullet--is-active',
  buttonDisabledClass: 'c-swiper__button--is-disabled',
  paginationCurrentClass: 'c-swiper__pagination--is-current',
  paginationTotalClass: 'c-swiper__pagination-total',
  paginationHiddenClass: 'c-swiper__pagination--is-hidden',
  paginationProgressbarClass: 'c-swiper__pagination-progressbar',
  paginationClickableClass: 'c-swiper__pagination--is-clickable',
  paginationModifierClass: 'c-swiper__pagination--',
  lazyLoadingClass: 'c-swiper__lazy',
  lazyStatusLoadingClass: 'c-swiper__lazy--is-loading',
  lazyStatusLoadedClass: 'c-swiper__lazy--is-loaded',
  lazyPreloaderClass: 'c-swiper__lazy-preloader',
  notificationClass: 'c-swiper__notification',
  preloaderClass: 'c-swiper__preloader',
  zoomContainerClass: 'c-swiper__zoom-container'
});
