var ZsjlLayer = BasePopup.extend({
    ctor:function(){
        this._super("res/zsjlPop.json");
    },

    selfRender:function(){
        this.beginTime = this.endTime = new Date();

        this.curPage = 1;

        SyEventManager.addEventListener(SyEvent.RESET_TIME, this, this.changeSearchTime);
        SyEventManager.addEventListener("Zszs_Back", this, this.onMsgBack);

        this.initLayer();

        this.getRecordData(1);
    },

    getRecordData:function(page,userId){
        userId = userId || -1;

        var b = this.getTimeStr(this.beginTime);
        var e = this.getTimeStr(this.endTime);

        sySocket.sendComReqMsg(1111,[5,page,Number(userId)],[b,e]);
    },

    onMsgBack:function(event){
        var msg = event.getUserData();

        if(msg.params[0] == 3){
            var data = msg.strParams[0];
            if(data){
                data = JSON.parse(data);

                var page = msg.params[1];
                if(data.length > 0){
                    this.curPage = page;
                    this.label_page.setString(this.curPage);
                    this.label_no_data.setVisible(false);

                    this.updateScrollItem(data);
                }else{
                    if(page == 1){
                        this.label_no_data.setVisible(true);
                        this.updateScrollItem([]);
                    }else{
                        FloatLabelUtil.comText("没有更多数据了");
                    }
                }

            }
        }
    },

    getTimeStr:function(date){
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        return year + "-" + month + "-" + day;
    },

    initLayer:function(){
        this.btn_close = this.getWidget("close_btn");
        this.btn_close.addTouchEventListener(this.onClickBtn,this);

        this.btn_change_date = this.getWidget("Button_time");
        this.btn_change_date.addTouchEventListener(this.onClickBtn,this);

        this.label_date = this.getWidget("Label_time");

        this.label_date.setString(UITools.formatTime(this.beginTime) + "-" + UITools.formatTime(this.endTime));

        var inputbg = this.getWidget("Image_InputUid");

        this.inputId = new cc.EditBox(cc.size(inputbg.width - 20, inputbg.height - 10),
            new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputId.setPosition(inputbg.width/2,inputbg.height/2);
        this.inputId.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this.inputId.setMaxLength(9);
        this.inputId.setFont("Arial",45);
        this.inputId.setDelegate(this);
        this.inputId.setPlaceHolder("输入玩家ID");
        this.inputId.setPlaceholderFont("Arial" ,45);
        inputbg.addChild(this.inputId,1);

        this.btn_cbzsr = this.getWidget("Button_cbzsr");
        this.btn_cbzsr.addTouchEventListener(this.onClickBtn,this);

        this.label_page = this.getWidget("Label_yema");

        this.btn_left = this.getWidget("Button_left");
        this.btn_left.addTouchEventListener(this.onClickBtn,this);

        this.btn_right = this.getWidget("Button_right");
        this.btn_right.addTouchEventListener(this.onClickBtn,this);

        this.ListView_list = this.getWidget("ListView_list");

        this.layerBg = this.getWidget("mainPopup");

        this.label_no_data = new ccui.Text("暂无数据","res/font/bjdmj/fznt.ttf",45);
        this.label_no_data.setPosition(this.layerBg.width/2,this.layerBg.height/2 - 30);
        this.label_no_data.setVisible(false);
        this.layerBg.addChild(this.label_no_data);
    },

    updateScrollItem:function(data){
        this.ListView_list.removeAllChildren();

        var num = Array.isArray(data) ? data.length : 0;
        var itemH = 125;
        var contentH = Math.max(this.ListView_list.height,itemH*num);
        this.ListView_list.setInnerContainerSize(cc.size(this.ListView_list.width,contentH));

        var itemNode = this.getWidget("Image_item");

        for(var i = 0;i<num;++i){
            var tempNode = itemNode.clone();
            tempNode.visible = true;
            this.setItemWithData(tempNode,data[i]);
            this.ListView_list.addChild(tempNode);
        }
    },

    setItemWithData:function(widget,data){
        var sendName = UITools.truncateLabel(data.sendName,5);
        var sendId = data.sendUserid;
        var acceptName = UITools.truncateLabel(data.acceptName,5);
        var acceptId = data.acceptUserid;
        var num = data.diamondNum;
        var time = data.sendTime;

        var Label_zsrName = ccui.helper.seekWidgetByName(widget,"Label_zsrName");
        var Label_zsrID = ccui.helper.seekWidgetByName(widget,"Label_zsrID");
        var Label_bzsrName = ccui.helper.seekWidgetByName(widget,"Label_bzsrName");
        var Label_bzsrID = ccui.helper.seekWidgetByName(widget,"Label_bzsrID");
        var Label_zssj = ccui.helper.seekWidgetByName(widget,"Label_zssj");
        var Label_lx = ccui.helper.seekWidgetByName(widget,"Label_lx");
        var Label_sj = ccui.helper.seekWidgetByName(widget,"Label_sj");

        Label_zsrName.setString(sendName);
        Label_zsrID.setString("ID:" + sendId);
        Label_bzsrName.setString(acceptName);
        Label_bzsrID.setString("ID:" + acceptId);
        Label_zssj.setString(""+num);
        Label_lx.setString(data.sendType == 1 ? "补偿" : "赠送");
        Label_sj.setString(this.getTimeStrMore(time));
    },

    getTimeStrMore:function(time){
        var date = new Date(time);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hour = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();

        if(month < 10) month = "0" + month;
        if(day < 10) day = "0" + day;
        if(hour < 10) hour = "0" + hour;
        if(min < 10) min = "0" + min;
        if(sec < 10) sec = "0" + sec;

        return year + "/" + month + "/" + day + "\n" + hour + ":" + min + ":" + sec;
    },

    changeSearchTime:function(event){
        var data = event.getUserData();

        this.beginTime = new Date(data.beginTime);
        this.endTime = new Date(data.endTime);

        this.label_date.setString(UITools.formatTime(this.beginTime) + "-" + UITools.formatTime(this.endTime));

        this.getRecordData(this.curPage,this.inputId.getString());
    },

    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            if(sender == this.btn_close){
                PopupManager.remove(this);
            }else if(sender == this.btn_change_date){
                var mc = new ClubChoiceTimePop(this,this.beginTime,this.endTime,15);
                PopupManager.addPopup(mc);
            }else if(sender == this.btn_cbzsr){
                var userId = this.inputId.getString();

                if(userId.length == 0){
                    FloatLabelUtil.comText("玩家ID不能为空！！！");
                   return;
                }

                this.getRecordData(1,userId);
            }else if(sender == this.btn_left){
                var userId = this.inputId.getString();

                if(this.curPage > 1){
                    this.getRecordData(this.curPage - 1,userId);
                }

            }else if(sender == this.btn_right){
                var userId = this.inputId.getString();
                this.getRecordData(this.curPage + 1,userId);
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
