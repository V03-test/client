var HBYJlxqPop = BasePopup.extend({

    ctor: function (keyId) {
        this.keyId = keyId;
        this._super("res/hbyJlxqPop.json");
    },

    selfRender: function () {
        this.Button_close = this.getWidget("close_btn");
        UITools.addClickEvent(this.Button_close,this,this.onClosePop);

        this.ListView_list = this.getWidget("ListView_list");

        this.Image_item = this.getWidget("Image_item");

        this.label_page = this.getWidget("label_page");//页数
        this.btn_left = this.getWidget("btn_left");//上一页
        this.btn_right = this.getWidget("btn_right");//下一页

        UITools.addClickEvent(this.btn_left,this,this.reducePage);
        UITools.addClickEvent(this.btn_right,this,this.addPage);

        this.label_tip = this.getWidget("label_tip");
        this.label_tip.setVisible(true);

        this.label_page.setString("1/1");

        this.pageIndex = 1;
        this.maxPage = 1;

        this.getListData();
    },

    addPage:function (){
        if(this.pageIndex < this.maxPage){
            ++this.pageIndex;
        }else{
            FloatLabelUtil.comText("没有更多数据了！！！")
        }
    },

    reducePage:function (){
        if(this.pageIndex > 1){
           --this.pageIndex;
        }else{
            FloatLabelUtil.comText("当前页是第一页,没有上一页了！！！")
        }
    },

    getListData:function (){
        var parma = {
            groupId:ClickClubModel.clickClubId,
            userId:PlayerModel.userId,
            keyId:this.keyId
        };
        var self = this;
        NetworkJT.loginReqNew(454,parma, function(data){
            if(data && data.code == 0){
                self.initList(JSON.parse(data.message).results);
            }
        }.bind(this),function(data){
            FloatLabelUtil.comText(data.message);
        });
    },

    initItem:function (widget,data){
        var icon = ccui.helper.seekWidgetByName(widget,"icon");//头像
        var name = ccui.helper.seekWidgetByName(widget,"name");//名字
        var id = ccui.helper.seekWidgetByName(widget,"id");//id
        var num = ccui.helper.seekWidgetByName(widget,"num");//分数
        name.setString(""+data.name);
        id.setString("ID:"+data.userid);
        num.setString(""+(data.redbagnum/100));
        this.showIcon(icon,data.headimgurl);
        widget.visible = true;
    },

    showIcon: function(icon,url) {
        //url = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        if (!url){
            return;
        }

        var defaultimg = "res/res_ui/homeLayer/head_bg.png";

        if(icon.getChildByTag(345))
            icon.removeChildByTag(345);

        var size = icon.getContentSize();
        var sprite = new cc.Sprite(defaultimg);
        var scale = 0.9;
        sprite.setScale(scale);
        sprite.x = size.width*0.5;
        sprite.y = size.height*0.5;
        icon.addChild(sprite,5,345);

        cc.loader.loadImg(url,{width: 75, height:75},function(error, texture){
            if(error==null){
                sprite.setTexture(texture);
            }
        });
    },

    initList:function (data){
        // cc.log(" 记录详情！！！ data = ",JSON.stringify(data));
        this.ListView_list.removeAllChildren();
        var localDataArr = data || [];

        this.maxPage = Math.ceil(localDataArr.length / 20);

        localDataArr = data.slice((this.pageIndex - 1)*20,(this.pageIndex)*20);

        localDataArr.sort(function (a,b){
            return parseInt(b.redbagnum) - parseInt(a.redbagnum);
        });

        this.maxPage = Math.ceil(localDataArr.length / 20);

        this.label_page.setString(this.pageIndex+"/"+this.maxPage);
        this.label_tip.setVisible(localDataArr.length == 0);

        for(var index = 0;index < localDataArr.length;++index){
            var item = this.Image_item.clone();
            this.initItem(item,localDataArr[index],index);
            this.ListView_list.pushBackCustomItem(item);
        }
    },

    onClosePop:function(){
        PopupManager.remove(this);
    },
});