// see https://github.com/avajs/ava/blob/master/docs/recipes/browser-testing.md

import browserEnv from 'browser-env';
import fs from 'fs';
import t from 'tcomb';
import sinon from 'sinon';

// browserEnv needed for DOM related functions
var window = browserEnv();

// set window.Date (as it is required by Swiper)
window.Date = Date;

export function Fixture(filename: string, test: t.Function) {
  return new Promise((resolve, reject) => {
    // read content from fixtures
    fs.readFile(filename, (err, data) => {
      if(err) {
        return reject(reject);
      }
      return resolve(data);
    });
  }).then(data => {
    // write content of fixture to document
    document.write(data);
    return document;
  }).
  then(document => {
    // pass document to current test case
    return test(document);
  });
}
