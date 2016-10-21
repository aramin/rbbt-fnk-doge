// @tcomb

import Swiper from 'swiper';
import merge from 'lodash.merge';
import debounce from 'lodash.debounce';

type QuerySelector = string;
type ClassName = string;

type ContentSliderOptions = {
  // content: the selector of the swipeable content elements
  content: QuerySelector,

  // overlay: the selector of the overlay
  overlay: QuerySelector,

  // bemBlockName: set the block-part of the css-class name
  bemBlockName?: string
}

type ContentSliderCSSClasses = {
  overlay: ClassName,
  overlayModVisible: ClassName,
  nav: ClassName,
  navPosition: ClassName,
  description: ClassName,
  descriptionModVisible: ClassName,
  elementContainer: ClassName,
  wrapper: ClassName,
  element: ClassName,

  // icons
  icon: ClassName,
  toggleDescriptionIcon: ClassName,
  prevIcon: ClassName,
  nextIcon: ClassName,
  closeIcon: ClassName,
}

let defaultOptions: ContentSliderOptions = {
  bemBlockName: "content-slider",
  swiperOptions: {}
};

export default class ContentSlider {
  // elements
  elements:{
    content: Array<DomElement>,
    overlay: DomElement,
    description: DomElement,
    elementsContainer: DomElement,
    toggleDescriptionIcon: DomElement,
    closeIcon: DomElement,
    navPosition: DomElement
  };

  options:ContentSliderOptions;
  cssClasses:ContentSliderCSSClasses;

  // Swiper
  swiper;
  swiperOptions;


  constructor(options:ContentSliderOptions, cssClasses?:ContentSliderCSSClasses, swiperOptions?) {
    // setup options and defaults
    this.elements = {
      content: []
    };

    this.options = merge(defaultOptions, options);
    this.cssClasses = cssClasses ?
      merge(this._generateCssClassesForBlockName(this.options.bemBlockName), cssClasses) :
      this._generateCssClassesForBlockName(this.options.bemBlockName);

    this.swiperOptions = swiperOptions;

    // setup
    this._setupContent();
    this._setupCSSClasses();
    this._setupHandlers();
  }

  // ## SETUP

  _setupContent() {
    [].forEach.call(document.querySelectorAll(this.options.content), (image) => {
      this.elements.content.push(image);
    });

    this.elements.overlay = document.querySelector(this.options.overlay);
    this.elements.elementsContainer = this._queryByClassName(this.cssClasses.elementContainer);
    this.elements.description = this._queryByClassName(this.cssClasses.description);

    this.elements.toggleDescriptionIcon = this._queryByClassName(this.cssClasses.toggleDescriptionIcon);
    this.elements.closeIcon = this._queryByClassName(this.cssClasses.closeIcon);

    this.elements.navPosition = this._queryByClassName(this.cssClasses.navPosition);
  }

  _setupCSSClasses() {
    for (let elem of this.elements.content) {
      elem.classList.add(this._getCSSClassName("element"));
    }
  }

  _getCSSClassName(key:string):string {
    if (this.options.classes && this.options.classes[key]) {
      return this.options.classes[key];
    }

    return this.cssClasses[key];
  }

  _setupHandlers() {
    for (let elem of this.elements.content) {
      elem.addEventListener("click", (event) => {
        this.openOverlay();
      });
    }

    this.elements.closeIcon.addEventListener("click", () => {
      this.closeOverlay();
    });

    this.elements.toggleDescriptionIcon.addEventListener("click", () => {
      this.toggleDescription();
    });


    // key handlers
    document.addEventListener('keyup', (event) => {
      // escape key
      if(event.keyCode === 27) {
        this.closeOverlay();
      }

      // left arrow key
      if(event.keyCode === 37) {
        if(this.swiper) {
          this.swiper.slidePrev();
        }
      }

      // right arrow key
      if(event.keyCode === 39) {
        if(this.swiper) {
          this.swiper.slideNext();
        }
      }
    });

    // resize handler
    window.onresize = debounce(() => {
      this._redrawLayout();
    }, 100);
  }

  _initSwiper() {
    if(this.swiper) {
      return;
    }

    this.swiper = new Swiper(this.elements.elementsContainer, this.swiperOptions);

    this._updateNavPosition();

    this.swiper.on("onSetTranslate", (swiper, foo) => {
      this._updateNavPosition();
    });
  }

  _generateCssClassesForBlockName(block: string): ContentSliderCSSClasses {
    let generateClassNameMakro = (element, modifier?) => {
      if(modifier) {
        return `${block}__${element}--${modifier}`;
      }
      return `${block}__${element}`;
    };

    return {
      element: generateClassNameMakro('element'),
      wrapper: generateClassNameMakro('wrapper'),

      // overlay
      overlay: generateClassNameMakro('overlay'),
      overlayModVisible: generateClassNameMakro('overlay', 'is-visible'),

      nav: generateClassNameMakro('nav'),
      navPosition: generateClassNameMakro('nav-position'),
      description: generateClassNameMakro('description'),
      elementContainer: generateClassNameMakro('element-container'),
      
      // icons
      icon: generateClassNameMakro('icon'),
      toggleDescriptionIcon: generateClassNameMakro('toggle-description-icon'),
      prevIcon: generateClassNameMakro('prev-icon'),
      nextIcon: generateClassNameMakro('next-icon'),
      closeIcon: generateClassNameMakro('close-icon')
    }
  }

  _queryByClassName(className: string): DomElement {
    let elem = document.querySelector(`.${className}`);

    if(elem === null) {
      console.warn(`[doge] unable to query elem by class-name: ${className}`);
    }

    return elem;
  }

  _updateNavPosition() {
    if(this.swiper) {
      let
        activeIndex = this.swiper.activeIndex + 1,
        lastSlideIndex = this.swiper.slides.length;

      this.elements.navPosition.innerHTML = `${activeIndex} von ${lastSlideIndex}`;
    }
  }

  // # Public

  // ## Overlay
  openOverlay() {
    // overlay must be visible, before swiper gets initialized
    this.elements.overlay.classList.add(this.cssClasses.overlayModVisible);
    this._initSwiper();
  }

  closeOverlay() {
    this.elements.overlay.classList.remove(this.cssClasses.overlayModVisible);
  }

  toggleDescription() {
    if(this.elements.description.classList.contains(this.cssClasses.descriptionModVisible)) {
      this.elements.description.classList.remove(this.cssClasses.descriptionModVisible);
    } else {
      this.elements.description.classList.add(this.cssClasses.descriptionModVisible);
    }
  }
}
