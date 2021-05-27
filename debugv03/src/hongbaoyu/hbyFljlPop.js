var HBYFljlPop = BasePopup.extend({

    ctor: function () {
        this._super("res/hbyFljlPop.json");
    },

    selfRender: function () {
        this.Button_close = this.getWidget("close_btn");
        UITools.addClickEvent(this.Button_close,this,this.onClosePop);

        var label_num = this.getWidget("label_text");//总提取分数
        label_num.setString("0");
        this.label_num = label_num;

        var btn_tq = this.getWidget("btn_tq");//一键提取
        UITools.addClickEvent(btn_tq,this,this.onGetAllClick);
        this.btn_tq = btn_tq;

        this.ListView_list = this.getWidget("ListView_list");

        this.Image_item = this.getWidget("Image_item");

        this.label_tip = this.getWidget("label_tip");
        this.label_tip.setVisible(true);

        this.getAllStr = "";

        SyEventManager.addEventListener("HBY_UPDATE_LIST",this,this.getListData);

        this.getListData();
    },

    getListData:function (){
        var parma = {
            groupId:ClickClubModel.clickClubId,
            userId:PlayerModel.userId,
        };
        var self = this;
        NetworkJT.loginReqNew(455,parma, function(data){
            if(data && data.code == 0){
                self.initList(JSON.parse(data.message).results);
            }
        }.bind(this),function(data){
            FloatLabelUtil.comText(data.message);
        });
    },

    onGetClick:function (btn){
        this.setGetDataToServer(btn.temp,btn);
    },

    setGetDataToServer:function (id,btn){
        if(this.isGeting){
            FloatLabelUtil.comText("请不要重复点击！！！");
            return;
        }
        this.isGeting = true;
        var parma = {
            groupId:ClickClubModel.clickClubId,
            userId:PlayerModel.userId,
            keyId:id
        };
        var self = this;
        NetworkJT.loginReqNew(456,parma, function(data){
            if(data && data.code == 0){
                btn.setEnabled(false);
                btn.setBright(false);
                FloatLabelUtil.comText("领取成功！！！");
                self.getListData();
                if(PopupManager.getClassByPopup(PyqHall)){
                    PopupManager.getClassByPopup(PyqHall).getMyCriditScore();
                }
            }
            self.isGeting = false;
        }.bind(this),function(data){
            FloatLabelUtil.comText(data.message);
            self.isGeting = false;
        });
    },

    initItem:function (widget,data){
        var time = ccui.helper.seekWidgetByName(widget,"time");//时间
        var Button_xq = ccui.helper.seekWidgetByName(widget,"Button_xq");//提取
        var score = ccui.helper.seekWidgetByName(widget,"score");//抢到的分数
        Button_xq.temp = data.id;

        UITools.addClickEvent(Button_xq,this,this.onGetClick);
        Button_xq.setBright(data.userTakeState == 0);
        Button_xq.setEnabled(data.userTakeState == 0);
        score.setString(""+(parseInt(data.redBagNum)/100));
        time.setString(""+HBYTimeModel.timeToTimeStr(data.time));
        widget.visible = true;
    },

    initList:function (data){
        cc.log(" 玩家福利记录！！！ data = ",JSON.stringify(data));
        this.ListView_list.removeAllChildren();
        this.getAllStr = "";
        var localDataArr = data || [];
        var totalPoint = 0;
        for(var index = 0;index < localDataArr.length;++index){
            var item = this.Image_item.clone();
            this.initItem(item,localDataArr[index]);
            this.ListView_list.pushBackCustomItem(item);
            if(localDataArr[index].userTakeState == 0){
                totalPoint += parseInt(localDataArr[index].redBagNum);//(parseInt(localDataArr[index].redBagNum)/100);
                this.getAllStr += localDataArr[index].id;
                if(index < localDataArr.length - 1){
                    this.getAllStr += ",";
                }
            }
        }
        totalPoint = MathUtil.toDecimal(totalPoint/100);
        this.label_num.setString(""+totalPoint);
        this.label_tip.setVisible(localDataArr.length == 0);

        this.btn_tq.setBright(this.getAllStr != "");
        this.btn_tq.setEnabled(this.getAllStr != "");
    },

    onGetAllClick:function (){
        this.setGetDataToServer(this.getAllStr,this.btn_tq);
    },

    onClosePop:function(){
        PopupManager.remove(this);
    },
});