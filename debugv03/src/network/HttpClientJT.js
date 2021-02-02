var HttpUrlRequestJT = cc.Class.extend({

    _xmlhttp:null,
    _url:"",
    _reqtype:"POST",
    _command:0,
    _body:"",
    _params:null,
    _onSuc:null,
    _onErr:null,
    _timeoutl:null,
    _timeoutt:null,
    _data:null,

    ctor:function(url, reqId, param, onSuccess, onError){
        this._timeoutl = this._timeoutt = null;
        this._url = url;
        this._command = reqId;
        this._onSuc = onSuccess;
        this._onErr = onError;
        this._reqtype = param.type || "POST";
        this._params = param;
        var data = param || {};
        this.tempBody = "";
        this.tempBodyAes = "";

        data.timestamp = new Date().getTime();
        data = this.objKeySort(data);
        for(var key in data){
            var paramStr = key+"="+data[key];
            if(this._body == ""){
                this._body += "&"+paramStr;
            }else {
                this._body += "&"+paramStr;
            }
            var paramTempStr = key+"="+encodeURIComponent(data[key]);
            if(this.tempBody == ""){
                this.tempBody += "&"+paramTempStr;
            }else {
                this.tempBody += "&"+paramTempStr;
            }
        }
        var pingKyeBody = this._body+"&key="+"043a528a8fc7195876fc4d4c3eaa7d2e";
        var sign = md5(pingKyeBody);
        sign = sign.toUpperCase();
        var signParms = "sign="+sign;
        this._body += "&"+signParms;
        this.tempBody += "&"+signParms;
        data.sign = sign;
        this.tempBodyAes = JSON.stringify(data)
        // cc.log("this.tempBodyAes==",JSON.stringify(data),this.tempBodyAes)
    },

    //排序的函数
    objKeySort:function(arys) {
        //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
        var newkey = Object.keys(arys).sort();
        var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
        for(var i = 0; i < newkey.length; i++) {
            //遍历newkey数组
            newObj[newkey[i]] = arys[newkey[i]];
            //向新创建的对象中按照排好的顺序依次增加键值对
        }
        return newObj; //返回排好序的新对象
    },



    response:function(responseText){
        //cc.log("response::"+JSON.stringify(responseText));
        if(responseText == ""){
            cc.log("NetWork response is null::"+this._command);
        }else{
            var json = {};
            try{
                var enCBC = AESUtil.decryptHttp(responseText);
                // cc.log("enCBC==",JSON.stringify(enCBC))
                json = JSON.parse(enCBC);
                // cc.log("json===",JSON.stringify(json))
            }catch(e){
                throw "network json parse exception::"+e;
            }
            var code = json.code;
            if(json.time){   // 校准时间
                ServerTimeManager.update(json.time);
            }
            if(!json.hasOwnProperty("code") || code == 0){
                if(this._onSuc)	this._onSuc(json);
            }else{
                ErrorUtil.handle(json);
                if(this._onErr)	this._onErr(json);
            }
        }
    },

    /**
     * 是否不转圈
     * @param command
     * @param param
     * @returns {Boolean}
     */
    isExclude:function(){
        var excludeFuncType = {
            "2":[],
            "3":[],
            "11":[1,8],
            "25":[7],
            "22":[]
        };
        var key = this._command+"";
        if(excludeFuncType.hasOwnProperty(key)){
            var array = excludeFuncType[key];
            if(array.length == 0){
                return true;
            }else{
                var funcType = this._params.funcType;
                if(funcType){
                    return (ArrayUtil.indexOf(array, funcType) >= 0);
                }
            }
        }
        return false;
    },

    request:function(){
        var xhr = this._xmlhttp = cc.loader.getXMLHttpRequest();
        //if(!cc.runtime){
        //    if(SyConfig.isNative() && (cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_ANDROID)){
        //        xhr.setRequestHeader("Accept-Encoding","gzip,deflate");
        //    }
        //}
        xhr.open(this._reqtype, this._url);
        xhr.timeout = 12000;
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
        //if(!this.isExclude()){
        //var loadingop = function(){
        //if(sy.scene)  sy.scene.showLoading("正在请求网络...");
        //}
        //this._timeoutl = setTimeout(loadingop,2000);
        //}
        var tempBodyAes = AESUtil.encryptHttp(this.tempBodyAes);
        var tempBodyAes1 = AESUtil.decryptHttp(tempBodyAes);
        cc.log("tempBodyAes==",tempBodyAes,JSON.stringify(tempBodyAes1));
        tempBodyAes = encodeURIComponent(tempBodyAes + "KbzG2kNBuQe8RrMW");
        // cc.log("tempBodyAes==",tempBodyAes,JSON.stringify(tempBodyAes1));
        var self = this;
        var onerror = function(){
            xhr.abort();
            //if(sy.scene)  sy.scene.hideLoading();
            //if(self._timeoutl!=null)
            //    clearTimeout(self._timeoutl);
            ServerUtil.getServerFromTJD();
            SocketErrorModel.updateLoginIndex();
            if(self._onErr)	self._onErr("");
            cc.log("NetWork error:status:"+xhr.status+" url:"+self._url+"?"+self._body);
        }
        xhr.onerror = onerror;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    //if(self._timeoutl!=null)
                    //    clearTimeout(self._timeoutl);
                    //if(sy.scene)
                    //    sy.scene.hideLoading();
                    cc.log("NetWork zehngqu:status:"+xhr.status+" url:"+self._url+" body:"+self._body);
                    self.response(xhr.responseText);
                }else{
                    onerror.call(self);
                }
            }
        }
        xhr.send(tempBodyAes);
        return xhr;
    }
});

