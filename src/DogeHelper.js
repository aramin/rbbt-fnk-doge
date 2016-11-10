// @tcomb

export default class DogeHelper {


  static _queryByClassName(parentNode: Element, className: string): Element {
    let elem = parentNode.querySelector(`.${className}`);

    if(elem === null) {
      console.warn(`[doge] unable to query elem by class-name: ${className} under element:`, parentNode);
    }

    return elem;
  }
}
