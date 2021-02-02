/**
 * Created by mayn on 2019/5/8.
 */
var CreditScoreUserItem = ccui.Widget.extend({
    ctor:function(){
        this._super();
        this.setContentSize(1530, 156);

        var itemBg = new cc.Scale9Sprite("res/res_ui/qyq/common/commonKuang/xinxiTiao.png",null,cc.rect(40,30,40,30));
        itemBg.setContentSize(1530, 156);
        itemBg.setScale9Enabled(true);
        itemBg.setPosition(this.width/2,this.height/2);
        this.addChild(itemBg);

        this.imgHead = UICtor.cImg("res/ui/common/default_m.png");
        this.imgHead.setPosition(90,itemBg.height/2);
        itemBg.addChild(this.imgHead);

        this.nameLabel= UICtor.cLabel("玩家的名字长一点看看",40,cc.size(300,45),cc.color("#6f1816"),0,0);
        this.nameLabel.setAnchorPoint(0,0.5);
        this.nameLabel.setPosition(this.imgHead.x + 70,itemBg.height/2 + 27);
        itemBg.addChild(this.nameLabel);

        this.idLabel= UICtor.cLabel("12345678",40,cc.size(0,0),cc.color(186,61,51),0,0);
        this.idLabel.setAnchorPoint(0,0.5);
        this.idLabel.setPosition(this.nameLabel.x,itemBg.height/2 - 27);
        itemBg.addChild(this.idLabel);

        this.scoreLabel= UICtor.cLabel("12345678",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        this.scoreLabel.setPosition(itemBg.width/2 - 170,itemBg.height/2);
        itemBg.addChild(this.scoreLabel);

        this.upPlayerNameLabel = UICtor.cLabel("----",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        this.upPlayerNameLabel.setPosition(itemBg.width/2 + 200,itemBg.height/2+27);
        itemBg.addChild(this.upPlayerNameLabel);

        this.upPlayerIdLabel = UICtor.cLabel("----",40,cc.size(0,0),cc.color(186,61,51),0,0);
        this.upPlayerIdLabel.setPosition(itemBg.width/2 + 200,itemBg.height/2-27);
        itemBg.addChild(this.upPlayerIdLabel);

        this.detailBtn= UICtor.cBtn("res/res_ui/qyq/bisaiSet/mingxi.png");
        this.detailBtn.setPosition(itemBg.width - 150,itemBg.height/2);
        itemBg.addChild(this.detailBtn);

        UITools.addClickEvent(this.detailBtn,this,this.onClickDetailBtn);

    },

    setData:function(data){
        this.itemData = data;
        cc.log("setData",JSON.stringify(data))
        this.nameLabel.setString(data.userName);
        this.idLabel.setString("ID:" + data.userId);

        var credit = data.credit || 0;
        credit = MathUtil.toDecimal(credit/100);
        this.scoreLabel.setString(credit);
        this.showIcon(this.imgHead,data.headimgurl);

        //var upIds = "";
        //if(data.teamLeaderId){
        //    upIds+=("合伙人:" + data.teamLeaderId);
        //}
        //if(data.preUserId){
        //    if(upIds){
        //        upIds += "\n";
        //    }
        //    upIds += ("上级:" + data.preUserId);
        //}
        //if(!upIds)upIds = "----";
        this.upPlayerIdLabel.setString(data.promoterId != 0|| data.promoterId != "" ? data.promoterId:"---");

        var preName = data.preName && data.preName != ""?data.preName:"---"
        this.upPlayerNameLabel.setString(UITools.truncateLabel(preName,6));

    },

    showIcon: function (imgNode,iconUrl, sex) {
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var sex = sex || 1;
        var defaultimg = (sex == 1) ? "res/ui/common/default_m.png" : "res/ui/common/default_m.png";

        var spr = imgNode.getChildByName("icon_spr");
        if(!spr){
            spr = new cc.Sprite(defaultimg);
            spr.setName("icon_spr");
            spr.setPosition(imgNode.width/2,imgNode.height/2);
            spr.setScale(100/spr.width);
            imgNode.addChild(spr);
        }

        if (iconUrl) {

            cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
                if (!error) {
                    spr.setTexture(img);
                    spr.setScale(100/spr.width);
                }
            });
        }else{
            spr.initWithFile(defaultimg);
        }
    },

    onClickDetailBtn:function(){
        if(this.itemData){
            SyEventManager.dispatchEvent("Show_Credit_User_Detail",this.itemData);
        }
    }
});

