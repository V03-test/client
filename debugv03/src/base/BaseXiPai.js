/**
 * Created by Administrator on 2020/11/16 0016.
 */
var BaseXiPaiModel = {
    isNeedXiPai:false,//是否需要洗牌
    nameList:[],//洗牌玩家名字数组

    clearData:function(){
        this.isNeedXiPai = false;
        this.nameList = [];
    }
};