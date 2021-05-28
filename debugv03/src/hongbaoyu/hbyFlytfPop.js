var HBYFlytfPop = BasePopup.extend({

    ctor: function () {
        this._super("res/hbyFlytfPop.json");
    },

    selfRender: function () {
        this.Button_close = this.getWidget("close_btn");
        UITools.addClickEvent(this.Button_close,this,this.onClosePop);

        var label_num = this.getWidget("label_num");//奖池总分数
        label_num.setString("0");
        this.label_num = label_num;

        var Button_xz = this.getWidget("Button_xz");//新增投放
        UITools.addClickEvent(Button_xz,this,this.onAdd);

        // Button_xz.setEnabled(ClickClubModel.isHasOpenHBY());
        // Button_xz.setBright(ClickClubModel.isHasOpenHBY());

        var Button_lsjl = this.getWidget("Button_lsjl");//历史记录
        UITools.addClickEvent(Button_lsjl,this,this.onShowHistory);

        this.ListView_list = this.getWidget("ListView_list");

        this.Image_item = this.getWidget("Image_item");

        this.label_tip = this.getWidget("label_tip");
        this.label_tip.setVisible(true);

        SyEventManager.addEventListener("HBY_UPDATE_LIST",this,this.getListData);

        this.getListData();
    },

    getListData:function (){
        var parma = {
            groupId:ClickClubModel.clickClubId,
            userId:PlayerModel.userId,
            state:1
        };
        var self = this;
        NetworkJT.loginReqNew(450,parma, function(data){
            if(data && data.code == 0){
               self.initList(JSON.parse(data.message).results);
            }
        }.bind(this),function(data){
            FloatLabelUtil.comText(data.message);
        });
    },

    onDelete:function (btn){
        var parma = {
            groupId:ClickClubModel.clickClubId,
            userId:PlayerModel.userId,
            keyId:btn.temp,
        };
        var self = this;
        AlertPop.show("你确定要删除这条投放配置吗？",function (){
            NetworkJT.loginReqNew(452,parma, function(data){
                if(data && data.code == 0){
                    FloatLabelUtil.comText("删除成功！！！");
                    self.getListData();
                    if(PopupManager.getClassByPopup(PyqHall)){
                        PopupManager.getClassByPopup(PyqHall).getMyCriditScore();
                    }
                }
            }.bind(this),function(data){
                FloatLabelUtil.comText(data.message);
            });
        });
    },

    initItem:function (widget,data){
        var bsf = ccui.helper.seekWidgetByName(widget,"bsf");//投放比赛分
        var time = ccui.helper.seekWidgetByName(widget,"time");//投放时间
        var Button_sc = ccui.helper.seekWidgetByName(widget,"Button_sc");//删除
        var gs = ccui.helper.seekWidgetByName(widget,"gs");//投放个数
        Button_sc.temp = data.keyId;
        var state = ccui.helper.seekWidgetByName(widget,"Image_state");//投放状态
        state.loadTexture("res/res_ui/hongbaoyu/state_"+data.state+".png");
        UITools.addClickEvent(Button_sc,this,this.onDelete);
        Button_sc.setBright(data.state == 0);
        Button_sc.setEnabled(data.state == 0);
        bsf.setString(""+(parseInt(data.totalPoint)/100));
        time.setString(""+HBYTimeModel.timeToTimeStr(data.pushStartTime));
        gs.setString(""+data.redBagNum);
        widget.visible = true;
    },

    initList:function (data){
        cc.log(" 福利雨！！！ data = ",JSON.stringify(data));
        this.ListView_list.removeAllChildren();
        var localDataArr = data || [];
        var totalPoint = 0;
        for(var index = 0;index < localDataArr.length;++index){
            var item = this.Image_item.clone();
            this.initItem(item,localDataArr[index]);
            this.ListView_list.pushBackCustomItem(item);
            totalPoint += (parseInt(localDataArr[index].totalPoint)/100);
        }
        this.label_num.setString(""+totalPoint);
        this.label_tip.setVisible(localDataArr.length == 0);
    },

    onShowHistory:function (){
        var mc = new HBYLsjlPop();
        PopupManager.addPopup(mc);
    },

    onAdd:function (){
        var mc = new HBYTfbzPop();
        PopupManager.addPopup(mc);
    },

    onClosePop:function(){
        PopupManager.remove(this);
    },
});