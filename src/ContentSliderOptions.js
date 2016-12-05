// @flow

import {QuerySelector} from "./ContentSliderTypes";

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
type ContentSliderOptions = {
  content: QuerySelector,
  triggerSelector?: QuerySelector,
  overlay: QuerySelector,
  bemBlockName?: string,
  swiperBemBlockName?: string,
  extractSliderElement: Function,
  extractCaption: Function,
  extractHashnavToken: Function
}

export default ContentSliderOptions;