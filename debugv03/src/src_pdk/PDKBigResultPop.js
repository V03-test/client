/**
 * Created by zhoufan on 2016/6/30.
 */
var PDKBigResultPop = PKBigResultPop.extend({
    user:null,
    ctor: function (data,isDaiKai) {
        this.data = data;
        this.isDaiKai = isDaiKai || false;
         var path = "res/bigResultPopThree.json";
        if(this.data.length == 2){
            path = "res/bigResultPopTwo.json";
        }
        this._super(path);
    },

    onToHome:function(){
        if(PDKRoomModel.isMatchRoom()){
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
        if (PDKRoomModel.isCreditRoom()){
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

        for(var i = 0;i<widgetName.length;++i){
            ccui.helper.seekWidgetByName(widget,widgetName[i]).setString("");
            ccui.helper.seekWidgetByName(widget,widgetLabel[i]).setString("");
        }

        ccui.helper.seekWidgetByName(widget,"Label_title1").setString("炸弹个数");
        ccui.helper.seekWidgetByName(widget,"Label_txt1").setString(""+user.totalBoom);

        ccui.helper.seekWidgetByName(widget,"Label_title2").setString("胜负局数");
        ccui.helper.seekWidgetByName(widget,"Label_txt2").setString(user.winCount+"胜"+user.lostCount+"负");

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

        //ccui.helper.seekWidgetByName(widget,"dyj").visible = (user.dyj==1);
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

        //if(user.ext[12] > 0){
        //    var img = new cc.Sprite("res/ui/common/niao.png");
        //    img.setPosition(icon.width - 10,10);
        //    icon.addChild(img,20);
        //}

        //var sexIcon = ccui.helper.seekWidgetByName(widget,"sex");
        //if(user.sex == 1){
        //    sexIcon.loadTexture("res/res_pdk/pdkBigResult/pdkHome_14.png")
        //}else{
        //    sexIcon.loadTexture("res/res_pdk/pdkBigResult/pdkHome_15.png")
        //}

        //if(user.userId == ClosingInfoModel.ext[1]){
        //    var fangzhu = new cc.Sprite("res/res_pdk/pdkSmallResult/fangzhu.png");
        //    fangzhu.anchorX=fangzhu.anchorY=0;
        //    fangzhu.x = -19;fangzhu.y=21;
        //    icon.addChild(fangzhu,10);
        //}

        ////增加最高分和最低分的显示
        //var MaxOrMin = ccui.helper.seekWidgetByName(widget,"MaxOrMin");
        //cc.log("user.totalPoin ， this.maxPoint , this.minPoint" , user.totalPoint , this.maxPoint , this.minPoint);
        //if(user.totalPoint == this.maxPoint){ // && this.maxPoint != 0
        //    MaxOrMin.visible = true;
        //    MaxOrMin.loadTexture("res/res_pdk/pdkBigResult/pdkBigResult_2.png");
        //}else if(user.totalPoint == this.minPoint){
        //    MaxOrMin.visible = true;
        //    MaxOrMin.loadTexture("res/res_pdk/pdkBigResult/pdkBigResult_1.png");
        //}

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

        // cc.log("pdk bigResult selfRender...");
        //if(this.data.match){
        //	sySocket.sendComReqMsg(15,[],"");
        //}else{
        // cc.log("pdk bigResult selfRender...2");
        // cc.log("this.data",JSON.stringify(this.data));
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

        var shareResult = this.getWidget("shareResult");
        UITools.addClickEvent(shareResult,this,this.onShare);
        var backHall = this.getWidget("backHall");
        UITools.addClickEvent(backHall,this,this.onToHome);

        if(this.getWidget("Label_time") && ClosingInfoModel.ext[2]){
            this.getWidget("Label_time").setString(ClosingInfoModel.ext[2]);
        }

        var continueBtn = this.getWidget("continue");
        UITools.addClickEvent(continueBtn,this,this.qyqStartAnother);

        if (PDKRoomModel.roomName){
            var string = "亲友苑ID:" + ClosingInfoModel.ext[12];
            this.getWidget("Label_clubID").setString(string);
        }else{
            this.getWidget("Label_clubID").visible = false;
            continueBtn.setVisible(false);
        }

        //显示部分房间信息
        var wanfaDesc = "";
        var zhifuDesc = "";
        var renshuDesc = "";
        var hongshiDesc = "";


        var tableDesc = "";
        var timeDesc = "";

        var temp = "";

        if (this.isDaiKai) {
            var createPara = dkResultModel.data.createPara.split(",");
            var nameList = ["","红10(5分)","红10(10分)","红10(翻倍)"];
            wanfaDesc = createPara[1]+"张";
            zhifuDesc = createPara[9] ? "AA支付" : "房主支付";
            renshuDesc = createPara[7] + "人";
            hongshiDesc = nameList[createPara[10]];
            tableDesc = dkResultModel.data.tableId;
            timeDesc = dkResultModel.data.time;
        }else{
            if(PDKRoomModel.isWanfa15()){
                wanfaDesc = "15张玩法";
            }else if(PDKRoomModel.isWanfa16()){
                wanfaDesc = "16张玩法";
            }
            zhifuDesc = "房主支付";
            if (PDKRoomModel.getCostFangShi() == 1){
                zhifuDesc = "AA支付";
            }else if (PDKRoomModel.getCostFangShi() == 3) {
                zhifuDesc = "擂主支付";
            }

            if(PDKRoomModel.isMatchRoom()){
                zhifuDesc = "";
            }

            renshuDesc = PDKRoomModel.renshu + "人";
            hongshiDesc = PDKRoomModel.getHongShiName();
            tableDesc = ClosingInfoModel.ext[0];
            timeDesc = ClosingInfoModel.ext[2];
            if (PDKRoomModel.intParams[29] == 0){
                //this.getWidget("Label_zdbkc").setString("炸弹不可拆");
                temp = "炸弹不可拆";
            }
        }

        var wfStr = "";

        if(PDKRoomModel.intParams[28] > 0){
            wfStr = "打鸟" + PDKRoomModel.intParams[28] + "分 ";
        }

        if (PDKRoomModel.isDouble()){
            var dtimes = PDKRoomModel.getDoubleNum();
            var dScore = PDKRoomModel.getDScore();
            wfStr = wfStr + "小于"+ dScore +"分" + " 翻" + dtimes + "倍";
        }

        this.getWidget("Label_wanfa").setString(wanfaDesc + "  " + renshuDesc + "  " + zhifuDesc +"  " + hongshiDesc + "  " + temp + "  " + wfStr);
        //this.getWidget("Label_renshu").setString(renshuDesc);
        //// this.getWidget("Label_time").setString(timeDesc);
        //this.getWidget("Label_pay").setString(zhifuDesc);
        //this.getWidget("Label_version").setString(SyVersion.v);
        //this.getWidget("Label_hongshi").setString(hongshiDesc);


        var jushuStr = "第" + PDKRoomModel.nowBurCount + "/" + PDKRoomModel.totalBurCount + "局";
        this.getWidget("Label_jushu").setString(jushuStr);

        this.getWidget("Label_roomnum").setString("房号:" + PDKRoomModel.tableId);

        //版本号
        if(this.getWidget("Label_version")){
            this.getWidget("Label_version").setString(SyVersion.v);
        }

        //var elements = [];
        //elements.push(RichLabelVo.createTextVo("房号:",cc.color("7D2E00"),36));
        //elements.push(RichLabelVo.createTextVo(tableDesc+"  ",cc.color("ff6f18"),36));
        //elements.push(RichLabelVo.createTextVo("时间:",cc.color("7D2E00"),36));
        //elements.push(RichLabelVo.createTextVo(timeDesc+"  ",cc.color("ff6f18"),36));
        //var richLabel = new RichLabel(cc.size(1558,0),3);
        //richLabel.setLabelString(elements);
        //richLabel.x = richLabel.y =10;
        //this.getWidget("Panel_22").addChild(richLabel);


        ////俱乐部房间图片标识
        //var tableType = 0;
        //tableType = ClosingInfoModel.ext[5];
        //this.Image_jlbRoom = this.getWidget("Image_jlbRoom");
        //this.Image_jlbRoom.visible = false;
        //if (PDKRoomModel.isClubRoom(tableType)){
        //    this.Image_jlbRoom.visible = true;
        //}

        ////显示俱乐部ID
        //var clubIdLabel = this.getWidget("Label_clubId");
        //clubIdLabel.setString("");
        //var clubId = ClosingInfoModel.ext[12] || 0;
        //if (clubId){
        //    clubIdLabel.setString("亲友苑ID:"+clubId);
        //}

        //}

        this.getWidget("Label_score").setString("");
        if (PDKRoomModel.isCreditRoom()){
            //奖赏分
            //固定奖赏 大赢家 10
            //比例奖赏 所有赢家 2%
            var giveStr = "";
            var giveType = PDKRoomModel.getCreditType();
            var giveWay = PDKRoomModel.getCreditWay();
            var giveNum = PDKRoomModel.getCreditGiveNum();
            if (giveType == 1){
                if(!PDKRoomModel.getCreditPayWay()){
                    giveStr = giveStr + "固定奖赏,";
                }
            }else{
                giveStr = giveStr + "比例奖赏,";
            }
            if (giveWay == 1){
                if(PDKRoomModel.getCreditPayWay()){
                    giveStr = giveStr + "AA奖赏,";
                }else{
                    giveStr = giveStr + "大赢家,";
                }
            }else{
                giveStr = giveStr + "所有赢家,";
            }
            if (giveType == 1){
                giveStr = giveStr + giveNum;
            }else{
                giveStr = giveStr + giveNum + "%";
            }
            this.getWidget("Label_score").setString("底分:"+PDKRoomModel.getCreditScore() + "," + giveStr);
        }

        if(PDKRoomModel.isClubGoldRoom()){
            this.getWidget("Label_score").setString(PDKRoomModel.getClubGlodCfg());
        }

        //var Button_fxCard = this.getWidget("Button_fxCard");
        //Button_fxCard.visible = false;
        //UITools.addClickEvent(Button_fxCard,this,this.onShareCard);
        //if( PDKRoomModel.tableType == 1&&ClosingInfoModel.groupLogId){//亲友圈房间才可见;
        //    Button_fxCard.visible = false;
        //    Button_fxCard.scaleX= 0.9;
        //    Button_21.scaleX= 0.9;
        //    Button_20.scaleX= 0.9;
        //}else{
        //    //Button_21.x= 386+640;
        //    //Button_20.x= 0+640;
        //}
    },
    onShareCard:function() {
        this.shareCard(PDKRoomModel, this.data, ClosingInfoModel.groupLogId);
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
        obj.tableId=PDKRoomModel.tableId;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_URL+'?userName='+encodeURIComponent(PlayerModel.name);
        obj.title="跑得快   房号:"+PDKRoomModel.tableId;
        obj.description="我已开好房间,纯技术实力的对决,一起跑得快！";
        obj.shareType=0;
        sy.scene.showLoading("正在截取屏幕");
        setTimeout(function(){
            sy.scene.hideLoading();
            //SharePop.show(obj);
            ShareDTPop.show(obj);
        },500);
    },

    getModel:function(){
        return PDKRoomModel;
    },

    //再来一局
    qyqStartAnother:function(){
        var wanfa = PDKRoomModel.wanfa;
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
