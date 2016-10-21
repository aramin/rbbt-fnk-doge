# welt-content-slider

This is the Content-Slider of the welt.de

Primary used for Images and responsive Picture-Elements - but not limited to it.

Dependency: 

- Swiper: http://idangero.us/swiper/

## Usage

```js
// initialize 
const contentSlider = new ContentSlider(<options>);

```


## Development

### Devstack 

- Flowtype (with tcomb + babel-plugin-transform-flow-strip-types)
- webpack (for webpack-dev-server & bundling)
- 

### Intellij

To 


### Dev-Mode

To start the webpack-dev-server:

```
npm start
```

### Test

To run the tests:

```
npm test
```
(this will start the ava test-runner)

To start the test with file-watcher:

```
npm test -- --watch
```


### Bundle

To bundle the library:

```
npm run build
```

### Release

TODO


## etc ..

### yarn: install a package

```
yarn add <package>
```

Install a dev-dependency:

```
yarn add --dev <package>
```
