/**
 * Created by Administrator on 2020/7/13.
 */
var ReplaceHistoryPop = BasePopup.extend({

    ctor: function () {
        this._super("res/replaceHistory.json");
    },

    selfRender: function () {
        this.ListView_list = this.getWidget("ListView_list");

        this.Button_close = this.getWidget("Button_close");
        UITools.addClickEvent(this.Button_close,this,this.onClose);

        this.getHistoryList();
    },

    //获取兑换历史列表
    getHistoryList:function(){
        var oldUrl = "http://bjdqp.firstmjq.club/agent/exchange/getExchangeOrderList/wx_plat/mjqz?";
        var url = Network.getWebUrl(oldUrl);
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", url);
        xhr.timeout = 12000;
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");

        var self = this;
        var onerror = function(){
            xhr.abort();
            cc.log("==========getHistoryList========error=========");
        }
        xhr.onerror = onerror;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    cc.log("===========getHistoryList============" + xhr.responseText);
                    var data = JSON.parse(xhr.responseText);
                    if(data.code == 0 && data.msg == "success"){
                        self.updateHistoryList(data.data.list);//刷新兑换历史列表
                    }else{
                        FloatLabelUtil.comText(data.msg);
                    }
                }else{
                    onerror.call(self);
                }
            }
        }
        xhr.send();
    },

    refreshItem:function(widget,titleStr,textStr){
        var Label_time = ccui.helper.seekWidgetByName(widget,"Label_time");
        Label_time.setString(titleStr);
        var Label_text = ccui.helper.seekWidgetByName(widget,"Label_text");
        Label_text.setString(textStr);
    },

    updateHistoryList:function(data){
        data = data || [];
        if(data.length === 0){
            this.getWidget("Label_tip").visible = true;
            return;
        }
        var tempItem = this.getWidget("Image_tempItem");
        for(var i = 0;i < data.length;++i){
            var Image_item = this.getWidget("Image_item" + i);
            if(!Image_item){
                Image_item = tempItem.clone();
                Image_item.setName("Image_item" + i);
                this.ListView_list.pushBackCustomItem(Image_item);
            }
            Image_item.visible = true;
            var resultStr = this.getState(data[i].status);
            var localType = data[i].consume_type || 0;
            var typeString = localType == 0 ? "礼券" : data[i].consume_type + "元兑换卡";
            this.refreshItem(Image_item,data[i].create_time,"使用"+typeString+"兑换了"+data[i].exchange_goods_name + resultStr);
        }
    },

    getState:function(status){
        var resultStr = "";
        switch (status){
            case 0:
            case "0":
                resultStr = "[未审核]";
                break;
            case 1:
            case "1":
                resultStr = "[审核未通过]";
                break;
            case 2:
            case "2":
                resultStr = "[审核通过(未发货)]";
                break;
            case 3:
            case "3":
                resultStr = "[已发货]";
                break;
            case 4:
            case "4":
                resultStr = "[已收到]";
                break;
        }
       return resultStr;
    },

    onClose:function(){
        PopupManager.remove(this);
    },
});