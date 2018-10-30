/**
 * compressZIP.js
 */

module.exports = function(grunt) {
	var path = require('path');

	grunt.registerTask('compressZIP', 'description', function() {
		//grunt.task.requires(['makebuildlog']);

		global.cfg.BUILD_NAME_UPDATE = path.join(global.cfg.RELEASE_DIR, 'update_' + global.cfg.buildName + '.zip')
		global.cfg.BUILD_NAME_PATCH = path.join(global.cfg.RELEASE_DIR, 'patch_' + global.cfg.buildName + '.zip')

		grunt.config.merge({
			compress: {
				zip2Linux: {
					options: {
						mode: 'zip',
						archive: global.cfg.BUILD_NAME_UPDATE
					},
					files: [{
						expand: true,
						src: ['**', '!manifestDel.json'],
						cwd: global.cfg.RELEASE_DIR
					}]
				}
			}
		});

		grunt.task.run(['compress:zip2Linux', "compressZipPatch"
			, "compressZipCheck:"+global.cfg.BUILD_NAME_UPDATE.replace(':', '@')
			, "compressZipCheck:"+global.cfg.BUILD_NAME_PATCH.replace(':', '@')
			]);
	});

	grunt.registerTask('compressZipPatch', function() {

		grunt.config.merge({
			compress: {
				patchZip: {
					options: {
						mode: 'zip',
						archive: global.cfg.BUILD_NAME_PATCH
					},
					files: [{
						expand: true,
						src: global.patch.filesAdd
							.concat('manifest.json')
							.concat('version.xml')
							.concat('manifestDel.json'),
						cwd: global.cfg.RELEASE_DIR
					}]
				}
			}
		});

		grunt.task.run(['compress:patchZip']);
	});
};