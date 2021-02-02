/**
 * Created by cyp on 2019/3/2.11
 */
var BjdHomeLayer = BaseLayer.extend({
    ctor:function(){
        this._super(LayerFactory.BJD_HOME);

        LayerManager.inRoom = false;
    },

    selfRender:function(){
        cc.log("========BjdHomeLayer=========selfRender==========");
        //SignInModel.isClickCheck = false;

        this.webViewNode = new cc.Node();
        this.addChild(this.webViewNode);

        this.addCustomEvent(SyEvent.PLAYER_PRO_UPDATE,this,this.onPlayerUpdate);
        this.addCustomEvent(SyEvent.UPDATE_BE_INVITE_RED,this,this.updateMsgRed);
        this.addCustomEvent(SyEvent.SWITCH_CLUB, this, this.switchClub);
        //this.addCustomEvent(SyEvent.UPDATE_HALL_BACKGROUND,this,this.updateHallBackground);
        this.addCustomEvent(SyEvent.NEW_YEAR_ACTIVITY_NOTICE, this, this.onActivityNotice);
        this.addCustomEvent(SyEvent.NEW_YEAR_ACTIVITY_HBLX, this, this.onClickHblxBtn);
        this.addCustomEvent(SyEvent.REMOVE_POP_ALL,this,this.onRemoveAllPop);
        this.addCustomEvent(SyEvent.GOLD_PYQ_LIST,this,this.onGoldPyqList);
        this.addCustomEvent(SyEvent.UPDATE_NAME_CHANGE,this,this.onUpdateUserName);

        this.addCustomEvent("Get_Gold_Room_Hall_Data",this,this.initGoldRoomButton);
        this.addCustomEvent("Set_Agent_button",this,this.setAgentBtn);
        this.addCustomEvent(SyEvent.GOLDEN_EGGS,this,this.addGoldenEggs);
        this.addCustomEvent(SyEvent.NEW_CARNIVAL_ICON,this,this.addNewCarnival);
        this.addCustomEvent(SyEvent.NEW_CARNIVAL_REFRESH,this,this.refreshNewCarnivalRed);

        //绑定按钮点击事件
        // for(var i = 1;i <= 3; i++){
        var btn_create = this.getWidget("btn_create_1")
        btn_create.setTag(1)
        UITools.addClickEvent(btn_create, this , this.onClickCreateBtn);
        // }
        //UITools.addClickEvent(this.getWidget("btn_create") , this , this.onClickCreateBtn);
        UITools.addClickEvent(this.getWidget("btn_join") , this , this.onClickJoinBtn);
        UITools.addClickEvent(this.getWidget("btn_invite") , this , this.onClickInviteBtn);
        UITools.addClickEvent(this.getWidget("btn_kf") , this , this.onClickKfBtn);
        UITools.addClickEvent(this.getWidget("btn_zhanji") , this , this.onClickZhanjiBtn);
        UITools.addClickEvent(this.getWidget("btn_set") , this , this.onClickSetBtn);

        // var cqBtn = this.getWidget("btn_chuanqi");
        // cqBtn.visible = false;
        // cqBtn.x = cqBtn.x+20
        // UITools.addClickEvent(cqBtn, this , this.sendLegend);

        UITools.addClickEvent(this.getWidget("btn_pyq") , this , this.onClickPyqBtn);
        // this.btn_cwdl = this.getWidget("btn_cwdl");
        // this.btn_cwdl.tempData = 1;
        // UITools.addClickEvent(this.btn_cwdl , this , this.onClickCwdlBtn);

        // this.btn_cwdl.visible = false;//PlayerModel.isAgenter;

        //UITools.addClickEvent(this.getWidget("btn_diqu") , this , this.onClickDiquBtn);
        UITools.addClickEvent(this.getWidget("btn_head") , this , this.onClickHeadBtn);

        // this.btn_bind = this.getWidget("btn_bind");/** 绑定邀请码 **/
        // UITools.addClickEvent(this.btn_bind , this , this.onClickBind);

        // this.btn_bind.visible = false;//PlayerModel.isHasBind;


        // this.btn_zszs = this.getWidget("btn_zszs");
        // this.btn_zsjl = this.getWidget("btn_zsjl");
        // // this.btn_zszs.visible = this.btn_zsjl.visible = false;

        // SyEventManager.addEventListener(SyEvent.SOCKET_OPENED,this,this.onSocketOpen);

        // UITools.addClickEvent(this.btn_zszs,this,this.onClickZszs);
        // UITools.addClickEvent(this.btn_zsjl,this,this.onClickZsjl);

        // this.btn_qxgl = this.getWidget("btn_qxgl");
        // this.btn_qxgl.visible = false;
        // UITools.addClickEvent(this.btn_qxgl, this, this.onClickQxgl);
        // this.onClickQxgl();

        this.btn_msg = this.getWidget("btn_msg");
        UITools.addClickEvent(this.getWidget("btn_msg") , this , this.onClickMsgBtn);

        // this.btn_dhsc = this.getWidget("btn_dhsc");
        // UITools.addClickEvent(this.btn_dhsc, this, this.sendTaskReq);

        // this.btn_pastime = this.getWidget("btn_pastime");
        // this.btn_pastime.visible = false;
        // UITools.addClickEvent(this.btn_pastime, this, this.onPastime);

        this.getWidget("label_version").setString(SyVersion.v);

        this.setUserInfo();


        this.paomadeng = new PaoMaDeng();
        this.addChild(this.paomadeng,10);
        this.paomadeng.anchorX=this.paomadeng.anchorY=0;
        this.paomadeng.updatePosition(10,880);
        this.paomadeng.visible = false;

        if(parseInt(PlayerModel.urlSchemeRoomId)>0){
            sy.scene.showLoading("正在进入房间");
        }else{ 
            sy.scene.hideLoading();
        }

        ////头像
        var imgHead = this.getWidget("img_head");
        // var sten=new cc.Sprite("res/ui/bjdmj/hall_img_touxiang_2.png");
        // var clipnode = new cc.ClippingNode();
        // clipnode.attr({stencil:sten,anchorX:0.5,anchorY:0.5,x:imgHead.width/2,y:imgHead.height/2,alphaThreshold:0.8});
        var sprite = this.headSpr = new cc.Sprite("res/ui/common/default_m_big.png");
        sprite.setScale(imgHead.width/sprite.width);
        sprite.x = imgHead.width/2;
        sprite.y = imgHead.height/2;
        // clipnode.addChild(sprite);
        imgHead.addChild(sprite,1);

        var img_kuang = this.getWidget("img_kuang");
        this.headRedPoint =  new cc.Sprite("res/ui/bjdmj/popup/pyq/red_point.png");
        this.headRedPoint.x = 2;
        this.headRedPoint.y = img_kuang.height -2;
        img_kuang.addChild(this.headRedPoint,100);
        this.headRedPoint.visible = !GameConfig.isRegist;
        GameConfig.isRegist = true;


        this.onLoadIconSuc();
        //WXHeadIconManager.saveFile(PlayerModel.userId,PlayerModel.headimgurl,this.onLoadIconSuc,this);

        if(LoginData.apkurl){//安卓整包更新
            AlertPop.showOnlyOk("发现最新版本，请更新后进入游戏", function(){
                OnlineUpdateUtil.downloadApk();
            });
        }

        // this.setGgRed(!cc.sys.localStorage.getItem("sy_is_show_gg_layer"));

        this.getNoticeData();
        this.getPlayerDailiState();
        this.getAllShareUrl();
        this.getNoticeContent();
        //this.showShopTip()

        this.scheduleUpdate();


        // ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/baozhade/baozhade.ExportJson");
        // var ani = new ccs.Armature("baozhade");
        // ani.setPosition(cc.winSize.width/2 - 280,cc.winSize.height/2 - 270);
        // ani.getAnimation().play("Animation1",-1,1);
        // this.addChild(ani,2);

        ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/qiuji_dt/qiuji_dt.ExportJson");
        // var ani = new ccs.Armature("qiuji_dt");
        // ani.setPosition(cc.winSize.width/2 - 280,cc.winSize.height/2 - 270);
        // ani.getAnimation().play("huaping",-1,1);
        // this.addChild(ani,2);
        //this.hour = 0
        this.Panel_bg = this.getWidget("Panel_bg");
        //this.updateHallBackground();

        this.onActivityNotice();

        // this.beans_num = this.getWidget("beans_num");
        // this.beans_num.setString(""+UITools.moneyToStr(PlayerModel.getCoin()));

        // var shopAdd = ccui.helper.seekWidgetByName(this.getWidget("zs_bg"),"btn_add");
        // shopAdd.tag = 1;
        // UITools.addClickEvent(shopAdd , this , this.onClickAddBtn);
        // var beansAdd = ccui.helper.seekWidgetByName(this.getWidget("beans_bg"),"btn_add");
        // beansAdd.tag = 3;
        // UITools.addClickEvent(beansAdd , this , this.onClickAddBtn);

        // var missionBtn = this.getWidget("btn_mission");
        // this.missionRedPoint = ccui.helper.seekWidgetByName(missionBtn,"red_icon");
        // this.missionRedPoint.visible = BeansConfigModel.showMissionRedPoint;
        // UITools.addClickEvent(missionBtn , this , function () {
        //     sySocket.sendComReqMsg(1117 , [2]);
        // });
        // this.addCustomEvent(SyEvent.MISSION_STATUS,this,this.RefreshMissionRedPoint);
        // this.addCustomEvent(SyEvent.PLAYER_PRO_UPDATE,this,this.onGoldUpdate);   
        // this.btn_ylc = this.getWidget("btn_ylc");
        // UITools.addClickEvent(this.btn_ylc, this, this.onylc);
        // this.onHallList();
        // var more_bg = this.getWidget("more_bg");

        // var Button_more = this.getWidget("Button_more");
        // UITools.addClickEvent(Button_more , this , function () {
        //     more_bg.visible = !more_bg.isVisible();
        // });

        // this.ScrollView_hall = this.getWidget("ScrollView");
        // this.ScrollView_hall.setBounceEnabled(false);
        // this.ScrollView_hall.setScrollBarEnabled(false);

        // this.scrollHallItem = this.getWidget("roomButton");//ccui.helper.seekWidgetByName(this.ScrollView_hall,"roomButton");
        // this.scrollHallItem.retain();
        // this.scrollHallItem.removeFromParent(true);


        // this.PageView_hall = this.getWidget("PageView");
        // this.PageView_hall.setBounceEnabled(false);
        // this.PageView_hall.setScrollBarEnabled(false);

        // this.PageView_hall.addEventListener(this.pageViewEvent, this);;

        // this.Panel_pageImg = this.getWidget("Panel_pageImg");
        // this.Image_page = this.getWidget("Image_page");
        var offx = 50;
        if(cc.winSize.width > SyConfig.DESIGN_WIDTH){
            // this.getWidget("Image_50").x -= (cc.winSize.width - SyConfig.DESIGN_WIDTH)/2;
            this.getWidget("head_bg").x -= (cc.winSize.width - SyConfig.DESIGN_WIDTH)/2;
            this.getWidget("btn_set").x += (cc.winSize.width - SyConfig.DESIGN_WIDTH)/2;
            this.getWidget("label_version").x -= (cc.winSize.width - SyConfig.DESIGN_WIDTH)/2;
        }
        // this.addBtnAni();
        var time = new Date();
        var date = time.getDate();
        
        this.addCustomEvent("Get_User_myself_Data",this,this.getMySelfData);

        setTimeout(function(){/** 请求一次个人信息装扮数据 **/
            sySocket.sendComReqMsg(1131 , [2]);
        },0);

        SyEventManager.addEventListener("QXQQHD_UPDATE_REDPOINT",this,this.getRedPointData);

        // this.btn_backpackq = this.getWidget("btn_pack");
        // this.btn_backpackq.addTouchEventListener(this.onOpenBackpack,this);

        this.addGoldenEggs();

        this.addHallAni();
    },

    addHallAni:function(){
        ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/003/003.ExportJson");
        ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/003gy/003gy.ExportJson");
        ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/dlong2/dlong2.ExportJson");
        ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/llong/llong.ExportJson");

        var ani = new ccs.Armature("003");
        var shuiNode = this.getWidget("Image_shui");
        //ani.setPosition(shuiNode.width/2,shuiNode.height/2);
        //ani.setPosition(shuiNode.x,shuiNode.y);
        ani.getAnimation().play("Animation1",-1,1);
        shuiNode.addChild(ani,1);

        ani = new ccs.Armature("003gy");
        var guangNode = this.getWidget("Image_guang");
        //ani.setPosition(guangNode.width/2,guangNode.height/2);
        ani.setPosition(-260,-400);
        ani.getAnimation().play("Animation1",-1,1);
        guangNode.addChild(ani,1);

        ani = new ccs.Armature("dlong2");
        var leftNode = this.getWidget("Image_leftAni");
        //ani.setPosition(leftNode.width/2,leftNode.height/2);
        ani.setPosition(-215,-50);
        ani.getAnimation().play("Animation1",-1,1);
        leftNode.addChild(ani,1);

        ani = new ccs.Armature("llong");
        var rightNode = this.getWidget("Image_rightAni");
        //ani.setPosition(rightNode.width/2,rightNode.height/2);
        ani.setPosition(0,-50);
        ani.getAnimation().play("Animation1",-1,1);
        rightNode.addChild(ani,1);
    },

    setAgentBtn:function(){
        // this.btn_cwdl.visible = PlayerModel.isAgenter;
        // this.btn_bind.visible = PlayerModel.isHasBind;
    },

    onClickZszs:function(){
        var pop = new ZszsLayer();
        PopupManager.addPopup(pop);
    },

    onClickZsjl:function(){
        var pop = new ZsjlLayer();
        PopupManager.addPopup(pop);
    },

    onClickQxgl:function(){
        var pop = new PowerManagePop();
        PopupManager.addPopup(pop);
    },

    onSocketOpen:function(){
        // this.btn_zszs.visible = this.btn_zsjl.visible = PlayerModel.canZszs;
        // this.btn_qxgl.visible = PlayerModel.canPowerManage;
    },

    onClickBind:function(){
        var pop = new BindInvitePop();
        PopupManager.addPopup(pop);
    },

    addNewCarnival:function(){
        //var isShow = cc.sys.localStorage.getItem("sy_show_new_carnival");
        //if(isShow && isShow != PlayerModel.userId){
        //    return
        //}else{
        //    cc.sys.localStorage.setItem("sy_show_new_carnival",PlayerModel.userId);
        //}

        SyEventManager.addEventListener(SyEvent.NEW_CARNIVAL_GUIDE,this,this.onNewGuide);
        this.btn_carnival = new ccui.Button("res/ui/bjdmj/popup/light_touming.png","","");
        this.btn_carnival.setPosition(200,-70);
        UITools.addClickEvent(this.btn_carnival, this , this.onNewCarnivalBtn);
        this.getWidget("head_bg").addChild(this.btn_carnival,1000);
        this.btn_carnival.setScale9Enabled(true)
        this.btn_carnival.setContentSize(110,110);
        //ccs.armatureDataManager.addArmatureFileInfo("res/res_activity/newcarnival/animation/kuanghuan/kuanghuan.ExportJson");
        //var ani = new ccs.Armature("kuanghuan");
        //ani.setPosition(this.btn_carnival.width/2,this.btn_carnival.height/2-9);
        //ani.getAnimation().play("Animation1",-1,1);
        //this.btn_carnival.addChild(ani,1);
        //ani.setScale(0.77)

        this.red_xrkh = new cc.Sprite("res/ui/bjdmj/hall_img_hongdian.png");
        this.red_xrkh.setPosition(this.btn_carnival.width,this.btn_carnival.height - 15);
        this.btn_carnival.addChild(this.red_xrkh,2);
        this.red_xrkh.visible = false
        this.refreshNewCarnivalRed()
    },

    refreshNewCarnivalRed:function(){
        if(this.red_xrkh){
            this.red_xrkh.visible = NewCarnivalModel.isShowRedPoint
        }
    },

    onNewCarnivalBtn:function(){
        cc.log("onNewCarnivalBtn")
        sySocket.sendComReqMsg(1006, [0,12,0]);
    },

    onNewGuide:function(){
        //var Button_pdk = this.getWidget("Button_pdk");
        //var pos = cc.p((cc.winSize.width - SyConfig.DESIGN_WIDTH)/2 + 593,252)
        //var filePath = "res/res_activity/newcarnival/animation/yd2/yd2.ExportJson"
        //var pop = this.getChildByName("NewGuidePop")
        //if(pop) pop.removeFromParent(true)
        //pop = new NewGuidePop();
        //var callBack = function(){
        //    pop.removeFromParent(true)
        //}
        //pop.setName("NewGuidePop")
        //pop.initDrawNode(Button_pdk.width-8,Button_pdk.height-7,pos,callBack)
        //pop.addArmature(filePath,"yd2","Animation2",cc.p((cc.winSize.width - SyConfig.DESIGN_WIDTH)/2 + 640,230))
        //this.addChild(pop,100);
    },

    getMySelfData:function(event){
        var message = event.getUserData();
        var params = message.params;
        var img_kuang = this.getWidget("img_kuang");
        // if(params[0] == 2){/** 获取头像框 **/
        //     //UserLocalDataModel.setUserIconVisible(this.headSpr);
        //     UserLocalDataModel.changeUserIcon(img_kuang);
        // }else if(params[0] == 3){
        //     cc.log(" 收到消息更换头像框 ");
        //     //UserLocalDataModel.setUserIconVisible(this.headSpr);
        //     UserLocalDataModel.changeUserIcon(img_kuang);
        // }
    },

    onOpenBackpack:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            // var pop = new UserBackpackPop(2);//UserBackpackPop(2);UserAchievementPop
            // PopupManager.addPopup(pop);

            //UserRewardModel.endLv = 2;
            //var mc = new UserRewardPop(["1:1000","2:2","3:100","10:1","1001:1"]);
            //PopupManager.addPopup(mc,2);

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    addGoldenEggs:function(){
        if(GoldenEggsModel.isShowEggIcon){
            if(!this.btn_golden){
                this.btn_golden = new ccui.Button("res/ui/bjdmj/popup/light_touming.png","","");
                this.btn_golden.setPosition(80,-70);
                UITools.addClickEvent(this.btn_golden, this , this.onGoldenEggsBtn);
                this.getWidget("head_bg").addChild(this.btn_golden,1000);
                this.btn_golden.setScale9Enabled(true)
                this.btn_golden.setContentSize(110,110);
                ccs.armatureDataManager.addArmatureFileInfo("res/res_activity/goldeneggs/animation/zajindantubiao/zajindantubiao.ExportJson");
                var ani = new ccs.Armature("zajindantubiao");
                ani.setPosition(this.btn_golden.width/2,this.btn_golden.height/2-17);
                ani.getAnimation().play("Animation1",-1,1);
                this.btn_golden.addChild(ani,1);
                ani.setScale(0.8)

                this.red_zjd = new cc.Sprite("res/ui/bjdmj/hall_img_hongdian.png");
                this.red_zjd.setPosition(this.btn_golden.width,this.btn_golden.height - 15);
                this.btn_golden.addChild(this.red_zjd);
                this.red_zjd.setVisible(GoldenEggsModel.isCanExchange);
            }
            if(this.optGoldenEggs){
                this.optGoldenEggs = false
                var pop = new GoldenEggsInfoPop();
                PopupManager.addPopup(pop);
            }
        }
    },

    onGoldenEggsBtn:function() {
        cc.log("onGoldenEggsBtn")
        this.optGoldenEggs = true
        sySocket.sendComReqMsg(139, [109]);
    },

    /** 添加广告签到的入口 **/
    addGuangGaoQianDao:function(){
        this.ggqdBtn = new ccui.Button("res/ui/bjdmj/qiandao/mrsl.png","","");
        this.getWidget("head_bg").addChild(this.ggqdBtn,20);
        this.ggqdBtn.x = -45;//350;
        this.ggqdBtn.y = -70;//900;
        //this.getWidget("mainMask").addChild(this.ggqdBtn,20);
        UITools.addClickEvent(this.ggqdBtn, this , this.onOpenQianDao);
        this.ggqdBtn.setScale(0.8)

        this.ggqdBtn.visible = (SyConfig.IS_LOAD_AD || SyConfig.IS_LOAD_AD_NEW);

        ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/NewAnimation4/NewAnimation4.ExportJson");
        var ggqd = new ccs.Armature("NewAnimation4");
        ggqd.setPosition(this.ggqdBtn.width / 2,this.ggqdBtn.height /2 - 10);
        ggqd.getAnimation().play("Animation1",-1,1);
        this.ggqdBtn.addChild(ggqd,1);
    },

    /** 广告签到界面 **/
    onOpenQianDao:function(){
        var mc = new NewQianDaoPop();
        PopupManager.addPopup(mc);
    },

    //擂台场广告界面
    onMatchAdvert:function(){
        var mc = new GoldMatchAdvertPop();
        PopupManager.addPopup(mc);
    },

    onEnter:function(){
        this._super();
    },

    onUpdateUserName: function () {
        this.setUserInfo();
        this.onLoadIconSuc();
    },

    pageViewEvent: function (sender, type) {
        for (var i = 0; i < this.PageImgArr.length; i++) {
            if(this.PageImgArr[i].tag == this.PageView_hall.getCurrentPageIndex()){
                this.PageImgArr[i].loadTexture("res/ui/bjdmj/bjdHomeLayer/lv.png");
            }else{
                this.PageImgArr[i].loadTexture("res/ui/bjdmj/bjdHomeLayer/hui.png");
            }
        }
    },

    initGoldRoomButton:function(){

    },
    onClickChangYongBtn:function(){
        var mc = new ChangYongPop();
        PopupManager.addPopup(mc);
    },
    showTips:function(parent){
        var tips = parent.getChildByName("tips")
        if(tips)return
        var string = "新功能";
        var bg = UICtor.cS9Img("res/ui/bjdmj/popup/shop/img_bg_tips.png",cc.rect(5,17,117,5),cc.size(150,75));
        bg.height = 65;
        bg.setPosition(parent.width/2+45,parent.height+32);
        bg.setName("tips")
        parent.addChild(bg);

        var wanfa_label = new cc.LabelTTF(string,"Arial",32);
        wanfa_label.setPosition(bg.width/2,bg.height/2+8);
        bg.addChild(wanfa_label, 10);

        var moveBy = cc.moveBy(0.3,0,15);
        var sequence_move = cc.sequence(cc.delayTime(1),moveBy,moveBy.reverse(),moveBy,moveBy.reverse()).repeatForever();
        bg.runAction(sequence_move);
    },

    onClickGoldMatch:function(){
        var mc = new GoldMatchPop();
        PopupManager.addPopup(mc);
    },

    updateItemHallUI:function(item){
        // var roomButton = item.getChildByName("roomButton"); //按钮
        var room_gameImg = item.getChildByName("room_gameImg"); // 玩法图片
        var ButtonBg = "";
        if(GameTypeManager.isPK(item.playType[0])){
            ButtonBg="res/ui/bjdmj/bjdHomeLayer/roomButton/puke.png"
        }else if(GameTypeManager.isZP(item.playType[0])){
            ButtonBg="res/ui/bjdmj/bjdHomeLayer/roomButton/zipai.png"
        }else if(GameTypeManager.isMJ(item.playType[0])){
            ButtonBg="res/ui/bjdmj/bjdHomeLayer/roomButton/majiang.png"
        }
        item.loadTextureNormal(ButtonBg);

        var gameImg = "res/ui/bjdmj/bjdHomeLayer/roomButton/"+item.buttonMsg[0]+".png";
        room_gameImg.loadTexture(gameImg);
    },
    onClickItemHall:function(item){
        cc.log("item =",item.type,item.keyId);
        // cc.sys.localStorage.setItem("BjdHome_ylc_iconId",item.buttonMsg[0]);
        // this.initGoldRoomButton();
        if(item.type == 2){
            //智能匹配前判断切服
            CheckJoinModel.toMatchRoom(item.playType,2);
        }else{
            // sySocket.sendComReqMsg(137 , [] , [] , 2);
            // if(SignInModel.isQianDao == false && !NewCarnivalModel.newCarnivalGuide){
            //     var pop = new SignInPop();
            //     PopupManager.addPopup(pop);
            // }
            // sySocket.sendComReqMsg(137 , [] , ""+item.keyId , 6);
        }
    },
    // onGoldUpdate:function(){
    //      cc.log("PlayerModel.getCoin()=0",PlayerModel.getCoin());
    //     if (this.beans_num){
    //         this.beans_num.setString(""+UITools.moneyToStr(PlayerModel.getCoin()));
    //     }
    // },
    RefreshMissionRedPoint:function(message){
        var data = message.getUserData();
        // cc.log("RefreshMissionRedPoint data =",JSON.stringify(data));
        this.missionRedPoint.visible = (data[0] == 1);
    },

    onGoldPyqList:function(event){
        var data = event.getUserData();
        var strParams = JSON.parse(data.strParams);
        GoldAreaListModel.clickClubId = strParams.goldRoomGroupId ? strParams.goldRoomGroupId : 0 ;
        GoldAreaListModel.goldClubList = strParams.groupList ? strParams.groupList : [];
        var groupList = GoldAreaListModel.goldClubList;
        if (groupList && GoldAreaListModel.goldClubList.length > 0){
            if (GoldAreaListModel.clickClubId){
                for(var i = 0;i<groupList.length;i++){
                    if(groupList[i].groupId == GoldAreaListModel.clickClubId){
                        GoldAreaListModel.clickClubRole = groupList[i].userRole;
                        break
                    }
                }
                //cc.log("onGoldPyqList",GoldAreaListModel.clickClubRole,GoldAreaListModel.clickClubId);
                sySocket.sendComReqMsg(137 , [] , [] , 0);
            }else{
                var pop = new GoldPyqChoosePop();
                PopupManager.addPopup(pop);
            }
        }else{
            sySocket.sendComReqMsg(137 , [] , [] , 0);
        }
    },

    onHallList:function(){
        sySocket.sendComReqMsg(137 , [] , [] , 5);
    },


    onActivityNotice:function(){
        // this.btn_hblx = this.getWidget("btn_hblx")
        // this.btn_xnzp = this.getWidget("btn_xnzp")
        // this.btn_yqyl = this.getWidget("btn_yqyl")
        // this.btn_hblx.visible = this.btn_xnzp.visible = this.btn_yqyl.visible = false
        return;
        this.getActivityStatus()
        this.activityDate = [[1,21],[1,22],[1,23],[1,29],[1,30],[1,31],[2,1]]
        this.activityHour = 22;
        this.activityMin = 60;
        this.checkShowActivityPop(1)
        UITools.addClickEvent(this.btn_hblx, this, this.onClickHblxBtn);
        UITools.addClickEvent(this.btn_xnzp, this, this.onClickXnzpBtn);
        UITools.addClickEvent(this.btn_yqyl, this, this.onClickYqylBtn);
        //this.schedule(this.updateTime,1,cc.REPEAT_FOREVER,0);
    },

    getActivityStatus:function(){
        var char_id = "char_id=" + PlayerModel.userId;
        var t = "&t=" + Math.round(new Date().getTime()/1000).toString();
        var rand = "&rand=" + ('000000' + Math.floor(Math.random() * 999999)).slice(-6);

        var sign = char_id + rand + t + "dfc2c2d62dde2c104203cf71c6e15580";
        sign = "&sign="+md5(sign).toUpperCase();

        var url = "http://bjdqp.firstmjq.club/agent/invite/getActivityStatus?"
        url = url + char_id + rand + t + sign
        Network.sypost(url,"",{type:"GET"},function(data){
            this.btn_hblx.getChildByName("red_icon").visible = data.data.redPackageIsGet == 1 ? true:false;
            this.btn_xnzp.getChildByName("red_icon").visible = data.data.turntableIsGet == 1 ? true:false;
            this.btn_yqyl.getChildByName("red_icon").visible = data.data.inviteIsGet == 1 ? true:false;
        }.bind(this), function(data){
        })
    },

    updateTime:function(){
        //新年活动
        this.checkShowActivityPop(2)
    },

    checkShowActivityPop:function(check){
        var serverDate = sy.scene.getCurServerTime()
        var date = new Date(serverDate)
        //var date = new Date()
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var type = 1;//1、活动时间界面，2、倒计时界面
        if(check == 1){
            this.showActivityPop(1)
            return;
        }
        if(check == 2){
            var showDay = false
            for(var i = 0;i<this.activityDate.length;i++) {
                if (month == this.activityDate[i][0] && day == this.activityDate[i][1]) {
                    showDay = true
                    break;
                }
            }
            if(!showDay)return
            RedPacket.showDay = showDay;
            var min = date.getMinutes();
            var sec = date.getSeconds();
            cc.log(hour,min,sec)
            var isShow = false;//是否自动弹出
            var bOpen = false;
            if(hour == this.activityHour-1){
                if((this.activityMin-min == 5 || this.activityMin-min == 10) && sec == 0){//活动前5分钟和前10分钟
                    isShow = true;
                }
            }else if(this.activityHour - hour == 1 && min == 0&& sec == 0){//活动前一个小时
                isShow = true;
            }else if(this.activityHour == hour && min == 0&& sec == 0){// && sec == 0
                isShow = true;
                bOpen = true
            }
            if(isShow)this.showActivityPop(2,bOpen)
        }
    },

    showActivityPop:function(type,bOpen){
        if(type == 1){
            var pop = new ActivityNoticePop();
            PopupManager.addPopup(pop);
        }else if(type == 2){
            if(LayerManager.getCurrentLayer() == LayerFactory.HOME || LayerManager.getCurrentLayer() == LayerFactory.PYQ_HALL){
                var activityPop = PopupManager.getClassByPopup(ActivityPop)
                if(!activityPop){
                    var pop = new ActivityPop(bOpen);
                    PopupManager.addPopup(pop);
                }else{
                    activityPop.setData(bOpen)
                }
            }
        }
    },

    onClickHblxBtn:function(){
        var char_id = "char_id=" + PlayerModel.userId;
        var t = "&t=" + Math.round(new Date().getTime()/1000).toString();
        var rand = "&rand=" + ('000000' + Math.floor(Math.random() * 999999)).slice(-6);

        var sign = char_id + rand + t + "dfc2c2d62dde2c104203cf71c6e15580";
        sign = "&sign="+md5(sign).toUpperCase();

        var url = "http://bjdqp.firstmjq.club/agent/redpackage/index?"
        url = url + char_id + rand + t + sign
        var url = Network.getWebUrl(url);
        if (SdkUtil.is316Engine() && (SyConfig.isIos() || SyConfig.isAndroid())){
            if (ccui.WebView){
                var viewport = cc.visibleRect;
                var webView = this.webView = new ccui.WebView();
                webView.x = viewport.center.x;
                webView.y = viewport.center.y;
                webView.setScalesPageToFit(true);
                webView.setContentSize(viewport);
                webView.loadURL(url);
                webView.setJavascriptInterfaceScheme("bjdqp");
                this.webViewNode.addChild(webView);
                this.webView.reload();

                webView.setOnJSCallback(function(sender, url) {
                    if (url.indexOf("bjdqp://close") >= 0) {
                        this.webView.removeFromParent();
                        this.webView = null;
                    }else if(url.indexOf("bjdqp://redpacketshare") >= 0) {
                        this.webView.removeFromParent();
                        this.webView = null;
                        this.showRedPacketSharePop()
                    }
                    this.getActivityStatus()
                }.bind(this));
            }
        }else{
            SdkUtil.sdkOpenUrl(url);
        }
    },

    showRedPacketSharePop:function(){
        RedPacketSharePop.show(true);
    },

    onClickXnzpBtn:function(){
        var char_id = "char_id=" + PlayerModel.userId;
        var t = "&t=" + Math.round(new Date().getTime()/1000).toString();
        var rand = "&rand=" + ('000000' + Math.floor(Math.random() * 999999)).slice(-6);

        var sign = char_id + rand + t + "dfc2c2d62dde2c104203cf71c6e15580";
        sign = "&sign="+md5(sign).toUpperCase();

        var url = "http://bjdqp.firstmjq.club/agent/turntable/index?"
        url = url + char_id + rand + t + sign
        var url = Network.getWebUrl(url);
        if (SdkUtil.is316Engine() && (SyConfig.isIos() || SyConfig.isAndroid())){
            if (ccui.WebView){
                var viewport = cc.visibleRect;
                var webView = this.webView = new ccui.WebView();
                webView.x = viewport.center.x;
                webView.y = viewport.center.y;
                webView.setScalesPageToFit(true);
                webView.setContentSize(viewport);
                webView.loadURL(url);
                webView.setJavascriptInterfaceScheme("bjdqp");
                this.webViewNode.addChild(webView);
                this.webView.reload();

                webView.setOnJSCallback(function(sender, url) {
                    if (url.indexOf("bjdqp://close") >= 0) {
                        this.webView.removeFromParent();
                        this.webView = null;
                        this.getActivityStatus()
                    }
                }.bind(this));
            }
        }else{
            SdkUtil.sdkOpenUrl(url);
        }
    },

    onClickYqylBtn:function(){
        var char_id = "char_id=" + PlayerModel.userId;
        var t = "&t=" + Math.round(new Date().getTime()/1000).toString();
        var rand = "&rand=" + ('000000' + Math.floor(Math.random() * 999999)).slice(-6);

        var sign = char_id + rand + t + "dfc2c2d62dde2c104203cf71c6e15580";
        sign = "&sign="+md5(sign).toUpperCase();

        var url = "http://bjdqp.firstmjq.club/agent/invite/index?"
        url = url + char_id + rand + t + sign

        var url = Network.getWebUrl(url);
        if (SdkUtil.is316Engine() && (SyConfig.isIos() || SyConfig.isAndroid())){
            if (ccui.WebView){
                var viewport = cc.visibleRect;
                var webView = this.webView = new ccui.WebView();
                webView.x = viewport.center.x;
                webView.y = viewport.center.y;
                webView.setScalesPageToFit(true);
                webView.setContentSize(viewport);
                webView.loadURL(url);
                webView.setJavascriptInterfaceScheme("bjdqp");
                this.webViewNode.addChild(webView);
                this.webView.reload();

                webView.setOnJSCallback(function(sender, url) {
                    if (url.indexOf("bjdqp://close") >= 0) {
                        this.webView.removeFromParent();
                        this.webView = null;
                    }else if(url.indexOf("bjdqp://invite") >= 0){
                        //关闭网页
                        this.webView.removeFromParent();
                        this.webView = null;
                        //分享
                        this.onClickInviteBtn()
                    }
                    this.getActivityStatus()
                }.bind(this));
            }
        }else{
            SdkUtil.sdkOpenUrl(url);
        }
    },

    showShopTip:function(){
        var string = "豪礼上线点击查看";
        var bg = UICtor.cS9Img("res/ui/bjdmj/hall_bg_xiala.png",cc.rect(5,17,117,5),cc.size(150,75));
        bg.setAnchorPoint(0.5,0);
        bg.height = string.length/4*60;
        bg.setPosition(this.btn_dhsc.width/2,-100);
        this.btn_dhsc.addChild(bg);

        var wanfa_label = new cc.LabelTTF(string,"Arial",32,cc.size(150, bg.height));
        wanfa_label.setAnchorPoint(0.5,0);
        wanfa_label.setPosition(bg.width/2+10,-30);
        bg.addChild(wanfa_label, 10);

        var moveBy = cc.moveBy(0.3,0,15);
        var sequence_move = cc.sequence(cc.delayTime(1),moveBy,moveBy.reverse(),moveBy,moveBy.reverse()).repeatForever();
        bg.runAction(sequence_move);
    },

    //兑换任务
    sendTaskReq: function(){
        var mc = new NewShopFacePop();
        PopupManager.addPopup(mc);
        return;

        var time = Math.floor(new Date().getTime()/1000);
        var sign = md5("0"+PlayerModel.userId+PlayerModel.username+time+"a4701f60719810263347242e3a992569");
        var oldUrl = "http://bjdqp.firstmjq.club/agent/player/exchangeAndTaskIndex/wx_plat/mjqz?";
        var url = Network.getWebUrl(oldUrl);
        //if (resultUrl){
        //    SdkUtil.sdkOpenUrl(resultUrl);
        //}
        if (SdkUtil.is316Engine() && (SyConfig.isIos() || SyConfig.isAndroid())){
            //var result = SdkUtil.setOrientation(2);
            //if (result == false) {
            //    SdkUtil.sdkOpenUrl(url);
            //    return;
            //}
            if (ccui.WebView){
                var viewport = cc.visibleRect;
                var webView = this.webView = new ccui.WebView();
                webView.x = viewport.center.x;
                webView.y = viewport.center.y;
                webView.setScalesPageToFit(true);
                webView.setContentSize(viewport);
                webView.loadURL(url);
                webView.setJavascriptInterfaceScheme("bjdqp");
                this.webViewNode.addChild(webView);
                this.webView.reload();

                webView.setOnJSCallback(function(sender, url) {
                    //SdkUtil.setOrientation(2);
                    //cc.log("OnJSCallback:" + url);
                    if (url.indexOf("bjdqp://close") >= 0) {
                        this.webView.removeFromParent();
                        this.webView = null;
                    }
                }.bind(this));
            }
        }else{
            SdkUtil.sdkOpenUrl(url);
        }
        //
        //var url = "http://bjdqp.firstmjq.club/agent/player/exchangeAndTaskIndex/wx_plat/mjqz?";
        //Network.sendWebReq(url);
    },

    onPastime:function(){
        cc.log("====onPastime====")

        var newVersionCode = 1;

        var downUrl = "https://testcdncfgh5.52bjd.com/pack/apk/bjdqipaiyule_200110.apk";
        if (!SdkUtil.isAppInstalled("cn.limsam.ddzyx")) {
            // 下载
            SdkUtil.startDownApp(downUrl, newVersionCode)
        } else {
            // 运行
            SdkUtil.startOtherApp("cn.limsam.ddzyx")
        }
    },

    updateHallBackground:function(){
        var date = new Date();
        var hours = date.getHours();
        //hours = this.hour
        //this.hour += 1;
        //var curBg = hours%2 == 0 ? "day":"night"
        var curBg = hours >= 6 && hours < 18 ? "day":"night";
        if(curBg == this.curBg) return
        this.curBg = curBg
        //if(this.curBg == "day"){
        if(hours >= 6 && hours < 18){
            if(!this.curImageBg){
                this.curImageBg = cc.Sprite("res/ui/bjdmj/hall_bg_light_1.png")
                this.curImageBg.setPosition(this.Panel_bg.width/2,this.Panel_bg.height/2)
                this.Panel_bg.addChild(this.curImageBg)
            }else{
                this.curImageBg.runAction(cc.sequence(cc.fadeTo(2,0),cc.callFunc(function(sender){
                    sender.removeFromParent(true)
                })))
                this.newImageBg = cc.Sprite("res/ui/bjdmj/hall_bg_light_1.png")
                this.newImageBg.setPosition(this.Panel_bg.width/2,this.Panel_bg.height/2)
                this.newImageBg.setOpacity(0)
                this.Panel_bg.addChild(this.newImageBg)
                this.newImageBg.runAction(cc.sequence(cc.fadeTo(2,255)))
                this.curImageBg = this.newImageBg;
            }
            if(!this.curImageFront){
                this.curImageFront = cc.Sprite("res/ui/bjdmj/hall_bg_light_2.png")
                this.curImageFront.setPosition(this.Panel_bg.width/2,this.Panel_bg.height/2)
                this.Panel_bg.addChild(this.curImageFront)
            }else{
                this.curImageFront.runAction(cc.sequence(cc.fadeTo(2,0),cc.callFunc(function(sender){
                    sender.removeFromParent(true)
                })))
                this.newImageFront = cc.Sprite("res/ui/bjdmj/hall_bg_light_2.png")
                this.newImageFront.setPosition(this.Panel_bg.width/2,this.Panel_bg.height/2)
                this.newImageFront.setOpacity(0)
                this.Panel_bg.addChild(this.newImageFront)
                this.newImageFront.runAction(cc.sequence(cc.fadeTo(2,255)))
                this.curImageFront = this.newImageFront;
            }
        }else{
            if(!this.curImageBg){
                this.curImageBg = cc.Sprite("res/ui/bjdmj/hall_bg_dark_1.png")
                this.curImageBg.setPosition(this.Panel_bg.width/2,this.Panel_bg.height/2)
                this.Panel_bg.addChild(this.curImageBg)
            }else{
                this.curImageBg.runAction(cc.sequence(cc.fadeTo(2,0),cc.callFunc(function(sender){
                    sender.removeFromParent(true)
                })))
                this.newImageBg = cc.Sprite("res/ui/bjdmj/hall_bg_dark_1.png")
                this.newImageBg.setPosition(this.Panel_bg.width/2,this.Panel_bg.height/2)
                this.Panel_bg.addChild(this.newImageBg)
                this.newImageBg.setOpacity(0)
                this.newImageBg.runAction(cc.sequence(cc.fadeTo(2,255)))
                this.curImageBg = this.newImageBg;
            }
            if(!this.curImageFront){
                this.curImageFront = cc.Sprite("res/ui/bjdmj/hall_bg_dark_2.png")
                this.curImageFront.setPosition(this.Panel_bg.width/2,this.Panel_bg.height/2)
                this.Panel_bg.addChild(this.curImageFront)
            }else{
                this.curImageFront.runAction(cc.sequence(cc.fadeTo(1.5,0),cc.callFunc(function(sender){
                    sender.removeFromParent(true)
                })))
                this.newImageFront = cc.Sprite("res/ui/bjdmj/hall_bg_dark_2.png")
                this.newImageFront.setPosition(this.Panel_bg.width/2,this.Panel_bg.height/2)
                this.Panel_bg.addChild(this.newImageFront)
                this.newImageFront.setOpacity(0)
                this.newImageFront.runAction(cc.sequence(cc.fadeTo(1.5,255)))
                this.curImageFront = this.newImageFront;
            }
        }
        this.addParticleAnim();
    },

    addParticleAnim:function(){
        var Image_bg = this.curImageBg
        var Image_front = this.curImageFront

        if(this.curBg == "night"){
            var ani = new ccs.Armature("qiuji_dt");
            ani.setPosition(Image_bg.width/2+200 ,Image_bg.height/2);
            ani.getAnimation().play("guangxian_night",-1,1);
            Image_bg.addChild(ani);
            ani.setOpacity(0)
            ani.runAction(cc.sequence(cc.delayTime(2), cc.fadeTo(1,255)))

            var ani = new ccs.Armature("qiuji_dt");
            ani.setPosition(Image_bg.width/2,Image_bg.height/2+4);
            ani.getAnimation().play("guangdian_night",-1,1);
            Image_bg.addChild(ani);

            var dengSystem = new cc.ParticleSystem("res/bjdani/lizi/deng_wanshang.plist");
            dengSystem.setPosition(410,320);
            Image_front.addChild(dengSystem,2);

            var dengSystem = new cc.ParticleSystem("res/bjdani/lizi/deng_wanshang.plist");
            dengSystem.setPosition(Image_bg.width/2-420,Image_bg.height-100);
            Image_front.addChild(dengSystem,2);

            var dengSystem = new cc.ParticleSystem("res/bjdani/lizi/deng_wanshang.plist");
            dengSystem.setPosition(Image_bg.width-350,400);
            Image_front.addChild(dengSystem,2);
        }else{
            var ani = new ccs.Armature("qiuji_dt");
            ani.setPosition(Image_bg.width/2+90,Image_bg.y/2+290);
            ani.getAnimation().play("guanxian_day",-1,1);
            Image_bg.addChild(ani);

            var boguangSystem = new cc.ParticleSystem("res/bjdani/lizi/boguang6.plist");
            boguangSystem.setPosition(Image_bg.width/2-140,Image_bg.height/2+58);
            boguangSystem.setScaleY(1.2)
            boguangSystem.setRotation(-1)
            Image_bg.addChild(boguangSystem);

            var boguangSystem = new cc.ParticleSystem("res/bjdani/lizi/boguang6.plist");
            boguangSystem.setPosition(Image_bg.width/2-170,Image_bg.height/2+54);
            Image_bg.addChild(boguangSystem);

            var boguangSystem = new cc.ParticleSystem("res/bjdani/lizi/boguang6.plist");
            boguangSystem.setPosition(Image_bg.width/2-300,Image_bg.height/2+52);
            boguangSystem.setScaleX(0.8)
            Image_bg.addChild(boguangSystem);

            var boguangSystem = new cc.ParticleSystem("res/bjdani/lizi/boguang6.plist");
            boguangSystem.setPosition(Image_bg.width/2-150,Image_bg.height/2+46);
            boguangSystem.setScaleY(1.1)
            Image_bg.addChild(boguangSystem);

            var boguangSystem = new cc.ParticleSystem("res/bjdani/lizi/boguang6.plist");
            boguangSystem.setPosition(Image_bg.width/2-150,Image_bg.height/2+40);
            Image_bg.addChild(boguangSystem);

            var boguangSystem = new cc.ParticleSystem("res/bjdani/lizi/boguang1.plist");
            boguangSystem.setPosition(Image_bg.width/2-200 ,Image_bg.height/2+20);
            Image_bg.addChild(boguangSystem);

            var boguangSystem = new cc.ParticleSystem("res/bjdani/lizi/boguang1.plist");
            boguangSystem.setPosition(Image_bg.width/2-200 ,Image_bg.height/2+20);
            Image_bg.addChild(boguangSystem);

            var boguangSystem = new cc.ParticleSystem("res/bjdani/lizi/boguang1.plist");
            boguangSystem.setPosition(Image_bg.width/2-200 ,Image_bg.height/2+20);
            Image_bg.addChild(boguangSystem);

            var boguangSystem = new cc.ParticleSystem("res/bjdani/lizi/boguang2.plist");
            boguangSystem.setPosition(Image_bg.width/2-220 ,Image_bg.height/2+20);
            Image_bg.addChild(boguangSystem);

            var boguangSystem = new cc.ParticleSystem("res/bjdani/lizi/boguang3.plist");
            boguangSystem.setPosition(Image_bg.width/2-240 ,Image_bg.height/2+20);
            Image_bg.addChild(boguangSystem);
            //
            var boguangSystem = new cc.ParticleSystem("res/bjdani/lizi/boguang4.plist");
            boguangSystem.setPosition(Image_bg.width/2-150 ,Image_bg.height/2+20);
            Image_bg.addChild(boguangSystem);


            var boguangSystem = new cc.ParticleSystem("res/bjdani/lizi/fengye.plist");
            boguangSystem.setPosition(400,Image_bg.height);
            Image_bg.addChild(boguangSystem);

            var boguangSystem = new cc.ParticleSystem("res/bjdani/lizi/fengye2.plist");
            boguangSystem.setPosition(400 ,Image_bg.height);
            Image_bg.addChild(boguangSystem);
        }
    },


    //传奇入口
    sendLegend: function(sender){
        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
            sender.setTouchEnabled(true);
        })));
        var nowTime = new Date().getTime();
        var time = Math.floor(nowTime/1000);
        var gameType = 682;
        var string = "game_id="+gameType+ "&server_id="+ 0 +"&time="+time+"&user_id="+PlayerModel.userId+"&username="+PlayerModel.username+"4e221e725c288293b4b9bf9d16d3e379";
        var sign = md5(string);
        var url ="https://game.jiulingwan.com/Qipaicqcps/login?"+"user_id="+PlayerModel.userId+"&game_id="+gameType+ "&server_id="+ 0 +"&username="+encodeURIComponent(PlayerModel.username)+"&sign="+sign+"&time="+time;
        //cc.log("url===",url);
        // if (SdkUtil.is316Engine() && SyConfig.isAndroid()){
        //     var result = SdkUtil.setOrientation(2);
        //     if (result == false) {
        //         SdkUtil.sdkOpenUrl(url);
        //         return;
        //     }
        //     if (ccui.WebView){
        //         var viewport = cc.visibleRect;
        //         var webView = this.webView = new ccui.WebView();
        //         webView.x = viewport.center.x;
        //         webView.y = viewport.center.y;
        //         webView.setScalesPageToFit(true);
        //         webView.setContentSize(viewport);
        //         webView.loadURL(url);
        //         webView.setJavascriptInterfaceScheme("bjdqp");
        //         this.webViewNode.addChild(webView);
        //         this.webView.reload();
        //
        //         webView.setOnJSCallback(function(sender, url) {
        //             SdkUtil.setOrientation(1);
        //             cc.log("OnJSCallback:" + url);
        //             if (url.indexOf("bjdqp://close") >= 0) {
        //                 this.webView.removeFromParent();
        //                 this.webView = null;
        //             }
        //         }.bind(this));
        //     }
        // }else{
        SdkUtil.sdkOpenUrl(url);
        // }
    },

    //签名不一样，不用通用的网络接口了
    getPlayerDailiState:function(){
        var char_id = PlayerModel.userId;
        var time = new Date().getTime();
        var sign = "" + char_id + time;
        sign = md5(sign);

        var url = SdkUtil.COMMON_HTTP_URL + "/agent/player/isAgent/wx_plat/mjqz";
        url += ("?char_id=" + char_id);
        url += ("&time=" + time);
        url += ("&sign=" + sign);
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", url);
        xhr.timeout = 12000;
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");

        var self = this;
        var onerror = function(){
            xhr.abort();
            cc.log("==========getPlayerDailiState========error=========");
        }
        xhr.onerror = onerror;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    cc.log("===========getPlayerDailiState============" + xhr.responseText);
                    var data = JSON.parse(xhr.responseText);

                    if(data.code == 1){//是代理
                        self.btn_cwdl.tempData = 2;
                        self.btn_cwdl.loadTextureNormal("res/ui/bjdmj/dailihoutai.png");

                        var time = new Date();
                        var year = time.getFullYear();
                        var month = time.getMonth() + 1;
                        var date = time.getDate();
                        if(year == 2019 &&  month == 9 && date >= 9 && date <= 13){//中秋活动宣传
                            var pop = new HuodongPop();
                            PopupManager.addPopup(pop,5);
                        }
                    }
                }else{
                    onerror.call(self);
                }
            }
        }
        xhr.send();

    },

    onLoadIconSuc:function(){
        var self = this;
        cc.loader.loadImg(PlayerModel.headimgurl, {width: 252, height: 252}, function (error, texture) {
            if (error == null) {
                self.headSpr.setTexture(texture);
            }
            //连接socket
            if (PlayerModel.isDirect2Room()) {
                if (PlayerModel.playTableId == 0) {
                    SyEventManager.dispatchEvent(SyEvent.DIRECT_JOIN_ROOM);
                } else {//身上有房号
                    FloatLabelUtil.comText("您已有房间，无法加入好友房间");
                }
            } else {
                if (!sySocket.isOpen()) {
                    sySocket.connect(null,11);
                } else {
                    sy.scene.hideLoading();
                }
            }
        });

    },

    //从其他网页获取的跑马灯内容返回的就是个字符串，就不走通用接口了
    getNoticeData:function(){
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", SdkUtil.COMMON_HTTP_URL + "/agent/player/notice");
        xhr.timeout = 12000;
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");

        var self = this;
        var onerror = function(){
            xhr.abort();
            cc.log("==========getNoticeData========error=========");
        }
        xhr.onerror = onerror;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    cc.log("===========getNoticeData============" + xhr.responseText);
                    self.bjdmjNotice = xhr.responseText;
                }else{
                    onerror.call(self);
                }
            }
        }
        xhr.send();
    },

    //获取大厅分享和房间的分享链接
    getAllShareUrl:function(){
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", SdkUtil.COMMON_HTTP_URL + "/activity/Wxgameact_Outgameapi/getWxUrls?platid=1060");
        xhr.timeout = 12000;
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");

        var self = this;
        var onerror = function(){
            xhr.abort();
        }
        xhr.onerror = onerror;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    var data = JSON.parse(xhr.responseText);
                    if(data.code == 0) {
                        if (data.data) {
                            // cc.log("getAllShareUrl",JSON.stringify(data.data))
                            if (data.data.hall && data.data.hall.length > 5){
                                SdkUtil.SHARE_URL = data.data.hall;
                                SdkUtil.SHARE_URL = SdkUtil.SHARE_URL.replace(/(user_id[^]*$)/,"user_id/" + PlayerModel.userId);
                            }
                            if (data.data.table && data.data.table.length > 5){
                                SdkUtil.SHARE_ROOM_URL = data.data.table;
                                SdkUtil.SHARE_ROOM_URL = SdkUtil.SHARE_ROOM_URL.replace(/(user_id[^]*$)/,"user_id/" + PlayerModel.userId);
                            }
                            cc.log("getAllShareUrl===",SdkUtil.SHARE_URL,SdkUtil.SHARE_ROOM_URL)
                        }
                    }
                }else{
                    onerror.call(self);
                }
            }
        }
        xhr.send();
    },

    //获取当前版本的更新公告
    getNoticeContent:function(){
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", SdkUtil.COMMON_HTTP_URL + "/Agent/Marquee/game_notice?version=1");
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
                    if(data.code == 0) {
                        if (data.data) {
                            var noticeV = data.data.version || 0;
                            var isUpdate = UpdateNoticeModel.isPopOut(noticeV);
                            UpdateNoticeModel.init(data.data);
                            if (isUpdate){
                                var pop = new NoticePop(3);
                                PopupManager.addPopup(pop);
                            }
                            //cc.log("getNoticeContent===",data.data.content,data.data.version)
                        }
                    }
                }else{
                    onerror.call(self);
                }
            }
        }
        xhr.send();
    },

    update:function(dt){
        // GoldMatchRoomModel._msgdt += dt;
        // if (GoldMatchRoomModel._msgdt >= GoldMatchRoomModel._msgDdiff) {
        //     GoldMatchRoomModel._msgdt = 0;
        //     // GoldMatchRoomModel.getMatchMarquee(this.paomadeng)
        // }
        // if(!this.paomadeng.playing && !sy.scene.msgPlaying && PaoMaDengModel.getCurrentMsg()){
        //     this.paomadeng.visible = true;
        //     var curMsg = PaoMaDengModel.getCurrentMsg();
        //     this.paomadeng.matchPlay(curMsg);
        // }else if(!this.paomadeng.playing && !sy.scene.msgPlaying){
        //     if(this.bjdmjNotice){
        //         this.paomadeng.visible = true;
        //         this.paomadeng.play({content:this.bjdmjNotice});
        //     }
        // }else if(sy.scene.msgPlaying && this.paomadeng && this.paomadeng.isVisible() && sy.scene.IsPlayByServerId()){
        //     this.paomadeng.visible = false;
        // }
    },

    addBtnAni:function(){

        ccs.armatureDataManager.addArmatureFileInfo("res/ui/bjdmj/newHall/ani/jnqpchuan/jnqpchuan.ExportJson");
        ccs.armatureDataManager.addArmatureFileInfo("res/ui/bjdmj/newHall/ani/jnqpcrfj/jnqpcrfj.ExportJson");
        ccs.armatureDataManager.addArmatureFileInfo("res/ui/bjdmj/newHall/ani/jnqpjrfj/jnqpjrfj.ExportJson");
        ccs.armatureDataManager.addArmatureFileInfo("res/ui/bjdmj/newHall/ani/jnqplt/jnqplt.ExportJson");
        ccs.armatureDataManager.addArmatureFileInfo("res/ui/bjdmj/newHall/ani/jnqprw/jnqprw.ExportJson");
        ccs.armatureDataManager.addArmatureFileInfo("res/ui/bjdmj/newHall/ani/jrqyq/jrqyq.ExportJson");

        var btn_pyq = this.getWidget("btn_pyq");
        var ani_pyq = new ccs.Armature("jrqyq");
        ani_pyq.setPosition(btn_pyq.x,btn_pyq.y);
        ani_pyq.getAnimation().play("Animation1",-1,1);
        btn_pyq.getParent().addChild(ani_pyq,5);

        var btn_create = this.getWidget("btn_create_1");
        var ani_create = new ccs.Armature("jnqpcrfj");
        ani_create.setPosition(btn_create.x,btn_create.y + 15);
        ani_create.getAnimation().play("Animation1",-1,1);
        btn_create.getParent().addChild(ani_create,5);

        var btn_join = this.getWidget("btn_join");
        var ani_join = new ccs.Armature("jnqpjrfj");
        ani_join.setPosition(btn_join.x,btn_join.y + 15);
        ani_join.getAnimation().play("Animation1",-1,1);
        btn_join.getParent().addChild(ani_join,5);

        btn_pyq.setOpacity(0);
        btn_create.setOpacity(0);
        btn_join.setOpacity(0);

        var icon_ren = this.getWidget("icon_ren");
        var ani_ren = new ccs.Armature("jnqprw");
        ani_ren.setPosition(150,150);
        ani_ren.getAnimation().playWithIndexes([0,1],-1,1);
        icon_ren.addChild(ani_ren,5);
        icon_ren.setOpacity(0);

        var icon_liutiao = this.getWidget("icon_liutiao");
        var ani_liutiao = new ccs.Armature("jnqplt");
        ani_liutiao.setPosition(icon_liutiao.width - 80,icon_liutiao.height - 150);
        ani_liutiao.getAnimation().play("Animation1",-1,1);
        icon_liutiao.addChild(ani_liutiao,5);
        icon_liutiao.setOpacity(0);

        var ani_chuan = new ccs.Armature("jnqpchuan");
        ani_chuan.setPosition(960,540);
        ani_chuan.getAnimation().play("Animation1",-1,1);
        this.root.addChild(ani_chuan,0);

    },

    onExit:function(){
        ccs.armatureDataManager.removeArmatureFileInfo("res/res_activity/goldeneggs/animation/zajindantubiao/zajindantubiao.ExportJson");
        this._super();
    },

    onEnterTransitionDidFinish:function(){
        this._super();
        this.updateMsgRed();
        this.checkShowBindPop();
    },

    showDaiLiActivityPop:function(){
        var pop = new DaiLiActivityPop(this);
        PopupManager.addPopup(pop);
    },

    checkShowBindPop:function(){
        var temp = cc.sys.localStorage.getItem("sy_is_show_bind_pop_" + PlayerModel.userId);
        if(!temp && !PlayerModel.payBindId && !PlayerModel.isHasBind){
            var pop = new BindInvitePop(PlayerModel.inviterPayBindId || "");
            PopupManager.addPopup(pop);
            // this.showDaiLiActivityPop();
            cc.sys.localStorage.setItem("sy_is_show_bind_pop_" + PlayerModel.userId,"1");
        }else{
            // this.showDaiLiActivityPop();
        }
    },

    onClickMsgBtn:function(){
        var pop = new PlayerMsgPop(this);
        PopupManager.addPopup(pop);
    },


    updateMsgRed:function(){
        var self = this;
        this.btn_msg.getChildByName("red_icon").visible = false;
        NetworkJT.loginReqNew(302, {oUserId:PlayerModel.userId}, function (data) {
            if (data) {
                cc.log("updateMsgRed===",JSON.stringify(data));
                if (data.message && data.message.inviteReadPoint){
                    self.btn_msg.getChildByName("red_icon").visible = true;
                    if(!self.isShowMsgPop){
                        self.isShowMsgPop = true;
                        var pop = new PlayerMsgPop(self);
                        PopupManager.addPopup(pop);
                    }
                }
            }
        }, function (data) {
            if(data.message){
                FloatLabelUtil.comText(data.message);
            }
        });
    },

    setUserInfo:function(){
        this.getWidget("user_name").setString(PlayerModel.name);
        this.getWidget("user_id").setString("ID:"+PlayerModel.userId);
        this.getWidget("zs_num").setString(PlayerModel.cards);
    },

    onPlayerUpdate:function(){
        this.getWidget("zs_num").setString(PlayerModel.cards);
        // if (this.beans_num){
        //     this.beans_num.setString(""+UITools.moneyToStr(PlayerModel.getCoin()));
        // }
    },

    onShow:function(){
        if (!GameConfig.isRegist){
            if (this.headRedPoint){
                this.headRedPoint.visible = true;
            }else{
                var img_kuang = this.getWidget("img_kuang");
                this.headRedPoint =  new cc.Sprite("res/ui/bjdmj/popup/pyq/red_point.png");
                this.headRedPoint.x = 2;
                this.headRedPoint.y = img_kuang.height -2;
                img_kuang.addChild(this.headRedPoint,100);
            }
            GameConfig.isRegist = true;
        }else if ( this.headRedPoint){
            this.headRedPoint.visible  = false;

        }
        AudioManager.reloadFromData(PlayerModel.isMusic,PlayerModel.isEffect,1);
    },

    // setGgRed:function(isShow){
    //     var btn = this.getWidget("btn_gg");
    //     btn.getChildByName("red_icon").setVisible(isShow);
    // },

    onClickCreateBtn:function(sender){
        cc.log("=============onClickCreateBtn==============");
        var tag = sender.getTag()
        var mc = new MjCreateRoom(null,tag);
        // if(mc.selectType != tag){
        //     mc.setTypeSelect(tag);
        // }
        PopupManager.addPopup(mc);
    },

    onClickJoinBtn:function(){
        cc.log("=============onClickJoinBtn==============");

        var mc = new JoinRoomPop();
        PopupManager.addPopup(mc);
    },

    onClickShopBtn:function(){
        cc.log("=============onClickShopBtn==============");

        this.showShop();
    },

    showShop:function(button){
        if(PlayerModel.payBindId){
            var popLayer = new ShopPop(button?button.tag:1);
            PopupManager.addPopup(popLayer);
        }else{
            var pop = new BindInvitePop(PlayerModel.inviterPayBindId || "");
            PopupManager.addPopup(pop);
        }
    },

    onClickInviteBtn:function(){
        cc.log("=============onClickInviteBtn==============");

        var obj={};
        obj.tableId = 0;
        obj.userName=PlayerModel.username;
        obj.callURL=SdkUtil.SHARE_URL+'?userId='+encodeURIComponent(PlayerModel.userId);
        var content = ShareDailyModel.getFeedContent();
        obj.title=content;
        obj.pyq=content;
        obj.description=content;
        obj.shareType=1;
        if (content=="" && SyConfig.hasOwnProperty("HAS_PNG_SHARE")) {//
            obj.shareType=0;
            obj.png = "res/feed/feed.jpg";
        }
        SharePop.show(obj,true);
    },

    onClickKfBtn:function(){
        return;
        cc.log("=============onClickKfBtn==============");
        // var pop = new ServicePop();
        // PopupManager.addPopup(pop);
        var pop = new KefunewPop();
        PopupManager.addPopup(pop);
        //AlertPop.showOnlyOk("问题反馈，请联系：\n\n客服电话：4008388629\n客服QQ：2939450050\n客服邮箱：csxunyoukefu@qq.com");
    },

    onClickZhanjiBtn:function(){
        cc.log("=============onClickZhanjiBtn==============");
        var mc = new TotalRecordPop(1);
        PopupManager.addPopup(mc);
    },

    onClickPyqBtn:function(sender){
        cc.log("=============onClickPyqBtn==============");
        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(function(){
            sender.setTouchEnabled(true);
        })));

        this.updateMsgRed();
        this.getAllClubsData();
    },

    switchClub:function(){
        this.getAllClubsData();
    },

    onClickSetBtn:function(){
        cc.log("=============onClickSetBtn==============");
        var mc = new SetPop(true);
        PopupManager.addPopup(mc);
    },

    onClickHeadBtn:function(){
        cc.log("=============onClickHeadBtn==============");
        // var pop = new UserBackpackPop(1);
        // PopupManager.addPopup(pop);
        //if (PlayerModel.pf  == "self"){
        //    var pop = new UserMoreInfoPop();
        //    PopupManager.addPopup(pop);
        //}else {
        //    var popLayer = new UserInfoPop();
        //    PopupManager.addPopup(popLayer);
        //}
    },

    getAllClubsData:function(){
        sy.scene.showLoading("查询亲友圈数据");
        NetworkJT.loginReqNew(415, {userId:PlayerModel.userId,sessCode:PlayerModel.sessCode}, function (data) {
            cc.log("data.message.list",JSON.stringify(data))
            if (data) {
                sy.scene.hideLoading();

                if(data.message.list && data.message.list.length > 0){
                    ClubListModel.init(data.message.list);
                    var popLayer = new PyqHall(data.message.list);
                    PopupManager.addPopup(popLayer);
                }else{
                    var popLayer = new YqhPop();
                    PopupManager.addPopup(popLayer);
                }
            }
        }, function (data) {
            sy.scene.hideLoading();
            FloatLabelUtil.comText(data.message || "亲友圈数据查询失败");
        });
    },

});