var PHZSmallResultCell = ccui.Widget.extend({
	ctor:function(data,wanfa){
		this._super();
		var action = data.action;
		var cards = data.cards || [];
		var huxi = data.huxi || "";
		this.anchorX=0;
		this.anchorY=0;
		this.setContentSize(80,300);
		if(action!=0){
			if(action==10)
				action=3;

			var resStr = "res/res_phz/phzNewSmallResult/act"+action+".png";
			var header = new cc.Sprite(resStr);
			header.x = 42;
			header.y = 300;
			this.addChild(header);
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
			vo.ishu = ishu;
			var card = new PHZCard(PHZAI.getDisplayVo(this.direct,3),vo);
			card.x = 6;
			card.y = i * 48*1.2;
			card.scale = 1.2;
			this.addChild(card,zorder);
		}
		var label = UICtor.cLabel(huxi+"",42,cc.size(90,42),cc.color(209,102,72),1,1);
		label.x = 42;
		label.y = -30;
		this.addChild(label);
	}
});

var PHZSmallResultPop=BasePopup.extend({
	pointInfo:null,
	isRePlay:null,
	ctor: function (data,isRePlay) {
		this.data = data;
		this.isRePlay = isRePlay;
		var path = "res/phzNewSmallResult.json";
		this._super(path);
	},

	selfRender: function () {
		this.addCustomEvent(SyEvent.SOCKET_OPENED,this,this.onSuc);
		this.addCustomEvent(SyEvent.GET_SERVER_SUC,this,this.onChooseCallBack);
		this.addCustomEvent(SyEvent.NOGET_SERVER_ERR,this,this.onChooseCallBack);


		var isHuang = false;
		this.winUserId = 0;
		this.data.sort(function (user1 , user2){
			var point1 = parseInt(user1.point);
			var point2 = parseInt(user2.point);
			return  point1 < point2;
		});
		var myPoint = 0;
        var isYk = false;
		for(var i=0;i<this.data.length;i++){
			if(this.data[i].seat == PHZRoomModel.mySeat || (this.isRePlay && this.data[i].userId == PlayerModel.userId)){
				myPoint = this.data[i].point;
                isYk = true;
			}
		}
		var Image_84 = this.getWidget("Image_84");
		var imgUrl = myPoint > 0 ? "res/res_gameCom/smallResult/sl.png" : "res/res_gameCom/smallResult/sb.png";

		if(PHZRoomModel.wanfa == GameTypeEunmZP.SYBP){
			if(ClosingInfoModel.huSeat){/**/

			}else{
				isHuang = true;
			}
		}else{
			for(var i=0;i<this.data.length;i++){
				if(this.data[i].point>0){
					break;
				}else if(this.data[i].point==0){
					isHuang = true;
					break;
				}
			}
		}

        if(this.isRePlay && !isYk){
            imgUrl = "res/res_gameCom/smallResult/sl.png";
        }

		if(isHuang){
			imgUrl = "res/res_gameCom/smallResult/hj.png";
		}

		Image_84.loadTexture(imgUrl);

		if(this.data.length==3){
			this.getWidget("user4").visible = false;
		}else if(this.data.length==2){
			this.getWidget("user4").visible = false;
			this.getWidget("user3").visible = false;
		}

		var xingSeat = -1;
		var huSeat = -1;
		for(var i=0;i<this.data.length;i++){
			if(this.isSpecialPHZ()){
				this.refreshSingle(this.getWidget("user"+(i+1)),this.data[i],this.pointInfo[i] , i);
			}else {
				this.refreshSingle(this.getWidget("user"+(i+1)),this.data[i] , "" , i);
			}
			if(this.data[i].seat == this.data[i].isShuXing){
				xingSeat = i;
			}
			if(ClosingInfoModel.huSeat == this.data[i].seat){
				huSeat = i;
			}
		}
		this.list = this.getWidget("ListView_6");
		var cards = ClosingInfoModel.cards;

		for(var i=0;i<cards.length;i++){
			if(cards[i].cards.length > 4){
				for(var t = 0;t<cards[i].cards.length/2;++t){
					var tempCards = cards[i].cards.slice(t*2,t*2+2);
					var data = ObjectUtil.deepCopy(cards[i]);
					data.cards = tempCards;
					var cell = new PHZSmallResultCell(data,PHZRoomModel.wanfa);
					this.list.pushBackCustomItem(cell);
				}
			}else{
				var cell = new PHZSmallResultCell(cards[i],PHZRoomModel.wanfa);
				this.list.pushBackCustomItem(cell);
			}
		}

		var leftCards = ClosingInfoModel.leftCards;
		var dipaiPanel = this.getWidget("Panel_dipai");
		var localNum = 13;
        var offX = 62;
		var scaleNum = 1;
		for(var i=0;i<leftCards.length;i++){
			var index = i;
			var vo = PHZAI.getPHZDef(leftCards[i]);
			if (i == 0){
				vo.ishu = true;
			}
			var card = new PHZCard(PHZAI.getDisplayVo(this.direct,3),vo);
			var diffY = card.getContentSize().height * 0.96;
			card.scale = scaleNum;
			var numY = Math.floor(index/localNum);
			var numX = index%localNum;
			card.x = 150 + numX * offX * scaleNum;
			card.y = card.y - diffY * numY - 15;
			dipaiPanel.addChild(card);
		}
		var maipaiPanel = this.getWidget("Panel_maipai");
		var maiPaiCards = ClosingInfoModel.chouCards;
		if (maiPaiCards && maiPaiCards.length > 0){
            maipaiPanel.y += 245;
            maipaiPanel.visible=true;
            localNum = 5;
			for(var i=0;i<maiPaiCards.length;i++){
				var card = new PHZCard(PHZAI.getDisplayVo(this.direct,3),PHZAI.getPHZDef(maiPaiCards[i]));
				var diffY = card.getContentSize().height *0.96;
				var numY = Math.floor(i/localNum);
				var numX = i%localNum;
				card.x = 100 + numX * offX;
				card.y = card.y - diffY * numY - 15;
				maipaiPanel.addChild(card);
			}
		}else{
			maipaiPanel.visible=false;
		}

		/*天胡 +10,地胡 +10,自摸 +10,
		 胡牌时只有一张红字，一点朱  翻倍,
		 胡牌时有10-12张红字，小红胡  翻倍,
		 胡牌时有13张红字或以上,大红胡 +60,
		 胡牌时全是黑字，乌胡 +60*/
		//ClosingInfoModel.fanTypes = [1,2,3,4,5,6,7];
		var mingtangList = ["天胡  +10  ","地胡  +10  ","自摸 +10  ",
			"一点朱 x2  ","小红胡 x2  ","大红胡 +60  ","乌胡  +60  "];
		var str = "";
		var tunStr = "";
		if (PHZRoomModel.wanfa == GameTypeEunmZP.SYZP){
			mingtangList = ["天胡  +10  ","地胡  +10  ","自摸  +10  ",
				"一点朱 x2 ","小红胡  x2 ","红胡 x2 ","黑胡  x2  "];
			if (ClosingInfoModel.tun){
				tunStr = "囤数: " + ClosingInfoModel.tun + "  ";
			}
		}

		if (PHZRoomModel.wanfa == GameTypeEunmZP.AHPHZ){
			var data = [3,4,5,6,7,16,17,18,19,20]//ClosingInfoModel.fanTypes || [];
			var configObj = {
				3:"自摸  +2番 ",4:"一点红 +3番 ",5:"大红胡 +4番 ",
				6:"小红胡 +2番 ", 7:"黑胡  +5番  ", 16:"18小  +6番 ",
				17:"三提五坎 +6番 ", 18:"自摸 +1囤 ",19:"爬坡  x2  ",
				20:"自摸加翻加囤 "
			};
			for(var i=0;i<data.length;i++) {
				if(configObj[data[i]]){
					str += configObj[data[i]];
				}
			}
		}else if(PHZRoomModel.wanfa == GameTypeEunmZP.DYBP){
			var confingData = {1:"天胡  +10  ",2:"地胡  +10  ",3:"自摸  +10  ",
				4:"一点朱 x2 ",5:"小红胡 x2 ",6:"大红胡  60 ",7:"乌胡  60  "};
			var tempFanTypes = ClosingInfoModel.fanTypes || [];

			var otherConfingData = {1:"天胡 x2  ",2:"地胡  x2  "};

			var isZiMo = false;

			//先算名堂
			for(var i=0;i<tempFanTypes.length;i++) {
				if (confingData[tempFanTypes[i]]){
					if(parseInt(tempFanTypes[i]) >= 4){
						str = str + confingData[tempFanTypes[i]];
					}
					if(!isZiMo && tempFanTypes[i] == 3){
						isZiMo = true;
					}
				}
			}

			//再算天地胡
			for(var i=0;i<tempFanTypes.length;i++) {
				if (otherConfingData[tempFanTypes[i]]){
					if(ClosingInfoModel.intParams[31] == 2){
						str = str + otherConfingData[tempFanTypes[i]];
					}else{
						str = str + confingData[tempFanTypes[i]];
					}
				}
			}

			if(isZiMo){
				str = str + confingData[3];
			}
		}else{
			if (ClosingInfoModel.fanTypes){
				for(var i=0;i<ClosingInfoModel.fanTypes.length;i++) {
					for(var j=0;j<mingtangList.length;j++) {
						if (ClosingInfoModel.fanTypes[i] == j + 1){
							str = str + mingtangList[j];
						}
					}
				}
			}
		}

		if(ClosingInfoModel.huxi>0){
			str += "胡息: " + ClosingInfoModel.huxi + "  ";
		}
		str = str + tunStr;

		this.getWidget("dataLabel").setString(str);/**  牌型显示 **/

		this.resultView = this.getWidget("resultView");
		this.roomView = this.getWidget("roomView");

		this.Button_2 = this.getWidget("Button_2");
		this.Button_Ready = this.getWidget("btnReady");
		UITools.addClickEvent(this.Button_2,this,this.onOk);
		UITools.addClickEvent(this.Button_Ready,this,this.onOk);

		this.Button_zm = this.getWidget("Button_15");
		this.Button_toResultView = this.getWidget("btnToResultView");

		var xipai_btn = this.getWidget("xipai_btn");
		UITools.addClickEvent(xipai_btn,this,function(){
			sySocket.sendComReqMsg(4501,[],"");
			this.issent = true;
			PopupManager.remove(this);
			this.onOk();
		});
		if(PHZRoomModel.nowBurCount == PHZRoomModel.totalBurCount || ClosingInfoModel.ext[6] == 1){
			xipai_btn.visible = false;
		}else{
			xipai_btn.visible = PHZRoomModel.creditConfig[10] == 1;
		}
		var xpkf = PHZRoomModel.creditXpkf ? PHZRoomModel.creditXpkf.toString() : 0;
		this.getWidget("label_xpkf").setString(xpkf);

		UITools.addClickEvent(this.Button_zm,this,this.onZhuoMian);
		UITools.addClickEvent(this.Button_toResultView , this, this.onJieSuan);
		this.onJieSuan();
		var btn_jiesan = this.getWidget("btn_jiesan");
        btn_jiesan.visible = !this.isRePlay;

		UITools.addClickEvent(btn_jiesan,this,this.onBreak);

		var btn_handXq = this.getWidget("btn_handXq");
		UITools.addClickEvent(btn_handXq,this,this.onHandCard);

		//版本号
		if(this.getWidget("Label_version")){
			this.getWidget("Label_version").setString(SyVersion.v);
		}
		var date = new Date();
		var hours = date.getHours().toString();
		hours = hours.length < 2 ? "0"+hours : hours;
		var minutes = date.getMinutes().toString();
		minutes = minutes.length < 2 ? "0"+minutes : minutes;
		if(this.getWidget("Label_time")){
			this.getWidget("Label_time").setString(hours+":"+minutes);
		}

		this.getWidget("Label_roomnum").setString("房间号:"+ClosingInfoModel.ext[0]);
		var jushuStr = "第" + PHZRoomModel.nowBurCount + "局";
		if (PHZRoomModel.wanfa == GameTypeEunmZP.SYZP){
			jushuStr = "第" + PHZRoomModel.nowBurCount + "/" + PHZRoomModel.totalBurCount + "局 ";
		}
		this.getWidget("Label_jushu").setString(jushuStr);
		//玩法显示
		var wanfaStr = "";
		this.getWidget("Label_wanfa").setString(wanfaStr);
		if(this.isRePlay){
			var str = "第" + PHZRePlayModel.playCount + "局";
			this.getWidget("Label_jushu").setString(str);
		}

		if (this.isRePlay){
			this.getWidget("replay_tip").visible =  true;
		}else{
			this.getWidget("replay_tip").visible =  false;
		}
	},

	isSpecialPHZ:function(){
		return (ClosingInfoModel.ext[3] == 38 && ClosingInfoModel.ext[7] == 4)
	},

    onClickUserBg:function(event){
        var data = event.temp;
        var mc = new PHZUserHandCardPop(data);
        PopupManager.addPopup(mc);
    },

	refreshSingle:function(widget,user,pointInfo , index){
		// cc.log("index..." , index);
		// user.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";

		if(user.isShuXing){
			if(user.seat == user.isShuXing){
				ccui.helper.seekWidgetByName(widget,"sx").visible = true;
			}else{
				ccui.helper.seekWidgetByName(widget,"sx").visible = false;
			}
		}else{
			ccui.helper.seekWidgetByName(widget,"sx").visible = false;
		}

        var Button_click = ccui.helper.seekWidgetByName(widget,"Button_click");
        Button_click.temp = user;
        UITools.addClickEvent(Button_click,this,this.onClickUserBg);

		ccui.helper.seekWidgetByName(widget,"name").setString(user.name);
		ccui.helper.seekWidgetByName(widget, "uid").setString("UID:" + user.userId);
		var icon = ccui.helper.seekWidgetByName(widget,"icon");
		var defaultimg = "res/res_gameCom/default_m.png";
		var sprite = new cc.Sprite(defaultimg);
		//sprite.scale=0.98;
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

		var point = ccui.helper.seekWidgetByName(widget,"point");

		var pointStr = "";

		if (parseInt(user.point) > 0 ){
			pointStr = "+" + user.point;
		}else{
			pointStr = "" + user.point;
		}

		point.setString(pointStr);

		if (user.totalPoint != null ){
			var totalPointStr = "累计:" + user.totalPoint;
			var totalPoint = ccui.helper.seekWidgetByName(widget,"totalPoint");
			totalPoint.setString(totalPointStr);

		}

		//增加房主的显示
		if(user.userId == ClosingInfoModel.ext[1]){
			var fangzhu = new cc.Sprite("res/res_phz/fangzhu.png");
			fangzhu.anchorX = fangzhu.anchorY = 1;
            fangzhu.x = icon.width;
            fangzhu.y = icon.height;
            icon.addChild(fangzhu,10);
		}
		if (index == 0){
			var nowPoint = this.getWidget("heiji");
			nowPoint.setString("共计:" + user.point);
		}
	},

	onOk:function(){
		if(ClosingInfoModel.isReplay || !LayerManager.isInRoom()){
			if (ClosingInfoModel.isReplay){
				LayerManager.showLayer(LayerFactory.HOME);
			}
			PopupManager.remove(this);
			return;
		}
		var data = this.data;
		// var isDjtgEnd = 0;
		if(ClosingInfoModel.ext[3] == GameTypeEunmZP.SYZP || ClosingInfoModel.ext[3] == 36 || ClosingInfoModel.ext[3] == 38){
			if(PHZRoomModel.nowBurCount == PHZRoomModel.totalBurCount || ClosingInfoModel.ext[6] == 1){//最后的结算
				PopupManager.remove(this);
				var mc = new PHZBigResultPop(data);
				PopupManager.addPopup(mc);
				var obj = HongBaoModel.getOneMsg();
				if(obj){
					var mc = new HongBaoPop(obj.type,obj.data);
					PopupManager.addPopup(mc);
				}
			}else{
				if (PHZRoomModel.isStart){
					PHZRoomModel.cleanSPanel();
					PopupManager.remove(this);
					sySocket.sendComReqMsg(3);
				}else{
					sySocket.sendComReqMsg(3);
				}
			}
		}else{
			if(ClosingInfoModel.ext[6] == 1){//最后的结算
				PopupManager.remove(this);
				var mc = new PHZBigResultPop(data);
				PopupManager.addPopup(mc);
				var obj = HongBaoModel.getOneMsg();
				if(obj){
					var mc = new HongBaoPop(obj.type,obj.data);
					PopupManager.addPopup(mc);
				}
			}else{
				if (PHZRoomModel.isStart){
					PHZRoomModel.cleanSPanel();
					PopupManager.remove(this);
					sySocket.sendComReqMsg(3);
				}else{
					sySocket.sendComReqMsg(3);
				}
			}
		}
	},

	onBreak:function(){
		PHZAlertPop.show("解散房间需所有玩家同意，确定要申请解散吗？",function(){
			sySocket.sendComReqMsg(7);
		})
	},

	onHandCard:function(){
		var mc = new PHZHandCardPop(this.data,ClosingInfoModel.ext[1] , this.winUserId);
		PopupManager.open(mc,true);
	},

	onJieSuan:function(){
		this.resultView.visible = true;
		this.roomView.visible = false;
	},

	onZhuoMian:function(){
		this.resultView.visible = false;
		this.roomView.visible = true;

	},

	//金币场继续游戏
	moneyRoomStartAnother:function(){
		var data = CheckJoinModel.getJoinMatchData();
		if(data){
			CheckJoinModel.toMatchRoom(data.playType,data.matchType,data.keyId);
		}else{
			PopupManager.remove(this);
			LayerManager.showLayer(LayerFactory.HOME);
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

	onSuc:function(){
		sy.scene.hideLoading();
		if(this.clickStartAnother){
			this.clickStartAnother = false;
			var keyId = GoldRoomConfigModel.curClickRoomkeyId;
			var goldRoomId = GoldRoomConfigModel.goldRoomId;
			// cc.log("onSuc===",keyId,goldRoomId);
			sySocket.sendComReqMsg(2,[],[""+keyId,""+goldRoomId],1);
		}
	},
});

