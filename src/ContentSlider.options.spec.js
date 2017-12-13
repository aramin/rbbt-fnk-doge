// @tcomb

import test from "ava";
import {OverlayContentSlider} from "./ContentSlider";
import {Fixture} from "ava-browser-fixture";

const ANY_OVERLAY_SELECTOR = "any-overlay-selector";
const ANY_SWIPER_SLIDE_CLASS = "any-swiper-slide-class";

test.beforeEach("setup document", t => Fixture("./src/fixtures/overlay.html", (document) => {
  t.context.document = document;
}));

test.beforeEach("setup slider", t => {
  t.context.slider = new OverlayContentSlider({
    content: ".content-slider__image",
    overlay: ".overlay",
    extractSliderElement: function() {
      return document.createElement("div");
    },
    extractCaption: function() {},
    extractHashnavToken: function(_, index) {
      return index;
    }
  }, {
    overlay: ANY_OVERLAY_SELECTOR
  }, {
    slideClass: ANY_SWIPER_SLIDE_CLASS
  });
});

test("[constructor] it is possible to overwrite any css class", t => {
  t.is(t.context.slider.cssClasses.overlay, ANY_OVERLAY_SELECTOR)
});

test("[constructor] the ContentSlider defines default classes", t => {
  t.is(t.context.slider.cssClasses.wrapper, "content-slider__wrapper");
});


test("[constructor] it is possible to overwrite any swiper option", t => {
  t.is(t.context.slider.swiperOptions.slideClass, ANY_SWIPER_SLIDE_CLASS);
});

test("[constructor] the ContentSlider defines default swiper options", t => {
  t.is(t.context.slider.swiperOptions.keyboardControl, true);
});


