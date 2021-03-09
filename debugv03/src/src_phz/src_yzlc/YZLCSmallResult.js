/**
 * Created by Administrator on 2020/3/20.
 */
var YZLCNewSmallResultCell = ccui.Widget.extend({
    ctor:function(data){
        this._super();
        var cards = data.cards;
        this.anchorX=0;
        this.anchorY=0;
        var width = 80;
        var zorder = cards.length;
        if(zorder > 4){
            width = 160;
        }
        this.setContentSize(width,300);
        for(var i=0;i<cards.length;i++){
            zorder--;
            var vo = PHZAI.getPHZDef(cards[i]);
            var card = new YZLCCard(PHZAI.getDisplayVo(this.direct,3),vo);
            if(i < 4){
                card.x = 4;
                card.y = 40 + i * 60;
            }else{
                card.x = 40;
                card.y = 40 + (i%4) * 60;
            }
            card.scale = 1.2;
            this.addChild(card,zorder);
        }
    }
});

var YZLCSmallResultPop=BasePopup.extend({
    pointInfo:null,
    isRePlay:null,
    ctor: function (data,isRePlay) {
        this.data = data;
        this.isRePlay = !!isRePlay;
        var path = "res/phzNewSmallResult.json";
        this._super(path);
    },

    selfRender: function () {
        this.addCustomEvent(SyEvent.SOCKET_OPENED,this,this.onSuc);
        this.addCustomEvent(SyEvent.GET_SERVER_SUC,this,this.onChooseCallBack);
        this.addCustomEvent(SyEvent.NOGET_SERVER_ERR,this,this.onChooseCallBack);


        var isHuang = false;
        this.winUserId = 0;
        this.data.sort(function (user1 , user2){
            var point1 = parseInt(user1.point);
            var point2 = parseInt(user2.point);
            return  point1 < point2;
        });
        var myPoint = 0;
        var isYk = false;
        for(var i=0;i<this.data.length;i++){
            if(this.data[i].seat == PHZRoomModel.mySeat || (this.isRePlay && this.data[i].userId == PlayerModel.userId)){
                myPoint = this.data[i].point;
                isYk = true;
            }
        }
        var Image_84 = this.getWidget("Image_84");
        var imgUrl = myPoint > 0 ? "res/res_gameCom/smallResult/sl.png" : "res/res_gameCom/smallResult/sb.png";

        if(PHZRoomModel.wanfa == GameTypeEunmZP.SYBP){
            if(ClosingInfoModel.huSeat){/**/

            }else{
                isHuang = true;
            }
        }else{
            for(var i=0;i<this.data.length;i++){
                if(this.data[i].point>0){
                    break;
                }else if(this.data[i].point==0){
                    isHuang = true;
                    break;
                }
            }
        }

        if(this.isRePlay && !isYk){
            imgUrl = "res/res_gameCom/smallResult/sl.png";
        }

        if(isHuang){
            imgUrl = "res/res_gameCom/smallResult/hj.png";
        }

        Image_84.loadTexture(imgUrl);

        if(this.data.length==3){
            this.getWidget("user4").visible = false;
        }else if(this.data.length==2){
            this.getWidget("user4").visible = false;
            this.getWidget("user3").visible = false;
        }

        var xingSeat = -1;
        var huSeat = -1;
        for(var i=0;i<this.data.length;i++){
            this.refreshSingle(this.getWidget("user"+(i+1)),this.data[i] , "" , i);
            if(this.data[i].seat == this.data[i].isShuXing){
                xingSeat = i;
            }
            if(ClosingInfoModel.huSeat == this.data[i].seat){
                huSeat = i;
            }
        }
        this.list = this.getWidget("ListView_6");
        var cards = ClosingInfoModel.cards;

        for(var i=0;i<cards.length;i++){
            if(cards[i].cards.length > 4){
                for(var t = 0;t<cards[i].cards.length/2;++t){
                    var tempCards = cards[i].cards.slice(t*2,t*2+2);
                    var data = ObjectUtil.deepCopy(cards[i]);
                    data.cards = tempCards;
                    var cell = new YZLCNewSmallResultCell(data,PHZRoomModel.wanfa);
                    this.list.pushBackCustomItem(cell);
                }
            }else{
                var cell = new YZLCNewSmallResultCell(cards[i],PHZRoomModel.wanfa);
                this.list.pushBackCustomItem(cell);
            }
        }

        var leftCards = ClosingInfoModel.leftCards;
        var dipaiPanel = this.getWidget("Panel_dipai");
        var localNum = 13;
        var offX = 62;
        var scaleNum = 1;
        for(var i=0;i<leftCards.length;i++){
            var index = i;
            var vo = PHZAI.getPHZDef(leftCards[i]);
            if (i == 0){
                vo.ishu = true;
            }
            var card = new PHZCard(PHZAI.getDisplayVo(this.direct,3),vo);
            var diffY = card.getContentSize().height * 0.96;
            card.scale = scaleNum;
            var numY = Math.floor(index/localNum);
            var numX = index%localNum;
            card.x = 150 + numX * offX * scaleNum;
            card.y = card.y - diffY * numY - 15;
            dipaiPanel.addChild(card);
        }
        var maipaiPanel = this.getWidget("Panel_maipai");
        var maiPaiCards = ClosingInfoModel.chouCards;
        if (maiPaiCards && maiPaiCards.length > 0){
            maipaiPanel.y += 245;
            maipaiPanel.visible=true;
            localNum = 5;
            for(var i=0;i<maiPaiCards.length;i++){
                var card = new YZLCCard(PHZAI.getDisplayVo(this.direct,3),PHZAI.getPHZDef(maiPaiCards[i]));
                var diffY = card.getContentSize().height *0.96;
                var numY = Math.floor(i/localNum);
                var numX = i%localNum;
                card.x = 100 + numX * offX;
                card.y = card.y - diffY * numY - 15;
                maipaiPanel.addChild(card);
            }
        }else{
            maipaiPanel.visible=false;
        }

        var str = "";
        var tunStr = "";
        var isHas = false;
        if (ClosingInfoModel.fanTypes){
            var data = ClosingInfoModel.fanTypes || [];
            var configObj = {
                1: " 黑戳 ", 2: " 红戳 ", 3: " 见红加分 ",
                4: " 红戳 "
            };
            for(var i=0;i<data.length;i++) {
                if (data[i]) {
                    var tempVal = parseInt(data[i]);
                    var tunshu = tempVal % 100;
                    tempVal = Math.floor(tempVal/100);
                    tempVal = Math.floor(tempVal / 10);
                    var typeVal = tempVal % 100;
                    if (configObj[typeVal]) {
                        if(typeVal != 3){
                            isHas = true;
                            str += configObj[typeVal] + "*" + tunshu;
                        }else{
                            str += configObj[typeVal] + "+" + tunshu;
                        }
                    }
                }
                str += "\n";
            }
        }

        if(ClosingInfoModel.tun > 0){
            tunStr += "基本分"+ClosingInfoModel.tun + "  ";
            if(!isHas){/** 不是黑戳红戳才显示基本分 **/
               str += tunStr;
            }
        }

        if(ClosingInfoModel.huxi>0){
            str += "戳子: " + ClosingInfoModel.huxi + "  ";
        }

        this.getWidget("dataLabel").setString(str);/**  牌型显示 **/

        this.resultView = this.getWidget("resultView");
        this.roomView = this.getWidget("roomView");

        this.Button_2 = this.getWidget("Button_2");
        this.Button_Ready = this.getWidget("btnReady");
        UITools.addClickEvent(this.Button_2,this,this.onOk);
        UITools.addClickEvent(this.Button_Ready,this,this.onOk);

        this.Button_zm = this.getWidget("Button_15");
        this.Button_toResultView = this.getWidget("btnToResultView");

        var xipai_btn = this.getWidget("xipai_btn");
        UITools.addClickEvent(xipai_btn,this,function(){
            sySocket.sendComReqMsg(4501,[],"");
            this.issent = true;
            PopupManager.remove(this);
            this.onOk();
        });
        if(PHZRoomModel.nowBurCount == PHZRoomModel.totalBurCount || ClosingInfoModel.ext[6] == 1){
            xipai_btn.visible = false;
        }else{
            xipai_btn.visible = PHZRoomModel.creditConfig[10] == 1;
        }
        var xpkf = PHZRoomModel.creditXpkf ? PHZRoomModel.creditXpkf.toString() : 0;
        this.getWidget("label_xpkf").setString(xpkf);

        UITools.addClickEvent(this.Button_zm,this,this.onZhuoMian);
        UITools.addClickEvent(this.Button_toResultView , this, this.onJieSuan);
        this.onJieSuan();
        var btn_jiesan = this.getWidget("btn_jiesan");
        btn_jiesan.visible = !this.isRePlay;

        UITools.addClickEvent(btn_jiesan,this,this.onBreak);

        var btn_handXq = this.getWidget("btn_handXq");
        UITools.addClickEvent(btn_handXq,this,this.onHandCard);

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
        var jushuStr = "第" + PHZRoomModel.nowBurCount + "局";
        this.getWidget("Label_jushu").setString(jushuStr);
        //玩法显示
        var wanfaStr = "";
        this.getWidget("Label_wanfa").setString(wanfaStr);
        if(this.isRePlay){
            var str = "第" + PHZRePlayModel.playCount + "局";
            this.getWidget("Label_jushu").setString(str);
        }

        if (this.isRePlay){
            this.getWidget("replay_tip").visible =  true;
            this.getWidget("replay_tip").x -= 220;
            this.getWidget("replay_tip").setString("回放码:"+BaseRoomModel.curHfm);
        }else{
            this.getWidget("replay_tip").visible =  false;
        }
    },

    onClickUserBg:function(event){
        var data = event.temp;
        var mc = new PHZUserHandCardPop(data);
        PopupManager.addPopup(mc);
    },

    refreshSingle:function(widget,user,pointInfo , index){
        if(user.isShuXing){
            if(user.seat == user.isShuXing){
                ccui.helper.seekWidgetByName(widget,"sx").visible = true;
            }else{
                ccui.helper.seekWidgetByName(widget,"sx").visible = false;
            }
        }else{
            ccui.helper.seekWidgetByName(widget,"sx").visible = false;
        }

        var Button_click = ccui.helper.seekWidgetByName(widget,"Button_click");
        Button_click.temp = user;
        UITools.addClickEvent(Button_click,this,this.onClickUserBg);

        ccui.helper.seekWidgetByName(widget,"name").setString(user.name);
        ccui.helper.seekWidgetByName(widget, "uid").setString("UID:" + user.userId);
        var icon = ccui.helper.seekWidgetByName(widget,"icon");
        var defaultimg = "res/res_gameCom/default_m.png";
        var sprite = new cc.Sprite(defaultimg);
        //sprite.scale=0.98;
        sprite.x = icon.width / 2;
        sprite.y = icon.height / 2;
        icon.addChild(sprite,5,345);
        if(user.icon){
            cc.loader.loadImg(user.icon, {width: 75, height: 75}, function (error, img) {
                if (!error) {
                    sprite.setTexture(img);
                }
            });
        }

        var point = ccui.helper.seekWidgetByName(widget,"point");

        var pointStr = "";

        if (parseInt(user.point) > 0 ){
            pointStr = "+" + user.point;
        }else{
            pointStr = "" + user.point;
        }

        point.setString(pointStr);

        if (user.totalPoint != null ){
            var totalPointStr = "累计:" + user.totalPoint;
            var totalPoint = ccui.helper.seekWidgetByName(widget,"totalPoint");
            totalPoint.setString(totalPointStr);

        }

        //增加房主的显示
        if(user.userId == ClosingInfoModel.ext[1]){
            var fangzhu = new cc.Sprite("res/res_phz/fangzhu.png");
            fangzhu.anchorX = fangzhu.anchorY = 1;
            fangzhu.x = icon.width;
            fangzhu.y = icon.height;
            icon.addChild(fangzhu,10);
        }
        if (index == 0){
            var nowPoint = this.getWidget("heiji");
            nowPoint.setString("共计:" + user.point);
        }
    },

    onOk:function(){
        if(ClosingInfoModel.isReplay || !LayerManager.isInRoom()){
            if(PopupManager.getClassByPopup(YZLCReplay)){
                PopupManager.removeClassByPopup(YZLCReplay);
            }
            PopupManager.remove(this);
            return;
        }
        var data = this.data;
        // var isDjtgEnd = 0;
        if(ClosingInfoModel.ext[3] == GameTypeEunmZP.SYZP || ClosingInfoModel.ext[3] == 36 || ClosingInfoModel.ext[3] == 38){
            if(PHZRoomModel.nowBurCount == PHZRoomModel.totalBurCount || ClosingInfoModel.ext[6] == 1){//最后的结算
                PopupManager.remove(this);
                var mc = new YZLCBigResultPop(data);
                PopupManager.addPopup(mc);
                var obj = HongBaoModel.getOneMsg();
                if(obj){
                    var mc = new HongBaoPop(obj.type,obj.data);
                    PopupManager.addPopup(mc);
                }
            }else{
                if (PHZRoomModel.isStart){
                    PHZRoomModel.cleanSPanel();
                    PopupManager.remove(this);
                    sySocket.sendComReqMsg(3);
                }else{
                    sySocket.sendComReqMsg(3);
                }
            }
        }else{
            if(ClosingInfoModel.ext[6] == 1){//最后的结算
                PopupManager.remove(this);
                var mc = new YZLCBigResultPop(data);
                PopupManager.addPopup(mc);
                var obj = HongBaoModel.getOneMsg();
                if(obj){
                    var mc = new HongBaoPop(obj.type,obj.data);
                    PopupManager.addPopup(mc);
                }
            }else{
                if (PHZRoomModel.isStart){
                    PHZRoomModel.cleanSPanel();
                    PopupManager.remove(this);
                    sySocket.sendComReqMsg(3);
                }else{
                    sySocket.sendComReqMsg(3);
                }
            }
        }
    },

    onBreak:function(){
        PHZAlertPop.show("解散房间需所有玩家同意，确定要申请解散吗？",function(){
            sySocket.sendComReqMsg(7);
        })
    },

    onShare:function(){

    },

    onHandCard:function(){
        var mc = new PHZHandCardPop(this.data,ClosingInfoModel.ext[1] , this.winUserId);
        PopupManager.open(mc,true);
    },

    onJieSuan:function(){
        this.resultView.visible = true;
        this.roomView.visible = false;
    },

    onZhuoMian:function(){
        this.resultView.visible = false;
        this.roomView.visible = true;
    }
});
