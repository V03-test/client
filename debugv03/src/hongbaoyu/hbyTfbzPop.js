var HBYTfbzPop = BasePopup.extend({

    ctor: function () {
        this._super("res/hbyTfbzPop.json");
    },

    selfRender: function () {
        var Button_close = this.getWidget("close_btn");
        UITools.addClickEvent(Button_close,this,this.onClosePop);

        var Button_gb = this.getWidget("Button_gb");
        UITools.addClickEvent(Button_gb,this,this.onClosePop);

        var Button_bc = this.getWidget("Button_bc");
        UITools.addClickEvent(Button_bc,this,this.onSaveData);

        var text1 = this.getWidget("text1");
        var text2 = this.getWidget("text2");
        var text3 = this.getWidget("text3");
        var text4 = this.getWidget("text4");
        var text5 = this.getWidget("text5");

        var Button_input = ccui.helper.seekWidgetByName(text1,"Button_input");
        this.Label_textStart = ccui.helper.seekWidgetByName(text1,"Label_text");
        UITools.addClickEvent(Button_input,this,this.onClickTime);

        var text2Input = ccui.helper.seekWidgetByName(text2,"Image_input");
        this.Label_text2 = ccui.helper.seekWidgetByName(text2,"Label_text");
        this.inputBox2 = this.initEditBox(text2Input,"请输入要投放比赛分数量");
        this.Label_text2.setString("");

        var text3Input = ccui.helper.seekWidgetByName(text3,"Image_input");
        this.Label_text3 = ccui.helper.seekWidgetByName(text3,"Label_text");
        this.inputBox3 = this.initEditBox(text3Input,"请输入投放个数");
        this.Label_text3.setString("");

        var text4Input = ccui.helper.seekWidgetByName(text4,"Image_input");
        this.Label_text4 = ccui.helper.seekWidgetByName(text4,"Label_text");
        this.inputBox4 = this.initEditBox(text4Input,"请输入单个最小福利数");
        this.Label_text4.setString("");

        var text5Input = ccui.helper.seekWidgetByName(text5,"Image_input");
        this.Label_text5 = ccui.helper.seekWidgetByName(text5,"Label_text");
        this.inputBox5 = this.initEditBox(text5Input,"请输入单个最大福利数");
        this.Label_text5.setString("");

        this.startTimeData = null;

        SyEventManager.addEventListener("HBY_SET_TIME",this,this.getTimeData);
    },

    getTimeData:function (event){
        var data = event.getUserData();
        cc.log(" event = ",JSON.stringify(event));
        cc.log(" data = ",JSON.stringify(data));
        this.startTimeData = data;
        this.Label_textStart.setString(data.timeData);
    },

    onClickTime:function (){
        var mc = new HBYSelectTimePop();
        PopupManager.addPopup(mc);
    },

    initEditBox:function (widget,tipStr){
        var inputRoomIdBox = new cc.EditBox(cc.size(widget.width, widget.height),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        inputRoomIdBox.setPosition(inputRoomIdBox.width/2,widget.height/2);
        inputRoomIdBox.setPlaceHolder(""+tipStr);
        inputRoomIdBox.setMaxLength(12);
        inputRoomIdBox.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        inputRoomIdBox.setFont("Arial",30);
        inputRoomIdBox.setPlaceholderFont("Arial",30);
        inputRoomIdBox.setPlaceholderFontColor(cc.color("#ffffff"));
        widget.addChild(inputRoomIdBox,1);
        return inputRoomIdBox;
    },

    onSaveData:function (){
        if(!this.startTimeData){
            FloatLabelUtil.comText("请设置投放开始时间！！！");
            return;
        }
        var label2 = this.inputBox2.getString();
        if(label2 == "" || label2 == "0" || (label2 != "" && parseInt(label2) != label2)){
            FloatLabelUtil.comText("投放比賽分不能为0或小数！！！");
            return;
        }
        var label3 = this.inputBox3.getString();
        if(label3 == "" || label3 == "0" || (label3 != "" && parseInt(label3) != label3)){
            FloatLabelUtil.comText("投放福利个数不能为0或小数！！！");
            return;
        }
        var label4 = this.inputBox4.getString();
        if(label4 == "" || label4 == "0" || (label4 != "" && parseInt(label4) != label4)){
            FloatLabelUtil.comText("单个最小福利数不能为0或小数！！！");
            return;
        }
        var label5 = this.inputBox5.getString();
        if(label5 == "" || label5 == "0" || (label5 != "" && parseInt(label5) != label5)){
            FloatLabelUtil.comText("单个最大福利数不能为0或小数！！！");
            return;
        }

        if(parseInt(label2) < parseInt(label5)){
            FloatLabelUtil.comText("单个最大福利数不能超过总福利数！！！");
            return;
        }

        if(parseInt(label5) <= parseInt(label2) / parseInt(label3)){
            FloatLabelUtil.comText("单个最大福利数必须大于平均数！！！");
            return;
        }

        var parma = {
            groupId:ClickClubModel.clickClubId,
            pushStartTime:this.startTimeData.timeData, //开始时间
            pushEndTime:this.startTimeData.endTimeData,
            totalPoint:label2+"00",
            redBagNum:label3,
            redMinPoint:label4+"00",
            redMaxPoint:label5+"00",
            userId:PlayerModel.userId
        };
        var self = this;
        this.isShowLoading = true;
        sy.scene.showLoading("正在生成红包配置...");
        cc.log(" 开始请求！！！ ");
        NetworkJT.loginReqNew(449,parma, function(data){
            if(data && data.code == 0){
                sy.scene.hideLoading();
                self.isShowLoading = false;
                cc.log(" 请求结束，成功！！！ ");
                FloatLabelUtil.comText(data.message);
                PopupManager.remove(self);
                SyEventManager.dispatchEvent("HBY_UPDATE_LIST",{});
                if(PopupManager.getClassByPopup(PyqHall)){
                    PopupManager.getClassByPopup(PyqHall).getMyCriditScore();
                }
                if(self.showLoadingTimeOut){
                    clearTimeout(self.showLoadingTimeOut);
                }
            }
        }.bind(this),function(data){
            FloatLabelUtil.comText(data.message);
            sy.scene.hideLoading();
            cc.log(" 请求结束，失败！！！ ");
            self.isShowLoading = false;
            if(self.showLoadingTimeOut){
                clearTimeout(self.showLoadingTimeOut);
            }
        });

        this.showLoadingTimeOut = setTimeout(function (){//12s没有返回自己关闭
            if(self.isShowLoading){
                sy.scene.hideLoading();
            }
            self.onClosePop();
            cc.log(" 请求未收到结果，15S自动关闭！！！ ");
        },15000);
    },

    onClosePop:function(){
        if(this.showLoadingTimeOut){
            clearTimeout(this.showLoadingTimeOut);
        }
        PopupManager.remove(this);
    },
});