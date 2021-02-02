///**
// * Created by cyp on 2019/11/13.
// */
//var HSTHSmallResultLayer = cc.Layer.extend({
//    ctor:function(msgData){
//        this._super();
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
//        this.showRuleInfo();
//        this.setInfoData();
//    },
//
//    setLayerWithData:function(){
//        if(!this.msgData)return;
//
//        var players = this.msgData.closingPlayers || [];
//
//        //按分组排下序
//        players.sort(function(a,b){
//            return a.ext[4] - b.ext[4];
//        });
//
//        this.showPlayerItem(players);
//
//        var titleType = 1;
//        for(var i = 0;i<players.length;++i){
//            if(players[i].seat == HSTHRoomModel.mySeat){
//                titleType = players[i].isHu?1:-1;
//            }
//        }
//        this.addTitleImg(titleType);
//    },
//
//    showRuleInfo:function(){
//        var str = ClubRecallDetailModel.getHSTHWanfa(HSTHRoomModel.intParams,true);
//
//        var label = UICtor.cLabel(str,33);
//        label.setAnchorPoint(0,0);
//        label.setTextAreaSize(cc.size(750,150));
//        label.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
//        label.setColor(cc.color(239,145,87));
//        label.setPosition(20,5);
//        this.addChild(label,1);
//    },
//
//    initLayer:function(){
//        var grayLayer = new cc.LayerColor(cc.color.BLACK);
//        grayLayer.setOpacity(210);
//        this.addChild(grayLayer);
//
//        this.label_info = UICtor.cLabel("2019-9-10 10:35  牌桌号:123456  第1局",33);
//        this.label_info.setColor(cc.color(254,233,95));
//        this.label_info.setPosition(cc.winSize.width/2 + 550,75);
//        this.addChild(this.label_info);
//
//        this.btn_jxyx = new ccui.Button("res/res_hsth/btn_jixu.png","res/res_hsth/btn_jixu.png");
//        this.btn_jxyx.setPosition(cc.winSize.width/2,75);
//        this.addChild(this.btn_jxyx,2);
//
//        this.btn_jxyx.addTouchEventListener(this.onClickBtn,this);
//
//        this.btn_xipai = new ccui.Button("res/res_hsth/xipai.png", "res/res_hsth/xipai.png");
//        this.btn_xipai.setPosition(300, cc.winSize.height - 90);
//        this.btn_xipai.setScale(0.8);
//        this.addChild(this.btn_xipai, 2);
//        if ((HSTHRoomModel.nowBurCount == HSTHRoomModel.totalBurCount) || (this.msgData.ext[21] == 1)) {
//            this.btn_xipai.visible = false;
//        }else{
//            this.btn_xipai.visible = HSTHRoomModel.creditConfig[10] == 1;
//        }
//
//        var bisaiImg = new cc.Sprite("res/ui/bjdmj/popup/pyq/sai.png");
//        bisaiImg.setPosition(175, 70);
//        this.btn_xipai.addChild(bisaiImg);
//
//        var label_xpkf = UICtor.cLabel(HSTHRoomModel.creditXpkf,50);
//        label_xpkf.setAnchorPoint(0,0.5);
//        label_xpkf.setPosition(200,70);
//        this.btn_xipai.addChild(label_xpkf);
//
//        this.btn_xipai.addTouchEventListener(this.onClickBtn, this);
//
//    },
//
//    showPlayerItem:function(players){
//        for(var i = 0;i<players.length;++i){
//            var item = new HSTHSmallResultItem();
//            item.setPosition(cc.winSize.width/2,cc.winSize.height - 255 - i*192);
//            item.setItemData(players[i]);
//            this.addChild(item);
//        }
//    },
//
//    addTitleImg:function(type){
//        var img = "res/res_hsth/biaoti.png";
//        if(type < 0){
//            img = "res/res_hsth/biaoti1.png";
//        }
//        var title = new cc.Sprite(img);
//        title.setScale(0.7);
//        title.setPosition(cc.winSize.width/2,cc.winSize.height - 75);
//        this.addChild(title,1);
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
//        var table = "牌桌号:" + HSTHRoomModel.tableId;
//        var jushu = "第" + HSTHRoomModel.nowBurCount + "局";
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
//            if(sender == this.btn_jxyx){
//                PopupManager.remove(this);
//
//                if(HSTHRoomModel.replay){
//                    return;
//                }
//
//                if((HSTHRoomModel.nowBurCount == HSTHRoomModel.totalBurCount) || (this.msgData.ext[21] == 1)){
//                    var BigResultLayer = HSTHRoomModel.getBigResultLayer();
//                    var layer = new BigResultLayer(this.msgData);
//                    PopupManager.addPopup(layer);
//
//                }else{
//                    sySocket.sendComReqMsg(3);
//                }
//            }else if(sender == this.btn_xipai){
//                sySocket.sendComReqMsg(4501, [], "");
//                PopupManager.remove(this);
//                if((HSTHRoomModel.nowBurCount == HSTHRoomModel.totalBurCount) || (this.msgData.ext[21] == 1)){
//                    var BigResultLayer = HSTHRoomModel.getBigResultLayer();
//                    var layer = new BigResultLayer(this.msgData);
//                    PopupManager.addPopup(layer);
//
//                }else{
//                    sySocket.sendComReqMsg(3);
//                }
//            }
//
//        }else if(type == ccui.Widget.TOUCH_CANCELED){
//            sender.setColor(cc.color.WHITE);
//        }
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
//var HSTHSmallResultItem = cc.Node.extend({
//    ctor:function(){
//        this._super();
//
//        this.initNode();
//    },
//
//    initNode:function(){
//        this.itemBg = new cc.Sprite("res/res_hsth/lan_di.png");
//        this.addChild(this.itemBg);
//
//        var headKuang = new cc.Sprite("res/res_hsth/touxiangkuang.png");
//        headKuang.setPosition(120,this.itemBg.height/2 + 15);
//        this.itemBg.addChild(headKuang);
//
//        var sten=new cc.Sprite("res/res_hsth/touxiangkuang.png");
//        var clipnode = new cc.ClippingNode();
//        clipnode.setStencil(sten);
//        clipnode.setAlphaThreshold(0.8);
//        this.iconSpr = new cc.Sprite("res/ui/common/default_m.png");
//        this.iconSpr.setScale(120/this.iconSpr.width);
//        clipnode.addChild(this.iconSpr);
//        clipnode.setPosition(headKuang.getPosition());
//        this.itemBg.addChild(clipnode);
//
//        this.label_name = UICtor.cLabel("玩家的名字",33);
//        this.label_name.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
//        this.label_name.setPosition(headKuang.x,30);
//        this.label_name.setTextAreaSize(cc.size(180,36));
//        this.itemBg.addChild(this.label_name);
//
//        this.youSpr = new cc.Sprite("res/res_hsth/you_1_icon.png");
//        this.youSpr.setPosition(headKuang.x + 135,this.itemBg.height/2);
//        this.itemBg.addChild(this.youSpr);
//
//        var config = ["烧分","排名分","游戏得分","喜分","本局得分"];
//        this.labelArr = [];
//        for(var i = 0;i<config.length;++i){
//            var txt = UICtor.cLabel(config[i],42);
//            txt.setColor(cc.color(250,242,102));
//            txt.setPosition(this.itemBg.width/2 + 75 + i*200,this.itemBg.height/2 + 38);
//            this.itemBg.addChild(txt,1);
//
//            var label = UICtor.cLabel("+100",42);
//            label.setColor(cc.color(250,242,102));
//            label.setPosition(txt.x,this.itemBg.height/2 - 38);
//            this.itemBg.addChild(label,1);
//
//            this.labelArr.push(label);
//        }
//    },
//
//    setItemData:function(data){
//        this.label_name.setString(data.name);
//        this.showIcon(data.icon);
//
//        var bgImg = "res/res_hsth/lan_di.png";
//        if(data.ext[4] == 2){
//            bgImg = "res/res_hsth/hong_di.png";
//        }
//        this.itemBg.initWithFile(bgImg);
//
//        if(data.ext[3] > 0){
//            var youImg = "res/res_hsth/you_" + data.ext[3] + "_icon.png";
//            this.youSpr.initWithFile(youImg);
//        }else{
//            this.youSpr.setVisible(false);
//        }
//
//        var numArr = [0,0,0,0,0];
//        numArr[0] = Number(data.ext[0]) || 0;//烧分
//        numArr[1] = Number(data.ext[1]) || 0;//排名分
//        numArr[2] = Number(data.ext[2]) || 0;//游戏得分
//        numArr[3] = Number(data.ext[7]) || 0;//喜分
//        numArr[4] = data.point || 0;//本局得分
//
//        for(var i = 0;i<this.labelArr.length;++i){
//            this.setNumLabel(this.labelArr[i],numArr[i]);
//        }
//
//        //this.showLeftCards(data.cards || []);
//    },
//
//    showLeftCards:function(ids){
//        HSTHRoomModel.sortIdByValue(ids);
//        for(var i = 0;i<ids.length;++i){
//            var card = new HSTHCard(ids[i]);
//            card.setScale(0.5);
//            card.setPosition(380 + i*27,this.itemBg.height/2);
//            this.itemBg.addChild(card);
//        }
//    },
//
//    setNumLabel:function(label,num,str){
//        var color = cc.color(36,195,238);
//        if(num > 0){
//            num = "+" + num;
//            color = cc.color(250,242,102);
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
//});

