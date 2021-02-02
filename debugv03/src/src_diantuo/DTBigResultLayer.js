///**
// * Created by cyp on 2019/10/21.
// */
//var DTBigResultLayer = cc.Layer.extend({
//    ctor:function(msgData){
//        this._super();
//
//        SyEventManager.addEventListener(SyEvent.SOCKET_OPENED,this,this.onSuc);
//        SyEventManager.addEventListener(SyEvent.GET_SERVER_SUC,this,this.onChooseCallBack);
//        SyEventManager.addEventListener(SyEvent.NOGET_SERVER_ERR,this,this.onChooseCallBack);
//
//        this.msgData = msgData;
//
//        cc.eventManager.addListener(cc.EventListener.create({
//            event: cc.EventListener.TOUCH_ONE_BY_ONE,
//            swallowTouches: true,
//            onTouchBegan:function(touch,event){
//                return true;
//            }
//        }), this);
//
//        this.initLayer();
//        this.setLayerWithData();
//    },
//
//    setLayerWithData:function(){
//        if(!this.msgData)return;
//
//        this.setInfoData();
//
//        var players = this.msgData.closingPlayers || [];
//
//        this.addResultItem(players);
//
//        this.label_credit_config.setString(DTRoomModel.getCreditConfigStr());
//
//        if(DTRoomModel.isClubGoldRoom()){
//            this.label_credit_config.setString(DTRoomModel.getClubGlodCfg());
//        }
//
//        if(DTRoomModel.tableType != 1){
//            this.btn_start_another.setVisible(false);
//            this.btn_share.setPosition(this.btn_start_another.getPosition());
//            this.label_qyq_id.setString("");
//        }else{
//            this.label_qyq_id.setString("亲友苑ID:" + this.msgData.ext[12]);
//        }
//
//    },
//
//    initLayer:function(){
//        var grayLayer = new cc.LayerColor(cc.color.BLACK);
//        grayLayer.setOpacity(210);
//        this.addChild(grayLayer);
//
//        var img_title = new cc.Sprite("res/res_diantuo/paijiujiesuan.png");
//        img_title.setPosition(cc.winSize.width/2,cc.winSize.height - 105);
//        this.addChild(img_title);
//
//        this.label_info = UICtor.cLabel("2019-9-10 10:35   牌桌号:123456   局数:10/20",38);
//        this.label_info.setColor(cc.color(254,233,95));
//        this.label_info.setPosition(cc.winSize.width/2,cc.winSize.height - 210);
//        this.addChild(this.label_info);
//
//        this.label_credit_config = UICtor.cLabel("底分:10\n奖赏分:2%\n奖赏方式:大赢家\n奖赏类型:比例奖赏",38);
//        this.label_credit_config.setPosition(cc.winSize.width - 225,cc.winSize.height - 120);
//        this.label_credit_config.setColor(cc.color(254,233,95));
//        this.addChild(this.label_credit_config);
//
//        this.label_qyq_id = UICtor.cLabel("亲友苑ID:123456",38);
//        this.label_qyq_id.setAnchorPoint(0,0.5);
//        this.label_qyq_id.setPosition(225,cc.winSize.height - 120);
//        this.label_qyq_id.setColor(cc.color(254,233,95));
//        this.addChild(this.label_qyq_id);
//
//        this.btn_share = new ccui.Button("res/ui/bjdmj/btn_share_zhanji.png","res/ui/bjdmj/btn_share_zhanji.png");
//        this.btn_share.setPosition(cc.winSize.width/2,90);
//        this.addChild(this.btn_share);
//        this.btn_share.addTouchEventListener(this.onClickBtn,this);
//
//        this.btn_to_hall = new ccui.Button("res/ui/bjdmj/btn_return_hall.png","res/ui/bjdmj/btn_return_hall.png");
//        this.btn_to_hall.setPosition(cc.winSize.width/2 - 450,90);
//        this.addChild(this.btn_to_hall);
//        this.btn_to_hall.addTouchEventListener(this.onClickBtn,this);
//
//        this.btn_start_another = new ccui.Button("res/ui/bjdmj/btn_start_another.png","res/ui/bjdmj/btn_start_another.png");
//        this.btn_start_another.setPosition(cc.winSize.width/2 + 450,90);
//        this.addChild(this.btn_start_another);
//        this.btn_start_another.addTouchEventListener(this.onClickBtn,this);
//    },
//
//    addResultItem:function(players){
//        var itemWdith = 465;
//        var startX = cc.winSize.width/2 - 1.5*itemWdith;
//
//        var maxPoint = 0;
//        for(var i = 0;i<players.length;++i){
//            if(players[i].totalPoint > maxPoint){
//                maxPoint = players[i].totalPoint;
//            }
//        }
//
//        for(var i = 0;i<players.length;++i){
//            var item = new DTBigResultItem();
//            item.setPosition(startX + i*itemWdith,cc.winSize.height/2 - 30);
//            var isFangZhu = (players[i].userId == this.msgData.ext[1]);
//            var isDyj = (maxPoint > 0 && players[i].totalPoint == maxPoint);
//            item.setItemWithData(players[i],isFangZhu,isDyj);
//            this.addChild(item);
//        }
//    },
//
//    setInfoData:function(){
//        var date = new Date();
//        var year = date.getFullYear();
//        var month = date.getMonth() + 1;
//        var day = date.getDate();
//
//        var hour = date.getHours();
//        var min = date.getMinutes();
//
//        if(month < 10)month = "0" + month;
//        if(day < 10)day = "0" + day;
//        if(hour < 10)hour = "0" + hour;
//        if(min < 10)min = "0" + min;
//
//        var time = year + "-" + month + "-" + day + " " + hour + ":" + min;
//        var table = "牌桌号:" + DTRoomModel.tableId;
//        var jushu = "局数:" + DTRoomModel.nowBurCount;
//        if(DTRoomModel.totalBurCount < 100){
//            jushu += ("/" + DTRoomModel.totalBurCount);
//        }
//
//        this.label_info.setString(time + "  " + table + "  " + jushu);
//
//    },
//
//    onClickBtn:function(sender,type){
//        if(type == ccui.Widget.TOUCH_BEGAN){
//            sender.setColor(cc.color.GRAY);
//        }else if(type == ccui.Widget.TOUCH_ENDED){
//            sender.setColor(cc.color.WHITE);
//
//            if(sender == this.btn_to_hall){
//                LayerManager.showLayer(LayerFactory.HOME);
//                PopupManager.removeAll();
//
//                if(DTRoomModel.tableType ==1){
//                    var pop = new PyqHall();
//                    PopupManager.addPopup(pop);
//                }
//            }else if(sender == this.btn_share){
//                this.onShare();
//            }else if(sender == this.btn_start_another){
//                this.qyqStartAnother();
//            }
//
//        }else if(type == ccui.Widget.TOUCH_CANCELED){
//            sender.setColor(cc.color.WHITE);
//        }
//    },
//
//    //再来一局
//    qyqStartAnother:function(){
//        var wanfa = DTRoomModel.wanfa;
//        var groupId = this.msgData.ext[12];
//        var modeId = 0;
//
//        var clubLocalList = UITools.getLocalJsonItem("Club_Local_Data");
//        for(var j = 0 ; j < clubLocalList.length; j++){
//            if (groupId == clubLocalList[j].clickId){
//                modeId = clubLocalList[j].bagModeId;
//            }
//        }
//        cc.log("============qyqStartAnother============",groupId,modeId);
//        if(groupId > 0 && modeId > 0){
//            this.clickStartAnother = true;
//            this.groupId = groupId;
//            this.modeId = modeId;
//            sySocket.sendComReqMsg(29 , [parseInt(wanfa)] , ["0",modeId+"",groupId+""]);
//        }else{
//            FloatLabelUtil.comText("未找到对应包厢ID,请返回大厅");
//        }
//    },
//
//    onChooseCallBack:function(event){
//        var status = event.getUserData();
//        if(status == ServerUtil.GET_SERVER_ERROR){
//            sy.scene.hideLoading();
//            FloatLabelUtil.comText("切服失败");
//        }else if(status == ServerUtil.NO_NEED_CHANGE_SOCKET){
//            this.onSuc();
//        }
//    },
//
//    onSuc:function(){
//        sy.scene.hideLoading();
//        if(this.clickStartAnother){
//            this.clickStartAnother = false;
//            if (PlayerModel.clubTableId == 0){
//                sySocket.sendComReqMsg(1, [],[this.groupId+"",1 + "","1",this.modeId+""]);
//            }else{
//                sySocket.sendComReqMsg(2,[parseInt(PlayerModel.clubTableId),1,1,0,Number(this.groupId)],[this.modeId+""]);
//            }
//        }
//    },
//
//    /**
//     * 分享战报
//     */
//    onShare:function(){
//        var winSize = cc.director.getWinSize();
//        var texture = new cc.RenderTexture(winSize.width, winSize.height);
//        if (!texture)
//            return;
//        texture.anchorX = 0;
//        texture.anchorY = 0;
//        texture.begin();
//        this.visit();
//        texture.end();
//        texture.saveToFile("share_pdk.jpg", cc.IMAGE_FORMAT_JPEG, false);
//        var obj={};
//        var tableId = DTRoomModel.tableId;
//        obj.tableId=tableId;
//        obj.userName=PlayerModel.username;
//        obj.callURL=SdkUtil.SHARE_URL+'?num='+tableId+'&userId='+encodeURIComponent(PlayerModel.userId);
//        obj.title="掂坨结算";
//        obj.description="房间号:" + tableId;
//        obj.shareType=0;
//        sy.scene.showLoading("正在截取屏幕");
//        setTimeout(function(){
//            sy.scene.hideLoading();
//            //SharePop.show(obj);
//            ShareDTPop.show(obj);
//        },500);
//    },
//
//    onClose : function(){
//    },
//    onOpen : function(){
//    },
//    onDealClose:function(){
//    },
//});
//
//var DTBigResultItem = cc.Node.extend({
//    ctor:function(){
//        this._super();
//
//        this.initNode();
//    },
//
//    initNode:function(){
//        var img = "res/res_diantuo/score_di.png";
//        this.nodeBg = new cc.Scale9Sprite(img);
//        this.nodeBg.setContentSize(450,675);
//        this.nodeBg.setColor(cc.color(150,150,200));
//        this.addChild(this.nodeBg);
//
//        this.headBg = new cc.Sprite("res/res_diantuo/touxiangkuang.png");
//        this.headBg.setPosition(this.nodeBg.width/2,this.nodeBg.height - 90);
//        this.nodeBg.addChild(this.headBg);
//
//        this.icon_fangzhu = new cc.Sprite("res/res_diantuo/fangzhu.png");
//        this.icon_fangzhu.setPosition(this.headBg.x + 38,this.headBg.y + 60);
//        this.nodeBg.addChild(this.icon_fangzhu,2);
//
//        var sten=new cc.Sprite("res/res_diantuo/touxiangkuang.png");
//        var clipnode = new cc.ClippingNode();
//        clipnode.setStencil(sten);
//        clipnode.setAlphaThreshold(0.8);
//        this.iconSpr = new cc.Sprite("res/ui/common/default_m.png");
//        this.iconSpr.setScale(120/this.iconSpr.width);
//        clipnode.addChild(this.iconSpr);
//        clipnode.setPosition(this.headBg.width/2,this.headBg.height/2);
//        this.headBg.addChild(clipnode,1);
//
//        this.label_name = UICtor.cLabel("玩家的名字",38);
//        this.label_name.setTextAreaSize(cc.size(300,40));
//        this.label_name.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
//        this.label_name.setPosition(this.headBg.x,this.headBg.y - 90);
//        this.nodeBg.addChild(this.label_name);
//
//        this.label_id = UICtor.cLabel("ID:1234567",38);
//        this.label_id.setPosition(this.label_name.x,this.label_name.y - 45);
//        this.nodeBg.addChild(this.label_id);
//
//        this.icon_dyj = new cc.Sprite("res/res_diantuo/icon_dyj.png");
//        this.icon_dyj.setPosition(this.nodeBg.width - 45,this.nodeBg.height - 65);
//        this.nodeBg.addChild(this.icon_dyj);
//
//        var config = ["炸弹次数:","五十K个数:"];
//        this.labelArr1 = [];
//        for(var i = 0;i<config.length;++i){
//            var txt = UICtor.cLabel(config[i],42);
//            txt.setColor(cc.color.BLACK);
//            txt.setAnchorPoint(0,0.5);
//            txt.setPosition(45,this.nodeBg.height/2 + 45 - i*60);
//            this.nodeBg.addChild(txt);
//
//            var label_num = UICtor.cLabel("0",42);
//            label_num.setPosition(txt.x + 300,txt.y);
//            label_num.setColor(cc.color.RED);
//            this.nodeBg.addChild(label_num);
//            this.labelArr1.push(label_num);
//        }
//    },
//
//    addScoreItem:function(scoreArr){
//        if(scoreArr.length <= 0)return;
//
//        var config1 = ["总分:","喜分:","积分:","赛分:"];
//
//        var offsetY = 240/scoreArr.length;
//        var startY = 150 + (scoreArr.length - 1)/2*offsetY;
//
//        for(var i = 0;i<scoreArr.length;++i){
//            var txt = UICtor.cLabel(config1[i],48);
//            //txt.setColor(cc.color.YELLOW);
//            txt.setAnchorPoint(0,0.5);
//            txt.setPosition(45,startY - i*offsetY);
//            this.nodeBg.addChild(txt);
//
//            var label_num = UICtor.cLabel("10",48);
//            label_num.setPosition(txt.x + 300,txt.y);
//            //label_num.setColor(cc.color(252,193,50));
//            this.nodeBg.addChild(label_num);
//
//            if(i == 2){
//                txt.setColor(cc.color.YELLOW);
//                txt.setFontSize(60);
//                label_num.setFontSize(60);
//                txt.y -= 15;
//                label_num.y = txt.y;
//            }
//            if(i == 3){
//                txt.y -= 30;
//                label_num.y = txt.y;
//
//                txt.visible = false;
//
//                var img = "res/res_diantuo/icon_sai.png";
//
//                if(DTRoomModel.isClubGoldRoom()){
//                    img = "res/res_gold/goldPyqHall/img_13.png";
//                }
//
//                var icon = new cc.Sprite(img);
//                icon.setPosition(txt.x + 45,txt.y);
//                this.nodeBg.addChild(icon);
//            }
//
//            this.setNumLabel(label_num,scoreArr[i]);
//        }
//    },
//
//    setItemWithData:function(data,isFangZhu,isDyj){
//
//        this.label_name.setString(data.name);
//        this.label_id.setString("ID:" + data.userId);
//        this.icon_fangzhu.setVisible(isFangZhu);
//        this.icon_dyj.setVisible(isDyj);
//
//        this.labelArr1[0].setString(data.actionCounts[1] || 0);//炸弹次数
//        this.labelArr1[1].setString(data.actionCounts[2] || 0);//五十K个数
//
//        var scoreArr = [];
//        scoreArr.push(data.ext[5] || 0);//游戏总分
//        scoreArr.push(data.actionCounts[0] || 0);//喜分
//        scoreArr.push(data.totalPoint || 0);//积分
//
//        if(DTRoomModel.isCreditRoom()){
//            var credit = data.winLoseCredit;
//            credit = MathUtil.toDecimal(credit/100);
//            scoreArr.push(credit);//赛分
//        }else if(DTRoomModel.isClubGoldRoom()){
//            var credit = data.winLoseCredit;
//            scoreArr.push(credit || 0);
//        }
//        this.addScoreItem(scoreArr);
//
//        this.showIcon(data.icon);
//    },
//
//    setNumLabel:function(label,num,str){
//        var color = cc.color(125,197,246);
//        if(num > 0){
//            num = "+" + num;
//            color = cc.color(252,193,50);
//        }
//
//        if(str) num = str + num;
//
//        label.setString(num);
//        label.setColor(color);
//    },
//
//    showIcon: function (iconUrl, sex) {
//        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
//        var sex = sex || 1;
//        var defaultimg = (sex == 1) ? "res/ui/common/default_m.png" : "res/ui/common/default_m.png";
//
//        if (iconUrl) {
//            var self = this;
//            cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
//                if (!error) {
//                    self.iconSpr.setTexture(img);
//                    self.iconSpr.setScale(120/self.iconSpr.width);
//                }
//            });
//        }else{
//            this.iconSpr.initWithFile(defaultimg);
//        }
//    },
//
//});

