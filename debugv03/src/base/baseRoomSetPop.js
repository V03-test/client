/**
 * Created by Administrator on 2020/12/9 0009.
 */
var BaseRoomSetPop = BasePopup.extend({
    ctor:function(hasGPS){
        this.hasGPS = !!hasGPS;
        this._super("res/gameRoomSetPop.json");
    },

    selfRender:function(){
        this.btn_jiesan = this.getWidget("btn_jiesan");//解散房间
        this.btn_Gps = this.getWidget("btn_Gps");//GPS
        this.Button_jt = this.getWidget("Button_jt");//箭头
        this.Button_set = this.getWidget("Button_set");//设置
        this.Button_click = this.getWidget("Button_click");//背景点击

        UITools.addClickEvent(this.btn_Gps,this,this.onGPSClick);
        UITools.addClickEvent(this.Button_set,this,this.onSetUp);
        UITools.addClickEvent(this.btn_jiesan,this,this.onBreak);
        UITools.addClickEvent(this.Button_jt,this,this.onRemove);
        UITools.addClickEvent(this.Button_click,this,this.onRemove);

        if(!this.hasGPS){
            this.btn_Gps.setBright(false);
        }
    },

    onSetUp:function(){
        if(LayerManager.getCurrentLayer() == "ERDDZ_ROOM"){
            var mc = new PDKSetUpPop("ERDDZ");
            PopupManager.addPopup(mc);
        }else if ( LayerManager.getCurrentLayer() == "YYBS_ROOM"){
            var mc = new PDKSetUpPop("YYBS");
            PopupManager.addPopup(mc);
        }else if ( LayerManager.getCurrentLayer() == "DT_ROOM"){
            var mc = new PDKSetUpPop("DT");
            PopupManager.addPopup(mc);
        }else if (LayerManager.getCurrentLayer() == "SDH_ROOM"){
            var mc = new PDKSetUpPop("SDH");
            PopupManager.addPopup(mc);
        }else if (LayerManager.getCurrentLayer() == "CDTLJ_ROOM"){
            var mc = new PDKSetUpPop("CDTLJ");
            PopupManager.addPopup(mc);
        }else if (LayerManager.getCurrentLayer() == "HSTH_ROOM"){
            var mc = new PDKSetUpPop("HSTH");
            PopupManager.addPopup(mc);
        }else if (LayerManager.isInPDK()){
            var mc = new PDKSetUpPop("PDK");
            PopupManager.addPopup(mc);
        }else if(LayerManager.isInPHZ()){
            var mc = new PHZNewSetUpPop();
            PopupManager.addPopup(mc);
        }else if(LayerManager.isInMJ()){
            var isCSMJ = 1;
            var isYuyan = MJRoomModel.wanfa == GameTypeEunmMJ.CSMJ || MJRoomModel.wanfa == GameTypeEunmMJ.TDH
                || MJRoomModel.wanfa == GameTypeEunmMJ.JZMJ;
            var mc = new MjSetUpPop(isCSMJ,isYuyan);
            PopupManager.addPopup(mc);
        }
    },

    /**
     * 解散
     */
    onBreak:function(){
        PHZAlertPop.show("解散房间需所有玩家同意，确定要申请解散吗？",function(){
            sySocket.sendComReqMsg(7);
        })
    },

    /**
     * GPS定位
     */
    onGPSClick:function(){
        if(!this.hasGPS){
            return;
        }
        if (LayerManager.isInPDK()){
            PopupManager.addPopup(new GpsPop(PDKRoomModel , 3));
        }else if(LayerManager.isInPHZ()){
            if(PHZRoomModel.renshu > 2){
                PopupManager.addPopup(new GpsPop(PHZRoomModel , PHZRoomModel.renshu));
            }
        }else if(LayerManager.isInMJ()){
            if(MJRoomModel.renshu > 2){
                PopupManager.addPopup(new GpsPop(MJRoomModel , MJRoomModel.renshu));
            }
        }
    },

    onRemove:function(){
        PopupManager.remove(this);
    },

})