/**
 * Created by cyp on 2020/1/10.
 */
var PyqSetHuChiLayer = cc.Layer.extend({
    ctor:function(){
        this._super();

        this.curPage = 1;

        SyEventManager.addEventListener("Change_HuChi_Set",this,this.refreshHuChiData);

        this.initLayer();
    },

    initLayer:function(){
        var gray = new cc.LayerColor(cc.color.BLACK);
        gray.setOpacity(120);
        this.addChild(gray);

        var bg = new cc.Sprite("res/res_ui/qyq/tiren/bg.png");
        bg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(bg);

        var img = "res/res_ui/qyq/common/commonButton/closeBtn.png";
        var btn_close = new ccui.Button(img,img);
        btn_close.setPosition(bg.width - 75,bg.height - 75);
        btn_close.addTouchEventListener(this.onClickBtn,this);
        bg.addChild(btn_close);

        var title = new cc.Sprite("res/res_ui/qyq/huchimingdan/title_hcmd.png");
        title.setPosition(bg.width/2,bg.height - 70);
        bg.addChild(title);

        var img = "res/res_ui/qyq/huchimingdan/addBind.png";
        var btn_add = new ccui.Button(img,img);
        btn_add.setPosition(bg.width - 170,105);
        btn_add.addTouchEventListener(this.onClickBtn,this);
        bg.addChild(btn_add);

        var img = "res/res_ui/qyq/huchimingdan/huchichi.png";
        var btn_mutex = this.btn_mutex = new ccui.Button(img,img);
        btn_mutex.setPosition(bg.width - 350,105);
        btn_mutex.addTouchEventListener(this.onClickBtn,this);
        bg.addChild(btn_mutex);
        btn_mutex.visible = ClickClubModel.isClubCreater();

        var bg2 = new cc.Scale9Sprite("res/res_ui/qyq/common/commonKuang/xinxiTiao.png");
        //bg2.setContentSize(935,354);
        bg2.setContentSize(1043,400);
        bg2.setPosition(bg.width/2 - 15,bg.height/2 - 10);
        bg.addChild(bg2);

        var tipLabel = UICtor.cLabel("互相绑定两个玩家不能同桌游戏,请谨慎操作",36);
        tipLabel.setPosition(bg.width/2,bg.height - 140);
        tipLabel.setColor(cc.color("#04468f"));
        bg.addChild(tipLabel);

        this.btn_close = btn_close;
        this.btn_add = btn_add;

        this.itemScroll = new ccui.ScrollView();
        this.itemScroll.setContentSize(bg2.width,bg2.height - 10);
        this.itemScroll.setPosition(0,5);
        bg2.addChild(this.itemScroll);

        var pageBg = new cc.Scale9Sprite("res/res_ui/qyq/common/commonKuang/fenyeDi.png");
        pageBg.setContentSize(75,75);
        pageBg.setPosition(155,95);
        bg.addChild(pageBg);

        this.pageNum = UICtor.cLabel("1",40);
        this.pageNum.setPosition(pageBg.width/2,pageBg.height/2);
        pageBg.addChild(this.pageNum);

        img = "res/res_ui/qyq/common/commonButton/btnLeft.png";
        this.btn_left = new ccui.Button(img,img);
        this.btn_left.setPosition(pageBg.width/2 - 80,pageBg.height/2);
        this.btn_left.addTouchEventListener(this.onClickBtn,this);
        pageBg.addChild(this.btn_left);

        img = "res/res_ui/qyq/common/commonButton/btnRight.png";
        this.btn_right = new ccui.Button(img,img);
        this.btn_right.setPosition(pageBg.width/2 + 80,pageBg.height/2);
        this.btn_right.addTouchEventListener(this.onClickBtn,this);
        pageBg.addChild(this.btn_right);

        var inputBg = new cc.Scale9Sprite("res/res_ui/qyq/common/commonKuang/inputBg.png",null,cc.rect(30,30,400,30));
        inputBg.setContentSize(320,70);
        inputBg.setPosition(bg.width/2 - 90,105);
        bg.addChild(inputBg);

        img = "res/res_ui/qyq/huchimingdan/chazhao.png";
        this.btn_check = new ccui.Button(img,img);
        this.btn_check.setPosition(inputBg.width - this.btn_check.width/2,inputBg.height/2);
        this.btn_check.addTouchEventListener(this.onClickBtn,this);
        inputBg.addChild(this.btn_check);

        this.inputBox = new cc.EditBox(cc.size(inputBg.width - 165, inputBg.height - 15),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputBox.x = inputBg.width/2 - 75;
        this.inputBox.y = inputBg.height/2;
        this.inputBox.setPlaceholderFont("",34);
        this.inputBox.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this.inputBox.setPlaceHolder("输入ID查找");
        this.inputBox.setPlaceholderFontColor(cc.color("#2155b5"));
        inputBg.addChild(this.inputBox,1);
        this.inputBox.setFont("",34);

        this.getHuChiData(1);

        //用这个判断点击隐藏俱乐部列表界面和显示所有包厢界面
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(){return true},
        }),gray);
    },

    refreshHuChiData:function(){
        this.getHuChiData(1);
    },

    getHuChiData:function(page,userId){
        var params = {
            groupId:ClickClubModel.getCurClubId(),
            pageNo:page || 1,
            pageSize:10,
            userId:PlayerModel.userId,
            sessCode:PlayerModel.sessCode,
            targetUserId:userId || 0
        }
        var self = this;
        NetworkJT.loginReqNew(418,params , function (data) {
            if (data) {
                cc.log("data===",JSON.stringify(data))
                if(data.message.dataList && data.message.dataList.length > 0){
                    self.showHuChiItem(data.message.dataList);

                    self.curPage = page;
                    self.pageNum.setString(page);

                }else{
                    if(userId){
                        FloatLabelUtil.comText("未找到该ID的互斥名单");
                    } else if(page > 1){
                        FloatLabelUtil.comText("没有更多数据了");
                    }else{
                        self.showHuChiItem([]);
                    }
                }
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });

    },

    showHuChiItem:function(data){
        this.itemScroll.removeAllChildren();

        var itemH = 165;
        var num = data.length;
        var contentH = Math.max(this.itemScroll.height,itemH*num);
        this.itemScroll.setInnerContainerSize(cc.size(this.itemScroll.width,contentH));

        for(var i = 0;i<num;++i){
            var item = new HuChiItem(data[i]);
            item.setPosition(this.itemScroll.width/2 - 105,contentH - (i+0.5)*itemH);
            this.itemScroll.addChild(item);
        }
    },

    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            if(sender == this.btn_close){
                PopupManager.remove(this);
            }else if(sender == this.btn_add){
                this.addChild(new AddUserBindLayer(),10);
            }else if(sender == this.btn_left){
                if(this.curPage > 1){
                    this.getHuChiData(this.curPage - 1);
                }
            }else if(sender == this.btn_right){
                this.getHuChiData(this.curPage + 1);
            }else if(sender == this.btn_check){
                this.getHuChiData(1,this.inputBox.getString());
            }else if(sender == this.btn_mutex){
                this.onMutexPop();
            }
        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    onMutexPop:function(){
        var mc = new PyqMutexPop();
        PopupManager.addPopup(mc);
    },

    onClose : function(){
    },
    onOpen : function(){
    },
    onDealClose:function(){
    },
});