var DTBigResultLayer = PKBigResultPop.extend({
    user:null,
    ctor: function (data,isDaiKai) {
        this.data = data.closingPlayers || [];
        this.isDaiKai = isDaiKai || false;
        var path = "res/bigResultPop.json";
        if(this.data.length == 2){
            path = "res/bigResultPopTwo.json";
        }
        this._super(path);
    },

    onToHome:function(){
        LayerManager.showLayer(LayerFactory.HOME);
        PopupManager.removeAll();

        if(DTRoomModel.tableType ==1){
            var pop = new PyqHall();
            PopupManager.addPopup(pop);
        }
    },

    refreshSingle:function(widget,user){
        this.user=user;
        var namestr = UITools.truncateLabel(user.name,5);
        ccui.helper.seekWidgetByName(widget,"name").setString(namestr);
        ccui.helper.seekWidgetByName(widget,"id").setString(""+user.userId);

        var pointNode = ccui.helper.seekWidgetByName(widget,"point");
        var pointNode1= ccui.helper.seekWidgetByName(widget,"point1");

        var totalPoint = user.totalPoint;
        if (parseInt(user.totalPoint)>=0){
            pointNode.setString("+" + totalPoint);
            pointNode1.setString("");
        }else{
            pointNode1.setString(totalPoint);
            pointNode.setString("");
        }

        var img_credit = ccui.helper.seekWidgetByName(widget,"Image_totolPoint");
        var label_credit = ccui.helper.seekWidgetByName(widget,"totolPoint");
        var label_credit1 = ccui.helper.seekWidgetByName(widget,"totolPoint1");
        img_credit.setVisible(false);
        if (DTRoomModel.isCreditRoom()){
            var credit = user.winLoseCredit;
            credit = MathUtil.toDecimal(credit/100);
            img_credit.visible = true;
            if (credit >= 0){
                label_credit.setString("+" + credit);
                label_credit1.setString("");
            }else{
                label_credit1.setString(credit);
                label_credit.setString("");
            }
        }else{
            ccui.helper.seekWidgetByName(widget,"Image_point").y -= 40;
        }

        var widgetName = ["Label_title1","Label_title2","Label_title3","Label_title4","Label_title5","Label_title6"];
        var widgetLabel = ["Label_txt1","Label_txt2","Label_txt3","Label_txt4","Label_txt5","Label_txt6"];

        var itemArr = ["炸弹次数","五十K次数","总分","喜分","",""];

        var otherArr = [""+(user.actionCounts[1] || 0),
            ""+(user.actionCounts[2] || 0),
            ""+(user.ext[5] || 0),
            ""+(user.actionCounts[0] || 0),
            "",""];

        for(var i = 0;i<widgetName.length;++i){
            ccui.helper.seekWidgetByName(widget,widgetName[i]).setString(itemArr[i]);
            ccui.helper.seekWidgetByName(widget,widgetLabel[i]).setString(otherArr[i]);
        }

        var icon = ccui.helper.seekWidgetByName(widget,"icon");
        var defaultimg = "res/res_gameCom/bigResult/txd.png";
        if(icon.getChildByTag(345))
            icon.removeChildByTag(345);
        var sprite = new cc.Sprite(defaultimg);
        sprite.x = icon.width / 2;
        sprite.y = icon.height / 2;

        icon.addChild(sprite,5,345);
        // user.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        if(user.icon){
            cc.loader.loadImg(user.icon, {width: 252, height: 252}, function (error, img) {
                if (!error) {
                    sprite.setTexture(img);
                    sprite.x = icon.width / 2;
                    sprite.y = icon.height / 2;
                }
            });
        }
    },

    showMoneyIcon:function(label){
        var icon = new cc.Sprite("res/res_gold/goldPyqHall/img_13.png");
        icon.setAnchorPoint(1,0.5);
        icon.setPosition(label.x - label.width/2*label.scale - 10,label.y);
        label.getParent().addChild(icon);
    },

    selfRender: function () {

        this.addCustomEvent(SyEvent.SOCKET_OPENED,this,this.onSuc);
        this.addCustomEvent(SyEvent.GET_SERVER_SUC,this,this.onChooseCallBack);
        this.addCustomEvent(SyEvent.NOGET_SERVER_ERR,this,this.onChooseCallBack);

        var max = 0;
        var min = 65535;
        for(var i=0;i<this.data.length;i++){
            var d = this.data[i];
            if(d.totalPoint >= max)
                max = d.totalPoint;
            if(d.totalPoint <= min)
                min = d.totalPoint;
        }
        this.maxPoint = max;
        this.minPoint = min;
        for(var i=0;i<this.data.length;i++){
            var d = this.data[i];
            d.dyj = 0;
            if(d.totalPoint == max)
                d.dyj = 1;
            this.refreshSingle(this.getWidget("user"+(i+1)),this.data[i]);

        }

        if(this.data.length == 3){
            this.getWidget("user4").visible = false;
        }

        var shareResult = this.getWidget("shareResult");
        UITools.addClickEvent(shareResult,this,this.onShare);
        var backHall = this.getWidget("backHall");
        UITools.addClickEvent(backHall,this,this.onToHome);


        var continueBtn = this.getWidget("continue");
        UITools.addClickEvent(continueBtn,this,this.qyqStartAnother);

        if (DTRoomModel.roomName){
            var string = "亲友苑ID:" + ClosingInfoModel.ext[12];
            this.getWidget("Label_clubID").setString(string);
        }else{
            this.getWidget("Label_clubID").visible = false;
            continueBtn.setVisible(false);
        }

        //版本号
        if(this.getWidget("Label_version")){
            this.getWidget("Label_version").setString(SyVersion.v);
        }

        if(this.getWidget("Label_time") && ClosingInfoModel.ext[2]){
            this.getWidget("Label_time").setString(ClosingInfoModel.ext[2]);
        }

        //显示部分房间信息
        var wanfaDesc = ClubRecallDetailModel.getSpecificWanfa(DTRoomModel.intParams);

        this.getWidget("Label_wanfa").setString(wanfaDesc);


        var jushuStr = "第" + DTRoomModel.nowBurCount + "/" + DTRoomModel.totalBurCount + "局";
        this.getWidget("Label_jushu").setString(jushuStr);

        this.getWidget("Label_roomnum").setString("房号:" + DTRoomModel.tableId);

        this.getWidget("Label_score").setString("");
        if (DTRoomModel.isCreditRoom()){
            this.getWidget("Label_score").setString(DTRoomModel.getCreditConfigStr());
        }

        if(DTRoomModel.isClubGoldRoom()){
            this.getWidget("Label_score").setString(DTRoomModel.getClubGlodCfg());
        }
    },

    /**
     * 分享战报
     */
    onShare:function(){
        var winSize = cc.director.getWinSize();
        var texture = new cc.RenderTexture(winSize.width, winSize.height);
        if (!texture)
            return;
        texture.anchorX = 0;
        texture.anchorY = 0;
        texture.begin();
        this.visit();
        texture.end();
        texture.saveToFile("share_pdk.jpg", cc.IMAGE_FORMAT_JPEG, false);
        var obj={};
        var tableId = DTRoomModel.tableId;
        obj.tableId=tableId;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_URL+'?num='+tableId+'&userId='+encodeURIComponent(PlayerModel.userId);
        obj.title="掂坨结算";
        obj.description="房间号:" + tableId;
        obj.shareType=0;
        sy.scene.showLoading("正在截取屏幕");
        setTimeout(function(){
            sy.scene.hideLoading();
            //SharePop.show(obj);
            ShareDTPop.show(obj);
        },500);
    },

    getModel:function(){
        return DTRoomModel;
    },

    //再来一局
    qyqStartAnother:function(){
        var wanfa = DTRoomModel.wanfa;
        var groupId = ClosingInfoModel.ext[12];
        var modeId = 0;

        var clubLocalList = UITools.getLocalJsonItem("Club_Local_Data");
        for(var j = 0 ; j < clubLocalList.length; j++){
            if (groupId == clubLocalList[j].clickId){
                modeId = clubLocalList[j].bagModeId;
            }
        }
        cc.log("============qyqStartAnother============",groupId,modeId);
        if(groupId > 0 && modeId > 0){
            this.clickStartAnother = true;
            this.groupId = groupId;
            this.modeId = modeId;
            sySocket.sendComReqMsg(29 , [parseInt(wanfa)] , ["0",modeId+"",groupId+""]);
        }else{
            FloatLabelUtil.comText("未找到对应包厢ID,请返回大厅");
        }
    },

    onChooseCallBack:function(event){
        var status = event.getUserData();
        if(status == ServerUtil.GET_SERVER_ERROR){
            sy.scene.hideLoading();
            FloatLabelUtil.comText("切服失败");
        }else if(status == ServerUtil.NO_NEED_CHANGE_SOCKET){
            this.onSuc();
        }
    },

    onSuc:function(){
        sy.scene.hideLoading();
        if(this.clickStartAnother){
            this.clickStartAnother = false;
            if (PlayerModel.clubTableId == 0){
                sySocket.sendComReqMsg(1, [],[this.groupId+"",1 + "","1",this.modeId+""]);
            }else{
                sySocket.sendComReqMsg(2,[parseInt(PlayerModel.clubTableId),1,1,0,Number(this.groupId)],[this.modeId+""]);
            }
        }
    },
});
