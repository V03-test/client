/**
 * Created by Administrator on 2020/7/13.
 */
var ReplaceFacePop = BasePopup.extend({

    ctor: function (tipStr,okcb,cancelcb) {
        this.okcb = okcb || null;
        this.cancelcb = cancelcb || null;
        this.tipStr = tipStr || "";
        this._super("res/replaceFace.json");
    },

    selfRender: function () {
        this.Button_qd = this.getWidget("Button_qd");
        this.Button_qx = this.getWidget("Button_qx");
        this.Button_close = this.getWidget("Button_close");
        UITools.addClickEvent(this.Button_qd,this,this.onOk);
        UITools.addClickEvent(this.Button_qx,this,this.onCancel);
        UITools.addClickEvent(this.Button_close,this,this.onClose);

        this.getWidget("Label_tip").setString(this.tipStr);
    },

    onClose:function(){
        PopupManager.remove(this);
    },

    onOk:function(){
        if(this.okcb)
            this.okcb();
        PopupManager.remove(this);
    },

    onCancel:function(){
        if(this.cancelcb)
            this.cancelcb();
        PopupManager.remove(this);
    }
});

var NewReplaceFacePop = BasePopup.extend({
    local_temp:{//当前商品消耗礼券数量
        10:{localNum:1000},//10元 消耗 1000
        11:{localNum:6088},//50元 消耗 6088
        12:{localNum:9888},//100元 消耗 9888
    },

    ctor: function (data,local_lq,okCallFuc) {
        this.data = data || "";
        this.okCallFuc = okCallFuc;
        this.local_lq = local_lq || 0;
        this._super("res/newReplaceFace.json");
    },

    selfRender: function () {
        this.Button_qd = this.getWidget("Button_qd");
        this.Button_qx = this.getWidget("Button_qx");
        this.Button_close = this.getWidget("Button_close");
        UITools.addClickEvent(this.Button_qd,this,this.onOk);
        UITools.addClickEvent(this.Button_qx,this,this.onCancel);
        UITools.addClickEvent(this.Button_close,this,this.onClose);

        this.Button_click1 = this.getWidget("Button_click1");
        this.Button_click1.temp = 1;
        UITools.addClickEvent(this.Button_click1,this,this.onClick);
        this.Button_click2 = this.getWidget("Button_click2");
        this.Button_click2.temp = 2;
        UITools.addClickEvent(this.Button_click2,this,this.onClick);

        this.localId = this.getLocalID();

        this.initData();
        this.setTitleTip();
        this.onClick(this.Button_click1);
    },

    setTitleTip:function(){
        var tempName = PropDataMgr.getPropName(this.localId);
        var tipStr = this.data.consume_gold_value + "礼券或"+ tempName +"可兑换" + this.data.exchange_goods_name + ",请选择兑换方式";
        this.getWidget("Label_tip").setString(tipStr);
    },

    initData:function(){
        this.updateData(this.Button_click1,"res/userBackpack/quan.png",this.data.consume_gold_value,this.local_lq);

        var path = PropDataMgr.getPropIcon(this.localId,false);
        var localNum = this.getLocalNum();
        this.updateData(this.Button_click2,path,1,localNum);
    },

    getLocalID:function(){
        var localId = 10;
        if(this.data.id == 2){
            localId = 12;
        }else if(this.data.id == 6){
            localId = 11;
        }
        return localId;
    },

    getLocalNum:function(){
        var data = PropDataMgr.getPropsDataByID(this.localId);
        return data ? data.count : 0;
    },

    updateData:function(widget,imgPath,localNum,allNum){
        imgPath = imgPath || "res/userBackpack/quan.png";/** 默认礼券 **/
        var Image_temp = ccui.helper.seekWidgetByName(widget,"Image_temp");/** 商品图片 **/
        var Image_temp_0 = ccui.helper.seekWidgetByName(widget,"Image_temp_0");/** 商品图片 **/
        Image_temp.loadTexture(imgPath);
        Image_temp_0.loadTexture(imgPath);
        var label_tip1 = ccui.helper.seekWidgetByName(widget,"label_tip1");/** 消耗数量 **/
        label_tip1.setString("x"+localNum);
        var label_tip3 = ccui.helper.seekWidgetByName(widget,"label_tip3");/** 当前数量 **/
        label_tip3.setString("x"+allNum+")");
    },

    onClick:function(btn){
        var index = btn.temp;
        this.Button_click1.setBright(index == 1);
        this.Button_click2.setBright(index == 2);

        this.localIndex = index;

        if(index == 1){
            var isBool = Number(this.data.consume_gold_value) <= Number(this.local_lq);
            this.Button_qd.setEnabled(isBool);
            this.Button_qd.setBright(isBool);
        }else{
            var localNum = this.getLocalNum();
            var isBool = localNum > 0;
            this.Button_qd.setEnabled(isBool);
            this.Button_qd.setBright(isBool);
        }
    },

    onClose:function(){
        PopupManager.remove(this);
    },

    onOk:function(){
        if(this.localIndex == 1){//礼券兑换
            this.okCallFuc && this.okCallFuc();
        }else{
            this.okCallFuc && this.okCallFuc(this.localId,1);
        }
        PopupManager.remove(this);
    },

    onCancel:function(){
        PopupManager.remove(this);
    }
});