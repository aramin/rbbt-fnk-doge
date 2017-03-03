// @flow

/**
 * The Overlay Content-Slider Module
 *
 * @export OverlayContentSlider
 */

import Swiper from "swiper";
import merge from "lodash.merge";
import EventEmitter from "eventemitter3";

import {ContentSliderEvent, ContentSliderOptions, ContentSliderCSSClasses} from "./ContentSliderTypes";

import * as ReactivePanZoomModule from 'reactive-panzoom';

const ReactivePanZoom = ReactivePanZoomModule.default;

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

export default class OverlayContentSlider {
  /**
   * elements
   *
   * @property {Array<Element>} content - the content elements defined by `options.content`
   * @property {Array<Element>} triggerContent - the clickable elements
   * @property {Element} overlay - the overlay element defined by `options.overlay`
   * @property {Element} caption - the caption element defined by `cssClasses.caption`
   * @property {Element} elementsContainer - the elements container defined by `cssClasses.elementsContainer`
   * @property {Element} toggleCaptionIcon - the toggle caption icon defined by `cssClasses.toggleCaptionIcon`
   * @property {Element} closeIcon - the close icon defined by `cssClasses.closeIcon`
   * @property {Element} navPosition - the nav position element defined by `cssClasses.navPosition`
   */
  elements: {
    content: Array<Element>,
    triggerContent: Array<Element>,
    overlay: Element,
    caption: Element,
    elementsContainer: Element,
    toggleCaptionIcon: Element,
    closeIcon: Element,
    nav: Element,
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

  reactivePanZoom: ReactivePanZoom;

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
    this._refreshState();

    this.eventEmitter = new EventEmitter();

    // options
    this.options = merge(defaultOptions, options);

    // css classes
    const defaultCssClasses = this._generateCssClassesForBlockName(this.options.bemBlockName);

    if(cssClasses) {
      this.cssClasses = merge(defaultCssClasses, cssClasses);
    } else {
      this.cssClasses = defaultCssClasses
    }

    // swiper options
    let swiperDefaultOptions = this._generateSwiperDefaultOptionsForBlockName(this.options.swiperBemBlockName);

    if(swiperOptions) {
      this.swiperOptions = merge(swiperDefaultOptions, swiperOptions);
    } else {
      this.swiperOptions = swiperDefaultOptions;
    }

    // setup
    this._setupContent();
    this._setupHandlers();

    // call this in the next tick, when the event loop ist empty and all event listeners are active
    window.setTimeout( () => {
      // send init event
      this.eventEmitter.emit("init");

      // show overlay when linked
      if(this._isOverlayOpen()) {
        let hash = window.location.hash;

        // replace state without hash
        this._replaceState();

        // add state with hash
        this._addState(hash);

        this.openOverlay();
      }
    }, 0);
  }

  refresh() {
    if(this.swiper) {
      // destroy swiper
      this._destroySwiper();

      // remove old wrapper-element
      while(this.elements.elementsContainer.firstChild) {
        this.elements.elementsContainer.removeChild(this.elements.elementsContainer.firstChild);
      }
    }

    // empty state
    this._refreshState();

    // reinit state
    this._setupContent();

    // reinit swiper
    this._initSwiper();

    // reinit handlers
    this._setupHandlers();
  }

  // ## SETUP

  _refreshState() {
    this.elements = {
      content: [],
      triggerContent: []
    };
    this.captions = {};
    this.scrollPosition = [0, 0];
  }

  /**
   * setup content
   * @private
   */
  _setupContent() {
    [].forEach.call(document.querySelectorAll(this.options.content), (image) => {
      this.elements.content.push(image);

      if(this.options.triggerSelector) {
        let triggerElem: Element = image.querySelector(this.options.triggerSelector);
        this.elements.triggerContent.push(triggerElem || image);
      } else {
        this.elements.triggerContent.push(image);
      }
    });

    this.elements.overlay = document.querySelector(this.options.overlay);
    this.elements.elementsContainer = OverlayContentSlider._queryByClassName(this.cssClasses.elementContainer);
    this.elements.caption = OverlayContentSlider._queryByClassName(this.cssClasses.caption);
    this.elements.caption.style.display = "none";

    this.elements.toggleCaptionIcon = OverlayContentSlider._queryByClassName(this.cssClasses.toggleCaptionIcon);
    this.elements.closeIcon = OverlayContentSlider._queryByClassName(this.cssClasses.closeIcon);

    this.elements.nav = OverlayContentSlider._queryByClassName(this.cssClasses.nav);
    this.elements.navPosition = OverlayContentSlider._queryByClassName(this.cssClasses.navPosition);

    this._createSliderElement();

    this.reactivePanZoom = new ReactivePanZoom(this.elements.elementsContainer);
  }

