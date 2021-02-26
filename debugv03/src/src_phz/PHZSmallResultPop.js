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
			if (vo.ishu){
				cc.log("vo===",JSON.stringify(vo))
			}
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
		var mingtangList = ["  天胡     +10","  地胡     +10","  自摸     +10",
			"一点朱     x2","小红胡     x2","大红胡     +60","  乌胡     +60"];
		var str = "";
		var tunStr = ""
		if (PHZRoomModel.wanfa == GameTypeEunmZP.SYZP){
			mingtangList = ["  天胡     +10","  地胡     +10","  自摸     +10",
				"一点朱     x2","小红胡     x2","  红胡     x2","  黑胡     x2"];
			if (ClosingInfoModel.tun){
				tunStr = "\n"+"囤数:" + ClosingInfoModel.tun
			}
		}
		if (PHZRoomModel.wanfa == GameTypeEunmZP.LDFPF){
			mingtangList = ["  天胡     +100","  地胡     +100","  自摸     x2",
				"一点朱     x2"," 十红     x2","  十三红     +100","  乌胡     +100",
				"一块扁     x2","海底捞     x2","  20卡     x2","  30卡     +100","  飘胡     +30"
			];
		}

		if (PHZRoomModel.wanfa == GameTypeEunmZP.CZZP){
			var intParams = this.isRePlay?PHZRePlayModel.intParams:PHZRoomModel.intParams;
			mingtangList = ["  自摸     2番","  毛胡     =15",intParams[14] == 3?"  一点朱     2番":"  一点朱     4番",
				intParams[14] == 3?"小红胡     2番":"小红胡     3番",intParams[14] == 3?"大红胡     2番":" 大红胡     5番",
				intParams[14] == 3?"黑胡     2番":"  黑胡     5番","  放炮     "+ ClosingInfoModel.ext[7] + "番"];
			if (ClosingInfoModel.tun){
				tunStr = "\n"+"囤数:" + ClosingInfoModel.tun
			}
		}

		if (PHZRoomModel.wanfa == GameTypeEunmZP.LYZP){
			mingtangList = ["  自摸     2番","  天胡     2番","  举手     2番","  一点朱     2番","  红胡     2番","  黑胡     2番",
				"  无胡     =21","  小卡胡     =16","  大卡胡     =24","  点炮     "];
			//cc.log("ClosingInfoModel.tun =",ClosingInfoModel.tun);
			if (ClosingInfoModel.tun){
				tunStr = "\n"+"囤数:" + ClosingInfoModel.tun
			}
		}

		if (PHZRoomModel.wanfa == GameTypeEunmZP.ZHZ){
			var fenshu20 = "+20分";
			var fenshu40 = "+40分";
			if (ClosingInfoModel.intParams && ClosingInfoModel.intParams[5]==1){
				fenshu20 = "+10分"
				fenshu40 = "+10分"
			}
			mingtangList = ["  点胡     +10分","  碰碰胡     "+fenshu20,"  小一色     "+fenshu20,"  大一色     "+fenshu20,"  十红     "+fenshu20,"  黑胡     "+fenshu20,
				"  七对     "+fenshu20,"  板板胡     +10分","  一挂匾     +10分","  句句红     +10分","  满堂红     +40分","  蝴蝶飞     "+fenshu20,"  四碰单吊     "+fenshu40,
				"  十二红     +20分","  十一红     +20分"];
		}

		if (PHZRoomModel.wanfa == GameTypeEunmZP.WHZ){
			mingtangList = ["  行行息    60息","  一对    100息","  对子息    100息","  全黑    100息","  一点红    60息",
				"  十三红    80息", "  无对    120息","  全大    100息","  全小    100息","  海捞    30息",
				"  天胡    100息","  地胡    100息","  听胡    60息","  全求人    60息","  飘分    0",
				"  内豪    20息","  溜豪    30息","  散豪    40息","  外豪    10息"];
		}

		var intParams = this.isRePlay?PHZRePlayModel.intParams:PHZRoomModel.intParams;
		var exHaoFen = 0;
		var exMingTangFen = 0;
		if(intParams && intParams[10] == 2){//豪分加10
			exHaoFen = 10;
		}
		if(intParams && intParams[11] == 2){//名堂分加20
			exMingTangFen = 20;
		}

		if (PHZRoomModel.wanfa == GameTypeEunmZP.HYLHQ){
			mingtangList = ["  自摸     2番","  小红胡     2番","  大红胡     4番","  一点红     3番","  黑胡     5番","  地胡     2番",
				"  天胡     2番"];
			// cc.log("ClosingInfoModel.tun =",ClosingInfoModel.tun);
			if(intParams[2] == 1){
				mingtangList = ["  自摸     2番","  小红胡     2番","  大红胡     2番","  一点红     3番","  黑胡     2番","  地胡     2番",
					"  天胡     2番"];
			}
			if (ClosingInfoModel.tun){
				tunStr = "\n"+"囤数:" + ClosingInfoModel.tun + "\n";
			}
		}

		if (PHZRoomModel.wanfa == GameTypeEunmZP.HYSHK){
			mingtangList = ["  自摸     2倍","  小红胡     3番","  大红胡     5番","  一点红     " + (ClosingInfoModel.intParams[20] == 1?"3":"4") +"番","  黑胡     5番","  地胡     2番",
				"  天胡     2番","  飘胡      ","  海底胡     2番","  十红     3番","  放炮     " + ClosingInfoModel.intParams[12] + "倍"];
			// cc.log("ClosingInfoModel.tun =",ClosingInfoModel.tun);
			if (ClosingInfoModel.tun){
				tunStr = "\n"+"囤数:" + ClosingInfoModel.tun + "\n";
			}
		}
		if (PHZRoomModel.wanfa == GameTypeEunmZP.LSZP){
			mingtangList = ["  自摸     2倍","  放炮     3番"];
			// cc.log("ClosingInfoModel.tun =",ClosingInfoModel.tun);
			if (ClosingInfoModel.tun){
				tunStr = "\n"+"囤数:" + ClosingInfoModel.tun + "\n";
			}
		}
		if (PHZRoomModel.wanfa == GameTypeEunmZP.GLZP){
			if (ClosingInfoModel.tun){
				tunStr = "\n"+"囤数:" + ClosingInfoModel.tun + "\n";
			}
		}

		if (PHZRoomModel.wanfa == GameTypeEunmZP.XXEQS){
			mingtangList = ["自摸：","自摸红字：","庄分：","充分：","红字："];
		}

		if(PHZRoomModel.wanfa == GameTypeEunmZP.WHZ){
			// cc.log("==========ClosingInfoModel.fanTypes============" + JSON.stringify(ClosingInfoModel.fanTypes));
			if (ClosingInfoModel.fanTypes) {
				for (var i = 0; i < ClosingInfoModel.fanTypes.length; i++) {
					if (ClosingInfoModel.fanTypes[i] > 0 && mingtangList[i]) {
						var temp = mingtangList[i].match(/\d+/);
						if (temp) {
							var num = parseInt(temp);
							if (i == 5 && ClosingInfoModel.fanTypes[i] > 1) {
								num = num + (ClosingInfoModel.fanTypes[i] - 1) * 10;
							}
							if (i >= 0 && i < 14 && exMingTangFen > 0)num += exMingTangFen;
							if (i > 14 && i < 19 && exHaoFen > 0)num += exHaoFen;
							if (i == 14)num = ClosingInfoModel.fanTypes[i];

							mingtangList[i] = mingtangList[i].replace(/\d+/, String(num));
						}

						if (i == 6 && ClosingInfoModel.fanTypes[i] == 2) {
							mingtangList[i] = mingtangList[i].replace("无对", "十对");
						}
						if (i == 1 && ClosingInfoModel.fanTypes[i] == 2) {
							mingtangList[i] = mingtangList[i].replace("一对", "九对");
						}

						str += mingtangList[i];
						if (ClosingInfoModel.fanTypes[i] > 1 && (i != 5) && (i != 14) && (i != 6) && (i != 1)) {
							str += ("x" + ClosingInfoModel.fanTypes[i]);
						}
						str += "\n";
					}
				}
			}
		}else if(PHZRoomModel.wanfa == GameTypeEunmZP.LDS){
			var configObj = {1:"王钓    4番",2:"王钓王    8番",3:"王闯    8番",4:"王闯王    16番",5:"王炸    16番",
				6:"一点红    3番",7:"红胡    2番",8:"黑胡    4番",9:"全红    4番",10:"自摸    2番",11:"天胡    2番",12:"地胡    2番"};

			var xingScore = ClosingInfoModel.ext[10];
			if(xingScore >= 0){
				var xingType = intParams[5] == 1?"翻醒    ":"跟醒    ";
				str += (xingType + (xingScore/3) + "\n");
				str += ("囤数    " + (Number(xingScore) + Number(ClosingInfoModel.huxi)) + "\n");
			}

			var data = ClosingInfoModel.fanTypes || [];

			for(var i=0;i<data.length;i++) {
				if(configObj[data[i]]){
					str += configObj[data[i]];
				}
				str += "\n";
			}
		}else if(PHZRoomModel.wanfa == GameTypeEunmZP.JHSWZ){
			var configObj = {1:"王钓    4番",2:"王钓王    8番",3:"王闯    8番",4:"王闯王    16番",5:"王炸    16番",
				6:"一点红    3番",7:"红胡    2番",8:"黑胡    4番",9:"全红    4番",10:"自摸    2番",11:"天胡    2番",12:"地胡    2番"};

			var xingScore = ClosingInfoModel.ext[10];
			if(xingScore >= 0){
				var xingType = intParams[5] == 1?"翻醒    ":"跟醒    ";
				str += (xingType + xingScore + "\n");
				str += ("囤数    " + (Number(xingScore) + Number(ClosingInfoModel.huxi)) + "\n");
			}

			var data = ClosingInfoModel.fanTypes || [];

			for(var i=0;i<data.length;i++) {
				if(configObj[data[i]]){
					str += configObj[data[i]];
				}
				str += "\n";
			}
		}else if(PHZRoomModel.wanfa == GameTypeEunmZP.YZCHZ){
			var configObj = {1:"王钓    4番",2:"王钓王    8番",3:"王闯    8番",4:"王闯王    16番",5:"王炸    16番",6:"王炸王    32番",
				7:"一点红    3番",8:"红胡    2番",9:"黑胡    4番",10:"红转点    3番",11:"红转黑    4番",12:"自摸    2番"};

			var xingScore = ClosingInfoModel.ext[10];
			if(xingScore >= 0){
				var xingType = intParams[5] == 1?"翻醒    ":"跟醒    ";
				str += (xingType + (xingScore) + "\n");
				var tun = Number(xingScore);
				var qihu = intParams[14] || 15;
				if(ClosingInfoModel.huxi >= qihu)tun+=(2 + Math.floor((ClosingInfoModel.huxi - qihu)/3));
				str += ("囤数    " + tun + "\n");
			}

			var data = ClosingInfoModel.fanTypes || [];

			for(var i=0;i<data.length;i++) {
				if(configObj[data[i]]){
					str += configObj[data[i]];
				}
				str += "\n";
			}

		}else if (PHZRoomModel.wanfa == GameTypeEunmZP.XXGHZ){
			var data = ClosingInfoModel.fanTypes || [];
			var configObj = {
				1:"  天胡    +100",2:"  地胡(十红) +100",3:"  自摸    +10",
				4:" 一点红    x2",5:" 红胡(十红)  x2",6:" 红乌(甲红) +100",
				7:"  黑胡    +100", 8:" 大字胡    x2",9:" 小字胡   x2",
				10:"", 11:" 放炮    +10",12:" 30胡息(十红) +100",
				13:" 放炮    +10",14:" 30胡息   x2",15:" 地胡    x2",
				16:" 地胡   +100"
			};
			for(var i=0;i<data.length;i++) {
				if(configObj[data[i]]){
					str += configObj[data[i]];
				}
				str += "\n";
			}
		}else if (PHZRoomModel.wanfa == GameTypeEunmZP.XXPHZ){
			var data = ClosingInfoModel.fanTypes || [];
			var configObj = {
				1:"  天胡     x2", 4:" 一点红    x2",5:"  红胡     x2",
				7:"  黑胡     x2", 15:" 地胡    x2"
			};
			for(var i=0;i<data.length;i++) {
				if(configObj[data[i]]){
					str += configObj[data[i]];
				}
				str += "\n";
			}
			if (ClosingInfoModel.tun){
				tunStr = "\n"+"囤数:" + ClosingInfoModel.tun + "\n";
			}
		}else if (PHZRoomModel.wanfa == GameTypeEunmZP.XTPHZ){
			var data = ClosingInfoModel.fanTypes || [];
			var configObj = {
				1:"  天胡  ",2:"  自摸加3胡  ",3:"  自摸加番  ",4:" 一点红 ",
				5:"  红胡  ",7:"  黑胡  ",8:" 大字胡 ",
				9:" 小字胡 ",10:" 碰碰胡 ",14:" 30胡息 ",
				15:" 地胡  "
			};
			for(var i=0;i<data.length;i++) {
				if(configObj[data[i]]){
					str += configObj[data[i]];
				}
				str += "\n";
			}
		}else if (PHZRoomModel.wanfa == GameTypeEunmZP.AHPHZ){
			var data = ClosingInfoModel.fanTypes || [];
			var configObj = {
				3:"  自摸  +2番 ",4:" 一点红  +3番 ",5:"  大红胡  +4番 ",
				6:"  小红胡  +2番 ", 7:"  黑胡  +5番 ", 16:" 18小 +6番 ",
				17:" 三提五坎 +6番 ", 18:" 自摸 +1囤 ",19:" 爬坡 x2 ",
				20:" 自摸加翻加囤 "
			};
			for(var i=0;i<data.length;i++) {
				if(configObj[data[i]]){
					str += configObj[data[i]];
				}
				str += "\n";
			}
		}else if(PHZRoomModel.wanfa == GameTypeEunmZP.NXPHZ){
			var data = ClosingInfoModel.fanTypes || [];
			var configObj = {
				1:" 红胡 ",2:" 飘胡 ",3:" 扁胡 ",4:" 点胡 ",5:" 十三红 ",
				6:" 黑胡 ",7:" 碰碰胡 ",8:" 十六小 ",9:" 十八大 ",10:" 天胡 ",
				11:" 地胡 ",12:" 海底胡 ",13:" 自摸 "
			};
			for(var i=0;i<data.length;i++) {
				if(configObj[Math.floor(data[i] / 100)]){
					if(Math.floor(data[i] / 100) == 13 && ClosingInfoModel.intParams[31] > 0){//自摸且加分
						str += configObj[Math.floor(data[i] / 100)] + " + "+ data[i]%100 + "分";
					}else{
						str += configObj[Math.floor(data[i] / 100)] + "   " + data[i]%100 + "倍";
					}
				}
				str += "\n";
			}
			if (ClosingInfoModel.tun){
				if(data.length < 4){
					tunStr += "\n";
				}
				if(ClosingInfoModel.tun != 0 && ClosingInfoModel.intParams[34] > 0){
					tunStr += "扎鸟+"+ClosingInfoModel.intParams[34] + "  "+ "共计:"+ClosingInfoModel.tun + "\n";
				}else{
					tunStr += "共计:"+ClosingInfoModel.tun + "\n";
				}
			}
		}else if(PHZRoomModel.wanfa == GameTypeEunmZP.HSPHZ){
			if (ClosingInfoModel.tun){
				str += "囤数:" + ClosingInfoModel.tun + "\n";
			}
			var data = ClosingInfoModel.fanTypes || [];
			var configObj = {
				1:" 红胡 ",4:" 点胡 ",5:" 红乌 ",
				6:" 黑胡 ",7:" 对子胡 "
			};
			for(var i=0;i<data.length;i++) {
				if(configObj[Math.floor(data[i] / 100)]){
					if(Math.floor(data[i] / 100) == 13 && PHZRoomModel.intParams[31] > 0){//自摸且加分
						str += configObj[Math.floor(data[i] / 100)] + " + "+ data[i]%100 + "分";
					}else{
						str += configObj[Math.floor(data[i] / 100)] + "   " + data[i]%100 + "倍";
					}
				}
				str += "\n";
			}
			if(ClosingInfoModel.fan){
				tunStr += "总分数:" + ClosingInfoModel.fan + "\n";
			}
		}else if (PHZRoomModel.wanfa == GameTypeEunmZP.SMPHZ
			|| PHZRoomModel.wanfa == GameTypeEunmZP.CDPHZ
			|| PHZRoomModel.wanfa == GameTypeEunmZP.HHHGW){
			var tempFan = 0;
			var data = ClosingInfoModel.fanTypes || [];
			//cc.log(" 当前小结数据 ",JSON.stringify(data));
			var configObj = {
				1:"  天胡 ",4:"  点胡 ",5:"  红胡 ",
				6:"  红乌 ", 7:"  黑胡 ", 8:" 大字胡 ",
				9:"  小胡 ", 10:" 对子胡 ",15:" 地胡 ",
				18:"  自摸 ",19:"  黄番 ",21:"  海胡 ",22:"  听胡 ",
				23:"  对子胡 ",24:"  耍猴 ",25:"  团胡 ",
				26:"  红胡 ",27:"  点胡 ",28:"  黑胡 "
			};

			if(PHZRoomModel.wanfa == GameTypeEunmZP.CDPHZ){
				configObj[25] = "  大团圆 ";
				configObj[29] = "  行行息 ";
				configObj[30] = "  假行行 ";
				configObj[31] = "  四七红 ";
				configObj[32] = "  背靠背 ";
				configObj[33] = "  对子胡 ";
			}
			if(PHZRoomModel.wanfa == GameTypeEunmZP.HHHGW){
				configObj[10] = configObj[33] = " 碰碰胡 ";
				configObj[8] = " 十八大 ";
				configObj[9] = " 十六小 ";
				configObj[7] = configObj[28] = " 乌胡 ";
				configObj[21] = " 海底胡 ";
				configObj[3] = " 自摸 ";
			}

			var menziStr = "";
			for(var i=0;i<data.length;i++) {
				if(data[i]){
					var tempVal = parseInt(data[i]);
					var tunshu = tempVal % 100;
					tempVal = Math.floor(tempVal/100);
					var tempTunStr = (tempVal % 10) === 0 ? "囤" : "番";
					if((tempVal % 10) === 1){
						tempFan += tunshu;
					}
					tempVal = Math.floor(tempVal/10);
					var typeVal = tempVal % 100;
					if(configObj[typeVal]){
						if(typeVal == 19){
							menziStr += configObj[typeVal] + "*" + tunshu;
						}else{
							menziStr += configObj[typeVal] + "+" + tunshu + tempTunStr;
						}
					}
				}
				menziStr += "\n";
			}

			if(ClosingInfoModel.tun > 0){
				str += "囤数: "+ClosingInfoModel.tun + "\n";
			}
			if(ClosingInfoModel.fan > 0){
				str += "番数: "+ClosingInfoModel.fan + "\n";
			}
			str += menziStr;
			if(ClosingInfoModel.totalTun){
				str += "共计:"+ClosingInfoModel.totalTun + "\n";
			}
		}else if(PHZRoomModel.wanfa == GameTypeEunmZP.GLZP){
			var data = ClosingInfoModel.fanTypes || [];
			var configObj = {
				2:" 自摸 " + intParams[19] + " 倍 ",1:" 放炮 " + intParams[12] + " 倍 "
			};
			if(configObj[data[0]]){
				str += configObj[data[0]] + "\n";
			}

		}else if(PHZRoomModel.wanfa == GameTypeEunmZP.XXEQS){
			if (ClosingInfoModel.fanTypes){
				for(var i=0;i<ClosingInfoModel.fanTypes.length;i++) {
					if (ClosingInfoModel.fanTypes[i] > 0){
						str = str + mingtangList[i] + ClosingInfoModel.fanTypes[i] + "\n"
					}
				}
			}
		}else if(PHZRoomModel.wanfa == GameTypeEunmZP.DYBP){
			var confingData = {1:"  天胡     +10",2:"  地胡     +10",3:"  自摸     +10",
				4:"一点朱     x2",5:"小红胡     x2",6:"大红胡     60",7:"  乌胡     60"};
			var tempFanTypes = ClosingInfoModel.fanTypes || [];

			var otherConfingData = {1:"  天胡     x2",2:"  地胡     x2"};

			cc.log(" 小结算消息 ");
			cc.log(" 小结门子 tempFanTypes = ",JSON.stringify(tempFanTypes));

			var isZiMo = false;

			//先算名堂
			for(var i=0;i<tempFanTypes.length;i++) {
				if (confingData[tempFanTypes[i]]){
					if(parseInt(tempFanTypes[i]) >= 4){
						str = str + confingData[tempFanTypes[i]] + "\n";
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
						str = str + otherConfingData[tempFanTypes[i]] + "\n";
					}else{
						str = str + confingData[tempFanTypes[i]] + "\n";
					}
				}
			}

			if(isZiMo){
				str = str + confingData[3] + "\n";
			}
		}else if(PHZRoomModel.wanfa == GameTypeEunmZP.WCPHZ){
			if (ClosingInfoModel.fanTypes){
				for(var i=0;i<ClosingInfoModel.fanTypes.length;i++) {
					if (ClosingInfoModel.fanTypes[i] == 18){
						str = str + "自摸+1牌" + "\n"
					}
				}
			}
			for(var i=0;i<this.data.length;i++){
				if(this.data[i].point > 0){
					if(this.data[i].strExt[12] &&this.data[i].strExt[12] > 0)
						str = str + "坐飘" + this.data[i].strExt[12] +"分"+ "\n"
					if(this.data[i].strExt[11] &&this.data[i].strExt[11] != -1)
						str = str + "飘" + this.data[i].strExt[11]+"分"+ "\n"
				}
			}
		}else{
			if (ClosingInfoModel.fanTypes){
				for(var i=0;i<ClosingInfoModel.fanTypes.length;i++) {
					for(var j=0;j<mingtangList.length;j++) {
						if (ClosingInfoModel.fanTypes[i] == j + 1){
							str = str + mingtangList[j] + "\n"
						}
					}
				}
			}
		}
		if (PHZRoomModel.wanfa == GameTypeEunmZP.HYLHQ){
			str = tunStr + str;
			var xingStr = intParams[10] == 1?"  跟醒     ":"  翻醒     ";
			if (ClosingInfoModel.intParams[10]>0)
				str = xingStr+ ClosingInfoModel.ext[26]  + str;
		}else if (PHZRoomModel.wanfa == GameTypeEunmZP.HYSHK){
			str = tunStr + str;
			var xingStr = intParams[10] == 1?"  跟醒     ":"  翻醒     ";
			if (ClosingInfoModel.intParams[10]>0)
				str = xingStr+ ClosingInfoModel.ext[26]  + str;
		}else if (PHZRoomModel.wanfa == GameTypeEunmZP.GLZP){
			if(xingSeat !== -1 && this.data[xingSeat]){
				str += "数醒  +" + this.data[xingSeat].point;
				if(!isHuang){
					var score = this.data[xingSeat].point + this.data[huSeat].point;
					this.getWidget("nowPoint").setString("共计:" + score);
					if(PHZRoomModel.mySeat == this.data[xingSeat].seat){
						Image_84.loadTexture("res/res_phz/phzSmallResult/image_win.png");
					}
				}
			}
			str = tunStr + str;
			var xingStr = intParams[10] == 1?"  跟醒     ":"  翻醒     ";
			str = xingStr+ ClosingInfoModel.ext[26]  + str;
		}else{
			str = str + tunStr;
		}

		if(ClosingInfoModel.huxi>0){
			str += "胡息: " + ClosingInfoModel.huxi + "  ";
		}
		// str = str + tunStr;

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

