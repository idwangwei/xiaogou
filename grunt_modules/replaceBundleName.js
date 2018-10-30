/**
 * Created by 彭建伦 on 2016/2/29.
 *
 * 将 release 目录下 index.html parent_index.html student_index.html parent_index.html
 * 中的 <script src="{bundle}"></script>
 * 替换为各个端使用webpack对应的bundle.js
 */
module.exports = function (grunt) {
    var path = require('path');
    var fs = require('fs');
    grunt.registerTask('replaceBundle', function () {
        /**
         * 将 html 文件中的<script src="{bundle}"></script>替换成对应的bundle.js
         * @param htmlFileName
         * @param bundleJsNameSelector
         * @param buildPath
         */
        function replaceBundleName(regex, htmlFileName, bundleJsNameSelector, buildPath) {
            console.log(arguments)
            buildPath = buildPath || path.join(global.cfg.RELEASE_DIR, 'build');
            var bundleSelector = regex || /\{bundle\}/
                // ,commonsBundleSelector = /\{commons_bundle\}/
                , htmlFile = grunt.file.expand(path.join(buildPath, htmlFileName))
                , bundleName = grunt.file.expand(path.join(buildPath, bundleJsNameSelector));
            if (!htmlFile.length)
                grunt.exit('替换bundle.js:找不到对应的HTML文件！');
            if (!bundleName.length)
                grunt.exit('替换bundle.js:的时候找不到对应的bundle.js!');

            var contentStr = grunt.file.read(htmlFile);
            contentStr = contentStr.replace(bundleSelector, grunt.file.expand({cwd: buildPath}, bundleJsNameSelector)[0]+"?t="+new Date().getTime());
            grunt.file.write(path.join(buildPath, htmlFileName), contentStr);

        }

        function renameBundle(bundleName, bundleSelector, buildPath) {
            buildPath = buildPath || path.join(global.cfg.RELEASE_DIR, 'build');
            var bundle = grunt.file.expand({cwd: buildPath}, bundleSelector);
            if (!bundle.length)
                grunt.exit('重命名bundle.js，找不到对应的文件！');
            fs.renameSync(path.join(buildPath, bundle[0]), path.join(buildPath, bundleName));
        }

        replaceBundleName(null, 'index.html', 'index_bun*.js');
        replaceBundleName(/\{loading\}/, 'index.html', 'loading_bun*.js');
        // replaceBundleName(/\{common_ispt\}/, 'index.html', 'common_ispt_bun*.js');


        replaceBundleName(null,'parent_index.html', 'parent_*.js');
        replaceBundleName(/\{loading\}/,'parent_index.html','loading_*.js');
        // replaceBundleName(/\{common_ispt\}/,'parent_index.html', 'common_ispt_*.js');
        replaceBundleName(/\{common_spt\}/,'parent_index.html', 'common_spt_*.js');

        replaceBundleName(null, 'student_index.html', 'student_*.js');
        replaceBundleName(/\{loading\}/, 'student_index.html', 'loading_*.js');
        // replaceBundleName(/\{common_ispt\}/, 'student_index.html', 'common_ispt_*.js');
        replaceBundleName(/\{common_spt\}/, 'student_index.html', 'common_spt_*.js');

        replaceBundleName(null,'teacher_index.html', 'teacher_*.js');
        replaceBundleName(/\{loading\}/,'teacher_index.html','loading_*.js');
        // replaceBundleName(/\{common_ispt\}/,'teacher_index.html', 'common_ispt_*.js');
        replaceBundleName(/\{common_spt\}/,'teacher_index.html', 'common_spt_*.js');

        //replaceBundleName(null,'student_index.html', 'student_bundle_*.js');
        //replaceBundleName(null,'teacher_index.html', 'teacher_bundle_*.js');
        /* replaceBundleName(null,'parent_index.html', 'index_bundle_*.js');
         replaceBundleName(null,'student_index.html', 'index_bundle_*.js');
         replaceBundleName(null,'teacher_index.html', 'index_bundle_*.js');*/
        //build_common
        //  replaceBundleName(/\{build_commons\}/,'student_index.html', 'build_common_bundle_*.js');
        //  replaceBundleName(/\{build_commons\}/,'teacher_index.html', 'build_common_bundle_*.js');
        //
        //  replaceBundleName(/\{commons_bundle\}/,'parent_index.html', 'common_bundle_*.js');
        //  replaceBundleName(/\{commons_bundle\}/,'student_index.html', 'common_bundle_*.js');
        //  replaceBundleName(/\{commons_bundle\}/,'teacher_index.html', 'common_bundle_*.js');
        //
        //  replaceBundleName(/\{loading\}/,'student_index.html','loading_*.js');
        //  replaceBundleName(/\{loading\}/,'parent_index.html','loading_*.js');
        //  replaceBundleName(/\{loading\}/,'teacher_index.html','loading_*.js');


        renameBundle('tasks_bundle.js', 'tasks_bun*.js');
        renameBundle('tasks2.bundle.js', 'tasks2_bun*.js');
        renameBundle('logger_bundle.js', 'logger_bun*.js');


    });

};