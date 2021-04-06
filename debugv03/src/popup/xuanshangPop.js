/**
 * Created by Administrator on 2021/3/24 0024.
 */
var XuanshangPop = BasePopup.extend({
    ctor:function(localIndex){

        this.localIndex = localIndex || 0;
        this.localBtnArr = [];

        this._super("res/xuanshangPop.json");
    },

    selfRender:function(){
        this.localBtnArr.push(this.getWidget("CheckBox_wgxs"));
        this.localBtnArr.push(this.getWidget("CheckBox_zzsm"));

        this.Image_wgxs = this.getWidget("Image_wgxs");
        this.Image_zzsm = this.getWidget("Image_zzsm");

        for(var i = 0;i < this.localBtnArr.length;++i){
            this.localBtnArr[i].temp = i;
            UITools.addClickEvent(this.localBtnArr[i],this,this.onClickItem);
        }

        this.setItemSelect();
    },

    onClickItem:function(btn){
        var temp = btn.temp;
        if(temp != this.localIndex){
            this.localIndex = temp;
            this.setItemSelect();
        }
    },

    setItemSelect:function(){
        for(var i = 0;i < this.localBtnArr.length;++i){
            this.localBtnArr[i].setBright(i == this.localIndex);
        }
        this.Image_wgxs.visible = this.localIndex == 0;
        this.Image_zzsm.visible = this.localIndex == 1;
    }
});
