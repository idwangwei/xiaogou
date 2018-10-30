import ExpressionParser from 'expressionParser/expressParser';

let parser = new ExpressionParser();

function parseQuestionList(smallQList) {
    let questionList = [];
    smallQList.forEach(smallQ => {
        let expr = [];
        let inputBoxIdList = [];
        let qContext = smallQ.qContext;
        let question = {};
        // let nodes = $(qContext).find('p').get(0).childNodes;
        let $nodes = $(qContext).find('p');
        let scorePointQbuId = smallQ.inputList[0]&&smallQ.inputList[0].spList[0]&&smallQ.inputList[0].spList[0]["scorePointQbuId"];
        $nodes.each(function (index) {
            let nodes = this.childNodes;
            for (let i = 0, len = nodes.length; i < len; i++) {
                let node = nodes[i];
                if (node.nodeType === 3) { //textNode
                    let content = node.textContent.replace(/`/mg, '');
                    expr = expr.concat(parser.parse(content));
                } else {
                    let nodeID= `${node.id}__${scorePointQbuId}`;
                    expr.push(`\\blank{${nodeID}}`);
                    inputBoxIdList.push(node.id);
                }
            }
            if ($nodes.length > 1 && index !== $nodes.length - 1) {
                expr.push('br');
            }
        });


        question.expr = expr;
        question.inputList = smallQ.inputList.spList;
        question.inputBoxIdList = inputBoxIdList;
        Object.assign(question, smallQ, question);
        questionList.push(question);
    });
    return questionList;
}

export default parseQuestionList;