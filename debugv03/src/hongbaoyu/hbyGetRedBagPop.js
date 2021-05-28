var HBYGetRedBagPop = BasePopup.extend({

    ctor: function () {
        this._super("res/hbyGetRedBag.json");
    },

    selfRender: function () {
        var Button_close = this.getWidget("Button_close");
        UITools.addClickEvent(Button_close,this,this.onClosePop);

        var Button_closeCha = this.getWidget("Button_closeCha");
        UITools.addClickEvent(Button_closeCha,this,this.onClosePop);

        this.Image_start = this.getWidget("Image_start");
        this.Button_qiang = this.getWidget("Button_qiang");
        UITools.addClickEvent(this.Button_qiang,this,this.onGetClick);

        this.Image_end = this.getWidget("Image_end");

        ccs.armatureDataManager.addArmatureFileInfo("res/res_ui/hongbaoyu/ani/hbjmda/hbjmda.ExportJson");
        ccs.armatureDataManager.addArmatureFileInfo("res/res_ui/hongbaoyu/ani/hbjmdk/hbjmdk.ExportJson");
        ccs.armatureDataManager.addArmatureFileInfo("res/res_ui/hongbaoyu/ani/hbjmqiangdh/hbjmqiangdh.ExportJson");
        ccs.armatureDataManager.addArmatureFileInfo("res/res_ui/hongbaoyu/ani/hbjmxiayu/hbjmxiayu.ExportJson");

        this.Image_start.visible = false;
        this.Image_end.visible = false;

        this.Image_win = this.getWidget("Image_win");
        this.Image_lose = this.getWidget("Image_lose");
        this.label_score = this.getWidget("label_score");

        SyEventManager.addEventListener("hby_start_data",this,this.onGetStartData);
        SyEventManager.addEventListener("hby_end_data",this,this.onGetEndData);

        var self = this;
        this.autoClearTime = setTimeout(function (){
            self.onClosePop();
        },10000);

        this.localTime = Date.now();

        //进入后台
        cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function(){
            if(self.autoClearTime){
                clearTimeout(self.autoClearTime);
            }
        });
        //恢复显示
        cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function(){
            var shengyu = Date.now() - self.localTime;
            if(shengyu > 10000){
                self.onClosePop();
            }else{
                self.autoClearTime = setTimeout(function (){
                    self.onClosePop();
                },shengyu);
            }
        });
    },

    onGetStartData:function (event){
        var localData = event.getUserData();

        this.Button_qiang.keyId = localData.strParams[0]; //keyId

        this.initXiaYuAni();
        var self = this;
        this.scheduleOnce(function (){
            self.initStartAni();
        },2);
    },

    onGetEndData:function (event){
        var localData = event.getUserData();
        // cc.log("AAAA end localData = ",JSON.stringify(localData));

        var endScore = localData.strParams[0]; //结果

        this.Image_start.visible = false;
        this.Image_end.visible = true;
        if(endScore == 0){
            this.Image_win.visible = false;
            this.Image_lose.visible = true;
        }else{
            this.Image_win.visible = true;
            this.Image_lose.visible = false;
            this.label_score.string = ""+parseInt(endScore)/100;
            AudioManager.play("res/res_ui/hongbaoyu/sound/coin.mp3");
        }
        this.initOpenRedBagAni();
    },

    initXiaYuAni:function (){
        AudioManager.play("res/res_ui/hongbaoyu/sound/redBabGoTo.mp3");
        var hbjmxiayu = new ccs.Armature("hbjmxiayu");
        hbjmxiayu.setPosition(800,540);
        hbjmxiayu.getAnimation().play("Animation1",-1,0);
        this.Image_start.parent.addChild(hbjmxiayu,5);
    },

    initStartAni:function (){
        this.Image_start.visible = true;
        var Image_start = this.Image_start;
        var Button_qiang = this.Button_qiang;

        var hbjmda = new ccs.Armature("hbjmda");
        hbjmda.setPosition(Image_start.width / 2,Image_start.height / 2);
        hbjmda.getAnimation().play("Animation1",-1,0);
        Image_start.addChild(hbjmda,5);
        Image_start.opacity = 0;

        setTimeout(function (){
            var hbjmqiangdh = new ccs.Armature("hbjmqiangdh");
            hbjmqiangdh.setPosition(Button_qiang.width / 2 + 3,Button_qiang.height / 2 - 82);
            hbjmqiangdh.getAnimation().play("Animation1",-1,1);
            Button_qiang.addChild(hbjmqiangdh,5);
        },1500);
    },

    initOpenRedBagAni:function (){
        var hbjmdk = new ccs.Armature("hbjmdk");
        hbjmdk.setPosition(this.Image_end.width / 2,this.Image_end.height / 2 - 30);
        hbjmdk.getAnimation().play("Animation1",-1,1);
        this.Image_end.addChild(hbjmdk,6);
    },

    onGetClick:function (btn){
        // cc.log(" 抢红包！！！！ ");
        var qunzhuID = ClickClubModel.isClubCreater() ? 1 : 0;
        sySocket.sendComReqMsg(4525 ,[1,parseInt(btn.keyId),qunzhuID]);/** 领取奖励通知 **/
    },

    onClosePop:function(){
        if(this.autoClearTime){
            clearTimeout(this.autoClearTime);
        }
        PopupManager.remove(this);
    },
});