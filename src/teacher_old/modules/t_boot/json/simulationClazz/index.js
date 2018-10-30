/**
 * Created by WangLu on 2017/4/20.
 */
import * as WORK_LIST  from "./work_list";
import * as ALL_PAPER_LIST  from "./all_paper_list";
import * as GET_PUB_CLAZZ_LIST  from "./get_pub_clazz_list";
import * as ONE_PAPER_LIST  from "./one_paper_list";
import * as PUB_WORK  from "./pub_work";
import * as RANK_STU_LIST  from "./rank_stu_list";
import * as TEXTBOOK_LIST_V2  from "./textbook_list_v2";
import * as ANALYSIS  from "./analysis_paper_repeat";
import * as SCORE_DISTRIBUTION  from "./score_distribution";
import * as SIMULATION_CLAZZ  from "./simulation_clazz";

import * as ERROR_QUES1_1 from "./error_stu_list_first/0f88e3a3-bbbd-4bcb-b46e-10h1f70e8fdf";
import * as ERROR_QUES1_2 from "./error_stu_list_first/5c59e636-5965-42d3-a0a5-18z189ea2424";
import * as ERROR_QUES1_3 from "./error_stu_list_first/36ff356e-e943-4a1e-bd13-1v12bc483a71";
import * as ERROR_QUES1_4 from "./error_stu_list_first/80f4c261-5c77-44dc-9295-2y2y2785cc36";
import * as ERROR_QUES1_5 from "./error_stu_list_first/f477eab4-5a4a-4f19-b62d-15o4f9d02956";

import * as ERROR_QUES2_1 from "./error_stu_list_second/0f88e3a3-bbbd-4bcb-b46e-10h1f70e8fdf";
import * as ERROR_QUES2_2 from "./error_stu_list_second/5c59e636-5965-42d3-a0a5-18z189ea2424";
import * as ERROR_QUES2_3 from "./error_stu_list_second/36ff356e-e943-4a1e-bd13-1v12bc483a71";
import * as ERROR_QUES2_4 from "./error_stu_list_second/80f4c261-5c77-44dc-9295-2y2y2785cc36";
import * as ERROR_QUES2_5 from "./error_stu_list_second/f477eab4-5a4a-4f19-b62d-15o4f9d02956";


import * as STU1  from "./stu_work/61eb5571-9c23-4517-b384-31014c021522";
import * as STU2  from "./stu_work/6bede11d-7377-4a9f-9857-ac60afadd846";
import * as STU3  from "./stu_work/e16d5d79-3436-437e-8884-469fcfd25608";
import * as STU4  from "./stu_work/1d76fe01-2d6c-46ae-81c0-c4243bfe38c9";
import * as STU5  from "./stu_work/6453c444-228d-4d7c-9ca1-c0cea3ed6d74";
import * as STU6  from "./stu_work/bcdac1e1-79ba-4250-a2a4-6d0c65dc2bec";
import * as STU7  from "./stu_work/810977e2-d70d-4ff5-99d9-26812546f978";
import * as STU8  from "./stu_work/fc93b6eb-afad-403d-9287-8030205e1bd1";
import * as STU9  from "./stu_work/c458f5d5-3691-4854-a686-fdd035f25e01";
import * as STU10 from "./stu_work/2997538c-3960-4033-9bf5-86ffc6ec8b31";
import * as STU11 from "./stu_work/8c02619a-3520-4cf4-a5e8-26893c66eca4";
import * as STU12 from "./stu_work/2343a9c5-40d4-4096-aba6-871367cbb92a";
import * as STU13 from "./stu_work/5a2c0332-f816-4062-9ece-b5964a6d9c19";
import * as STU14 from "./stu_work/c32efb47-8c88-49c2-84de-1a2d5d2049f1";
import * as STU15 from "./stu_work/d36c85b5-b4f9-41c9-88dc-88505bf57d7d";
import * as STU16 from "./stu_work/5e0a8792-6697-4b25-a9b6-88f94ff90113";
import * as STU17 from "./stu_work/90a2aa2d-9f47-4e52-9961-68f0b21196d6";
import * as STU18 from "./stu_work/79201ec8-bf78-4587-86d3-c6411d706823";
import * as STU19 from "./stu_work/315ecf36-ee79-4b2e-90fe-aec7fd4cdb0e";
import * as STU20 from "./stu_work/a868b76f-1f18-43af-a811-c93ac4f18316";
import * as STU21 from "./stu_work/144ea125-a865-4431-bbfd-11a8b2671930";
import * as STU22 from "./stu_work/362ba432-2099-4c61-bd30-0a5ec4bcced3";
import * as STU23 from "./stu_work/03d51c17-28fa-43c6-bac4-4a9ae06b0b94";
import * as STU24 from "./stu_work/9e27fd66-f77f-4157-8b64-0414b7b95c38";
import * as STU25 from "./stu_work/0b9ab964-ae34-4e7d-93d9-7242b50e4322";
import * as STU26 from "./stu_work/de7e44d8-ee96-435e-9a25-97ea83155922";
import * as STU27 from "./stu_work/8b8aef85-d8e9-4bbd-9420-b3a16517f2c4";
import * as STU28 from "./stu_work/8168b0e0-8da2-4eed-9e32-e28cdfbfc3fa";
import * as STU29 from "./stu_work/81635455-c6c9-4802-8930-3f03e44593c0";
import * as STU30 from "./stu_work/cdc0562e-9b99-440c-a985-c20708e5f5a8";
import * as STU31 from "./stu_work/4bc71cf0-c4e5-45a9-be48-816369b8a04a";
import * as STU32 from "./stu_work/c70de9c1-d310-4254-8180-c3b88583905e";
import * as STU33 from "./stu_work/c74f23c7-a510-445e-8542-b50509b8fff3";
import * as STU34 from "./stu_work/0be023b0-34fe-4b5a-8541-683a1e418c12";
import * as STU35 from "./stu_work/9520ff02-0d84-4b2d-b18b-07c2fe71bf24";


