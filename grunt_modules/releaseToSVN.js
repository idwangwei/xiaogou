/**
 * releaseToSVN.js
 */

module.exports = function (grunt) {
	grunt.registerTask("svnup", "svn update", function() {
		var exec = require('child_process').exec;
		var done, cmd;

		done = this.async();
		grunt.log.ok("updating svn...");
		cmd = exec('cd eclass && svn up && cd ..', function(a, b) {
			a && grunt.log.error("SVN更新失败", a);
			done();
		});
	});
		
	grunt.registerTask("svnadd", "svn add", function() {
		var exec = require('child_process').exec;
		var done, cmd;

		done = this.async();
		cmd = exec('cd eclass && svn add * && cd ..', function(a, b) {
			done();
		});
	});
		
	grunt.registerTask("svnci", "svn commit", function() {
		var exec = require('child_process').exec;
		var done, cmd;

		done = this.async();
		grunt.log.ok("commit svn...");
		cmd = exec('cd eclass && svn commit -m "grunt auto commit" && cd ..', function(a, b) {
			a && grunt.log.error("SVN提交失败", a);
			done();
		});
	});
}