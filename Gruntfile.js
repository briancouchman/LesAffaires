module.exports = function(grunt) {

    grunt.initConfig({
      execute: {
        server: {
          src: ['server/server.js']
        },

        web: {
          src: ['app/web-server.js']
        }
      }
    });

    grunt.loadNpmTasks('grunt-execute');

    grunt.registerTask('startServer', ['execute:server']);
    grunt.registerTask('startWeb', ['execute:web']);

}
