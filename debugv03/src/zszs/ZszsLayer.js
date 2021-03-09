var ZszsLayer = BasePopup.extend({
    ctor:function(){
        this._super("res/zszsPop.json");
    },

    selfRender:function(){
        SyEventManager.addEventListener("Zszs_Back", this, this.onMsgBack);

        this.initLayer();
    },

    initLayer:function(){
        this.btn_close = this.getWidget("close_btn");
        this.btn_close.addTouchEventListener(this.onClickBtn,this);

        var inputbg_1 = this.getWidget("Image_uid");

        var inputbg_2 = this.getWidget("Image_zs");

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

        this.btn_queding = this.getWidget("Button_zs");
        this.btn_queding.addTouchEventListener(this.onClickBtn,this);

        this.btn_buchang = this.getWidget("Button_bc");
        this.btn_buchang.addTouchEventListener(this.onClickBtn,this);
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