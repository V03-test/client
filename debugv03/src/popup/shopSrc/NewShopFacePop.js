/**
 * Created by Administrator on 2020/7/13.
 */
var NewShopFacePop = BasePopup.extend({

    ctor: function () {
        this._super("res/newShopFace.json");
    },

    selfRender: function () {
        this.Button_txzl = this.getWidget("Button_txzl");//填写资料
        this.Button_zxkf = this.getWidget("Button_zxkf");//在线客服
        this.Button_dhjl = this.getWidget("Button_dhjl");//兑换记录
        this.Button_close = this.getWidget("Button_close");//关闭
        this.Button_hq = this.getWidget("Button_hq");//获取

        this.Label_quan = this.getWidget("Label_quan");//礼券数量

        this.ScrollView_list = this.getWidget("ScrollView_list");

        UITools.addClickEvent(this.Button_close,this,this.onClose);
        UITools.addClickEvent(this.Button_zxkf,this,this.onClickZXKF);
        UITools.addClickEvent(this.Button_txzl,this,this.onClickTXZL);
        UITools.addClickEvent(this.Button_dhjl,this,this.onClickDHJL);
        UITools.addClickEvent(this.Button_hq,this,this.onClickHQ);

        this.Button_all = this.getWidget("Button_all");//全部
        this.Button_shyp = this.getWidget("Button_shyp");//生活用品

        this.Image_all = this.getWidget("Image_all");//全部选中图片
        this.Image_shyp = this.getWidget("Image_shyp");//生活用品选中图片

        this.Label_all = this.getWidget("Label_all");//全部
        this.Label_shyp = this.getWidget("Label_shyp");//生活用品

        /** 先去掉页签 **/
        this.Button_shyp.visible = false;
        //UITools.addClickEvent(this.Button_all,this,this.onClickAll);
        //UITools.addClickEvent(this.Button_shyp,this,this.onClickSHYP);

        this.isAllClick = true;

        this.webViewNode = new cc.Node();
        this.addChild(this.webViewNode,100);

        this.addCustomEvent("DHSC_GIFT_NUMBER",this,this.updateGoldNum);

        sySocket.sendComReqMsg(1111 , [1]);/*** 请求刷新礼券数量接口 **/

        setTimeout(function(){
            sySocket.sendComReqMsg(1160 ,[]);//获取背包道具数据
        },50);

        this.getShopList();//刷新商品列表
    },

    onClickAll:function(){
        if(!this.isAllClick){
            this.isAllClick = true;
            this.getShopList();
        }
        this.Image_all.visible = true;
        this.Image_shyp.visible = false;
        this.Label_all.setColor(cc.color("#ffffff"));
        this.Label_shyp.setColor(cc.color("#6dbfff"));
    },

    onClickSHYP:function(){
        if(this.isAllClick){
            this.isAllClick = false;
            this.getShopList();
        }
        this.Image_all.visible = false;
        this.Image_shyp.visible = true;
        this.Label_all.setColor(cc.color("#6dbfff"));
        this.Label_shyp.setColor(cc.color("#ffffff"));
    },

    updateGoldNum:function(message){
        var data = message.getUserData();
        this.Label_quan.setString(""+ (data[0] || 0));
    },

    //获取商品列表
    getShopList:function(){
        //var data = [{"id":"1","exchange_goods_name":"10元话费","consume_gold_value":"1000","is_entity":"0","goods_img":"https://cdncfgh5.52bjd.com/h5game/upload/1570521623_8626.png",
        //    "remark":"七个工作日内审核，审核后，所留手机号码获得10元话费充值。","sort":"5019"}];
        //this.updateShopList(data);
        //return;

        var oldUrl = "https://bjdqp.firstmjq.club/agent/exchange/getExchangeGoodsList/wx_plat/mjqz?";
        var url = Network.getWebUrl(oldUrl);
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", url);
        xhr.timeout = 12000;
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");

        var self = this;
        var onerror = function(){
            xhr.abort();
            cc.log("==========getShopList========error=========");
        }
        xhr.onerror = onerror;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    cc.log("===========getShopList============" + xhr.responseText);
                    var data = JSON.parse(xhr.responseText);
                    if(data.code == 0 && data.msg == "success"){
                        self.updateShopList(data.data.list);//刷新商品列表
                        sySocket.sendComReqMsg(1111 , [1]);/*** 请求刷新礼券数量接口 **/
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

    updateGiftLabel:function(giftNum){
        this.Label_quan.setString(""+giftNum);
    },

    selectArrayByType:function(data){
        data = data || [];
        if(this.isAllClick){
            return data;
        }
        var result = [];
        for(var i = 0;i < data.length;++i){
            if(data[i].id == 1 || data[i].id == 2 || data[i].id == 6){
                result.push(data[i]);
            }
        }
        return result;
    },

    updateShopList:function(data){
        data = this.selectArrayByType(data);
        this.ScrollView_list.removeAllChildren();

        var tempItem = this.getWidget("Image_tempItem");

        var tempNum = Math.ceil(data.length / 4);
        var contentH = 380 * tempNum;

        for(var i = 0;i < data.length;++i){
            var Image_item = ccui.helper.seekWidgetByName(this.ScrollView_list,"Image_item" + i);//当前item
            if(!Image_item){
                Image_item = tempItem.clone();
                Image_item.setName("Image_item" + i);
                this.ScrollView_list.addChild(Image_item);
            }
            Image_item.visible = true;
            Image_item.x = 250 + 400 * (i % 4);
            var tempY = tempNum > 2 ? 560 + (tempNum - 2) * 360 : 560;
            Image_item.y = tempY - 360 * Math.floor(i / 4);

            var Button_78 = ccui.helper.seekWidgetByName(Image_item,"Button_78");//按钮
            Button_78.tempData = data[i];
            UITools.addClickEvent(Button_78,this,this.onClickShop);

            var Image_59 = ccui.helper.seekWidgetByName(Image_item,"Image_59");//商品图片
            Image_59.loadTexture("res/ui/bjdmj/popup/shopRes/"+ data[i].id +".png");

            var Label_title1 = ccui.helper.seekWidgetByName(Image_item,"Label_title1");//商品名
            Label_title1.setString(""+data[i].exchange_goods_name);
            var quanStr = ccui.helper.seekWidgetByName(Image_item,"Label_61");//设置礼券数量
            quanStr.setString(""+data[i].consume_gold_value);
        }

        this.ScrollView_list.setInnerContainerSize(cc.size(this.ScrollView_list.width,contentH));
        this.ScrollView_list.setBounceEnabled(contentH > 760);
    },

    onClickShop:function(obj){
        var data = obj.tempData;
        var self = this;
        var tipStr = "确定要花费" + data.consume_gold_value + "礼券兑换" + data.exchange_goods_name + "吗？";
        if(data.id == 1 || data.id == 2 || data.id == 6){// 10 100 50元话费券
            //tipStr = data.consume_gold_value + "礼券或"+ +"兑换" + data.exchange_goods_name + ",请选择兑换方式";
            var mc = new NewReplaceFacePop(data,this.Label_quan.getString(),function(consume_type,count){
                self.exChangeClick(""+data.id,consume_type,count);
            });
            PopupManager.addPopup(mc);
        }else{
            var mc = new ReplaceFacePop(tipStr,function(){
                self.exChangeClick(""+data.id);
            });
            PopupManager.addPopup(mc);
        }
    },

    getWebUrl: function(url,Goods_id,consume_type,count){
        var _nowTime = Math.round(new Date().getTime()/1000).toString();
        var _randomNum = ('000000' + Math.floor(Math.random() * 999999)).slice(-6);
        var _url = url;
        if (_url){
            var _obj = {
                "char_id":"" + PlayerModel.userId,
                "t":""+_nowTime,
                "rand":""+_randomNum,
                "goods_id":""+Goods_id,
                "consume_type":""+consume_type,
                "count":count
            };
            var _signKey = "dfc2c2d62dde2c104203cf71c6e15580";
            var _resultUrl = this.getSendUrl(_obj,_url,_signKey);
            return _resultUrl;
        }
        return false;
    },

    getSendUrl:function(obj,url,signKey){
        var resultUrl = null;
        if (obj){
            var _key = signKey;
            var _stringByDict = ObjectUtil.sortByDict(obj);
            var paramFinalStr = "";
            var signStr = "";
            for(var key in _stringByDict){
                var paramStr = key+"="+_stringByDict[key];
                if (paramFinalStr == ""){
                    paramFinalStr = paramStr;
                }else{
                    paramFinalStr += "&" + paramStr;
                }
                if(key != "goods_id" && key != "consume_type" && key != "count"){
                    if (signStr == ""){
                        signStr = paramStr;
                    }else{
                        signStr += "&" + paramStr;
                    }
                }

            }
            var _sign = md5(signStr + _key).toUpperCase();
            resultUrl = url + paramFinalStr + "&sign="+ _sign;
        }
        return resultUrl;

    },

    //兑换商品
    exChangeClick:function(Goods_id,consume_type,count){
        consume_type = consume_type || 0;
        count = count || 0;
        var oldUrl = "https://bjdqp.firstmjq.club/agent/exchange/createExchangeOrder/wx_plat/mjqz?";
        var url = this.getWebUrl(oldUrl,Goods_id,consume_type,count);
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("POST", url);
        xhr.timeout = 12000;
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
        var self = this;
        var onerror = function(){
            xhr.abort();
            cc.log("==========exChangeClick========error=========");
        }
        xhr.onerror = onerror;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    cc.log("===========exChangeClick============" + xhr.responseText);
                    var data = JSON.parse(xhr.responseText);
                    FloatLabelUtil.comText(data.msg);
                }else{
                    onerror.call(self);
                }
            }
        }
        xhr.send();
    },

    onClose:function(){
        PopupManager.remove(this);
    },

    onClickTXZL:function(){
        var mc = new AddUserDataPop();
        PopupManager.addPopup(mc);
    },

    onClickZXKF:function(){
        var kefuUrl = SdkUtil.COMMON_HTTP_URL + "/Layim/mobile?";
        if (SyConfig.isAndroid()){
            kefuUrl = "https://bjdqp.firstmjq.club/Layim/mobile?";
        }
        var timeKf = new Date().getTime();
        var sortedParams = {
            "userid": PlayerModel.userId,
            "username":PlayerModel.name,
            "usericon":PlayerModel.headurl,
            "time":timeKf,
            "key":"fgfklfghutrfj52bjdcnfsdfddszhjlimsamcn"
        }

        var paramFinalStr = "";
        var paramStr = "";
        for(var key in sortedParams){
            if (key != "userid"){
                paramFinalStr = paramFinalStr +"|"+sortedParams[key];
            }else{
                paramFinalStr = sortedParams[key];
            }

        }
        sortedParams.sign = md5(paramFinalStr);
        for(var key in sortedParams){
            var str = "";
            if (key == "username"){
                str = key+"="+encodeURIComponent(sortedParams[key]);
            }else{
                str =  key+"="+sortedParams[key];
            }
            paramStr += "&"+str;
        }
        var url = kefuUrl+paramStr;
        if (SdkUtil.is316Engine() && (SyConfig.isIos() || SyConfig.isAndroid())){
            var result = SdkUtil.setOrientation(2);
            if (result == false) {
                SdkUtil.sdkOpenUrl(url);
                return;
            }
            if (ccui.WebView){
                var viewport = cc.visibleRect;
                var webView = this.webView = new ccui.WebView();
                webView.x = viewport.center.x;
                webView.y = viewport.center.y;
                webView.setScalesPageToFit(true);
                webView.setContentSize(viewport);
                webView.loadURL(url);
                webView.setJavascriptInterfaceScheme("bjdqp");
                this.webViewNode.addChild(webView);
                this.webView.reload();

                webView.setOnJSCallback(function(sender, url) {
                    SdkUtil.setOrientation(1);
                    if (url.indexOf("bjdqp://close") >= 0) {
                        this.webView.removeFromParent();
                        this.webView = null;
                    }
                }.bind(this));
            }
        }else{
            SdkUtil.sdkOpenUrl(url);
        }
    },

    onClickDHJL:function(){
        var mc = new ReplaceHistoryPop();
        PopupManager.addPopup(mc);
    },

    onClickHQ:function(){
        var mc = new GetGiftTaskPop();
        PopupManager.addPopup(mc);
    },


});