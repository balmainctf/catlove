# react-reflux-super-fantastic-shop-demo

A super fantastic demo shop making use of the incredible powers provided by:
- [react](http://facebook.github.io/react/)
- [reflux](https://www.npmjs.com/package/reflux)
- [react router](https://github.com/rackt/react-router)

**<a href="https://stylecoder.github.io/react-reflux-super-fantastic-shop-demo" target="_blank">demo page</a>**

**Built with:**
  - npm and gulp  development/watch/livereload and production tasks
  - [browserify](http://browserify.org/) for module loading
  - react + react router
  - bower to add vendor libaries - currently pulling in [pure css](http://purecss.io/)
  - CSS loaded via browserify for react components + [sass](http://sass-lang.com/) for global ([SMACCS](https://smacss.com/) + [BEM](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/) + [Suit CSS](https://suitcss.github.io/) influenced)
  - es6 transpiling via [babelify](https://github.com/babel/babelify)

Placeholder images courtesy of [lorem pixel](http://lorempixel.com/)

## Project Setup:
Run these commands to get started:

**Install node packages**
```shell
$ npm install
```

## Project tasks:

**Run development task (watches source files, starts server with livereload):**
```shell
$ npm start
```
Open browser: http://localhost:8080/

or to specify dev server port:

```shell
$ gulp --port 3030
```
Open browser: http://localhost:3030/

**Run build task (minifies scripts):**
```shell
$ npm build
```

### TODOS:
 - add product details page
 - add router page transitions
 - tidy up basket styles
 - add subtle UI animations