export default {
    all_paper_list: ALL_PAPER_LIST.default,
    get_pub_clazz_list: GET_PUB_CLAZZ_LIST.default,
    one_paper_list: ONE_PAPER_LIST.default,
    pub_work: PUB_WORK.default,
    rank_stu_list: RANK_STU_LIST.default,
    textbook_list_v2: TEXTBOOK_LIST_V2.default,
    work_list: WORK_LIST.default,
    analysis: ANALYSIS.default,
    score_distribution: SCORE_DISTRIBUTION.default,
    simulation_clazz: SIMULATION_CLAZZ.default,
    stu_work_list: {
        "61eb5571-9c23-4517-b384-31014c021522":STU1.default,
        "6bede11d-7377-4a9f-9857-ac60afadd846":STU2.default,
        "e16d5d79-3436-437e-8884-469fcfd25608":STU3.default,
        "1d76fe01-2d6c-46ae-81c0-c4243bfe38c9":STU4.default,
        "6453c444-228d-4d7c-9ca1-c0cea3ed6d74":STU5.default,
        "bcdac1e1-79ba-4250-a2a4-6d0c65dc2bec":STU6.default,
        "810977e2-d70d-4ff5-99d9-26812546f978":STU7.default,
        "fc93b6eb-afad-403d-9287-8030205e1bd1":STU8.default,
        "c458f5d5-3691-4854-a686-fdd035f25e01":STU9.default,
        "2997538c-3960-4033-9bf5-86ffc6ec8b31":STU10.default,
        "8c02619a-3520-4cf4-a5e8-26893c66eca4":STU11.default,
        "2343a9c5-40d4-4096-aba6-871367cbb92a":STU12.default,
        "5a2c0332-f816-4062-9ece-b5964a6d9c19":STU13.default,
        "c32efb47-8c88-49c2-84de-1a2d5d2049f1":STU14.default,
        "d36c85b5-b4f9-41c9-88dc-88505bf57d7d":STU15.default,
        "5e0a8792-6697-4b25-a9b6-88f94ff90113":STU16.default,
        "90a2aa2d-9f47-4e52-9961-68f0b21196d6":STU17.default,
        "79201ec8-bf78-4587-86d3-c6411d706823":STU18.default,
        "315ecf36-ee79-4b2e-90fe-aec7fd4cdb0e":STU19.default,
        "a868b76f-1f18-43af-a811-c93ac4f18316":STU20.default,
        "144ea125-a865-4431-bbfd-11a8b2671930":STU21.default,
        "362ba432-2099-4c61-bd30-0a5ec4bcced3":STU22.default,
        "03d51c17-28fa-43c6-bac4-4a9ae06b0b94":STU23.default,
        "9e27fd66-f77f-4157-8b64-0414b7b95c38":STU24.default,
        "0b9ab964-ae34-4e7d-93d9-7242b50e4322":STU25.default,
        "de7e44d8-ee96-435e-9a25-97ea83155922":STU26.default,
        "8b8aef85-d8e9-4bbd-9420-b3a16517f2c4":STU27.default,
        "8168b0e0-8da2-4eed-9e32-e28cdfbfc3fa":STU28.default,
        "81635455-c6c9-4802-8930-3f03e44593c0":STU29.default,
        "cdc0562e-9b99-440c-a985-c20708e5f5a8":STU30.default,
        "4bc71cf0-c4e5-45a9-be48-816369b8a04a":STU31.default,
        "c70de9c1-d310-4254-8180-c3b88583905e":STU32.default,
        "c74f23c7-a510-445e-8542-b50509b8fff3":STU33.default,
        "0be023b0-34fe-4b5a-8541-683a1e418c12":STU34.default,
        "9520ff02-0d84-4b2d-b18b-07c2fe71bf24":STU35.default,
    },
    error_stu_list_first: {
        "0f88e3a3-bbbd-4bcb-b46e-10h1f70e8fdf":ERROR_QUES1_1.default,
        "5c59e636-5965-42d3-a0a5-18z189ea2424":ERROR_QUES1_2.default,
        "36ff356e-e943-4a1e-bd13-1v12bc483a71":ERROR_QUES1_3.default,
        "80f4c261-5c77-44dc-9295-2y2y2785cc36":ERROR_QUES1_4.default,
        "f477eab4-5a4a-4f19-b62d-15o4f9d02956":ERROR_QUES1_5.default,
    },
    error_stu_list_second: {
        "0f88e3a3-bbbd-4bcb-b46e-10h1f70e8fdf":ERROR_QUES2_1.default,
        "5c59e636-5965-42d3-a0a5-18z189ea2424":ERROR_QUES2_2.default,
        "36ff356e-e943-4a1e-bd13-1v12bc483a71":ERROR_QUES2_3.default,
        "80f4c261-5c77-44dc-9295-2y2y2785cc36":ERROR_QUES2_4.default,
        "f477eab4-5a4a-4f19-b62d-15o4f9d02956":ERROR_QUES2_5.default,
    },
};
