module.exports = function(grunt) {

  var isCssRegex = /^\s*<\s*link.*href=["']([^"']*)["'].*$/i;
  var isJsRegex = /^\s*<\s*script.*src=["']([^"']*)["'].*$/i;
  var extractJsRegex = /src\s*=\s*"(.+?)"/
  var extractCssRegex = /href\s*=\s*"(.+?)"/

  function extractFilenames(src, type) {
    var filenames = [];
    var data = require('fs').readFileSync(src, 'utf8');
    var lines = data.replace(/\r\n/g, '\n').split(/\n/);
    var webContent = require('path').dirname(src);

    lines.forEach(function(line) {
      if (line.match(type === 'css' ? isCssRegex : isJsRegex)) {
        var src = line.match(type === 'css' ? extractCssRegex : extractJsRegex)[1];
        filenames.push(webContent + '/' + src);
      }
    });

    return filenames;
  };


  // Project configuration.
  grunt.initConfig({


    concat: {
      /*options: {
        separator: ';',
      },*/
      indexJS: {
        src: extractFilenames('index.html', 'js'),
        dest: 'GRUNT/index.js',
      },
      frameworkJS: {
        src: extractFilenames('index.html', 'js'),
        dest: 'GRUNT/dokumeframework.js',
      },
      indexCSS: {
        src: extractFilenames('index.html', 'css'),
        dest: 'GRUNT/style.css',
      },
      frameworkCSS: {
        src: extractFilenames('index.html', 'css'),
        dest: 'GRUNT/dokumeframework.css',
      },
      js: {
        src: ['GRUNT/index-js-min/**/*.js'],
        dest: 'GRUNT/script.js',
      },
      css: {
        src: ['platform/css/bootstrap.min.css', 'platform/css/font-awesome.min.css', 'platform/css/animate.min.css', 'platform/css/style.css', 'platform/css/pnotify.custom.min.css', 'platform/css/selectize.css', 'platform/css/flatpickr.min.css'],
        dest: 'buildindex/css/index.concat.css'
      },
      cssall: {
        //src: ['css//**/*.css', '!*.min.css'],
        src: ['css//**/*.css'],
        dest: 'buildindex/css/index.concatall.css',
      },
      cssallmin: {
        src: ['buildindex/css/index.concatall.css, css//**/*.min.css'],
        dest: 'buildindex/css/index.concatall.min.css',
      }
    },

    babel: {
      options: {
        sourceMap: true,
        presets: ['@babel/preset-env']
      },
      platform: {
        files: [{
          //'GRUNT/js/main.js' : 'platform/APPS/feed/modules/feed.js',
          expand: true,
          cwd: 'GRUNT',
          src: ['**/*.js', '!*.min.js'],
          dest: 'GRUNT',
          //ext: '.babel.js',
          extDot: 'first'
        }]
      },
      framework: {
        files: [{
          //'GRUNT/js/main.js' : 'platform/APPS/feed/modules/feed.js',
          expand: true,
          cwd: 'GRUNT',
          src: ['**/*.js', '!*.min.js'],
          dest: 'GRUNT',
          //ext: '.babel.js',
          extDot: 'first'
        }]
      },
      index: {
        files: [{
          //'GRUNT/js/main.js' : 'platform/APPS/feed/modules/feed.js',
          expand: true,
          cwd: 'platform/js',
          //src: ['**/*.js'],
          src: ['flatpickr.min.js', 'i18n/flatpickr/de.js', 'reconnecting-websocket.min.js', 'jquery-2.1.1.min.js', 'moment.js', 'core/dokume-template.js', 'modules/pubsub.js', 'class/websocket.js', 'class/auth.js', 'core/DokuMeCore.js', 'modules/utilities.js', 'jquery.touchSwipe.min.js', 'tether.min.js', 'bootstrap.min.js', 'pnotify.custom.min.js', 'selectize.min.js', 'easyNotify.js', 'routing/signals.js', 'routing/hasher.min.js', 'routing/crossroads.min.js', 'routing/routing.js'],
          dest: 'buildindex/index-js-babel',
          ext: '.babel.js',
          extDot: 'first'
        }]
      }
    },

    processhtml: {
      /*options: {
        data: {
          message: 'Hello world!'
        }
      },*/
      platformIndex: {
        files: {
          'GRUNT/index.html': ['GRUNT/index.html']
        }
      },
      frameworkIndex: {
        files: {
          'GRUNT/index.html': ['GRUNT/index.html']
        }
      },
    },

    htmlmin: { // Task
      /*dest: {                                      // Target
        options: {                                 // Target options
          removeComments: true,
          collapseWhitespace: true
        },
        files: {                                   // Dictionary of files
          'dest/index.html': 'src/index.html',     // 'destination': 'source'
          'dest/contact.html': 'src/contact.html'
        }
      },*/
      platform: { // Target
        options: { // Target options
          removeComments: true,
          collapseWhitespace: true
        }, // Another target
        files: [{
          expand: true,
          cwd: 'GRUNT',
          src: ['**/*.html', '*.html'],
          dest: 'GRUNT'
        }]
      },
      framework: { // Target
        options: { // Target options
          removeComments: true,
          collapseWhitespace: true
        }, // Another target
        files: [{
          expand: true,
          cwd: 'GRUNT',
          src: ['**/*.html', '*.html'],
          dest: 'GRUNT'
        }]
      }
    },

    uglify: {
      options: {
        mangle: false,
        compress: {
          drop_console: true
        }
      },
      platform: {
        files: [{
          expand: true,
          cwd: 'GRUNT',
          src: ['**/*.js', '!**/*.min.js'],
          dest: 'GRUNT',
          /*rename: function (dst, src) {
		        // To keep the source js files and make new files as `*.min.js`:
		        return dst + '/' + src.replace('.js', '.min.js');
		        // Or to override to src:
		        //return src;
		      }*/
        }]
      },
      framework: {
        files: [{
          expand: true,
          cwd: 'GRUNT',
          src: ['**/*.js', '!**/*.min.js'],
          dest: 'GRUNT',
          /*rename: function (dst, src) {
		        // To keep the source js files and make new files as `*.min.js`:
		        return dst + '/' + src.replace('.js', '.min.js');
		        // Or to override to src:
		        //return src;
		      }*/
        }]
      },
      index: {
        files: [{
          expand: true,
          cwd: 'buildindex/index-js-babel',
          src: ['**/*.js', '!**/*.min.js'],
          dest: 'buildindex/index-js-min',
          rename: function(dst, src) {
            // To keep the source js files and make new files as `*.min.js`:
            return dst + '/' + src.replace('.js', '.min.js');
            // Or to override to src:
            //return src;
          }
        }]
      }
    },

    cssmin: {
      platform: {
        files: [{
          expand: true,
          cwd: 'GRUNT',
          src: ['**/*.css', '!**/*.min.css'],
          dest: 'GRUNT',
          //ext: '.min.css'
        }]
      },
      framework: {
        files: [{
          expand: true,
          cwd: 'GRUNT',
          src: ['**/*.css', '!**/*.min.css'],
          dest: 'GRUNT',
          //ext: '.min.css'
        }]
      }
    },

    'sftp-deploy': {
      platform: {
        auth: {
          host: 'ssh.strato.de',
          port: 22,
          authKey: 'key1'
        },
        cache: 'sftpDokumeappCache.json',
        src: 'GRUNT',
        dest: 'dokume/platform2',
        exclusions: ['GRUNT/**/.DS_Store', 'GRUNT/**/Thumbs.db', 'dest/tmp'],
        serverSep: '/',
        localSep: '/',
        concurrency: 4,
        progress: true
      },
      framework: {
        auth: {
          host: 'ssh.strato.de',
          port: 22,
          authKey: 'key1'
        },
        cache: 'sftpDokumeappCache.json',
        src: 'GRUNT',
        dest: 'dokume/framework',
        exclusions: ['GRUNT/**/.DS_Store', 'GRUNT/**/Thumbs.db', 'dest/tmp'],
        serverSep: '/',
        localSep: '/',
        concurrency: 4,
        progress: true
      },
      index: {
        auth: {
          host: 'ssh.strato.de',
          port: 22,
          authKey: 'key1'
        },
        cache: 'sftpbuildindexCache.json',
        src: 'buildindex',
        dest: 'dokume/platform/buildindex',
        exclusions: ['buildindex/**/.DS_Store', 'buildindex/**/Thumbs.db', 'dest/tmp'],
        serverSep: '/',
        localSep: '/',
        concurrency: 4,
        progress: true
      }
    },

    copy: {
      tempPlatformFiles: {
        expand: true,
        //src: grunt.option('name') + '/**',
        cwd: 'platform',
        src: ['js/**', 'css/**', 'index.html'],
        dest: 'GRUNT',
      },
      tempPlatformRessourcesFiles: {
        expand: true,
        //src: grunt.option('name') + '/**',
        cwd: 'platform',
        src: ['fonts/**', 'img/**', 'plugins/**', 'whitelabel/**'],
        dest: 'GRUNT',
      },
      tempFrameworkFiles: {
        expand: true,
        //src: grunt.option('name') + '/**',
        cwd: '',
        src: ['dokume/**', 'js/**', 'css/**', 'index.html'],
        dest: 'GRUNT',
      },
      tempFrameworkRessourcesFiles: {
        expand: true,
        //src: grunt.option('name') + '/**',
        cwd: '',
        src: ['APPS/**', 'fonts/**', 'img/**', 'plugins/**', 'whitelabel/**', 'manifest.json'],
        dest: 'GRUNT',
      },
      frameworkDist: {
        expand: true,
        //src: grunt.option('name') + '/**',
        cwd: 'GRUNT',
        src: ['index.html', 'dokumeframework.js', 'dokumeframework.css', 'manifest.json'],// 'APPS/**', 'fonts/**', 'img/**', 'plugins/**', 'whitelabel/**'],
        dest: 'DIST',
      },
    },

    clean: ['GRUNT']

  });


  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-babel');
  //grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-sftp-deploy');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');


  //grunt.registerTask('app', ['htmlmin', 'uglify', 'babel']);
  grunt.registerTask('platform', ['copy:tempPlatformFiles', 'processhtml:platformIndex', 'htmlmin:platform', 'cssmin:platform', 'babel:platform', 'uglify:platform', 'concat:indexJS', 'concat:indexCSS']);
  grunt.registerTask('platformlive', ['copy:tempPlatformFiles', 'processhtml:platformIndex', 'htmlmin:platform', 'cssmin:platform', 'babel:platform', 'uglify:platform', 'concat:indexJS', 'concat:indexCSS', 'sftp-deploy:platform']);

  grunt.registerTask('app', ['copy:tempFiles', 'htmlmin:dokumeapp', 'cssmin:dokumeapp', 'babel:dokumeapp', 'uglify:dokumeapp']);
  grunt.registerTask('applive', ['copy:tempFiles', 'htmlmin:dokumeapp', 'cssmin:dokumeapp', 'babel:dokumeapp', 'uglify:dokumeapp', 'sftp-deploy:dokumeapp', 'copy:toNetDokumeApp', 'clean']);

  grunt.registerTask('index', ['processhtml:index', 'htmlmin:index', 'babel:index', 'uglify:index', 'concat', 'cssmin:index']);
  grunt.registerTask('indexnew', ['cssmin:indexall, concat:cssall']);
  grunt.registerTask('indexlive', ['processhtml:index', 'htmlmin:index', 'babel:index', 'uglify:index', 'concat', 'cssmin:index', 'sftp-deploy:index']);

  /*******************/

  //https://www.npmjs.com/package/grunt-javascript-obfuscator

  grunt.registerTask('frameworkRessources', ['copy:tempFrameworkRessourcesFiles']);

  grunt.registerTask('framework', ['copy:tempFrameworkFiles', 'processhtml:frameworkIndex', 'htmlmin:framework', 'cssmin:framework', 'babel:framework', 'uglify:framework', 'concat:frameworkJS', 'concat:frameworkCSS']);

  grunt.registerTask('frameworklive', ['copy:tempFrameworkFiles', 'processhtml:frameworkIndex', 'htmlmin:framework', 'cssmin:framework', 'babel:framework', 'uglify:framework', 'concat:frameworkJS', 'concat:frameworkCSS', 'sftp-deploy:framework']);

  /*******************/

  grunt.registerTask('name', function() {
    grunt.registerTask('htmlmin');
  });


};
