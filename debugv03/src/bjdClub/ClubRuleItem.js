/**
 * Created by Administrator on 2017/7/21.
 */


var ClubRuleItem = ccui.Widget.extend({

    ctor:function(data , parentNode,idx){
        this.data = data;
        //cc.log("ClubRuleItem",JSON.stringify(this.data));
        this.groupId = data.groupId;
        this.idx = idx + 1;

        this.wanfa = "";
        this.renshu = "";
        this.startedNum = this.data.startedNum || 0;
        this.parentNode = parentNode;
        this._super();
        this.setContentSize(1530, 210);

        var Panel_16=this.Panel_16= UICtor.cPanel(cc.size(1530,210),cc.color(150,200,255),0);
        Panel_16.setAnchorPoint(cc.p(0,0));
        Panel_16.setPosition(0,0);
        var Button_roombg=this.Button_roombg= new cc.Scale9Sprite("res/res_ui/qyq/common/commonKuang/xinxiTiao.png",null,cc.rect(40,30,40,30));
        Button_roombg.setPosition(765,105);
        this.Button_roombg.setContentSize(1530, 210);
        Panel_16.addChild(Button_roombg);


        var infoScroll = new ccui.ScrollView();
        infoScroll.setDirection(ccui.ScrollView.DIR_VERTICAL);
        infoScroll.setTouchEnabled(false);
        infoScroll.setContentSize(845,130);
        infoScroll.setPosition(cc.p(-600+Button_roombg.getAnchorPointInPoints().x,-100 + Button_roombg.getAnchorPointInPoints().y));
        Button_roombg.addChild(infoScroll);
        this.infoScroll = infoScroll;

        var Label_detail=this.Label_detail= new ccui.Text("","res/font/bjdmj/fznt.ttf",40);
        Label_detail.setTextAreaSize(cc.size(845,0));
        Label_detail.setColor(cc.color("#ba3d33"));
        Label_detail.setAnchorPoint(cc.p(0,0.5));
        Label_detail.setPosition(cc.p(0,infoScroll.height/2));
        infoScroll.addChild(Label_detail);

        var btn_private = UICtor.cBtn("res/res_ui/qyq/wanfa/ksmfBtn.png");
        btn_private.setPosition(cc.p(380+Button_roombg.getAnchorPointInPoints().x, Button_roombg.getAnchorPointInPoints().y+22));
        Button_roombg.addChild(btn_private);
        btn_private.temp = 0
        btn_private.visible = false;

        var btn_start = UICtor.cBtn("res/res_ui/qyq/wanfa/ksjrBtn.png");
        btn_start.setPosition(cc.p(630+Button_roombg.getAnchorPointInPoints().x, 22+Button_roombg.getAnchorPointInPoints().y));
        Button_roombg.addChild(btn_start);
        btn_start.temp = 3

        var BitmapLabel_order = this.BitmapLabel_order = new ccui.Text("1","res/font/bjdmj/fznt.ttf",72);
        BitmapLabel_order.setColor(cc.color("#886032"));
        BitmapLabel_order.setPosition(cc.p(90, Button_roombg.getAnchorPointInPoints().y));
        Button_roombg.addChild(BitmapLabel_order);

        var Label_bagName=this.Label_bagName= new ccui.Text("打筒子包厢名字啊","res/font/bjdmj/fznt.ttf",40);
        Label_bagName.setColor(cc.color("#6f1816"));
        Label_bagName.setTextAreaSize(cc.size(350,45));
        Label_bagName.setAnchorPoint(cc.p(0,0.5));
        Label_bagName.setPosition(cc.p(-510+Button_roombg.getAnchorPointInPoints().x, 65+Button_roombg.getAnchorPointInPoints().y));
        Button_roombg.addChild(Label_bagName);

        var Label_wanfaType=this.Label_wanfaType= new ccui.Text("跑胡子啊","res/font/bjdmj/fznt.ttf",40);
        Label_wanfaType.setColor(cc.color("#6f1816"));
        Label_wanfaType.setAnchorPoint(cc.p(0,0.5));
        Label_wanfaType.setPosition(cc.p(-160+Button_roombg.getAnchorPointInPoints().x, 65+Button_roombg.getAnchorPointInPoints().y));
        Button_roombg.addChild(Label_wanfaType);

        var Label_bagNum=this.Label_bagNum= new ccui.Text("玩法类型：","res/font/bjdmj/fznt.ttf",35);
        Label_bagNum.setColor(cc.color("#7e5839"));
        Label_bagNum.setPosition(cc.p(570+Button_roombg.getAnchorPointInPoints().x, -60+Button_roombg.getAnchorPointInPoints().y));
        Button_roombg.addChild(Label_bagNum);

        this.addChild(Panel_16);

        UITools.addClickEvent(btn_private, this, this.onClickStartBtn);//onClick
        UITools.addClickEvent(btn_start, this, this.onClickStartBtn);//onClick

        //Panel_16.setTouchEnabled(true);
        ////添加点击事件
        //UITools.addClickEvent(Button_roombg, this, this.onClickCancel);//onClick

        //刷新俱乐部显示
        this.setData(this.data);
    },

    onClickStartBtn:function(sender){
        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(function(){
            sender.setTouchEnabled(true);
        })));

        ClickClubModel.updateBagModeId(ClickClubModel.getCurClubId(),this.modeId);
        if (this.parentNode){
            this.parentNode.refreshClubRuleChoose(this.modeId);
        }

        SyEventManager.dispatchEvent(SyEvent.CLUB_BAG_FASTJOIN,sender.temp);
    },

    updateWanfaTip:function(modeId){
        if (modeId == this.modeId) {
            SyEventManager.dispatchEvent(SyEvent.UPDATE_SHOW_BAGWANFA, {modeId: this.modeId});
        }
    },

    setData:function(itemData){

        this.BitmapLabel_order.setString("" + this.idx);


        var creditStr = "";
        if (itemData.config.creditMsg && itemData.config.creditMsg[0]){
            creditStr = " 擂台房";
        }

        //显示游戏和房间
        var createPara = itemData.config.modeMsg.split(",");
        var gameStr = ClubRecallDetailModel.getGameName(createPara) || "";
        var wanfaStr = ClubRecallDetailModel.getWanfaStr(itemData.config.modeMsg,true) || "";
        this.Label_wanfaType.setString("玩法类型:" +gameStr);
        this.Label_bagName.setString(""+itemData.groupName);
        this.Label_detail.setString(wanfaStr + creditStr);

        var contentH = Math.max(this.infoScroll.height,this.Label_detail.height);
        this.infoScroll.setInnerContainerSize(cc.size(this.infoScroll.width,contentH));
        this.Label_detail.setPosition(0,contentH/2);

        if(contentH > this.infoScroll.height){
            var moveH = contentH-this.infoScroll.height;
            var action1 = cc.moveBy(moveH/20,cc.p(0,moveH));
            var action = cc.sequence(action1,action1.reverse()).repeatForever();
            this.Label_detail.runAction(action);
        }


        this.Label_bagNum.setString("" + this.startedNum + "桌正在牌局");

        if(!ClickClubModel.isClubCreaterOrLeader()){
            this.Label_bagNum.setString("");
        }

        this.modeId = itemData.config.keyId;

        //if (this.parentNode.modeId){
        //    if (this.parentNode.modeId == this.modeId){
        //        this.showBtnState(this.modeId);
        //    }
        ////}else{
        ////    if (this.groupId == 1){
        ////        this.onClickCancel();
        ////    }
        //}
    },

    getBagId:function(){
        return this.groupId;
    },
});

