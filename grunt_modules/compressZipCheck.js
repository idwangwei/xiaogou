/**
 * 验证生成的Zip
 * @author LuoWen on 20170210
 */
module.exports = function(grunt) {

    grunt.registerTask('compressZipCheck', function(zipFile) {
        if (!zipFile) grunt.exit("请传入zipFile", zipFile);

        var unzip = require("unzip2");
        var path = require("path");
        var fs = require("fs");

        zipFile = zipFile.replace("@", ":");
        //判断压缩包是否存在
        try {
            fs.accessSync(zipFile, fs.F_OK);
        } catch (e) {
            grunt.exit("file not exist. " + zipFile);
            return;
        }

        var extractpath = path.resolve(__dirname, "tempzipout"); //window 解压路径
        //解压更新包
        var unzipExtractor = unzip.Extract({
            path: extractpath
        });
        fs.createReadStream(zipFile)
            .pipe(unzipExtractor)
            .on("error", function(a) {
                grunt.log.error(a)
                grunt.file.delete(extractpath);
                grunt.exit("Zip解压验证失败 \r\n" + zipFile);
            });
        var done = this.async();
        unzipExtractor.on("close", function(a) {
            console.log("Check Zip SUCCESS: " + zipFile);
            grunt.file.delete(extractpath);
            done();
        });
    });
}