var HuChiUser = cc.Node.extend({
    ctor:function(){
        this._super();

        this.initNode();
        this.cleanUser();
    },

    initNode:function(){
        var bg = new cc.Sprite("res/res_ui/qyq/inputPop/userDataBg.png");
        this.addChild(bg);

        var headSpr = new cc.Sprite("res/res_ui/qyq/opt/img_cy7.png");
        headSpr.setPosition(65,bg.height/2);
        bg.addChild(headSpr);

        var name = new UICtor.cLabel("玩家的名字",25);
        name.setPosition(130,bg.height/2 + 15);
        name.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        name.setTextVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_TOP);
        name.setTextAreaSize(cc.size(225,45));
        name.setAnchorPoint(0,0.5);
        name.setColor(cc.color("#90371f"));
        bg.addChild(name);

        var idLabel = new UICtor.cLabel("ID:1234567",25);
        idLabel.setPosition(name.x,bg.height/2 - 15);
        idLabel.setAnchorPoint(0,0.5);
        idLabel.setColor(cc.color("#ce3d17"));
        bg.addChild(idLabel);

        this.img1 = "res/res_ui/qyq/common/commonButton/checkBox1.png";
        this.img2 = "res/res_ui/qyq/common/commonButton/checkBox2.png";
        var chooseBtn = new UICtor.cBtn(this.img2);
        chooseBtn.setPosition(200,0);
        chooseBtn.isChoose = false;
        UITools.addClickEvent(chooseBtn,this,this.onClickChoose);
        this.addChild(chooseBtn);
        chooseBtn.visible = false;


        this.headSpr = headSpr;
        this.nameLabel = name;
        this.idLabel = idLabel;
        this.chooseBtn = chooseBtn;
    },

    onClickChoose:function(obj){
        obj.isChoose = !obj.isChoose;
        obj.loadTextureNormal(obj.isChoose ? this.img1 : this.img2);
    },

    setUserData:function(data,isShow){
        this.userData = data;
        this.nameLabel.setString(data.userName);
        this.idLabel.setString("ID:" + data.userId);
        this.headSpr.setVisible(true);
        this.showIcon(this.headSpr,data.headimgurl);
        if (isShow){
            this.chooseBtn.visible = true;
        }
    },

    cleanUser:function(){
        this.userData = null;
        this.headSpr.setVisible(false);
        this.nameLabel.setString("");
        this.idLabel.setString("");
    },

    showIcon: function (spr,iconUrl, sex) {
        //iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var sex = sex || 1;
        var defaultimg = (sex == 1) ? "res/ui/common/default_m.png" : "res/ui/common/default_m.png";
        if (iconUrl) {
            cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
                if (!error) {
                    spr.setTexture(img);
                    spr.setScale(120/spr.width);
                }
            });
        }else{
            spr.initWithFile(defaultimg);
        }
    },
});

