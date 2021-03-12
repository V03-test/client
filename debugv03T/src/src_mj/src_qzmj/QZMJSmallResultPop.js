/**
 * Created by Administrator on 2021/2/1 0001.
 */
var QZMJSmallResultCell = ccui.Widget.extend({

    ctor:function(huUser,paoUser,record){
        this._super();
        var bg = new cc.Sprite("res/res_mj/mjSmallResult/mjSmallResult_2.png");
        bg.anchorX=bg.anchorY=0;
        this.addChild(bg);
        var name = UICtor.cLabel(huUser.name, 24, cc.size(200,32), cc.color(109,70,47), 1, 1);
        name.anchorX=name.anchorY=0;
        name.x = 0;
        name.y = (bg.height-name.height)/2;
        bg.addChild(name);

        var fanStr = "";
        var score = record[2];
        if(paoUser) {
            name = UICtor.cLabel(paoUser.name, 24, cc.size(200,32), cc.color(109,70,47), 0, 1);
            name.anchorX=name.anchorY=0;
            name.x = 275;
            name.y = (bg.height-name.height)/2;
            bg.addChild(name);
            fanStr += "点炮没听牌 包3家";

            var scoreLabel = new cc.LabelBMFont("-"+score,"res/font/font_mj1.fnt");
            scoreLabel.anchorX=scoreLabel.anchorY=0;
            scoreLabel.x = 385;
            scoreLabel.y = (bg.height-scoreLabel.height)/2;
            scoreLabel.setScale(0.65);
            bg.addChild(scoreLabel);
        } else {
            fanStr += "自摸吃3家";
            score = score*3;
        }
        //门清
        if (record[4] > 0) {
            fanStr += " 门清";
        }
        //硬将
        if (record[5] > 0) {
            fanStr += " 硬将";
        }
        //杠
        if (record[6] > 0) {
            fanStr += " 杠";
        }

        var scoreLabel = new cc.LabelBMFont("+"+score,"res/font/font_mj2.fnt");
        scoreLabel.anchorX=scoreLabel.anchorY=0;
        scoreLabel.x = 170;
        scoreLabel.y = (bg.height-scoreLabel.height)/2;
        scoreLabel.setScale(0.65);
        bg.addChild(scoreLabel);

        fanStr +="（"+record[3]+"番）";
        name = UICtor.cLabel(fanStr, 24, cc.size(350,0), cc.color(114,92,68), 0, 0);
        name.anchorX=name.anchorY=0;
        name.x = 460;
        name.y = (bg.height-name.height)/2;
        bg.addChild(name);

        this.setContentSize(bg.width,bg.height);
    }

})
var QZMJSmallResultPop = BasePopup.extend({

    ctor: function (data,isReplay) {
        this.data = data;
        this.isHu = false;
        this.isReplay = isReplay || false;
        this.huSeat = 0;
        this._super("res/mjSmallResult.json");
    },

    createMoldPais: function(widget,user) {
        var moldPais = user.moldPais;
        var count = 0;
        this.moldInitX = 115 + 100 + 140;
        var lastX = 0;
        var height = 70;
        for (var i=0;i<moldPais.length;i++) {
            var innerObject = moldPais[i];
            var innerAction = innerObject.action;
            var tempCards = innerObject.cards;
            var innerArray = [];
            for (var ia=0;ia<tempCards.length;ia++) {
                innerArray.push(MJAI.getMJDef(tempCards[ia]));
            }
            var gangVo = null;
            if((innerAction==MJAction.AN_GANG || innerAction==MJAction.GANG) && (innerArray.length>3 || innerObject.gangVo)){
                gangVo = innerArray.pop();
            }
            var actionDiffX = 5;
            for(var j=0;j<innerArray.length;j++){
                var innerVo = innerArray[j];
                if (innerAction==MJAction.AN_GANG) {
                    innerVo.a = 1;
                }
                var card = new QZMahjong(MJAI.getDisplayVo(1,2),innerVo);
                if(innerAction==MJAction.CHI && j == 0){
                    card.setCanThrow(false);
                }
                var size = card.getContentSize();
                var _scale = 0.6;
                card.scale = _scale;
                card.x = this.moldInitX + (size.width * _scale - 0.5) * count;
                card.y = height;
                lastX = card.x;
                widget.addChild(card,j == 1 ? 1 : 0);

                //杠的牌需要放一张牌到上面去
                if(gangVo && j==1){
                    if(!card.getChildByTag(333)){
                        var gang = new QZMahjong(MJAI.getDisplayVo(1,2),gangVo);
                        gang.y += 20;
                        gang.scale = 1;
                        card.addChild(gang,1,333);
                    }
                }
                count++;
            }
            this.moldInitX = this.moldInitX + actionDiffX;
        }
        this.moldInitX = lastX > 0 ? lastX+60 : this.moldInitX;
    },

    createHandPais: function(widget,user) {
        var handPais = user.handPais;
        var voArray = [];
        var qzmjHuPai = [];//如果是胡的那张牌
        if(user.isHu && user.isHu != 1000){
            qzmjHuPai.push(MJAI.getMJDef(user.isHu));
        }
        for (var i=0;i<handPais.length;i++) {
            if(handPais[i] == 1000){
                continue;
            }
            var vo = MJAI.getMJDef(handPais[i]);
            voArray.push(vo);
        }
        voArray.sort(MJAI.sortMJ);
        var first_wang = 0;
        var wangID = -1;

        if(this.isReplay){
            wangID = MJReplayModel.qzmj_wangID;
        }else{
            wangID = MJRoomModel.qzmj_wangID;
        }

        var height = 70;
        var localOffx = 0;
        if(this.moldInitX > 215){
            localOffx = 20;
        }
        var _wangVo = MJAI.getMJDef(wangID);
        if(_wangVo){
            if(_wangVo.t == 4 && _wangVo.n > 8){
                first_wang = (_wangVo.n + 1)>11?9:_wangVo.n + 1;
            }else{
                first_wang = (_wangVo.n + 1)>9?(_wangVo.n + 1)%9:_wangVo.n + 1;
            }
        }
        for (var i=0;i<voArray.length;i++) {
            voArray[i].isJs = 1;
            if (wangID && wangID != -1 && _wangVo){
                if (voArray[i].t ==  _wangVo.t && voArray[i].n == first_wang){
                    voArray[i].wang = 1;
                }
            }

            var card = new QZMahjong(MJAI.getDisplayVo(1,1),voArray[i]);
            var size = card.getContentSize();
            var _scale = 0.5;
            card.scale = _scale;
            card.x = this.moldInitX + (size.width * _scale - 0.5) * i + localOffx;
            card.y = height;
            widget.addChild(card);

            if (user.isHu == voArray[i].c){
                var huImg = new cc.Sprite("res/res_mj/mjSmallResult/mjSmallResult_15.png");
                huImg.x = size.width*0.80;
                huImg.y = size.height*0.17;
                card.addChild(huImg,1,5);
            }

            if(qzmjHuPai.length > 0 && qzmjHuPai[0]){
                for (var j = 0; j < qzmjHuPai.length; j++) {
                    var card = new QZMahjong(MJAI.getDisplayVo(1,1),qzmjHuPai[j]);
                    var size = card.getContentSize();
                    var _scale = 0.5;
                    card.scale = _scale;
                    card.x = this.moldInitX + (size.width * _scale - 0.5) * (voArray.length+j) + 60*(j+1);
                    card.y = height;
                    widget.addChild(card);

                    var huImg = new cc.Sprite("res/res_mj/mjSmallResult/mjSmallResult_15.png");
                    huImg.x = size.width*0.80;
                    huImg.y = size.height*0.17;
                    card.addChild(huImg,1,5);
                }
            }
        }
    },

    showXingCard: function(){
        var intParams = this.isReplay ? MJReplayModel.intParams : MJRoomModel.intParams;
        var ext = ClosingInfoModel.ext || [];
        if(intParams[10] > 0 && ext[11] && ext[11] != 0){
            this.Image_niao.loadTexture("res/pkCommon/pkSmallResult/xingpai.png");
            this.Image_niao.visible = true;
            this.Panel_niao.visible = true;
            var newData = MJAI.getMJDef(ext[11]);
            if(newData){
                var card = new QZMahjong(MJAI.getDisplayVo(1,2),newData);
                var _scale = 0.7;
                card.scale = _scale;
                card.x = 0;
                card.y = 0;
                this.Panel_niao.addChild(card);
            }
        }
    },

    createHuedPais: function(widget,user,isZiMo) {
        var hutxt = ccui.helper.seekWidgetByName(widget,"hutxt");
        hutxt.x += 70;
        hutxt.setString("");
        var huStrArr = [];

        var dahuConfig = {1:"小胡",2:"天胡",3:"地胡",4:"碰碰胡",5:"七小对",
            6:"清一色",7:"混一色",8:"字一色",9:"大三元",10:"烂牌",11:"七星归位",
            12:"抓鱼",13:"杠上花",14:"抢杠胡",15:"杠上炮",16:"报听",17:"无王",18:"四王"};

        var dahus = user.dahus || [];

        var isXihu = false;
        var xiaoHuIndex = -1;
        for(var i = 0;i<dahus.length;++i){
            if(dahus[i] == 2 || dahus[i] == 3 || dahus[i] == 4 || dahus[i] == 5 ||
                dahus[i] == 6 || dahus[i] == 7 || dahus[i] == 8 || dahus[i] == 9 ||
                dahus[i] == 10 || dahus[i] == 11 || dahus[i] == 17 || dahus[i] == 18){
                isXihu = true;
            }
            if(dahus[i] == 1){
                xiaoHuIndex = i;
            }
        }

        if(isXihu && xiaoHuIndex != -1){
            dahus.splice(xiaoHuIndex,1);
        }

        for(var i = 0;i<dahus.length;++i){
            if(dahuConfig[dahus[i]]){
                huStrArr.push(dahuConfig[dahus[i]]);
            }
        }

        var mingGang = 0;
        var anGang = 0;
        var moldPais = user.moldPais || [];
        for (var i=0;i<moldPais.length;i++) {
            var innerObject = moldPais[i];
            if(innerObject){
                if(innerObject.action == MJAction.AN_GANG){
                    ++anGang;
                }
                if(innerObject.action == MJAction.GANG){
                    ++mingGang;
                }
            }
        }

        if(mingGang > 0){
            huStrArr.push("明杠×"+mingGang);
        }

        if(anGang > 0){
            huStrArr.push("暗杠×"+anGang);
        }

        if(isZiMo && user.isHu){
            huStrArr.push("自摸");
        }

        var intParams = this.isReplay ? MJReplayModel.intParams : MJRoomModel.intParams;
        var ext = ClosingInfoModel.ext || [];
        if(intParams[10] > 0 && ext[12] && user.isHu && ext[12] != 0){
            huStrArr.push("翻醒×"+ext[12]);
        }

        var xiaohus = user.xiaohus || [];
        var localStr = "";
        for(var i = 0;i < xiaohus.length;++i){
            var localUser = this.getUserData(xiaohus[i]);
            if(localUser){
                if(localStr == ""){
                    localStr = localUser.name;
                }else{
                    localStr = "、" +localUser.name;
                }
            }
        }

        if(localStr != ""){
            huStrArr.push("与"+localStr+"互包");
        }

        hutxt.setString(huStrArr.join(" "));
    },

    refreshSingle: function(widget,user,isZimo){
        widget.visible = true;

        var tempName = MJRoomModel.newSubString(user.name,10);

        ccui.helper.seekWidgetByName(widget,"name").setString(tempName);

        ccui.helper.seekWidgetByName(widget,"uid").setString("ID:"+user.userId);
        //分数
        var pointLabel = ccui.helper.seekWidgetByName(widget,"point");
        var color = "67d4fc";
        if (user.point>0){
            color = "ff6648";
        }
        var point = user.point>0 ? "+"+user.point : ""+user.point;
        pointLabel.setString(""+point);
        pointLabel.setColor(cc.color(color+""));

        //庄家
        ccui.helper.seekWidgetByName(widget,"zhuang").visible = (user.seat==this.data.ext[6]);

        //头像
        var spritePanel = ccui.helper.seekWidgetByName(widget,"Image_icon");
        this.showIcon(spritePanel,user.icon);


        var isHu = false;
        if (user.isHu){
            isHu = true;
        }
        //胡牌
        ccui.helper.seekWidgetByName(widget,"Image_hu").visible = isHu;

        var isFanPao = false;
        if (user.fanPao){
            isFanPao = true;
        }
        //点炮
        ccui.helper.seekWidgetByName(widget,"Image_dianpao").visible = isFanPao;


        if(user.ext){
            if(user.ext[0] >= 0){
                ccui.helper.seekWidgetByName(widget,"piaofenImg").loadTexture("res/res_mj/mjSmallResult/biao_piao"+user.ext[0]+".png");
                ccui.helper.seekWidgetByName(widget,"piaofenImg").visible = true;
            }else{
                ccui.helper.seekWidgetByName(widget,"piaofenImg").visible = false;
            }
        }else{
            ccui.helper.seekWidgetByName(widget,"piaofenImg").visible = false;
        }


        this.createMoldPais(widget, user);
        this.createHandPais(widget, user);
        this.createHuedPais(widget, user, isZimo);
    },

    showIcon: function(icon,url) {
        //url = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        if (!url){
            return;
        }

        var defaultimg = "res/res_mj/mjBigResult/default_m.png";

        if(icon.getChildByTag(345))
            icon.removeChildByTag(345);

        var size = icon.getContentSize();
        var sprite = new cc.Sprite(defaultimg);
        var scale = 0.9;
        sprite.setScale(scale);
        sprite.x = size.width*0.5;
        sprite.y = size.height*0.5;
        icon.addChild(sprite,5,345);

        cc.loader.loadImg(url,{width: 75, height:75},function(error, texture){
            if(error==null){
                sprite.setTexture(texture);
            }
        });
    },

    getUserData: function(seat) {
        var user = null;
        for (var i=0;i<this.closingPlayers.length;i++) {
            if (this.closingPlayers[i].seat == seat) {
                user = this.closingPlayers[i];
                break;
            }
        }
        return user;
    },

    createHuCell: function(huRecord) {
        var ext = huRecord.ext;
        var huUser = this.getUserData(ext[0]);
        var paoUser = ext[1] > 0 ? this.getUserData(ext[1]) : null;
        return new QZMJSmallResultCell(huUser, paoUser, ext);
    },

    selfRender: function () {
        var btnok = this.getWidget("btnok");
        UITools.addClickEvent(btnok,this,this.onOk);
        var Button_11 = this.getWidget("Button_11");
        UITools.addClickEvent(Button_11,this,this.onCheckDesktop);
        this.closingPlayers = this.data.closingPlayers;
        this.huList = {};
        var huList = this.data.huList;
        if(huList) {
            for (var i = 0; i < huList.length; i++) {
                var huRecord = huList[i];
                var huUser = this.getUserData(huRecord.ext[0]);
                if (!this.huList[huUser.seat]) {
                    this.huList[huUser.seat] = [];
                }
                this.huList[huUser.seat].push(huRecord);
            }
        }

        var isZimo = true;
        for(var j=0;j<this.closingPlayers.length;j++) {
           if(this.closingPlayers[j] && this.closingPlayers[j].fanPao){
               isZimo = false;
               break;
           }
        }

        for(var j=1;j<=4;j++) {
            this.getWidget("user"+j).visible = false;
            for(var i=0;i<this.closingPlayers.length;i++){
                var user = this.closingPlayers[i];
                if(user.seat == j) {
                    this.refreshSingle(this.getWidget("user"+j),user,isZimo);
                    break;
                }
            }
        }

        this.label_rule = this.getWidget("label_rule");
        var wanfaStr = "";
        if(this.isReplay){

        }else{
            wanfaStr = ClubRecallDetailModel.getSpecificWanfa(MJRoomModel.intParams);
        }
        this.label_rule.setString(wanfaStr);

        if(this.label_rule.getAutoRenderSize().height < 80){
            this.label_rule.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            this.label_rule.setPositionY(this.label_rule.y + 10);
        }

        var qyqID = "";
        if(ClosingInfoModel.ext[0] && ClosingInfoModel.ext[0] != 0){
            qyqID = "亲友苑ID:" + ClosingInfoModel.ext[0] + "  ";
        }

        var jushuStr = "第" + MJRoomModel.nowBurCount + "/" + MJRoomModel.totalBurCount + "局";
        var roomIdStr = "房号:" + MJRoomModel.tableId;
        this.getWidget("info").setString(roomIdStr);

        if (ClosingInfoModel.isReplay){
            roomIdStr = "房号:" + ClosingInfoModel.ext[1];
            this.getWidget("info").setString(roomIdStr);
        }

        var date = new Date();
        var hours = date.getHours().toString();
        hours = hours.length < 2 ? "0"+hours : hours;
        var minutes = date.getMinutes().toString();
        minutes = minutes.length < 2 ? "0"+minutes : minutes;
        if(this.getWidget("Label_time")){
            this.getWidget("Label_time").setString(hours+":"+minutes);
        }

        this.getWidget("Label_jushu").setString(jushuStr);
        this.getWidget("Label_clubID").setString(qyqID);

        var btClose = this.getWidget("close_btn");
        UITools.addClickEvent(btClose , this , this.onBreak);
        if (this.isRePlay){
            btClose.visible = false;
        }

        //版本号
        if(this.getWidget("Label_version")){
            this.getWidget("Label_version").setString(SyVersion.v);
        }

        this.Panel_niao = this.getWidget("Panel_niao");
        this.Panel_niao.visible = false;
        this.Image_niao = this.getWidget("Image_niao");
        this.Image_niao.visible = false;

        this.showXingCard();

        if (ClosingInfoModel.isReplay){
            this.getWidget("replay_tip").visible =  true;
            this.getWidget("replay_tip").x -= 220;
            this.getWidget("replay_tip").setString("回放码:"+BaseRoomModel.curHfm);
        }

        var xipai_btn = this.getWidget("xipai_btn");
        UITools.addClickEvent(xipai_btn,this,function(){
            sySocket.sendComReqMsg(4501,[],"");
            this.issent = true;
            PopupManager.remove(this);
            this.onOk();
        });
        if(MJRoomModel.nowBurCount == MJRoomModel.totalBurCount
            || this.data.ext[9] == 1
            || this.data.isBreak){
            xipai_btn.visible = false;
        }else{
            xipai_btn.visible = MJRoomModel.creditConfig[10] == 1;
        }
        var xpkf = MJRoomModel.creditXpkf ? MJRoomModel.creditXpkf.toString() : 0;
        this.getWidget("label_xpkf").setString(""+xpkf);

        var Button_yupai = this.getWidget("Button_yupai");
        UITools.addClickEvent(Button_yupai,this,this.onShowMoreResult);
        Button_yupai.visible = true;
    },

    onBreak:function(){
        PHZAlertPop.show("解散房间需所有玩家同意，确定要申请解散吗？",function(){
            sySocket.sendComReqMsg(7);
        })
    },

    onShowMoreResult:function(){
        var mc = new MJSmallResultOtherPop(this.data);
        PopupManager.addPopup(mc);
    },

    onCheckDesktop:function(){
        PopupManager.remove(this);
    },

    onOk:function(){
        if(ClosingInfoModel.isReplay || !LayerManager.isInMJ()){
            if (ClosingInfoModel.isReplay){
                LayerManager.showLayer(LayerFactory.HOME);
            }
            PopupManager.remove(this);
            return;
        }
        var data = this.data;
        var isBreak = data.ext[9] == 1;
        if(MJRoomModel.nowBurCount == MJRoomModel.totalBurCount || isBreak){//最后的结算
            PopupManager.remove(this);
            var mc = new AHMJBigResultPop(data);
            PopupManager.addPopup(mc);
        }else{
            this.issent = true;
            sySocket.sendComReqMsg(3);
        }
    }
});

