// @flow

import Swiper from "swiper";
import EventEmitter from "eventemitter3";
import merge from "lodash.merge";
import {ClassName, ContentSliderEvent, ContentSliderCSSClasses} from "./ContentSliderTypes";

type SimpleSliderOptions = {
  root: Element,
  container: ClassName,
  swiperBemBlockName: string
};

/**
 * default options
 *
 * @type SimpleSliderOptions
 */
let defaultOptions: SimpleSliderOptions = {
  bemBlockName: "content-slider",
  swiperBemBlockName: "swiper"
};

export default class SimpleContentSlider {
  /**
   * elements
   *
   * @property {Array<Element>} content - the content elements defined by `options.content`
   * @property {Element} overlay - the overlay element defined by `options.overlay`
   * @property {Element} caption - the caption element defined by `cssClasses.caption`
   * @property {Element} elementsContainer - the elements container defined by `cssClasses.elementsContainer`
   * @property {Element} toggleCaptionIcon - the toggle caption icon defined by `cssClasses.toggleCaptionIcon`
   * @property {Element} closeIcon - the close icon defined by `cssClasses.closeIcon`
   * @property {Element} navPosition - the nav position element defined by `cssClasses.navPosition`
   */
  elements: {
    container: Element,
    caption: Element,
    elementsContainer: Element
  };

  /**
   * options
   * @type SimpleSliderOptions
   */
  options: SimpleSliderOptions;

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
   * event emitter
   */
  eventEmitter: EventEmitter;

  constructor(options: SimpleSliderOptions, cssClasses?: ContentSliderCSSClasses, swiperOptions?) {
    // setup options and defaults
    this.elements = {
      content: []
    };

    this.captions = {};
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

    this._setupElements();
    this._initSwiper();

    // call this in the next tick, when the event loop ist empty and all event listeners are active
    window.setTimeout( () => {
      // send init event
      this.eventEmitter.emit("weltn24-doge:init");
    }, 0);
  }

  /**
   * setup content
   *
   * @private
   */
  _setupElements() {
    this.elements.container = this.options.root.querySelector(this.options.container);
  }

  /**
   * init swiper instance
   * @private
   */
  _initSwiper() {
    if(this.swiper) {
      return;
    }

    this.swiper = new Swiper(this.elements.container, this.swiperOptions);

    this.swiper.on("onSlidePrevEnd", swiper => {
      this.eventEmitter.emit("weltn24-doge:prev", swiper.activeIndex);
    });

    this.swiper.on("onSlideNextEnd", swiper => {
      this.eventEmitter.emit("weltn24-doge:next", swiper.activeIndex);
    });
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
      overlay: generateClassNameMakro("overlay"),
      overlayModVisible: generateClassNameMakro("overlay", "is-visible"),
      elementContainer: generateClassNameMakro("element-container"),
      prevIcon: generateClassNameMakro("prev-icon"),
      nextIcon: generateClassNameMakro("next-icon")
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
      keyboardControl: false,

      // hashnav
      hashnav: false,

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
      wrapperClass: `${block}__wrapper`
    }
  }

  /**
   * On Event
   */
  on(event: ContentSliderEvent, callback) {
    this.eventEmitter.on(event, callback);
  }
}
