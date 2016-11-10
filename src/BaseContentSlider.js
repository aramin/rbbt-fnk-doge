// @tcomb

import EventEmitter from "eventemitter3";

export default class BaseContentSlider {

  /**
   * swiper instance
   */
  swiper;

  /**
   * swiper options
   */
  swiperOptions;

  /**
   * captions map
   * @type {{index: string}}
   */
  captions;

  /**
   * options
   * @type ContentSliderOptions
   */
  options: ContentSliderOptions;

  /**
   * css classes
   * @type ContentSliderCSSClasses
   */
  cssClasses: ContentSliderCSSClasses;

  /**
   * event emitter
   */
  eventEmitter: EventEmitter;

  /**
   * event emitter active
   * @type {boolean}
   */
  eventEmitterActive: boolean;

  constructor() {
    this.captions = {};
    this.eventEmitter = new EventEmitter();
  }

  /**
   * init swiper instance
   * @private
   */
  _initSwiper() {
    if(this.swiper) {
      return;
    }

    this.swiper = new Swiper(this.elements.elementsContainer, this.swiperOptions);

    this.swiper.on("onSetTranslate", (swiper) => {
      this._updateCaption(swiper.activeIndex);
    });

    this.swiper.on("onSlidePrevEnd", swiper => {
      if(this.eventEmitterActive) {
        this.eventEmitter.emit("prev", swiper.activeIndex);
      }
    });

    this.swiper.on("onSlideNextEnd", swiper => {
      if(this.eventEmitterActive) {
        this.eventEmitter.emit("next", swiper.activeIndex);
      }
    });
  }

  /**
   * generate the default swiper options for block name
   * @param {string} block - the block-part of the BEM className
   * @returns swiper default options
   * @private
   */
  _generateSwiperDefaultOptionsForBlockName(block: string) {
    return {
      // Swiper Options
      direction: "horizontal",
      slidesPerView: 1,

      // set prev- and next buttons to buttons provided by content-slider
      prevButton: `.${this.cssClasses.prevIcon}`,
      nextButton: `.${this.cssClasses.nextIcon}`,

      // keyboardControl
      keyboardControl: true,

      // hashnav
      hashnav: true,
      hashnavWatchState: true,
      replaceState: true,

      // Swiper CSS Classes
      containerModifierClass: `${block}__container-`,
      slideClass: `${block}__slide`,
      slideActiveClass: `${block}__slide--is-active`,
      slideDuplicateActiveClass: `${block}__slide--is-duplicate-active`,
      slideVisibleClass: `${block}__slide--is-visible`,
      slideDuplicateClass: `${block}__slide--is-duplicate`,
      slideNextClass: `${block}__slide--is-next`,
      slideDuplicateNextClass: `${block}__slide--is-duplicate-next`,
      slidePrevClass: `${block}__slide--is-prev`,
      slideDuplicatePrevClass: `${block}__slide--is-duplicate-prev`,
      noSwipingClass: `${block}__no-swiping`,
      wrapperClass: `${block}__wrapper`,
      bulletClass: `${block}__pagination-bullet`,
      bulletActiveClass: `${block}__pagination-bullet--is-active`,
      buttonDisabledClass: `${block}__button--is-disabled`,
      paginationCurrentClass: `${block}__pagination--is-current`,
      paginationTotalClass: `${block}__pagination-total`,
      paginationHiddenClass: `${block}__pagination--is-hidden`,
      paginationProgressbarClass: `${block}__pagination-progressbar`,
      paginationClickableClass: `${block}__pagination--is-clickable`,
      paginationModifierClass: `${block}__pagination--`,
      lazyLoadingClass: `${block}__lazy`,
      lazyStatusLoadingClass: `${block}__lazy--is-loading`,
      lazyStatusLoadedClass: `${block}__lazy--is-loaded`,
      lazyPreloaderClass: `${block}__lazy-preloader`,
      notificationClass: `${block}__notification`,
      preloaderClass: `${block}__preloader`,
      zoomContainerClass: `${block}__zoom-container`
    }
  }
}  