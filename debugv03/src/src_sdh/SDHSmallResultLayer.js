///**
// * Created by cyp on 2019/9/9.
// */
//
//var SDHSmallResultLayer = cc.Layer.extend({
//    ctor:function(msgData,isReplay){
//        this._super();
//
//        this.msgData = msgData;
//        this.isReplay = isReplay;
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
//    },
//
//    setLayerWithData:function(){
//        if(!this.msgData)return;
//
//        this.setTypeInfo();
//
//        var players = this.msgData.closingPlayers || [];
//
//        for(var i = 1;i<4;++i){
//            this.userNameArr[i].setVisible(false);
//        }
//
//        var titleType = 1;
//
//        var hasZhuang = false;
//        for(var i = 0;i<players.length;++i){
//            if(players[i].boom == 1){
//                hasZhuang = true;
//                break;
//            }
//        }
//
//        this.icon_zhuang.setVisible(hasZhuang);
//
//        var idx = hasZhuang?1:0;
//        var curIdx = 0;
//        for(var i = 0;i<players.length;++i){
//            var p = players[i];
//            if(p.boom == 1){//庄家
//                curIdx = 0;
//            }else{
//                curIdx = idx;
//                idx++;
//            }
//            if(this.userNameArr[curIdx]){
//                this.userNameArr[curIdx].setVisible(true);
//
//                this.userNameArr[curIdx].setString(p.name);
//                var point = p.point;
//
//                if(SDHRoomModel.isMatchRoom()){
//                    point = p.totalPoint;
//                }
//
//                if(SDHRoomModel.wanfa == GameTypeEunmPK.XTSDH
//                    && SDHRoomModel.isFzbHide() && !SDHRoomModel.replay
//                    && p.userId != PlayerModel.userId){
//                    this.userNameArr[curIdx].setString("玩家" + (curIdx + 1));
//                }
//
//                if(point > 0)point = "+" + point;
//                this.userScoreArr[curIdx].setString(point);
//
//                if(SDHRoomModel.isMatchRoom()){
//                    this.showMoneyIcon(this.userScoreArr[curIdx]);
//                }
//            }
//
//            if(p.seat == SDHRoomModel.mySeat){
//                this.addBenRenIcon(curIdx);
//                titleType = point > 0?1:-1;
//            }
//        }
//
//        this.addTitleImg(titleType);
//    },
//
//    showMoneyIcon:function(label){
//        var icon = new cc.Sprite("res/res_gold/goldPyqHall/img_13.png");
//        icon.setAnchorPoint(1,0.5);
//        icon.setScale(0.8);
//        icon.setPosition(label.x - label.width/2,label.y);
//        label.getParent().addChild(icon,5);
//    },
//
//    setTypeInfo:function(){
//        var jiaofen = this.msgData.ext[22];
//
//        this.label_jiaofen.setString("叫分:" + jiaofen);
//        this.label_defen.setString("得分:" + this.msgData.ext[23]);
//
//        var typeArr = [];
//
//        var config = {"-3":"大倒","-2":"小倒","-1":"垮庄","1":"过庄","2":"小光","3":"大光"};
//        var type = SDHRoomModel.getScoreType(this.msgData.ext[22],this.msgData.ext[23]);
//
//        if(this.msgData.ext[26] == 1){
//            typeArr.push("投降");
//        }else if(config[type]){
//            typeArr.push(config[type]);
//        }
//
//        if(this.msgData.ext[24] == 1)typeArr.push("抠底");
//        if(this.msgData.ext[25] == 1)typeArr.push("加拍");
//
//        if((SDHRoomModel.intParams[13] == 1) || (SDHRoomModel.intParams[18] == 1 && this.msgData.ext[26] == 1)){//选了叫分进档
//            if(jiaofen <= 30){
//                typeArr.push("三档");
//            }else if(jiaofen <= 50){
//                typeArr.push("二档");
//            }
//        }
//
//        var typeStr = "";
//        for(var i = 0;i< typeArr.length;++i){
//            if(i == 1 || i == 3)typeStr += " ";
//            if(i == 2)typeStr += "\n";
//            typeStr += typeArr[i];
//        }
//
//        this.label_type.setString(typeStr);
//    },
//
//    showRuleInfo:function(){
//        if(SDHRoomModel.isMatchRoom()){
//            return;
//        }
//
//        var str = ClubRecallDetailModel.getXTSDHWanfa(SDHRoomModel.intParams,true);
//
//        str = str.replace(/\s/g,"\n");
//
//        var label = UICtor.cLabel(str,36);
//        label.setAnchorPoint(0,0.5);
//        label.setColor(cc.color(239,145,87));
//        label.setPosition(30,cc.winSize.height/2);
//        this.addChild(label,1);
//    },
//
//    initLayer:function(){
//        var grayLayer = new cc.LayerColor(cc.color.BLACK);
//        grayLayer.setOpacity(210);
//        this.addChild(grayLayer);
//
//        var bg = new cc.Sprite("res/res_sdh/jiesuan/di.png");
//        bg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
//        this.addChild(bg);
//
//        this.layerBg = bg;
//
//        this.userNameArr = [];
//        this.userScoreArr = [];
//        var name = UICtor.cLabel("玩家的名字",38);
//        name.setAnchorPoint(0,0.5);
//        name.setTextAreaSize(cc.size(300,40));
//        name.setPosition(120,475);
//        bg.addChild(name,1);
//        this.userNameArr.push(name);
//
//        var num_bg = new cc.Sprite("res/res_sdh/jiesuan/huobi1.png");
//        num_bg.setPosition(240,225);
//        bg.addChild(num_bg,1);
//
//        var label_num = UICtor.cLabel("-12345",54);
//        label_num.setColor(cc.color(234,94,18));
//        label_num.setPosition(num_bg.getPosition());
//        bg.addChild(label_num,1);
//        this.userScoreArr.push(label_num);
//
//        var icon_zhuang = new cc.Sprite("res/res_sdh/jiesuan/zhuang.png");
//        icon_zhuang.setPosition(80,475);
//        bg.addChild(icon_zhuang,1);
//
//        this.icon_zhuang = icon_zhuang;
//
//        this.label_jiaofen = UICtor.cLabel("叫分:80",38);
//        this.label_jiaofen.setAnchorPoint(0,0.5);
//        this.label_jiaofen.setPosition(60,390);
//        bg.addChild(this.label_jiaofen,1);
//
//        this.label_defen = UICtor.cLabel("得分:60",38);
//        this.label_defen.setAnchorPoint(0,0.5);
//        this.label_defen.setPosition(60,315);
//        bg.addChild(this.label_defen,1);
//
//        this.label_type = UICtor.cLabel("",54);
//        this.label_type.setColor(cc.color(255,245,84));
//        this.label_type.setPosition(355,355);
//        bg.addChild(this.label_type,2);
//
//        for(var i = 0;i<3;++i){
//            var label_name = UICtor.cLabel("玩家的名字",38);
//            label_name.setAnchorPoint(0,0.5);
//            label_name.setTextAreaSize(cc.size(225,40));
//            label_name.setPosition(510,475 - i*123);
//            bg.addChild(label_name,1);
//
//            var num_bg = new cc.Sprite("res/res_sdh/jiesuan/huobi2.png");
//            num_bg.setPosition(315,label_name.height/2);
//            label_name.addChild(num_bg,1);
//
//            var label_num = UICtor.cLabel("+12345",38);
//            label_num.setPosition(num_bg.getPosition());
//            label_name.addChild(label_num,1);
//
//            this.userNameArr.push(label_name);
//            this.userScoreArr.push(label_num);
//        }
//
//        this.btn_jxyx = new ccui.Button("res/res_sdh/jiesuan/btn_jixu.png","res/res_sdh/jiesuan/btn_jixu.png");
//        this.btn_jxyx.setPosition(cc.winSize.width/2 + 200,180);
//        this.addChild(this.btn_jxyx,2);
//
//        this.btn_jxyx.addTouchEventListener(this.onClickBtn,this);
//
//        this.btn_xipai = new ccui.Button("res/res_erddz/xipai.png", "res/res_erddz/xipai.png");
//        this.btn_xipai.setPosition(cc.winSize.width / 2 - 200, 180);
//        this.addChild(this.btn_xipai, 2);
//        if ((SDHRoomModel.nowBurCount == SDHRoomModel.totalBurCount) || (this.msgData.ext[21] == 1)) {
//            this.btn_xipai.visible = false;
//        }else{
//            this.btn_xipai.visible = SDHRoomModel.creditConfig[10] == 1;
//        }
//        var bisaiImg = new cc.Sprite("res/ui/bjdmj/popup/pyq/sai.png");
//        bisaiImg.setPosition(175, 70);
//        this.btn_xipai.addChild(bisaiImg);
//
//        var label_xpkf = UICtor.cLabel(SDHRoomModel.creditXpkf,50);
//        label_xpkf.setAnchorPoint(0,0.5);
//        label_xpkf.setPosition(200,70);
//        this.btn_xipai.addChild(label_xpkf);
//
//        this.btn_xipai.addTouchEventListener(this.onClickBtn, this);
//
//        //this.btn_close = new ccui.Button("res/ui/bjdmj/popup/close1.png","res/ui/bjdmj/popup/close1.png");
//        //this.btn_close.setPosition(cc.winSize.width - 100,cc.winSize.height - 100);
//        //this.addChild(this.btn_close,10);
//        //
//        //this.btn_close.addTouchEventListener(this.onClickBtn,this);
//    },
//
//    addBenRenIcon:function(idx){
//        var icon = new cc.Sprite("res/res_sdh/jiesuan/benren.png");
//        icon.setAnchorPoint(0,1);
//        icon.setPosition(idx == 0?6:486,idx <=1?533:533 - (idx-1)*123);
//        this.layerBg.addChild(icon,2);
//    },
//
//    addTitleImg:function(type){
//        var img = "res/res_sdh/jiesuan/biaoti.png";
//        if(type < 0){
//            img = "res/res_sdh/jiesuan/biaoti1.png";
//        }
//        var title = new cc.Sprite(img);
//        title.setPosition(this.layerBg.width/2,this.layerBg.height);
//        this.layerBg.addChild(title,1);
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
//                if(SDHRoomModel.replay){
//                    return;
//                }
//
//                if((SDHRoomModel.nowBurCount == SDHRoomModel.totalBurCount) || (this.msgData.ext[21] == 1)){
//                    var BigResultLayer = SDHRoomModel.getBigResultLayer();
//                    var layer = new BigResultLayer(this.msgData);
//                    PopupManager.addPopup(layer);
//
//                }else{
//                    sySocket.sendComReqMsg(3);
//                }
//            }else if(sender == this.btn_xipai){
//                sySocket.sendComReqMsg(4501, [], "");
//                PopupManager.remove(this);
//                if((SDHRoomModel.nowBurCount == SDHRoomModel.totalBurCount) || (this.msgData.ext[21] == 1)){
//                    var BigResultLayer = SDHRoomModel.getBigResultLayer();
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

