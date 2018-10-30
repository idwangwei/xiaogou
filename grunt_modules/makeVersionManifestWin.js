/**
 * makeVersionManifestWin.js
 */
module.exports = function(grunt) {

	grunt.registerTask("makingVersionManifestWin", function() {

		var fs = require('fs');
		var xml = require('xml');
		var url = require('url');
		var path = require('path');

		var OUTPUT_XML_FILE = path.join(global.cfg.RELEASE_DIR, 'version.xml'); // 写入文件的路径
		var READ_JSON_FILE = path.join(global.cfg.RELEASE_DIR, "manifest.json"); // 需要读取的json文件
		//manifest文件内容
		var fObj = getFileData();
		//manifest文件内容 中的files属性
		var files = fObj.f;
		//获取 version.xml的版本号的
		var versionNum = fObj.mv;
		// 获取 UpdateUrl
		var updateUrl = getUrl();
		//获取 version.xml的版本号的
		// var versionNum = global.cfg['rev'];
		//获取update的时间
		var myDate = grunt.template.today("yyyy-mm-dd HH:MM");

		//生成version.xml文件
		var elem = [];
		//将文件中的数据取出
		for (var k in files) {
			elem.push({UpdateFile: { _attr: { Version: files[k], Name: k}}});
		};
		//生成xml数据
		var stream = xml(
			{
				AutoUpdater: [
					{
						Updater: [
							{UpdateUrl: updateUrl},
							{LastUpdateTime: myDate},
							{UpdateDescription: '自动更新程序'}, 
							{MainVersion: versionNum},
							{RootDir: "win"},
							{Privilege: false}
						]
					},
					{
						UpdateFileList: elem
					}
				]
			},
			 {declaration: true,stream: true,indent: true} //声明，数据流，缩进
		);

		
		//写文件
		stream.on('data', function(chunk) {
			fs.writeFileSync(OUTPUT_XML_FILE, chunk);
		});

		// 获取文件中的file
		function getFileData() {
			//var file = JSON.parse(fs.readFileSync('./dist/manifest.json')); // TODO path.join
			var file = JSON.parse(fs.readFileSync(READ_JSON_FILE));
			// console.log("mainVersion:"+file.mainVersion);
			return {mv:file.mainVersion,f:file.files};
		}

		//生成URL
		function getUrl() {
			return "http://192.168.0.102:9060/"+ "update_win" + getUpdateGradeNum(); //文件路径;


			var ips = global.cfg['ipAddr'].match(/(^.*?):(.*?$)/); //IP地址
			var ipAddr = ips[1];
			var ipAddrPort = "9060" || ips[2]; //端口号
			var updatePath = "update_win" + getUpdateGradeNum(); //文件路径
			var updateUrl = url.format({
				protocol: 'http:',
				hostname: ipAddr,//"192.168.0.102", 
				port: ipAddrPort,
				pathname: updatePath
			}); //生成一个url 地址
			return updateUrl;
		}

	
		function getUpdateGradeNum() {
			if(global.cfg.role) return 0; //如果参数role存在，表示正在打包EClass端

			var gn = global.cfg['gradeNum'].split(',').shift();
			return gn === "1" ? "" : gn
		}
	});
}