var CreditScoreDetailItem = ccui.Widget.extend({
    ctor:function(){
        this._super();
        this.setContentSize(1580, 156);


        var itemBg = UICtor.cImg("res/ui/bjdmj/popup/pyq/tiao.png");
        itemBg.setScale9Enabled(true);
        itemBg.setContentSize(this.getContentSize());
        itemBg.setPosition(this.width/2,this.height/2);
        this.addChild(itemBg);
        this.itemBg = itemBg;

        this.scoreLabel= UICtor.cLabel("0",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        this.scoreLabel.setPosition(120,itemBg.height/2);
        itemBg.addChild(this.scoreLabel);

        this.remainScore= UICtor.cLabel("0",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        this.remainScore.setPosition(430,itemBg.height/2);
        itemBg.addChild(this.remainScore);

        this.labelType= UICtor.cLabel("增减分",40,cc.size(0,0),cc.color("#6f1816"),1,0);
        this.labelType.setPosition(800,itemBg.height/2 + 40);
        itemBg.addChild(this.labelType);

        this.labelOptName= UICtor.cLabel("玩家比较长的名字看看",40,cc.size(300,45),cc.color("#6f1816"),1,0);
        this.labelOptName.setPosition(800,itemBg.height/2);
        itemBg.addChild(this.labelOptName);

        this.labelOptId= UICtor.cLabel("(ID:12345678)",40,cc.size(0,0),cc.color("#6f1816"),1,0);
        this.labelOptId.setPosition(800,itemBg.height/2 - 40);
        itemBg.addChild(this.labelOptId);

        this.wanfaName= UICtor.cLabel("娄底放炮罚的玩法",40,cc.size(0,0),cc.color("#6f1816"),0,0);
        this.wanfaName.setPosition(itemBg.width/2 + 300,itemBg.height/2);
        itemBg.addChild(this.wanfaName);

        this.timeLabel= UICtor.cLabel("2019-05-06\n18:04",40,cc.size(0,0),cc.color("#6f1816"),1,0);
        this.timeLabel.setPosition(itemBg.width - 180,itemBg.height/2);
        itemBg.addChild(this.timeLabel);
    },

    setData:function(data){
        var score = data.credit || 0 ;
        score = MathUtil.toDecimal(score/100);
        if(score > 0)score = "+" + score;
        this.scoreLabel.setString(score);
        var curCredit = data.curCredit || 0;
        curCredit = MathUtil.toDecimal(curCredit/100);
        this.remainScore.setString(curCredit);
        this.labelType.setString(data.type == 1 ? "转移擂台分" : data.type == 2 ? "奖赏分" : data.type == 4 ? "洗牌分" :"输赢分");
        this.timeLabel.setString(this.formatTime(data.createdTime));
        this.wanfaName.setString(data.roomName || "----");

        if(data.optUserId){
            this.labelOptId.setString("(ID:" + data.optUserId + ")");
            this.labelOptName.setString(data.userName);
        }else{
            this.labelOptName.setVisible(false);
            this.labelOptId.setVisible(false);
            this.labelType.setPositionY(this.itemBg.height/2);
        }
    },

    formatTime:function(timeStr){
        var data = new Date(timeStr);
        var year = data.getFullYear();
        var month = data.getMonth() + 1;
        var day = data.getDate();

        var hour = data.getHours();
        var min = data.getMinutes();
        var sec = data.getSeconds();

        if(month < 10)month = "0" + month;
        if(day < 10)day = "0" + day;
        if(hour < 10)hour = "0" + hour;
        if(min < 10)min = "0" + min;
        if(sec < 10)sec = "0" + sec;

        var str = year + "-" + month + "-" + day + "\n" + hour + ":" + min;
        return str;
    },
});