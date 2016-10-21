// @tcomb

import test from 'ava';
import ContentSlider from "./ContentSlider";
import {Fixture} from "./testHelper";

test.beforeEach('setup fixture', t => Fixture("./fixtures/simple.html", (document) => {
  t.context.document = document;
}));

test.beforeEach('setup slider', t => {
  t.context.slider = new ContentSlider({
    content: '.content-slider__image',
    overlay: '.overlay'
  });
});

test("click on the image opens the overlay", t => {
  const {document, slider} = t.context;

  t.false(slider.elements.overlay.classList.contains("content-slider__overlay--is-visible"));
  slider.elements.content[0].click();
  t.true(slider.elements.overlay.classList.contains("content-slider__overlay--is-visible"));
});


test("click on the close icon closes the overlay", t => {
  const {document, slider} = t.context;

  slider.openOverlay();
  t.true(slider.elements.overlay.classList.contains("content-slider__overlay--is-visible"));

  slider.elements.closeIcon.click();
  t.false(slider.elements.overlay.classList.contains("content-slider__overlay--is-visible"));
});

test.skip("click on next changes the slider and update the nav position", t => {
  const {document, slider} = t.context;

  slider.openOverlay();
  // TODO
  // click next, check position
  // click prev, check position
});

