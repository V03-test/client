var ZszsLayer = cc.Layer.extend({
    ctor:function(){
        this._super();

        SyEventManager.addEventListener("Zszs_Back", this, this.onMsgBack);

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
        this.layerBg = new cc.Sprite("res/res_ui/homeLayer/zszs/bg.png");
        this.layerBg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(this.layerBg);

        var title = new cc.Sprite("res/res_ui/homeLayer/zszs/title_tbzs.png");
        title.setPosition(this.layerBg.width/2,this.layerBg.height - 100);
        this.layerBg.addChild(title);

        var img = "res/res_ui/homeLayer/zszs/btn_close.png";
        this.btn_close = new ccui.Button(img,img,"");
        this.btn_close.setPosition(this.layerBg.width - 75,this.layerBg.height - 80);
        this.btn_close.addTouchEventListener(this.onClickBtn,this);
        this.layerBg.addChild(this.btn_close,1);

        var label_1 = new ccui.Text("输入玩家ID:","res/font/bjdmj/fznt.ttf",45);
        label_1.setColor(cc.color("#90371f"));
        label_1.setAnchorPoint(1,0.5);
        label_1.setPosition(this.layerBg.width/2 - 54,this.layerBg.height/2 + 75);
        this.layerBg.addChild(label_1);

        var label_2 = new ccui.Text("输入奖赏钻石数量:","res/font/bjdmj/fznt.ttf",45);
        label_2.setColor(cc.color("#90371f"));
        label_2.setAnchorPoint(1,0.5);
        label_2.setPosition(label_1.x,label_1.y - 120);
        this.layerBg.addChild(label_2);

        var inputbg_1 = new cc.Sprite("res/res_ui/homeLayer/zszs/shuru.png");
        inputbg_1.setAnchorPoint(0,0.5);
        inputbg_1.setPosition(label_1.x + 10,label_1.y);
        this.layerBg.addChild(inputbg_1);

        var inputbg_2 = new cc.Sprite("res/res_ui/homeLayer/zszs/shuru.png");
        inputbg_2.setAnchorPoint(0,0.5);
        inputbg_2.setPosition(label_2.x + 10,label_2.y);
        this.layerBg.addChild(inputbg_2);

        this.inputId = new cc.EditBox(cc.size(inputbg_1.width - 20, inputbg_1.height - 10),
            new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputId.setPosition(inputbg_1.width/2,inputbg_1.height/2);
        this.inputId.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this.inputId.setMaxLength(9);
        this.inputId.setFont("Arial",45);
        this.inputId.setDelegate(this);
        this.inputId.setPlaceHolder("玩家ID");
        this.inputId.setPlaceholderFont("Arial" ,45);
        inputbg_1.addChild(this.inputId,1);

        this.inputNum = new cc.EditBox(cc.size(inputbg_2.width - 20, inputbg_2.height - 10),
            new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputNum.setPosition(inputbg_2.width/2,inputbg_2.height/2);
        this.inputNum.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this.inputNum.setMaxLength(9);
        this.inputNum.setFont("Arial",45);
        this.inputNum.setDelegate(this);
        this.inputNum.setPlaceHolder("钻石数量");
        this.inputNum.setPlaceholderFont("Arial" ,45);
        inputbg_2.addChild(this.inputNum,1);


        var img = "res/res_ui/homeLayer/zszs/btn_zs.png";
        this.btn_queding = new ccui.Button(img,img,"");
        this.btn_queding.setPosition(this.layerBg.width/2 - 250,180);
        this.btn_queding.addTouchEventListener(this.onClickBtn,this);
        this.layerBg.addChild(this.btn_queding,1);

        var img = "res/res_ui/homeLayer/zszs/btn_buchang.png";
        this.btn_buchang = new ccui.Button(img,img,"");
        this.btn_buchang.setPosition(this.layerBg.width/2 + 250,180);
        this.btn_buchang.addTouchEventListener(this.onClickBtn,this);
        this.layerBg.addChild(this.btn_buchang,1);
    },

    onMsgBack:function(event){
        var msg = event.getUserData();

        if(msg.params[0] == 2){
            FloatLabelUtil.comText("奖赏成功");
            this.inputNum.setString("");
        }
    },

    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            if(sender == this.btn_close){
                PopupManager.remove(this);
            }else if(sender == this.btn_queding || sender == this.btn_buchang){
                var id = this.inputId.getString();
                var num = this.inputNum.getString();

                id = Number(id);
                num = Number(num);

                if(!id){
                    FloatLabelUtil.comText("请输入玩家ID");
                    return;
                }

                if(!num){
                    FloatLabelUtil.comText("请输入钻石数量");
                    return;
                }

                var localType = sender == this.btn_buchang ? 2 : 1;
                var localStr = sender == this.btn_buchang ? "补偿" : "奖赏";

                var str = "是否给玩家" + id + localStr + num + "钻石?";
                AlertPop.show(str, function () {
                    sySocket.sendComReqMsg(1111,[6,id,num,localType]);
                });
            }
        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    editBoxTextChanged: function (sender, text) {
        if(!text)return;

        var last = text.substring(text.length - 1, text.length);
        var num = last.charCodeAt();
        if (num < 48 || num > 57) {
            last = text.substring(0, text.length - 1);
            sender.setString(last);
        }
    },

    onClose : function(){
    },
    onOpen : function(){
    },
    onDealClose:function(){
    },
});