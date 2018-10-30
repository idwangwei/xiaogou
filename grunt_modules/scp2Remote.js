/**
 * scp.js
 */

module.exports = function(grunt) {

	grunt.registerTask('copy2Remote', '', function() {
		grunt.config.merge({
			scp: {
				options: {
					host: '192.168.0.102',
					username: 'root',
					password: 'allfine*'
				},
				copy2Remote: {
					files: [{
						cwd: global.cfg.RELEASE_DIR,
						src: 'update_*.zip',
						filter: 'isFile',
						// path on the server 
						//dest: '/home/username/static/<%= pkg.name %>/<%= pkg.version %>'
						dest: '/software/backup/mathgames/'
					}]
				},
			}
		});
		if (grunt.option("scp")) {
			grunt.task.run(['scp:copy2Remote']);
		}
	});
}