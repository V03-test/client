/**
 * Created by Administrator on 2016/6/24.3311
 */
var LoginLayer = BaseLayer.extend({

    ctor:function(){

        this._super(LayerFactory.LOGIN);
    },

    reviewPost:function(){
        var self = this;
        var url = csvhelper.strFormat(ServerUtil.defaultLoginUrl,"user","getLoginConfig");
        Network.sypost(url,"getLoginConfig",{},function(data){
            LoginData.onReview(data);
            //self.displayLoginBtn();
            GreenUtil.isGreen(self,self.onGreenS);
        },function(){
            sy.scene.hideLoading();
            AlertPop.showOnlyOk("获取登录信息失败，点击确定重试",function(){
                sy.scene.showLoading("正在登录");
                self.reviewPost();
            })
        });
    },

    //上传错误日志
    uploadUpdateErrorLog:function(){
        //var self = this;
        // if (SyConfig.IS_UPDATE_LOG && AssetsUpdateModel && AssetsUpdateModel.isLog){
        //     var errorLog = AssetsUpdateModel.getTags();
        //     NetworkJT.loginReqNew("bjdAction", "clientLogMsg", {logMsg:errorLog}, function (data) {
        //     }, function (data) {
        //         if(data.message){
        //             FloatLabelUtil.comText(data.message);
        //         }
        //     });
        // }
    },

    onGreenS: function() {
        sy.scene.hideLoading();
        cc.log("开始登录逻辑展示...");
        if(SdkUtil.isIosReviewVersion()){//ios检测下ip
            this.reviewPost();
        }else{//不是审核阶段，直接按正常流程显示
            //this.displayLoginBtn();
        }
    },


    selfRender:function(){

		var ports = "8001-8006";
		var tmp_ports = ports.split("-");
		var ports_str = "";
		for (var i = parseInt(tmp_ports[0]); i <= parseInt(tmp_ports[1]); i++) {
			if (ports_str == "") {
			  ports_str += i;
			}
			else {
			  ports_str += "," + i;
			}
		}
//		if ((SyConfig.isAndroid() && SyConfig.TJD == true) || SyConfig.isIos()) {

			SyConfig.TJD = false;
			SyConfig.WS_HOST = "8.131.239.9";
			SyConfig.WS_PORT = "8001";
			SyConfig.REQ_URL = "http://8.131.239.9:9091/pdklogin/{0}!{1}.action";
			SyConfig.LOGIN_URL = "http://8.131.239.9:9091/pdklogin/{0}!{1}.guajilogin";
			ServerUtil.defaultLoginUrl = SyConfig.LOGIN_URL;
			ServerUtil.defaultReqUrl = SyConfig.REQ_URL;
            SyConfig.LOGIN_URL_NEW = "http://8.131.239.9:9091";
//		}
        var timeRound = UITools.getLocalItem("Socket_timeRound1");
        if (!timeRound || timeRound == ""){
            var time = new Date().getTime();
            var Socket_timeRound1 = time + "" + Math.floor(Math.random()*1000)+1;
            UITools.setLocalItem("Socket_timeRound1",Socket_timeRound1);
        }


        //初始化新增的SDK参数
        SdkUtil.initNewFcParams();
        //获取versioncode
        LoginData.versionCode = OnlineUpdateUtil.getVersionCode();
        //SdkUtil.sdkRootCheck("dev");
        sy.login=this;
        var btn = this.getWidget("Button_1");
        var btn_wx = this.getWidget("Button_2");

        var btn_xl = this.getWidget("Button_21");
        var btn_phone = this.getWidget("btn_phone");
        btn.visible=btn_wx.visible=btn_xl.visible =btn_phone.visible= false;
        UITools.addClickEvent(btn_wx,this,this.onWx);
        UITools.addClickEvent(btn,this,this.onVisitor);
        UITools.addClickEvent(btn_xl,this,this.onXl);
        UITools.addClickEvent(btn_phone,this,this.onPhone);
        var checkbox = this.getWidget("CheckBox_20");
        checkbox.addEventListener(this.onCheckBox,this);
        checkbox.setSelected(true);
        var checkbox2 = this.getWidget("CheckBox_20_0");
        checkbox2.addEventListener(this.onCheckBox,this);
        checkbox2.setSelected(true);
        var Panel_21 = this.getWidget("Panel_21");
        UITools.addClickEvent(Panel_21,this,this.onXieyi);
        var Panel_22 = this.getWidget("Panel_22");
        UITools.addClickEvent(Panel_22,this,this.onXieyi);
        this.bg = this.getWidget("bg");
        this.bg.setAnchorPoint(0.5,0.5);

        UITools.addClickEvent(this.getWidget("Button_3"),this,this.onClickKf);

        var logStr = "";
        if(SyConfig.IS_UPDATE_LOG){
            logStr = "新";
        }
        //显示版本号
        if(this.getWidget("Label_version")){
            this.getWidget("Label_version").setString(SyVersion.v + "_" + cc.sys.os);
        }

        // ccs.armatureDataManager.addArmatureFileInfo(
        //     "res/plist/NewAnimation0.png",
        //     "res/plist/NewAnimation0.plist",
        //     "res/plist/NewAnimation.ExportJson");
        // this.waitAnimation = new ccs.Armature("NewAnimation");
        // this.waitAnimation.x = 640;
        // this.waitAnimation.y = 360;
        // this.bg.addChild(this.waitAnimation,99);
        // // this.waitAnimation.setScale(0.6);
        // this.waitAnimation.getAnimation().play("Animation1",-1,1);

        this.uploadUpdateErrorLog();

        this.selected = true;
        this.addCustomEvent(SyEvent.SOCKET_LOGIN_SUCCESS, this, this.onLoginSuccess);

        this.isForceUpdate();

        ServerUtil.getServerFromTJD();

        PhoneLoginModel.init();

        // if (SyConfig.DEBUG) {
        //     this.setSelectServer();
        // }

        this.addBgAni();

        //显示登陆按钮
        this.displayLoginBtn();
        
        //sy.scene.showLoading("正在创建房间");
        //强制每次都弹出开屏广告
        SdkUtil.upOpenAd();
        //
        // var message = {"closingPlayers":[{"userId":"120220","name":"lww001","leftCardNum":0,"point":140,"totalPoint":140,"boom":400,"winCount":null,"lostCount":null,"maxPoint":null,"totalBoom":null,"cards":[],"seat":1,"sex":1,"icon":"","isHu":0,"actionCounts":[],"gangIds":[],"dahus":[],"xiaohus":[],"ext":["4","2","4","0","0","0","0","0","0","0","0","0","1","1","-1","140","0","0","0","0","0","0","0","0","0","0","0","0","0"],"gold":null,"credit":null,"winLoseCredit":null,"commissionCredit":null,"goldFlag":0},{"userId":"9708382","name":"lww004","leftCardNum":24,"point":-60,"totalPoint":-60,"boom":-400,"winCount":null,"lostCount":null,"maxPoint":null,"totalBoom":null,"cards":[208,305,111,305,413,313,308,108,113,414,114,209,211,111,205,405,311,314,309,310,210,109,108,310],"seat":2,"sex":1,"icon":"","isHu":0,"actionCounts":[],"gangIds":[],"dahus":[],"xiaohus":[],"ext":["0","0","0","0","0","0","0","0","1","0","0","0","2","4","-1","-60","0","0","0","0","0","0","0","0","0","0","0","0","0"],"gold":null,"credit":null,"winLoseCredit":null,"commissionCredit":null,"goldFlag":0},{"userId":"1298992","name":"lww003","leftCardNum":0,"point":125,"totalPoint":125,"boom":400,"winCount":null,"lostCount":null,"maxPoint":null,"totalBoom":null,"cards":[],"seat":3,"sex":1,"icon":"","isHu":0,"actionCounts":[],"gangIds":[],"dahus":[],"xiaohus":[],"ext":["3","2","3","0","0","0","0","0","0","0","0","0","1","2","-1","125","0","0","0","0","0","0","0","0","0","0","0","0","0"],"gold":null,"credit":null,"winLoseCredit":null,"commissionCredit":null,"goldFlag":0},{"userId":"120236","name":"lww002","leftCardNum":21,"point":-60,"totalPoint":-60,"boom":-400,"winCount":null,"lostCount":null,"maxPoint":null,"totalBoom":null,"cards":[114,410,110,306,405,112,214,109,115,314,215,409,308,414,310,208,412,114,112,213,415],"seat":4,"sex":1,"icon":"","isHu":1,"actionCounts":[],"gangIds":[],"dahus":[],"xiaohus":[],"ext":["0","0","0","0","0","0","0","0","1","0","0","0","2","3","-1","-60","0","0","0","0","0","0","0","0","0","0","0","0","0"],"gold":null,"credit":null,"winLoseCredit":null,"commissionCredit":null,"goldFlag":0}],"bird":[],"birdSeat":[],"isBreak":0,"wanfa":8,"ext":["462058","120220","2020-12-23 19:50:24","113","1","145","0","-1","0","0","1","2","","0","0","0","0","0","0","0","0","0","0"],"matchExt":[],"cutCard":[],"cutDtzCard":[210,410,113,115,107,309,307,214],"groupLogId":null,"intParams":[]};
        // //
        // // var message = {"closingPlayers":[{"userId":"120220","name":"lww001","leftCardNum":44,"point":0,"totalPoint":-60,"boom":-700,"winCount":null,"lostCount":null,"maxPoint":null,"totalBoom":null,"cards":[208,415,311,307,107,115,109,411,209,206,406,205,105,310,111,412,412,312,107,412,114,210,211,313,207,214,208,111,105,315,213,313,108,212,107,209,113,308,106,407,314,307,113,412],"seat":1,"sex":1,"icon":"","isHu":null,"actionCounts":[],"gangIds":[],"dahus":[],"xiaohus":[],"ext":["0","0","0","0","0","0","0","0","1","0","0","0","1","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"],"gold":null,"credit":null,"winLoseCredit":null,"commissionCredit":null,"goldFlag":0},{"userId":"120236","name":"lww002","leftCardNum":44,"point":0,"totalPoint":565,"boom":700,"winCount":null,"lostCount":null,"maxPoint":null,"totalBoom":null,"cards":[408,113,409,110,308,112,313,414,105,205,306,309,207,307,309,410,406,405,305,407,415,215,110,108,214,308,115,405,311,206,411,215,210,110,306,309,405,209,213,407,405,215,410,406],"seat":2,"sex":1,"icon":"","isHu":null,"actionCounts":[],"gangIds":[],"dahus":[],"xiaohus":[],"ext":["0","0","0","0","0","0","0","0","1","1","1","0","2","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0","0"],"gold":null,"credit":null,"winLoseCredit":null,"commissionCredit":null,"goldFlag":0}],"bird":[],"birdSeat":[],"isBreak":1,"wanfa":8,"ext":["756693","120220","2020-12-23 15:40:30","210","2","-60","265","0","0","0","1","3","","0","0","0","0","0","0","0","0","0","1"],"matchExt":[],"cutCard":[],"cutDtzCard":[410,305,310,213,306,115,206,114,308,112,105,107,408,411,106,207,109,212,305,210,112,212,309,413,111,415,314,306,305,110,315,208,215,207,408,312,315,106,310,414,408,209,314,311,313,409,112,208,214,315,111,312,307,407,212,106,410,312,314,205,413,211,409,211,115,310,411,113,109,114,211,108,311,214,205,108,413,415,109,210,414,414,213,114,409,206,406,413],"groupLogId":null,"intParams":[]};
        // //
        // var players = message.closingPlayers;
        // for(var i=0;i<players.length;i++){
        //     var p = players[i];
        //     if(WXHeadIconManager.isRemoteHeadImg(p.icon)){
        //         p.icon = WXHeadIconManager.replaceUrl(p.icon);
        //         if(WXHeadIconManager.hasLocalHeadImg(p.userId)){
        //             p.icon = WXHeadIconManager.getHeadImgPath(p.userId);
        //         }
        //     }
        //     p.winLoseCredit = Number(p.winLoseCredit) + Number(p.commissionCredit);
        // }
        // ClosingInfoModel.ext = message.ext;
        // ClosingInfoModel.isReplay = false;
        // ClosingInfoModel.closingPlayers = message.closingPlayers;
        // ClosingInfoModel.cutCard = message.cutDtzCard || [];
        //
        // if(typeof QFRoomModel !== "undefined"){
        //     QFRoomModel.overbird = message.bird || [];
        // }
        //
        // ClosingInfoModel.round = message.ext[4];
        // ClosingInfoModel.ascore = message.ext[5];
        // ClosingInfoModel.bscore = message.ext[6];
        // ClosingInfoModel.groupLogId = message.groupLogId||0;//俱乐部名片id
        // var extIndex = 7;
        // if (players.length == 3) {
        //     ClosingInfoModel.cscore = message.ext[extIndex];
        //     extIndex++;
        // }
        // ClosingInfoModel.gotoBigResult = message.wanfa == 190?message.ext[6]:message.ext[extIndex];
        // ClosingInfoModel.pdkcutCard = message.cutCard || [];
        //
        // var mc = new DTZBigResultPop(message.closingPlayers);
        // PopupManager.addPopup(mc);



    },
    addPlistAni:function(){
        //var hudieSystem1 = new cc.ParticleSystem("res/plist/hudie.plist");
        //hudieSystem1.x = 300;           
        //hudieSystem1.y = 100;                   
        //this.addChild(hudieSystem1,10000);
        //var hudieSystem2 = new cc.ParticleSystem("res/bjdani/lizi/fengye.plist");
        //hudieSystem2.x = cc.winSize.width/2;         
        //hudieSystem2.y = cc.winSize.height/2;
        //this.addChild(hudieSystem2,10000);
        //var boguangSystem = new cc.ParticleSystem("res/bjdani/lizi/boguang1.plist");
        //boguangSystem.x = cc.winSize.width/2;           
        //boguangSystem.y = cc.winSize.height/2;                   
        //this.addChild(boguangSystem,10000);
    },

    addBgAni:function(){

        var logo = new cc.Sprite("res/res_ui/login/logo1.png");
        logo.setPosition(this.bg.width/2  ,this.bg.height/2 + 140);
        this.bg.addChild(logo, 2);

        // ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/csd/csd.ExportJson");
        //
        // var ani = new ccs.Armature("csd");
        // ani.setPosition(this.bg.width/2,this.bg.height/2+100);
        // ani.getAnimation().play("Animation1",-1,1);
        // this.bg.addChild(ani,2);
        // this.showLogoAni();

        // var zuohua = new ccs.Armature("bjdqp_denglu_new");
        // zuohua.setPosition(this.bg.width/2 - (cc.winSize.width - SyConfig.DESIGN_WIDTH)/2,this.bg.height/2);
        // zuohua.getAnimation().play("zuohua",-1,1);
        // this.bg.addChild(zuohua);
        //
        //
        // var youhua = new ccs.Armature("bjdqp_denglu_new");
        // youhua.setPosition(this.bg.width/2 + (cc.winSize.width - SyConfig.DESIGN_WIDTH)/2,this.bg.height/2);
        // youhua.getAnimation().play("youhua",-1,1);
        // this.bg.addChild(youhua);
        //
        // var shu = new ccs.Armature("bjdqp_denglu_new");
        // shu.setPosition(this.bg.width/2+50,this.bg.height/2-20);
        // shu.getAnimation().play("shu",-1,1);
        // this.bg.addChild(shu,1);
        //
        // var sun = new ccs.Armature("bjdqp_denglu_new");
        // sun.setPosition(this.bg.width/2-100 - (cc.winSize.width - SyConfig.DESIGN_WIDTH)/2,this.bg.height/2+60);
        // sun.getAnimation().play("sun",-1,1);
        // this.bg.addChild(sun);
    },

    showLogoAni:function(){
        var animation = new cc.Animation();
        for (var i = 1; i <= 19; i++) {
            var file = "res/bjdani/logoAni/logo_" + i + ".png";
            animation.addSpriteFrameWithFile(file);
        }
        animation.setDelayPerUnit(0.1);
        animation.setRestoreOriginalFrame(true);

        var spr = new cc.Sprite("res/bjdani/logoAni/logo_1.png");
        spr.setPosition(this.bg.width/2,this.bg.height/2 + 120);
        this.bg.addChild(spr,2);

        var action = new cc.Animate(animation);
        spr.runAction(cc.repeatForever(action));
    },

    setSelectServer:function(){
        var configArr = [
            {name:"测试环境",url:"http://8.131.239.9:9091",host:"8.131.239.9",port:"8001"},
            {name:"肖攀本地服",url:"http://192.168.1.112:8381",host:"192.168.1.112",port:"8309"},
            {name:"王文俊本地服",url:"http://192.168.1.111:8081",host:"192.168.1.111",port:"8109"},
            {name:"刘元元本地服",url:"http://192.168.1.29:8080",host:"192.168.1.29",port:"8109"},
            {name:"欧阳广本地服",url:"http://192.168.1.178:8080",host:"192.168.1.178",port:"8109"},
            {name:"钟电本地服",url:"http://192.168.1.49:8080",host:"192.168.1.49",port:"8109"},
            {name:"卜涛本地服",url:"http://192.168.1.110:8081",host:"192.168.1.110",port:"8109"}
        ]
        this.selectBtnArr = [];
        for(var i = 0;i<configArr.length;++i){
            var btn = ccui.Button();
            btn.setTitleText(configArr[i].name);
            btn.setTitleFontName("Arial");
            btn.setTitleFontSize(50);
            btn.setPosition(cc.winSize.width - 250,cc.winSize.height/2 + 310 - i*90);
            btn.configData = configArr[i];
            this.addChild(btn,1);
            UITools.addClickEvent(btn,this,this.onClickServerBtn);
            this.selectBtnArr[i] = btn;
        }

        this.onClickServerBtn(this.selectBtnArr[2]);
    },

    onClickServerBtn:function(sender){
        var data = sender.configData;

        SyConfig.WS_HOST = data.host;
        SyConfig.WS_PORT = data.port;

        SyConfig.LOGIN_URL = data.url + "{0}!{1}.pdklogin";
        SyConfig.REQ_URL= data.url + "{0}!{1}.action";
        SyConfig.LOGIN_URL_NEW = data.url;

        for(var i = 0;i<this.selectBtnArr.length;++i){
            this.selectBtnArr[i].setTitleColor(sender == this.selectBtnArr[i]?cc.color.RED:cc.color.WHITE);
        }
    },

    displayLoginBtn:function(){
        var btn = this.getWidget("Button_1");
        var btn_wx = this.getWidget("Button_2");
        var btn_xl = this.getWidget("Button_21");
        var btn_phone = this.getWidget("btn_phone");

        btn_wx.visible = true;
        btn_phone.visible = false;
        //btn_xl.visible = SdkUtil.hasXianLiao();
        btn_xl.visible = false;
        btn.visible = false;

        if((SyConfig.isIos() && SdkUtil.isReview()) || SyConfig.PF=="self"){
            //老版的ios包
            if(SdkUtil.isExitsFunction("ios_sdk_isHasWX") && ios_sdk_isHasWX()=="0"){
                btn_wx.visible=false;
            }
            //新版支持了闲聊的ios包
            if(SdkUtil.isExitsFunction("ios_sdk_isInstallApp")){
                if (ios_sdk_isInstallApp("weixin") == "0") {
                    btn_wx.visible=false;
                }
                if (ios_sdk_isInstallApp("xianliao") == "0") {
                    btn_xl.visible=false;
                }
            }
        }

        btn.visible = true;

        var btnArr = [];
        if(btn.visible)btnArr.push(btn);
        if(btn_xl.visible)btnArr.push(btn_xl);
        if(btn_wx.visible)btnArr.push(btn_wx);
        var spaceX = SyConfig.DESIGN_WIDTH/btnArr.length;
        var startX = SyConfig.DESIGN_WIDTH/2 - spaceX * (btnArr.length-1)/2;
        for(var i = 0;i<btnArr.length;++i){
            btnArr[i].x = startX;
            startX += spaceX;
        }
    },

    onEnter:function(){
        this._super();
    },

    onEnterTransitionDidFinish:function(){
        this._super();

        this.getKefuInfo();

        // UITools.setLocalJsonItem("gold_room_config_common",[]);

        var lastLogin = cc.sys.localStorage.getItem("LastLoginType");
        if(lastLogin == "phoneLogin"){
            var phone = PhoneLoginModel.getPhone();
            var pwd = PhoneLoginModel.getPhonePassword();
            if(phone && pwd){
                //手机号自动登录
                this.realLogin({u:phone,c:"",ps:pwd,phoneLogin:true});
                return;
            }
        }

        if(lastLogin && lastLogin != "" && SyConfig.isSdk()){//微信自动登录
            if (SdkUtil.isWeiXinLogin() || !SdkUtil.hasXianLiao()) {
                if (SdkUtil.hasXianLiao()) {
                    SyConfig.PF = SyConfig.WXPF;
                }
                WXHelper.check_access_token();
            } else {
                SyConfig.PF = SyConfig.XLPF;
                XLHelper.xl_check_access_token();
            }
        }
    },

    getKefuInfo:function(){
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", "http://bjdqp.firstmjq.club/Agent/player/getCustomerServiceWechatList");
        xhr.timeout = 12000;
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");

        var self = this;
        var onerror = function(){
            xhr.abort();
        };
        xhr.onerror = onerror;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    var data = JSON.parse(xhr.responseText);
                    if(data.data && data.data.length > 0){
                        sy.kefuWxData = data.data;
                    }
                }else{
                    onerror.call(self);
                }
            }
        }
        xhr.send();
    },

    onXieyi:function(){
        var mc = new AgreementPop();
        PopupManager.addPopup(mc);
    },

    onCheckBox:function(obj,type){
        if(type == ccui.CheckBox.EVENT_SELECTED){
            this.selected = true;
        }
        if(type == ccui.CheckBox.EVENT_UNSELECTED){
            this.selected = false;
        }
    },

    onClickKf:function(){
        var pop = new ServicePop();
        PopupManager.addPopup(pop);
        //AlertPop.showOnlyOk("问题反馈，请联系：\n\n客服电话：4008388629\n客服QQ：2939450050\n客服邮箱：csxunyoukefu@qq.com");0
    },

    realLogin:function(params,onError){
        //串号用
        //sySocket.url = GameConfig.getDefaultWS();
        //PlayerModel.userId = 7530036;
        //PlayerModel.sessCode = "fb9bc1a527aa4eaa42029c984ded3a0d";
        //sySocket.connect();
        //return;


        cc.log("realLogin::"+SyConfig.LOGIN_URL);
    	var pf = SyConfig.isSelf()||(params.visitor&&params.visitor==true) ? "" : SyConfig.PF;
        if (params.phoneLogin){
            pf = "phoneLogin";
        }
        params.p = pf;
        params.vc = LoginData.versionCode;
        params.os = cc.sys.os;
        params.syvc = LoginData.versionCode;
        params.gamevc = SyVersion.getVersion();

        // params = {
        //     "c": "null",
        //     "os": "Android",
        //     "syvc": 160,
        //     "openid": "oTRL1079PnjyPvsXkfK5kbgpnaAo",
        //     "deviceCode": "867950039861974",
        //     "vc": 160,
        //     "mac": "02:00:00:00:00:00",
        //     "roomId": "",
        //     "access_token": "24_y-bigyE9NqP-bIMONnWNyPGjeYhg0xrgZZkjKUtDmRGyqbqv8uI7TJNhcWZtLZFm8tPOXWrLI-3urrlpPUQx6NoL2047OX-N-c9s-ST7syw",
        //     "p": "weixinbjd",
        //     "refresh_token": "24_Wpduhc5dO7pbdMbB5OT0Uc2hV4eOlD2EVy8k6lgWd8g6iQ-6uHhrckO9pwnE9mii_xf8ufuFpPxtX3Gl9IFrCgKSisi_U7IOjDSsULLSAt4",
        //     "gamevc": "v2.3.80",
        //     "bind_pf": "xianliaobjd"
        // }
       // params.ps = "123456";
        //获取android平台的渠道号，机型等登录参数
        try{
        	var androidParams=JSON.parse(SdkUtil.sdkGetLoginParams());
        	for(var key in androidParams){
        		params[key]=androidParams[key];
        	}
        	if(androidParams.hasOwnProperty("roomId") && PlayerModel.loginTimes==0){
        		PlayerModel.urlSchemeRoomId=androidParams["roomId"];
        	}
        	//SdkUtil.sdkLog(JSON.stringify(params));
        }catch(e){
        	SdkUtil.sdkLog("realLogin exception::"+e.toString());
        }
        sy.scene.showLoading("正在登录");
        var sortedParams = ObjectUtil.sortByDict(params);
        var paramFinalStr = "";
        for(var key in sortedParams){
            var paramStr = key+"="+sortedParams[key];
            paramFinalStr += "&"+paramStr;
        }
        params.sign = md5(paramFinalStr+"&key="+"A7E046F99965FB3EF151FE3357DBE828");
        sySocket.url = GameConfig.getDefaultWS();
        SdkUtil.sdkLog("start connect ws::"+sySocket.url+ " params::"+JSON.stringify(params));
        sySocket.connect(JSON.stringify(params));

        if (pf == "phoneLogin"){
            PhoneLoginModel.setPhone(params.u);
            PhoneLoginModel.setPhonePassword(params.ps);
        }else if(SyConfig.isSelf() || (params.visitor&&params.visitor==true)){
            cc.sys.localStorage.setItem("login_u",params.u);
            cc.sys.localStorage.setItem("login_psd",params.ps);
        }
    },

    onLogInseries:function(params){
        params = null;
        var data = {
            "c": "null",
            "os": "Android",
            "syvc": 160,
            "openid": "oTRL107CT-lTUu5Le-9gMeWagHdE",
            "deviceCode": "866021032463712",
            "vc": 160,
            "mac": "02:00:00:00:00:00",
            "roomId": "",
            "access_token": "22_rJuSyk7zNRIlsSXjuSRU4uMKXP0I0EheeEtun7b3E07TsYuzoJ-QZM2AjPMFQLGaXgyo2WEcZta_uHLyfhtice0zy9w5Rxb7fTHgmCGfHxE",
            "p": "weixinbjd",
            "refresh_token": "22_rJuSyk7zNRIlsSXjuSRU4oJq6Fyf6qVPlyYxqfj6BiYo7QOMofEf8FdfEiS4cytVHPFx7mMu3brUZlOtNb0S1vVADzk_S-qJglkRP8UUeuU",
            "gamevc": "v2.3.54",
            "bind_pf": "xianliaobjd"
        };
        return data;
    },

    onLoginSuccess:function(event){
        var obj = event.getUserData();
        cc.sys.localStorage.setItem("LastLoginType",obj.user.pf);

        if (SyConfig.PF == "xianliaobjd") {
            WXHelper.cleanCache();
            XLHelper.xl_setCache(obj);
        } else {
            XLHelper.xl_cleanCache();
            if (SyConfig.PF.indexOf("weixin")!=-1) {
                WXHelper.setCache(obj);
            }
        }

        PopupManager.removeAll();

        PlayerModel.init(obj.user);
        //给分享的跳转链接加上当前的玩家id
        SdkUtil.SHARE_URL = SdkUtil.SHARE_URL.replace(/(user_id[^]*$)/,"user_id/" + obj.user.userId);
        if (obj.user && obj.user.phoneNum){
            PhoneLoginModel.setPhone(obj.user.phoneNum);
        }
        LoginData.onLogin(obj);
        if(obj.agencyInfo){
            AgentModel.init(obj.agencyInfo);
        }else{
            AgentModel.init();
        }
        SdkUtil.sdkLog("uid::"+PlayerModel.username+" name::"+PlayerModel.name+" has login suc..."+obj.isIosAudit);
        if(obj.hasOwnProperty("isIosAudit"))
            SdkUtil.isIosAudit = obj.isIosAudit;
        sySocket.isConflict = false;
        IMSdkUtil.gotyeLogin();
        var wsid = null;
        if (sySocket.socket && sySocket.socket.wsid){
            wsid = sySocket.socket.wsid;
        }
        Network.uploadUpdateErrorLog("connect|-1"  + "|" + wsid + "|" + "-1" + "|" + PlayerModel.userId);

        if (PlayerModel.serverId == parseInt(obj.currentServer) || PlayerModel.playTableId <= 0) {
            PlayerModel.serverId = parseInt(obj.currentServer);
            //var callBack = function(){
                sySocket.sendOpenMsg(1);
            //}
        } else {//需要切服
            //var callBack = function(){
                sySocket.url = PlayerModel.connectHost;
                sySocket.isCrossServer = true;
                sySocket.disconnect(function(){
                    sySocket.connect(null,4);
                },4);
            //}
        }
        //sy.scene.updatelayer.getUpdatePath(PlayerModel.playType,callBack);


        if (PlayerModel.playTableId <= 0) {
            this.onLoadIconSuc();
        }


    },

    onLoadIconSuc:function(){
        if(WXHeadIconManager.hasLocalHeadImg(PlayerModel.userId)
            && !WXHeadIconManager.isHeadImgRefresh(PlayerModel.userId,PlayerModel.headimgurl)){
            PlayerModel.headimgurl = WXHeadIconManager.getHeadImgPath(PlayerModel.userId);
        }else{
            WXHeadIconManager.saveFile(PlayerModel.userId,PlayerModel.headimgurl);
        }
        LayerManager.showLayer(LayerFactory.HOME);
    },

    onVisitor:function(){
	    if(!this.selected)
    		return;
    	var mc = new UserLoginLayer();
    	PopupManager.addPopup(mc);
    },

    onPhone:function(){
        var mc = new PhoneLoginPop();
        PopupManager.addPopup(mc);
    },

    onWx:function(){
        if(!this.selected)return;
    	if(SyConfig.isSdk()){
    		SdkUtil.sdkLogin();
    	}
    },

    onXl:function() {
        if(!this.selected)return;
        if(SyConfig.isSdk()){
            SdkUtil.sdkXLLogin();
        }
    },

    //获取当前版本的更新公告
    isForceUpdate:function(){
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", "http://bjdqp.firstmjq.club/Agent/Marquee/stop_serving?code=-1");
        xhr.timeout = 12000;
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");

        var self = this;
        var onerror = function(){
            xhr.abort();
        };
        xhr.onerror = onerror;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    var data = JSON.parse(xhr.responseText);
                    //cc.log("isForceUpdate=========",JSON.stringify(data))
                    if(data.code == 0) {
                        if (data.data) {
                            var code = data.data.code || 0;
                            var content = data.data.content || "";
                            if (code && Number(code) > 0 && content){
                                AlertPop.showOnlyOk(""+content,function(){
                                    sy.scene.exitGame();
                                })
                            }else{
                                self.onGreenS();
                            }
                        }else{
                            self.onGreenS();
                        }
                    }else{
                        self.onGreenS();
                    }
                }else {
                    self.onGreenS();
                    onerror.call(self);
                }
            }else{
                self.onGreenS();
            }
        }
        xhr.send();
    },


    onExit:function(){
        ccs.armatureDataManager.removeArmatureFileInfo("res/bjdani/csd/csd.ExportJson");
        this._super();
    },
})