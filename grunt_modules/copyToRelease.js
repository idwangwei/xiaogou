/**
 * copyToRelease.js
 */

module.exports = function (grunt) {
	grunt.registerTask("copy4game", function(){
		if(!hasEClassDir(grunt)) return;


		grunt.config.merge({
			clean : {
				cleanRelease: {
					files: [
						{src: ['eclass/*', '!eclass/.svn']}
					]
				}
			},
			copy: {
				cp2release: {
					files: [
                   		{expand: true, flatten: false, cwd: 'release', src: ['**', '!*.zip', '!*.log'], dest: 'eclass'}
                	]
				}
			}
		});

		grunt.task.run(["svnup", "clean:cleanRelease", "copy:cp2release", "svnadd", "svnci"]);
	});

	function hasEClassDir(grunt) {
		return grunt.file.exists("eclass");
	}
}