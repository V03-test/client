var DownLoadTipPop = BasePopup.extend({
    ctor: function () {
        this._super("res/DownLoadTipPop.json");
    },

    selfRender: function () {
        this.Button_downLoad = this.getWidget("Button_downLoad");
        UITools.addClickEvent(this.Button_downLoad, this, this.onClickDOWLOAD);
    },
    onClickDOWLOAD:function(){
        var oldUrl = "http://down.haprjfx.cn/bjdqp/android_new.html?down_name=%E9%AB%98%E6%B8%85%E4%B8%8B%E8%BD%BD,%E7%AB%8B%E5%8D%B3%E4%B8%8B%E8%BD%BD&down_url=https://cdncfgh5.52bjd.com/pack/apk/bjdqp/bjdqp20200714_14_49_07.apk,https://cdncfgh5.52bjd.com/pack/apk/bjdqp/bjdqp20200714_14_49_07.apk";
        var url = Network.getWebUrl(oldUrl);
        SdkUtil.sdkOpenUrl(url);
    },
});
