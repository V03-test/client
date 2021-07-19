/**
 * 用于游戏场景类的全屏显示层的基类
 */
var BaseLayer = cc.Layer.extend({
    layerName:"",
    json:"",
    moreFiles:[],
    root:null,
    showCount:0,
    lStatus:-1,
    RESUME:1,
    STOP:2,
    resumeForever:false,
    renderFinish:false,
    _customEvents:null,

    ctor:function(json,moreFiles){
        this.isLoad = false;
        this._super();
        this.showCount = 0;
        this.json = json;
        this.layerName = json;
        this.moreFiles = moreFiles;
        this.resumeForever = false;
        this.renderFinish = false;
        this._customEvents = {};
        this.loadComplete();
    },

    getName:function(){
        return this.layerName;
    },

    isForceRemove:function(){
        return false;
    },

    loadComplete : function(){
        this.root = ccs.uiReader.widgetFromJsonFile(this.json);
        this.root.setPosition((cc.winSize.width - this.root.width)/2,(cc.winSize.height - this.root.height)/2);
        this.addChild(this.root);
        this.selfRender();
        if (!this.isLoad && LayerManager.isInRoom()){
    
            this.isLoad = true;
            this.initShaZhu();
            this.addCustomEvent("shazhu_show",this,this.shaZhuShow);
            this.addCustomEvent("shazhu_data",this,this.shaZhuData);
            this.addCustomEvent("shazhu_get",this,this.shaZhuGet);
        }

        this.renderFinish = true;
    },

    /**
     * UI层的操作
     */
    selfRender:function(){
        throw new Error("subclass must override function selfRender");
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

    getWidget : function(name){
        return ccui.helper.seekWidgetByName(this.root,name);
    },

    onShow:function(){
    },

    onHide:function(){
    },

    onRemove:function(){
    },

    initShaZhu:function(){

        var wanfa = (BaseRoomModel.curRoomData && BaseRoomModel.curRoomData.wanfa) ? BaseRoomModel.curRoomData.wanfa : 0;

        var szBg = "res/res_mj/mjRoom/img_ting2.png";
        this.Panel_shazhu = new cc.Scale9Sprite(szBg,null,cc.rect(40,30,40,30));
        this.Panel_shazhu.x = 960;
        this.Panel_shazhu.y = 540;
        this.Panel_shazhu.width = 1200;
        this.Panel_shazhu.height = 600;
        this.root.addChild(this.Panel_shazhu,999);

        // var openPath = "res/ui/common/win.png"
        // var openBtn = this.openBtn = new ccui.Button(openPath,"","");
        // openBtn.temp = 1;
        // openBtn.setPosition(200,200);
        // UITools.addClickEvent(openBtn,this,this.closeShaZhu);
        // this.root.addChild(openBtn,999);
        if (GameTypeManager.isMJ(wanfa) || GameTypeManager.isZP(wanfa)){
            if (GameTypeManager.isZP(wanfa)){
                this.openBtn = this.getWidget("fapai");
            }else{
                this.openBtn = this.getWidget("Image_dipai");
            }
            if (this.openBtn){
                this.openBtn.temp = 1;
                UITools.addClickEvent(this.openBtn,this,this.closeShaZhu);
                this.openBtn.setTouchEnabled(false);
            }
            
        }
        this.Panel_shazhu.visible = false;
    },

    showAllMj:function(data){
       this.Panel_shazhu.removeAllChildren();
        var wanfa = (BaseRoomModel.curRoomData && BaseRoomModel.curRoomData.wanfa) ? BaseRoomModel.curRoomData.wanfa : 0;
        var closePath = "res/ui/common/pop_btn_close.png"
        var closeBtn1 = new ccui.Button(closePath,"","");
        closeBtn1.temp = 2;;
        closeBtn1.setPosition(this.Panel_shazhu.width - 20,this.Panel_shazhu.height - 20);
        UITools.addClickEvent(closeBtn1,this,this.closeShaZhu);
        this.Panel_shazhu.addChild(closeBtn1);
       


        var huList = [];
        var _data = data.split("|");
        this.Panel_shazhu.visible = _data.length > 0 ? true : false;
        if (GameTypeManager.isMJ(wanfa) || GameTypeManager.isZP(wanfa)){
            for (var i = 1; i <= 27; i++) {
                huList.push(i);
            }
            huList.push(201);
            if (GameTypeManager.isZP(wanfa)){
                huList = [];
                for (var i = 1; i <= 10; i++) {
                    huList.push(i);
                }
                for (var i = 41; i <= 50; i++) {
                    huList.push(i);
                }
            }
            var  scale_num = 0.8;
            var  _diffX = 100;
            for (var i = 0; i < huList.length; i++) {
                cc.log("i===================",huList[i],i)
                var height = Math.floor(i/9);
                var width = Math.floor(i%9);
                var vo = MJAI.getMJDef(huList[i]);
                var card = new CSMahjong(MJAI.getDisplayVo(1, 2), vo);
                if (GameTypeManager.isZP(wanfa)){
                    vo = PHZAI.getPHZDef(huList[i]);
                    card = new PHZCard(PHZAI.getDisplayVo(1,2),vo);
                    height = Math.floor(i/10);
                    width = Math.floor(i%10);
                    scale_num = 0.9;
                    _diffX = 40;
                }

                card.scale = scale_num;
                var size = card.getContentSize();
                card.x = width * ((90+40)*scale_num)+_diffX;
                card.y = this.Panel_shazhu.height*0.65 - height*(size.height + 70)*scale_num;
                this.Panel_shazhu.addChild(card,i+1);
                card.setTouchEnabled(true);

                UITools.addClickEvent(card,this,this.sendShaZhu);
                if (GameTypeManager.isMJ(wanfa) && huList[i] == 201){
                    card.x = 9 * ((90+40)*scale_num)+_diffX;
                    card.y = this.Panel_shazhu.height*0.65;
                }

                var paiNumLabel = new cc.LabelTTF("", "Arial", 30);
                paiNumLabel.setString(0 + "张");
                paiNumLabel.y = -20;
                paiNumLabel.x = size.width*0.5;
                paiNumLabel.setColor(cc.color("f0ff6a"));
                card.addChild(paiNumLabel);
               
                for (var j = 0; j < _data.length; j++) {
                    var _sydata = _data[j].split(",");
                    cc.log("_sydata====",_sydata);
                    var _id = (card._cardVo && Number(card._cardVo.i)) ? Number(card._cardVo.i) : 0;
                    if (GameTypeManager.isZP(wanfa)){
                        _id = (card._cardVo && Number(card._cardVo.v)) ? Number(card._cardVo.v) : 0;
                    }
                    if (_id == Number(_sydata[0])){
                        paiNumLabel.setString(_sydata[1] + "张")
                        break;
                    }
                }
            }
        }
    },

    sendShaZhu:function(obj){
        var wanfa = (BaseRoomModel.curRoomData && BaseRoomModel.curRoomData.wanfa) ? BaseRoomModel.curRoomData.wanfa : 0;
        var _id = obj._cardVo ? Number(obj._cardVo.i) : 0;
      
        if (GameTypeManager.isZP(wanfa)){
            _id = obj._cardVo ? Number(obj._cardVo.v) : 0;
        }
        cc.log("sendShaZhu=======",_id);
        if (_id){
            sySocket.sendComReqMsg(6008,[_id]);
        }
        if (this.Panel_shazhu){
            this.Panel_shazhu.visible = false;
        }
    },


    closeShaZhu:function(obj){
        cc.log("obj===",obj.temp);
        if (this.Panel_shazhu){
            var temp = obj.temp;
            this.Panel_shazhu.visible = false;
            if (temp == 1)
                sySocket.sendComReqMsg(1111,[7,1]);
            // } else{
            //     this.Panel_shazhu.visible = false;
            // }
        }
    },

    shaZhuShow:function(event){
        var msg = event.getUserData();
        var isShow = (msg && msg.params[0] == 1) ? true : false;
        var isData = (msg && msg.params[1] == 1) ? true : false;
        cc.log("shaZhuShow===",isShow)
        if (this.openBtn){
          this.openBtn.setTouchEnabled(isShow);  
        }   
        if (isShow && isData){
            sySocket.sendComReqMsg(6009);
        }
    },

    shaZhuData:function(event){
        var msg = event.getUserData();
        var data = (msg &&  msg.strParams) ? msg.strParams[0] : null;
        // cc.log("data===",JSON.stringify(data))
        if (data){
           this.showAllMj(data);
        } 
    },

    shaZhuGet:function(event){
        var players = (BaseRoomModel.curRoomData && BaseRoomModel.curRoomData.players) ? BaseRoomModel.curRoomData.players : null;
        var isContinue = false;
        for(var i=0;i<players.length;i++){
            var p = players[i];
            if(!isContinue){
                isContinue = (p.handCardIds.length>0 || p.outedIds.length>0 || p.moldCards.length>0);
            }
        }

        // cc.log("shaZhuGet====",isContinue)
        if (isContinue){
            sySocket.sendComReqMsg(1111,[7,0]);
        }
    }
});