var HSTHSmallResultLayer = PKSmallResultPop.extend({

    ctor: function (data,isRePlay) {
        this.isRePlay = HSTHRoomModel.replay;
        this.data = data;
        this._super("res/hsthSmallResult.json");
    },

    selfRender: function () {
        var players = this.data.closingPlayers || [];

        //按分组排下序
        players.sort(function(a,b){
            return a.ext[4] - b.ext[4];
        });

        for(var i = 0;i<players.length;++i){
            var widget = this.getWidget("player"+(i + 1));
            if(players[i]){
                this.showPlayerMsg(widget,players[i],i + 1);
            }
        }

        if(HSTHRoomModel.renshu == 2){
            this.getWidget("player3").visible = false;
            this.getWidget("player4").visible = false;
        }

        this.issent = false;
        this.addCustomEvent(SyEvent.SETTLEMENT_SUCCESS,this,this.onSettlement);
        var btnok = this.getWidget("btnok");
        var btClose = this.getWidget("close_btn");

        UITools.addClickEvent(btnok,this,this.onOk);
        UITools.addClickEvent(btClose , this , this.onBreak);

        this.dt = 0;
        this.start = 3;
        if(HSTHRoomModel.isGameSite>0)
            this.scheduleUpdate();

        //版本号
        if(this.getWidget("Label_version")){
            this.getWidget("Label_version").setString(SyVersion.v);
        }
        var date = new Date();
        var hours = date.getHours().toString();
        hours = hours.length < 2 ? "0"+hours : hours;
        var minutes = date.getMinutes().toString();
        minutes = minutes.length < 2 ? "0"+minutes : minutes;
        if(this.getWidget("Label_time")){
            this.getWidget("Label_time").setString(hours+":"+minutes);
        }

        this.getWidget("Label_roomnum").setString("房号:"+HSTHRoomModel.tableId);
        var jushuStr = "第" + HSTHRoomModel.nowBurCount + "局";
        this.getWidget("Label_jushu").setString(jushuStr);
        //玩法显示
        var wanfaStr = "";
        if(!this.isRePlay){
            wanfaStr = ClubRecallDetailModel.getHSTHWanfa(HSTHRoomModel.intParams);
        }
        this.getWidget("Label_wanfa").setString(wanfaStr);

        var qyqID = "";
        if(this.data.ext[12] && this.data.ext[12] != 0 && this.data.ext[12] != ""){
            qyqID = "亲友苑ID:" + this.data.ext[12];
        }
        this.getWidget("Label_clubID").setString(qyqID);

        var xipai_btn = this.getWidget("xipai_btn");
        UITools.addClickEvent(xipai_btn,this,function(){
            sySocket.sendComReqMsg(4501,[],"");
            this.issent = true;
            this.visible = false;
            this.onOk();
        });
        // cc.log("HSTHRoomModel.creditConfig =",HSTHRoomModel.creditConfig);
        if ((HSTHRoomModel.nowBurCount == HSTHRoomModel.totalBurCount) || (this.data.ext[21] == 1)) {
            xipai_btn.visible = false;
        }else{
            xipai_btn.visible = HSTHRoomModel.creditConfig[10] == 1;
        }
        var xpkf = HSTHRoomModel.creditXpkf || 0;
        this.getWidget("label_xpkf").setString(""+xpkf);

        if (this.isRePlay){
            this.getWidget("replay_tip").visible =  true;
            btClose.visible = false;
        }
    },

    onBreak:function(){
        PHZAlertPop.show("解散房间需所有玩家同意，确定要申请解散吗？",function(){
            sySocket.sendComReqMsg(7);
        })
    },

    showPlayerMsg:function(widget,userData,index){
        var user = userData;
        var nameStr = user.name;
        nameStr = UITools.truncateLabel(nameStr,4);
        ccui.helper.seekWidgetByName(widget,"name").setString(nameStr);
        //显示玩家ID
        ccui.helper.seekWidgetByName(widget,"id").setString("ID:" + user.userId);

        var selfNode = ccui.helper.seekWidgetByName(widget,"Image_sf");
        if(userData.ext[3] > 0){
            var youImg = "res/res_diantuo/smallResult/" + userData.ext[3] + ".png";
            selfNode.loadTexture(youImg);
        }else{
            selfNode.setVisible(false);
        }
        if(index > 2){
            widget.loadTexture("res/res_diantuo/smallResult/bg.png");
        }

        var shaofen = Number(user.ext[0]) || 0;//烧分
        var paimingfen = Number(user.ext[1]) || 0;//排名分
        var youxidefen = Number(user.ext[2]) || 0;//游戏得分
        var xifen = Number(user.ext[7]) || 0;//喜分
        var defen = Number(user.point) || 0;//本局得分

        var xfPoint = ccui.helper.seekWidgetByName(widget,"xfpoint");
        xfPoint.setString(""+xifen);
        xfPoint.setColor(xifen > 0 ? cc.color("#FF11930A") : cc.color("#FFCE0030"));
        var sfPoint = ccui.helper.seekWidgetByName(widget,"sfpoint");
        sfPoint.setString(""+shaofen);
        sfPoint.setColor(shaofen > 0 ? cc.color("#FF11930A") : cc.color("#FFCE0030"));
        var pmfpoint = ccui.helper.seekWidgetByName(widget,"pmfpoint");
        pmfpoint.setString(""+paimingfen);
        pmfpoint.setColor(paimingfen > 0 ? cc.color("#FF11930A") : cc.color("#FFCE0030"));
        var totolPoint = ccui.helper.seekWidgetByName(widget,"totolPoint");
        totolPoint.setString(""+youxidefen);
        totolPoint.setColor(youxidefen > 0 ? cc.color("#FF11930A") : cc.color("#FFCE0030"));
        var point = ccui.helper.seekWidgetByName(widget,"point");
        point.setString(""+defen);
        point.setColor(defen > 0 ? cc.color("#FF11930A") : cc.color("#FFCE0030"));

        var defaultimg = "res/res/pkCommon/pkSmallResult/daTouxiang.png";
        var icon = ccui.helper.seekWidgetByName(widget,"icon");

        if(icon.getChildByTag(345))
            icon.removeChildByTag(345);

        var sprite = new cc.Sprite(defaultimg);
        sprite.x = icon.width / 2;
        sprite.y = icon.height / 2;
        icon.addChild(sprite,5,345);
        //user.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        if(user.icon){
            cc.loader.loadImg(user.icon, {width: 252, height: 252}, function (error, img) {
                if (!error) {
                    sprite.setTexture(img);
                    sprite.x = icon.width / 2;
                    sprite.y = icon.height / 2;
                }
            });
        }

        //var Image_94 = this.getWidget("Image_94");
        //var imgUrl = user.point > 0 ? "res/res_gameCom/smallResult/sl.png" : "res/res_gameCom/smallResult/sb.png";
        //if(user.userId == PlayerModel.userId || (this.isRePlay && index == 1)){
        //    Image_94.loadTexture(imgUrl);
        //}
    },

    onSettlement:function(){
        PopupManager.remove(this);
    },

    update:function(dt){
        this.dt += dt;
        if(this.dt >= 1){
            this.dt = 0;
            if(!this.issent){
                this.start--;
                if(this.start <= 0){
                    this.unscheduleUpdate();
                    this.onOk();
                    return;
                }
                // this.Label_43.setString(this.start+"秒后自动关闭");
            }
        }
    },

    onOk:function(){
        PopupManager.remove(this);

        if(HSTHRoomModel.replay){
            return;
        }

        if((HSTHRoomModel.nowBurCount == HSTHRoomModel.totalBurCount) || (this.data.ext[21] == 1)){
            var BigResultLayer = HSTHRoomModel.getBigResultLayer();
            var layer = new BigResultLayer(this.data);
            PopupManager.addPopup(layer);

        }else{
            sySocket.sendComReqMsg(3);
        }
    },

    onClose:function(){
        this.issent = true;
        sySocket.sendComReqMsg(3);
        this.unscheduleUpdate();
    },
});
