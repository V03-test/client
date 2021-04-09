/**
 * Created by Administrator on 2021/3/24 0024.
 */
var XuanshangPop = BasePopup.extend({
    ctor:function(localIndex){

        this.localIndex = localIndex || 0;
        this.localBtnArr = [];

        this._super("res/xuanshangPop.json");
    },

    selfRender:function(){
        this.localBtnArr.push(this.getWidget("CheckBox_wgxs"));
        this.localBtnArr.push(this.getWidget("CheckBox_zzsm"));

        this.Image_wgxs = this.getWidget("Image_wgxs");
        this.Image_zzsm = this.getWidget("Image_zzsm");

        for(var i = 0;i < this.localBtnArr.length;++i){
            this.localBtnArr[i].temp = i;
            UITools.addClickEvent(this.localBtnArr[i],this,this.onClickItem);
        }

        this.setItemSelect();

        var tipLabel = this.getWidget("labelTip");

        var textLabel = "近期，国家文化部发文要求行业规范自身，规范游戏市场、净化网络环境。作为一家守法合规的企业，我们愿与广大玩家一同维护健康、绿色的娱乐环境。我们在此郑重声明：\n\n"+
            "一、游戏中结算的积分，仅用于游戏对战分数的记录，每局游戏结束时清零，且仅限于本人在游戏中使用，不具备货币属性，不可流通，也不具有任何价值；\n\n" +
            "二、游戏中的钻石属于游戏道具，仅能够用于开设游戏房间，不具备其他用途；\n\n" +
            "三、我司严禁玩家之间进行赌博行为，并且对用户所拥有的积分、钻石等均不提供赠予、转让、流通等功能，并且没有任何形式的官方回收、直接或变相的兑换现金或实物。\n\n" +
            "请大家文明游戏，远离赌博。祝您在《湘娱棋牌》玩的开心!!! \n\n" +
            "                            湘娱棋牌官方运营";

        tipLabel.setString(textLabel);
    },

    onClickItem:function(btn){
        var temp = btn.temp;
        if(temp != this.localIndex){
            this.localIndex = temp;
            this.setItemSelect();
        }
    },

    setItemSelect:function(){
        for(var i = 0;i < this.localBtnArr.length;++i){
            this.localBtnArr[i].setBright(i == this.localIndex);
        }
        this.Image_wgxs.visible = this.localIndex == 0;
        this.Image_zzsm.visible = this.localIndex == 1;
    }
});
