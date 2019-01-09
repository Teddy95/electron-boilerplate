# Electron Boilerplate

Electron Boilerplate with React, Babel, Browserify and Gulp.

```
// Clone Repository
$ git clone https://github.com/Teddy95/electron-boilerplate.git my-project

// Go into root directory
$ cd my-project

// Install dependencies
$ npm install

// Compile App
$ npm run build

// Run App
$ npm start
```

Happy Coding! :heart: :sparkles:

### File structure

##### Development in `/app`

- `/app` Electron index.html & main.js
- `/app/assets` Logos, images, icons, ...
- `/app/css` Your Css files
- `/app/js` Your React Js files
- `/app/sass` Your Sass/Scss files

##### Production in `/build`
- `/build` Electron index.html & main.js copied from `/app`
- `/build/assets` Files copied from `/app/assets`
- `/build/css` Here you find the `style.min.css` generated from all Css files in `/app/css`
- `/build/js` Here you find the `bundle.min.js` with contains the Js code of your React Application
