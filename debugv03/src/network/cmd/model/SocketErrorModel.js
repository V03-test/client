var SocketErrorModel = {
    _socketList:null,
    _httpIndex:0,
    _loginIndex:0,

    init:function(){
        if (SyConfig.DEBUG) {
            return
        }
        this._socketList = {
            http:{
                ips:"http://login.lemaitrading.cn/",
                ports:""
            },
            login:{
                ips:"login.lemaitrading.cn",
                ports:"8001,8002,8003,8004,8005,8006,8007,8008"
            }
        }

        this._httpIndex  = UITools.getLocalItem("Socket_new_httpIndex")  || 0;
        this._loginIndex = UITools.getLocalItem("Socket_new_loginIndex") || 0;

        if (SyConfig.IS_CONFIGLIST){
            if (InitConfigList._httpUrlList){
                if (InitConfigList._httpUrlList.ips && InitConfigList._httpUrlList.ips != ""){
                    this._socketList.http.ips = this._socketList.http.ips + "," + InitConfigList._httpUrlList.ips;
                }
            }

            if (InitConfigList._loginUrlList){
                if (InitConfigList._loginUrlList.ips && InitConfigList._loginUrlList.ips != ""){
                    this._socketList.login.ips = this._socketList.login.ips + "," + InitConfigList._loginUrlList.ips;
                }
                if (InitConfigList._loginUrlList.ports && InitConfigList._loginUrlList.ports != ""){
                    this._socketList.login.ports = this._socketList.login.ports + "," + InitConfigList._loginUrlList.ports;
                }
            }
        }


        var _http = this._socketList.http;
        var _httpHosts = GameConfig.parseHost(""+ _http.ips);
        SyConfig.REQ_URL   =  _httpHosts[this._httpIndex] + "pdklogin/" + "{0}!{1}.action";
        SyConfig.LOGIN_URL =  _httpHosts[this._httpIndex] + "pdklogin/" + "{0}!{1}.guajilogin";
        SyConfig.LOGIN_URL_NEW = _httpHosts[this._httpIndex];


        var _login = this._socketList.login;
        var _loginHosts = GameConfig.parseHost(""+ _login.ips);
        SyConfig.WS_HOST = _loginHosts[this._loginIndex];
        SyConfig.WS_PORT = _login.ports;

        // cc.log("LOGIN_URL===",this._loginIndex,SyConfig.REQ_URL,SyConfig.LOGIN_URL)
        // cc.log("WS_HOST===",this._loginIndex,SyConfig.WS_HOST,SyConfig.WS_PORT)
    },

    setHttpIndex:function(_httpIndex){
        this._httpIndex = _httpIndex;
        UITools.setLocalItem("Socket_new_httpIndex",_httpIndex);
    },

    setLoginIndex:function(_LoginIndex){
        this._loginIndex = _LoginIndex;
        UITools.setLocalItem("Socket_new_loginIndex",_LoginIndex);
    },

    updateHttpIndex:function(){
        if (this._socketList){
            var _http = this._socketList.http;
            var _httpHosts = GameConfig.parseHost(_http.ips);
            if (this._httpIndex + 1 >= _httpHosts.length){
                this._httpIndex = 0;
            }else{
                this._httpIndex = this._httpIndex + 1;
            }
            SyConfig.REQ_URL   =  _httpHosts[this._httpIndex] + "pdklogin/" + "{0}!{1}.action";
            SyConfig.LOGIN_URL =  _httpHosts[this._httpIndex] + "pdklogin/" + "{0}!{1}.guajilogin";
            SyConfig.LOGIN_URL_NEW = _httpHosts[this._httpIndex];
            this.setHttpIndex(this._httpIndex);
            cc.log("updateHttpIndex===",this._httpIndex,SyConfig.REQ_URL,SyConfig.LOGIN_URL)
        }
    },

    updateLoginIndex:function(){
        if (this._socketList){
            var _login = this._socketList.login;
            var _loginHosts = GameConfig.parseHost(_login.ips);
            var _loginports = GameConfig.parseHost(_login.ports);
            var _loginport = _loginports[MathUtil.mt_rand(0, _loginports.length-1)];
            if (this._loginIndex + 1 >= _loginHosts.length){
                this._loginIndex = 0;
            }else{
                this._loginIndex = this._loginIndex + 1;
            }
            SyConfig.WS_HOST = _loginHosts[this._loginIndex];
            SyConfig.WS_PORT = _loginport;
            sySocket.url = "ws://" + _loginHosts[this._loginIndex] + ":"  + _loginport;
            this.setLoginIndex(this._loginIndex);
            cc.log("updateLoginIndex===",this._loginIndex,sySocket.url)
        }
    },


}