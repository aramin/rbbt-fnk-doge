# doge

<img src="https://gist.githubusercontent.com/aweiher/fac10de0ab63536766a68eb8ae06a14b/raw/a107cc637afe64396fe9dc751e028aa36ec113b3/logo.png" alt="doge" title="wow such logo" width="200">

This is the Content-Slider of welt.de

Primary used for Images and responsive Picture-Elements - but not limited to it.

Dependency: 

- Swiper: http://idangero.us/swiper/

## Usage

```js
// initialize 
const contentSlider = new ContentSlider(<options>, <css-classes>, <swiper-options>);

```

### Options (required):

**Option** | Type | Description
--- | --- | ---
`content` | QuerySelector (string) | the selector of the swipeable content elements
`overlay` | QuerySelector (string) | the selector of the overlay
`bemBlockName` | string | set the block-part of the bem-style css-class name

### CSS Classes (optional):

With this parameter you can overwrite the css classes. They are automatic generated with the options-value `bemBlockName`.

**Option** | Type | Description
--- | --- | ---
`overlay` | ClassName (string) | the overlay element (initial hidden) 
`overlayModVisible` | ClassName (string) | modifier which indicates if the overlay is visible
`nav` | ClassName (string) | the navigaten bar element
`navPosition` | ClassName (string) | the position indicator
`description` | ClassName (string) | the description of the current content element
`descriptionModVisible` | ClassName (string) | modifier which indicates if the description is visible
`elementContainer` | ClassName (string) | the container for the swipeable content elements
`wrapper` | ClassName (string) | wrapper around the elements, which will be x/y transformed on swipe
`element` | ClassName (string) | the content element
`icon` | ClassName (string) | icon element
`toggleDescriptionIcon` | ClassName (string) | icon to toggle visibility of the description  
`prevIcon` | ClassName (string) | icon to swipe to previous element
`nextIcon` | ClassName (string) | icon to swipe to next element
`closeIcon` | ClassName (string) | icon to close the overlay


### Swiper Options:

See [Swiper API Docs](http://idangero.us/swiper/api/).


## Development

### Devstack 

- [Flowtype](https://flowtype.org/) (with [tcomb](https://github.com/gcanti/tcomb) + [babel-plugin-transform-flow-strip-types](https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-flow-strip-types))
- [webpack](https://github.com/webpack/webpack) (for webpack-dev-server & bundling)
- [yarn](https://yarnpkg.com) + [npm](npmjs.com) ( for dependency management and application lifecycle)
- [ava](https://github.com/avajs/ava) (test-runner)

### Intellij

To active IDE support for webflow: **Language & Frameworks** -> **Javascript** -> **Javascript Language Support**: *Flow*


### Dev-Mode

To start the webpack-dev-server:

```
npm start
```

The server will be listen to `localhost:8080`.

To access the server from network: 

```
npm start -- --host 0.0.0.0
```

### local development

First: Make sure you yarn installed on your system (`brew install yarn`). 

```bash
# checkout locally
git clone git@github.com:WeltN24/doge.git

# install
cd doge
yarn

# local link
npm link


# go to your target project
cd $target-project

# local link doge
npm link weltn24-doge

```


### test

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
