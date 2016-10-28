// @tcomb

/**
 * The Content-Slider Module.
 *
 * @export ContentSlider
 * @see https://github.com/WeltN24/doge
 */

import Swiper from "swiper";
import merge from "lodash.merge";
import EventEmitter from "eventemitter3";

type QuerySelector = string;
type ClassName = string;

/**
 * Content Slider Options
 *
 * @typedef ContentSliderOptions
 * @property {QuerySelector} content - the selector of the swipeable content elements
 * @property {QuerySelector} overlay - the selector of the overlay
 * @property {QuerySelector} bemBlockName - [optional] set the block-part of the css-class name
 * @property {QuerySelector} swiperBemBlockName - [optional] set the block-part of the css-class name for swiper-options
 * @property {Function} extractSliderContent - function which returns element to slide
 * @property {Function} extractCaption - function which returns the description of the slide
 * @property {Function} extractHashnavToken - function which returns the hashnav token
 */
type ContentSliderOptions = {
  content: QuerySelector,
  overlay: QuerySelector,
  bemBlockName?: string,
  swiperBemBlockName?: string,
  extractSliderElement: Function,
  extractCaption: Function,
  extractHashnavToken: Function
}

/**
 * Content Slider CSS Classes
 *
 * @typedef ContentSlider
 * @property {ClassName} overlay - [optional]
 * @property {ClassName} overlayModVisible - [optional]
 * @property {ClassName} nav - [optional]
 * @property {ClassName} navPosition - [optional]
 * @property {ClassName} caption - [optional]
 * @property {ClassName} captionModVisible - [optional]
 * @property {ClassName} elementContainer - [optional]
 * @property {ClassName} wrapper - [optional]
 * @property {ClassName} element - [optional]
 * @property {ClassName} icon - [optional]
 * @property {ClassName} toggleCaptionIcon - [optional]
 * @property {ClassName} toggleCaptionIconModActive - [optional]
 * @property {ClassName} prevIcon - [optional]
 * @property {ClassName} nextIcon - [optional]
 * @property {ClassName} closeIcon - [optional]
 */
type ContentSliderCSSClasses = {
  overlay?: ClassName,
  overlayModVisible?: ClassName,
  nav?: ClassName,
  navPosition?: ClassName,
  caption?: ClassName,
  captionModVisible?: ClassName,
  elementContainer?: ClassName,
  wrapper?: ClassName,
  element?: ClassName,

  // icons
  icon?: ClassName,
  toggleCaptionIcon?: ClassName,
  toggleCaptionIconModActive?: ClassName,
  prevIcon?: ClassName,
  nextIcon?: ClassName,
  closeIcon?: ClassName,
}

type ContentSliderEvent = "open" | "close" | "caption_toggle" | "next" | "prev";

/**
 * default options
 *
 * @type ContentSliderOptions
 */
let defaultOptions: ContentSliderOptions = {
  bemBlockName: "content-slider",
  swiperBemBlockName: "swiper",
  swiperOptions: {}
};

export default class ContentSlider {
  /**
   * elements
   *
   * @property {Array<Element>} content - the content elements defined by `options.content`
   * @property {Element} overlay - the overlay element defined by `options.overlay`
   * @property {Element} caption - the caption element defined by `cssClasses.caption`
   * @property {Element} elementsContainer - the elements container defined by `cssClasses.elementsContainer`
   * @property {Element} toggleCaptionIcon - the toggle caption icon defined by `cssClasses.toggleCaptionIcon`
   * @property {Element} toggleCaptionIconModActive - indicates of the caption is displayed at the moment
   * @property {Element} closeIcon - the close icon defined by `cssClasses.closeIcon`
   * @property {Element} navPosition - the nav position element defined by `cssClasses.navPosition`
   */
  elements: {
    content: Array<Element>,
    overlay: Element,
    caption: Element,
    elementsContainer: Element,
    toggleCaptionIcon: Element,
    toggleCaptionIconModActive: Element,
    closeIcon: Element,
    navPosition: Element
  };

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
   * scroll position
   */
  scrollPosition: Array;

