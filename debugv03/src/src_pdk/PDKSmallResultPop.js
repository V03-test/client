
/**
 * Created by zhoufan on 2016/6/30.//
 */
var PDKSmallResultPop = PKSmallResultPop.extend({

    ctor: function (data,isRePlay) {
        this.isRePlay = isRePlay;
        this.data = data;
        this._super("res/pdkSmallResult.json");
    },

    selfRender: function () {
        //根据我的位置控制显示顺序
        var mySeat = 1;
        for(var indexOfPlayer = 0 ; indexOfPlayer < this.data.length ; indexOfPlayer ++){
            if(this.data[indexOfPlayer].userId == PlayerModel.userId){
                mySeat = this.data[indexOfPlayer].seat;
            }
        }
        var upSeat = this.getUpSeat(mySeat);
        var nextSeat = this.getNextSeat(mySeat);

        var showSeq = [];
        if(PDKRoomModel.renshu == 3){
            showSeq.push(mySeat);
            showSeq.push(upSeat);
            showSeq.push(nextSeat);
        }else{
            showSeq.push(mySeat);
            if(mySeat == 1){
                showSeq.push(2);
            }else if(mySeat == 2){
                showSeq.push(1);
            }
        }

        for(var indexShow = 0 ; indexShow < PDKRoomModel.renshu ; indexShow ++){
            var showSeat = showSeq[indexShow];
            for(var indexOfData = 0 ; indexOfData < PDKRoomModel.renshu ; indexOfData ++){
                cc.log("this.data[indexOfData].seat" , this.data[indexOfData].seat , showSeat);
                if(this.data[indexOfData].seat == showSeat){
                    var widget = this.getWidget("player"+(indexShow + 1));
                    this.showPlayerMsg(widget,this.data[indexOfData],indexShow + 1);
                }
            }


        }

        if(PDKRoomModel.renshu == 2){
            this.getWidget("player3").visible = false;
        }

        if (ClosingInfoModel.pdkcutCard.length > 0){
            var player4 = this.getWidget("player4");
            player4.visible = true;
            var pupaiSprite = ccui.helper.seekWidgetByName(player4,"p");
            var allcardIds = [];
            for(var index = 0 ; index < ClosingInfoModel.pdkcutCard.length ; index ++){
                allcardIds.push(PDKAI.getCardDef(parseInt(ClosingInfoModel.pdkcutCard[index])));
            }
            this.sortCards(allcardIds);
            var isHongshi = PDKRoomModel.isHongShi();
            for(var j = 0; j < allcardIds.length ; j ++) {
                var card = new PDKBigCard(allcardIds[j] , 2);
                card.setScale(0.36);
                card.anchorX = card.anchorY = 0;
                card.x = -120 + j*40;
                card.y = 5;
                pupaiSprite.addChild(card,5);
                if (isHongshi && allcardIds[j].n == 10 && allcardIds[j].t == 3){
                    var sprite = new cc.Sprite("res/res_pdk/pdkRoom/img_xiabiao.png");
                    sprite.x = 27;
                    sprite.y = 27;
                    card.addChild(sprite);
                }
            }
        }
        this.issent = false;
        this.addCustomEvent(SyEvent.SETTLEMENT_SUCCESS,this,this.onSettlement);
        var btnok = this.getWidget("btnok");
        var btClose = this.getWidget("close_btn");

        UITools.addClickEvent(btnok,this,this.onOk);
        UITools.addClickEvent(btClose , this , this.onBreak);

        this.dt = 0;
        this.start = 3;
        if(PDKRoomModel.isGameSite>0)
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

        this.getWidget("Label_roomnum").setString("房间号:"+ClosingInfoModel.ext[0]);
        var jushuStr = "第" + ClosingInfoModel.ext[4] + "局";
        if (PDKRoomModel.totalBurCount != 0){
            jushuStr = "第" + ClosingInfoModel.ext[4] + "/" + PDKRoomModel.totalBurCount + "局 ";
        }
        this.getWidget("Label_jushu").setString(jushuStr);
        //玩法显示
        var wanfaStr = "";
        if(!this.isRePlay){
            wanfaStr = PDKRoomModel.getWanfaString();
        }
        this.getWidget("Label_wanfa").setString(wanfaStr);
        if(this.isRePlay){
            var str = "第" + ClosingInfoModel.ext[4] + "局";
            this.getWidget("Label_jushu").setString(str);
        }

        var qyqID = "";
        if(ClosingInfoModel.ext[12] && ClosingInfoModel.ext[12] != 0 && ClosingInfoModel.ext[12] != ""){
            qyqID = "亲友苑ID:" + ClosingInfoModel.ext[12];
        }
        this.getWidget("Label_clubID").setString(qyqID);
        
        var xipai_btn = this.getWidget("xipai_btn");
        UITools.addClickEvent(xipai_btn,this,function(){
            sySocket.sendComReqMsg(4501,[],"");
            this.issent = true;
            this.visible = false;
            this.onOk();
        });
        // cc.log("PDKRoomModel.creditConfig =",PDKRoomModel.creditConfig);
        if(PDKRoomModel.nowBurCount == PDKRoomModel.totalBurCount || (ClosingInfoModel.ext[24] == 1)){
            xipai_btn.visible = false;
        }else{
            xipai_btn.visible = PDKRoomModel.creditConfig[10] == 1;
        }
        var xpkf = (PDKRoomModel.creditXpkf || 0).toString();
        this.getWidget("label_xpkf").setString(xpkf);
        
         if (this.isRePlay){
             //this.getWidget("replay_tip").visible =  true;
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

        var Image_sf = ccui.helper.seekWidgetByName(widget,"Image_sf");
        var path = "res/pkCommon/pkSmallResult/brFront.png";

        if(user.userId == PlayerModel.userId) {
            ccui.helper.seekWidgetByName(widget,"Image_self").visible = true;
        }else{
            path = index == 3 ? "res/pkCommon/pkSmallResult/sjFront.png": "res/pkCommon/pkSmallResult/xjFront.png";
        }
        Image_sf.loadTexture(path);

        ccui.helper.seekWidgetByName(widget,"sy").setString("剩余:"+user.leftCardNum);
        ccui.helper.seekWidgetByName(widget,"zd").setString("炸弹:"+user.boom);

        ccui.helper.seekWidgetByName(widget,"qg").visible = false;

        var defaultimg = "res/res_gameCom/default_m.png";
        var icon = ccui.helper.seekWidgetByName(widget,"icon");

        if(icon.getChildByTag(345))
            icon.removeChildByTag(345);

        var sprite = new cc.Sprite(defaultimg);
        sprite.scale = 0.65;
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

        var tstrAllCards = user.ext[0].substring(1 , user.ext[0].length - 1);
        var allCards = tstrAllCards.split(',');
        var ids = user.cards||[];
        var cardIds = [];   //未打出的牌
        var allcardIds = [];//所有手牌

        for(var index = 0 ; index < allCards.length ; index ++){
            allcardIds.push(PDKAI.getCardDef(parseInt(allCards[index])));
        }

        for(var j = 0 ; j < ids.length ; j ++) {
            cardIds.push(PDKAI.getCardDef(ids[j]));
        }

        this.sortCards(allcardIds);
        var isHongshi = PDKRoomModel.isHongShi();
        for(var j = 0; j < allcardIds.length ; j ++) {
            var card = new PDKBigCard(allcardIds[j] , 2);
            card.setScale(0.36);
            card.anchorX = card.anchorY = 0;
            card.x = 0 + 40 * j;
            card.y = 5;

            if(ArrayUtil.indexOf(ids , allcardIds[j].c) < 0){//是已经打出去的牌
                card.disableAction();
            }
            ccui.helper.seekWidgetByName(widget,"p").addChild(card);
            if (isHongshi && allcardIds[j].n == 10 && allcardIds[j].t == 3){
                var sprite = new cc.Sprite("res/res_pdk/pdkRoom/img_xiabiao.png");
                sprite.x = 27;
                sprite.y = 27;
                card.addChild(sprite);
            }
        }

        var localColor = cc.color("#11930a");
        //显示炸弹分数
        var zdpoint = ccui.helper.seekWidgetByName(widget,"zdpoint");
        if(user.ext[1] < 0){
            localColor = cc.color("#ce0030");
        }
        zdpoint.setColor(localColor);
        zdpoint.setString(user.ext[1] + "");

        var point = ccui.helper.seekWidgetByName(widget,"point");
        localColor = cc.color("#11930a");
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
        cc.log("user.ext[13] =",user.ext[13]);
        //玩家飘分图片
        //if (user.ext[13] == -1){
            ccui.helper.seekWidgetByName(widget,"piaofen").visible = false;
        //}else{
        //    ccui.helper.seekWidgetByName(widget,"piaofen").loadTexture("res/res_pdk/pdkRoom/biao_piao"+user.ext[13]+".png");
        //}
        ////房主标识
        //if(user.userId == ClosingInfoModel.ext[1]){
        //    var fangzhu = new cc.Sprite("res/res_pdk/pdkSmallResult/fangzhu.png");
        //    fangzhu.anchorX = fangzhu.anchorY = 0;
        //    fangzhu.x = -80;
        //    fangzhu.y = -25;
        //    icon.addChild(fangzhu,10);
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
        var data = this.data;
        // cc.log("data.ext[24] =",JSON.stringify(data));
        if(PDKRoomModel.isGameSite>0){
            LayerManager.showLayer(LayerFactory.HOME);
            PopupManager.remove(this);
            PopupManager.removeAll();
            sySocket.sendComReqMsg(201,[],"");
        }else if(ClosingInfoModel.isReplay){
            LayerManager.showLayer(LayerFactory.HOME);
            PopupManager.remove(this);
            return;
        }else{
            if(PDKRoomModel.nowBurCount == PDKRoomModel.totalBurCount || (ClosingInfoModel.ext[24] == 1)){//最后的结算 PDKRoomModel.totalBurCount
                PopupManager.remove(this);
                var mc = new PDKBigResultPop(data);
                PopupManager.addPopup(mc);
            }else{
                this.issent = true;
                sySocket.sendComReqMsg(3);
            }
        }
    },

    onClose:function(){
        this.issent = true;
        sySocket.sendComReqMsg(3);
        this.unscheduleUpdate();
    },

    sortCards:function(cardids){
        var length = cardids.length;
        cc.log("length ..." , length);
        var s1 = function(c1,c2){
            var n1 = c1.i;
            var n2 = c2.i;
            if(n1 == n2){
                var t1 = c1.t;
                var t2 = c2.t;
                return t2-t1;
            }else{
                return n2-n1;
            }
        }
        cardids.sort(s1);
    },

    getUpSeat:function(seat){

        if(seat == 1){
            return 3;
        }else{
            return seat - 1;
        }

    },

    getNextSeat:function(seat){
        if(seat == 3){
            return 1;
        }else{
            return seat + 1;
        }

    },

});
