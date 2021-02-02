/**
 * Created by zhoufan on 2016/11/29.
 */
var NXGHZSmallResultCell = ccui.Widget.extend({
	ctor:function(data,wanfa){
		this._super();
		var action = data.action;
		var cards = data.cards;
		var huxi = data.huxi || "";
		this.anchorX=0;
		this.anchorY=0;
        this.setContentSize(80,300);
		/*action
		* 5 碰
		* 6 吃
		* 14 坎
		* 3 歪
		* */
		if(action>=0){
			var imgName = ""
			if(cards.length >2){
				if(action == 3)imgName = "act3_1.png";
				if(action == 5)imgName = "act2.png";
				if(action == 6)imgName = "act6.png";
				if(action == 14)imgName = "act8.png";
			}

			var resStr = "res/res_phz/phzNewSmallResult/" + imgName;

			var header = new cc.Sprite(resStr);

            header.x = 42;
            header.y = 300;
			this.addChild(header);
		}
		var zorder = cards.length;
		for(var i=0;i<cards.length;i++){
			zorder--;
			var vo = PHZAI.getPHZDef(cards[i]);
			if(action==11 && i>0)
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

var onCardCell = ccui.Widget.extend({
	ctor:function(data){
		this._super();
		this.anchorX=0;
		this.anchorY=0;
		//this.scale = 0.8;
		this.setContentSize(80,300);
		var tempY = 50;
		for(var i=0;i<data.length;i++){
			var ishu = false;
			if(data[i].c==ClosingInfoModel.huCard){
				ishu = true;
			}
			data[i].ishu = ishu;
			var card = new PHZCard(PHZAI.getDisplayVo(this.direct,3),data[i]);
			card.x = 6;
			card.y = tempY+ i*48;
			this.addChild(card,data.length-i);
		}
	}
});

var NXGHZSmallResultPop=BasePopup.extend({
	pointInfo:null,
	isRePlay:null,
	ctor: function (data,isRePlay) {
		this.totalData = data;
		if(isRePlay){
			this.data = data;
		}else{
			this.data = data.closingPlayers;
		}
		this.isRePlay = isRePlay;
		var path = "res/phzNewSmallResult.json";
		this._super(path);
	},

	showXingPai:function(){
		var xingId = ClosingInfoModel.ext[11];
		if(xingId){
			var parent = this.getWidget("resultView");

			var labeltip = new cc.LabelTTF("醒牌","res/font/bjdmj/fznt.ttf",30);
			labeltip.setColor(cc.color.RED);
			labeltip.setPosition(1550,675);
			parent.addChild(labeltip,10);

			var vo = PHZAI.getPHZDef(xingId);
			var card = new PHZCard(PHZAI.getDisplayVo(this.direct,3),vo);
			card.x = labeltip.x - 28;
			card.y = labeltip.y - 100;
			card.scale = 1.2;
			parent.addChild(card,10);
		}
	},

	showWangReplace:function(){
		var data = ClosingInfoModel.ext[8];
		//cc.log("==========showWangReplace============",data);
		if(data){
			var parent = this.getWidget("resultView");
			var ids = data.split(";");

			for(var i = 0;i<ids.length;++i){
				var vo1 = PHZAI.getPHZDef(81);
				var card1 = new PHZCard(PHZAI.getDisplayVo(this.direct,3),vo1);
				card1.x = 1524 + i*60;
				card1.y = 765;
				card1.scale = 1.2;
				parent.addChild(card1,10);

				var vo = PHZAI.getPHZDef(ids[i]);
				var card = new PHZCard(PHZAI.getDisplayVo(this.direct,3),vo);
				card.x = card1.x;
				card.y = card1.y - 60;
				card.scale = 1.2;
				parent.addChild(card,11);
			}
		}
	},

	selfRender: function () {
		var isHuang = false;
		this.winUserId = 0;
		this.data.sort(function (user1 , user2){
			var point1 = parseInt(user1.point);
			var point2 = parseInt(user2.point);
			return  point1 < point2;
		});
		var myPoint = 0;
		var isYk = false;
		// cc.log("this.data=",JSON.stringify(this.data));
		for(var i=0;i<this.data.length;i++){
			if(this.data[i].seat == PHZRoomModel.mySeat || (this.isRePlay && this.data[i].userId == PlayerModel.userId)){
				myPoint = this.data[i].point;
				isYk = true;
			}
		}
		var Image_84 = this.getWidget("Image_84");
		var imgUrl = myPoint > 0 ? "res/res_gameCom/smallResult/sl.png" : "res/res_gameCom/smallResult/sb.png";

		for(var i=0;i<this.data.length;i++){
			if(this.data[i].point>0){
				break;
			}else if(this.data[i].point==0){
				isHuang = true;
				break;
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

		if(PHZRoomModel.wanfa == GameTypeEunmZP.LDS || PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ){
			this.showXingPai();
			this.showWangReplace();
		}
		var mingtangList = []
		if(PHZRoomModel.wanfa == GameTypeEunmZP.NXGHZ) {
			//大卓版
			mingtangList = ["行行息：100息", "多息：30息", "对子息：200息", "全黑胡：150息", "乌对胡：300息",
				"一点红：100息", "十三红：150息", "", "全求人：100息", "十对：300息", "大字胡：300息", "小字胡：300息",
				"海底胡：50息", "天胡：100息", "报听：100息", "背靠背：50息", "手牵手：50息"];

			if (ClosingInfoModel.ext[14] == 0) {
				mingtangList = ["行行息：60息", "多息：15息", "对子息：100息", "全黑胡：80息", "乌对胡：120息",
					"一点红：60息", "十三红：80息", "", "全求人：60息", "十对：120息", "大字胡：120息", "小字胡：120息",
					"海底胡：30息", "天胡：60息", "报听：60息", "背靠背：30息", "手牵手：30息"];
			}
		}else if(PHZRoomModel.wanfa == GameTypeEunmZP.YYWHZ){
			mingtangList = ["对子息：8番","大字胡：8番","小字胡：8番","火火翻：2番","行行息：4番","黑胡子：8番","黑对子胡：32番","天地胡：4番","一点红：4番",
				"海底捞：4番","报听：4番","神腰：2番","","名堂：2番","名堂：2番","名堂：2番","名堂：64番"]
		}
		var str = "";
		var tunStr = ""

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

			if(this.data[i].point > 0){
				if(PHZRoomModel.wanfa == GameTypeEunmZP.NXGHZ) {
					if (this.data[i].qingHao > 0) {
						str += "基础分：" + this.data[i].qingHao + "息 "
					}
					if (this.data[i].waiHao > 0) {
						str += "坎歪溜：" + this.data[i].waiHao + "息 "
					}
					if (this.data[i].neiYuanNum > 0) {
						str += "内豪：" + this.data[i].neiYuanNum + "息 "
					}
					if (this.data[i].waiYuanNum > 0) {
						str += "外豪：" + this.data[i].waiYuanNum + "息 "
					}
					var dahus = this.data[i].dahus
					if (dahus) {
						for (var j = 0; j < dahus.length; j++) {
							if (dahus[j] == 6) {
								var hongCount = 0	//红字数量
								for (var k = 0; k < this.data[i].mcards.length; k++) {
									var cards = this.data[i].mcards[k].cards
									for (var t = 0; t < cards.length; t++) {
										var voArray = PHZAI.getPHZDef(cards[t])
										if (voArray.n == 2 || voArray.n == 7 || voArray.n == 10) {
											hongCount++;
										}
									}
								}
								if (ClosingInfoModel.ext[14] == 0) {
									mingtangList[6] = "十三红：" + (80 + (hongCount - 13) * 10) + "息"
								}else{
									mingtangList[6] = "十三红：" + (150 + (hongCount - 13) * 30) + "息"
								}
							}
							if (mingtangList[dahus[j]]) {
								str = str + mingtangList[dahus[j]] + " "
							}
						}
					}
				}else if(PHZRoomModel.wanfa == GameTypeEunmZP.YYWHZ){
					if (this.data[i].qingHao > 0) {
						str += "胡息：" + this.data[i].qingHao + "息 "
					}
					if (this.data[i].neiYuanNum > 0) {
						str += "内元：" + (this.data[i].neiYuanNum*4) + "番 "
					}
					if (this.data[i].waiYuanNum > 0) {
						str += "外元：" + (this.data[i].waiYuanNum*2) + "番 "
					}
					var dahus = this.data[i].dahus
					if (dahus) {
						for (var j = 0; j < dahus.length; j++) {
							if(dahus[j] == 4 && dahus[j+1] > 100){
								mingtangList[3] = "火火翻：" + Math.pow(2,(dahus[j+1]-100+1)) + "番"
							}
							if (mingtangList[dahus[j]-1]) {
								str = str + mingtangList[dahus[j]-1] + " "
							}
						}
					}
				}
				//str = str + "共计：" + this.data[i].point
			}
		}

		str = str + tunStr;

		this.getWidget("dataLabel").setString(str);/**  牌型显示 **/

		this.list = this.getWidget("ListView_6");

		for (var i = 0; i < this.data.length; i++) {
			if (this.data[i].point > 0) {
				var mcards = this.data[i].mcards
				for (var j = 0; j < mcards.length; ++j) {

					if (mcards[j].action >= 0) {
						var cell = new NXGHZSmallResultCell(mcards[j], PHZRoomModel.wanfa);
						this.list.pushBackCustomItem(cell);
					} else {
						var otherCards = mcards[j].cards || [];
						var cardVo = PHZAI.getVoArray(otherCards);//剩余的牌
						var result = PHZAI.sortHandsVo(cardVo);
						for (var k = 0; k < result.length; k++) {
							var cell = new onCardCell(result[k]);
							this.list.pushBackCustomItem(cell);
						}
					}
				}
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
		if(PHZRoomModel.is2Ren()){
			maipaiPanel.visible=false;
		}

		/*天胡 +10,地胡 +10,自摸 +10,
		 胡牌时只有一张红字，一点朱  翻倍,
		 胡牌时有10-12张红字，小红胡  翻倍,
		 胡牌时有13张红字或以上,大红胡 +60,
		 胡牌时全是黑字，乌胡 +60*/
		//ClosingInfoModel.fanTypes = [1,2,3,4,5,6,7];

		var intParams = this.isRePlay?PHZRePlayModel.intParams:PHZRoomModel.intParams;
		this.resultView = this.getWidget("resultView");
		this.roomView = this.getWidget("roomView");

		this.Button_2 = this.getWidget("Button_2");
		this.Button_Ready = this.getWidget("btnReady");
		UITools.addClickEvent(this.Button_2,this,this.onOk);
		UITools.addClickEvent(this.Button_Ready,this,this.onOk);
		this.Button_zm = this.getWidget("Button_15");
		this.Button_toResultView = this.getWidget("btnToResultView");

		UITools.addClickEvent(this.Button_zm,this,this.onZhuoMian);
		UITools.addClickEvent(this.Button_toResultView , this, this.onJieSuan);
		this.onJieSuan();
		var btn_jiesan = this.getWidget("btn_jiesan");
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
		this.getWidget("Label_jushu").setString(jushuStr);
		//玩法显示
		var wanfaStr = "";
		this.getWidget("Label_wanfa").setString(wanfaStr);
		if(this.isRePlay){
			this.getWidget("Label_jushu").setString("第" + PHZRePlayModel.playCount + "局");
		}
		this.getWidget("replay_tip").visible =  this.isRePlay;

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
		//user.icon = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
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

        var defaultimg = "res/res_gameCom/default_m.png";
        var sprite = new cc.Sprite(defaultimg);
		var icon = ccui.helper.seekWidgetByName(widget,"icon");
        //sprite.scale=0.98;
		sprite.x = icon.width / 2;
		sprite.y = icon.height / 2;
		icon.addChild(sprite,5,345);
		//sprite.setScale(1.05);
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
			var layer = LayerFactory.HOME;
			if(LayerManager.getCurrentLayer() != layer){
				LayerManager.showLayer(layer);
			}
			PopupManager.remove(this);
			return;
		}

		if (ClosingInfoModel.ext[6] == 1) {//最后的结算
			PopupManager.remove(this);
			var mc = new NXGHZBigResultPop(this.totalData);
			PopupManager.addPopup(mc);
			var obj = HongBaoModel.getOneMsg();
			if (obj) {
				var mc = new HongBaoPop(obj.type, obj.data);
				PopupManager.addPopup(mc);
			}
		} else {
			if (PHZRoomModel.isStart) {
				PHZRoomModel.cleanSPanel();
				PopupManager.remove(this);
				sySocket.sendComReqMsg(3);
			} else {
				sySocket.sendComReqMsg(3);
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

	}
});