  /**
   * event emitter
   */
  eventEmitter: EventEmitter;

  /**
   * event emitter active
   * @type {boolean}
   */
  eventEmitterActive: boolean;

  /**
   * ContentSlider constructor
   *
   * @constructor
   * @param {ContentSliderOptions} options
   * @param {ContentSliderCSSClasses} cssClasses - [optional]
   * @param swiperOptions
   */
  constructor(options: ContentSliderOptions, cssClasses?: ContentSliderCSSClasses, swiperOptions?) {
    // setup options and defaults
    this.elements = {
      content: []
    };
    this.captions = {};
    this.scrollPosition = [0, 0];
    this.eventEmitter = new EventEmitter();

    // options
    this.options = merge(defaultOptions, options);

    // css classes
    const defaultCssClasses = this._generateCssClassesForBlockName(this.options.bemBlockName);
    this.cssClasses = cssClasses ? merge(defaultCssClasses, cssClasses) : defaultCssClasses;

    // swiper options
    let swiperDefaultOptions = this._generateSwiperDefaultOptionsForBlockName(this.options.swiperBemBlockName);
    this.swiperOptions = swiperOptions ? merge(swiperDefaultOptions, swiperOptions) : swiperDefaultOptions;

    // setup
    this._setupContent();
    this._setupHandlers();

    // show overlay when linked
    // call this in the next tick, when the event loop ist empty and all event listeners are active
    window.setTimeout( () => {
      this._showWhenLinked();
    }, 0);
  }

  // ## SETUP

  /**
   * setup content
   * @private
   */
  _setupContent() {
    [].forEach.call(document.querySelectorAll(this.options.content), (image) => {
      this.elements.content.push(image);
    });

    this.elements.overlay = document.querySelector(this.options.overlay);
    this.elements.elementsContainer = ContentSlider._queryByClassName(this.cssClasses.elementContainer);
    this.elements.caption = ContentSlider._queryByClassName(this.cssClasses.caption);

    this.elements.toggleCaptionIcon = ContentSlider._queryByClassName(this.cssClasses.toggleCaptionIcon);
    this.elements.toggleCaptionIconModActive = ContentSlider._queryByClassName(this.cssClasses.toggleCaptionIconModActive);
    this.elements.closeIcon = ContentSlider._queryByClassName(this.cssClasses.closeIcon);

    this.elements.navPosition = ContentSlider._queryByClassName(this.cssClasses.navPosition);

    this._createSliderElement();
  }

  /**
   * setup handlers
   * @private
   */
  _setupHandlers() {
    this.elements.content.forEach((elem, elemIndex) => {
      elem.addEventListener("click", (event) => {
        this.openOverlay();
        this.swiper.slideTo(elemIndex);
        this.swiper.hashnav.setHash();
        this._updateCaption(elemIndex);
      });
    });

    this.elements.closeIcon.addEventListener("click", () => {
      this.closeOverlay();
    });

    this.elements.toggleCaptionIcon.addEventListener("click", () => {
      this.toggleCaption();
    });

    this.elements.caption.addEventListener("transitionend", (ev) => {
      if(!this.elements.caption.classList.contains(this.cssClasses.captionModVisible)) {
        this.elements.caption.style.display = "none";
      }
    });

    // key handlers
    document.addEventListener("keyup", (event) => {
      // escape key
      if(event.keyCode === 27) {
        this.closeOverlay();
      }

    });
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

    this._updateNavPosition();

    this.swiper.on("onSetTranslate", (swiper) => {
      this._updateNavPosition();
      this._updateCaption(swiper.activeIndex);
    });

    this.swiper.on("onSlidePrevStart", swiper => {
      if(this.eventEmitterActive) {
        this.eventEmitter.emit("prev", swiper.activeIndex);
      }
    });

    this.swiper.on("onSlideNextStart", swiper => {
      if(this.eventEmitterActive) {
        this.eventEmitter.emit("next", swiper.activeIndex);
      }
    });
  }

