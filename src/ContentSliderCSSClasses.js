// @tcomb

import {ClassName} from "./ContentSliderTypes";

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

export default ContentSliderCSSClasses;