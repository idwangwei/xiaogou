/**
 * svnlog.js
 * 
 * @param  {[type]}
 * @return {[type]}
 */
module.exports = function(grunt) {
	var iconv = require('iconv-lite');


	grunt.registerTask("handlesvn", "description", function() {
		grunt.task.run(['svngrade', 'svnsw', 'svnup', 'svnlog', "svngrade"]);
	});

	grunt.registerTask("svnsw", "svn switch", function() {
		var gradeNum = global.cfg.gradeNum = grunt.option('grade') + "";
		if(!gradeNum) grunt.exit("请输入年级 -grade=? ");

		//rebuildGradeQueue 用于循环打包多个年级 -grade=1,2,3
		var grades = gradeNum.split(',');
		gradeNum = grades.shift();
		global.cfg.rebuildGradeQueue = grades.join(',');

		//处理 年级+学期 的情况： -sem=11,12,22,31,32,33...
		if(gradeNum.length > 1) global.cfg.semCode = gradeNum;
		else grunt.exit("已经不支持打包整个年级，请添加 -grade=11,12...");
		global.cfg.gradeNum = gradeNum;

		//重置 grade，用于循环打包
		grunt.option('grade', global.cfg.rebuildGradeQueue);

		//切换合适的年级文件夹（这样比svn sw快速，以空间换时间）
		switchProperGradeDir.call(this, gradeNum[0]);
	});

	// grunt.registerTask("svnsw", "svn switch", function() {
	// 	var exec = require('child_process').exec;
	// 	var done, cmd;
	// 	var gradeNum = global.cfg.gradeNum = grunt.option('grade') || 2;

	// 	done = this.async();
	// 	grunt.log.ok("svn switch grade" + gradeNum);
	// 	cmd = exec('cd app && ' + getSvnSwitch(gradeNum) + ' && cd ..', function(a, b) {
	// 		done();
	// 	});
	// });

	grunt.registerTask("svnup", "svn update", function() {
		var exec = require('child_process').exec;
		var done, cmd;

		done = this.async();
		grunt.log.ok("updating svn...");
		cmd = exec('cd app && svn up && cd ..', function(a, b) {
			grunt.checkExec(a, b, "SVN更新失败");
			done();
		});
	});
	//新增一个each方法
	String.prototype.each=function(i,fun){
		var index=0;
		var that=this;
		while(index<=that.length){
			(fun||function(){})(that.substr(index,i))
			index+=i;
		}
	}
	grunt.registerTask("svnlog", "svn log", function(svnPath) {
		if(!svnPath) grunt.exit("请传入svnPath", svnPath);
		var exec = require('child_process').exec;
		var done, cmd;

		done = this.async();
		cmd = exec('svn info svn://192.168.0.100/createjs/' + svnPath,{encoding:'hex'}, function(a, b) {
			var arr=[];
			b.each(2,function(data){
				arr.push(parseInt(data,16));
			});
			var ret = iconv.decode(new Buffer(arr), 'gbk');
			// console.log("retm", ret.match(/(Rev|版本):\s(\d+)/))
			var rev = ret.match(/(Rev|版本):\s(\d+)/)[2];
			global.cfg.rev = rev
			grunt.log.ok("Version:", rev);
			done();
		});
	});

	grunt.registerTask("svngrade", "get svn grade num", function() {
		var exec = require('child_process').exec;
		var done, cmd;

		done = this.async();
		cmd = exec('cd app && svn info && cd ..', function(a, b) {
			var grade = b.toString().match(/grade\w+/)[0];
			//var author = b.toString().split(/\r/)[9].match(/\w+$/)[0]; //这里可以优化
			global.cfg.gradeStr = grade;
			//global.cfg.author = author;
			grunt.log.ok("Grade:", grade);
			//grunt.log.ok("Author:", author);
			done();
		});
	});

	grunt.registerTask("replacesvnlog", "replace svn log", function() {
		var path = require('path');
		grunt.config.merge({
			replace: {
				replacesvnlog: {
					src: [path.join(global.cfg.RELEASE_DIR, 'canvas.html')],
					overwrite: true,
					replacements: [{
						from: /(ion">)r\d+/,
						to: function(a, b, c, d, e, f) {
							return d + global.cfg.rev;
						}
					}]
				}
			}
		});

		grunt.task.run(['replace:replacesvnlog']);
	});

	function getSvnSwitch(gradeNum) {
		var svnCommand = 'svn sw svn://192.168.0.100/createjs/';
		if (gradeNum == 1) {
			svnCommand += 'gradeone/releases/1.0.0';
		} else if (gradeNum == 2) {
			svnCommand += 'gradetwo/releases/1.0.0'
		} else if (gradeNum == 3) {
			svnCommand += 'gradethree/releases/1.0.0'
		} else {
			grunt.exit('年级参数输入有误！');
		}

		return svnCommand;
	}

	function switchProperGradeDir(gradeNum) {
		grunt.task.requires(['svngrade']);

		var gradeStrToNum = global.cfg.gradeStr;

		if (gradeStrToNum === 'gradeone') {
			gradeStrToNum = 1;
		} else if (gradeStrToNum === 'gradetwo') {
			gradeStrToNum = 2;
		} else if (gradeStrToNum === 'gradethree') {
			gradeStrToNum = 3;
		} else {
			grunt.exit('没有这个年级！' + gradeStrToNum);
		}

		if (gradeStrToNum == gradeNum) return; //年级相同，不做处理

		//TODO 需要切换的年级是否存在！！

		var exec = require('child_process').exec;
		var done, cmd;

		done = this.async();
		var ren1 = 'ren app app-g' + gradeStrToNum;
		var ren2 = 'ren app-g' + gradeNum + ' app';
		var ren2Rollback = 'ren app-g' + gradeStrToNum + ' app';
		cmd = exec(ren1, function(a, b) {
			grunt.checkExec(a, b, ren1);

			exec(ren2, function(a, b) {
				a && exec(ren2Rollback, function() {
					console.log("ren2Rollback")
					grunt.checkExec(a, b, ren2);
				});
				!a && done();
			});
		});

	}
}