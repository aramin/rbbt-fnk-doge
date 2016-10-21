// @tcomb

import test from 'ava';
import ContentSlider from "./ContentSlider";
import {Fixture} from "./testHelper";

test.beforeEach('setup document', t => Fixture("./fixtures/simple.html", (document) => {
  t.context.document = document;
}));

test.beforeEach('setup slider', t => {
  t.context.slider = new ContentSlider({
    content: '.content-slider__image',
    overlay: '.overlay'
  });
});

test.todo("bemCssClass change name of the css classes");

test.todo("cssClasses can be overwritten");


test('[_setupContent] must setup all UI elements', t => Fixture("./fixtures/simple.html", (document) => {
  const slider = t.context.slider;

  t.truthy(slider.elements.overlay);
  t.truthy(slider.elements.elementsContainer);
  t.truthy(slider.elements.description);
  t.truthy(slider.elements.toggleDescriptionIcon);
  t.truthy(slider.elements.closeIcon);
  t.truthy(slider.elements.navPosition);
}));

test('[_setupCSSClasses] must have one image and correct defaults', t =>  {
  const slider = t.context.slider;

  t.true(slider.elements.content.length === 1, "initialized with one image");
  t.true(slider.elements.content[0].classList.contains("content-slider__element"), "has default element class set");
});

test.skip("check that swiper has been initialized correctly", t => {
  // TODO
  t.is(slider.swiper.slides.length, 1, "Swiper has been initialized with one slide");
});

