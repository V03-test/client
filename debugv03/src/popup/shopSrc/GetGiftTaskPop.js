/**
 * Created by Administrator on 2020/7/13.
 */
var GetGiftTaskPop = BasePopup.extend({

    ctor: function () {
        this._super("res/getGiftTask.json");
    },

    selfRender: function () {
        this.Button_close = this.getWidget("Button_close");
        UITools.addClickEvent(this.Button_close,this,this.onClose);

        this.ListView_list = this.getWidget("ListView_list");

        this.updateGiftTaskList();
    },

    updateGiftTaskList:function(){
        var tempItem = this.getWidget("Image_tempItem");

        var titieArr = ["玩娱乐场得礼券","签到得礼券","擂台得礼券"];
        var textArr = ["参加任意娱乐场每5局可获得礼券","每天签到获得指定礼券","参加擂台达到指定名次，可获得礼券"];
                        //，每天最多100张
        for(var i = 0;i < 3;++i){
            var Image_item =  ccui.helper.seekWidgetByName(this.ListView_list,"Image_item"+i);
            if(!Image_item){
                Image_item = tempItem.clone();
                Image_item.setName("Image_item" + i);
                this.ListView_list.pushBackCustomItem(Image_item);
            }
            Image_item.visible = true;
            var Label_title = ccui.helper.seekWidgetByName(Image_item,"Label_title");
            Label_title.setString(titieArr[i]);
            var Label_text = ccui.helper.seekWidgetByName(Image_item,"Label_text");
            Label_text.setString(textArr[i]);

            var Button_qwc = ccui.helper.seekWidgetByName(Image_item,"Button_qwc");//去完成
            Button_qwc.temp = i + 1;
            UITools.addClickEvent(Button_qwc,this,this.onClick);

            Image_item.visible = i == 0;/*** 暂时去掉其他两个任务 ***/
        }
    },

    hide:function(){
        if(PopupManager.hasClassByPopup(NewShopFacePop))
            PopupManager.removeClassByPopup(NewShopFacePop);
        PopupManager.remove(this);
    },

    onClick:function(obj){
        var id = obj.temp;
        this.hide();
        //if(id == 1){//玩娱乐场得礼券
        //    mc = new AddUserDataPop();
        //}else if(id == 2){//签到得礼券
        //    mc = new AddUserDataPop();
        //}else
        if(id == 3){//擂台得礼券
            var mc = new GoldMatchPop();
            PopupManager.addPopup(mc);
        }
    },

    onClose:function(){
        PopupManager.remove(this);
    },

});