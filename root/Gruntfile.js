'use strict';

module.exports = function(grunt) {
// LiveReload的默认端口号，你也可以改成你想要的端口号
  var lrPort = 35729;
  // 使用connect-livereload模块，生成一个与LiveReload脚本
  // <script src="http://127.0.0.1:35729/livereload.js?snipver=1" type="text/javascript"></script>
  var lrSnippet = require('connect-livereload')({
    port: lrPort
  });
  // 使用 middleware(中间件)，就必须关闭 LiveReload 的浏览器插件
  var serveStatic = require('serve-static');
  var serveIndex = require('serve-index');
  var lrMiddleware = function(connect, options, middlwares) {
    return [
      lrSnippet,
      // 静态文件服务器的路径
      serveStatic(options.base[0]),
      // 启用目录浏览(相当于IIS中的目录浏览)
      serveIndex(options.base[0])
    ];
  };

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('{%= jqueryjson %}'),connect: {
      options: {
        // 服务器端口号
        port: 8000,
        // 服务器地址(可以使用主机名localhost，也能使用IP)
        hostname: 'localhost',
        // 物理路径(默认为. 即根目录) 注：使用'.'或'..'为路径的时，可能会返回403 Forbidden. 此时将该值改为相对路径 如：/grunt/reloard。
        base: '.'
      },
      livereload: {
        options: {
          // 通过LiveReload脚本，让页面重新加载。
          middleware: lrMiddleware
        }
      }
    },
    // 通过watch任务，来监听文件是否有更改
    watch: {
      client: {
        // 我们不需要配置额外的任务，watch任务已经内建LiveReload浏览器刷新的代码片段。
        options: {
          livereload: lrPort
        },
        // '**' 表示包含所有的子目录
        // '*' 表示包含所有的文件
        files: ['test/*.html', 'test/css/*', 'test/js/*', 'test/images/**/*']
      }
    },
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    clean: {
      files: ['dist']
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['src/jquery.<%= pkg.name %>.js'],
        dest: 'dist/jquery.<%= pkg.name %>.js'
      },
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/jquery.<%= pkg.name %>.min.js'
      },
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jshint: {
      options: {
        jshintrc: true
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      src: {
        src: ['src/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      },
    },
    // watch: {
    //   gruntfile: {
    //     files: '<%= jshint.gruntfile.src %>',
    //     tasks: ['jshint:gruntfile']
    //   },
    //   src: {
    //     files: '<%= jshint.src.src %>',
    //     tasks: ['jshint:src', 'qunit']
    //   },
    //   test: {
    //     files: '<%= jshint.test.src %>',
    //     tasks: ['jshint:test', 'qunit']
    //   },
    // },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['jshint', 'qunit', 'clean', 'concat', 'uglify']);

  // 加载插件
  grunt.loadNpmTasks('grunt-contrib-connect');

  // 自定义任务
  grunt.registerTask('live', ['connect', 'watch']);
};
