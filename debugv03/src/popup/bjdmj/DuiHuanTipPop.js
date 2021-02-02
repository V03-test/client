var DuiHuanTipPop = BasePopup.extend({
    ctor:function(){
        this._super("res/DuihuanTipPop.json");
    },

    selfRender:function(){
        // cc.log("this.beansNum =",this.beansNum);
        var Button_duihuan = this.getWidget("Button_duihuan");
        UITools.addClickEvent(Button_duihuan,this,this.onClickDuihuanBtn);
        var Button_share = this.getWidget("Button_share");
        UITools.addClickEvent(Button_share,this,this.onClickShareBtn);
    },
    onClickDuihuanBtn:function(){
        PopupManager.remove(this);
        if(PlayerModel.payBindId){
            var popLayer = new ShopPop(3);
            PopupManager.addPopup(popLayer);
        }else{
            var pop = new BindInvitePop(PlayerModel.inviterPayBindId || "");
            PopupManager.addPopup(pop);
        }
    },
    onClickShareBtn:function(){
        var pop = new BjdShareGiftPop();
        PopupManager.addPopup(pop);
        PopupManager.remove(this);
    },
    onClose:function(){
        if (this.CloseCallBack)
            this.CloseCallBack();
    },
});

var NewDuiHuanTipPop = BasePopup.extend({
    ctor:function(){
        this._super("res/NewDuihuanTipPop.json");
    },

    selfRender:function(){
        // cc.log("this.beansNum =",this.beansNum);
        var Button_duihuan = this.getWidget("Button_duihuan");
        UITools.addClickEvent(Button_duihuan,this,this.onClickDuihuanBtn);
        var Button_share = this.getWidget("Button_share");
        UITools.addClickEvent(Button_share,this,this.onClickShareBtn);
    },
    onClickDuihuanBtn:function(){
        PopupManager.remove(this);
        if(PlayerModel.payBindId){
            var popLayer = new ShopPop(3);
            PopupManager.addPopup(popLayer);
        }else{
            var pop = new BindInvitePop(PlayerModel.inviterPayBindId || "");
            PopupManager.addPopup(pop);
        }
    },
    onClickShareBtn:function(){
        var pop = new NewQianDaoPop();
        PopupManager.addPopup(pop);
        PopupManager.remove(this);
    },
    onClose:function(){
        if (this.CloseCallBack)
            this.CloseCallBack();
    },
});

