/**
 * Created by cyp on 2019/3/16.
 */

//缓存用户头像数据
sy.HeadImgCfg = sy.HeadImgCfg || {};


var PyqHall = BasePopup.extend({
    tableArr:null,
    moreClubHide:true,
    maxRoomItem:16,
    isHideStartTable:false,//是否隐藏开始桌
    tablesData:null,
    isNeedCheckMoreTableData:true,
    show_version:true,
    ctor:function(clubData){

        this.clubDataList = clubData;

        this.dataHandler = new PyqDataHandler();
        this.tableIdCfg = {};
        this.unUseItemArr = [];

        this.allBagsData = [];
        this.tablesPageData = [];
        this.gameType = 1;
        this.filterFlag = 0;
        this.filtModeId = 0;
        this.updateRoomDelay = 0;
        this.curShowPage = 1;
        this.curShowBagPage = 1;
        this.curShowPageLayer = 1;
        this.clickBtnType = 0

        this.isGetTableData = false;

        this.lockTipCig = {};
        this.groupLevelData = [];

        var json = "res/pyqHall.json"
        if(this.checkSwitchCoin() == 1){
            json = "res/pyqHallNew.json"
        }

        this.needImgIdArr = [];
        this.userIdCfgData = {};
        this.zhuoBuCfgData = {};

        this._super(json);

    },

    checkSwitchCoin:function(){
        var switchCoin = 0;
        if(this.clubDataList){
            var lastGroupId = cc.sys.localStorage.getItem("sy_lastClick_groupId");
            var showIdx = 0;
            for(var i = 0;i<this.clubDataList.length;++i){
                if(this.clubDataList[i].groupId == lastGroupId){
                    showIdx = i;
                    break;
                }
            }
            if(this.clubDataList[showIdx].gLevelMsg){
                cc.sys.localStorage.setItem("sy_club_switchCoin",this.clubDataList[showIdx].gLevelMsg.switchCoin);
                if(this.clubDataList[showIdx].gLevelMsg.switchCoin == 1){
                    switchCoin = 1;
                }
            }
        }else{
            switchCoin = cc.sys.localStorage.getItem("sy_club_switchCoin");
        }
        return switchCoin;
    },

    setBackBtnType:function(type){
        var resFile = "res/res_ui/qyq/common/commonButton/cm_BtnClose.png";
        if(type == 2){
            resFile = "res/res_ui/qyq/hall/back_room.png";
        }
        var closeBtn = this.getWidget("close_btn");
        closeBtn.loadTextureNormal(resFile);
    },

    nodeTouchBegan:function(touch,event){

        this.touchBeginPos = touch.getLocation();

        return true;
    },

    nodeTouchEnded:function(touch,event){

        var endPos = touch.getLocation();

        if(endPos.y != this.touchBeginPos.y){
            //this.pageTurnVer(endPos.y - this.touchBeginPos.y);
        }

        if(endPos.x != this.touchBeginPos.x){
            this.pageTurn(endPos.x - this.touchBeginPos.x);
            //this.pageTurnBagScroll(endPos.x - this.touchBeginPos.x);
        }
    },

    //翻页
    pageTurn:function(offsetPos){
        var contentSize = this.tableScroll.getInnerContainerSize();
        var allPage = Math.ceil(contentSize.width/this.tableScroll.width);
        var tempW = 150;

        if(this.curShowPageLayer == 1){
            if(allPage <= 1){
                if(offsetPos < -tempW && this.isNeedCheckMoreTableData){
                    this.getMoreTableData();
                }
                return;
            }

            if(offsetPos > tempW && this.curShowPage > 1){
                this.curShowPage--;
            }else if(offsetPos < -tempW && this.curShowPage < allPage){
                this.curShowPage++;

                if(allPage == this.curShowPage && this.isNeedCheckMoreTableData){
                    setTimeout(function(){
                        this.getMoreTableData();
                    }.bind(this),400);

                }
            }
        }
        if(allPage <= 1)return;

        var percent = (this.curShowPage - 1)/(allPage-1)*100;
        this.tableScroll.scrollToPercentHorizontal(percent,0.4,false);

    },

    pageTurnBagScroll:function(offsetPos){
        var contentSize = this.bagScroll.getInnerContainerSize();
        var allPage = Math.ceil(contentSize.width/this.bagScroll.width);
        var tempW = 150;

        if(this.curShowPageLayer == 2){
            if(offsetPos > tempW && this.curShowBagPage > 1){
                this.curShowBagPage--;
            }else if(offsetPos < -tempW && this.curShowBagPage < allPage){
                this.curShowBagPage++;
            }
        }
        if(allPage <= 1)return;

        var percent = (this.curShowBagPage - 1)/(allPage-1)*100;
        this.bagScroll.scrollToPercentHorizontal(percent,0.4,false);
    },

    //上下翻页
    pageTurnVer:function(offsetPos){
        var tempH = 80;
        if(this.curShowPageLayer == 1 && offsetPos > tempH && this.isHaveValidBag){
            this.curShowPageLayer = 2;
        }else if(this.curShowPageLayer == 2 && offsetPos < -tempH){
            this.curShowPageLayer = 1;
        }
        var percent = (this.curShowPageLayer == 1?0:100);
        this.room_bag_scroll.scrollToPercentVertical(percent,0.3,false);
    },

    showLXClick:function(){/***显示类型**/
        var isBool = this.Image_selectType.visible;
        this.Image_selectType.visible = !isBool;
        isBool = this.Image_selectType.visible;
        if(isBool){
            //this.showWanfaName(this.allBagsData);
            this.showWanfaList();
        }
    },

    saveLXClick:function(){/***保存类型**/
        if(!this.isShowLX){
            this.filtModeId = 0;
            this.updateRoomsData();
            this.setLXSelectPng(true);
            //this.scheduleOnce(function(){
            //    this.showLXClick();
                this.Image_selectType.visible = true;
                //this.showWanfaName(this.allBagsData);
            //}.bind(this),0.1)
        }
        if(this.localWanfaID == 0){
            this.updateTableList(this.tablesData);
        }else{
            this.lxArrObject = this.lxArrObject || {};
            var arr = this.lxArrObject[this.localWanfaID] || [];
            this.updateTableList(arr);
        }
        this.isShowLX = true;
    },

    setLXSelectPng:function(isBool){
        if(isBool){
            this.Button_showLX.loadTextureNormal("res/res_ui/qyq/hall/selectType/2.png");
            this.Button_showLX.loadTexturePressed("res/res_ui/qyq/hall/selectType/2.png");
            this.btn_show_all_table.loadTextureNormal("res/res_ui/qyq/hall/selectType/22.png");
            this.btn_show_all_table.loadTexturePressed("res/res_ui/qyq/hall/selectType/22.png");
        }else{
            this.Button_showLX.loadTextureNormal("res/res_ui/qyq/hall/selectType/1.png");
            this.Button_showLX.loadTexturePressed("res/res_ui/qyq/hall/selectType/1.png");
            this.btn_show_all_table.loadTextureNormal("res/res_ui/qyq/hall/selectType/11.png");
            this.btn_show_all_table.loadTexturePressed("res/res_ui/qyq/hall/selectType/11.png");
        }
    },

    saveWFClick:function(){
        this.Image_selectType.visible = false;
        if(this.isShowLX){
            this.setLXSelectPng(false);
            this.updateTableList(this.tablesData);
        }
        this.isShowLX = false;
    },

    wfItemClick:function(btn){
        if(this.lastLXBtn == btn){
            return;
        }
        this.localWanfaID = btn.temp;
        btn.opacity = 255;

        var widget = btn.parent;
        if(widget){
            ccui.helper.seekWidgetByName(widget,"Label_name").color = cc.color(84,27,1);
        }

        if(this.lastLXBtn){
            this.lastLXBtn.opacity = 0;
            widget = this.lastLXBtn.parent;
            if(widget){
                ccui.helper.seekWidgetByName(widget,"Label_name").color = cc.color(255,255,255);
            }
        }

        this.lastLXBtn = btn;

        //cc.sys.localStorage.setItem("Button_selectLX_localWanfaID",this.localWanfaID);

        if(this.isShowLX){
            this.saveLXClick();
        }
    },

    showWanfaName:function(localData){
        var localData = localData || [];
        var nameArr = [];

        for(var i = 0;i < localData.length;++i) {
            if (localData[i]) {
                var itemData = localData[i].config;
                if(localData[i].groupState != 1){
                    continue;
                }
                var msg = itemData.modeMsg.split(",");
                var localType = msg[1];
                if(ClubRecallDetailModel.isPDKWanfa(localType)){
                    localType = 15;
                }else if(ClubRecallDetailModel.isDTZWanfa(localType)){
                    localType = 113;
                }

                var localName = ClubRecallDetailModel.getGameStr(localType);
                var tempData = {};
                tempData[localType] = localName;

                //if(nameArr.indexOf(tempData) == -1){
                //    nameArr.push(tempData);
                //}
                if(!this.checkSame(nameArr,tempData)){
                    nameArr.push(tempData);
                }
            }
        }

        if(this.nameArr && JSON.stringify(this.nameArr) == JSON.stringify(nameArr)){
            //cc.log(" 相同的nameStr 不刷新！！！ ");
        }else{
            this.nameArr = nameArr;
            this.initListView_list(nameArr);
        }
    },

    checkSame:function(arr,temp){
        arr = arr || [];
        var isHas = false;
        for(var i = 0;i < arr.length;++i){
           if(arr[i] && temp && JSON.stringify(temp) == JSON.stringify(arr[i])){
               isHas = true;
               break;
           }
        }
        return isHas;
    },

    showWanfaList:function(){
        var localData = this.tablesData || [];
        var lxArrObject = {};

        for(var i = 0;i < localData.length;++i){
            var itemData = localData[i];
            if(itemData){
                var localType = itemData.playType;
                if(ClubRecallDetailModel.isPDKWanfa(localType)){
                    localType = 15;
                }else if(ClubRecallDetailModel.isDTZWanfa(localType)){
                    localType = 113;
                }

                if(!lxArrObject[localType]){
                    lxArrObject[localType] = [];
                    lxArrObject[localType].push(itemData);
                }else{
                    lxArrObject[localType].push(itemData);
                }
            }
        }
        this.lxArrObject = lxArrObject;
    },

    initListView_list:function(nameArr){
        this.ListView_list.removeAllChildren();
        nameArr = nameArr || [];

        nameArr.unshift({0:"全部"});

        var itemNode = this.Image_itemLX;

        for(var index = 0;index < nameArr.length;++index){
            var item = itemNode.clone();
            var objIndex = Object.keys(nameArr[index])[0];
            this.initItemData(item,nameArr[index][objIndex],objIndex,i < nameArr.length - 1);
            this.ListView_list.pushBackCustomItem(item);
            item.visible = true;
        }
    },

    initItemData:function(widget,name,index,notShow){
        var clickNode = ccui.helper.seekWidgetByName(widget,"Button_click");
        clickNode.temp = index;
        UITools.addClickEvent(clickNode,this,this.wfItemClick);

        var Label_name = ccui.helper.seekWidgetByName(widget,"Label_name");
        Label_name.setString(""+name);

        var Image_jg = ccui.helper.seekWidgetByName(widget,"Image_jg");
        Image_jg.visible = !!notShow;

        clickNode.opacity = index == this.localWanfaID ? 255 : 0;
        Label_name.color = index == this.localWanfaID ? cc.color(84,27,1) : cc.color(255,255,255);

        if(this.localWanfaID == index){
            this.lastLXBtn = clickNode;
        }
    },

    selfRender:function(){
        /** 新增玩法类型 **/
        this.Image_selectType = this.getWidget("Image_selectType");
        this.Image_selectType.visible = false;

        this.ListView_list = ccui.helper.seekWidgetByName(this.Image_selectType,"ListView_list");
        this.Image_itemLX = ccui.helper.seekWidgetByName(this.Image_selectType,"Image_item");

        var localWanfaID = 0;//cc.sys.localStorage.getItem("Button_selectLX_localWanfaID") || 0;
        this.localWanfaID = parseInt(localWanfaID);//0表示所有，玩法id
        this.isShowLX = false;

        this.Button_selectLX = this.getWidget("Button_selectLX");
        UITools.addClickEvent(this.Button_selectLX,this,this.saveLXClick);

        this.Button_showLX = this.getWidget("Button_showLX");
        UITools.addClickEvent(this.Button_showLX,this,this.showLXClick);

        var btn_show_all_table = this.getWidget("btn_show_all_table");
        var tempWFClick = ccui.helper.seekWidgetByName(btn_show_all_table,"Button_selectWf");
        UITools.addClickEvent(tempWFClick,this,this.saveWFClick);



        this.tableScroll = this.getWidget("table_scroll");
        this.tableScroll.setClippingType(ccui.Layout.CLIPPING_SCISSOR);
        //this.tableScroll.setInertiaScrollEnabled(false);
        this.tableScroll.setBounceEnabled(false);

        this.room_bag_scroll = this.getWidget("room_bag_scroll");
        this.bagScroll = this.getWidget("bag_scroll");
        this.bagScroll.setInertiaScrollEnabled(false);

        var node = new cc.Node();
        this.addChild(node,10);
        ////通过这种方式解决新版本引擎下上拉获取多页数据的问题
        //cc.eventManager.addListener(cc.EventListener.create({
        //    event: cc.EventListener.TOUCH_ONE_BY_ONE,
        //    swallowTouches: false,
        //    onTouchBegan: this.nodeTouchBegan.bind(this),
        //    onTouchEnded: this.nodeTouchEnded.bind(this)
        //}), node);

        //用这个判断点击隐藏俱乐部列表界面和显示所有包厢界面
        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(touch,event){
                var rect = cc.rect(0,0,this.panel_show_all_bag.width,this.panel_show_all_bag.height);
                var pos = this.panel_show_all_bag.convertTouchToNodeSpace(touch);
                if(this.panel_show_all_bag.isVisible() && !cc.rectContainsPoint(rect,pos)){
                    this.panel_show_all_bag.setVisible(false);
                    return true;
                }
                //rect = cc.rect(0,0,this.panel_more.width,this.panel_more.height);
                //pos = this.panel_more.convertTouchToNodeSpace(touch);
                //if(!this.moreClubHide && !cc.rectContainsPoint(rect,pos)){
                //    this.onClickMoreClub();
                //    return true;
                //}
                return false;
            }.bind(this)
        }),node);

        this.tableItem = this.getWidget("item_table");
        var btn_table = this.tableItem.getChildByName("btn_table");
        btn_table.setVisible(true);
        UITools.addClickEvent(btn_table,this,this.onClickTable);
        this.tableItem.setVisible(false);

        var label_table_name = ccui.helper.seekWidgetByName(this.tableItem,"table_name");
        label_table_name.setFontName("res/font/bjdmj/fzcy.TTF");
        label_table_name.enableOutline(cc.color.BLUE,1);

        var label_tip_info = ccui.helper.seekWidgetByName(this.tableItem,"table_tip_info");
        label_tip_info.setFontName("res/font/bjdmj/fzcy.TTF");
        label_tip_info.enableOutline(cc.color.BLUE,1);

        var label_rule_num = ccui.helper.seekWidgetByName(this.tableItem,"item_rule_num");
        label_rule_num.setFontName("Arial");

        var xq_btn = this.tableItem.getChildByName("btn_xq");
        UITools.addClickEvent(xq_btn,this,this.onClickTableXq);


        this.itemCreateNew = this.getWidget("item_createNew");
        UITools.addClickEvent(this.itemCreateNew.getChildByName("btn_createNew"),this,this.onClickCreateNew);
        this.itemCreateNew.setPosition(225,525);

        this.btn_check_room = new ccui.Button("res/res_ui/qyq/hall/chaxunfangjian.png");
        this.btn_check_room.setPosition(this.itemCreateNew.width/2,325);
        this.itemCreateNew.addChild(this.btn_check_room);
        UITools.addClickEvent(this.btn_check_room,this,this.onClickCheckRoom);

        this.btn_changwan = new ccui.Button("res/res_ui/qyq/hall/changwan.png");
        this.btn_changwan.setPosition(this.itemCreateNew.width/2,75);
        this.itemCreateNew.addChild(this.btn_changwan);
        UITools.addClickEvent(this.btn_changwan,this,this.onClickChangWan);

        this.panel_more = this.getWidget("panel_more_club");
        this.btn_more_club = this.getWidget("btn_hide");

        this.panel_show_all_bag = this.getWidget("panel_show_all_bag");
        this.panel_show_all_bag.setVisible(false);

        this.panel_more.setPosition(this.root.convertToNodeSpace(cc.p(-417,0)));
        if(SdkUtil.isIphoneX()){
            this.btn_more_club.setPositionY(this.btn_more_club.height/2 - 30);
        }

        this.btn_shouqi = this.getWidget("btn_shouqi");
        UITools.addClickEvent(this.btn_shouqi,this,this.onClickShouqiBtn);

        this.btn_join_club = this.getWidget("btn_join");

        this.btn_wanfa = this.getWidget("btn_wanfa");
        this.btn_chenyuan = this.getWidget("btn_chenyuan");
        this.btn_xiaozu = this.getWidget("btn_xiaozu");
        this.btn_zhanji = this.getWidget("btn_zhanji");
        this.btn_tongji = this.getWidget("btn_tongji");
        this.btn_shezhi = this.getWidget("btn_shezhi");
        this.btn_yaoqing = this.getWidget("btn_yaoqing");
        this.btn_quickStart = this.getWidget("btn_quickStart");
        this.btn_hideBegin = this.getWidget("btn_hideBegin");
        this.btn_show_all_table = this.getWidget("btn_show_all_table");
        this.btn_upperPyq = this.getWidget("btn_upperPyq");
        this.btn_match_set = this.getWidget("btn_bisai");
        this.btn_refresh = this.getWidget("btn_refresh");

        var offSetX = (cc.winSize.width - SyConfig.DESIGN_WIDTH)/2;
        this.btn_shouqi.x -= offSetX;
        this.btn_refresh.x -= offSetX;
        this.panel_show_all_bag.x += offSetX;

        this.room_bag_scroll.x -= offSetX;
        this.room_bag_scroll.setContentSize(this.room_bag_scroll.width + offSetX*2,this.room_bag_scroll.height);
        this.tableScroll.setContentSize(this.tableScroll.width + offSetX*2,this.tableScroll.height);

        this.btn_bind = this.getWidget("btn_bind");
        this.btn_bind.setVisible(!PlayerModel.payBindId);
        UITools.addClickEvent(this.btn_bind,this,this.onClickBind);
        this.btn_bind.visible = false;

        this.btn_bufang = this.getWidget("btn_bufang");
        UITools.addClickEvent(this.btn_bufang,this,this.onClickBufang);

        this.btn_pifu = this.getWidget("btn_pifu");
        UITools.addClickEvent(this.btn_pifu,this,this.onClickPifu);

        UITools.addClickEvent(this.btn_yaoqing,this,this.onClickYaoQing);

        this.zuoziType = cc.sys.localStorage.getItem("zuozitype") || 1;

        this.btn_suo = this.getWidget("btn_suo");
        UITools.addClickEvent(this.btn_suo,this,this.onClickSuoBtn);

        UITools.addClickEvent(this.btn_more_club,this,this.onClickMoreClub);

        UITools.addClickEvent(this.btn_wanfa,this,this.onClickWanfa);
        UITools.addClickEvent(this.btn_chenyuan,this,this.onClickChenyuan);
        UITools.addClickEvent(this.btn_zhanji,this,this.onClickZhanji);
        UITools.addClickEvent(this.btn_tongji,this,this.onClickTongji);
        UITools.addClickEvent(this.btn_shezhi,this,this.onClickShezhi);
        UITools.addClickEvent(this.btn_quickStart,this,this.onClickQuickStart);
        UITools.addClickEvent(this.btn_hideBegin,this,this.onClickHideBegin);
        UITools.addClickEvent(this.btn_show_all_table,this,this.onClickShowTable);
        UITools.addClickEvent(this.btn_upperPyq,this,this.onClickUpperPyq);
        UITools.addClickEvent(this.btn_join_club,this,this.onClickJoinClub);
        UITools.addClickEvent(this.btn_xiaozu,this,this.onClickXiaozu);
        UITools.addClickEvent(this.btn_match_set,this,this.onClickMatchSet);

        UITools.addClickEvent(this.btn_refresh,this,this.onClickRefresh);

        this.roomsNumLabel = ccui.helper.seekWidgetByName(this.btn_show_all_table,"num_label");

        this.paomadeng = new newPyqPaoMaDeng();
        this.root.addChild(this.paomadeng,10);
        //this.paomadeng.anchorX=this.paomadeng.anchorY=0;
        //this.paomadeng.updatePosition(-600,905);

        this.addEventListener();

        this.addTableNumSetItem();

        var Button_hbyfl = this.getWidget("Button_hbyfl");
        Button_hbyfl.visible = true;
        UITools.addClickEvent(Button_hbyfl,this,this.onClickHBYFL);
        this.Button_hbyfl = Button_hbyfl;

        //防止长时间在后台回到前台牌桌刷新异常
        var self = this;
        this.showLisener = cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function(){
            cc.log("=======PyqHall=======EVENT_SHOW=======");
            if(!self.isBackForward){
                self.isBackForward = true;
                setTimeout(function(){
                    self.getAllClubsData();
                },100);
            }
        });

        this.hideListener = cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function(){
            cc.log("=======PyqHall=======EVENT_HIDE=======");
            self.isBackForward = false;
        });
    },

    onClickHBYFL:function (){
        if(ClickClubModel.isClubCreater()){
            var mc = new HBYFlytfPop();
            PopupManager.addPopup(mc);
        }else{
            var mc = new HBYFljlPop();
            PopupManager.addPopup(mc);
        }
    },

    addTableNumSetItem:function(){
        var parent = this.btn_hideBegin.getParent();

        var inputBg = new cc.Scale9Sprite("res/res_ui/qyq/common/commonKuang/inputBg.png",null,cc.rect(30,30,400,30));
        inputBg.setPosition(this.btn_hideBegin.x - 105,this.btn_hideBegin.y - 15);
        inputBg.setContentSize(180,90);
        parent.addChild(inputBg,5);

        this.limitNumBg = inputBg;

        this.inputBox = new cc.EditBox(cc.size(inputBg.width - 10, 75),new cc.Scale9Sprite("res/ui/bjdmj/popup/light_touming.png"));
        this.inputBox.x = inputBg.width/2;
        this.inputBox.y = inputBg.height/2;
        this.inputBox.setPlaceholderFont("",40);
        this.inputBox.setInputMode(cc.EDITBOX_INPUT_MODE_NUMERIC);
        this.inputBox.setMaxLength(4);
        this.inputBox.setPlaceHolder("请输入");
        this.inputBox.setDelegate(this);
        this.inputBox.setPlaceholderFontColor(cc.color("#2155b5"));
        inputBg.addChild(this.inputBox,1);
        this.inputBox.setFont("",40);

        var label = new UICtor.cLabel("限制显示\n已开局桌数",40);
        label.setAnchorPoint(0,0.5);
        label.setPosition(inputBg.width + 10,inputBg.height/2);
        inputBg.addChild(label);
    },

    /**
     * This method is called when an edit box loses focus after keyboard is hidden.
     * @param {cc.EditBox} sender
     */
    editBoxEditingDidEnd: function (sender) {
        var num = this.inputBox.getString();
        if(num >= 0){
            if(num != ClickClubModel.limitTableNum){
                this.changeLimitNum(Number(num));
            }
        }else if(num){
            FloatLabelUtil.comText("输入不合法");
        }
    },

    changeLimitNum:function(num){
        var params = {
            keyId:ClickClubModel.getCurClubKeyId(),
            groupId:ClickClubModel.getCurClubId(),
            userId:PlayerModel.userId,
            optType:11,
            sessCode:PlayerModel.sessCode,
            tableNum:num
        }

        var self = this;
        NetworkJT.loginReqNew(448,params, function (data) {
            if (data) {
                FloatLabelUtil.comText(data.message);
                SyEventManager.dispatchEvent(SyEvent.UPDATE_CLUB_LIST);
            }
        }, function (data) {
            FloatLabelUtil.comText("修改失败");
        });
    },


    onClickShop:function(){
        if(PlayerModel.payBindId){
            var popLayer = new ShopPop();
            PopupManager.addPopup(popLayer);
        }else{
            //var pop = new BindInvitePop(PlayerModel.inviterPayBindId || "");
            //PopupManager.addPopup(pop);
        }
    },

    onClickPyqInfo:function(){
        var pop = new PyqInfoPop(this.clubDataList[this.curClubIdx],this.groupLevelData.gConfigs);
        PopupManager.addPopup(pop,9);
    },

    onClickPyqPlayerInfo:function(){
        var pop = new ClubPlayerInfoPop(this.clubDataList[this.curClubIdx],this.groupLevelData.guConfigs);
        PopupManager.addPopup(pop,9);
    },

    onClickCheckRoom:function(){
        var pop = new PyqCheckRoomPop(1);
        this.addChild(pop,9);
    },


    onClickChangWan:function(){
        var mc = new ClubRuleManagePop(this.allBagsData,ClickClubModel.getCurClubBagModeId());
        PopupManager.addPopup(mc);

        mc.onClickItemBtn(mc.btn_cw);
    },


    onEnterTransitionDidFinish:function(){
        this._super();
        if(this.clubDataList){
            this.refreshClubList(this.clubDataList);
        }else{
            this.getAllClubsData();
        }

        this.scheduleUpdate();

        //this.addBtnAni();
    },

    setBackImg:function(type){
        var imgName = "res/res_ui/qyq/hall/bg1.jpg";
        var indexType = parseInt(type);
        if(indexType > 0 && indexType < 7){
            imgName = "res/res_ui/qyq/hall/bg"+ indexType+".jpg";
        }
        this.root.setBackGroundImage(imgName);
    },

    updateClubBg:function(event){
        this.setBackImg(event.getUserData());
    },

    updateClubZb:function(event){
        //this.zuoziType = event.getUserData();
        //
        //for(var i = 0;i<this.tableArr.length;++i){
        //    var item = this.tableArr[i];
        //    var item_btn = item.getChildByName("btn_table");
        //    var data = item_btn.tempData;
        //    var imgName = this.getZhuoBgFile(data.playType,data.maxCount);
        //    item.getChildByName("table_bg").loadTexture(imgName);
        //}
    },

    update:function(dt){

        if(this.needImgIdArr.length > 0){
            var userIdArr = this.needImgIdArr.splice(0,20);
            ComReq.comReqGetClubBagRoomsData([this.clubDataList[this.curClubIdx].groupId,4],[userIdArr.join(",")]);
        }

        if(!this.paomadeng.playing){
            //if(!sy.scene.msgPlaying && PaoMaDengModel.getCurrentMsg()) {
            //    var curMsg = PaoMaDengModel.getCurrentMsg();
            //    this.paomadeng.play(curMsg);
            //}else
            if (sy.scene.msgPlaying && sy.scene.IsPlayByServerId()){
                if (sy.scene._msgData){
                    this.paomadeng.play(sy.scene._msgData);
                }
            }else{
                var gongGao = ClickClubModel.getClubGongGao();
                if(gongGao){
                    this.paomadeng.play({content:gongGao});
                }
            }
        }
        this.updateRoomDelay += dt;
        if(this.updateRoomDelay > 1){
            this.updateRoomsData();
            this.updateRoomDelay = 0;
        }
    },

    checkShowBindPop:function(){
        var clubId = ClickClubModel.getCurClubId();
        var temp = cc.sys.localStorage.getItem("sy_is_show_bind_in_club_" + clubId);
        if(!temp && !PlayerModel.payBindId){
            //var pop = new BindInvitePop(ClickClubModel.getPayBindId());
            //PopupManager.addPopup(pop);
            cc.sys.localStorage.setItem("sy_is_show_bind_in_club_" + clubId,"1");
        }
    },

    onClickBind:function(){
        //var pop = new BindInvitePop(ClickClubModel.getPayBindId());
        //PopupManager.addPopup(pop);
    },

    //获取亲友圈等级信息
    getClubGroupLevelData:function(){
        var self = this
        NetworkJT.loginReqNew(442, {userId:PlayerModel.userId,sessCode:PlayerModel.sessCode}, function (data) {
            if (data) {
                self.groupLevelData = data.message;
                cc.log("loadGroupLevelConfig",JSON.stringify(data.message))
            }
        }, function (data) {
        });
    },

    onClickBufang:function(sender){
        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(function(){
            sender.setTouchEnabled(true);
        })));

        NetworkJT.loginReqNew(306,
            {userId:PlayerModel.userId,groupId:ClickClubModel.getCurClubId(),sessCode:PlayerModel.sessCode}, function (data) {
            if (data) {
                FloatLabelUtil.comText(data.message);
            }
        }, function (data) {
            FloatLabelUtil.comText(data.message);
        });
    },

    onClickPifu:function(){
        if(ClickClubModel.isClubCreaterOrLeader()){
            var pop = new PyqPifuSetPop(this.allBagsData);
            PopupManager.addPopup(pop);
            return;
        }

        if(ClickClubModel.getIsSwitchCoin()) {
            if(this.clubDataList[this.curClubIdx].gLevelMsg){
                var pop = new PyqNewPifuPop(this.clubDataList[this.curClubIdx].gLevelMsg.level,this.groupLevelData.gConfigs);
                PopupManager.addPopup(pop);
            }
        }else{
            var pop = new PyqPifuPop();
            PopupManager.addPopup(pop);
        }
    },

    onClickYaoQing:function(){
        PopupManager.addPopup(new ClubAddPlayerPop(ClickClubModel.getCurClubId()));
    },

    onClickRefresh:function(){
        var curTime = new Date();
        if(!this.lastClickTime || this.lastClickTime < curTime - 3000){
            this.lastClickTime = curTime;
            this.getAllClubsData();
        }else{
            FloatLabelUtil.comText("请不要点击太快哦！");
        }
    },

    onClickSuoBtn:function(sender){
        var creditLock = ClickClubModel.getCreditLock()?0:1;
        var tipStr = "是否将擂台分上锁";
        if(!creditLock){
            tipStr = "是否将擂台分解锁";
        }
        var self = this;
        AlertPop.show(tipStr,function() {
            self.optSuoState(creditLock);
        });
    },

    optSuoState:function(creditLock){
        var self = this;
        var params = {optType:2,userId:PlayerModel.userId,groupId:ClickClubModel.getCurClubId(),creditLock:creditLock,sessCode:PlayerModel.sessCode};
        NetworkJT.loginReqNew(435, params, function (data) {
            if (data) {
                FloatLabelUtil.comText(data.message);
                ClickClubModel.updateCreditLock(creditLock);
                for(var i = 0;i<self.clubDataList.length;++i){
                    if(self.clubDataList[i].groupId == params.groupId){
                        self.clubDataList[i].creditLock = creditLock;
                    }
                }
                self.btn_suo.setBright(!creditLock);
            }
        }, function (data) {
            //cc.log("updateGroupUser::"+JSON.stringify(data));
            FloatLabelUtil.comText(data.message);
        });
    },

    addEventListener:function(){
        this.addCustomEvent(SyEvent.SOCKET_OPENED,this,this.onSuc);
        this.addCustomEvent(SyEvent.GET_SERVER_SUC,this,this.onChooseCallBack);
        this.addCustomEvent(SyEvent.NOGET_SERVER_ERR,this,this.onChooseCallBack);
        this.addCustomEvent(SyEvent.ADD_JT_PAIJU,this,this.onChooseCallBack);

        this.addCustomEvent(SyEvent.CLUB_DELETE_ONE,this,this.onHadDeleteOneRoom);
        this.addCustomEvent(SyEvent.UPDATE_CLUB_LIST , this , this.onUpdateClubList);

        this.addCustomEvent(SyEvent.GET_CLUB_ROOMS , this ,this.respGetRoomsData);
        this.addCustomEvent(SyEvent.GET_CLUB_BAGS , this ,this.respGetBagsData);
        this.addCustomEvent(SyEvent.GET_CLUB_ALLBAGS,this,this.refreshClubBagData);
        this.addCustomEvent(SyEvent.CLUB_BAG_FASTJOIN,this,this.onBagFastJoin);
        this.addCustomEvent(SyEvent.CLUB_BAG_CREATE,this,this.onBagFastCreate);

        this.addCustomEvent(SyEvent.UPDATE_SHOW_BAGWANFA,this,this.onUpdateRuleTip);

        this.addCustomEvent(SyEvent.CLUB_ROOM_DETAILPOP,this,this.onShowRoomDetail);

        this.addCustomEvent(SyEvent.UPDATE_CLUB_NAME,this,this.onUpdateClubName);

        this.addCustomEvent("Change_Club_Bg",this,this.updateClubBg);
        this.addCustomEvent("Change_Club_Zb",this,this.updateClubZb);

        this.addCustomEvent("GET_HEAD_IMG", this ,this.onGetHeadImg);

        this.addCustomEvent(SyEvent.JOIN_ROOM,this,this.onClubRoomJoinPlayer);
        this.addCustomEvent(SyEvent.GetTableMsg,this,this.onGetTableMsg);
        this.addCustomEvent(SyEvent.START_PLAY,this,this.onClubRoomStart);
        this.addCustomEvent(SyEvent.UPDATA_CLUB_CREDIT,this,this.onUpdateCredit);
        this.addCustomEvent(SyEvent.UPDATA_CLUB_COIN,this,this.onUpdateCoin);
        this.addCustomEvent(SyEvent.CLUB_UPGRADE_SUCCESSED,this,this.onUpgradeSuccessed);
        this.addCustomEvent(SyEvent.CLUB_Level_LOG,this,this.onLevelLog);
        this.addCustomEvent(SyEvent.CLUB_WZQ_CREATEROOM,this,this.onCreateWZQRoom);
    },

    onGetHeadImg:function(event){
        var msg = event.getUserData();

        if(msg.headImgs){
            for(var i = 0;i<msg.headImgs.length;++i){
                var data = msg.headImgs[i];
                var playerNode = this.userIdCfgData[data.userId];
                if(playerNode){

                    this.loadHeadImg(playerNode,data.headimgurl);
                    sy.HeadImgCfg[data.userId] = data.headimgurl || "default";
                }
            }
        }
    },

    addBtnAni:function(){
        //ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/kuaisuzuju/kuaisuzuju.ExportJson");
        //var ani = new ccs.Armature("kuaisuzuju");
        //ani.setAnchorPoint(0.5,0.5);
        //ani.setPosition(this.btn_quickStart.width/2,this.btn_quickStart.height/2 + 5);
        //ani.getAnimation().play("Animation2",-1,1);
        //this.btn_quickStart.addChild(ani);
    },

    onGetTableMsg:function(event){
        if(event.eventType == "JoinTable"){
            var self = this;
            //这里延时下，因为牌桌处理消息放在update里面，这个要在牌桌处理消息后面执行
            setTimeout(function(){
                self.onClubRoomJoinPlayer();
            },100);
        }
    },

    onClubRoomJoinPlayer:function(){
        if(BaseRoomModel.curRoomData.players.length >= BaseRoomModel.curRoomData.renshu){
            var players = BaseRoomModel.curRoomData.players;
            var is_self_ready = false;
            for(var i = 0;i<players.length;++i){
                if(players[i].userId == PlayerModel.userId && players[i].status){
                    is_self_ready = true;
                }
            }

            if(true){//不用有取消按钮的了弹框了
                AlertPop.showOnlyOk("您所在的房间人数已满,请返回房间",function(){
                    PopupManager.removeAll();
                }.bind(this));
            }else{
                AlertPop.show("您所在的房间人数已满,是否返回房间",function(){
                    PopupManager.removeAll();
                }.bind(this),function(){});
            }
        }
    },

    onClubRoomStart:function(){
        AlertPop.showOnlyOk("您所在的房间已开局,请返回房间",function(){
            PopupManager.removeAll();
        }.bind(this));
    },

    onShowRoomDetail:function(event){
        var allData = event.getUserData();
        PopupManager.addPopup(new ClubRoomDetailPop(allData));
    },

    getMoreTableData:function(){
        //var page = Math.ceil(this.tablesData.length / this.maxRoomItem);
        //this.getClubBagRoomsData(page + 1);
    },

    onHadDeleteOneRoom:function(){
        this.getAllClubsData();
    },

    onUpdateClubList:function(){
        this.getAllClubsData();
    },

    getAllClubsData:function(){
        this.isGetTableData = false;
        var self = this;
        NetworkJT.loginReqNew(415, {userId:PlayerModel.userId,sessCode:PlayerModel.sessCode}, function (data) {
            if (data) {
                sy.scene.hideLoading();
                if(data.message.list && data.message.list.length > 0){
                    ClubListModel.init(data.message.list);
                    self.refreshClubList(data.message.list);
                }
            }
        }, function (data) {
            sy.scene.hideLoading();
            FloatLabelUtil.comText(data.message);
        });
    },

    onSuc:function(){
        sy.scene.hideLoading();
        //cc.log("切服成功...");
        //cc.log("this.clickClubId...",this.clickBtnType,ClickClubModel.getCurClubId()+"",JSON.stringify(this.wzqScore));

        if(this.resp == true){
            this.resp = false;
            var rooNum = this.roomNum;
            //cc.log("this.modeId",this.modeId);
            if (this.clickBtnType == 0){
                //军团ID,
                //房间个数
                //房间可见性（私密传0）
                //房间模式Id（如果是纯数字则取参数，否则取军团中最新的一个模式）
                //是否是私密房，0：否，1：是
                sySocket.sendComReqMsg(1, [],[ClickClubModel.getCurClubId()+"",rooNum + "","0",this.modeId+"","1"]);
            }else if (this.clickBtnType == 1){
                sySocket.sendComReqMsg(1, [],[ClickClubModel.getCurClubId()+"",rooNum + "","1",this.modeId+""]);
            }else if (this.clickBtnType == 2){
                sySocket.sendComReqMsg(2,[parseInt(this.tableId),this.gameType]);
            }else if (this.clickBtnType == 3){
                //cc.log("this.modeId",this.modeId)
                ClickClubModel.updateBagModeId(ClickClubModel.getCurClubId(),this.modeId);
                if (PlayerModel.clubTableId == 0){
                    sySocket.sendComReqMsg(1, [],[ClickClubModel.getCurClubId()+"",1 + "","1",this.modeId+""]);
                }else{
                    sySocket.sendComReqMsg(2,[parseInt(PlayerModel.clubTableId),this.gameType,1,0,ClickClubModel.getCurClubId()],[this.modeId+""]);
                }
            }else if (this.clickBtnType == 4){
                ClickClubModel.updateBagModeId(ClickClubModel.getCurClubId(),this.modeId);
                sySocket.sendComReqMsg(1, [],[ClickClubModel.getCurClubId()+"",1 + "","1",this.modeId+""]);
            }else if (this.clickBtnType == 5){//创建五子棋房间
                sySocket.sendComReqMsg(1, this.wzqScore,[ClickClubModel.getCurClubId()+"","0","0","0","1"]);
            }

            //cc.log("你他妈进来了没！！！！！！！！！！！！！！！！！！！")

        }
    },

    onChooseCallBack:function(event){
        var status = event.getUserData();
        if(status == ServerUtil.GET_SERVER_ERROR){
            sy.scene.hideLoading();
            FloatLabelUtil.comText("切服失败");
        }else if(status == ServerUtil.NO_NEED_CHANGE_SOCKET){
            this.onSuc();
        }
    },

    onBagFastCreate:function(){
        var modeId = ClickClubModel.getCurClubBagModeId();
        for(var index = 0 ; index < this.allBagsData.length; index++){
            var data = this.allBagsData[index];
            if (modeId == data.config.keyId){
                //this.modeId = data.config.keyId;/
                this.wanfaList = data.config.modeMsg.split(",");
            }
        }

        if (!modeId){
            var mc = new ClubRuleManagePop(this.allBagsData,ClickClubModel.getCurClubBagModeId());
            PopupManager.addPopup(mc);
            return;
        }

        var wanfa = this.wanfaList[1];

        //var func = function(){
            this.clickBtnType = 4;
            var str = "正在创建";
            sy.scene.showLoading(str);
            this.resp = true;

            cc.log("onBagFastCreate",modeId,wanfa);
            this.modeId = modeId;
            sySocket.sendComReqMsg(29 , [parseInt(wanfa)] , "0");
            //sySocket.sendComReqMsg(29 , [parseInt(wanfa)] , ["0",modeId+"",ClickClubModel.getCurClubId()+""]);
        //}.bind(this);

        //sy.scene.updatelayer.getUpdatePath(wanfa,func);
    },

    onBagFastJoin:function(event){
        var modeId = ClickClubModel.getCurClubBagModeId();
        for(var index = 0 ; index < this.allBagsData.length; index++){
            var data = this.allBagsData[index];
            if (modeId == data.config.keyId){
                //this.modeId = data.config.keyId;/
                this.wanfaList = data.config.modeMsg.split(",");
            }
        }

        if (!modeId){
            var mc = new ClubRuleManagePop(this.allBagsData,ClickClubModel.getCurClubBagModeId());
            PopupManager.addPopup(mc);
            return;
        }
        var clickBtnType = event.getUserData()
        var wanfa = this.wanfaList[1];

        this.quickStart(wanfa,modeId,clickBtnType);
    },

    quickStart:function(wanfa,modeId,type){

        this.clickBtnType = type;
        var str = "正在加入";
        sy.scene.showLoading(str);
        this.resp = true;

        this.modeId = modeId;
        sySocket.sendComReqMsg(29 , [parseInt(wanfa)] , ["0",modeId+"",ClickClubModel.getCurClubId()+""]);

    },

    onCreateWZQRoom:function(event){
        var clickBtnType = event.getUserData()
        var wanfa = parseInt(GameTypeEunmPK.WZQ)
        //var func = function(){
            this.clickBtnType = clickBtnType[0];
            this.wzqScore = clickBtnType[1]
            cc.log("onCreateWZQRoom", this.clickBtnType,this.wzqScore)
            var str = "正在加入";
            sy.scene.showLoading(str);
            this.resp = true;
            sySocket.sendComReqMsg(29,[wanfa] , ["0","0",ClickClubModel.getCurClubId()+""]);
        //}.bind(this);

        //sy.scene.updatelayer.getUpdatePath(wanfa,func);
    },

    showCheckRoom:function(data){
        if(this.getChildByName("checkRoomInfo"))return;
        if(!data)return;

        cc.log("=============showCheckRoom============");
        var spr = new cc.Scale9Sprite("res/res_ui/qyq/common/commonKuang/xiaoxiDi.png");
        spr.setContentSize(750,600);
        spr.setPosition(cc.winSize.width/2,cc.winSize.height/2);
        spr.setName("checkRoomInfo");
        this.addChild(spr,10);

        cc.eventManager.addListener(cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function(){return true},
        }), spr);

        var btn_close = new ccui.Button("res/res_ui/qyq/zhanji/closeBtn.png");
        btn_close.setPosition(spr.width - 30,spr.height - 30);
        spr.addChild(btn_close);
        UITools.addClickEvent(btn_close,this,function(){
            spr.removeFromParent(true);
        });

        var btn_jiesan = new ccui.Button("res/res_ui/qyq/hall/jiesan.png");
        btn_jiesan.setPosition(spr.width/2,90);
        spr.addChild(btn_jiesan);
        UITools.addClickEvent(btn_jiesan,this,function(){
            var roomId = data.tableId;
            var keyid = data.keyId;
            AlertPop.show("确定要解散该房间吗？",function(){
                sySocket.sendComReqMsg(7,[],[roomId+"",keyid+""]);
                spr.removeFromParent(true);
            });
        });

        if(!ClickClubModel.isClubCreaterOrLeader()){
            btn_jiesan.setVisible(false);
        }

        var label_id = new ccui.Text("房间号:" + data.tableId,"res/font/bjdmj/fznt.ttf",40);
        label_id.setPosition(spr.width/2,spr.height - 50);
        label_id.setColor(cc.color("#90371f"));
        spr.addChild(label_id,3);

        var item = this.tableItem.clone();
        item.setPosition(spr.width/2 - 150,spr.height/2 - 120);
        spr.addChild(item,1);
        this.setTableItemData(item,data);
    },

    respGetRoomsData:function(event){

        var msg = event.getUserData();

        if(msg.code == 2 || msg.code == 3){//通过房间ID或UserID查询
            if(msg.tables.length > 0){
                this.showCheckRoom(msg.tables[0]);
            }else{
                FloatLabelUtil.comText("查询房间不存在");
            }
            return;
        }

        //var isLastPage = (msg.pageNo == Math.ceil(msg.tableCount/msg.pageSize));
        //
        ////cc.log("==========respGetRoomsData===========",jsonData.pageNo);
        //
        //this.tablesPageData[msg.pageNo - 1] = msg.tables;
        //if (msg.tables.length <= 0 || isLastPage) {
        //    this.isNeedCheckMoreTableData = false;
        //    this.tablesPageData.length = msg.pageNo;
        //}
        //var newData = [];
        //for (var i = 0; i < this.tablesPageData.length; ++i) {
        //    if (this.tablesPageData[i]) {
        //        newData = newData.concat(this.tablesPageData[i]);
        //    }
        //}
        this.tablesData = msg.tables || [];

        if(this.isShowLX && this.localWanfaID != 0){
            this.showWanfaList();
            this.lxArrObject = this.lxArrObject || {};
            var arr = this.lxArrObject[this.localWanfaID] || [];
            this.updateTableList(arr);
        }else{
            this.updateTableList(this.tablesData);
        }

        this.isGetTableData = true;

        if(ClickClubModel.getIsSwitchCoin){
            if(this.groupLevelData.gConfigs&&this.groupLevelData.gConfigs.length>0){
                this.updateGroupExp(msg.groupLevel,msg.groupExp,msg.groupUserLevel,this.groupLevelData.gConfigs[msg.groupLevel-1].exp)
            }
            if(msg.groupLevel > ClickClubModel.groupLevel){
                cc.sys.localStorage.setItem("sy_club_bg_type"+ClickClubModel.getCurClubId(),msg.groupLevel);
                SyEventManager.dispatchEvent("Change_Club_Bg",msg.groupLevel);
            }
            if(msg.groupUserLevel > ClickClubModel.groupUserLevel){
                cc.sys.localStorage.setItem("Change_Club_Head_Frame",msg.groupUserLevel);
                var params = {optType:3,userId:PlayerModel.userId,groupId:ClickClubModel.getCurClubId(),frameId:msg.groupUserLevel,sessCode:PlayerModel.sessCode};
                NetworkJT.loginReqNew(435, params, function (data) {
                    if (data) {
                    }
                }, function (data) {
                    FloatLabelUtil.comText(data.message);
                });
            }

            ClickClubModel.groupLevel = msg.groupLevel;
            ClickClubModel.groupExp = msg.groupExp;
            ClickClubModel.groupUserLevel = msg.groupUserLevel;
            ClickClubModel.groupUserExp = msg.groupUserExp;
            //cc.log("updateGroupExp",ClickClubModel.groupLevel,ClickClubModel.groupExp,ClickClubModel.groupUserLevel,ClickClubModel.groupUserExp)
        }
    },

    onUpgradeSuccessed:function(event){
        var data = event.getUserData();
        var pop = new ClubUpgradeSucceedPop(data.strParams);
        PopupManager.addPopup(pop);
    },

    updateGroupExp:function(groupLevel,groupExp,groupUserLevel,groupTotalExp){
        if(ClickClubModel.getIsSwitchCoin()){
            var pyqInfoBg = this.getWidget("pyq_info_bg");
            var Image_vip = ccui.helper.seekWidgetByName(pyqInfoBg,"Image_vip");
            Image_vip.loadTexture("res/ui/bjdmj/popup/pyq/img_vip_"+groupLevel+".png")
            var Image_honor = ccui.helper.seekWidgetByName(pyqInfoBg,"Image_honor");
            Image_honor.loadTexture("res/ui/bjdmj/popup/pyq/img_honor_"+groupUserLevel+".png")

            var ProgressBar_exp = ccui.helper.seekWidgetByName(pyqInfoBg,"ProgressBar_exp")
            var percent = groupTotalExp != 0 ? (groupExp/groupTotalExp)*100 : 100
            //cc.log("percent",groupExp,groupTotalExp,percent)
            ProgressBar_exp.setPercent(percent)
        }
    },

    onUpdateCoin:function(event){
        if(ClickClubModel.getIsSwitchCoin()) {
            var coin = event.getUserData();
            var pyqInfoBg = this.getWidget("pyq_info_bg");
            var label_jinbi = ccui.helper.seekWidgetByName(pyqInfoBg, "label_jinbi");
            label_jinbi.setString(coin)
        }
    },

    respGetBagsData:function(event){
        var allData = event.getUserData();
        var tData = allData.strParams;

        if (tData && tData.length > 0) {
            var jsonData = JSON.parse(tData);
            this.allBagsData = jsonData.list || [];

            this.allBagsData.sort(function(a,b){
                return a.config.tableOrder - b.config.tableOrder;
            });

            for(var i = 0;i<this.allBagsData.length;++i){
                var bag = this.allBagsData[i];
                if(bag.extMsg){
                    this.zhuoBuCfgData[bag.config.keyId] = JSON.parse(bag.extMsg);
                }
            }

            //if(this.Image_selectType.visible){
                this.showWanfaName(this.allBagsData);
            //}

            this.updateRoomDelay = 0;

            //this.updateBagRoomList();
            SyEventManager.dispatchEvent(SyEvent.UPDATE_CLUB_BAGS,this.allBagsData);
            this.updateQuickTip();
            cc.log("============respGetBagsData===============");
            this.isNeedCheckMoreTableData = true;
            this.getClubBagRoomsData(1);
        }
    },

    refreshClubBagData:function(event){
        var index = event.getUserData() || -1;
        this.getClubBagData(index);
    },

    getTableName:function(bagId){
        var name = "";
        for(var i = 0 ; i < this.allBagsData.length; i++){
            if (bagId == this.allBagsData[i].groupId){
                name = this.allBagsData[i].groupName;
                break;
            }
        }
        return name;
    },

    /**
     * 刷新俱乐部列表
     */
    refreshClubList:function(clubDataList){
        this.clubDataList = clubDataList;
        var clubScroll = this.getWidget("club_scroll");
        var clubItem = this.getWidget("club_item");

        this.clubItemArr = this.clubItemArr || [clubItem];

        var spaceH = 120;
        var contentH = Math.max(clubScroll.height,spaceH*clubDataList.length);
        clubScroll.setInnerContainerSize(cc.size(clubScroll.width,contentH));
        clubScroll.setBounceEnabled(contentH > clubScroll.height);

        var lastGroupId = cc.sys.localStorage.getItem("sy_lastClick_groupId");
        var showIdx = 0;

        for(var i = 0;i<clubDataList.length;++i){
            var item = this.clubItemArr[i];
            if(!item){
                item = this.clubItemArr[i] = clubItem.clone();
                clubScroll.addChild(item);
            }
            item.setPositionY(contentH - spaceH*(i+0.5));
            var nameLabel = item.getChildByName("name_label");
            var renshuLabel = item.getChildByName("reshu_label");

            nameLabel.setString(clubDataList[i].groupName);
            renshuLabel.setString(clubDataList[i].currentCount > 99?"99+":clubDataList[i].currentCount);
            var btn_item = item.getChildByName("btn_item");
            btn_item.idx = i;
            UITools.addClickEvent(btn_item,this,this.onClickClubItem);
            var img_head = ccui.helper.seekWidgetByName(item,"img_head");
            this.showIcon(img_head,clubDataList[i].masterImg,1)
            if(clubDataList[i].groupId == lastGroupId){
                showIdx = i;
            }
        }

        for(;i<this.clubItemArr.length;++i){
            this.clubItemArr[i].removeFromParent(true);
        }
        this.clubItemArr.length = clubDataList.length;

        this.selectClickClubItem(this.clubItemArr[showIdx].getChildByName("btn_item"));

        if(showIdx >= 5){
            clubScroll.scrollToPercentVertical((showIdx + 1)/clubDataList.length*100,0.1,false);
        }
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
            spr.setScale(85/spr.width);
            imgNode.addChild(spr);
        }

        if (iconUrl) {

            cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
                if (!error) {
                    spr.setTexture(img);
                    spr.setScale(85/spr.width);
                }
            });
        }else{
            spr.initWithFile(defaultimg);
        }
    },

    selectClickClubItem:function(sender){
        this.isGetTableData = false;

        this.filterFlag = 0;
        if(this.clubItemArr[this.curClubIdx]){
            this.clubItemArr[this.curClubIdx].setColor(cc.color.WHITE);
        }

        this.curClubIdx = sender.idx;

        for(var i = 0;i<this.clubItemArr.length;++i){
            var color = cc.color.WHITE;
            if(i == sender.idx){
                color = cc.color.RED;
            }
            this.clubItemArr[i].setColor(color);
        }
        ClickClubModel.init(this.clubDataList[this.curClubIdx]);

        var type = cc.sys.localStorage.getItem("sy_club_bg_type");
        if(ClickClubModel.getIsSwitchCoin()){
            type = cc.sys.localStorage.getItem("sy_club_bg_type"+ClickClubModel.getCurClubId());
        }

        if(!type)type = ClickClubModel.bgType;

        this.setBackImg(type);

        cc.sys.localStorage.setItem("sy_lastClick_groupId",this.clubDataList[this.curClubIdx].groupId);

        this.updateRoomInfo(this.clubDataList[this.curClubIdx]);
        this.getClubBagData();
        this.updateRedPoint();
        this.updateBtnState();

        if(ClickClubModel.getCreditLock() && !this.lockTipCig[ClickClubModel.getCurClubId()]){
            this.lockTipCig[ClickClubModel.getCurClubId()] = true;
            var tipStr = "擂台分已上锁，是否解锁";
            var self = this;
            AlertPop.show(tipStr,function() {
                self.optSuoState(0);
            });
        }

        setTimeout(function(){
            this.checkShowBindPop();
        }.bind(this),10);
    },

    onClickClubItem:function(sender){
        cc.log("===========onClickClubItem===========" + sender.idx);

        var time = new Date().getTime();
        if(this.clickClubTime && (time - this.clickClubTime < 1500)){
            FloatLabelUtil.comText("请不要切换亲友圈过快");
            return;
        }
        this.clickClubTime = time;

        this.curShowPage = 1;
        this.curShowBagPage = 1;
        this.tableScroll.jumpToLeft();
        this.bagScroll.jumpToLeft();
        //this.checkShowScrollLayer();

        this.paomadeng.stopNoHide();

        var curClubIdx = sender.idx;
        if(this.clubDataList[curClubIdx].gLevelMsg && this.clubDataList[curClubIdx].gLevelMsg.switchCoin != ClickClubModel.switchCoin){
            cc.sys.localStorage.setItem("sy_lastClick_groupId",this.clubDataList[curClubIdx].groupId);
            SyEventManager.dispatchEvent(SyEvent.SWITCH_CLUB);
            PopupManager.removeAll();
            this.onCloseHandler();
            return
        }
        this.selectClickClubItem(sender);
    },

    getMyCriditScore:function(){
        var self = this;
        NetworkJT.loginReqNew(428, {
            groupId:ClickClubModel.getCurClubId(),
            userId:PlayerModel.userId,
            sessCode:PlayerModel.sessCode,
            pageNo:1,
            pageSize:0,
            keyWord:"",
            targetUserId:""
        }, function (data) {
            if (data) {
                var myScore = 0;
                if (data.message){
                    myScore = data.message.myCredit;
                }
                var pyqInfoBg = self.getWidget("pyq_info_bg");
                var pyqBisaiNum = ccui.helper.seekWidgetByName(pyqInfoBg,"label_bisai");
                myScore = MathUtil.toDecimal(myScore/100);
                // pyqBisaiNum.setString(this.tranNumber(myScore,2));
                pyqBisaiNum.setString(myScore);
            }
        }, function (data) {
        });
    },

    updateBtnState:function(){
        var btnArr = [this.btn_wanfa,this.btn_chenyuan,this.btn_xiaozu,this.btn_zhanji,this.btn_tongji,this.btn_shezhi,this.btn_yaoqing];

        if(ClickClubModel.isClubCreater()){
            this.btn_suo.setVisible(false);
        }else{
            this.btn_suo.setVisible(true);
            this.btn_suo.setBright(!ClickClubModel.getCreditLock());
            this.btn_suo.visible = !ClickClubModel.getClubIsGold()
        }

        if(ClickClubModel.isClubNormalMember()){
            this.btn_tongji.setVisible(false);
            this.btn_chenyuan.setVisible(false);
        }else{
            this.btn_tongji.setVisible(true);
            this.btn_chenyuan.setVisible(true);
        }

        this.btn_xiaozu.setVisible(false);
        //if(ClickClubModel.isClubCreaterOrLeader() || ClickClubModel.isClubTeamLeader()){
        //    this.btn_xiaozu.setVisible(true);
        //}else{
        //    this.btn_xiaozu.setVisible(false);
        //}
        this.btn_yaoqing.setVisible(!ClickClubModel.isClubNormalMember());

        var newArr = [];
        for(var i = 0;i<btnArr.length;++i){
            if(btnArr[i].isVisible()){
                newArr.push(btnArr[i]);
            }
        }
        var spaceX = 170;
        var startX = this.moreClubHide && !ClickClubModel.getIsSwitchCoin()?200:550;
        for(var i = 0;i<newArr.length;++i){
            newArr[i].x = startX;
            startX+= spaceX;
        }
        this.btn_bufang.setVisible(ClickClubModel.isClubCreaterOrLeader());

        this.Button_hbyfl.setVisible(ClickClubModel.isHasOpenHBY());//红包雨福利按钮
    },

    onUpdateCredit:function(event){
        var msg = event.getUserData();
        cc.log("=======onUpdateCredit=======" + JSON.stringify(msg));
        for(var i = 0;i<this.clubDataList.length;++i){
            if(this.clubDataList[i].groupId == msg.strParams[0]){
                this.clubDataList[i].credit = msg.strParams[1];
            }
        }
        if(msg.strParams[0] == ClickClubModel.getCurClubId()){
            var pyqInfoBg = this.getWidget("pyq_info_bg");
            var pyqBisaiNum = ccui.helper.seekWidgetByName(pyqInfoBg,"label_bisai");
            var creditScore = msg.strParams[1];
            creditScore = MathUtil.toDecimal(creditScore/100);
            pyqBisaiNum.setString((creditScore || "0"));
        }
    },
 
    updateRoomInfo:function(data){
        this.btn_match_set.visible = !ClickClubModel.getClubIsGold()
        this.btn_suo.visible = !ClickClubModel.getClubIsGold()
        this.getWidget("icon_bisai").visible = !ClickClubModel.getClubIsGold()
        var pyqInfoBg = this.getWidget("pyq_info_bg");
        var pyqName = ccui.helper.seekWidgetByName(pyqInfoBg,"pyq_name");
        var pyqId = ccui.helper.seekWidgetByName(pyqInfoBg,"pyq_id");
        var pyqRenshu = ccui.helper.seekWidgetByName(pyqInfoBg,"renshu_label");
        var pyqBisaiNum = ccui.helper.seekWidgetByName(pyqInfoBg,"label_bisai");
        pyqBisaiNum.visible = !ClickClubModel.getClubIsGold()

        pyqName.setString(data.groupName);
        pyqId.setString("(ID:" + data.groupId + ")");
        pyqRenshu.setString(data.currentCount > 99?"99+":data.currentCount);
        var creditScore = data.credit || 0;
        // pyqBisaiNum.setString(this.tranNumber(creditScore,2) || "0");
        creditScore = MathUtil.toDecimal(creditScore/100);
        pyqBisaiNum.setString(creditScore || "0");

        var txt_label = this.btn_show_all_table.getChildByName("txt_label");
        txt_label.setString("显示全部玩法");

        var tablesNum = data.tables;
        if(ClickClubModel.limitTableNum > 0 && tablesNum > ClickClubModel.limitTableNum){
            tablesNum = ClickClubModel.limitTableNum;
        }
        this.roomsNumLabel.setString("(" + tablesNum + "桌)");

        var temp = ClickClubModel.isClubCreaterOrLeader();
        this.btn_hideBegin.setVisible(!temp);
        this.limitNumBg.setVisible(temp);
        ccui.helper.seekWidgetByName(this.panel_show_all_bag,"img_temp").setOpacity(temp?255:0);

        if(ClickClubModel.getIsSwitchCoin()) {
            var btn_pyq_info = this.getWidget("Button_qyqxx");
            UITools.addClickEvent(btn_pyq_info, this, this.onClickPyqInfo);
            var btn_player_info = this.getWidget("Button_tips_honor");
            UITools.addClickEvent(btn_player_info, this, this.onClickPyqPlayerInfo);
            var btn_add_jinbi = this.getWidget("Button_add_jinbi");
            UITools.addClickEvent(btn_add_jinbi, this, this.onClickShop);
            this.getClubGroupLevelData()

            //this.updateGroupExp(data.gLevelMsg.level,data.gLevelMsg.exp,data.guLevelMsg.level,data.guLevelMsg.totalExp)

            var pyqInfoBg = this.getWidget("pyq_info_bg");
            var label_jinbi = ccui.helper.seekWidgetByName(pyqInfoBg, "label_jinbi");
            if(label_jinbi){
                label_jinbi.setString(PlayerModel.getClubCoin())
            }

            this.guLevelLog = data.guLevelLog
            this.onLevelLog();
        }
    },

    onLevelLog:function(){
        if(!this.guLevelLog) return
        for(var i = 0;i<this.guLevelLog.length;i++){
            var data = []
            data.push(this.guLevelLog[i].level)
            data.push(this.guLevelLog[i].addCoin)
            var pop = new ClubUpgradeSucceedPop(data);
            PopupManager.addPopup(pop);
            this.guLevelLog.shift()
            //cc.log("this.guLevelLog",JSON.stringify(this.guLevelLog))
            break;
        }
    },

    // written by kuangfanchen
    tranNumber:function(num, point) {
        var numStr = num.toString()
        // 1万以内直接返回 
        if (numStr.length < 5) {
            return numStr;
        }else if (numStr.length > 4) {//大于4位数是1万 (以1W分割 1W以下全部显示)
            var decimal = numStr.substring(numStr.length - 4, numStr.length - 4 + point)
            return parseFloat(parseInt(num / 10000) + '.' + decimal) + '万';
        }
    },

    onUpdateClubName:function(){
        if(this.clubItemArr[this.curClubIdx]){
            this.clubItemArr[this.curClubIdx].getChildByName("name_label").setString(ClickClubModel.getCurClubName());
        }
        var pyqInfoBg = this.getWidget("pyq_info_bg");
        var pyqName = ccui.helper.seekWidgetByName(pyqInfoBg,"pyq_name");
        pyqName.setString(ClickClubModel.getCurClubName());
    },

    onClickJoinClub:function(){
        var popLayer = new YqhPop();
        PopupManager.addPopup(popLayer);
    },

    onClickUpperPyq:function(){

    },

    onClickShowTable:function(){
        this.panel_show_all_bag.setVisible(!this.panel_show_all_bag.isVisible());
        var btn_list_view = ccui.helper.seekWidgetByName(this.panel_show_all_bag,"btn_list_view");
        if(this.panel_show_all_bag.isVisible()){
            this.inputBox.setString(String(ClickClubModel.limitTableNum));
            btn_list_view.removeAllItems();
            this.filterItemArr = [];

            var btn_item = ccui.helper.seekWidgetByName(this.panel_show_all_bag,"item_btn");
            var btn_opt = ccui.helper.seekWidgetByName(btn_item,"btn_opt");
            btn_item.setVisible(false);
            UITools.addClickEvent(btn_item,this,this.onClickFilterBtn);
            UITools.addClickEvent(btn_opt,this,this.onClickItemOpt);
            var showIdx = 1;
            for(var i = 0;i<this.allBagsData.length + 1;++i){
                if(i > 0 && !this.allBagsData[i-1].groupState)continue;

                var item = btn_item.clone();
                item.setVisible(true);
                this.filterItemArr.push(item);
                btn_list_view.pushBackCustomItem(item);

                var icon_flag = ccui.helper.seekWidgetByName(item,"icon_flag");
                var label_room_num = ccui.helper.seekWidgetByName(item,"label_room_num");
                var label_flag = ccui.helper.seekWidgetByName(item,"label_flag");
                var label_bag_name = ccui.helper.seekWidgetByName(item,"label_bag_name");
                var label_wanfa = ccui.helper.seekWidgetByName(item,"label_wanfa");

                if(i == 0){
                    icon_flag.visible = label_wanfa.visible = false;
                    label_bag_name.setPosition(30,item.height/2);
                    label_bag_name.setString("显示全部玩法");

                    var img = "res/res_ui/qyq/hall/wanfaDi2.png";
                    item.loadTextures(img,img,"");

                    var tablesNum = ClickClubModel.getCurClubRoomsNum();
                    if(ClickClubModel.limitTableNum > 0 && tablesNum > ClickClubModel.limitTableNum){
                        tablesNum = ClickClubModel.limitTableNum;
                    }
                    label_room_num.setString((tablesNum) + "桌");
                    item.filterData = 0;
                }else{

                    label_bag_name.setString(this.allBagsData[i-1].groupName);
                    label_flag.setString(showIdx);
                    label_room_num.setString(this.allBagsData[i-1].startedNum + "桌");
                    label_room_num.setVisible(ClickClubModel.isClubCreaterOrLeader());
                    var wanfa = this.allBagsData[i-1].config.modeMsg.split(",");
                    label_wanfa.setString(ClubRecallDetailModel.getGameName(wanfa));
                    item.filterData = this.allBagsData[i-1].config.keyId;
                    item.isHide = false;

                    if(ClickClubModel.getBagIsHide(item.filterData)){
                        item.isHide = true;
                        var img = "res/res_ui/qyq/hall/xianshi.png";
                        item.loadTextures(img,img,"");
                    }

                    showIdx++;
                }
                if(this.filtModeId == item.filterData){
                    item.setColor(cc.color(255,181,94));
                }
            }
        }
    },

    onClickFilterBtn:function(sender){
        if(sender.filterData == this.filtModeId){
            return;
        }

        if(!this.isShowLX){
            this.filtModeId = sender.filterData;
        }

        var txt_label = this.btn_show_all_table.getChildByName("txt_label");
        var num_label = this.btn_show_all_table.getChildByName("num_label");

        txt_label.setString(ccui.helper.seekWidgetByName(sender,"label_bag_name").getString());
        num_label.setString("(" + ccui.helper.seekWidgetByName(sender,"label_room_num").getString() + ")");

        for(var i = 0;i<this.filterItemArr.length;++i){
            if(sender.filterData == this.filterItemArr[i].filterData){
                this.filterItemArr[i].setColor(cc.color(255,181,94));
            }else{
                this.filterItemArr[i].setColor(cc.color.WHITE);
            }
        }
        //this.updateTableList(this.tablesData);
    },

    onClickItemOpt:function(sender){
        var item = sender.getParent();

        var img = "res/res_ui/qyq/hall/xianshi.png";
        if(item.isHide){
            img = "res/res_ui/qyq/hall/yinchang.png";
        }
        item.isHide = !item.isHide;
        item.loadTextures(img,img,"");

        if(this.isShowLX){
            return;
        }

        ClickClubModel.setBagHideData(item.filterData,item.isHide);

    },

    onClickXiaozu:function(){
        if(ClickClubModel.isClubCreaterOrLeader()){
            PopupManager.addPopup(new ClubTeamPop());
        }else if(ClickClubModel.isClubTeamLeader()){//直接显示我所在分组的详情
            PopupManager.addPopup(new ClubTeamDetailPop(ClickClubModel.getClubTeamKeyId()));
        }
    },

    onClickMatchSet:function(){
        if (ClickClubModel.getClubIsOpenCredit()){
            PopupManager.addPopup(new ClubCreditPop(this));
        }else{
            FloatLabelUtil.comText("暂未开放");
            return
        }
    },

    onClickHideBegin:function(){
        this.isHideStartTable = !this.isHideStartTable;
        //var texfile = "res/ui/bjdmj/popup/pyq/yincang2.png";
        //if(this.isHideStartTable){
        //    texfile = "res/ui/bjdmj/popup/pyq/yincang1.png"
        //}
        //this.btn_hideBegin.loadTextureNormal(texfile,ccui.Widget.LOCAL_TEXTURE);
        this.btn_hideBegin.setBright(!this.isHideStartTable);

        this.updateTableList(this.tablesData);
    },

    onClickQuickStart:function(sender){
        if(!this.isGetTableData)return;

        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(function(){
            sender.setTouchEnabled(true);
        })));

        SyEventManager.dispatchEvent(SyEvent.CLUB_BAG_FASTJOIN,3);
    },

    onClickShezhi:function(){
        var pop = new PyqSet(1);
        PopupManager.addPopup(pop);
    },

    onClickTongji:function(){
        //var pop = new TongjiFacePop()
        //PopupManager.addPopup(pop);
        //return;

        if(ClickClubModel.getClubIsGold()){
            var pop = new GoldClubStatisticsPop()
            PopupManager.addPopup(pop);
        }else if(ClickClubModel.getClubIsOpenCredit()){
            var pop = new ClubStatisticsPop();
            PopupManager.addPopup(pop);
        }else{
            var pop = new PyqTongji();
            PopupManager.addPopup(pop);
        }

    },

    onClickZhanji:function(){
        if(ClickClubModel.getClubIsGold()){
            var mc = new GoldClubRecordPop();
            PopupManager.addPopup(mc);
        }else{
            var mc = new PyqRecordPop();
            PopupManager.addPopup(mc);
        }
    },

    onClickChenyuan:function(){
        var pop = new PyqChenYuan(this);
        PopupManager.addPopup(pop);
    },

    onClickWanfa:function(){
        if (ClickClubModel.isClubCreaterOrLeader()){
            PopupManager.removeClassByPopup(ClubBagManagePop);
            PopupManager.addPopup(new ClubBagManagePop(this.allBagsData));
        }else{
            var mc = new ClubRuleManagePop(this.allBagsData,ClickClubModel.getCurClubBagModeId());
            PopupManager.addPopup(mc);
        }
    },

    updateRedPoint:function(){
        var redPoint = ccui.helper.seekWidgetByName(this.btn_chenyuan,"red_point");
        redPoint.visible = false;
        ClickClubModel.updateClubHasNewMsg(false);
        if(ClickClubModel.isClubCreaterOrLeader()){
            NetworkJT.loginReqNew(307,
                {groupId:ClickClubModel.getCurClubId() ,msgType:ClickClubModel.isClubCreaterOrLeader()?1:0 , userId:PlayerModel.userId}, function (data) {
                    if (data && data.message && data.message.length > 0) {
                        cc.log("searchGroupReview::"+JSON.stringify(data));
                        ClickClubModel.updateClubHasNewMsg(true);
                        redPoint.visible = true;
                    }
                }, function (data) {

                });
        }

    },

    onClickMoreClub:function(sender){
        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(0.3),cc.callFunc(function(){
            sender.setTouchEnabled(true);
        })));

        this.panel_more.stopAllActions();
        if(this.moreClubHide){
            this.panel_more.runAction(cc.sequence(cc.moveTo(0.3,this.root.convertToNodeSpace(cc.p(-3,0))),cc.callFunc(function(){
                var resStr = "res/res_ui/qyq/hall/more_close.png";
                this.btn_more_club.loadTextures(resStr,resStr,"");
                this.moreClubHide = false;
            },this)));

        }else{
            this.panel_more.runAction(cc.sequence(cc.moveTo(0.3,this.root.convertToNodeSpace(cc.p(-417,0))),cc.callFunc(function(){
                var resStr = "res/res_ui/qyq/hall/more_open.png";
                this.btn_more_club.loadTextures(resStr,resStr,"");
                this.moreClubHide = true;
            },this)));
        }

        var action1 = cc.moveBy(0.3,this.moreClubHide?300:-300,0);
        var action2 = cc.moveBy(0.3,this.moreClubHide?423:-423,0);
        var itemArr1 = [this.btn_wanfa,this.btn_chenyuan,this.btn_xiaozu,this.btn_zhanji,this.btn_tongji,this.btn_shezhi,this.btn_yaoqing];
        var itemArr2 = [this.room_bag_scroll,this.btn_refresh,this.btn_shouqi];
        if(!ClickClubModel.getIsSwitchCoin()) {
            for (var i = 0; i < itemArr1.length; ++i) {
                itemArr1[i].runAction(action1.clone());
            }
        }
        for(var i = 0;i<itemArr2.length;++i){
            itemArr2[i].runAction(action2.clone());
        }
    },

    onClickShouqiBtn:function(sender){
        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(0.3),cc.callFunc(function(){
            sender.setTouchEnabled(true);
        })));

        var btnArr1 = [this.btn_wanfa,this.btn_chenyuan,this.btn_xiaozu,this.btn_zhanji,this.btn_tongji,this.btn_shezhi,this.btn_yaoqing,this.btn_quickStart];
        var btnArr2 = [this.btn_bind,this.btn_bufang,this.btn_pifu,this.btn_show_all_table];
        if(ClickClubModel.getIsSwitchCoin()) {
            btnArr1 = [this.btn_wanfa, this.btn_chenyuan, this.btn_xiaozu, this.btn_zhanji, this.btn_tongji, this.btn_shezhi, this.btn_yaoqing, this.btn_quickStart, this.btn_show_all_table];
            btnArr2 = [this.btn_bind, this.btn_bufang, this.btn_pifu, this.btn_match_set];
        }
        var time = 0.2;
        var action1 = cc.sequence(cc.moveBy(time,0,-180),cc.fadeOut(0.1));
        var action2 = cc.sequence(cc.fadeIn(0.1),cc.moveBy(time,0,180));
        var action3 = cc.sequence(cc.moveBy(time,0,180),cc.fadeOut(0.1));
        var action4 = cc.sequence(cc.fadeIn(0.1),cc.moveBy(time,0,-180));

        if(this.isShouqiBtn){
            for(var i = 0;i<btnArr1.length;++i){
                btnArr1[i].runAction(action2.clone());
            }
            for(var i = 0;i<btnArr2.length;++i){
                btnArr2[i].runAction(action4.clone());
            }
            this.isShouqiBtn = false;
        }else{
            for(var i = 0;i<btnArr1.length;++i){
                btnArr1[i].runAction(action1.clone());
            }
            for(var i = 0;i<btnArr2.length;++i){
                btnArr2[i].runAction(action3.clone());
            }
            this.isShouqiBtn = true;
        }
        this.btn_shouqi.loadTextureNormal("res/res_ui/qyq/hall/" + (this.isShouqiBtn?"btn_zhankai.png":"btn_shouqi.png"));

    },

    updateTableList:function(data){
        //cc.log("============updateTableList==============" + data.length);

        var showData = [];
        for(var i = 0;i<data.length;++i){
            var isShow = true;
            if(!this.isShowLX && this.isHideStartTable){//是否隐藏开始桌
                isShow = data[i].notStart;
            }
            if(!this.isShowLX && ClickClubModel.getBagIsHide(data[i].configId)){
                isShow = false;
            }
            if(isShow){
                showData.push(data[i]);
            }
        }

        this.dataHandler.handleServerData(showData);

        this.tableArr = this.tableArr || [this.tableItem];

        this.unUseItemArr = [];
        this.tableIdCfg = {};
        for(var i = 0;i<this.tableArr.length;++i){
            var item = this.tableArr[i];
            item.setVisible(false);
            if((item.tempData && this.dataHandler.getItemData(item.tempData.tableId))){
                this.tableIdCfg[item.tempData.tableId] = item;
            }else{
                this.unUseItemArr.push(item);
            }
        }

        var showNum = 1;
        var createNum = 0;
        for(var i = 0;i<showData.length;++i){

            var item = this.tableIdCfg[showData[i].tableId];
            if(!item) {
                item = this.unUseItemArr.shift();
            }
            if(!item){
                var item = this.tableItem.clone();
                this.tableArr.push(item);
                this.tableScroll.addChild(item);
                createNum++;
            }

            var tempX = (cc.winSize.width - SyConfig.DESIGN_WIDTH)/4;

            item.x = 75 + (Math.floor((showNum)/2)*(450 + tempX));
            item.y = 370 - ((showNum)%2)*360;

            showNum++;

            var btn_table = item.getChildByName("btn_table")
            if(btn_table) btn_table.joinType = 1;//牌桌列表进入
            this.setTableItemData(item,showData[i]);

            if(createNum >= 30){
                break;
            }

        }
        var page = Math.ceil(showNum/8);

        if(this.curShowPage > page){
            this.curShowPage = page;
        }

        var contentW = this.tableScroll.width*page;
        if(this.tableScroll.getInnerContainerSize().width != contentW){
            var pos = this.tableScroll.getInnerContainerPosition();
            this.tableScroll.setInnerContainerSize(cc.size(contentW,this.tableScroll.height));
            pos.x = Math.max(this.tableScroll.width - contentW,pos.x);
            this.tableScroll.setInnerContainerPosition(pos);

            //if(page > 1){
                //var percent = (this.curShowPage - 1)/(page-1)*100;
                //this.tableScroll.jumpToPercentHorizontal(percent);
            //}
        }
    },

    setTableItemData:function(item,data){
        item.setVisible(true);

        var imgNameArr = this.getZhuoBgFile(data.playType,data.maxCount,data.configId);
        var zhuoBu = ccui.helper.seekWidgetByName(item,"zhuoBu");
        zhuoBu.loadTexture(imgNameArr[1]);

        var tableBg = item.getChildByName("table_bg");
        tableBg.loadTexture(imgNameArr[0]);

        if(item.tempData && this.dataHandler.isDataSame(item.tempData,data)){
            return;
        }

        item.tempData = data;

        var item_btn = item.getChildByName("btn_table");

        //var offsetY = 54;
        //var offsetX = 5;
        //if(data.maxCount == 4){
        //    offsetX = 2;
        //    offsetY = 53;
        //}
        //if(imgNameArr[2] == 2){
        //    offsetY = 58;
        //    if(data.maxCount == 2)offsetX = 7;
        //    if(data.maxCount == 4)offsetX = 3;
        //}
        //if(imgNameArr[2] == 3){
        //    offsetY = 48;
        //    offsetX = -5;
        //}
        //zhuoBu.setPosition(tableBg.width/2 + offsetX,tableBg.height/2 + offsetY);

        var offsetY = 70;

        if(imgNameArr[2] == 2){
            offsetY = 64;
        }else if(imgNameArr[2] == 3){
            offsetY = 48;
        }
        zhuoBu.setPositionY(tableBg.height/2 + offsetY);

        var label_table_name = ccui.helper.seekWidgetByName(item,"table_name");
        label_table_name.setString(data.tableName);


        item_btn.tempData = data;
        var xq_btn = item.getChildByName("btn_xq");
        xq_btn.tempData = data;


        item.getChildByName("icon_sai").setVisible(data.type == 2);

        //显示房间状态
        var stateStr = "";
        if (data.notStart){
            if(data.currentCount < data.maxCount){
                stateStr = "可加入";
            }else{
                stateStr = "待开局";
            }
        }else{
            stateStr = ("第"+(data.playedBureau+1)+"局");
        }

        if(ClickClubModel.getIsFzbHide()
            && (data.playType == GameTypeEunmPK.CDTLJ || data.playType == GameTypeEunmPK.XTSDH)
            && !ClickClubModel.isClubCreater()){
            stateStr = data.notStart?"准备中":"游戏中";
        }

        var label_tip_info = ccui.helper.seekWidgetByName(item,"table_tip_info");
        label_tip_info.setString(stateStr);
        var label_rule_num = ccui.helper.seekWidgetByName(item,"item_rule_num");
        label_rule_num.setString("");

        data.members = data.members || [];
        if(data.players){
            data.members = JSON.parse(data.players);
        }

        for(var j = 1;j<=4;++j){
            var playerNode = ccui.helper.seekWidgetByName(item,"head_img_" + j);

            if(ClickClubModel.getIsFzbHide()
                && (data.playType == GameTypeEunmPK.CDTLJ || data.playType == GameTypeEunmPK.XTSDH)
                && !ClickClubModel.isClubCreater()){
                if(data.maxCount == 3){
                    data.members = [{},{},{}];
                }else{
                    data.members = [{},{},{},{}];
                }
            }

            if(j <= data.members.length){
                playerNode.setVisible(true);
                var label_name = playerNode.getChildByName("player_name");
                label_name.setString(data.members[j-1].userName);

                var headImg = sy.HeadImgCfg[data.members[j-1].userId];

                //常德拖拉机屏蔽昵称和头像
                if(ClickClubModel.getIsFzbHide()
                    && (data.playType == GameTypeEunmPK.CDTLJ || data.playType == GameTypeEunmPK.XTSDH)
                    && !ClickClubModel.isClubCreater()){
                    label_name.setString("玩家");
                    headImg = "res/res_icon/icon_fang.png";
                }

                this.loadHeadImg(playerNode,headImg=="default"?"":headImg,data.members[j-1].sex);
                if(!headImg){
                    this.needImgIdArr.push(data.members[j-1].userId);
                    this.userIdCfgData[data.members[j-1].userId] = playerNode;
                }

                playerNode.getChildByName("icon_lixian").setVisible(data.members[j-1].isOnLine == 0);
            }else{
                playerNode.setVisible(false);
            }
        }
        var privateImg = item.getChildByName("simifang")
        if(privateImg) privateImg.removeFromParent(true)
        if(data.isPrivate == 1){
            privateImg = new cc.Sprite("res/res_ui/qyq/hall/simifang.png");
            privateImg.setPosition(item.width / 2, 42)
            privateImg.setName("simifang")
            item.addChild(privateImg);
        }
    },

    updateBagRoomList:function(){

        this.bagRoomArr = this.bagRoomArr || [];

        var showNum = 0;
        for(var i = 0;i<this.allBagsData.length;++i){
            if(!this.allBagsData[i].groupState)continue;

            var item = this.bagRoomArr[i];
            if(!item){
                var item = this.tableItem.clone();
                this.bagRoomArr[i] = item;
                this.bagScroll.addChild(item);
            }

            item.x = 50 + (Math.floor((showNum)/2)*300);
            item.y = 265 - ((showNum)%2)*240;

            var btn_table = item.getChildByName("btn_table")
            if(btn_table) btn_table.joinType = 1;//牌桌列表进入
            this.setBagRoomItemData(item,this.allBagsData[i]);
            showNum++;
        }
        var page = Math.ceil(showNum/8);

        if(this.curShowBagPage > page){
            this.curShowBagPage = page;
        }

        var contentW = this.bagScroll.width*page;
        if(this.bagScroll.getInnerContainerSize().width != contentW){
            this.bagScroll.setInnerContainerSize(cc.size(contentW,this.bagScroll.height));
            if(page > 1){
                var percent = (this.curShowBagPage - 1)/(page-1)*100;
                this.bagScroll.jumpToPercentHorizontal(percent);
            }
        }

        for(;i<this.bagRoomArr.length;++i){
            this.bagRoomArr[i].setVisible(false);
        }

        this.isHaveValidBag = (showNum > 0);
        if(!this.isHaveValidBag){
            this.showScrollLayer(1);
        }
    },

    setBagRoomItemData:function(item,data){
        item.setVisible(true);

        var item_btn = item.getChildByName("btn_table");
        var label_table_name = ccui.helper.seekWidgetByName(item,"table_name");
        var label_tip_info = ccui.helper.seekWidgetByName(item,"table_tip_info");
        var label_rule_num = ccui.helper.seekWidgetByName(item,"item_rule_num");
        var xq_btn = item.getChildByName("btn_xq");

        var createPara = data.config.modeMsg.split(",");
        var playerNum = ClubRecallDetailModel.getPlayerCount(createPara);

        var imgName = this.getZhuoBgFile(createPara[1],playerNum);
        item.getChildByName("table_bg").loadTexture(imgName);


        label_table_name.setString(data.groupName);

        UITools.addClickEvent(item_btn,this,this.onClickBagTable);
        UITools.addClickEvent(xq_btn,this,this.onClickBagXq);
        item_btn.tempData = data;
        xq_btn.tempData = data;

        var isCreditRoom = (data.type == 2);

        item.getChildByName("icon_sai").setVisible(isCreditRoom);
        label_tip_info.setString("可加入");
        label_rule_num.setString(data.groupId);

        for(var j = 1;j<=4;++j){
            var playerNode = ccui.helper.seekWidgetByName(item,"head_img_" + j);
            playerNode.setVisible(false);
        }
    },

    onClickBagTable:function(sender){
        sender.setTouchEnabled(false);
        this.runAction(cc.sequence(cc.delayTime(1),cc.callFunc(function(){
            sender.setTouchEnabled(true);
        })));

        var data = sender.tempData;
        var createPara = data.config.modeMsg.split(",");

        this.clickBtnType = 4;

        sy.scene.showLoading("正在创建");
        this.resp = true;
        var wanfa = createPara[1];
        this.modeId = data.config.keyId;
        sySocket.sendComReqMsg(29 , [parseInt(wanfa)] , "0");
    },

    onClickBagXq:function(sender){
        cc.log("============onClickBagXq===========");
        var pop = new ClubTablePop(sender.tempData,sender,1);
        PopupManager.addPopup(pop);
    },

    showScrollLayer:function(layerType){
        if(layerType == 1){
            this.curShowPageLayer = 1;
            this.room_bag_scroll.jumpToTop();
        }else if(layerType == 2){
            this.curShowPageLayer = 2;
            this.room_bag_scroll.jumpToBottom();
        }
    },

    checkShowScrollLayer:function(){
        var layerType = 1;

        var temp = cc.sys.localStorage.getItem("sy_club_default_show_scroll" + ClickClubModel.getCurClubId());
        if(temp == 2){
            layerType = 2;
        }

        this.showScrollLayer(layerType);
    },

    getZhuoBgFile:function(type,num,configId){
        var gameType = 1;

        if(GameTypeManager.isPK(type)){
            gameType = 2;//扑克
        }else if(GameTypeManager.isZP(type)){
            gameType = 3;//字牌
        }

        var zhuoType = 3;
        var buType = 0;

        if(this.zhuoBuCfgData[configId]){
            zhuoType = this.zhuoBuCfgData[configId][1];
            buType = this.zhuoBuCfgData[configId][2];
        }else{
            if(gameType == 2)buType = 1;
            else if(gameType == 3)buType = 9;
        }
        var zhuoImg = "res/ui/bjdmj/popup/pyq/zhuobu/zhuo_" + zhuoType + "_" + num + ".png";
        var buImg = "res/ui/bjdmj/popup/pyq/zhuobu/bu_" + zhuoType + "_" + buType + ".png";
        return [zhuoImg,buImg,zhuoType];
    },

    loadHeadImg:function(imgHead,url,sex){
        //url = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
        var imgSpr = null;
        var clipNode = imgHead.getChildByName("clipNode");

        var defaultimg = (sex == 1) ? "res/ui/common/default_m.png" : "res/ui/common/default_w.png";

        if(clipNode){
            imgSpr = clipNode.getChildByName("imgSpr");

        }else{
            var sten= new cc.Sprite("res/res_ui/qyq/hall/touxiang1.png");
            clipNode = new cc.ClippingNode();
            clipNode.attr({stencil:sten,anchorX:0.5,anchorY:0.5,x:imgHead.width/2,y:imgHead.height/2 + 1,alphaThreshold:0.1});
            imgSpr = new cc.Sprite(defaultimg);
            imgSpr.setScale(100/imgSpr.width);
            imgSpr.setName("imgSpr");
            clipNode.addChild(imgSpr);
            clipNode.setName("clipNode");
            imgHead.addChild(clipNode);
        }

        if(url){
            if(imgHead.url != url){
                imgHead.url = url;
                cc.loader.loadImg(url,{width: 252, height:252},function(error, texture){
                    if(!error){
                        imgSpr.setTexture(texture);
                    }else{
                        imgHead.url = null;
                        imgSpr.initWithFile(defaultimg);
                    }
                });
            }
        }else{
            imgHead.url = null;
            imgSpr.initWithFile(defaultimg);
        }

    },

    onClickTable:function(sender){

        var self = this;
        if(self.forbidClickTable)return;
        self.forbidClickTable = true;
        setTimeout(function(){
            self.forbidClickTable = false;
        },800);
        cc.log("============onClickTable===========");
        var wanfa = sender.tempData.playType;

        if((wanfa == GameTypeEunmPK.CDTLJ || wanfa == GameTypeEunmPK.XTSDH)){
            if(ClickClubModel.getCdtljKjzs() > 1){
                FloatLabelUtil.comText("该牌桌请选择玩法快速加入");
                return;
            }
        }

        if(sender.tempData.notStart){
            if(sender.tempData.isPrivate && sender.joinType == 1){
                var mc = new JoinRoomPop();
                PopupManager.addPopup(mc);
            }else{
            SyEventManager.dispatchEvent(SyEvent.UPDATE_SHOW_BAGWANFA, {modeId: sender.tempData.configId});
            this.joinRoom(sender.tempData.tableId,wanfa);
            }
        }else{
            //请求弹出房间细节框
            cc.log("req roomdetail msg");
            ComReq.comReqClugRoomDetail([], [ClickClubModel.clickClubId+"" , sender.tempData.keyId+""]);
        }
    },

    onClickTableXq:function(sender){
        cc.log("============onClickTableXq===========");
        var pop = new ClubTablePop(sender.tempData,sender,this.allBagsData);
        PopupManager.addPopup(pop);
    },

    joinRoom:function(tableId,wanfa){

        //var func = function(){
            this.tableId = tableId;
            this.clickBtnType = 2;//点击加入房间
            var str = "正在进入房间";
            sy.scene.showLoading(str);
            this.resp = true;
            cc.log(str+"..." , this.tableId);
            sySocket.sendComReqMsg(29 , [0] , this.tableId + "");
        //}.bind(this);

        //sy.scene.updatelayer.getUpdatePath(wanfa,func);
    },

    /**
     * 刷新显示当前选择的玩法
     * ***/
    onUpdateRuleTip:function(event){
        var data = event.getUserData();

        this.modeId = data.modeId;
        ClickClubModel.updateBagModeId(ClickClubModel.getCurClubId(),this.modeId);

        this.updateQuickTip();
    },

    //更新快速组局按钮的提示
    updateQuickTip:function(){
        var modeId = ClickClubModel.getCurClubBagModeId();
        var str = "";
        if (modeId){
            for(var index = 0 ; index < this.allBagsData.length; index++){
                var data = this.allBagsData[index];
                if (modeId == data.config.keyId && data.groupState && parseInt(data.groupState)){

                    str = "上次:" + data.groupName;
                }
            }
        }

        if(!str){
            ClickClubModel.updateBagModeId(ClickClubModel.getCurClubId(),"");
        }

        var tipLabel = ccui.helper.seekWidgetByName(this.btn_quickStart,"info_label");
        tipLabel.setString(str);
    },

    onClickCreateNew:function(){
        var mc = new ClubRuleManagePop(this.allBagsData,ClickClubModel.getCurClubBagModeId());
        PopupManager.addPopup(mc);
    },

    onExit:function(){
        cc.eventManager.removeListener(this.showLisener);
        cc.eventManager.removeListener(this.hideListener);

        //ccs.armatureDataManager.removeArmatureFileInfo("res/bjdani/kuaisuzuju/kuaisuzuju.ExportJson");

        this._super();
    },

    updateRoomsData:function(){
        if(this.clubDataList && this.clubDataList[this.curClubIdx]){
            //var page = Math.ceil((this.curShowPage*8-1)/this.maxRoomItem);
            this.getClubBagRoomsData();
        }
    },

    //获取房间数据
    getClubBagRoomsData:function(){
        var optType = 0;
        if(this.filtModeId > 0){
            optType = 1;
        }

        ComReq.comReqGetClubBagRoomsData([this.clubDataList[this.curClubIdx].groupId,optType],[String(this.filtModeId)]);
    },

    //获取包厢列表
    getClubBagData:function(){
        ComReq.comReqGetClubBagsData([this.clubDataList[this.curClubIdx].groupId],[]);
    },
});