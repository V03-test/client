/**
 * Created by cyp on 2019/6/21.
 */
var YYBSRoomLayer = YYBSBaseRoomLayer.extend({
    tableMsgArr:null,

    ctor:function(){
        this._super();

        this.tableMsgArr = [];

        this.addCustomEvent(SyEvent.GetTableMsg,this,this.onGetTableData);

        this.soundHandle = new YYBSRoomSound();

        this.initLayer();
        this.addRoomTitle();
        this.addRoomLayer();
        this.addBottomBtn();
        this.addYuyinRecored();
        this.addRoomBtn();

        this.addCustomEvent("XIPAI_CLEAR_NODE", this, this.clearXiPai);
        this.addCustomEvent(SyEvent.BISAI_XIPAI, this, this.NeedXipai);
    },

    NeedXipai: function () {
        this.optBtnLayer.visible = false;
        this.cardLayer.visible = false;
        this.selectZhuLayer.visible = false;
        this.jiaoFenBtnLayer.visible = false;

        this.xipaiAni();
        this.addTipLabel();
    },

    clearXiPai:function(){
        if (this.actionnode) {
            this.actionnode.removeAllChildren();
            delete this.actionnode;
        }
        if (this.actionnode2) {
            this.actionnode2.removeAllChildren();
            delete this.actionnode2;
        }
        if(this.tipLabelStr){
            this.tipLabelStr.visible = false;
        }

        this.optBtnLayer.visible = true;
        this.cardLayer.visible = true;
        this.selectZhuLayer.visible = true;
        this.jiaoFenBtnLayer.visible = true;

        BaseXiPaiModel.isNeedXiPai = false;
    },

    addTipLabel:function(){
        if(BaseXiPaiModel.isNeedXiPai){
            var nameList = BaseXiPaiModel.nameList || [];
            var LabelStr = "";
            for(var i = 0;i < nameList.length;++i){
                if(nameList[i]){
                    if(LabelStr == ""){
                        LabelStr += nameList[i]
                    }else{
                        LabelStr += "、" + nameList[i];
                    }
                }

            }
            if(LabelStr != ""){
                if(!this.tipLabelStr){
                    this.tipLabelStr = new cc.LabelTTF("", "", 45);
                    this.tipLabelStr.x = 960;
                    this.tipLabelStr.y = 620;
                    this.addChild(this.tipLabelStr,100);
                }
                this.tipLabelStr.visible = true;
                this.tipLabelStr.setString("玩家 "+LabelStr+" 正在洗牌");
            }
        }
    },
    xipaiAni: function () {
        this.actionnode = new cc.Node();
        this.addChild(this.actionnode, 10);
        this.actionnode.setPosition(cc.winSize.width / 2, cc.winSize.height / 2 - 300);

        ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/jnqp/jnqp.ExportJson");
        var ani = new ccs.Armature("jnqp");
        ani.setAnchorPoint(0.5, 0.5);
        ani.setPosition(-50, 600);
        ani.getAnimation().play("Animation1", -1, 1);
        this.actionnode.addChild(ani);
        for (var index = 0; index < 11; index++) {
            var back_card = new cc.Sprite("res/res_erddz/action_card.png");
            back_card.scale = 0.6;
            back_card.setPosition(-300, 0);
            this.actionnode.addChild(back_card);
            back_card.setLocalZOrder(-index);

            var action = this.xipaiAction(index, 1)
            back_card.runAction(action);
        }

        for (var j = 0; j < 11; j++) {
            var back_card2 = new cc.Sprite("res/res_erddz/action_card.png");
            back_card2.scale = 0.6;
            back_card2.setPosition(300, 0);
            this.actionnode.addChild(back_card2);
            back_card2.setLocalZOrder(-j);

            var action = this.xipaiAction(j, 2)
            back_card2.runAction(action);
        }
    },

    xipaiAction: function (index, type) {
        var self = this;
        var end_x = type == 2 ? 300 : -300;
        var action = cc.sequence(
            cc.delayTime(0.1 * index),
            cc.moveTo(0.3, end_x, 600 - 60 * index),
            cc.moveTo(0.2, end_x, 200),
            cc.moveTo(0.1, 0, 300),
            cc.callFunc(function () {
                if (index == 10 && type == 2) {
                    self.actionnode.removeAllChildren();
                    sySocket.sendComReqMsg(3);
                    self.clearXiPai();
                }
            })
        );
        return action;
    },

    onEnterTransitionDidFinish:function(){
        this._super();

        this.scheduleUpdate();
    },

    onTouXiang:function(msg){
        cc.log("===========onTouXiang===========",msg.strParams[0]);
        var data = JSON.parse(msg.strParams[0]);
        var time = msg.params[0];

        var agree_num = 0;
        var my_agree = false;
        var is_refuse = false;
        var refuse_seat = 0;
        for(var i = 0;i<data.length;++i){
            if(data[i].state == 1 || data[i].state == 2) agree_num++;
            if(data[i].seat == YYBSRoomModel.mySeat && data[i].state == 2)my_agree = true;
            if(data[i].state == 3){
                is_refuse = true;
                refuse_seat = data[i].seat;
            }
        }

        if(is_refuse){

            this.touXiangTipLayer && this.touXiangTipLayer.removeFromParent(true);
            this.touXiangTipLayer = null;

            var name = "";
            var p = YYBSRoomModel.getPlayerDataByItem("seat",refuse_seat);
            if(p && p.name)name = p.name;

            FloatLabelUtil.comText("玩家【" + name + "】拒绝投降");

        } else if(agree_num == YYBSRoomModel.renshu){
            this.touXiangTipLayer && this.touXiangTipLayer.removeFromParent(true);
            this.touXiangTipLayer = null;
        }else{
            if(!this.touXiangTipLayer){
                this.touXiangTipLayer = new TouXiangTipLayer();
                this.addChild(this.touXiangTipLayer,30);
            }

            if(YYBSRoomModel.mySeat == YYBSRoomModel.banker){
                this.touXiangTipLayer.setLayerInfo(1,time);
            }else if(my_agree){
                this.touXiangTipLayer.setLayerInfo(3,time);
            }else if(!my_agree){
                this.touXiangTipLayer.setLayerInfo(2,time);
            }
        }

    },

    initLayer:function(){
        var roomInfoBg = new cc.Sprite("res/res_gameCom/zdk.png");
        roomInfoBg.setAnchorPoint(0.5,0.5);
        roomInfoBg.setPosition(248,cc.winSize.height - 34);
        this.addChild(roomInfoBg);

        this.label_room_id = UICtor.cLabel("房号:123456",36);
        this.label_room_id.setAnchorPoint(0.5,0.5);
        this.label_room_id.setPosition(140,roomInfoBg.height - 32);
        roomInfoBg.addChild(this.label_room_id);

        this.label_jushu = UICtor.cLabel("局数:0/10",36);
        this.label_jushu.setAnchorPoint(0.5,0.5);
        this.label_jushu.setPosition(360,this.label_room_id.y);
        roomInfoBg.addChild(this.label_jushu);

        this.label_room_name = UICtor.cLabel("三打哈房间名",36);
        this.label_room_name.setAnchorPoint(0.5,0.5);
        this.label_room_name.setPosition(600,this.label_jushu.y);
        roomInfoBg.addChild(this.label_room_name);

        var scoreInfoBg = new cc.Sprite("res/res_yybs/di1.png");
        scoreInfoBg.setAnchorPoint(1,1);
        scoreInfoBg.setPosition(475,cc.winSize.height - 65);
        this.addChild(scoreInfoBg);

        this.label_zhu = UICtor.cLabel("无主",33);
        this.label_zhu.setColor(cc.color(251,201,66));
        this.label_zhu.setPosition(100,scoreInfoBg.height - 27);
        scoreInfoBg.addChild(this.label_zhu,1);

        this.label_jiaofen = UICtor.cLabel("80",33);
        this.label_jiaofen.setColor(cc.color(251,201,66));
        this.label_jiaofen.setPosition(260,scoreInfoBg.height - 27);
        scoreInfoBg.addChild(this.label_jiaofen,1);

        this.label_defen = UICtor.cLabel("10",33);
        this.label_defen.setColor(cc.color(251,201,66));
        this.label_defen.setPosition(410,scoreInfoBg.height - 27);
        scoreInfoBg.addChild(this.label_defen,1);

        this.listview_defen = new ccui.ListView();
        this.listview_defen.setDirection(ccui.ScrollView.DIR_HORIZONTAL);
        this.listview_defen.setContentSize(504,72);
        this.listview_defen.setPosition(11,8);
        this.listview_defen.setItemsMargin(5);
        scoreInfoBg.addChild(this.listview_defen,1);

        this.label_rule_tip = new ccui.Text("","",26);
        this.label_rule_tip.setTextAreaSize(cc.size(1000,0));
        this.label_rule_tip.setFontName("res/font/bjdmj/fzcy.TTF");
        this.label_rule_tip.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.label_rule_tip.setOpacity(100);
        this.label_rule_tip.setColor(cc.color("#ffffff"));
        this.label_rule_tip.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 220);
        this.addChild(this.label_rule_tip);

        this.spr_tip = new cc.Sprite("res/res_yybs/other_jiaofen.png");
        this.spr_tip.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.spr_tip.setVisible(false);
        this.addChild(this.spr_tip);

        var btn_bg = new cc.Sprite("res/res_yybs/image_xiadi.png");
        btn_bg.setAnchorPoint(0.5,0);
        btn_bg.setPosition(cc.winSize.width/2,0);
        this.addChild(btn_bg);

    },

    addRoomTitle:function(){
        var spr = new cc.Sprite("res/res_yybs/title_yybs.png");
        spr.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 65);
        this.addChild(spr);
    },

    addBottomBtn:function(){
        var img = "res/res_gameCom/playerchat.png";
        this.btn_chat = new ccui.Button(img,img);
        this.btn_chat.setPosition(cc.winSize.width - 100,590);
        this.addChild(this.btn_chat,2);

        img = "res/res_gameCom/voiceNormal.png";
        this.btn_yuyin = new ccui.Button(img,img);
        this.btn_yuyin.setPosition(this.btn_chat.x,460);
        this.addChild(this.btn_yuyin,2);

        img = "res/res_yybs/shangyilun.png";
        this.btn_card_record = new ccui.Button(img,img,"");
        this.btn_card_record.setPosition(cc.winSize.width - 120,42);
        this.addChild(this.btn_card_record,2);

        img = "res/res_yybs/dipai.png";
        this.btn_dipai = new ccui.Button(img,img,"res/res_yybs/dipai1.png");
        this.btn_dipai.setPosition(cc.winSize.width - 450,42);
        this.addChild(this.btn_dipai,2);

        this.btn_chat.addTouchEventListener(this.onClickBtn,this);
        this.btn_yuyin.addTouchEventListener(this.onClickBtn,this);
        this.btn_card_record.addTouchEventListener(this.onClickBtn,this);
        this.btn_dipai.addTouchEventListener(this.onClickDipai,this);

        if(BaseRoomModel.isBanVoiceAndProps()){
            this.btn_yuyin.setVisible(false);
            //this.btn_dipai.setPositionX(cc.winSize.width - 100);
            //this.btn_card_record.setPositionX(cc.winSize.width - 100);
        }
    },

    addRoomLayer:function(){

        this.addChild(this.playerLayer = new YYBSPlayerLayer(),2);
        this.addChild(this.cardLayer = new YYBSCardLayer(),1);
        this.addChild(this.optBtnLayer = new YYBSOptBtnLayer(),10);
        this.addChild(this.jiaoFenBtnLayer = new YYBSJiaoFenBtnLayer(),9);
        this.addChild(this.selectZhuLayer = new YYBSSelectZhuLayer(),11);

    },

    addRoomBtn:function(){
        var isQyqRoom = YYBSRoomModel.tableType == 1;

        var img_wx = "res/res_gameCom/Z_wechatInvitation.png";
        if(isQyqRoom)img_wx = "res/res_gameCom/Z_wechatInvitation.png";
        var img_qyq = "res/res_gameCom/qyqInvite.png";
        var img_back = "res/res_gameCom/backHall.png";

        this.roomBtnContent = new cc.Node();
        this.roomBtnContent.setPosition(cc.winSize.width/2,cc.winSize.height/2 - 45);
        this.addChild(this.roomBtnContent);

        var btnArr = [];

        this.btn_invite_wx = new ccui.Button(img_wx,img_wx);
        this.roomBtnContent.addChild(this.btn_invite_wx);
        btnArr.push(this.btn_invite_wx);

        if(isQyqRoom){
            if(ClickClubModel.getIsForbidInvite()){
                if(YYBSRoomModel.privateRoom == 1){
                    img_qyq = "res/ui/bjdmj/haoyouyaoqing.png";
                }
                this.btn_invite_qyq = new ccui.Button(img_qyq,img_qyq);
                this.roomBtnContent.addChild(this.btn_invite_qyq);
                btnArr.push(this.btn_invite_qyq);
            }

            this.btn_qyq_back = new ccui.Button(img_back,img_back);
            this.roomBtnContent.addChild(this.btn_qyq_back);
            btnArr.push(this.btn_qyq_back);
        }

        var offsetX = 350;
        var startX = -(btnArr.length - 1)/2 * offsetX;
        for(var i = 0;i<btnArr.length;++i){
            btnArr[i].setPosition(startX + offsetX*i,0);
            btnArr[i].addTouchEventListener(this.onClickBtn,this);
        }

        var img_ready = "res/res_gameCom/Z_zhunbei2.png";
        this.btn_ready = new ccui.Button(img_ready,img_ready);
        this.btn_ready.setPosition(cc.winSize.width/2,225);
        this.addChild(this.btn_ready);
        this.btn_ready.addTouchEventListener(this.onClickBtn,this);

        var img_tuichu = "res/res_gameCom/room_tuichu.png";
        this.btn_tuichu = new ccui.Button(img_tuichu,img_tuichu);
        this.btn_tuichu.setPosition(cc.winSize.width/2,cc.winSize.height/2 - 45);
        this.addChild(this.btn_tuichu);
        this.btn_tuichu.addTouchEventListener(this.onClickBtn,this);
        this.btn_tuichu.visible = !YYBSRoomModel.replay;
        //this.roomBtnContent.setVisible(false);

        //this.btn_invite_wx.setEnabled(false);
        this.btn_invite_wx.opacity = 0;
    },

    updateQyqButton:function(hasTuichu){
        if(!hasTuichu){
            this.btn_tuichu.visible = false;
            if(this.btn_qyq_back){
                if(this.btn_invite_qyq){
                    //this.btn_invite_wx.x = -350;
                    this.btn_invite_qyq.x = -350;
                    this.btn_qyq_back.x = 350;
                }else{
                    //this.btn_invite_wx.x = -350;
                    this.btn_qyq_back.x = 0;
                }
            }else{
                //this.btn_invite_wx.x = 0;
            }
        }else{
            if(this.btn_qyq_back){
                if(this.btn_invite_qyq){
                    //this.btn_invite_wx.x = -450;
                    this.btn_invite_qyq.x = -350;
                    this.btn_qyq_back.x = 0;
                    this.btn_tuichu.x = cc.winSize.width/2 + 350;
                }else{
                    //this.btn_invite_wx.x = -350;
                    this.btn_qyq_back.x = -350;
                    this.btn_tuichu.x = cc.winSize.width/2 + 350;
                }
            }else{
                //this.btn_invite_wx.x = -350;
                this.btn_tuichu.x = cc.winSize.width/2;// + 350;
            }
        }
    },

    addYuyinRecored:function(){
        this.yuyinBg = new cc.Scale9Sprite("res/res_yybs/img_40.png");
        this.yuyinBg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.yuyinBg.setContentSize(500,300);
        this.addChild(this.yuyinBg,100);

        var img1 = new cc.Sprite("res/res_yybs/img_39.png");
        img1.setPosition(this.yuyinBg.width/2,this.yuyinBg.height/2 + 35);
        this.yuyinBg.addChild(img1);

        var progressBg = new cc.Sprite("res/res_yybs/img_audio_1.png");
        progressBg.setPosition(this.yuyinBg.width/2,this.yuyinBg.height/2 + 35);
        this.yuyinBg.addChild(progressBg);

        var tipLabel = UICtor.cLabel("手指上滑取消发送",42);
        tipLabel.setPosition(this.yuyinBg.width/2,45);
        this.yuyinBg.addChild(tipLabel);

        this.addCustomEvent(SyEvent.USER_AUDIO_READY,this,this.onRadioReady);
        this.progCycle = new cc.ProgressTimer(new cc.Sprite("res/res_yybs/img_audio_2.png"));
        this.progCycle.x = progressBg.width/2;
        this.progCycle.y = progressBg.height/2;
        this.progCycle.setPercentage(0);
        progressBg.addChild(this.progCycle,1);
        this.recordBtn = new RecordAudioButton(this.yuyinBg,this.progCycle,"res/res_gameCom/voiceNormal.png","res/res_gameCom/voiceNormal.png");
        this.recordBtn.x = this.btn_yuyin.width/2;
        this.recordBtn.y = this.btn_yuyin.height/2;
        this.btn_yuyin.addChild(this.recordBtn,1);
        this.btn_yuyin.setOpacity(0);
        this.recordBtn.setOpacity(150);
        this.recordBtn.setBright(IMSdkUtil.isReady());

        this.yuyinBg.setVisible(false);
    },

    /**
     * sdk调用，当语音使用状态改变
     */
    onRadioReady:function(event){
        var useful = event.getUserData();
        this.recordBtn.setBright(useful);
    },

    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            if(sender == this.btn_invite_wx){
                this.onInvite();
            }else if(sender == this.btn_invite_qyq){
                var inviteType = 0
                if(YYBSRoomModel.privateRoom == 1) inviteType = 2
                var pop = new PyqInviteListPop(inviteType);
                this.addChild(pop);
            }else if(sender == this.btn_qyq_back){
                var pop = new PyqHall();
                pop.setBackBtnType(2);
                PopupManager.addPopup(pop);
            }else if(sender == this.btn_card_record){
                var layer = new YYBSCardRecordLayer();
                this.addChild(layer,20);
            }else if(sender == this.btn_chat){
                var pop = new ChatPop();
                PopupManager.addPopup(pop);
            }else if(sender == this.btn_ready){
                sySocket.sendComReqMsg(4);
            }else if(sender == this.btn_tuichu){
                sySocket.sendComReqMsg(6);
            }


        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    onClickDipai:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);


            var num = YYBSRoomModel.getDiPaiNum();
            var cards = [];
            for(var i = 0;i<num;++i)cards.push(0);

            if(YYBSRoomModel.replay){

                if(YYBSRoomModel.remain < 4){
                    cards = YYBSReplayMgr.diPaiArr1;
                }else{
                    cards = YYBSReplayMgr.diPaiArr2;
                }

            }else{
                var p = YYBSRoomModel.getPlayerDataByItem("seat",YYBSRoomModel.mySeat);
                if(p && p.moldIds.length > 0){
                    cards = p.moldIds;
                }
            }

            this.showDipai(true,cards);

        }else if(type == ccui.Widget.TOUCH_ENDED || type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
            this.showDipai(false);
        }
    },

    showDipai:function(isShow,data){
        var bg = this.getChildByName("dipai_bg");
        if(isShow){
            var offsetX = 140;
            if(!bg){
                bg = new cc.Scale9Sprite("res/res_yybs/dipaiBg.png");
                bg.setContentSize(data.length * offsetX + 60,225);
                bg.setPosition(cc.winSize.width/2,700);
                bg.setName("dipai_bg");
                this.addChild(bg,5);
            }
            bg.setVisible(true);

            bg.removeAllChildren(true);
            for(var i = 0;i<data.length;++i){
                var card = new YYBSCard(data[i]);
                card.setScale(0.6);
                card.setPosition(bg.width/2-(data.length -1)/2*offsetX + offsetX*i,bg.height/2);
                bg.addChild(card,1);
            }

        }else{
            bg && bg.setVisible(false);
        }
    },

    showDefenPai:function(type,data){
        if(type == 0 || type == 1){
            this.listview_defen.removeAllChildren();
        }

        if(type == 1 || type == 2){
            for(var i = 0;i<data.length;++i){
                var card = new ccui.ImageView("res/pkCommon/smallCard/s_card_" + data[i] + ".png");
                card.ignoreContentAdaptWithSize(false);
                card.setContentSize(card.width*0.45,card.height*0.45);
                this.listview_defen.pushBackCustomItem(card);
            }
        }

        this.listview_defen.jumpToRight();
    },

    showKoudi:function(data){
        var node = this.getChildByName("koudi_node");
        node && node.removeFromParent(true);

        if(!data)return;

        node = new cc.Node();
        node.setName("koudi_node");
        node.setPosition(cc.winSize.width/2,700);
        this.addChild(node,20);

        var label = UICtor.cLabel("抠底",60);
        label.setPosition(0,170);
        label.setColor(cc.color.YELLOW);
        node.addChild(label,1);

        var offsetX = 140;
        var bg = new cc.Scale9Sprite("res/res_yybs/dipaiBg.png");
        bg.setContentSize(data.length * offsetX + 60, 225);
        node.addChild(bg);


        for(var i = 0;i<data.length;++i){
            var card = new YYBSCard(data[i]);
            card.setScale(0.6);
            card.setColor(cc.color(80,80,80));
            card.setPosition(bg.width/2,bg.height/2);
            bg.addChild(card,1);

            if(YYBSRoomModel.isFenPai(data[i])){
                card.setColor(cc.color.WHITE);
            }
            var action = cc.moveTo(0.3,bg.width/2-(data.length -1)/2*offsetX + offsetX*i,bg.height/2);
            card.runAction(action);
        }

        YYBSRoomModel.pauseMsg();

        setTimeout(function(){
            YYBSRoomModel.removeOnePause();
        },3000);

    },

    /**
     * 邀请
     */
    onInvite:function(){
        var wanfa = "益阳巴十";
        var queZi = YYBSRoomModel.renshu + "缺"+(YYBSRoomModel.renshu - YYBSRoomModel.players.length);
        var obj={};
        obj.tableId=YYBSRoomModel.tableId;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_URL+'?num='+YYBSRoomModel.tableId+'&userName='+encodeURIComponent(PlayerModel.name);
        obj.title=wanfa+'  房号['+YYBSRoomModel.tableId+"] "+queZi;

        var youxiName = "益阳巴十";
        if(YYBSRoomModel.tableType == 1){
            youxiName = "[亲友圈]益阳巴十"
        }
        obj.description=csvhelper.strFormat("{0} {1}局",youxiName,YYBSRoomModel.totalBurCount);
        obj.shareType=1;
        //SdkUtil.sdkFeed(obj);
        ShareDTPop.show(obj);
    },

    getName:function(){
        return "YYBS_ROOM";
    },

    update:function(){
        if(YYBSRoomModel.pauseValue == 0 && this.tableMsgArr.length > 0){
            var event = this.tableMsgArr.shift();
            this.handleTableData(event.eventType,event.getUserData());
        }
    },

    onGetTableData:function(event){
        this.tableMsgArr.push(event);
    },

    handleTableData:function(type,data){
        var date = new Date();
        cc.log("=============handleTableData=============",type,date.getSeconds(),date.getMilliseconds());
        var state = YYBSRoomModel.handleTableData(type,data);
        if(!state)return;

        if(type == YYBSTabelType.CreateTable){
            this.tableMsgArr = [];
            sy.scene.hideLoading();
            this.updateRoomInfo();
            this.updateRoomBtnState(data);
            this.updateReadyBtnState();
            this.updateRoomTip();
            this.updateDiPaiBtnState();
            this.updateRecordBtnState();
            this.showKoudi(false);
            this.setRuleTip();

            if(YYBSRoomModel.nowBurCount == 1
                && YYBSRoomModel.remain == 0 && !this.isShowGps){
                this.isShowGps = true;
                this.onClickGpsBtn();
            }

            var message = {closingPlayers:[{userId:"120004",name:"lx1234",leftCardNum:0,point:-2,totalPoint:-2,boom:0,winCount:null,lostCount:null,
                maxPoint:null,totalBoom:null,cards:[],seat:1,sex:1,icon:"",isHu:null,actionCounts:[],gangIds:[],dahus:[],xiaohus:[],
                ext:[1,0,1,0,0,0,0,0,0,-200,0,-1],gold:null,credit:null,winLoseCredit:-200,commissionCredit:0,goldFlag:null},
                {userId:"120073",name:"lx7788",leftCardNum:0,point:2,totalPoint:2,boom:0,winCount:null,lostCount:null,maxPoint:null,
                    totalBoom:null,cards:[],seat:2,sex:1,icon:"http://thirdwx.qlogo.cn/mmopen/vi_32/Dv2csZTBP5wJupj6zKibIuaaZkwphVDBX012k4btO0wticrvROE4UhYkxAsF0hETSXgibtLgTFxu2DSNRzkDTsEFw/132",
                    isHu:null,actionCounts:[],gangIds:[],dahus:[],xiaohus:[],ext:[2,1,0,0,0,0,0,0,0,200,0,-1],gold:null,
                    credit:null,winLoseCredit:200,commissionCredit:0,goldFlag:null},{userId:"120052",name:"lx5566",leftCardNum:0,point:-2,
                    totalPoint:-2,boom:0,winCount:null,lostCount:null,maxPoint:null,totalBoom:null,cards:[],seat:3,sex:1,icon:"",isHu:null,
                    actionCounts:[],gangIds:[],dahus:[],xiaohus:[],ext:[1,0,1,0,0,0,0,0,0,-200,0,-1],gold:null,credit:null,
                    winLoseCredit:-200,commissionCredit:0,goldFlag:null},{userId:"120098",name:"lx44551",leftCardNum:0,point:2,totalPoint:2,
                    boom:1,winCount:null,lostCount:null,maxPoint:null,totalBoom:null,cards:[],seat:4,sex:1,
                    icon:"http://cdncfgh5.52bjd.com/upload/player/1060/120098_1592632713.png",isHu:null,actionCounts:[],gangIds:[],dahus:[],
                    xiaohus:[],ext:[2,1,0,0,0,0,0,0,0,200,0,-1],gold:null,credit:null,winLoseCredit:200,commissionCredit:0,
                    goldFlag:null}],bird:[],birdSeat:[],isBreak:0,wanfa:257,ext:[725773,120052,"2020-12-12 16:31:46",257,1,1,0,1,0,
                3,1,0,3071,1,10000,100,100,500,1,1,0,0,1,20,0,0,0],matchExt:[],cutCard:[],cutDtzCard:[],
                groupLogId:null,intParams:[]};

            //ClosingInfoModel.init(message);
            //var layer = new YYBSBigResultLayer(message);
            //PopupManager.addPopup(layer);
        }else if(type == YYBSTabelType.JoinTable){
            this.updateRoomBtnState();

            this.onClickGpsBtn();

        }else if(type == YYBSTabelType.ExitTable){
            this.updateRoomBtnState();
        }else if(type == YYBSTabelType.ChangeState){
            this.updateReadyBtnState();
        }else if(type == YYBSTabelType.DealCard){
            this.updateRoomTip();
            this.updateDiPaiBtnState();
            this.showKoudi(false);
            this.updateQyqButton(false);
        }else if(type == YYBSTabelType.JiaoFen){

            this.label_jiaofen.setString(YYBSRoomModel.ext[19] || 0);

        }else if(type == YYBSTabelType.DingZhuang){
            this.updateRoomTip();
        }else if(type == YYBSTabelType.XuanZhu){
            this.updateRoomInfo();
            this.updateRoomTip();
        }else if(type == YYBSTabelType.PlayCard){
            this.updateRoomTip();
            this.showDefenPai(2,data.scoreCard || []);
            this.label_defen.setString(YYBSRoomModel.ext[5] || 0);

            if(data.cardType == 100){//埋牌刷新底牌按钮
                this.updateDiPaiBtnState();
            }
            if(data.cardType == 200){//抠底显示底牌
                this.showKoudi(data.cardIds);
            }

        }else if(type == YYBSTabelType.OnOver){
            var SmallResultLayer = YYBSRoomModel.getSamllResultLayer();
            //var BigResultLayer = YYBSRoomModel.getBigResultLayer();
            if(data.isBreak){
                //PopupManager.removeAll();
                //var layer = new BigResultLayer(data);
                //PopupManager.addPopup(layer);
            }else{
                var layer = new SmallResultLayer(data);
                PopupManager.addPopup(layer);
            }
        }else if(type == YYBSTabelType.TouXiang){
            this.onTouXiang(data);
        }


        this.playerLayer.handleTableData(type,data);
        this.cardLayer.handleTableData(type,data);
        this.optBtnLayer.handleTableData(type,data);
        this.jiaoFenBtnLayer.handleTableData(type,data);
        this.selectZhuLayer.handleTableData(type,data);

        this.soundHandle.handleTableData(type,data);

    },

    setRuleTip:function(){
        var str = ClubRecallDetailModel.getYYBSWanfa(YYBSRoomModel.intParams,true);
        this.label_rule_tip.setString(str);
    },

    updateRoomInfo:function(){
        this.label_room_id.setString("房号:" + YYBSRoomModel.tableId);
        this.label_jushu.setString("局数:" + YYBSRoomModel.nowBurCount + "/" + YYBSRoomModel.totalBurCount);
        this.label_room_name.setString(YYBSRoomModel.roomName || "益阳巴十");

        var zhuStr = ["无主","方块","梅花","红桃","黑桃"];
        this.label_zhu.setString(zhuStr[YYBSRoomModel.ext[2]] || "");
        this.label_jiaofen.setString(YYBSRoomModel.ext[19] || 0);
        this.label_defen.setString(YYBSRoomModel.ext[5] || 0);
        this.showDefenPai(1,YYBSRoomModel.scoreCard || []);
    },

    updateDiPaiBtnState:function(){
        var canClick = (YYBSRoomModel.remain == 4 && YYBSRoomModel.banker == YYBSRoomModel.mySeat);

        if(YYBSRoomModel.replay){
            canClick = true;
            this.btn_dipai.setLocalZOrder(101);
        }


        this.btn_dipai.setBright(canClick);
        this.btn_dipai.setTouchEnabled(canClick);
    },

    updateRecordBtnState:function(){
        var canClick = true;

        //未开启允许查牌
        if(!YYBSRoomModel.intParams[5])canClick = false;


        this.btn_card_record.setBright(canClick);
        this.btn_card_record.setTouchEnabled(canClick);
    },

    updateRoomBtnState:function(data){
        this.roomBtnContent.setVisible(YYBSRoomModel.players.length < YYBSRoomModel.renshu);

        if(this.roomBtnContent.visible == false){
            this.btn_tuichu.x = cc.winSize.width/2;
        }else{
            this.updateQyqButton(true);
        }

        if(data){
            var players = data.players || [];
            var isStart = false;
            for(var i = 0;i < players.length;++i){
                if(players[i] && players[i].handCardIds.length > 0){
                    isStart = true;
                    break;
                }
            }
            if((YYBSRoomModel.tableType != 1 && data.masterId == PlayerModel.userId) || isStart || YYBSRoomModel.nowBurCount > 1){
                this.updateQyqButton(false);
            }
        }
    },

    updateReadyBtnState:function(){
        var isShowReadyBtn = false;
        var players = YYBSRoomModel.players;
        for(var i = 0;i<players.length;++i){
            if(players[i].userId == PlayerModel.userId && players[i].status == 0){
                isShowReadyBtn = true;
            }
        }
        this.btn_ready.setVisible(isShowReadyBtn);
    },

    updateRoomTip:function(){
        var img = "";
        if(YYBSRoomModel.nextSeat != YYBSRoomModel.mySeat){
            if(YYBSRoomModel.remain == 1 && YYBSRoomModel.qzCards.length > 0)img = "res/res_yybs/txt_wait_fz.png";
            if(YYBSRoomModel.remain == 2)img = "res/res_yybs/other_xuanzhu.png";
            if(YYBSRoomModel.remain == 3)img = "res/res_yybs/other_maipai.png";
        }

        if(img){
            this.spr_tip.setVisible(true);
            this.spr_tip.initWithFile(img);
        }else{
            this.spr_tip.setVisible(false);
        }
    },
});