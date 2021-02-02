///**
// * Created by cyp on 2019/9/9.
// */
//
//var YYBSBigResultLayer = cc.Layer.extend({
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
//        this.label_credit_config.setString(YYBSRoomModel.getCreditConfigStr());
//
//        if(YYBSRoomModel.isClubGoldRoom()){
//            this.label_credit_config.setString(YYBSRoomModel.getClubGlodCfg());
//        }
//
//        if(YYBSRoomModel.tableType != 1){
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
//        var img1 = new cc.Sprite("res/res_yybs/jiesuan/dia.png");
//        img1.setAnchorPoint(0.5,1);
//        img1.setPosition(cc.winSize.width/2,cc.winSize.height);
//        this.addChild(img1);
//
//        var img_title = new cc.Sprite("res/res_yybs/jiesuan/paijiujiesuan.png");
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
//        this.btn_back = new ccui.Button("res/res_yybs/jiesuan/back.png","res/res_yybs/jiesuan/back.png");
//        this.btn_back.setPosition(120,cc.winSize.height - 90);
//        this.addChild(this.btn_back);
//        this.btn_back.addTouchEventListener(this.onClickBtn,this);
//
//        this.btn_share = new ccui.Button("res/ui/bjdmj/btn_share_zhanji.png","res/ui/bjdmj/btn_share_zhanji.png");
//        this.btn_share.setPosition(cc.winSize.width/2,80);
//        this.addChild(this.btn_share);
//        this.btn_share.addTouchEventListener(this.onClickBtn,this);
//
//        this.btn_to_hall = new ccui.Button("res/ui/bjdmj/btn_return_hall.png","res/ui/bjdmj/btn_return_hall.png");
//        this.btn_to_hall.setPosition(cc.winSize.width/2 - 450,80);
//        this.addChild(this.btn_to_hall);
//        this.btn_to_hall.addTouchEventListener(this.onClickBtn,this);
//
//        this.btn_start_another = new ccui.Button("res/ui/bjdmj/btn_start_another.png","res/ui/bjdmj/btn_start_another.png");
//        this.btn_start_another.setPosition(cc.winSize.width/2 + 450,80);
//        this.addChild(this.btn_start_another);
//        this.btn_start_another.addTouchEventListener(this.onClickBtn,this);
//
//    },
//
//    addResultItem:function(players){
//        for(var i = 0;i<players.length;++i){
//            var item = new YYBSBigResultItem();
//            item.setItemWithData(players[i], players[i].userId == this.msgData.ext[1]);
//            item.setPosition(cc.winSize.width/2,cc.winSize.height - 315 - i*175);
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
//        var table = "牌桌号:" + YYBSRoomModel.tableId;
//        var jushu = "局数:" + YYBSRoomModel.nowBurCount + "/" + YYBSRoomModel.totalBurCount;
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
//            if(sender == this.btn_back || sender == this.btn_to_hall){
//                LayerManager.showLayer(LayerFactory.HOME);
//                PopupManager.removeAll();
//
//                if(YYBSRoomModel.tableType ==1){
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
//        var wanfa = YYBSRoomModel.wanfa;
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
//        var tableId = YYBSRoomModel.tableId;
//        obj.tableId=tableId;
//        obj.userName=PlayerModel.username;
//        obj.callURL=SdkUtil.SHARE_URL+'?num='+tableId+'&userId='+encodeURIComponent(PlayerModel.userId);
//        obj.title="益阳巴十结算";
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
//var YYBSBigResultItem = cc.Node.extend({
//    ctor:function(){
//        this._super();
//
//        this.initNode();
//    },
//
//    initNode:function(){
//        var img = "res/res_yybs/jiesuan/image_toumingdi.png";
//        this.nodeBg = new cc.Scale9Sprite(img);
//        this.nodeBg.setContentSize(1710,165);
//        this.addChild(this.nodeBg);
//
//        this.headBg = new cc.Sprite("res/res_yybs/touxiangkuang.png");
//        this.headBg.setPosition(105,this.nodeBg.height/2);
//        this.nodeBg.addChild(this.headBg);
//
//        var sten=new cc.Sprite("res/res_yybs/touxiangkuang.png");
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
//        this.label_name.setAnchorPoint(0,0.5);
//        this.label_name.setPosition(this.headBg.x + 75,this.nodeBg.height/2 + 45);
//        this.nodeBg.addChild(this.label_name);
//
//        this.label_id = UICtor.cLabel("ID:1234567",38);
//        this.label_id.setAnchorPoint(0,0.5);
//        this.label_id.setPosition(this.label_name.x,this.nodeBg.height/2);
//        this.nodeBg.addChild(this.label_id);
//
//        this.label_tip = UICtor.cLabel("抢庄王",45);
//        this.label_tip.setColor(cc.color(254,233,95));
//        this.label_tip.setAnchorPoint(0,0.5);
//        this.label_tip.setPosition(this.label_name.x,this.nodeBg.height/2 - 50);
//        this.nodeBg.addChild(this.label_tip);
//
//        this.label_score = UICtor.cLabel("+12345",90);
//        //this.label_score.setColor(cc.color(255,230,113));
//        this.label_score.setColor(cc.color(125,197,246));
//        this.label_score.setPosition(this.nodeBg.width - 225,this.nodeBg.height/2);
//        this.nodeBg.addChild(this.label_score);
//
//        this.label_credit = UICtor.cLabel("赛:+12345",60);
//        this.label_credit.setColor(cc.color(125,197,246));
//        this.label_credit.setPosition(this.nodeBg.width - 600,this.nodeBg.height/2);
//        this.nodeBg.addChild(this.label_credit);
//
//        this.icon_fangzhu = new cc.Sprite("res/res_yybs/jiesuan/fangzhu.png");
//        this.icon_fangzhu.setPosition(this.headBg.x + 38,this.headBg.y + 60);
//        this.nodeBg.addChild(this.icon_fangzhu,2);
//    },
//
//    addMidInfo:function(arr){
//        for(var i = 0;i<6;++i){
//            var label1 = new cc.LabelTTF("关牌","",24);
//            label1.setColor(cc.color(254,233,95));
//            label1.setPosition(380 + (i%3)*170,this.nodeBg.height/2 + 25 - Math.floor(i/3)*50);
//            this.nodeBg.addChild(label1);
//
//            var label2 = new cc.LabelTTF("32","",24);
//            label2.setPosition(label1.x + 50,label1.y);
//            this.nodeBg.addChild(label2);
//        }
//    },
//
//    setItemWithData:function(data,isFangZhu){
//        if(data.seat == YYBSRoomModel.mySeat){
//            this.nodeBg.initWithFile("res/res_yybs/jiesuan/image_zijidi.png",cc.rect(0,0,116,113),cc.rect(38,38,38,38));
//            this.nodeBg.setContentSize(1710,165);
//        }
//
//        this.label_name.setString(data.name);
//        this.label_id.setString("ID:" + data.userId);
//
//        this.setNumLabel(this.label_score,data.totalPoint);
//
//        var credit = data.winLoseCredit;
//
//        credit = MathUtil.toDecimal(credit/100);
//        this.setNumLabel(this.label_credit,credit,"赛:");
//
//        this.label_credit.setVisible(YYBSRoomModel.isCreditRoom());
//
//        if(YYBSRoomModel.isClubGoldRoom()){
//            this.label_credit.setVisible(true);
//            var credit = data.winLoseCredit;
//            this.setNumLabel(this.label_credit,credit,"豆:");
//        }
//
//        this.label_tip.setString("");
//
//        this.icon_fangzhu.setVisible(isFangZhu);
//
//        this.showIcon(data.icon);
//    },
//
//    setNumLabel:function(label,num,str){
//        var color = cc.color(125,197,246);
//        if(num > 0){
//            num = "+" + num;
//            color = cc.color(255,230,113);
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

