/**
 * Created by pengjianlun on 15-12-22.
 * 生成日志文件
 */
module.exports=function(grunt){
    //写日志文件
    grunt.registerTask('genLogFile',function(){
        global.buildZipPath=global.cfg.RELEASE_DIR+'/update_' + global.cfg.buildName+ '.zip';
        global.buildZipPatchPath=global.cfg.RELEASE_DIR+'/patch_' + global.cfg.buildName+ '.zip';
        global.buildLogPath=global.cfg.RELEASE_DIR+'/log.log';
        grunt.file.write( global.buildLogPath, global.cfg.buildName);
    });
};
