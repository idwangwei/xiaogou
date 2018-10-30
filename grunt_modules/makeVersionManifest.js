/**
 * makeVersionManifest.js
 */

module.exports = function(grunt) {
	var chalk  = require('chalk');
	var path = require('path');

	grunt.registerTask("makeVersionManifest", function() {
		grunt.config("makingVersionManifest", {
			dist: {
				options: {
					basePath: path.join(global.cfg.RELEASE_DIR),
					exclude: [ /*'libs/bower_components/'*/ ],
					//load all found assets
					loadall: true,
					//manually add files to the manifest
					files: {},
					//manually define the files that should be injected into the page
					load: [],
					// root location of files to be loaded in the load array.
					//root: "./dist/"
					versionCode: global.cfg.revCode, //以时间戳作为版本增长的记号
					rev: global.cfg.rev, //使用SVN版本号作为manifest子版本
				},
				src: [
					'**/*.*'
				]
			}
		});

		grunt.task.run(["makingVersionManifest", "afterMakeVersionManifest", "makePatchVersionManifest"]);
	});

	grunt.registerMultiTask("makingVersionManifest", function() {
		var chalk = require("chalk");
		var options = this.options({
			loadall: true,
			root: "./",
			files: {},
			load: []
		});
		var done = this.async();
		var path = require('path');
		var isIOS = global.cfg.isIOS;

		this.files.forEach(function(file) {
			var files;
			//manifest format
			var json = {
				"files": options.files,
				"load": options.load,
				"root": options.root
			};

			//clear load array if loading all found assets
			if (options.loadall) {
				json.load = [];
			}

			// check to see if src has been set
			if (typeof file.src === "undefined") {
				grunt.fatal('Need to specify which files to include in the json manifest.', 2);
			}

			// if a basePath is set, expand using the original file pattern
			if (options.basePath) {
				files = grunt.file.expand({
					cwd: options.basePath
				}, file.orig.src);
				//console.log("files", files)
			} else {
				files = file.src;
			}

			// Exclude files
			if (options.exclude) {
				files = files.filter(function(item) {
					return options.exclude.indexOf(item) === -1;
				});
			}

			// Set default destination file
			if (!file.dest) {
				file.dest = [ /*'manifest.json', */ path.join(global.cfg.RELEASE_DIR, 'manifest.json')];
			}

			// add files
			if (files) {
				/*json.files = [];*/
				files.forEach(function(item) {
					var hasher = require('crypto').createHash('sha256');
					var filename = encodeURI(item);
					//var key = filename.split("-").slice(1).join('-');
					/*var key = filename.split("/");
					key = key[key.length - 1];
					json.files[key] = {}
					json.files[key]['filename'] = filename;
					json.files[key]['version'] = hasher.update(grunt.file.read(path.join(options.basePath, item))).digest("hex")


					if (options.loadall) {
					  json.load.push(filename);
					}*/

					/*var obj = {};
					obj[filename] = hasher.update(grunt.file.read(path.join(options.basePath, item))).digest("hex");
					json.files.push(obj);*/
					json.files[filename] = hasher.update(grunt.file.read(path.join(options.basePath, item))).digest("hex");
				});
			}
			

			json.versionCode = options.versionCode; //以时间戳作为版本增长的记号
			json.rev = options.rev; //使用SVN版本号作为manifest子版本


			//write out the JSON to the manifest files
			file.dest.forEach(function(f) {
				var output = JSON.stringify(json, null, 2);
				if (isIOS) output = "_cb_(" + output + ");";

				grunt.file.write(f, output);
			});

			//添加 主版本号
			file.dest.forEach(function(f) {
				var hasher = require('crypto').createHash('sha256');
				json.mainVersion = hasher.update(grunt.file.read(f)).digest("hex");

				var output = JSON.stringify(json, null, 2);
				//if (isIOS) output = "_cb_(" + output + ");";

				grunt.file.write(f, output);

				console.log(chalk.underline.green("Created manifest file: ", f));
			});

			done();
		});

	});

	grunt.registerTask("afterMakeVersionManifest", function() {
		if (global.cfg.isWin) {
			grunt.task.run(["makingVersionManifestWin"]);
		}
	});
}