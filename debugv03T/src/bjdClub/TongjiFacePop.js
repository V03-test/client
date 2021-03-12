/**
 * Created by Administrator on 2021/1/15 0015.
 */
var TongjiFacePop = BasePopup.extend({
    curPage:1,
    curMessage:null,

    ctor:function(){
        this._super("res/tongjiFace.json");
    },

    selfRender:function(){
        //var btn_change_time = this.getWidget("btn_chang_time");
        //UITools.addClickEvent(btn_change_time,this,this.onClickChangeTime);
        //this.addCustomEvent(SyEvent.RESET_TIME, this, this.changeSearchTime);
        //this.label_begin = this.getWidget("label_begin");
        //this.label_end = this.getWidget("label_end");

        this.touchPanel = this.getWidget("dataTouchPanel");
        this.touchPanel.setTouchEnabled(true);
        UITools.addClickEvent(this.touchPanel, this, this.onOpenSingleTimePop);

        this.endTime = this.getWidget("endTime");//ccui.helper.seekWidgetByName(this.touchPanel, "endTime");
        var tempTime = new Date().getTime();
        var curSingleTime = this.formatTime(tempTime);
        this.endTime.setString(curSingleTime);

        this.localTime = this.formartTimeStr(tempTime);

        var input_bg_0 = this.getWidget("input_bg_0");
        this.input_bg_0 = new cc.EditBox(cc.size(input_bg_0.width - 100, input_bg_0.height - 10), new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.input_bg_0.x = input_bg_0.width / 2 - 40;
        this.input_bg_0.y = input_bg_0.height / 2;
        this.input_bg_0.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this.input_bg_0.setPlaceHolder("请输入关键词");
        this.input_bg_0.setPlaceholderFont("Arial", 36);
        //this.input_bg_0.setPlaceholderFontColor(cc.color("#2155b5"));
        input_bg_0.addChild(this.input_bg_0, 1);
        this.input_bg_0.setFont("Arial", 36);

        var btn_search = this.getWidget("btn_search");
        UITools.addClickEvent(btn_search,this,this.onClickSearch);

        this.label_page = this.getWidget("label_page");
        this.btn_left_page = this.getWidget("btn_left");
        this.btn_right_page = this.getWidget("btn_right");
        UITools.addClickEvent(this.btn_left_page,this,this.onClickPageBtn);
        UITools.addClickEvent(this.btn_right_page,this,this.onClickPageBtn);

        this.addCustomEvent(SyEvent.RESET_SINGLE_TIME, this, this.changeSingleTime);

        this.curMessage = null;

        this.getData();
    },

    refreshSingle:function(widget,user) {
        widget.visible = true;
        ccui.helper.seekWidgetByName(widget, "name").setString(user.name);
        ccui.helper.seekWidgetByName(widget, "id").setString("ID:" + user.userId);

        var icon = ccui.helper.seekWidgetByName(widget,"icon");
        var defaultimg = "res/res/pkCommon/pkSmallResult/touxiang.png";
        if(icon.getChildByTag(345))
            icon.removeChildByTag(345);
        var sprite = new cc.Sprite(defaultimg);
        sprite.x = icon.width / 2;
        sprite.y = icon.height / 2;
        icon.addChild(sprite,5,345);
        if(user.headimgurl){
            cc.loader.loadImg(user.headimgurl, {width: 120, height: 120}, function (error, img) {
                if (!error) {
                    sprite.setTexture(img);
                    sprite.x = icon.width / 2;
                    sprite.y = icon.height / 2;
                }
            });
        }

        ccui.helper.seekWidgetByName(widget, "txt_zcc").setString(user.zjsCount);//总场次
        ccui.helper.seekWidgetByName(widget, "txt_dyj").setString(user.dyjCount);//大赢家
        ccui.helper.seekWidgetByName(widget, "txt_yxsy").setString(user.winCredit);//游戏输赢
        ccui.helper.seekWidgetByName(widget, "txt_jl").setString(user.credit);//奖励
        ccui.helper.seekWidgetByName(widget, "txt_yxzsy").setString(user.totalCredit);//游戏总输赢

        var Button_wjs = ccui.helper.seekWidgetByName(widget, "Button_wjs");//未结算按钮
        //UITools.addClickEvent(Button_wjs,this,this.onClickButton_wjs);
        Button_wjs.setEnabled(false);
        Button_wjs.setBright(false);
    },

    onClickButton_wjs:function(btn){
        btn.setEnabled(false);
        btn.setBright(false);
    },

    initData:function(data){
        data = data || [];
        for(var i = 0; i < 4; ++i){
            var widget = this.getWidget("player"+(i + 1));
            widget.visible = false;
            if(data[i]){
               this.refreshSingle(widget,data[i]);
            }
        }
    },

    initZongjiData:function(){
        var zjsCount = 0;
        var dyjCount = 0;
        var winCredit = 0;
        var credit = 0;
        var totalCredit = 0;
        for(var i = 0; i < this.curMessage.length; ++i){
            if(this.curMessage[i]){
                zjsCount += this.curMessage[i].zjsCount;
                dyjCount += this.curMessage[i].dyjCount;
                winCredit += this.curMessage[i].winCredit;
                credit += this.curMessage[i].credit;
                totalCredit += this.curMessage[i].totalCredit;
            }
        }
        var widget = this.getWidget("zongji");
        ccui.helper.seekWidgetByName(widget, "txt_zcc").setString(zjsCount);//总场次
        ccui.helper.seekWidgetByName(widget, "txt_dyj").setString(dyjCount);//大赢家
        ccui.helper.seekWidgetByName(widget, "txt_yxsy").setString(winCredit);//游戏输赢
        ccui.helper.seekWidgetByName(widget, "txt_jl").setString(credit);//奖励
        ccui.helper.seekWidgetByName(widget, "txt_yxzsy").setString(totalCredit);//游戏总输赢
    },

    getData:function(){
        var params = {
            sessCode: PlayerModel.sessCode,
            groupId: ClickClubModel.getCurClubId(),
            userId: PlayerModel.userId,
            date:this.localTime
        };

        var self = this;
        sy.scene.showLoading("正在获取统计数据");
        NetworkJT.loginReqNew(447, params, function (data) {
            sy.scene.hideLoading();
            if (data && data.code == 0 && data.message) {
                cc.log("loadInactiveUserList===",JSON.stringify(data));
                self.curMessage = data.message || [];
                self.initData(self.curMessage.slice(0,4));
                self.initZongjiData();
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
            sy.scene.hideLoading();
        });

    },

    onClickPageBtn:function(sender){
        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
            sender.setTouchEnabled(true);
        })));

        var localPage = this.curPage;

        if(sender == this.btn_left_page && this.curPage > 1){
            --this.curPage;
            this.label_page.setString(""+this.curPage);
            var data = this.curMessage.slice(this.curPage * 4,localPage * 4);
            this.initData(data);
        }else if(sender == this.btn_right_page){
            var data = this.curMessage.slice(this.curPage * 4,(this.curPage + 1) * 4);
            if(data.length > 0){
                ++this.curPage;
                this.label_page.setString(""+this.curPage);
                this.initData(data);
            }else{
                FloatLabelUtil.comText("没有更多页面了！！！");
            }
        }
    },

    onClickSearch:function(sender){
        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
            sender.setTouchEnabled(true);
        })));

        var data = this.curMessage || [];
        var localUID = this.input_bg_0.string;
        var result = null;
        for(var i = 0;i < data.length;++i){
            if(data[i] && localUID == data[i].userId){
                result = data[i];
                break;
            }
        }
        if(result){
           this.initData([result]);
        }else{
            FloatLabelUtil.comText("未查询到该玩家信息！！！");
        }
    },

    showIcon: function (imgNode,iconUrl, sex) {
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var sex = sex || 1;
        var defaultimg = (sex == 1) ? "res/ui/common/default_m.png" : "res/ui/common/default_m.png";

        var spr = imgNode.getChildByName("icon_spr");
        if(!spr){
            spr = new cc.Sprite(defaultimg);
            spr.setName("icon_spr");
            spr.setPosition(imgNode.width/2,imgNode.height/2);
            spr.setScale(100/spr.width);
            imgNode.addChild(spr);
        }

        if (iconUrl) {

            cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
                if (!error) {
                    spr.setTexture(img);
                    spr.setScale(100/spr.width);
                }
            });
        }else{
            spr.initWithFile(defaultimg);
        }
    },

    onOpenSingleTimePop:function(){
        var endTime = this.getLocalItem("sy_dn_singleTime") || 0;
        var mc = new ClubSingleTimePop(this  , endTime);
        PopupManager.addPopup(mc);
    },

    changeSingleTime: function (event) {
        var data = event.getUserData();

        var endTime = this.formartTimeStr(data.endTime);

        var endSingleTime = this.formatTime(data.endTime);

        this.endTime.setString(endSingleTime);

        this.localTime = endTime;

        cc.sys.localStorage.setItem("sy_dn_singleTime", (data.endTime));
        this.getData();
    },

    formatTime:function(shijianchuo) {
        //shijianchuo是整数，否则要parseInt转换
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        //return y+'-'+this.add0(m)+'-'+this.add0(d)+' '+this.add0(h)+':'+this.add0(mm)+':'+this.add0(s);
        return this.add0(m)+'月'+this.add0(d)+'日'
    },

    add0:function(m){
        return m<10?'0'+m:m+'';
    },

    onClickChangeTime:function(){
        var beginTime = this.getLocalItem("sy_dn_beginTime") || 0;
        var endTime = this.getLocalItem("sy_dn_endTime") || 0;
        var mc = new ClubChoiceTimePop(this , beginTime , endTime);
        PopupManager.addPopup(mc);
    },

    getLocalItem:function(key){
        var val = cc.sys.localStorage.getItem(key);
        if(val)
            val = parseInt(val);
        return val;
    },


    formartTimeStr:function(shijianchuo){
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        m = m < 10 ? "0" + m : "" + m;
        var d = time.getDate();
        d = d < 10 ? "0" + d : "" + d;
        //var h = time.getHours();
        //var mm = time.getMinutes();
        //var s = time.getSeconds();
        return y+m+d;
    },
});