  /**
   * setup handlers
   * @private
   */
  _setupHandlers() {
    this.elements.triggerContent.forEach((elem, elemIndex) => {
      elem.addEventListener("click", (event) => {
        this._addState();
        this.openOverlay();
        this.swiper.slideTo(elemIndex, 0);
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

    // disallow pinch-zoom on navbar
    this.elements.nav.addEventListener("touchmove", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
    });

    this.elements.caption.addEventListener("touchmove", (ev) => {
      ev.preventDefault();
      ev.stopPropagation();
    });

    // key handlers
    document.addEventListener("keyup", (event) => {
      // escape key
      if(event.keyCode === 27) {
        if(this._isOverlayOpen()) {
          this.closeOverlay();
        }
      }

    });

    // orientation change handler
    window.addEventListener("orientationchange", (): void => {
      this._recalculateSizes();
    });

    this.reactivePanZoom.on("zoom-active", () => {
      this.eventEmitter.emit("zoom-active");
      this.swiper.detachEvents();
    });

    this.reactivePanZoom.on("zoom-inactive", () => {
      this.swiper.attachEvents();
      this.eventEmitter.emit("zoom-inactive");
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

  _destroySwiper() {
    this.swiper.detachEvents()
    this.swiper.destroy(true);
    delete this.swiper;
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
    const swiperWrapperElement = OverlayContentSlider._createSwiperElementByClassName(this.swiperOptions.wrapperClass);

    this.elements.content.forEach((origElem, index) => {
      // extract slider element
      let elem = this.options.extractSliderElement(origElem.cloneNode(true));
      elem.classList.add("c-swiper__slide-content");

      // extract hashnav token
      var hashNavToken = this.options.extractHashnavToken(origElem.cloneNode(true), index);

      // extract description
      this.captions[index] = this.options.extractCaption(origElem.cloneNode(true));

      // append content element to wrapper element
      let swiperSlider = OverlayContentSlider._createSwiperElementByClassName(this.swiperOptions.slideClass);
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
  _clearHashnav() {
    if(window.history) {
      // use replaceState or pushState
      if(this.swiperOptions.replaceState) {
        window.history.replaceState("", document.title, window.location.pathname + window.location.search);
      } else {
        window.history.pushState("", document.title, window.location.pathname + window.location.search);
      }
    } else {
      // fallback for IE9 without polyfill
      window.location.hash = "";
    }
  }

  /**
   * add current url to history
   * reason: to close the overlay on history.back()
   * @private
   */
  _addState(hash?: string = "") {
    if(this.swiperOptions.replaceState && window.history.pushState) {
      window.history.pushState("", document.title, window.location.pathname + hash);
    }
  }

  _replaceState(hash?: string = "") {
    if(this.swiperOptions.replaceState && window.history.replaceState) {
      window.history.replaceState("", document.title, window.location.pathname + hash);
    }
  }
  
  _isOverlayOpen(): boolean {
    return window.location.hash && window.location.hash.match(/#cs-/);
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
    OverlayContentSlider._setDocumentScrollbar(false);

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
  closeOverlay(modifyHistory: boolean = true) {
    this.elements.overlay.classList.remove(this.cssClasses.overlayModVisible);
    OverlayContentSlider._setDocumentScrollbar(true);

    if(modifyHistory) {
      this._restoreScrollPosition();

      if(this.eventEmitterActive) {
        this.eventEmitter.emit("close");
      }

      if(this.swiperOptions.replaceState) {
        window.history.back();
      } else {
        this._clearHashnav();
      }
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

  /**
   * show the overlay if the url contains a slide-hash (e.g. #s1)
   * @private
   */
  onHistoryChange() {
    if(window.location.hash && window.location.hash.match(/#cs-/)) {
      this.openOverlay();
    } else {
      this.closeOverlay(false);
    }
  }
}
