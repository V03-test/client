/**
 * Created by lww on 2018/4/26.
 */
var PHZSetModel = {
    kscp:0,//快速吃牌
    kqtp:0,//开启听牌
    yyxz:1,//语音选择
    cpsd:1,//出牌速度
    zpdx:1,//字牌大小
    xxxz:0,//虚线选择
    zpxz:1,//字牌选择
    pmxz:1,//牌面选择
    zmbj:1,//桌面背景
    iscp:0,//选择长牌
    cardTouchend:318,//出牌位置
    init:function(){
        this.kscp = parseInt(this.getLocalItem("pro003_phz_kscp"+PHZRoomModel.wanfa)) || 0;  //1,0
        this.kqtp = parseInt(this.getLocalItem("pro003_phz_kqtp"+PHZRoomModel.wanfa)) == 0 ? 0 : 1 ||this.getDefaultKqtp();  //1,0
        this.yyxz = parseInt(this.getLocalItem("pro003_phz_yyxz"+PHZRoomModel.wanfa)) || this.getDefaultYyxz();  //1,2,3
        this.cpsd = this.getLocalItem("pro003_phz_cpsd"+PHZRoomModel.wanfa) || this.getDefaultCpsd();  //1,2,3
        this.zpdx = parseInt(this.getLocalItem("pro003_phz_zpdx"+PHZRoomModel.wanfa)) || this.getDefaultZpdx();  //1,2,3
        this.xxxz = parseInt(this.getLocalItem("pro003_phz_xxxz"+PHZRoomModel.wanfa)) || this.getDefaultXxxz();  //1,0
        this.zpxz = this.getLocalItem("pro003_phz_zpxz"+PHZRoomModel.wanfa) || this.getDefaultZpxz();  //1,2,3
        this.pmxz = this.getLocalItem("pro003_phz_pmxz" + PHZRoomModel.wanfa) || this.getDefaultPmxz();  //1,2,3
        this.zmbj = this.getLocalItem("pro003_phz_zmbj"+PHZRoomModel.wanfa)|| this.getDefaultZmbj();  //1,2,3
        this.iscp = this.getLocalItem("pro003_phz_iscp"+PHZRoomModel.wanfa)|| 0;
        if (this.xxxz == 1){
            this.cardTouchend = 338;
        }

        if (PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ){
            this.zpdx = 4;
        }

        this.zpxz = this.zpxz == 3 ? 3 : 1;
        this.pmxz = 1;
        this.zpdx = 3;

        var setBg = this.getLocalItem("pro003_phz_set_bg"+PHZRoomModel.wanfa);
        if(setBg != 1){
            this.zmbj = 4;
            this.setLocalItem("pro003_phz_set_bg"+PHZRoomModel.wanfa,1);
        }

        if(this.yyxz != 2 && this.yyxz != 3){
            this.yyxz = 4;
        }
    },
    setDefaultAllData:function(){
        var setAHPHZ = this.getLocalItem("pro003_phz_setAllData_Model"+PHZRoomModel.wanfa);
        if (PHZRoomModel.wanfa == GameTypeEunmZP.AHPHZ && (!setAHPHZ || setAHPHZ != 3)){
            this.yyxz = 4;//语音选择默认 普通话2 常德话3 安化话4
            this.cpsd = 3;//出牌速度默认 标准
            this.zpdx = 4;//字牌大小默认 超大
            this.zpxz = 1;//字牌字体默认 3
            this.pmxz = 1;//牌面默认     4
            this.zmbj = 1;//桌面默认     1
            this.xxxz = 1;//选择高       1
            this.iscp = 0;//不要长牌
            this.setLocalItem("pro003_phz_setAllData_Model"+PHZRoomModel.wanfa,3);
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.DYBP && (!setAHPHZ || setAHPHZ != 2)){
            this.yyxz = 3;//语音选择默认 普通话2 常德话3 安化话4
            this.cpsd = 3;//出牌速度默认 标准
            this.zpdx = 2;//字牌大小默认 中
            this.zpxz = 1;//字牌字体默认 1
            this.pmxz = 1;//牌面默认     1
            this.zmbj = 1;//桌面默认     3
            this.xxxz = 0;//选择高       标准
            this.iscp = 0;//不要长牌
            this.setLocalItem("pro003_phz_setAllData_Model"+PHZRoomModel.wanfa,2);
        }
    },
    getDefaultXxxz:function(){
        if(GameTypeEunmZP.ZZPH == PHZRoomModel.wanfa){
            return 1;
        }
        return 0;
    },
    getDefaultZpdx:function(){
        if (GameTypeEunmZP.GLZP == PHZRoomModel.wanfa){
            return 3;
        }
        if (GameTypeEunmZP.XXEQS == PHZRoomModel.wanfa){
            return 1;
        }
        return 4;
    },
    getDefaultPmxz:function(){
        if (GameTypeEunmZP.AHPHZ == PHZRoomModel.wanfa || GameTypeEunmZP.GLZP == PHZRoomModel.wanfa
            || GameTypeEunmZP.YZCHZ == PHZRoomModel.wanfa || GameTypeEunmZP.YJGHZ == PHZRoomModel.wanfa
            || GameTypeEunmZP.NXGHZ == PHZRoomModel.wanfa || GameTypeEunmZP.YYWHZ == PHZRoomModel.wanfa){
            return 1;
        }
        return 1;
    },
    getDefaultKqtp:function(){
        //if (PHZRoomModel.wanfa == GameTypeEunmZP.XTPHZ){
        //    return 1;
        //}
        return 1;
    },
    getDefaultCpsd:function(){
        var defaultValue = 1;
        if (PHZRoomModel.wanfa == GameTypeEunmZP.CZZP){
            defaultValue = 3;
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.HYSHK || PHZRoomModel.wanfa == GameTypeEunmZP.HYLHQ){
            defaultValue = 3;
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ || PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ){
            defaultValue = 2;
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.AHPHZ){
            defaultValue = 3;
        }else if(PHZRoomModel.wanfa == GameTypeEunmZP.YJGHZ || PHZRoomModel.wanfa == GameTypeEunmZP.NXGHZ || PHZRoomModel.wanfa == GameTypeEunmZP.YYWHZ){
            defaultValue = 4;
        }
        return defaultValue;
    },
    getDefaultZmbj:function(){
        var defaultValue = 4;
       if(PHZRoomModel.wanfa == GameTypeEunmZP.AHPHZ){
            defaultValue = 1;
        }else if(PHZRoomModel.wanfa == GameTypeEunmZP.YJGHZ || PHZRoomModel.wanfa == GameTypeEunmZP.NXGHZ || PHZRoomModel.wanfa == GameTypeEunmZP.YYWHZ){
            defaultValue = 2;
        }
        return defaultValue;
    },
    getDefaultYyxz:function(){
        var defaultValue = 3;
        if (PHZRoomModel.wanfa == GameTypeEunmZP.LYZP){
            defaultValue = 5;
        }else if ((PHZRoomModel.wanfa == GameTypeEunmZP.WHZ) && this.yyxz != 2){
            defaultValue = 6;
        }else if ((PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ || PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ) && this.yyxz != 2){
            defaultValue = 7;
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.AHPHZ){
            defaultValue = 4;
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.ZZPH && this.yyxz != 2){
            defaultValue = 8;
        }else if(PHZRoomModel.wanfa == GameTypeEunmZP.YJGHZ || PHZRoomModel.wanfa == GameTypeEunmZP.NXGHZ){
            defaultValue = 9;
        }else if (PHZRoomModel.wanfa == GameTypeEunmZP.YYWHZ){
            defaultValue = 10;
        }
        return defaultValue;
    },
    getDefaultZpxz:function(){
        var defaultValue = 1;
        if (PHZRoomModel.wanfa == GameTypeEunmZP.CZZP || PHZRoomModel.wanfa == GameTypeEunmZP.LDS ||PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ ||
            PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ || PHZRoomModel.wanfa == GameTypeEunmZP.AHPHZ
            || PHZRoomModel.wanfa == GameTypeEunmZP.ZZPH|| PHZRoomModel.wanfa == GameTypeEunmZP.XXEQS){
            defaultValue = 2;
        }
        return defaultValue;
    },
    getValue:function(string){
        // cc.log("string =,PHZRoomModel.wanfa=,this.getLocalItem = ",string,PHZRoomModel.wanfa,this.getLocalItem(string+PHZRoomModel.wanfa))
        if (this.getLocalItem(string+PHZRoomModel.wanfa) == null){
            this.init();
            if (string =="pro003_phz_kscp"){
                return this.kscp;
            }else if (string =="pro003_phz_kqtp"){
                return this.kqtp;
            }else if (string =="pro003_phz_yyxz"){
                return this.yyxz;
            }else if (string =="pro003_phz_cpsd"){
                return this.cpsd;
            }else if (string =="pro003_phz_zpdx"){
                return this.zpdx;
            }else if (string =="pro003_phz_xxxz"){
                return this.xxxz;
            }else if (string =="pro003_phz_zpxz"){
                return this.zpxz;
            }else if (string =="pro003_phz_zmbj"){
                return this.zmbj;
            }else if (string =="pro003_phz_iscp"){
                return this.iscp;
            }
        }else {
            return this.getLocalItem(string+PHZRoomModel.wanfa);
        }
        
    },

    setLocalItem:function(key,values){
        cc.sys.localStorage.setItem(key,values);
    },

    getLocalItem:function(key){
        var val = cc.sys.localStorage.getItem(key);
        if(val)
            val = parseInt(val);
        return val;
    }
}
