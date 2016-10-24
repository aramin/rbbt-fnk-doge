// @tcomb

import test from 'ava';
import ContentSlider from "./ContentSlider";
import {Fixture} from "./testHelper";

test('is not a single', t => Fixture("./fixtures/simple.html", (document) => {
  // when:
  let
    options = {
      content: '.test__image',
      overlay: '.overlay',
      extractSliderElement: function() {},
      extractCaption: function() {}
    },
    instance_one = new ContentSlider(options),
    instance_two = new ContentSlider(options);

  // then:
  t.false(instance_one === instance_two, "ContentSlider is no singleton");
}));