/**
 * Created by Administrator on 2020/12/8 0008.
 */

var PHZUserHandCardPop = BasePopup.extend({
    ctor:function (data) {
        this.data = data;
        this._super("res/phzUserHandCard.json");
    },

    selfRender:function () {
        this.refreshSingle(this.getWidget("user"),this.data);

        var list = this.getWidget("ListView_list");
        var voArray = [];
        if(this.data.firstCards){
            for(var i=0;i<this.data.firstCards.length;i++){
                voArray.push(PHZAI.getPHZDef(this.data.firstCards[i]));
            }
            var vo = PHZAI.sortHandsVo(voArray);
            for(var i=0;i<vo.length;i++){
                var cell = new onCell(vo[i]);
                list.pushBackCustomItem(cell);
            }
        }
    },

    refreshSingle:function(widget,user,index){
        //var defaultimg = (user.sex==1) ? "res/ui/images/default_m.png" : "res/ui/images/default_w.png";
        // user.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";

        var defaultimg = "res/res_gameCom/default_m.png";
        var icon = ccui.helper.seekWidgetByName(widget,"icon");
        var sprite = new cc.Sprite(defaultimg);
        sprite.x = icon.width / 2;
        sprite.y = icon.height / 2;
        icon.addChild(sprite,5,345);
        if(user.icon){
            cc.loader.loadImg(user.icon, {width: 75, height: 75}, function (error, img) {
                if (!error) {
                    sprite.setTexture(img);
                }
            });
        }

        ccui.helper.seekWidgetByName(widget,"name").setString(user.name);
        ccui.helper.seekWidgetByName(widget , "uid").setString("UID:" + user.userId);
    }
});