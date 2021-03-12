/**
 * Created by cyp on 2020/7/22.
 * 显示抽奖红包按钮的层
 */
var ChouJiangBtnLayer = cc.Layer.extend({
    ctor:function(){
        this._super();

        SyEventManager.addEventListener("Switch_Main_Layer",this,this.onSwithLayer);
        SyEventManager.addEventListener("Recive_Chou_Jiang_Data",this,this.onGetChouJiangData);
        SyEventManager.addEventListener("Update_LeiJi_Win_Num",this,this.onGetWinNumData);
        SyEventManager.addEventListener("Get_Guan_Kan_Reward",this,this.onGetGuanKanReward);

        this.cleanData();

        this.initLayer();

        this.schedule(this.handleUpdate,60,cc.REPEAT_FOREVER);
    },

    cleanData:function(){
        this.winCount = 0;
        this.rewardArr = [];
        this.hasGetArr = [];
    },

    handleUpdate:function(){
        var date = new Date();
        var hour = date.getHours();
        var min = date.getMinutes();
        if(hour == 0 && (min == 0 || min == 1)){
            this.cleanData();
            if(this.contentNode.isVisible()){
                this.contentNode.setVisible(false);
                this.getChouJiangData();
            }
        }
    },

    checkShowBtn:function(){
        var isShow = false;
        if(LayerManager.isInRoom() && BaseRoomModel.isGoldRoom()){
            isShow = true;
        }

        //奖励领取完了不显示
        if(this.rewardArr.length > 0 && this.rewardArr.length == this.hasGetArr.length){
            isShow = false;
        }

        this.contentNode.setVisible(isShow);
        if(isShow){
            this.setBtnPos();
        }

        return isShow;
    },

    setBtnPos:function(){
        var wanfa = 0;
        var renshu = 0;
        if(BaseRoomModel.curRoomData){
            wanfa = BaseRoomModel.curRoomData.wanfa;
            renshu = BaseRoomModel.curRoomData.renshu;
        }
        var pos = cc.p(120,cc.winSize.height/2 + 210);
        if(LayerManager.isInPDK()){
            pos = cc.p(cc.winSize.width/2 - 450,cc.winSize.height - 90);
        }else if(wanfa == GameTypeEunmMJ.HZMJ || wanfa == GameTypeEunmMJ.CSMJ
            || wanfa == GameTypeEunmMJ.ZZMJ){
            if(renshu == 2)pos = cc.p(150,cc.winSize.height - 300);
            if(renshu == 3)pos = cc.p(cc.winSize.width/2 - 450,cc.winSize.height - 90);
        }else if(GameTypeManager.isZP(wanfa)){
            //pos = cc.p(cc.winSize.width - 150,cc.winSize.height/2 + 150);
            pos = cc.p(cc.winSize.width/2 - 350,cc.winSize.height - 180);
            if(renshu == 3)pos = cc.p(150,cc.winSize.height/2 + 30);

            if(wanfa == GameTypeEunmZP.ZZPH && renshu == 3){
                pos = cc.p(cc.winSize.width/2 - 450,cc.winSize.height - 90);
            }
        }

        this.contentNode.setPosition(pos);

    },

    onSwithLayer:function(){
        var isShow = this.checkShowBtn();

        if(this.contentNode.isVisible() && this.rewardArr.length <= 0){
            this.getChouJiangData();
        }

        if(!isShow){
            this.cleanData();
        }
    },

    getChouJiangData:function(){
        sySocket.sendComReqMsg(1111,[2]);
    },

    onGetGuanKanReward:function(event){
        var msg = event.getUserData();

        var pop = new AwardPop(msg.params[1]);

        if(msg.params[0] == 1){
            pop.setAwrdImg("res/ui/bjdmj/popup/shopRes/quan_max.png",1.8);
            var str = "礼券可去兑换商城兑换话费等商品";
            pop.addTipInfo(str);
        }

        PopupManager.addPopup(pop,2);
        PopupManager.removeClassByPopup(ChouJiangGetLayer);
    },

    onGetWinNumData:function(event){
        var msg = event.getUserData();

        this.winCount = msg.params[0] || 0;

        this.setBtnState();

        if(msg.params[1] > 0){
            var delayTime = 1000;

            if(BaseRoomModel.curRoomData){
                var wanfa = BaseRoomModel.curRoomData.wanfa;
                if(ClubRecallDetailModel.isPDKWanfa(wanfa)){
                    delayTime = 1000;
                }
            }

            var data = {type:msg.params[1],num:msg.params[2]};
            setTimeout(function(){
                var pop = new ChouJiangGetLayer(data);
                PopupManager.addPopup(pop,1);
            },delayTime);

            this.getChouJiangData();
        }

    },

    onGetChouJiangData:function(event){
        var msg = event.getUserData();

        if(msg.strParams[0]){
            this.item_1.setVisible(true);

            var data = JSON.parse(msg.strParams[0]);
            this.winCount = data.winCount || 0;
            this.rewardArr = data.getRewards || [];
            this.hasGetArr = data.rewards || [];

            var sortFunc = function(a,b){
                return a-b;
            }

            this.rewardArr.sort(sortFunc);
            this.hasGetArr.sort(sortFunc);
        }

        this.checkShowBtn();
        this.setBtnState();
    },

    initLayer:function(){
        this.contentNode = new cc.Node();
        this.contentNode.setPosition(150,cc.winSize.height*3/4);
        this.addChild(this.contentNode);

        this.item_1 = new cc.Node();
        this.contentNode.addChild(this.item_1);

        var img = "res/choujiang/hongbao.png";
        this.btn_hb = new ccui.Button(img,img,"");
        this.btn_hb.addTouchEventListener(this.onClickBtn,this);
        this.item_1.addChild(this.btn_hb);

        var info_bg = new cc.Sprite("res/choujiang/info_bg.png");
        info_bg.setPosition(0,-45);
        this.item_1.addChild(info_bg);
        this.info_bg = info_bg;

        var action = cc.sequence(cc.rotateBy(0.15,-10),cc.rotateBy(0.3,20),
            cc.rotateBy(0.3,-20),cc.rotateBy(0.15,10),cc.delayTime(3)).repeatForever();
        this.item_1.runAction(action);

        this.contentNode.setVisible(false);
        this.item_1.setVisible(false);
    },

    setBtnState:function(){
        var isCanGet = false;
        var leftCount = "*";
        for(var i = 0;i<this.rewardArr.length;++i){
            if(this.rewardArr[i] != this.hasGetArr[i]){
                if(this.winCount >= this.rewardArr[i]){
                    isCanGet = true;
                }else{
                    leftCount = this.rewardArr[i] - this.winCount;
                    break;
                }
            }
        }

        this.addInfoStr(leftCount);

    },

    addInfoStr:function(num){
        this.info_bg.removeAllChildren(true);

        var fontName = "res/font/bjdmj/fznt.ttf";

        var txt1 = new ccui.Text("再赢",fontName,30);
        var txt2 = new ccui.Text(num,fontName,34);
        var txt3 = new ccui.Text("局",fontName,30);

        txt1.setAnchorPoint(0,0.5);
        txt2.setAnchorPoint(0,0.5);
        txt3.setAnchorPoint(0,0.5);

        txt2.setColor(cc.color("#fff178"));

        var allWidth = txt1.width + txt2.width + txt3.width;
        var startX = (this.info_bg.width - allWidth)/2;

        txt1.setPosition(startX,this.info_bg.height/2);
        txt2.setPosition(txt1.x + txt1.width,txt1.y);
        txt3.setPosition(txt2.x + txt2.width,txt1.y);

        this.info_bg.addChild(txt1,0);
        this.info_bg.addChild(txt2,0);
        this.info_bg.addChild(txt3,0);

    },

    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);
            if(sender == this.btn_hb){
                var pop = new ChouJiangJdLayer(this.winCount,this.rewardArr,this.hasGetArr);
                PopupManager.addPopup(pop,99);
            }
        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },
});