/**
 * Created by Administrator on 2017/7/6.//
 */
var PDKRoomSetPop = BasePopup.extend({
    ctor:function(){
        this._super("res/pdkRoomSetPop.json");
    },

    selfRender:function(){
        this.Button_9 = this.getWidget("Button_9");//退出房间
        this.Button_8 = this.getWidget("Button_8");//解散房间
        this.Button_10 =this.getWidget("Button_10");//设置
        UITools.addClickEvent(this.Button_9,this,this.onLeave);
        UITools.addClickEvent(this.Button_10,this,this.onSetUp);
        UITools.addClickEvent(this.Button_8,this,this.onBreak);

        this.addCustomEvent(SyEvent.REMOVE_SET_POP , this,this.onRemove);
    },

    onSetUp:function(){
        if (LayerManager.isInPDK()){
            var mc = new PDKSetUpPop();
            PopupManager.addPopup(mc);
        }else{
            var mc = new SetUpPop();
            PopupManager.addPopup(mc);
        }

    },

    /**
     * 解散
     */
    onBreak:function(){
        AlertPop.show("解散房间需所有玩家同意，确定要申请解散吗？",function(){
            sySocket.sendComReqMsg(7);
        })
    },

    /**
     * 暂离房间
     */
    onLeave:function(){
        cc.log("===onLeave===");
        sySocket.sendComReqMsg(6);
    },

    onRemove:function(){
        PopupManager.remove(this);
    },

})

var PDKSetUpPop = BasePopup.extend({
    ctor: function (layerName) {
        this.layerName = layerName;
        this._super("res/pdkSetup.json");
    },

    selfRender: function () {
        this.pz = this.getLocalItem(this.layerName+"sy_pdk_pz") || 2;
        this.pm = 2;

        if(this.pz > 2){
            this.pz = 1;
        }

        this["CheckBox_bg1"] = this.getWidget("CheckBox_bg1");
        this["CheckBox_bg1"].addEventListener(this.onClickPz1, this);
        this["CheckBox_bg2"] = this.getWidget("CheckBox_bg2");
        this["CheckBox_bg2"].addEventListener(this.onClickPz2, this);

        if(PDKRoomModel.isMoneyRoom()){
            if(this.pz == 3)this.pz = 1;
        }

        this.displayPz();

        this.cardIndex = BasePKCardSetModel.getLocalCardTypeIndexByWanfa(this.layerName);//扑克牌

        //画面设置界面的逻辑
        //快速吃牌
        var widgetPmxz = {"Button_pmxz1":1,"Button_pmxz2":2,"Image_pmxz1":1,"Image_pmxz2":2};
        this.addClickEvent(widgetPmxz , this.onPmxzClick);
        this.displayPmxz();

        this["Button_pmxz2"].visible = this.layerName == "PDK";

        this.displayPz();
 
        this.state1 = PlayerModel.isMusic;
        this.state2 = PlayerModel.isEffect;
        var slider1 = this.getWidget("Slider_7");
        slider1.temp = 1;
        slider1.addEventListener(this.sliderEvent,this);
        slider1.setPercent(this.state1);
        var slider2 = this.getWidget("Slider_8");
        slider2.temp = 2;
        slider2.addEventListener(this.sliderEvent,this);
        slider2.setPercent(this.state2);

        if(LayerManager.isInRoom()){
            this.bgMusic = 2;
        }else{
            this.bgMusic = 1;
        }

        this.Button_music = this.getWidget("Button_music");
        this.Button_effect = this.getWidget("Button_effect");
        UITools.addClickEvent(this.Button_music, this, this.onClickYl);
        UITools.addClickEvent(this.Button_effect, this, this.onClickYx);

        //cc.log("stata1"+this.state1 + "this.state2" +this.state2);
        this.updateBtnState();
    },

    updateBtnState:function(){
        this.Button_effect.setBright(this.state2 != 0);
        this.Button_music.setBright(this.state1 != 0);
    },

    onPmxzClick: function (obj) {
        var temp = parseInt(obj.temp);
        var values = [1,2];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_pmxz" + i];
            if (temp == i){
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
        this.cardIndex = values[temp-1];

        cc.log(" this.cardIndex = ",this.cardIndex);
        if (BasePKCardSetModel.getLocalCardTypeIndexByWanfa(this.layerName) != this.cardIndex){
            BasePKCardSetModel.setLocalItem(this.layerName,this.cardIndex);
            SyEventManager.dispatchEvent(SyEvent.UPDATE_PK_CARD);
        }
    },

    displayPmxz:function(){
        var values = [1,2];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_pmxz" + i];
            if (this.cardIndex == values[i-1]) {
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
    },


    onClickYx:function(){
        if(this.Button_effect.isBright()){
            this.state2 = 0;
        }else{
            this.state2 =  PlayerModel.isMusic;
        }
        this.Button_effect.setBright(!this.Button_effect.isBright());
        AudioManager.setEffectsVolume(this.state2);
        this.getWidget("Slider_8").setPercent(this.state2);
    },

    onClickYl:function(){
        if(this.Button_music.isBright()){
            this.state1 = 0;
        }else{
            this.state1 =  PlayerModel.isEffect;
        }
        this.Button_music.setBright(!this.Button_music.isBright());
        AudioManager.setBgVolume(this.state1);
        this.getWidget("Slider_7").setPercent(this.state1);
    },

    displayPz:function(){
        this.getWidget("CheckBox_bg1").setSelected(this.pz==1);
        this.getWidget("CheckBox_bg2").setSelected(this.pz==2);
        cc.sys.localStorage.setItem(this.layerName+"sy_pdk_pz",this.pz);
        SyEventManager.dispatchEvent(SyEvent.UPDATE_BG_YANSE,this.pz);
    },

    onClickPz1:function(obj,type){
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            this.pz = 1
        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){
            this.pz = 2
        }
        this.displayPz();
    },

    onClickPz2:function(obj,type){
        if (type == ccui.CheckBox.EVENT_SELECTED) {
            this.pz = 2
        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){
            this.pz = 1
        }
        this.displayPz();
    },

    sliderEvent: function (sender, type) {
        if(type==ccui.Slider.EVENT_PERCENT_CHANGED){
            var temp = sender.temp;
            var percent = sender.getPercent();
            var volume = percent/100;
            if(temp==1){
                this.state1 = percent;
                if(this.state1 == 0){
                    this.Button_music.setBright(false);
                }else{
                    this.Button_music.setBright(true);
                }
                AudioManager.setBgVolume(volume);
            }else{
                this.state2 = percent;
                if(this.state2 == 0){
                    this.Button_effect.setBright(false);
                }else{
                    this.Button_effect.setBright(true);
                }
                AudioManager.setEffectsVolume(volume);
            }
        }
    },

    onClose:function(){
        PlayerModel.isMusic = this.state1;
        PlayerModel.isEffect = this.state2;
        PlayerModel.musicType = this.bgMusic;
        AudioManager.reloadFromData(this.state1,this.state2,this.bgMusic);
        sySocket.sendComReqMsg(10,[this.state1,this.state2,this.state1,this.state2,this.bgMusic]);

    },

    getLocalItem:function(key){
        var val = cc.sys.localStorage.getItem(key);
        if(val)
            val = parseInt(val);
        return val;
    },

    addClickEvent:function(widgets,selector){
        for(var key in widgets){
            var widget = this[key] = this.getWidget(key);
            widget.temp = parseInt(widgets[key]);
            UITools.addClickEvent(widget,this,selector);
        }
    },

    getWidget:function(name){
        return ccui.helper.seekWidgetByName(this.root,name);
    },

});