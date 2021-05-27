var HBYLsjlPop = BasePopup.extend({

    ctor: function () {
        this._super("res/hbyLsjlPop.json");
    },

    selfRender: function () {
        this.Button_close = this.getWidget("close_btn");
        UITools.addClickEvent(this.Button_close,this,this.onClosePop);

        this.ListView_list = this.getWidget("ListView_list");

        this.Image_item = this.getWidget("Image_item");

        this.label_tip = this.getWidget("label_tip");
        this.label_tip.setVisible(true);

        this.getListData();
    },

    getListData:function (){
        var parma = {
            groupId:ClickClubModel.clickClubId,
            userId:PlayerModel.userId,
            state:2,
        };
        var self = this;
        NetworkJT.loginReqNew(453,parma, function(data){
            if(data && data.code == 0){
                self.initList(JSON.parse(data.message).results);
            }
        }.bind(this),function(data){
            FloatLabelUtil.comText(data.message);
        });
    },

    onShowXQ:function (btn){
        var mc = new HBYJlxqPop(btn.temp);
        PopupManager.addPopup(mc);
    },

    initItem:function (widget,data){
        cc.log(" 历史数据！！！ data = ",JSON.stringify(data));
        var bsf1 = ccui.helper.seekWidgetByName(widget,"bsf1");//抢到的比赛分
        var bsf2 = ccui.helper.seekWidgetByName(widget,"bsf2");//总的比赛分
        var time = ccui.helper.seekWidgetByName(widget,"time");//投放时间
        var Button_xq = ccui.helper.seekWidgetByName(widget,"Button_xq");//详情
        var gs1 = ccui.helper.seekWidgetByName(widget,"gs1");//抢到的个数
        var gs2 = ccui.helper.seekWidgetByName(widget,"gs2");//总个数
        Button_xq.temp = data.keyId;
        UITools.addClickEvent(Button_xq,this,this.onShowXQ);
        bsf1.setString(""+(data.sumTakePoint/100));
        bsf2.setString("/"+(data.totalPoint/100));
        var timeStr = data.pushStartTime.substr(0,19);
        time.setString(""+timeStr);
        gs1.setString(""+data.userTakeNum);
        gs2.setString("/"+data.redBagNum);
        widget.visible = true;
    },

    initList:function (data){
        this.ListView_list.removeAllChildren();
        var localDataArr = data || [];
        for(var index = 0;index < localDataArr.length;++index){
            var item = this.Image_item.clone();
            this.initItem(item,localDataArr[index]);
            this.ListView_list.pushBackCustomItem(item);
        }
        this.label_tip.setVisible(localDataArr.length == 0);
    },

    onClosePop:function(){
        PopupManager.remove(this);
    },

});