var HuChiItem = cc.Node.extend({
    ctor:function(itemData){
        this._super();

        this.itemData = itemData;

        this.initNode();
        this.setItemWithData();
    },

    initNode:function(){
        var liantiao = new cc.Sprite("res/res_ui/qyq/huchimingdan/suo.png");
        this.addChild(liantiao);

        var user1 = new HuChiUser();
        user1.setPosition(-220,0);
        this.addChild(user1);

        var user2 = new HuChiUser();
        user2.setPosition(220,0);
        this.addChild(user2);

        var img = "res/res_ui/qyq/huchimingdan/jiesuo.png"
        this.btn_jb = new ccui.Button(img,img);
        this.btn_jb.setPosition(500,0);
        this.btn_jb.addTouchEventListener(this.onClickBtn,this);
        this.addChild(this.btn_jb);

        this.user1 = user1;
        this.user2 = user2;
    },

    setItemWithData:function() {
        if (!this.itemData)return;
        var data1 = {};
        var data2 = {};

        data1.userName = this.itemData.userName1;
        data1.userId = this.itemData.userId1;
        data1.headimgurl = this.itemData.headimgurl1;

        data2.userName = this.itemData.userName2;
        data2.userId = this.itemData.userId2;
        data2.headimgurl = this.itemData.headimgurl2;

        this.user1.setUserData(data1);
        this.user2.setUserData(data2);

    },

    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            if(sender == this.btn_jb){
                this.unbindUser();
            }

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    unbindUser:function(){
        if(!this.itemData)return;

        var params = {
            groupId:ClickClubModel.getCurClubId(),
            optType:2,
            userId:PlayerModel.userId,
            sessCode:PlayerModel.sessCode,
            keyId:this.itemData.keyId,
        }

        var self = this;
        NetworkJT.loginReqNew(436,params , function (data) {
            if (data) {
                FloatLabelUtil.comText(data.message);
                SyEventManager.dispatchEvent("Change_HuChi_Set");
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },
});

var AddUserBindLayer = cc.Layer.extend({
    ctor:function(){
        this._super();

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch,event){
                return true;
            }.bind(this),
            onTouchEnded:function(touch,event){
                var rect = cc.rect(0,0,this.layerBg.width,this.layerBg.height);
                var pos = this.layerBg.convertTouchToNodeSpace(touch);
                if(!cc.rectContainsPoint(rect,pos)){
                    this.removeFromParent(true);
                    return true;
                }
            }.bind(this)
        }),this);

        this.initLayer();

    },

    initLayer:function(){
        var gray = new cc.LayerColor(cc.color.BLACK);
        gray.setOpacity(120);
        this.addChild(gray);

        var bg = new cc.Scale9Sprite("res/res_ui/qyq/common/commonKuang/xiaoxiDi.png");
        bg.setContentSize(1125,525);
        bg.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        this.addChild(bg);

        this.layerBg = bg;

        var img = "res/res_ui/qyq/huchimingdan/qingchu.png";
        this.btn_clear = new ccui.Button(img,img);
        this.btn_clear.setPosition(150,bg.height - 75);
        this.btn_clear.addTouchEventListener(this.onClickBtn,this);
        bg.addChild(this.btn_clear);

        var inputBg = new cc.Scale9Sprite("res/res_ui/qyq/common/commonKuang/inputBg.png",null,cc.rect(30,30,400,30));
        inputBg.setContentSize(450,70);
        inputBg.setPosition(bg.width - 270,bg.height - 75);
        bg.addChild(inputBg);

        img = "res/res_ui/qyq/huchimingdan/chazhao.png";
        this.btn_check = new ccui.Button(img,img);
        this.btn_check.setPosition(inputBg.width - this.btn_check.width/2,inputBg.height/2 - 3);
        this.btn_check.addTouchEventListener(this.onClickBtn,this);
        inputBg.addChild(this.btn_check);

        this.inputBox = new cc.EditBox(cc.size(inputBg.width - 165, inputBg.height - 15),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputBox.x = inputBg.width/2 - 75;
        this.inputBox.y = inputBg.height/2;
        this.inputBox.setPlaceholderFont("",34);
        this.inputBox.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this.inputBox.setPlaceHolder("请输入玩家ID");
        this.inputBox.setPlaceholderFontColor(cc.color("#fff8ed"));
        inputBg.addChild(this.inputBox,1);
        this.inputBox.setFont("",34);

        var line = new cc.Scale9Sprite("res/res_ui/qyq/shezhi/geduan.png");
        line.setContentSize(line.width,line.height + 200);
        line.setPosition(bg.width/2,bg.height - 180);
        line.setRotation(90);
        bg.addChild(line);

        var user1 = new HuChiUser();
        user1.setPosition(240,bg.height/2 - 30);
        bg.addChild(user1);

        var user2 = new HuChiUser();
        user2.setPosition(645,user1.y);
        bg.addChild(user2);

        this.user1 = user1;
        this.user2 = user2;

        var img = "res/res_ui/qyq/huchimingdan/Bind.png";
        this.btn_bind = new ccui.Button(img,img);
        this.btn_bind.setPosition(bg.width - 150,user1.y);
        this.btn_bind.addTouchEventListener(this.onClickBtn,this);
        bg.addChild(this.btn_bind);

        var tipLabel = new UICtor.cLabel("请先添加玩家ID再进行绑定",30);
        tipLabel.setPosition(bg.width/2,60);
        tipLabel.setColor(cc.color("#04468f"));
        bg.addChild(tipLabel);
    },

    onClickBtn:function(sender,type){
        if(type == ccui.Widget.TOUCH_BEGAN){
            sender.setColor(cc.color.GRAY);
        }else if(type == ccui.Widget.TOUCH_ENDED){
            sender.setColor(cc.color.WHITE);

            if(sender == this.btn_clear){
                this.user1.cleanUser();
                this.user2.cleanUser();
            }else if(sender == this.btn_bind){
                this.bindUser();
            }else if(sender == this.btn_check){
                this.searchMember();
            }

        }else if(type == ccui.Widget.TOUCH_CANCELED){
            sender.setColor(cc.color.WHITE);
        }
    },

    searchMember:function(){
        cc.log("============searchMember===========");

        var searchId = this.inputBox.getString();
        if(!searchId)return;

        var params = {
            groupId:ClickClubModel.getCurClubId(),
            optType:2,
            keyWord:searchId,
            userId:PlayerModel.userId,
            sessCode:PlayerModel.sessCode
        }

        var self = this;
        NetworkJT.loginReqNew(417,params , function (data) {
            if (data) {

                if(data.message.list.length > 0){
                    var user = data.message.list[0];
                    if(!self.user1.userData){
                        self.user1.setUserData(user);
                    }else if(self.user1.userData.userId != user.userId){
                        self.user2.setUserData(user);
                    }
                }else{
                    FloatLabelUtil.comText("未找到该ID的玩家");
                }
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },

    bindUser:function(){
        var userId1 = null;
        var userId2 = null;

        if(this.user1.userData && this.user2.userData){
            userId1 = this.user1.userData.userId;
            userId2 = this.user2.userData.userId;
        }else{
            return;
        }

        var params = {
            groupId:ClickClubModel.getCurClubId(),
            optType:1,
            userId:PlayerModel.userId,
            sessCode:PlayerModel.sessCode,
            targetUserId1:userId1,
            targetUserId2:userId2
        }

        var self = this;
        NetworkJT.loginReqNew(436,params , function (data) {
            if (data) {
                FloatLabelUtil.comText(data.message);
                SyEventManager.dispatchEvent("Change_HuChi_Set");
                self.user1.cleanUser();
                self.user2.cleanUser();
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },
});
