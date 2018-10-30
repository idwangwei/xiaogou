/**
 * Created by ww on 2018/2/28.
 */
import workChapterPaperService from './work_chapter_paper_server';
import workListService from './work_list_service';

let services = angular.module('t_home_teaching_work.services', []);
services.service('workListService',workListService);
services.service('workChapterPaperService',workChapterPaperService);

