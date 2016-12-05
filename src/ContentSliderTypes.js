// @flow

export type QuerySelector = string;
export type ClassName = string;
export type ContentSliderEvent = "open"
  | "close"
  | "caption_toggle"
  | "next"
  | "prev"
  | "init"
  | "zoom-active"
  | "zoom-inactive";

/**
 * Content Slider Options
 *
 * @typedef ContentSliderOptions
 * @property {QuerySelector} content - the selector of the swipeable content elements
 * @property [QuerySelector} triggerContent -
 * @property {QuerySelector} overlay - the selector of the overlay
 * @property {QuerySelector} bemBlockName - [optional] set the block-part of the css-class name
 * @property {QuerySelector} swiperBemBlockName - [optional] set the block-part of the css-class name for swiper-options
 * @property {Function} extractSliderContent - function which returns element to slide
 * @property {Function} extractCaption - function which returns the description of the slide
 * @property {Function} extractHashnavToken - function which returns the hashnav token
 */
export type ContentSliderOptions = {
  content: QuerySelector,
  triggerSelector?: QuerySelector,
  overlay: QuerySelector,
  bemBlockName?: string,
  swiperBemBlockName?: string,
  extractSliderElement: Function,
  extractCaption: Function,
  extractHashnavToken: Function
};

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
export type ContentSliderCSSClasses = {
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