/**
 * http请求
 * @author zhoufan
 * @date 2014年10月20日
 * @version v1.0
 */
var NetworkJT = {
    gameUrl:"",
    reqtimes:null,
    excludeFuncType:{
        "1":[],
        "24":[],
        "25":[],
        "11":[1,8,14,15]
    },

    /**
     * 是否跳过过快点击
     * @param command
     * @param param
     * @returns {Boolean}
     */
    isExclude:function(command,param){
        var key = command+"";
        if(command=="")return true;
        if(this.excludeFuncType.hasOwnProperty(key)){
            var array = this.excludeFuncType[key];
            if(array.length == 0){
                return true;
            }else{
                var funcType = param.funcType;
                if(funcType){
                    return (ArrayUtil.indexOf(array, funcType) >= 0);
                }
            }
        }
        return false;
    },

    /**
     * HTTP请求
     * @param {Integer} command
     * @param {Object} param
     * @param {Function} onSuccess
     * @param {Function} onError
     */
    sypost : function(url,reqId,param,onSuccess,onError) {
        //if(!this.reqtimes)
        //    this.reqtimes = new SimpleHashMap();
        //if(!this.isExclude(command, param)){
        //    var now = new Date().getTime();
        //    var lasttime = this.reqtimes.get(command);
        //    lasttime = lasttime || 0;
        //    var diff = now - lasttime;
        //    if(diff < 500){
        //        var funcType = param.hasOwnProperty("funcType") ? param.funcType : 0;
        //        cc.log("requet is too fast! diff is "+diff+", command is "+command+" funcType is "+funcType);
        //        return null;
        //    }
        //    this.reqtimes.put(command, now);
        //}
        var req = new HttpUrlRequestJT(url,reqId,param,onSuccess,onError);
        var xhr = req.request();
        return xhr;
    },

    gameReq:function(command,param,onSuccess,onError){
        var url = csvhelper.strFormat(SyConfig.LOGIN_URL,"support",command);
        return this.sypost(url,command,param,onSuccess,onError);
    },
    payReq:function(command,param,onSuccess,onError){
        var url = csvhelper.strFormat(SyConfig.LOGIN_URL,"pay",command);
        return this.sypost(url,command,param,onSuccess,onError);
    },
    logReq:function(msg){
        var object = {};
        object.userId = PlayerModel.userId;
        object.msg = msg;
        return this.loginReq("log","clientLog",{log:JSON.stringify(object)});
    },

    loginReq:function(act,command,param,onSuccess,onError){
        // cc.log("loginReq===",act,command);
        var url = csvhelper.strFormat(SyConfig.LOGIN_URL,act,command);
        this.sypost(url,command,param,onSuccess,onError);
    },

    loginReqNew:function(reqId,param,onSuccess,onError){
        for(var key in param){
            param[key] = param[key] != null ? param[key] + "" : "";
        }
        var url = HttpReqModel.getHttpUrlById(reqId);
        cc.log("url====",url)
        this.sypost(url,reqId,param,onSuccess,onError);
    },

    loginReq1:function(act,command,param,onSuccess,onError){
        //var url = "http://gm.688gs.com/pdkuposa/v2/noauth/pay/cash/msg?gameId=3&";
        var url = "http://gm.688gs.com/pdkuposa/v2/noauth/pay/cards/msg?gameId=3&";
        this.sypost(url,command,param,onSuccess,onError);

    },
    loginReqZS:function(act,command,param,onSuccess,onError){
        //var url = "http://gm.688gs.com/pdkuposa/v2/noauth/pay/cash/msg?gameId=3&";
        var url = "http://gm.688gs.com/pdkuposa/v2/noauth/pay/cards/get?gameId=3&";
        this.sypost(url,command,param,onSuccess,onError);
    },
    loginReqJt:function(act,command,param,onSuccess,onError){
        var url = csvhelper.strFormat(SyConfig.LOGIN_URL,act,command);
        this.sypost(url,command,param,onSuccess,onError);
    },
};
