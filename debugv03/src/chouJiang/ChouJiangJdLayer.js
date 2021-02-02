/**
 * Created by cyp on 2020/7/22.
 * 显示抽奖进度的层
 */
var ChouJiangJdLayer = cc.Layer.extend({
    ctor:function(winCont,rewardArr,hasGetArr){
        this._super();

        this.winCount = winCont || 0;
        this.rewardArr = rewardArr || [];
        this.hasGetArr = hasGetArr || [];

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch,event){
                return true;
            }
        }), this);

        this.initLayer();

        this.setTotalNum(this.winCount);
        this.addJdItem(this.winCount,this.rewardArr,this.hasGetArr);
    },

    initLayer:function(){
        var grayLayer = new cc.LayerColor(cc.color.BLACK);
        grayLayer.setOpacity(180);
        this.addChild(grayLayer);

        this.layerBg = new cc.Sprite("res/choujiang/jd_bg.png");
        this.layerBg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(this.layerBg);

        var img = "res/choujiang/btn_close.png";
        this.btn_close = new ccui.Button(img,img,"");
        this.btn_close.setPosition(this.layerBg.width - 75,this.layerBg.height - 156);
        this.btn_close.addTouchEventListener(this.onClickBtn,this);
        this.layerBg.addChild(this.btn_close,1);

        var fontName = "res/font/bjdmj/fznt.ttf";

        this.label_all_count = new ccui.Text("8",fontName,48);
        this.label_all_count.setPosition(380,this.layerBg.height - 156);
        this.label_all_count.setColor(cc.color("#fcff00"));
        this.layerBg.addChild(this.label_all_count,1);

        var tipStr = "赢局进度每天0点清空,天天都有奖励拿哦!";
        var label_tip = new ccui.Text(tipStr,fontName,30);
        label_tip.setPosition(this.layerBg.width/2 + 30,60);
        label_tip.setColor(cc.color("#edd7d2"));
        this.layerBg.addChild(label_tip,0);

        this.pro_bg = cc.Sprite("res/choujiang/pro_bg.png");
        this.pro_bg.setPosition(this.layerBg.width/2,this.layerBg.height/2 + 150);
        this.layerBg.addChild(this.pro_bg,0);

        this.pro_tiao = new cc.Scale9Sprite("res/choujiang/pro_tiao.png");
        this.pro_tiao.setAnchorPoint(0,0.5);
        this.pro_tiao.setPosition(0,this.pro_bg.height/2);
        this.pro_bg.addChild(this.pro_tiao);

        this.icon_ren = new cc.Sprite("res/choujiang/icon_ren.png");
        this.icon_ren.setAnchorPoint(0.5,0);
        this.icon_ren.setPosition(this.pro_tiao.width,this.pro_bg.height);
        this.pro_bg.addChild(this.icon_ren);

        this.contentNode = new cc.Node();
        this.layerBg.addChild(this.contentNode,1);

    },

    setTotalNum:function(num){
        this.label_all_count.setString(num);
    },

    addJdItem:function(totalNum,rewardArr,hasGetArr){
        this.contentNode.removeAllChildren(true);

        rewardArr = rewardArr.slice(0,7);

        var percent = 0;
        if(rewardArr.length > 1){
            var idx = 0;
            for(var i = 0;i<rewardArr.length;++i){
                if(totalNum >= rewardArr[i]){
                    idx = i;
                }
            }

            percent = idx/6;
            if(idx + 1 < rewardArr.length){
                percent += (this.winCount - rewardArr[idx])/(rewardArr[idx + 1] - rewardArr[idx])/6;
            }

        }

        if(percent < 0)percent = 0;
        if(percent > 1)percent = 1;

        this.pro_tiao.setContentSize(this.pro_bg.width*percent,this.pro_tiao.height);
        this.icon_ren.setPositionX(this.pro_tiao.width);

        var getNum = 0;
        for(var i = 0;i<hasGetArr.length;++i){
            getNum = hasGetArr[i];
        }

        var startX = 170;
        var itemW = 241;

        var fontName = "res/font/bjdmj/fznt.ttf";

        for(var i = 0;i<rewardArr.length;++i){
            var num = rewardArr[i];

            var img_item = "res/choujiang/item_2.png";
            var color_item = cc.color("#723d1c");
            if(num<=totalNum){
                img_item = "res/choujiang/item_1.png";
                color_item = cc.color("#d2491b");
            }

            var img_flag = "res/choujiang/flag_2.png";
            var img_icon = "res/choujiang/icon_" + Math.min(i,6) + ".png";
            var color_flag = cc.color("#ffffff");
            var flagStr = "再赢" + (num - totalNum) + "局可抽奖";
            if(num <= totalNum){
                img_flag = "res/choujiang/flag_1.png";
                color_flag = cc.color("#b33504");
                flagStr = "目前奖励";
            }
            if(num <= getNum){
                img_flag = "res/choujiang/flag_0.png";
                img_icon = "res/choujiang/icon_get.png";
                color_flag = cc.color("#ffffff");
                flagStr = "已领取";
            }

            var item = new cc.Sprite(img_item);
            item.setPosition(startX,this.pro_bg.y);
            this.contentNode.addChild(item,1);

            var label_item = new ccui.Text(num + "局",fontName,34);
            label_item.setColor(color_item);
            label_item.setPosition(item.width/2,item.height/2);
            item.addChild(label_item,1);

            var flag_bg = new cc.Sprite(img_flag);
            flag_bg.setAnchorPoint(0.5,1);
            flag_bg.setPosition(item.x,item.y - 50);
            this.contentNode.addChild(flag_bg,1);

            var label_flag = new ccui.Text(flagStr,fontName,34);
            label_flag.setColor(color_flag);
            label_flag.setPosition(flag_bg.width/2,flag_bg.height - 110);
            flag_bg.addChild(label_flag,1);

            var icon_flag = new cc.Sprite(img_icon);
            icon_flag.setPosition(flag_bg.width/2,label_flag.y - 150);
            flag_bg.addChild(icon_flag,1);

            startX += itemW;
        }
    },

    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            if(sender == this.btn_close){
                PopupManager.remove(this);
            }

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    onClose : function(){
    },
    onOpen : function(){
    },
    onDealClose:function(){
    },
});