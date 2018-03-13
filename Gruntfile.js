module.exports = function(grunt) {
  grunt.initConfig({
    clean: ['img_dist'],
    responsive_images: {
      dev: {
        options: {
          engine: 'im',
          sizes: [
            {
              width: 330,
              suffix: '_1x',
              quality: 90
            },
            {
              width: 660,
              suffix: '_2x',
              quality: 90
            }
          ]
        },
        files: [
          {
            expand: true,
            src: ['*.{gif,jpg,png}'],
            cwd: 'img/',
            dest: 'img_dist/'
          }
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.registerTask('default', ['clean', 'responsive_images']);
};
