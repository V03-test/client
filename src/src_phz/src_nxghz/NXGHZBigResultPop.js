/**
 * Created by zhoufan on 2016/12/2.
 */
var NXGHZBigResultPop = BasePopup.extend({
    user:null,
    isDaiKai:null,
    ctor: function (data,isDaiKai) {
        this.data = data;
        this.isDaiKai = isDaiKai || false;
        var json = "res/bigResultPop.json";
        if(this.data.closingPlayers.length == 3){
            json = "res/bigResultPopThree.json";
        }else if(this.data.closingPlayers.length == 2){
            json = "res/bigResultPopTwo.json";
        }
        this.json = json;
        this._super(json);
    },

    refreshSingle:function(widget,user){
        this.user=user;
        ccui.helper.seekWidgetByName(widget,"name").setString(user.name);
        var idPanel = ccui.helper.seekWidgetByName(widget,"id");
        if (idPanel)
            idPanel.setString("ID："+user.userId);


        var label1 = ccui.helper.seekWidgetByName(widget, "Label_title1");
        var label2 = ccui.helper.seekWidgetByName(widget, "Label_title2");
        var label3 = ccui.helper.seekWidgetByName(widget, "Label_title3");
        var label4 = ccui.helper.seekWidgetByName(widget, "Label_title4");
        var label5 = ccui.helper.seekWidgetByName(widget, "Label_title5");
        var label6 = ccui.helper.seekWidgetByName(widget, "Label_title6");
        label1.setString("胡牌次数");
        label2.setString("自摸次数");
        label3.setString("提牌次数");
        label4.setString("跑牌次数");
        label5.setString("");
        label6.setString("");

        var num1 = ccui.helper.seekWidgetByName(widget, "Label_txt1");
        var num2 = ccui.helper.seekWidgetByName(widget, "Label_txt2");
        var num3 = ccui.helper.seekWidgetByName(widget, "Label_txt3");
        var num4 = ccui.helper.seekWidgetByName(widget, "Label_txt4");
        var num5 = ccui.helper.seekWidgetByName(widget, "Label_txt5");
        var num6 = ccui.helper.seekWidgetByName(widget, "Label_txt6");
        num1.setString("");
        num2.setString("");
        num3.setString("");
        num4.setString("");
        num5.setString("");
        num6.setString("");

        var dahuNum = 0;

        var countsArr = user.dahuCounts || [];
        for(var i = 0;i<countsArr.length;++i){
            if(countsArr[i] > 0){
                dahuNum += countsArr[i];
            }
        }

        if(PHZRoomModel.wanfa == GameTypeEunmZP.NXGHZ){
            label3.visible = label4.visible = false
            num3.visible = num4.visible = false
            label2.setString("大胡次数")
            num1.setString(user.winCount || 0)
            num2.setString(dahuNum || 0)
        }else if(PHZRoomModel.wanfa == GameTypeEunmZP.YYWHZ){
            label4.visible = false
            num4.visible = false
            label2.setString("最高胡息")
            label3.setString("最高积分")
            num1.setString(user.winCount || 0)
            num2.setString(user.maxPoint || 0)
            num3.setString(user.zhuaHao || 0)
        }


        var img_credit = ccui.helper.seekWidgetByName(widget,"Image_totolPoint");
        var label_credit = ccui.helper.seekWidgetByName(widget,"totolPoint");
        var label_credit1 = ccui.helper.seekWidgetByName(widget,"totolPoint1");
        img_credit.setVisible(false);
        if (PHZRoomModel.isCreditRoom()){
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

        var pointNode = ccui.helper.seekWidgetByName(widget,"point");
        var pointNode1= ccui.helper.seekWidgetByName(widget,"point1");

        var totalPoint = user.totalPoint || 0;;
        if (totalPoint >= 0){
            pointNode.setString("+" + totalPoint);
            pointNode1.setString("");
        }else{
            pointNode1.setString(totalPoint);
            pointNode.setString("");
        }

        var icon = ccui.helper.seekWidgetByName(widget,"icon");
        var defaultimg = "res/res_gameCom/bigResult/txd.png";
        if(icon.getChildByTag(345))
            icon.removeChildByTag(345);
        var sprite = new cc.Sprite(defaultimg);
        sprite.x = icon.width / 2;
        sprite.y = icon.height / 2;
        icon.addChild(sprite,5,345);
        //user.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        if(user.icon){
            cc.loader.loadImg(user.icon, {width: 70, height: 70}, function (error, img) {
                if (!error) {
                    sprite.setTexture(img);
                }
            });
        }
        //var fzImg = ccui.helper.seekWidgetByName(widget,"Image_fz");//房主图片
        //fzImg.visible = false;
        //if(!this.isDaiKai){
	     //   if(user.userId==ClosingInfoModel.ext[1]){
        //        fzImg.visible = true;
	     //   }
        //}
    },


    selfRender: function () {
        this.addCustomEvent(SyEvent.SOCKET_OPENED,this,this.onSuc);
        this.addCustomEvent(SyEvent.GET_SERVER_SUC,this,this.onChooseCallBack);
        this.addCustomEvent(SyEvent.NOGET_SERVER_ERR,this,this.onChooseCallBack);

        var players = this.data.closingPlayers || [];

        var max = 0;
        var omax = 0;
        var min = 65535;
        for(var i=0;i<players.length;i++){
            var d = players[i];
            if(d.winCount >= max)
                max = d.winCount;

            if (d.totalPoint >= omax) {
                omax = d.totalPoint;
            }
            if (d.totalPoint <= min) {
                min = d.totalPoint;
            }
        }

        // cc.log("phz计算出的结算最大分和最小分..." , min , omax);
        for(var i=0;i<players.length;i++){
            var d = players[i];
            d.dyj = 0;
            d.zdyj = 0;

            if (d.totalPoint == omax && omax > 0)
                d.zdyj = 1;
            if (d.totalPoint == min)
                d.isMin = 1;

            this.refreshSingle(this.getWidget("user"+(i+1)),players[i]);
        }

        var shareResult = this.getWidget("shareResult");
        UITools.addClickEvent(shareResult,this,this.onShare);
        var backHall = this.getWidget("backHall");
        UITools.addClickEvent(backHall,this,this.onToHome);

        //var Button_49 = this.getWidget("Button_49"); //复制总成绩
        //UITools.addClickEvent(Button_49,this,this.onCopy);

        //var btn_return_hall = this.getWidget("btn_return_hall");
        //UITools.addClickEvent(btn_return_hall,this,this.onToHome);

        var btn_start_another = this.getWidget("btn_start_another");
        UITools.addClickEvent(btn_start_another,this,this.qyqStartAnother);

        var continueBtn = this.getWidget("continue");
        UITools.addClickEvent(continueBtn,this,this.qyqStartAnother);

        //var Button_dissolution = this.getWidget("Button_dissolution");
        //Button_dissolution.visible = false;
        //UITools.addClickEvent(Button_dissolution,this,this.onDissolution);

        //版本号
        if(this.getWidget("Label_version")){
            this.getWidget("Label_version").setString(SyVersion.v);
        }
        //var resultMsg = null;
        //if (resultMsg){
        //    this.resultMsg = JSON.parse(resultMsg);
        //    if (this.resultMsg.dissState){
        //        Button_dissolution.visible = true;
        //    }
        //    cc.log("this.resultMsg"+JSON.stringify(this.resultMsg));
        //}

        if (PHZRoomModel.roomName){
            var string = "亲友苑ID:" + ClosingInfoModel.ext[13];
            this.getWidget("Label_clubID").setString(string);
        }else{
            this.getWidget("Label_clubID").visible = false;
            continueBtn.setVisible(false);
        }

        this.getWidget("Label_jushu").setString("局数:"+ClosingInfoModel.ext[5]);

        this.getWidget("Label_roomnum").setString("房号:" +ClosingInfoModel.ext[0]);

        if(this.getWidget("Label_time") && ClosingInfoModel.ext[2]){
            this.getWidget("Label_time").setString(ClosingInfoModel.ext[2]);
        }

        this.getWidget("Label_score").setString("");
        if (PHZRoomModel.isCreditRoom()){
            //奖赏分
            //固定奖赏 大赢家 10
            //比例奖赏 所有赢家 2%
            var giveStr = "";
            var giveType = PHZRoomModel.getCreditType();
            var giveWay = PHZRoomModel.getCreditWay();
            var giveNum = PHZRoomModel.getCreditGiveNum();
            if (giveType == 1){
                if(!PHZRoomModel.getCreditPayWay()){
                   giveStr = giveStr + "固定奖赏,";
                }
            }else{
                giveStr = giveStr + "比例奖赏,";
            }
            if (giveWay == 1){
                if(PHZRoomModel.getCreditPayWay()){
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

            this.getWidget("Label_score").setString("底分:"+PHZRoomModel.getCreditScore() +"," + giveStr);
        }

        var gameName = "";

        if(PHZRoomModel.wanfa == GameTypeEunmZP.YYWHZ){
            gameName = "益阳歪胡子"+ "   ";
        }else if(PHZRoomModel.wanfa == GameTypeEunmZP.NXGHZ){
            gameName = "南县鬼胡子"+ "   ";
        }

        var wanfaStr = ClubRecallDetailModel.getSpecificWanfa(PHZRoomModel.intParams);
        this.getWidget("Label_wanfa").setString(gameName + wanfaStr);
    },

    clubCoinResult:function(){
        if(!ClosingInfoModel.clubResultCoinData){
            FloatLabelUtil.comText("正在获取游戏数据，请稍后重试");
            return
        }

        for(var i = 0;i < this.data.closingPlayers.length;i++){
            for(var j = 0;j < ClosingInfoModel.clubResultCoinData.length;j++){
                if(ClosingInfoModel.clubResultCoinData[j].userId == this.data.closingPlayers[i].userId){
                    ClosingInfoModel.clubResultCoinData[j].name = this.data.closingPlayers[i].name;
                    ClosingInfoModel.clubResultCoinData[j].icon = this.data.closingPlayers[i].icon;
                    break;
                }
            }
        }

        var mc = new ClubCoinResultPop(ClosingInfoModel.clubResultCoinData);
        this.addChild(mc,1000);
    },

    onShareCard:function() {
        this.shareCard(PHZRoomModel, this.data, ClosingInfoModel.groupLogId);
    },
    /**
     * 分享战报
     */
    onShare:function(){
        var winSize = cc.director.getWinSize();
        var texture = new cc.RenderTexture(winSize.width, winSize.height,cc.Texture2D.PIXEL_FORMAT_RGBA8888,gl.DEPTH24_STENCIL8_OES);
        if (!texture)
            return;
        texture.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        texture.begin();
        this.visit();
        texture.end();
        texture.saveToFile("share_pdk.jpg", cc.IMAGE_FORMAT_JPEG, false);
        var renshu = (this.isDaiKai) ? dkResultModel.data.resList.length : PHZRoomModel.renshu;
        var str = (renshu==3) ? "3人房" : "4人房";
        var obj={};
        var tableId = (this.isDaiKai) ? dkResultModel.data.tableId : PHZRoomModel.tableId;
        obj.tableId=tableId;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_URL+'?num='+tableId+'&userId='+encodeURIComponent(PlayerModel.userId);
        obj.title='跑胡子   '+str+' 房号:'+tableId;
        obj.description="我已开好房间，【跑胡子】二缺一，就等你了！";
        obj.shareType=0;
        sy.scene.showLoading("正在截取屏幕");
        setTimeout(function(){
            sy.scene.hideLoading();
            //SharePop.show(obj);
            ShareDTPop.show(obj);
        },500);
    },

    onToHome:function(){
    	if(this.isDaiKai){
            dkRecordModel.isShowRecord = false;
            PopupManager.remove(this);
    	}else{
    		LayerManager.showLayer(LayerFactory.HOME);
    		PopupManager.remove(this);
    		PopupManager.removeAll();
            var isClubRoom =  (PHZRoomModel.tableType ==1);
            if(isClubRoom ){
                PopupManager.removeClassByPopup(PyqHall);
                var mc = new PyqHall();//先不弹出吧
                PopupManager.addPopup(mc);
            }
    	}
    },

    onDissolution:function(){
        var mc = new PHZDissolutionPop(this.resultMsg.dissPlayer,this.data);
        PopupManager.addPopup(mc);
    },


    onCopy:function(){
        var str = "";
        str = str + "房间号:"+PHZRoomModel.tableId + "\n";
        str = str + PHZRoomModel.getName(PHZRoomModel.wanfa) + " 局数:"+ClosingInfoModel.round + "\n";
        for(var i=0;i<this.data.length;i++){
            var totalPoint = 0;
            if (this.bigResultIsBP()){
                totalPoint = this.data[i].bopiPoint;
            }else{
                totalPoint = this.data[i].totalPoint;
            }
            var playerStr = this.data[i].name + " ID:" + this.data[i].userId + " " + totalPoint;
            str = str + playerStr + "\n"
        }
        SdkUtil.sdkPaste(str);
        cc.log("当前复制的字符串为:",str);
    },

    //再来一局
    qyqStartAnother:function(){
        var wanfa = PHZRoomModel.wanfa;
        var groupId = ClosingInfoModel.ext[13];
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

var PHZDissolutionPop = BasePopup.extend({

    ctor: function (dissPlayer,data) {
        this.dissPlayer = dissPlayer || [];
        this.data = data || [];
        this._super("res/phzDissolutionPop.json");
    },

    selfRender: function () {
        var dissPlayer = this.dissPlayer.split(",");
        var true_btn = this.getWidget("true_btn");
        UITools.addClickEvent(true_btn, this, this.onTrue);

        for(var i=1;i<=4;i++){
            var Image_player = this.getWidget("Image_player"+i);
            Image_player.visible = false;
        }

        if (dissPlayer){
            for(var i = 0;i < dissPlayer.length;i++){
                for(var j = 0;j < this.data.length;j++){
                    if (dissPlayer[i] == this.data[j].userId){
                        this.showPlayerinfo(this.getWidget("Image_player"+(i+1)),this.data[j]);
                    }
                }
            }
        }

    },
    showPlayerinfo:function(widget,user){
        widget.visible = true;
        ccui.helper.seekWidgetByName(widget,"name").setString(user.name);
        ccui.helper.seekWidgetByName(widget,"uid").setString("ID:"+user.userId);
        var icon = ccui.helper.seekWidgetByName(widget,"icon");
        var defaultimg = (user.sex == 1) ? "res/ui/dtz/images/default_m.png" : "res/ui/dtz/images/default_w.png";
        if(icon.getChildByTag(345))
            icon.removeChildByTag(345);
        var sprite = new cc.Sprite(defaultimg);
        sprite.scale = 0.95;
        sprite.x = 40;
        sprite.y = 40;
        icon.addChild(sprite,5,345);
        //user.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        if(user.icon){
            cc.loader.loadImg(user.icon, {width: 75, height: 75}, function (error, img) {
                if (!error) {
                    sprite.setTexture(img);
                }
            });
        }
    },

    onTrue:function(){
        PopupManager.remove(this);
    }
});
