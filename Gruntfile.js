module.exports = function(grunt) {
  grunt.initConfig({
    clean: ['img_dist'],
    responsive_images: {
      dev: {
        options: {
          engine: 'im',
          concurrency: 2,
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
          },
          {
            expand: true,
            src: ['*.webp'],
            cwd: 'img_dist/',
            dest: 'img_dist/'
          }
        ]
      }
    },
    webp: {
      files: {
        expand: true,
        cwd: 'img/',
        src: ['*.{gif,jpg,png}'],
        dest: 'img_dist/'
      },
      options: {
        quality: 90
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-webp');
  grunt.registerTask('default', ['clean', 'webp', 'responsive_images']);
};
