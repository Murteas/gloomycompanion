module.exports = function(grunt) {
 
  // Load Grunt tasks declared in the package.json file
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
 
  // Configure Grunt 
  grunt.initConfig({
 
    // grunt-contrib-connect will serve the files of the project
    // on specified port and hostname
    connect: {
      all: {
        options:{
          port: 9000,
          hostname: "0.0.0.0",
          // No need for keepalive anymore as watch will keep Grunt running
          //keepalive: true,
 
          // Livereload needs connect to insert a cJavascript snippet
          // in the pages it serves. This requires using a custom connect middleware
          middleware: function(connect, options) {
 
            return [
 
              // Load the middleware provided by the livereload plugin
              // that will take care of inserting the snippet
              require('grunt-contrib-livereload/lib/utils').livereloadSnippet,
 
              // Serve the project folder
              connect.static(options.base)
            ];
          }
        }
      }
    },

    // grunt-regarde monitors the files and triggers livereload
    // Surprisingly, livereload complains when you try to use grunt-contrib-watch instead of grunt-regarde 
    regarde: {
      all: {
        // This'll just watch the index.html file, you could add **/*.js or **/*.css
        // to watch Javascript and CSS files too.
        files:['index.html', '**/*.js', '**/*.css'],
        // This configures the task that will run when the file change
        tasks: ['livereload']
      }
    }
  });
 
  // Creates the `server` task
  grunt.registerTask('server',[
    
    // Starts the livereload server to which the browser will connect to
    // get notified of when it needs to reload
    'livereload-start',
    'connect',

    // Starts monitoring the folders and keep Grunt alive
    'regarde'
  ]);
};