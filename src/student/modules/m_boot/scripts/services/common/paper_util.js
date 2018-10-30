/**
 * Created by 彭建伦 on 2016/6/1.
 * 提供对试卷中个试题查询的常用工具方法
 */
class PaperUtil {
    /**
     * 根据大题的seqNum或者大题与小题的seqNum获取对应的题
     * 如果smallQSeqNum为空，则获取相应大题，反之，则获取相应小题
     * @param bigQList 大题列表
     * @param bigQSeqNum 大题seqNum
     * @param [smallQSeqNum] 小题seqNum
     */
    getBigQOrSmallQFromBySeqNum(bigQList, bigQSeqNum, smallQSeqNum) {
        let bigQ, smallQ;
        // 获取大题
        for (let i = 0; i < bigQList.length; i++) {
            if (bigQList[i].seqNum == bigQSeqNum) {
                bigQ = bigQList[i];
                break;
            }
        }
        if (!bigQ)return console.error('bigQ not found in bigQList by given seqNum:' + bigQSeqNum);
        if (!smallQSeqNum) return bigQ;
        //获取小题
        let smallQList = bigQ.qsList;
        for (let j = 0; j < smallQList.length; j++) {
            if (smallQList[j].seqNum == smallQSeqNum) {
                smallQ = smallQList[i];
                break;
            }
        }
        if (!smallQ)return console.error('smallQ not found in bigQList by given seqNum:' + smallQSeqNum);
        return smallQ;
    }

    /**
     * 获取试卷大题列表中给定 bigQSeqNum[大题题号]，smallQSeqNum[小题题号]对应小题 "A" 的下一小题
     * 如果小题 "A" 已经是最后一个小题，则返回 "A"
     * @param bigQList 大题列表
     * @param bigQSeqNum 大题seqNum
     * @param [smallQSeqNum] 小题seqNum
     */
    getNextSmallQInPaperBigQList(bigQList, bigQSeqNum, smallQSeqNum) {
        let smallQ = this.getBigQOrSmallQFromBySeqNum(bigQList, bigQSeqNum, smallQSeqNum);
        if (smallQ.isLastOfAllQ) return smallQ;
        if (smallQ.isLastOfBigQ){
            big
        }
    }

}