  // ## DOM Helper

  /**
   * create the slider elements
   *
   * as the content slider is created empty, we need to setup the slide-elements with this method
   *
   * @private
   */
  _createSliderElement() {
    // create swiper wrapper container
    const swiperWrapperElement = ContentSlider._createSwiperElementByClassName(this.swiperOptions.wrapperClass);

    this.elements.content.forEach((origElem, index) => {
      // extract slider element
      let elem = this.options.extractSliderElement(origElem.cloneNode(true));
      elem.classList.add("c-swiper__slide-content");

      // extract hashnav token
      var hashNavToken = this.options.extractHashnavToken(origElem.cloneNode(true), index);

      // extract description
      this.captions[index] = this.options.extractCaption(origElem.cloneNode(true));

      // append content element to wrapper element
      let swiperSlider = ContentSlider._createSwiperElementByClassName(this.swiperOptions.slideClass);
      swiperSlider.setAttribute("data-hash", hashNavToken);

      swiperSlider.appendChild(elem);
      swiperWrapperElement.appendChild(swiperSlider);
    });

    // append wrapper element to elements container
    this.elements.elementsContainer.appendChild(swiperWrapperElement);
  }

  /**
   * create swiper element by className
   *
   * @param {string} className - the created element will get this className set
   * @param {string} tagName - the created element will get this tagName (default: div)
   * @returns {Element}
   * @private
   */
  static _createSwiperElementByClassName(className: string, tagName?: string = "div"): Element {
    let element = document.createElement(tagName);
    element.classList.add(className);
    return element;
  }

  // ## Utilities

