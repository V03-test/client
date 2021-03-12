/**
 * Created by Administrator on 2020/12/8 0008.
 */

var PHZUserHandCardPop = BasePopup.extend({
    ctor:function (data,tempData) {
        this.data = data;
        this.tempData = tempData;
        this._super("res/phzUserHandCard.json");
    },

    selfRender:function () {
        this.refreshSingle(this.getWidget("user"),this.data);

        var list = this.getWidget("ListView_list");
        var voArray = [];
        if(this.tempData){
            cc.log(" this.tempData = ",JSON.stringify(this.tempData));
            this.tempData = this.tempData || [];
            var localCards = this.tempData.phzCard || [];
            for(var i=0;i < localCards.length;i++) {
                if(localCards[i].huxi > 0 || (localCards[i].action != 0 && localCards[i].huxi == 0)){
                    var cell = new PHZUserHandCardCell(localCards[i], PHZRoomModel.wanfa);
                    list.pushBackCustomItem(cell);
                }else{
                    var cardVo = PHZAI.getVoArray(localCards[i].cards);//剩余的牌
                    var result = PHZAI.sortHandsVo(cardVo);
                    for(var j=0;j<result.length;j++){
                        var cell = new onCell(result[j],true);
                        list.pushBackCustomItem(cell);
                    }
                }
            }
        }else if(this.data.firstCards){
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

var PHZUserHandCardCell = ccui.Widget.extend({
    ctor:function(data,wanfa){
        this._super();
        var action = data.action;
        var cards = data.cards || [];
        var huxi = data.huxi || "";
        this.anchorX=0;
        this.anchorY=0;
        this.scale = 0.8;
        this.setContentSize(50,300);

        if(action!=0){

            var imgName = "";
            var resStr = "res/res_phz/phzNewSmallResult/";

            if(wanfa == GameTypeEunmZP.NXGHZ || wanfa == GameTypeEunmZP.YYWHZ){
                if(cards.length >2){
                    if(action == 3)imgName = "act3_1.png";
                    if(action == 5)imgName = "act2.png";
                    if(action == 6)imgName = "act6.png";
                    if(action == 14)imgName = "act8.png";
                }
            }else if(wanfa == GameTypeEunmZP.YJGHZ){
                if(cards.length >2){
                    if(action == 1 || action == 11)imgName = "phz_act_1.png";
                    if(action == 2)imgName = "phz_act_2.png";
                    if(action == 3)imgName = "phz_act_3.png";
                    if(action == 5)imgName = "phz_act_5.png";
                    if(action == 6)imgName = "phz_act_6.png";
                }

               resStr = "res/res_phz/yjghz/ghzTypeImg/";
            }else{
                if(action==10)
                    action=3;
                imgName = "act"+action+".png";
            }
            if(imgName != ""){
                var header = new cc.Sprite(resStr+imgName);
                header.x = 42;
                header.y = 300;
                this.addChild(header);
            }
        }
        var zorder = cards.length;
        for(var i=0;i<cards.length;i++){
            zorder--;
            var vo = PHZAI.getPHZDef(cards[i]);
            if(action==4 && i>0 && wanfa != GameTypeEunmZP.WHZ)
                vo.a = 1;
            if(action==3 && i>0)
                vo.a = 1;

            var ishu = false;
            if(cards[i]==ClosingInfoModel.huCard){
                ishu = true;
            }

            if((wanfa == GameTypeEunmZP.LDS || wanfa == GameTypeEunmZP.YZCHZ||wanfa == GameTypeEunmZP.JHSWZ) && (action == 4 || action == 3)){
                vo.a = 0;
            }

            vo.ishu = ishu;
            if (vo.ishu){
                cc.log("vo===",wanfa,cards[i],ClosingInfoModel.huCard,JSON.stringify(vo))
            }
            var card = new PHZCard(PHZAI.getDisplayVo(this.direct,3),vo);
            card.x = 6;
            card.y = i * 48*1.2;
            //card.scale = 0.8;
            this.addChild(card,zorder);
        }
        var label = UICtor.cLabel(huxi+"",42,cc.size(90,42),cc.color(209,102,72),1,1);
        label.x = 42;
        label.y = -20;
        this.addChild(label);
    }
});