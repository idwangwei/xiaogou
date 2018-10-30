/**
 * Created by WL on 2017/9/5.
 */
function genUUID() {
    var fmt = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    return fmt.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
let qsList =[];
for(let i=0;i<100;i++){
    qsList.push({
        expr: ['\\frac{1}{6}', '+', '\\frac{2}{3}', '=', '\\blank'],
        id:genUUID(),
        inputId:genUUID()
    })
}
export let oral_calculation_select_paper = {
    paperId: '70371a79-92df-4906-9ebb-1818103067fc',
    paperInstanceId: '65148882-4ebe-4469-bebe-98e1dde94daa',
    quesList:qsList
    /*quesList: [
        {
            expr: ['15', '+', '27', '=', '\\blank'],
            id: 'b7421e2c-01ba-4087-933f-47dcfedb7e79',
            inputId: 'dbc5ebe8-4193-4f5a-9142-db67ba2242ca'
        },
        {
            expr: ['30', '+', '50', '=', '\\blank'],
            id: '45df8e5d-9903-4f55-9e75-fbeadb09f048',
            inputId: 'f835930e-99ac-4e4d-a2b8-b5fb7f2e7064'
        },
        {
            expr: ['\\frac{1}{6}', '+', '\\frac{2}{3}', '=', '\\blank'],
            id: '0285f27f-d8e4-430a-9ce8-970c29e0db08',
            inputId: '947bcace-55f4-4acb-b350-73a8dc0c7b1a'
        },
        {
            expr: ['78', '-', '53', '=', '\\blank'],
            id: 'a5e0d036-3eff-4696-89ff-09bdeed50f8e',
            inputId: '5cfea5f5-825e-48ba-b4f1-9deb3ee3a4a1'
        },
        {
            expr: ['12', '\\times', '4', '=', '\\blank'],
            id: 'eaa6606c-f15f-4ce1-9404-4bd9710a3df6',
            inputId: 'b2c6919f-9c7e-4406-bfd4-8dede7dce26d'
        },
        {
            expr: ['60', '\\div', '5', '=', '\\blank'],
            id: 'ab567451-7e4b-457e-9915-a32982c3fe4e',
            inputId: '4e9b9299-3b53-44a7-a8d2-2021a424c1bc'
        },
        {
            expr: ['82', '+', '115', '=', '\\blank'],
            id: '4a9fda85-195f-4f1a-a70d-5bc6bc564442',
            inputId: 'f863a726-0e75-47b6-a974-9ba578622881'
        },
        {
            expr: ['75', '\\div', '5', '=', '\\blank'],
            id: '8a76b615-d5be-4996-9847-19c5f778997c',
            inputId: 'e8af8d60-efb6-455b-8d60-9ec398f8386a'
        },
        {
            expr: ['\\frac{17}{20}', '-', '\\frac{7}{10}', '=', '\\blank'],
            id: '0d01795b-2695-489c-99b9-cb2a5f270ca4',
            inputId: '2c1116a9-5088-4ae9-aac2-c81fef67c36e'
        },
        {
            expr: ['\\frac{5}{6}', '\\times', '\\frac{6}{5}', '=', '\\blank'],
            id: 'b9b29b5f-ba35-4689-8ed8-90c06032066e',
            inputId: '271ac1d7-f282-4fa9-8d22-528ea178663b'
        },
        {
            expr: ['4.5', '+', '2.7', '=', '\\blank'],
            id: 'dc6abfa4-9630-48d8-8991-954f78e9513c',
            inputId: 'b6157c09-fe5b-4683-844d-263d39595cd9'
        },
        {
            expr: ['75', '-', '38', '=', '\\blank'],
            id: 'c142e501-53ba-426a-b579-a5013ca225d9',
            inputId: 'bd3757ea-0c3f-46b3-ae61-24f354abb34d'
        },
    ]*/
};

export let oral_calculation_select_paper_info = {}