  /**
   * show the overlay if the url contains a slide-hash (e.g. #s1)
   * @private
   */
  _showWhenLinked() {
    if(window.location.hash && window.location.hash.match(/#cs-/)) {
      this.openOverlay();
    }
  }

  /**
   * update the caption text
   *
   * the caption text can contain any html string
   *
   * @param {number} index
   * @private
   */
  _updateCaption(index: number) {
    // need to use innerHTML, as caption can contain HTML
    if(this.captions[index]) {
      this.elements.caption.innerHTML = this.captions[index];
    } else {
      this.elements.caption.innerHTML = "";
    }
  }

  /**
   * update nav position
   * @private
   */
  _updateNavPosition() {
    if(this.swiper) {
      let
        activeIndex = this.swiper.activeIndex + 1,
        lastSlideIndex = this.swiper.slides.length;

      this.elements.navPosition.innerHTML = `${activeIndex} von ${lastSlideIndex}`;
    }
  }

  /**
   * recalculate sizes
   *
   * this is need, when the overlay is opened and the browser-window was resized before
   *
   * @private
   */
  _recalculateSizes() {
    if(this.swiper) {
      this.swiper.updateContainerSize();
      this.swiper.updateSlidesSize();
      this.swiper.slideTo(this.swiper.activeIndex);
    }
  }

  /**
   * query the document for an element by className
   * @param {string} className
   * @returns {Element}
   * @private
   * @static
   */
  static _queryByClassName(className: string): Element {
    let elem = document.querySelector(`.${className}`);

    if(elem === null) {
      console.warn(`[doge] unable to query elem by class-name: ${className}`);
    }

    return elem;
  }

  /**
   * clears the part after the hash in the url
   * @private
   * @static
   */
  static _clearHashnav() {
    window.location.hash = "";
  }

  /**
   * set document scrollbar
   * @param {boolean} enable
   * @private
   */
  static _setDocumentScrollbar(enable: boolean) {
    if(enable) {
      document.documentElement.style.overflow = "auto";
    } else {
      document.documentElement.style.overflow = "hidden";
    }
  }

  /**
   * save document scoll position
   * @private
   */
  _saveScrollPosition() {
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    this.scrollPosition = [scrollX, scrollY];
  }

  _restoreScrollPosition() {
    var [scrollX, scrollY] = this.scrollPosition;
    window.scrollTo(scrollX, scrollY);
  }

  // ## Default Options

  /**
   * generate default css classes for block name
   * @param {string} block - the block-part of the BEM className
   * @returns {ContentSliderCSSClasses}
   * @private
   */
  _generateCssClassesForBlockName(block: string): ContentSliderCSSClasses {
    let generateClassNameMakro = (element, modifier?) => {
      if(modifier) {
        return `${block}__${element}--${modifier}`;
      }
      return `${block}__${element}`;
    };

    return {
      element: generateClassNameMakro("element"),
      wrapper: generateClassNameMakro("wrapper"),

      // overlay
      overlay: generateClassNameMakro("overlay"),
      overlayModVisible: generateClassNameMakro("overlay", "is-visible"),

      nav: generateClassNameMakro("nav"),
      navPosition: generateClassNameMakro("nav-position"),
      caption: generateClassNameMakro("caption"),
      captionModVisible: generateClassNameMakro("caption", "is-visible"),
      elementContainer: generateClassNameMakro("element-container"),
      
      // icons
      icon: generateClassNameMakro("icon"),
      toggleCaptionIcon: generateClassNameMakro("toggle-caption-icon"),
      toggleCaptionIconModActive: generateClassNameMakro("toggle-caption-icon", "is-active"),
      prevIcon: generateClassNameMakro("prev-icon"),
      nextIcon: generateClassNameMakro("next-icon"),
      closeIcon: generateClassNameMakro("close-icon")
    }
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

  // # Public

  // ## Overlay

  /**
   * Opens the content-slider overlay
   *
   * If this happens the first time, the Swiper Component will be initialized.
   *
   * @public
   */
  openOverlay() {
    // overlay must be visible, before swiper gets initialized
    this.elements.overlay.classList.add(this.cssClasses.overlayModVisible);
    this._saveScrollPosition();
    ContentSlider._setDocumentScrollbar(false);
    this._initSwiper();
    this._recalculateSizes();

    this.eventEmitterActive = true;
    this.eventEmitter.emit("open");
  }

  /**
   * Close the content-slider overlay
   *
   * @public
   */
  closeOverlay() {
    this.elements.overlay.classList.remove(this.cssClasses.overlayModVisible);
    ContentSlider._clearHashnav();
    ContentSlider._setDocumentScrollbar(true);
    this._restoreScrollPosition();
    if(this.eventEmitterActive) {
      this.eventEmitter.emit("close");
    }
    this.eventEmitterActive = false;
  }

  /**
   * Toggles the visibility of the caption element
   *
   * @public
   */
  toggleCaption() {
    if(this.elements.caption.classList.contains(this.cssClasses.captionModVisible)) {
      this.elements.caption.classList.remove(this.cssClasses.captionModVisible);
      this.elements.toggleCaptionIcon.classList.remove(this.cssClasses.toggleCaptionIconModActive);
      if(this.eventEmitterActive) {
        this.eventEmitter.emit("caption_toggle", false);
      }
    } else {
      if(this.swiper) {
        this._updateCaption(this.swiper.activeIndex);
      }
      this.elements.toggleCaptionIcon.classList.add(this.cssClasses.toggleCaptionIconModActive);

      this.elements.caption.style.display = "block";
      // animation must be started, _after_ display:block has been applied
      window.setTimeout(() => {
        this.elements.caption.classList.add(this.cssClasses.captionModVisible);
      }, 0);

      if(this.eventEmitterActive) {
        this.eventEmitter.emit("caption_toggle", true);
      }
    }
  }

  /**
   * On Event
   */
  on(event: ContentSliderEvent, callback) {
    this.eventEmitter.on(event, callback);
  }
}
