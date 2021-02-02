/**
 * Created by cyp on 2020/7/22.
 * 可以抽奖的界面
 */
var ChouJiangGetLayer = cc.Layer.extend({
    ctor:function(rewardData){
        this._super();

        this.rewardData = rewardData;

        SyEventManager.addEventListener(SyEvent.SOCKET_OPENED,this,this.onSocketOpen);

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan:function(touch,event){
                return true;
            }
        }), this);

        this.initLayer();
    },

    initLayer:function(){
        var grayLayer = new cc.LayerColor(cc.color.BLACK);
        grayLayer.setOpacity(210);
        this.addChild(grayLayer);

        this.selectBtnNode = new cc.Node();
        this.selectBtnNode.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(this.selectBtnNode,1);

        this.getBtnNode = new cc.Node();
        this.getBtnNode.setPosition(cc.winSize.width/2,150);
        this.addChild(this.getBtnNode,1);

        this.awardInfoNode = new cc.Node();
        this.awardInfoNode.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(this.awardInfoNode,1);

        var img = "res/ui/bjdmj/popup/SignInLayer/cllq.png";
        this.btn_cllq = new ccui.Button(img,img,"");
        this.btn_cllq.setPosition(0,0);
        this.btn_cllq.addTouchEventListener(this.onClickBtn,this);
        this.getBtnNode.addChild(this.btn_cllq);

        this.addBtnAni();

        var img = "res/choujiang/btn_close.png";
        this.btn_close = new ccui.Button(img,img,"");
        this.btn_close.setPosition(480,660);
        this.btn_close.addTouchEventListener(this.onClickBtn,this);
        this.getBtnNode.addChild(this.btn_close);

        var img = "res/ui/bjdmj/popup/AwardPop/close.png";
        this.btn_sure = new ccui.Button(img,img,"");
        this.btn_sure.setPosition(0,0);
        this.btn_sure.addTouchEventListener(this.onClickBtn,this);
        this.getBtnNode.addChild(this.btn_sure);

        if(SyConfig.IS_LOAD_AD || SyConfig.IS_LOAD_AD_NEW){
            this.btn_sure.setVisible(false);
        }else{
            this.btn_cllq.setVisible(false);
            this.btn_close.setVisible(false);
            this.ani_cllq.setVisible(false);
        }

        this.getBtnNode.setVisible(false);
    },

    addBtnAni:function(){
        ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/ani_btn10bei/anniu123.ExportJson");
        var ani = new ccs.Armature("anniu123");
        ani.setPosition(this.btn_cllq.x,this.btn_cllq.y);
        ani.getAnimation().play("Animation1",1,1);
        this.getBtnNode.addChild(ani,1);
        this.btn_cllq.setOpacity(0);
        this.ani_cllq = ani;
    },

    onEnterTransitionDidFinish:function(){
        this._super();

        var self = this;
        this.layerAni = this.playLayerAni(0,function(bone,evt){
            if(evt == ccs.MovementEventType.complete){
                self.addSelectBtn();
            }
        });
    },

    playLayerAni:function(type,cb){
        var aniName = "dianjiqian";
        if(type >= 1 && type <= 5){
            aniName = "dianjihou-" + parseInt(type);
        }

        ccs.armatureDataManager.addArmatureFileInfo("res/choujiang/ani_choujiang/choujiang2.ExportJson");
        var ani = new ccs.Armature("choujiang2");
        ani.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(ani,0);
        if(cb){
            ani.getAnimation().setMovementEventCallFunc(cb,this);
        }
        ani.getAnimation().play(aniName,1,0);

        return ani;
    },

    addSelectBtn:function(){

        var itemW = 370;
        var startX = -2*itemW;
        for(var i = 0;i<5;++i){
            var img = "res/choujiang/pro_tiao.png";
            var btn = new ccui.Button(img,img,"");
            btn.setScale9Enabled(true);
            btn.ignoreContentAdaptWithSize(false);
            btn.setContentSize(180,240);
            btn.setTag(i+1);
            btn.setOpacity(0);
            btn.setPosition(startX + i*itemW,0);
            btn.addTouchEventListener(this.onClickBtn,this);
            this.selectBtnNode.addChild(btn,1);
        }
    },

    onSocketOpen:function(){
        if(SignInModel.isChouJiangDouble){
            SignInModel.isChouJiangDouble = false;
            sySocket.sendComReqMsg(1111,[3]);
        }
    },

    showAward:function(){
        this.awardInfoNode.removeAllChildren(true);

        if(!this.rewardData)return;

        var img = "res/choujiang/icon_4.png";
        var typeStr = "";
        if(this.rewardData.type == 1){
            typeStr = "礼券";
            img = "res/ui/bjdmj/popup/shopRes/quan_max.png";
        }else if(this.rewardData.type == 2){
            typeStr = "白金豆";
        }
        typeStr += ("x" + this.rewardData.num);

        var icon = new cc.Sprite(img);
        icon.setPosition(0,90);
        this.awardInfoNode.addChild(icon);

        var label = new ccui.Text(typeStr,"res/font/bjdmj/fznt.ttf",36);
        label.setPosition(0,-90);
        label.setColor(cc.color("#ffeecc"));
        this.awardInfoNode.addChild(label);

        var action = cc.fadeIn(1);

        icon.setOpacity(0);
        label.setOpacity(0);
        icon.runAction(action);
        label.runAction(action.clone());

    },

    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);

            if(sender == this.btn_cllq){
                this.ani_cllq.setColor(cc.color.GRAY);
            }

        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            if(sender == this.btn_cllq){
                this.ani_cllq.setColor(cc.color.WHITE);
            }

            if(sender == this.btn_cllq){
                if (SyConfig.IS_LOAD_AD){
                    SdkUtil.byAdvertytoApp("945308403",0,4);
                }else if (SyConfig.IS_LOAD_AD_NEW){
                    SdkUtil.byAdvertytoApp("945326622",0,4);
                }
            }else if(sender == this.btn_close || sender == this.btn_sure){
                PopupManager.remove(this);
            }else{
                var tag = sender.getTag();

                AudioManager.play("res/audio/choujiang.mp3");

                this.selectBtnNode.setVisible(false);
                if(this.layerAni){
                    this.layerAni.runAction(cc.fadeOut(0.3));
                }

                var self = this;
                var ani = this.playLayerAni(tag,function(bone,evt){
                    if(evt == ccs.MovementEventType.complete){
                        self.getBtnNode.setVisible(true);
                        //让关闭按钮晚点显示,引导看广告*****
                        if(self.btn_close.isVisible()){
                            self.btn_close.setVisible(false);
                            self.btn_close.runAction(cc.sequence(cc.delayTime(0.5),cc.show()));
                        }
                    }
                });
                ani.setOpacity(0);
                ani.runAction(cc.fadeIn(0.3));

                setTimeout(function(){
                    self.showAward();
                },500);
            }

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);

            if(sender == this.btn_cllq){
                this.ani_cllq.setColor(cc.color.WHITE);
            }
        }
    },

    onClose : function(){
    },
    onOpen : function(){
    },
    onDealClose:function(){
    },


});