var YYBSBigResultLayer = PKBigResultPop.extend({
    user:null,
    ctor: function (data,isDaiKai) {
        this.data = data.closingPlayers || [];
        this.isDaiKai = isDaiKai || false;
        var path = "res/pdkNewBigResultPop.json";
        this._super(path);
    },

    onToHome:function(){
        if(YYBSRoomModel.isMatchRoom()){
            LayerManager.showLayer(LayerFactory.GOLD_LAYER);
            PopupManager.remove(this);
            PopupManager.removeAll();
        }else{
            LayerManager.showLayer(LayerFactory.HOME);
            PopupManager.remove(this);
            PopupManager.removeAll();
            var isClubRoom =  (this.getModel().tableType == 1);
            if(isClubRoom){
                PopupManager.removeClassByPopup(PyqHall);
                var mc = new PyqHall();//先不弹出吧
                PopupManager.addPopup(mc);
            }
        }
    },

    refreshSingle:function(widget,user){
        this.user=user;
        var namestr = UITools.truncateLabel(user.name,5);
        ccui.helper.seekWidgetByName(widget,"name").setString(namestr);
        ccui.helper.seekWidgetByName(widget,"id").setString(""+user.userId);

        var img_credit = ccui.helper.seekWidgetByName(widget,"Image_totolPoint");
        var label_credit = ccui.helper.seekWidgetByName(widget,"totolPoint");
        var label_credit1 = ccui.helper.seekWidgetByName(widget,"totolPoint1");
        img_credit.setVisible(false);
        if (YYBSRoomModel.isCreditRoom()){
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
        }

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

        var icon = ccui.helper.seekWidgetByName(widget,"icon");
        var defaultimg = "res/res_gameCom/bigResult2/xtxd.png";
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

        if(this.getWidget("Label_time") && ClosingInfoModel.ext[2]){
            this.getWidget("Label_time").setString(ClosingInfoModel.ext[2]);
        }

        //版本号
        if(this.getWidget("Label_version")){
            this.getWidget("Label_version").setString(SyVersion.v);
        }

        var continueBtn = this.getWidget("continue");
        UITools.addClickEvent(continueBtn,this,this.qyqStartAnother);

        if (YYBSRoomModel.roomName){
            var string = "亲友苑ID:" + ClosingInfoModel.ext[12];
            this.getWidget("Label_clubID").setString(string);
        }else{
            this.getWidget("Label_clubID").visible = false;
            continueBtn.setVisible(false);
        }

        //显示部分房间信息
        var wanfaDesc = ClubRecallDetailModel.getSpecificWanfa(YYBSRoomModel.intParams);

        this.getWidget("Label_wanfa").setString("三打哈  "+wanfaDesc);


        var jushuStr = "第" + YYBSRoomModel.nowBurCount + "/" + YYBSRoomModel.totalBurCount + "局";
        this.getWidget("Label_jushu").setString(jushuStr);

        this.getWidget("Label_roomnum").setString("房号:" + YYBSRoomModel.tableId);

        this.getWidget("Label_score").setString("");
        if (YYBSRoomModel.isCreditRoom()){
            this.getWidget("Label_score").setString(YYBSRoomModel.getCreditConfigStr());
        }

        if(YYBSRoomModel.isClubGoldRoom()){
            this.getWidget("Label_score").setString(YYBSRoomModel.getClubGlodCfg());
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
        var tableId = YYBSRoomModel.tableId;
        obj.tableId=tableId;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_URL+'?num='+tableId+'&userId='+encodeURIComponent(PlayerModel.userId);
        obj.title="益阳巴十结算";
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
        return YYBSRoomModel;
    },

    //再来一局
    qyqStartAnother:function(){
        var wanfa = YYBSRoomModel.wanfa;
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