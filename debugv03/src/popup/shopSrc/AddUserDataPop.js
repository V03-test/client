/**
 * Created by Administrator on 2020/7/13.
 */
var AddUserDataPop = BasePopup.extend({

    ctor: function () {
        this._super("res/addUserData.json");
    },

    selfRender: function () {
        this.Button_qd = this.getWidget("Button_qd");
        this.Button_qx = this.getWidget("Button_qx");
        this.Button_close = this.getWidget("Button_close");
        UITools.addClickEvent(this.Button_qd,this,this.onOk);
        UITools.addClickEvent(this.Button_qx,this,this.onCancel);
        UITools.addClickEvent(this.Button_close,this,this.onClose);

        var Image_name = this.getWidget("Image_name");
        var Image_phone = this.getWidget("Image_phone");

        this.Image_name = new cc.EditBox(cc.size(Image_name.width - 20, 70),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.Image_name.x = Image_name.width/2;
        this.Image_name.y = Image_name.height/2;
        this.Image_name.setPlaceholderFont("Arial",36);
        this.Image_name.setPlaceholderFontColor(cc.color("#fefefe"));
        this.Image_name.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this.Image_name.setPlaceHolder("请输入姓名");
        Image_name.addChild(this.Image_name,1);
        this.Image_name.setFont("Arial",36);

        this.Image_phone = new cc.EditBox(cc.size(Image_phone.width - 20, 70),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.Image_phone.x = Image_phone.width/2;
        this.Image_phone.y = Image_phone.height/2;
        this.Image_phone.setPlaceholderFont("Arial",36);
        this.Image_phone.setPlaceholderFontColor(cc.color("#fefefe"));
        this.Image_phone.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this.Image_phone.setPlaceHolder("请输入手机号码");
        Image_phone.addChild(this.Image_phone,1);
        this.Image_phone.setFont("Arial",36);

        var Image_dizhi1 = this.getWidget("Image_dizhi1");
        this.Image_dizhi1 = new cc.EditBox(cc.size(Image_dizhi1.width - 20, 70),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.Image_dizhi1.x = Image_dizhi1.width/2;
        this.Image_dizhi1.y = Image_dizhi1.height/2;
        this.Image_dizhi1.setPlaceholderFont("Arial",36);
        this.Image_dizhi1.setPlaceholderFontColor(cc.color("#fefefe"));
        this.Image_dizhi1.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        //this.Image_dizhi1.setPlaceHolder("");
        Image_dizhi1.addChild(this.Image_dizhi1,1);
        this.Image_dizhi1.setFont("Arial",36);

        var Image_dizhi2 = this.getWidget("Image_dizhi2");
        this.Image_dizhi2 = new cc.EditBox(cc.size(Image_dizhi2.width - 20, 70),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.Image_dizhi2.x = Image_dizhi2.width/2;
        this.Image_dizhi2.y = Image_dizhi2.height/2;
        this.Image_dizhi2.setPlaceholderFont("Arial",36);
        this.Image_dizhi2.setPlaceholderFontColor(cc.color("#fefefe"));
        this.Image_dizhi2.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        //this.Image_dizhi2.setPlaceHolder("");
        Image_dizhi2.addChild(this.Image_dizhi2,1);
        this.Image_dizhi2.setFont("Arial",36);

        var Image_dizhi3 = this.getWidget("Image_dizhi3");
        this.Image_dizhi3 = new cc.EditBox(cc.size(Image_dizhi3.width - 20, 70),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.Image_dizhi3.x = Image_dizhi3.width/2;
        this.Image_dizhi3.y = Image_dizhi3.height/2;
        this.Image_dizhi3.setPlaceholderFont("Arial",36);
        this.Image_dizhi3.setPlaceholderFontColor(cc.color("#fefefe"));
        this.Image_dizhi3.setInputMode(cc.EDITBOX_INPUT_MODE_SINGLELINE);
        this.Image_dizhi3.setPlaceHolder("请输入详细地址");
        Image_dizhi3.addChild(this.Image_dizhi3,1);
        this.Image_dizhi3.setFont("Arial",36);

        this.getUserDataHttp();
    },

    //获取玩家数据
    getUserDataHttp:function(){
        var oldUrl = "https://bjdqp.firstmjq.club/agent/exchange/setUserExchangeInfo/wx_plat/mjqz?";
        var url = Network.getWebUrl(oldUrl);
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", url);
        xhr.timeout = 12000;
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");

        var self = this;
        var onerror = function(){
            xhr.abort();
            cc.log("==========getUserData========error=========");
        }
        xhr.onerror = onerror;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    cc.log("===========getUserData============" + xhr.responseText);
                    var data = JSON.parse(xhr.responseText);
                    if(data.code == 0 && data.msg == "success"){
                        self.setLocalUserData(data.data);
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

    //设置玩家数据
    setUserDataHttp:function(){
        var lnktruename = this.Image_name.getString();
        if(lnktruename == ""){
            FloatLabelUtil.comText("名字不能为空！！！");
            return;
        }
        var lnktel = this.Image_phone.getString();
        if(lnktel == ""){
            FloatLabelUtil.comText("电话号码不能为空！！！");
            return;
        }

        var oldUrl = "https://bjdqp.firstmjq.club/agent/exchange/setUserExchangeInfo/wx_plat/mjqz?";
        var url = this.getWebUrl(oldUrl);
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("POST", url);
        xhr.timeout = 12000;
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");

        var self = this;
        var onerror = function(){
            xhr.abort();
            cc.log("==========getUserData========error=========");
        }
        xhr.onerror = onerror;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    cc.log("===========getUserData============" + xhr.responseText);
                    var data = JSON.parse(xhr.responseText);
                    FloatLabelUtil.comText(data.msg);
                    if(data.code == 0 && data.msg == "修改成功"){
                        self.setUserData();
                        PopupManager.remove(self);
                    }
                }else{
                    onerror.call(self);
                }
            }
        }
        xhr.send();
    },

    getWebUrl: function(url){
        var _nowTime = Math.round(new Date().getTime()/1000).toString();
        var _randomNum = ('000000' + Math.floor(Math.random() * 999999)).slice(-6);
        var _url = url;

        if (_url){
            var _obj = {
                "char_id":"" + PlayerModel.userId,
                "t":""+_nowTime,
                "rand":""+_randomNum,
                "address":this.Image_dizhi3.getString(),
                "lnktruename":this.Image_name.getString(),
                "lnktel":this.Image_phone.getString(),
                "province":this.Image_dizhi1.getString(),
                "city":this.Image_dizhi2.getString()
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
                if(key != "lnktruename" && key != "lnktel" && key != "address" &&  key != "province" &&  key != "city"){
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

    getUserData:function(){
        var data = {};
        data.name = this.getLocalItem("DHSC_USER_NAME") || "";
        data.phone =  this.getLocalItem("DHSC_USER_PHONE") || "";
        data.dizhi1 = this.getLocalItem("DHSC_USER_DIZHI1") || "";
        data.dizhi2 = this.getLocalItem("DHSC_USER_DIZHI2") || "";
        data.dizhi3 = this.getLocalItem("DHSC_USER_DIZHI3") || "";
        return data;
    },

    setUserData:function(){
        this.setLocalItem("DHSC_USER_NAME",this.Image_name.getString());
        this.setLocalItem("DHSC_USER_PHONE",this.Image_phone.getString());
        this.setLocalItem("DHSC_USER_DIZHI1",this.Image_dizhi1.getString());
        this.setLocalItem("DHSC_USER_DIZHI2",this.Image_dizhi2.getString());
        this.setLocalItem("DHSC_USER_DIZHI3",this.Image_dizhi3.getString());
    },

    setLocalUserData:function(data){
        data = data || {};
        var localData = this.getUserData();
        if(data.lnktruename && data.lnktruename != ""){
            this.Image_name.setString(data.lnktruename);
        }else{
            this.Image_name.setString(localData.name);
        }

        if(data.lnktel && data.lnktel != ""){
            this.Image_phone.setString(data.lnktel);
        }else{
            this.Image_phone.setString(localData.phone);
        }

        if(data.province && data.province != ""){
            this.Image_dizhi1.setString(data.province.substring(0,2));
        }else{
            this.Image_dizhi1.setString(localData.dizhi1);
        }

        if(data.city && data.city != ""){
            this.Image_dizhi2.setString(data.city.substring(0,2));
        }else{
            this.Image_dizhi2.setString(localData.dizhi2);
        }

        if(data.address && data.address != ""){
            this.Image_dizhi3.setString(data.address);
        }else{
            this.Image_dizhi3.setString(localData.dizhi3);
        }
    },

    setLocalItem:function(key,values){
        cc.sys.localStorage.setItem(key,values);
    },

    getLocalItem:function(key){
        var val = cc.sys.localStorage.getItem(key);
        return val;
    },

    onClose:function(){
        PopupManager.remove(this);
    },

    onOk:function(){
        this.setUserDataHttp();
    },

    onCancel:function(){
        PopupManager.remove(this);
    }
});