var SDHSmallResultLayer = PKSmallResultPop.extend({

    ctor: function (data,isRePlay) {
        this.isRePlay = SDHRoomModel.replay;
        this.data = data;
        this._super("res/sdhSmallResult.json");
    },

    selfRender: function () {
        var players = this.data.closingPlayers || [];
        var localList = {1:[0,1,2],2:[1,2,0],3:[2,0,1]};
        if(SDHRoomModel.renshu == 4){
            localList = {1:[0,1,3,2],2:[1,2,0,3],3:[2,3,1,0],4:[3,0,2,1]};
        }
        var seat = 1;
        for(var i = 0;i<players.length;++i){
            if(players[i].userId == PlayerModel.userId){
                seat = players[i].seat;
                break;
            }
        }
        var result = localList[seat] || [];

        for(var j = 0;j < result.length;++j){
            var widget = this.getWidget("player"+(j + 1));
            if(players[result[j]]){
                this.showPlayerMsg(widget,players[result[j]],j + 1);
            }
        }

        //for(var i = 0;i<players.length;++i){
        //    var widget = this.getWidget("player"+(i + 1));
        //    if(players[i]){
        //        this.showPlayerMsg(widget,players[i],i + 1);
        //    }
        //}

        if(SDHRoomModel.renshu == 2){
            this.getWidget("player3").visible = false;
        }else if(SDHRoomModel.renshu == 3){
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
        if(SDHRoomModel.isGameSite>0)
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

        this.getWidget("Label_roomnum").setString("房间号:"+SDHRoomModel.tableId);
        var jushuStr = "第" + SDHRoomModel.nowBurCount + "局";
        this.getWidget("Label_jushu").setString(jushuStr);
        //玩法显示
        var wanfaStr = "";
        if(!this.isRePlay){
            wanfaStr = ClubRecallDetailModel.getXTSDHWanfa(SDHRoomModel.intParams,true);
        }
        if (SDHRoomModel.wanfa == GameTypeEunmPK.XTBP){
            wanfaStr = ClubRecallDetailModel.getXTBPWanfa(SDHRoomModel.intParams,true);
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
        // cc.log("SDHRoomModel.creditConfig =",SDHRoomModel.creditConfig);
        if ((SDHRoomModel.nowBurCount == SDHRoomModel.totalBurCount) || (this.data.ext[21] == 1)) {
            xipai_btn.visible = false;
        }else{
            xipai_btn.visible = SDHRoomModel.creditConfig[10] == 1;
        }
        var xpkf = SDHRoomModel.creditXpkf || 0;
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

        var selfNode = ccui.helper.seekWidgetByName(widget,"Image_self");
        selfNode.visible = index == 1;

        var jiaofen = "";
        var defen = "";
        var typeStr = "";

        if(user.boom == 1){
            jiaofen = "叫分:"+this.data.ext[22];
            defen = "得分:"+this.data.ext[23];

            var config = {"-3":"大倒","-2":"小倒","-1":"垮庄","1":"过庄","2":"小光","3":"大光"};
            var type = SDHRoomModel.getScoreType(this.data.ext[22],this.data.ext[23]);

            if(this.data.ext[26] == 1){
                typeStr +="投降" + " ";
            }else if(config[type]){
                typeStr +=config[type] + " ";
            }

            if(this.data.ext[24] == 1) typeStr +="抠底" + " ";
            if(this.data.ext[25] == 1) typeStr +="加拍" + " ";

            if((SDHRoomModel.intParams[13] == 1) || (SDHRoomModel.intParams[18] == 1 && this.data.ext[26] == 1)){//选了叫分进档
                if(jiaofen <= 30){
                    typeStr +="三档";
                }else if(jiaofen <= 50){
                    typeStr +="二档";
                }
            }
        }

        ccui.helper.seekWidgetByName(widget,"zf").setString(jiaofen);
        ccui.helper.seekWidgetByName(widget,"df").setString(defen);
        ccui.helper.seekWidgetByName(widget,"result").setString(typeStr);

        var defaultimg = "res/res/pkCommon/pkSmallResult/daTouxiang.png";
        var icon = ccui.helper.seekWidgetByName(widget,"icon");

        if(icon.getChildByTag(345))
            icon.removeChildByTag(345);

        var sprite = new cc.Sprite(defaultimg);
        //sprite.scale = 0.65;
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

        var localColor = cc.color("#11930a");
        var point = ccui.helper.seekWidgetByName(widget,"point");
        if(user.point < 0){
            localColor = cc.color("#ce0030");
        }
        point.setColor(localColor);
        point.setString(user.point);

        var Image_94 = this.getWidget("Image_94");
        var imgUrl = user.point > 0 ? "res/res_gameCom/smallResult/sl.png" : "res/res_gameCom/smallResult/sb.png";
        if(user.userId == PlayerModel.userId || (this.isRePlay && index == 1)){
            Image_94.loadTexture(imgUrl);
        }

        //显示玩家ID
        ccui.helper.seekWidgetByName(widget,"id").setString("ID:" + user.userId);
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

        if(SDHRoomModel.replay){
            return;
        }

        if((SDHRoomModel.nowBurCount == SDHRoomModel.totalBurCount) || (this.data.ext[21] == 1)){
            var BigResultLayer = SDHRoomModel.getBigResultLayer();
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
