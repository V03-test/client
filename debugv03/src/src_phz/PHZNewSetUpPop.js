/**
 * Created by Administrator on 2020/12/7 0007.
 */
var PHZNewSetUpPop = BasePopup.extend({

    ctor: function () {
        this._super("res/phzNewSetPop.json");
    },

    selfRender: function () {
        this.state1 = PlayerModel.isMusic;
        this.state2 = PlayerModel.isEffect;
        cc.log("PlayerModel.isMusic , PlayerModel.isEffect..." , PlayerModel.isMusic , PlayerModel.isEffect);
        var slider1 = this.getWidget("Slider_7");
        slider1.temp = 1;
        slider1.addEventListener(this.sliderEvent,this);
        slider1.setPercent(this.state1);
        var slider2 = this.getWidget("Slider_8");
        slider2.temp = 2;
        slider2.addEventListener(this.sliderEvent,this);
        slider2.setPercent(this.state2);
        this.bgMusic = 2;

        this.getLocalRecord();//获取本地记录


        this.gnPanel = this.getWidget("Panel_gn");
        this.hmPanel = this.getWidget("Panel_hm");

        this.Button_gn = this.getWidget("Button_gn");
        this.Button_hm = this.getWidget("Button_hm");

        UITools.addClickEvent(this.Button_gn, this, this.onGn);
        UITools.addClickEvent(this.Button_hm, this, this.onHm);
        this.onGn();

        //画面设置界面的逻辑
        //快速吃牌
        var widgetKscp = {"Button_kscp1":1,"Button_kscp2":2,"Image_kscp1":1,"Image_kscp2":2};
        this.addClickEvent(widgetKscp , this.onKscpClick);
        this.displayKscp();

        //开启听牌
        var widgetKqtp = {"Button_kqtp1":1,"Button_kqtp2":2,"Image_kqtp1":1,"Image_kqtp2":2};
        this.addClickEvent(widgetKqtp , this.onKqtpClick);
        this.displaykqtp();

        //语音选择
        var widgetYyxz = {"Button_yyxz1":1,"Button_yyxz2":2,"Button_yyxz3":3,"Image_yyxz1":1,"Image_yyxz2":2,"Image_yyxz3":3};
        this.addClickEvent(widgetYyxz , this.onYyxzClick);

        this["Image_yyxz1"].loadTexture("res/res_phz/phzSet/pth.png");
        this["Image_yyxz2"].loadTexture("res/res_phz/phzSet/cdh.png");
        this["Image_yyxz3"].loadTexture("res/res_phz/phzSet/syh.png");

        //根据玩法暂时语音选择按钮 1 邵阳话 2 普通话 3 常德话 4 郴州话 5 耒阳话
        if (PHZRoomModel.wanfa == GameTypeEunmZP.SYBP || PHZRoomModel.wanfa == GameTypeEunmZP.SYZP){
            this["Image_yyxz1"].temp = 2;
            this["Button_yyxz1"].temp = 2;
            this["Image_yyxz2"].temp = 3;
            this["Button_yyxz2"].temp = 3;
            this["Image_yyxz3"].temp = 1;
            this["Button_yyxz3"].temp = 1;
            if (this.yyxz>3){
                this.yyxz = 1;
            }
        }else if(PHZRoomModel.wanfa == GameTypeEunmZP.WHZ){
            this["Button_yyxz3"].visible = false;
            this["Image_yyxz2"].loadTexture("res/res_phz/phzSet/bdh.png");
            this["Image_yyxz2"].temp = 6;
            this["Button_yyxz2"].temp = 6;
            if(this.yyxz != 2)this.yyxz = 6;
        }else if(PHZRoomModel.wanfa == GameTypeEunmZP.AHPHZ){
            this["Image_yyxz2"].loadTexture("res/res_phz/phzSet/ahh.png");
            this["Image_yyxz1"].temp = 2;
            this["Button_yyxz1"].temp = 2;
            this["Image_yyxz2"].temp = 3;
            this["Button_yyxz2"].temp = 3;
            this["Image_yyxz3"].temp = 4;
            this["Button_yyxz3"].temp = 4;
            if (this.yyxz > 4 || this.yyxz < 2){
                this.yyxz = 4;
            }
        }else if(PHZRoomModel.wanfa == GameTypeEunmZP.YJGHZ || PHZRoomModel.wanfa == GameTypeEunmZP.NXGHZ){
            this["Button_yyxz3"].visible = false;
            this["Image_yyxz2"].loadTexture("res/res_phz/phzSet/bdh.png");
            this["Image_yyxz2"].temp = 9;
            this["Button_yyxz2"].temp = 9;
            if(this.yyxz != 2)this.yyxz = 9;
        }else if(PHZRoomModel.wanfa == GameTypeEunmZP.YYWHZ){
            this["Button_yyxz3"].visible = false;
            this["Image_yyxz2"].loadTexture("res/res_phz/phzSet/bdh.png");
            this["Image_yyxz2"].temp = 10;
            this["Button_yyxz2"].temp = 10;
            if(this.yyxz != 2)this.yyxz = 10;
        }
        this.displayYyxz();

        //出牌速度
        var widgetCpsd = {"Button_cpsd1":1,"Button_cpsd2":2,"Button_cpsd3":3,"Button_cpsd4":4,"Image_cpsd1":1,"Image_cpsd2":2,"Image_cpsd3":3,"Image_cpsd4":4};
        this.addClickEvent(widgetCpsd , this.onCpsdClick);
        this.displayCpsd();

        //字牌大小
        var widgetZpdx = {"Button_zpdx1":1,"Button_zpdx2":2,"Button_zpdx3":3,"Button_zpdx4":4,"Image_zpdx1":1,"Image_zpdx2":2,"Image_zpdx3":3,"Image_zpdx4":4};
        this.addClickEvent(widgetZpdx , this.onZpdxClick);
        this.displayZpdx();

        //虚线选择
        var widgetXxxz = {"Button_xxxz1":1,"Button_xxxz2":2,"Image_xxxz1":1,"Image_xxxz2":2};
        this.addClickEvent(widgetXxxz , this.onXxxzClick);
        this.displayXxxz();

        //字牌选择
        //var widgetZpxz = {"Button_zpxz1":1,"Button_zpxz2":2,"Image_zpxz1":1,"Image_zpxz2":2};
        //this.addClickEvent(widgetZpxz , this.onZpxzClick);
        //this.displayZpxz();

        //牌面选择
        //var widgetpmxz = {"Button_pmxz1":1,"Button_pmxz2":2,"Image_pmxz1":1,"Image_pmxz2":2};
        //this.addClickEvent(widgetpmxz , this.onPmxzClick);
        //this.displayPmxz();

        //桌面背景
        var widgetZmbj = {"Button_zmbj1":1,"Button_zmbj2":2,
            "Image_zmbj1":1,"Image_zmbj2":2};
        this.addClickEvent(widgetZmbj , this.onZmbjClick);
        this.displayZmbj();

        var widgetIscp = {"CheckBox_changpai":1,"Image_changpai":1};
        this.addClickEvent(widgetIscp , this.onChangPai);
        this["CheckBox_changpai"].setSelected(this.iscp == 1);

        //if(PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ){
        //    this.getWidget("Panel_zpdx").visible = false;
        //}

        if(PHZRoomModel.wanfa == GameTypeEunmZP.DYBP){
            this["CheckBox_changpai"].visible = false;
        }
    },


    onGn: function() {
        this.gnPanel.visible = true;
        this.hmPanel.visible = false;
        this.Button_gn.setBright(false);
        this.Button_hm.setBright(true);
        this.Button_gn.setTouchEnabled(false);
        this.Button_hm.setTouchEnabled(true);
    },

    onHm: function() {
        this.gnPanel.visible = false;
        this.hmPanel.visible = true;
        this.Button_gn.setBright(true);
        this.Button_hm.setBright(false);
        this.Button_gn.setTouchEnabled(true);
        this.Button_hm.setTouchEnabled(false);
    },

    getLocalItem:function(key){
        var val = cc.sys.localStorage.getItem(key);
        if(val)
            val = parseInt(val);
        return val;
    },

    setLocalItem:function(key,values){
        cc.sys.localStorage.setItem(key,values);
    },

    getLocalRecord: function () {
        this.kscp = parseInt(this.getLocalItem("pro003_phz_kscp"+PHZRoomModel.wanfa)) == 1 ? 1:0;  //1,0
        this.kqtp = (parseInt(this.getLocalItem("pro003_phz_kqtp"+PHZRoomModel.wanfa)) == 0 ? 0:1) || PHZSetModel.getDefaultKqtp();  //1,0
        this.yyxz = parseInt(this.getLocalItem("pro003_phz_yyxz"+PHZRoomModel.wanfa)) || PHZSetModel.getDefaultYyxz();  //1,2,3
        this.cpsd = this.getLocalItem("pro003_phz_cpsd"+PHZRoomModel.wanfa) || PHZSetModel.getDefaultCpsd();  //1,2,3
        this.zpdx = parseInt(this.getLocalItem("pro003_phz_zpdx"+PHZRoomModel.wanfa)) || 4;  //1,2,3,4
        this.xxxz = parseInt(this.getLocalItem("pro003_phz_xxxz"+PHZRoomModel.wanfa)) == 1 ? 1:0;  //1,0
        this.zpxz = this.getLocalItem("pro003_phz_zpxz"+PHZRoomModel.wanfa) || PHZSetModel.getDefaultZpxz();  //1,2,3
        this.pmxz = this.getLocalItem("pro003_phz_pmxz"+PHZRoomModel.wanfa) || PHZSetModel.getDefaultPmxz();  //1,2,3,4
        this.zmbj = this.getLocalItem("pro003_phz_zmbj"+PHZRoomModel.wanfa) || PHZSetModel.getDefaultZmbj();  //1,2,3
        this.iscp = this.getLocalItem("pro003_phz_iscp"+PHZRoomModel.wanfa)|| 0;

        if (GameTypeEunmZP.YZCHZ == PHZRoomModel.wanfa){
            this.zpdx = 4;
        }
         //this.setDefaultAllData();
        if(this.zmbj > 2){
            this.zmbj = 1;
        }
    },

    setDefaultAllData:function(){
        var setAHPHZ = this.getLocalItem("pro003_phz_setAllData_Pop"+PHZRoomModel.wanfa);
        if (PHZRoomModel.wanfa == GameTypeEunmZP.AHPHZ && (!setAHPHZ || setAHPHZ != 1)){
            this.yyxz = 4;//语音选择默认 普通话
            this.cpsd = 3;//出牌速度默认 标准
            this.zpdx = 3;//字牌大小默认 大
            this.zpxz = 3;//字牌字体默认 3
            this.pmxz = 4;//牌面默认     4
            this.zmbj = 1;//桌面默认     1
            this.setLocalItem("pro003_phz_setAllData_Pop"+PHZRoomModel.wanfa,1);
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.DYBP){
            this.yyxz = PHZSetModel.yyxz;//语音选择默认 普通话2 常德话3 安化话4
            this.cpsd = PHZSetModel.cpsd;//出牌速度默认 标准
            this.zpdx = PHZSetModel.zpdx;//字牌大小默认 中
            this.zpxz = 1;//字牌字体默认 1
            this.pmxz = PHZSetModel.pmxz;//牌面默认     1
            this.zmbj = PHZSetModel.zmbj;//桌面默认     3
            this.xxxz = PHZSetModel.xxxz;//选择高       标准
            this.iscp = PHZSetModel.iscp;//不要长牌
        }
    },

    onKscpClick: function (obj) {
        var temp = parseInt(obj.temp);
        var values = [1,0];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_kscp" + i];
            if (temp == i){
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
        this.kscp = values[temp-1];
        if (PHZSetModel.getValue("pro003_phz_kscp") != this.kscp){
            PHZSetModel.kscp = this.kscp;
            this.setLocalItem("pro003_phz_kscp"+PHZRoomModel.wanfa,this.kscp);
            SyEventManager.dispatchEvent(SyEvent.UPDATE_SET_KSCP);
        }
        //cc.log("this.kscp"+this.kscp);
    },

    displayKscp:function(){
        var values = [1,0];
        //cc.log("this.kscp"+this.kscp);
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_kscp" + i];
            if (this.kscp == values[i-1]) {
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
    },

    onKqtpClick: function (obj) {
        var temp = parseInt(obj.temp);
        var values = [1,0];
        //if (temp == 1) {
        //    FloatLabelUtil.comText("暂未开放");
        //    return
        //}
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_kqtp" + i];
            if (temp == i){
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
        this.kqtp = values[temp-1];
        if (PHZSetModel.getValue("pro003_phz_kqtp") != this.kqtp){
            PHZSetModel.kqtp = this.kqtp;
            this.setLocalItem("pro003_phz_kqtp"+PHZRoomModel.wanfa,this.kqtp);  //1,0
            SyEventManager.dispatchEvent(SyEvent.UPDATE_SET_KQTP,2);
        }
        //cc.log("this.kqtp"+this.kqtp);
    },

    displaykqtp:function(){
        var values = [1,0];
        //cc.log("this.kqtp"+this.kqtp);
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_kqtp" + i];
            if (this.kqtp == values[i-1]) {
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
    },


    onYyxzClick: function (obj) {
        var temp = parseInt(obj.temp);
        for(var i = 1;i <= 3; i++) {
            var btn = this["Button_yyxz" + i];
            if (temp == btn.temp){
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
        this.yyxz = temp;
        if (PHZSetModel.getValue("pro003_phz_yyxz") != this.yyxz){
            PHZSetModel.yyxz = this.yyxz;
            this.setLocalItem("pro003_phz_yyxz"+PHZRoomModel.wanfa,this.yyxz);  //1,0
            SyEventManager.dispatchEvent(SyEvent.UPDATE_SET_YYXZ);
        }
        //cc.log("this.yyxz"+this.yyxz);
    },

    displayYyxz:function(){
        //cc.log("this.yyxz"+this.yyxz);
        for(var i = 1;i <= 3; i++) {
            var btn = this["Button_yyxz" + i];
            if (this.yyxz == btn.temp) {
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
    },

    onCpsdClick: function (obj) {
        var temp = parseInt(obj.temp);
        var values = [4,3,2,1];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_cpsd" + i];
            if (temp == i){
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
        this.cpsd = values[temp-1];
        if (PHZSetModel.getValue("pro003_phz_cpsd") != this.cpsd){
            PHZSetModel.cpsd = this.cpsd;
            this.setLocalItem("pro003_phz_cpsd"+PHZRoomModel.wanfa,this.cpsd);  //1,2,3
            SyEventManager.dispatchEvent(SyEvent.UPDATE_SET_CPSD);
        }
        //cc.log("this.cpsd"+this.cpsd);
    },

    displayCpsd:function(){
        var values = [4,3,2,1];
        //cc.log("this.cpsd"+this.cpsd);
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_cpsd" + i];
            if (this.cpsd == values[i-1]) {
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
    },


    onZpdxClick: function (obj) {
        var temp = parseInt(obj.temp);
        var values = [1,2,3,4];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_zpdx" + i];
            if (temp == i){
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
        return;
        this.zpdx = values[temp-1];
        if (PHZSetModel.getValue("pro003_phz_zpdx") != this.zpdx){
            PHZSetModel.zpdx = this.zpdx;
            this.setLocalItem("pro003_phz_zpdx"+PHZRoomModel.wanfa,this.zpdx);  //0,1
            SyEventManager.dispatchEvent(SyEvent.UPDATE_SET_ZPDX);
        }
        //cc.log("this.zpdx"+this.zpdx);
    },

    displayZpdx:function(){
        var values = [1,2,3,4];
        //cc.log("this.zpdx"+this.zpdx);
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_zpdx" + i];
            if (this.zpdx == values[i-1]) {
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
    },


    onXxxzClick: function (obj) {
        var temp = parseInt(obj.temp);
        var values = [0,1];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_xxxz" + i];
            if (temp == i){
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
        this.xxxz = values[temp-1];
        if (PHZSetModel.getValue("pro003_phz_xxxz") != this.xxxz){
            PHZSetModel.xxxz = this.xxxz;
            this.setLocalItem("pro003_phz_xxxz"+PHZRoomModel.wanfa,this.xxxz);  //0,1
            SyEventManager.dispatchEvent(SyEvent.UPDATE_SET_XXXZ);
        }
        //cc.log("this.xxxz"+this.xxxz);
    },

    displayXxxz:function(){
        var values = [0,1];
        //cc.log("this.xxxz"+this.xxxz);
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_xxxz" + i];
            if (this.xxxz == values[i-1]) {
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
    },


    onZpxzClick: function (obj) {
        var temp = parseInt(obj.temp);
        var values = [1,2];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_zpxz" + i];
            if (temp == values[i-1]){
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
        this.zpxz = values[temp-1];
        if (PHZSetModel.getValue("pro003_phz_zpxz") != this.zpxz){
            PHZSetModel.zpxz = this.zpxz;
            this.setLocalItem("pro003_phz_zpxz"+PHZRoomModel.wanfa,this.zpxz);  //1,2,3
            SyEventManager.dispatchEvent(SyEvent.UPDATE_SET_ZPXZ);
        }
        //cc.log("this.zpxz===",this.zpxz)
    },

    displayZpxz:function(){
        var values = [1,2];
        cc.log("this.zpxz"+this.zpxz);
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_zpxz" + i];
            if (this.zpxz == values[i-1]) {
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
    },

    onPmxzClick: function (obj) {
        var temp = parseInt(obj.temp);
        var values = [1,2];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_pmxz" + i];
            if (temp == values[i-1]){
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
        this.pmxz = values[temp-1];
        if (PHZSetModel.getValue("pro003_phz_pmxz") != this.pmxz){
            PHZSetModel.pmxz = this.pmxz;
            this.setLocalItem("pro003_phz_pmxz"+PHZRoomModel.wanfa,this.pmxz);  //1,2,3
            SyEventManager.dispatchEvent(SyEvent.UPDATE_SET_PMXZ);
        }
    },

    displayPmxz:function(){
        var values = [1,2];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_pmxz" + i];
            if (this.pmxz == values[i-1]) {
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
    },

    onZmbjClick: function (obj) {
        var temp = parseInt(obj.temp);
        var values = [1,2];
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_zmbj" + i];
            if (temp == values[i-1]){
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
        this.zmbj = values[temp-1];
        //cc.log("this.zmbj"+this.zmbj);
        PHZSetModel.zmbj = this.zmbj;
        this.setLocalItem("pro003_phz_zmbj"+PHZRoomModel.wanfa,this.zmbj);  //1,2,3
        SyEventManager.dispatchEvent(SyEvent.UPDATE_BG_YANSE);
    },

    displayZmbj:function(){
        var values = [1,2];
        //cc.log("this.zmbj"+this.zmbj);
        for(var i = 1;i <= values.length; i++) {
            var btn = this["Button_zmbj" + i];
            if (this.zmbj == values[i-1]) {
                btn.setBright(true);
            }else{
                btn.setBright(false);
            }
        }
    },

    onChangPai:function(){
        cc.log("this[CheckBox_changpai].isSelected() =",this["CheckBox_changpai"].isSelected());
        this.iscp = this["CheckBox_changpai"].isSelected()?0:1;
        if (PHZSetModel.getValue("pro003_phz_iscp") != this.iscp){
            PHZSetModel.iscp = this.iscp;
            this.setLocalItem("pro003_phz_iscp"+PHZRoomModel.wanfa,this.iscp);  //1,2,3
            SyEventManager.dispatchEvent(SyEvent.UPDATE_SET_ISCP);
        }
    },

    addClickEvent:function(widgets , selector){
        for(var key in widgets){
            var widget = this[key] = this.getWidget(key);
            // cc.log("key ..." , widgets , key)
            widget.temp = parseInt(widgets[key]);
            UITools.addClickEvent(widget,this,selector);
        }
    },

    sliderEvent: function (sender, type) {
        if(type==ccui.Slider.EVENT_PERCENT_CHANGED){
            var temp = sender.temp;
            var percent = sender.getPercent();
            var volume = percent/100;
            if(temp==1){
                this.state1 = percent;
                AudioManager.setBgVolume(volume);
            }else{
                this.state2 = percent;
                AudioManager.setEffectsVolume(volume);
            }
        }
    },

    onClose:function(){
        PlayerModel.isMusic = this.state1;
        PlayerModel.isEffect = this.state2;
        PlayerModel.musicType = this.bgMusic;

        cc.log("fuck u ::" , AudioManager._bgMusic);
        AudioManager.reloadFromData(this.state1,this.state2,AudioManager._bgMusic || 3);
        sySocket.sendComReqMsg(10,[this.state1,this.state2,this.state1,this.state2,this.bgMusic]);
        //
        //AudioManager.reloadFromData(this.state1,this.state2,this.bgMusic);
        //sySocket.sendComReqMsg(10,[this.state1,this.state2,this.state1,this.state2,this.bgMusic]);
    },
});