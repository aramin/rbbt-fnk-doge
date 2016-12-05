// @flow

import test from 'ava';
import {SimpleContentSlider} from "./ContentSlider";
import {Fixture} from "ava-browser-fixture";

test.beforeEach('setup document', t => Fixture("./src/fixtures/simple.html", (document) => {
  t.context.document = document;
}));

test.beforeEach('setup slider', t => {
  
  t.context.slider = new SimpleContentSlider({
    root: document.querySelector(".content-slider-fixture"),
    container: ".content-slider-fixture__element-container",
    bemBlockName: "content-slider-fixture",
    swiperBemBlockName: "c-swiper__slider"
  });
  
});

test("swiper is initialized", t => {
  t.is(t.context.slider.swiper.activeIndex, 0);
});

