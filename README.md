# Getting started

As a prerequisite, the latest version of [node.js](http://nodejs.org) must be installed. For Ubuntu users, the following link may help : http://doc.ubuntu-fr.org/nodejs.


Then, from the project's root folder:
```
npm install
sudo npm install -g grunt-cli
grunt
```

That's [Grunt](http://gruntjs.com/) which builds the project's distributables. It is configured to work in 3 steps :

1. **compile** : generates HTML, JS and CSS files and copy the images into ```build/compile```
2. **minify** : minifies / uglifies everything into ```build/minify```
3. **dist** : creates a zip archive into the ```dist``` folder

By default, Grunt executes the **minify** task.

While developping, ```grunt watch``` will re-execute any needed task on the fly when the source code is modified.


# Under the hood

There's no HTML. Instead, there's a [main.mustache](src/main.mustache) which is rendered as ```main.html```.

There no CSS as well. We use the [Stylus](http://learnboost.github.io/stylus/) preprocessor to make them.

There are JS files, but they are organised as modules. And, at the end, there's only 1 JS file in the bundle. That's the job of [Webmake](https://github.com/medikoo/modules-webmake) to assemble those. Its syntax is pretty close to node.js, so it should be of no surprise.


# How to make a release

**Step 1.** Ensure that all the code is committed and actually works.

**Step 2.** Remove "-SNAPSHOT" from the version number in the [package.json](package.json) file. e.g.:

    "version": "1.0.0-SNAPSHOT"

becomes

    "version": "1.0.0"

**Step 3.** Commit the change with a message like ```version: 1.0.0``` and create a tag with the same version number. e.g.:

    git tag 1.0.0

That's a good time to make the distributable archive :

    grunt dist

**Step 4.** Increase the version number and put the "-SNAPSHOT" back again. Commit the result.


**Step 5.** Push the changes along with the tags :

    git push --tags
