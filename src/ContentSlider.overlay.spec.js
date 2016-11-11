// @tcomb

import test from 'ava';
import {OverlayContentSlider} from "./ContentSlider";
import {Fixture} from "./testHelper";

test.beforeEach('setup document', t => Fixture("./fixtures/overlay.html", (document) => {
  t.context.document = document;
}));

test.beforeEach('setup slider', t => {
  t.context.slider = new OverlayContentSlider({
    content: '.content-slider__image',
    overlay: '.overlay',
    extractSliderElement: function() {
      return document.createElement("div");
    },
    extractCaption: function() {},
    extractHashnavToken: function(_, index) {
      return index;
    }
  });
});

test.todo("bemCssClass change name of the css classes");

test.todo("cssClasses can be overwritten");


test('[_setupContent] must setup all UI elements', t => Fixture("./fixtures/overlay.html", (document) => {
  const slider = t.context.slider;

  t.truthy(slider.elements.overlay);
  t.truthy(slider.elements.elementsContainer);
  t.truthy(slider.elements.caption);
  t.truthy(slider.elements.toggleCaptionIcon);
  t.truthy(slider.elements.closeIcon);
  t.truthy(slider.elements.navPosition);
}));

test('[_setupCSSClasses] must have one image and correct defaults', t =>  {
  const slider = t.context.slider;

  t.true(slider.elements.content.length === 1, "initialized with one image");
  t.true(slider.elements.content[0].classList.contains("content-slider__image"), "has default element class set");
});

test.skip("check that swiper has been initialized correctly", t => {
  t.is(slider.swiper.slides.length, 1, "Swiper has been initialized with one slide");
});

