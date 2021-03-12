/**
 * Created by cyp on 2019/6/27.
 * 选主按钮层
 */
var YYBSSelectZhuLayer = cc.Layer.extend({
    layerType:1,

    ctor:function(){
        this._super();

        this.initLayer();
    },

    handleTableData:function(type,data){
        if(type == YYBSTabelType.CreateTable){
            if(YYBSRoomModel.remain == 2 && YYBSRoomModel.nextSeat == YYBSRoomModel.mySeat){
                this.showLayerType(1);
                this.countTime();
                this.updateBtnNum();
            }else if(YYBSRoomModel.isSelectLiuShou()){
                this.showLayerType(2);
                this.countTime();
                this.updateBtnNum();
            }else{
                this.layerBg.setVisible(false);
            }
        }else if(type == YYBSTabelType.DingZhuang){
            if(data.strParams[0] == YYBSRoomModel.mySeat && YYBSRoomModel.remain == 2){
                this.showLayerType(1);
                this.countTime();
                this.updateBtnNum();
            }else{
                this.layerBg.setVisible(false);
            }
        }else if(type == YYBSTabelType.XuanZhu){
            this.layerBg.setVisible(false);
        }else if(type == YYBSTabelType.XuanLiuShou){
            var seat = data.params[0];
            if(seat == YYBSRoomModel.mySeat){
                this.layerBg.setVisible(false);
            }
        }else if(type == YYBSTabelType.PlayCard){
            if(data.cardType == 0 && YYBSRoomModel.isSelectLiuShou()){
                this.showLayerType(2);
                this.countTime();
                this.updateBtnNum();
            }else{
                this.layerBg.setVisible(false);
            }
        }
    },

    initLayer:function(){
        var bg = new ccui.ImageView("res/res_yybs/jiaofenBg.png");
        bg.setAnchorPoint(0.5,0);
        bg.setPosition(cc.winSize.width/2,410);
        this.addChild(bg);

        this.layerBg = bg;
        this.layerBg.setVisible(false);

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch,event){
                if(bg.isVisible() && cc.rectContainsPoint(bg.getBoundingBox(),touch.getLocation())){
                    return true;
                }
                return false;
            }
        }), this);

        var spr = new cc.Scale9Sprite("res/res_yybs/dushi.png");
        spr.setAnchorPoint(1,0.5);
        this.progressBar = new cc.ProgressTimer(spr);
        this.progressBar.setPosition(bg.width/2,298);
        this.progressBar.setBarChangeRate(cc.p(1,0));
        this.progressBar.setMidpoint(cc.p(1,0));
        this.progressBar.setType(cc.ProgressTimer.TYPE_BAR);
        bg.addChild(this.progressBar,1);
        this.progressBar.setPercentage(100);

        this.titleSpr = new cc.Sprite("res/res_yybs/qzdzp.png");
        this.titleSpr.setPosition(bg.width/2,240);
        bg.addChild(this.titleSpr);

        this.btnArr = [];

        var offsetX = 210;
        var imgArr = ["wuzhu","fangkuai","meihua","hongtao","heitao","quxiao"];
        var typeArr = [0,4,3,2,1,5];
        var numArr = [12,4,5,15,0];
        for(var i = 0;i<typeArr.length;++i){
            var btn = new ccui.Button("res/res_yybs/" + imgArr[i] +".png","res/res_yybs/"+(imgArr[i] + 1)+".png","");
            btn.setPosition(bg.width/2 + (i-2)*offsetX,105 + 20);
            btn.addTouchEventListener(this.onClickSelectZhuBtn,this);
            bg.addChild(btn,1);
            btn.flag = typeArr[i];
            btn.setName(imgArr[i]);

            //var img = "res/res_yybs/" + imgArr[btn.flag] + ".png";
            //var icon = new cc.Sprite(img);
            //icon.setPosition(btn.width/2,btn.height/2);
            //btn.addChild(icon);


            var num = new ccui.Text("","",36);//new cc.LabelBMFont(String(numArr[i]));//"res/res_sdh/font/jiaozhu.fnt"
            num.setPosition(btn.width - 30, 35);
            num.setTag(1);
            num.setString(String(numArr[i]));
            num.setFontName("res/font/bjdmj/fzcy.TTF");
            num.setColor(cc.color("#8e5035"));
            btn.addChild(num);

            if(typeArr[i] == 5){
                btn.setVisible(false);
                num.setVisible(false);
            }

            this.btnArr.push(btn);
        }

    },

    //界面显示未选主牌或者选择留守花色
    showLayerType:function(type){
        this.layerBg.setVisible(true);

        this.layerType = type;

        var newArr = [];

        for (var i = 0; i < this.btnArr.length; ++i) {
            var btn = this.btnArr[i];
            if (type == 2) {
                if (btn.flag != 0 && (btn.flag != YYBSRoomModel.selectZhu)) {
                    newArr.push(btn);
                } else {
                    btn.setVisible(false);
                }
            } else {
                if (btn.flag != 5 && btn.flag != 0) {
                    newArr.push(btn);
                } else {
                    btn.setVisible(false);
                }
            }
        }


        var offsetX = 210;
        for (var i = 0; i < newArr.length; ++i) {
            var btn = newArr[i];
            btn.setVisible(true);
            btn.setPositionX(this.layerBg.width / 2 + (i - (newArr.length - 1) / 2) * offsetX);
        }

        var img = type == 1 ? "res/res_yybs/qzdzp.png" : "res/res_yybs/qxzlshs.png";
        this.titleSpr.initWithFile(img);

    },

    onClickSelectZhuBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            if(this.layerType == 1){//选主
                sySocket.sendComReqMsg(3101,[sender.flag]);
            }else if(this.layerType == 2){//选留守花色
                sySocket.sendComReqMsg(3104,[sender.flag]);
            }

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    updateBtnNum:function(){
        var numArr = [0,0,0,0,0,0];
        var p = YYBSRoomModel.getPlayerDataByItem("seat",YYBSRoomModel.mySeat);
        if(p && p.handCardIds.length > 0){
            for(var i = 0;i< p.handCardIds.length;++i){
                var id = p.handCardIds[i];
                if((id == 502) || (id == 501) || (id%100 == 10) || (id%100 == 15)){
                    numArr[0]++;
                }else{
                    numArr[Math.floor(id/100)]++;
                }
            }
        }
        for(var i = 0;i<this.btnArr.length;++i){
            var flag = this.btnArr[i].flag;
            this.btnArr[i].getChildByTag(1).setString(String(numArr[flag]));
        }
    },

    countTime:function(){
        var time = YYBSRoomModel.getCountTime();

        this.progressBar.stopAllActions();
        this.progressBar.setPercentage(100);
        var action = new cc.ProgressTo(time - 5,1);
        this.progressBar.runAction(cc.sequence(action,cc.blink(5,5)));
    },
});