/**
 * Created by cyp on 2019/11/13.
 */
var HSTHBaseRoomLayer = cc.Layer.extend({
    _dt:0,
    _timedt:0,
    _customEvents:null,
    ctor:function(){
        this._super();

        this._customEvents = [];

        this.addCustomEvent(SyEvent.UPDATE_BG_YANSE , this,this.updateBg);

        this.showBgImg(this.getBgImg());
        this.initRoomItem();
        this.addMenuBtn();
        //this.addMenuLayer();

        this.calcTime();
        this.calcWifi();
        this.schedule(this.updateTime,1,-1,0);
    },

    showBgImg:function(img){
        img = img || "res/pkCommon/gamebg.jpg";
        if(!this.layerBg){
            this.layerBg = new cc.Sprite(img);
            this.addChild(this.layerBg);
        }else{
            this.layerBg.initWithFile(img);
        }
        this.layerBg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.layerBg.setScale(Math.max(cc.winSize.width/this.layerBg.width,cc.winSize.height/this.layerBg.height));
    },

    getBgImg:function(type){
        var img = "res/pkCommon/gamebg.jpg";

        if(!type)type = cc.sys.localStorage.getItem("sy_diantuo_pz");

        if(type == 2)img = "res/pkCommon/gamebg2.jpg";

        return img;
    },

    updateBg:function(event){
        var type = event.getUserData();
        this.showBgImg(this.getBgImg(type));
    },

    initRoomItem:function(){
        this.roomItemBg = new cc.Scale9Sprite("res/res_gameCom/floorTop.png",null,cc.rect(20,20,60,20));
        this.roomItemBg.setContentSize(368,61);
        this.roomItemBg.setPosition(cc.winSize.width - 390,cc.winSize.height - 40);
        this.addChild(this.roomItemBg);

        this.label_version = UICtor.cLabel(SyVersion.v,36);
        this.label_version.setPosition(this.roomItemBg.width/2 - 90,this.roomItemBg.height - 30);
        this.label_version.setColor(cc.color("#ffffff"));
        this.roomItemBg.addChild(this.label_version,0);

        this.label_time = UICtor.cLabel("00:00",36);
        this.label_time.setPosition(this.roomItemBg.width/2 + 35,30);
        this.label_time.setColor(this.label_version.getColor());
        this.roomItemBg.addChild(this.label_time,0);

        //this.img_net = new cc.Sprite("res/ui/common/net_5.png");
        //this.img_net.setPosition(this.roomItemBg.width/2 - 40,this.roomItemBg.height/2);
        //this.roomItemBg.addChild(this.img_net,0);

        var img_battery_bg = new cc.Sprite("res/res_gameCom/tx_batterybg.png");
        img_battery_bg.setAnchorPoint(0,0.5);
        img_battery_bg.setPosition(this.roomItemBg.width/2 + 95,this.roomItemBg.height/2);
        this.roomItemBg.addChild(img_battery_bg,0);

        this.img_battery = new cc.Sprite("res/res_gameCom/tx_battery_full.png");
        this.img_battery.setAnchorPoint(0,0.5);
        this.img_battery.setPosition(7,img_battery_bg.height/2);
        this.img_battery.setContentSize(img_battery_bg.width - 20,img_battery_bg.height - 14);
        img_battery_bg.addChild(this.img_battery,1);

        //this.btn_gps = new ccui.Button("res/res_gameCom/btn_weizhi_up.png","res/res_gameCom/btn_weizhi_up.png","res/res_gameCom/btn_weizhi_up.png");
        //this.btn_gps.setPosition(cc.winSize.width - 90,cc.winSize.height - 225);
        //this.addChild(this.btn_gps);
        //this.btn_gps.setVisible(false);
        //UITools.addClickEvent(this.btn_gps ,this,this.onClickGpsBtn);

    },

    addMenuBtn:function(){
        this.btn_menu = new ccui.Button("res/res_gameCom/xlk.png","res/res_gameCom/xlk.png","res/res_gameCom/xlk.png");
        var jt = new cc.Sprite("res/res_gameCom/xf.png");
        jt.setPosition(this.btn_menu.width/2,this.btn_menu.height/2);
        this.btn_menu.addChild(jt,0);
        this.btn_menu.setPosition(cc.winSize.width - 90,cc.winSize.height - 60);
        this.addChild(this.btn_menu);
        UITools.addClickEvent(this.btn_menu,this,this.onOpenSet);
        //this.btn_menu.addTouchEventListener(this.onClickMenuBtn,this);
    },

    onOpenSet:function(){
        var mc = new BaseRoomSetPop(false);
        PopupManager.addPopup(mc);
    },

    onClickMenuBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);
            this.menuBtnLayer.changeState();
            this.btn_menu.setBright(this.menuBtnLayer.isHide);

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    onClickGpsBtn:function(){
        if(HSTHRoomModel.renshu > 2){
            var pop = new GpsPop(HSTHRoomModel , HSTHRoomModel.renshu);
            PopupManager.addPopup(pop);
        }
    },

    updateTime:function(dt){
        this._timedt += 1;
        if (this._timedt % 60 == 0)
            this.calcTime();
        if (this._timedt >= 180) {
            this._timedt = 0;
            this.calcWifi();
        }
    },

    //刷新时间
    calcTime:function(){
        var date = new Date();
        var hours = date.getHours().toString();
        hours = hours.length < 2 ? "0"+hours : hours;
        var minutes = date.getMinutes().toString();
        minutes = minutes.length < 2 ? "0"+minutes : minutes;

        var sec = date.getSeconds();
        this._timedt = sec;

        this.label_time.setString(hours+":"+minutes);
    },

    //检测网络状态
    calcWifi:function(){
        var batteryNum = Math.ceil(SdkUtil.getBatteryNum()/100*55);
        this.img_battery.width = batteryNum;
        return;
        var type = SdkUtil.getNetworkType();
        if(!type || type==0){
            this.img_net.visible = false;
        }else{
            var img = "res/ui/common/net_"+type+".png";
            this.img_net.initWithFile(img);
        }
        var batteryNum = Math.ceil(SdkUtil.getBatteryNum()/100*55);
        this.img_battery.width = batteryNum;
    },

    getName:function(){
        return "HSTH_BASE_ROOM";
    },

    isForceRemove:function(){
        return true;
    },

    addCustomEvent:function(eventType,target,cb){
        if(!this._customEvents[eventType]){
            var listener = SyEventManager.addEventListener(eventType, target, cb);
            this._customEvents[eventType] = listener;
        }
    },

    removeEvents:function(events){
        var types = TypeUtil.isArray(events) ? events : [events];
        for (var i = 0; i < types.length; i++) {
            var et = types[i];
            var listener = this._customEvents[et];
            if(listener){
                SyEventManager.removeListener(listener);
                this._customEvents[et] = null;
            }
        }
    },

    removeAllEvents:function(){
        var events = [];
        for(var key in this._customEvents){
            events.push(key);
        }
        this.removeEvents(events);
    },

    onShow:function(){
    },

    onHide:function(){
    },

    onRemove:function(){
    },

    //回放会把这个层当弹窗处理，弹窗管理需要这几个空方法
    onClose : function(){
    },
    onOpen : function(){
    },
    onDealClose:function(){
    },

    onExit:function(){
        this.unscheduleUpdate();

        this._super();
    },
});
