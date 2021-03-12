///**
// * Created by zhoufan on 2016/11/29.
// */
//var YJGHZSmallResultCell = cc.Node.extend({
//    ctor:function(data,huId){
//        this._super();
//		this.setAnchorPoint(0,0);
//        this.setContentSize(50,300);
//
//		var action = data.action;
//		var cards = data.cards;
//        if(action>=0){
//			var imgName = "";
//			if(cards.length >2){
//				if(action == 1 || action == 11)imgName = "phz_act_1.png";
//				if(action == 2)imgName = "phz_act_2.png";
//				if(action == 3)imgName = "phz_act_3.png";
//				if(action == 5)imgName = "phz_act_5.png";
//				if(action == 6)imgName = "phz_act_6.png";
//			}
//
//			if(imgName){
//				var header = new cc.Sprite("res/res_phz/yjghz/ghzTypeImg/" + imgName);
//				header.setPosition(20,235);
//				// header.setScale(0.8);
//				this.addChild(header);
//			}
//
//			var zorder = cards.length;
//			for(var i=0;i<cards.length;i++){
//				zorder--;
//				var vo = PHZAI.getPHZDef(cards[i]);
//
//				if ((action == YJGHZAction.TI || action == YJGHZAction.LIU_WEI)&& i != 0)
//					vo.a = 1;
//				if (action == YJGHZAction.WEI) {
//					if(cards.length>=2 && i != 0)
//						vo.a = 1;
//				}
//
//				vo.ishu = (cards[i]==huId);
//				var card = new PHZCard(PHZAI.getDisplayVo(1,3),vo);
//				// card.setScale(0.88);
//				card.setPosition(0,i * 48);
//				this.addChild(card,zorder);
//			}
//        }else{
//
//			var voArray = [];
//			for(var i=0;i<cards.length;i++){
//				voArray.push(PHZAI.getPHZDef(cards[i]));
//			}
//			var result = PHZAI.sortHandsVo(voArray);
//			for(var i=0;i<result.length;i++){
//				var vo = result[i];
//				var zorder = vo.length;
//				for(var j=vo.length-1;j>=0;j--) {
//
//					vo[j].ishu = (vo[j].c == huId);
//					var card = new PHZCard(PHZAI.getDisplayVo(1, 3), vo[j]);
//					// card.setScale(0.88);
//					card.setPosition(i*50,j * 48);
//					this.addChild(card,zorder);
//					zorder++;
//				}
//			}
//		}
//
//    }
//});
//
//var YJGHZSmallResultItem = cc.Node.extend({
//	ctor:function(){
//		this._super();
//
//		this.initNode();
//	},
//
//	setItemWithData:function(data){
//		if(data.point > 0){
//			this.nodeBg.setColor(cc.color(255,230,230));
//		}
//
//		this.label_name.setString(data.name);
//		this.label_id.setString("ID:" +data.userId);
//		this.showIcon(data.icon);
//
//		var point = data.point;
//		if(point > 0) point = "+" + point;
//		this.label_point.setString("本局:" + point);
//
//		var totalPoint = data.totalPoint;
//		if(totalPoint > 0) totalPoint = "+" + totalPoint;
//		this.label_total.setString("累计:" + totalPoint);
//
//		this.icon_fangzhu.setVisible(data.userId == ClosingInfoModel.ext[1]);
//		this.icon_zhuang.setVisible(data.seat == ClosingInfoModel.ext[11]);
//
//		this.addTypeCards(data.mcards,ClosingInfoModel.huCard);
//
//		var imgArr = [];
//		var yuanArr = [];
//
//		var dahuData = data.dahus || [];
//		for(var i = 0;i<dahuData.length;++i){
//			if(dahuData[i] >= 0 && dahuData[i] <= 17){
//				imgArr.push("res/res_phz/yjghz/ghzTypeImg/phz_dahu_" + dahuData[i] + ".png");
//			}
//		}
//
//		if(data.neiYuanNum > 0){
//			yuanArr.push({img:"res/res_phz/yjghz/ghzTypeImg/phz_dahu_15.png",num:data.neiYuanNum});
//		}
//		if(data.waiYuanNum > 0){
//			yuanArr.push({img:"res/res_phz/yjghz/ghzTypeImg/phz_dahu_16.png",num:data.waiYuanNum});
//		}
//
//		this.addTypeImg(imgArr,yuanArr);
//	},
//
//	initNode:function(){
//		var bg = new cc.Scale9Sprite("res/res_phz/phzSmallResult/img_bgkuang.png");
//		bg.setContentSize(1875,248);
//		this.addChild(bg);
//
//		this.nodeBg = bg;
//
//		var headKuang = new cc.Sprite("res/res_phz/phzSmallResult/testIconK.png");
//		headKuang.setPosition(100,bg.height/2 + 30);
//		bg.addChild(headKuang,1);
//
//		var sten=new cc.Sprite("res/res_phz/default_m.png");
//		var clipnode = new cc.ClippingNode();
//		clipnode.setStencil(sten);
//		clipnode.setAlphaThreshold(0.8);
//		this.iconSpr = new cc.Sprite("res/res_phz/default_m.png");
//		// this.iconSpr.setScale(80/this.iconSpr.width);
//		clipnode.setPosition(headKuang.getPosition());
//		clipnode.addChild(this.iconSpr);
//		bg.addChild(clipnode);
//
//		this.label_name = new cc.LabelTTF("玩家的名字","res/font/bjdmj/fznt.ttf",32);
//		this.label_name.setPosition(headKuang.x,headKuang.y - 80);
//		this.label_name.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
//		this.label_name.setDimensions(cc.size(150,40));
//		this.label_name.setColor(cc.color(128,51,6));
//		bg.addChild(this.label_name);
//
//		this.label_id = new cc.LabelTTF("ID:1234567","res/font/bjdmj/fznt.ttf",32);
//		this.label_id.setPosition(this.label_name.x,this.label_name.y - 30);
//		this.label_id.setColor(cc.color(128,51,6));
//		bg.addChild(this.label_id);
//
//		this.label_point = new cc.LabelTTF("本局:+100","res/font/bjdmj/fznt.ttf",34);
//		this.label_point.setAnchorPoint(0,0.5);
//		this.label_point.setPosition(bg.width - 225,bg.height/2 + 20);
//		this.label_point.setColor(cc.color(128,51,6));
//		bg.addChild(this.label_point);
//
//		this.label_total = new cc.LabelTTF("累计:+100","res/font/bjdmj/fznt.ttf",34);
//		this.label_total.setAnchorPoint(0,0.5);
//		this.label_total.setPosition(this.label_point.x,bg.height/2 - 20);
//		this.label_total.setColor(cc.color(128,51,6));
//		bg.addChild(this.label_total);
//
//		this.icon_fangzhu = new cc.Sprite("res/res_phz/fangzhu.png");
//		this.icon_fangzhu.setAnchorPoint(0,0);
//		this.icon_fangzhu.setPosition(75,75);
//		headKuang.addChild(this.icon_fangzhu);
//
//		this.icon_zhuang = new cc.Sprite("res/res_phz/Z_zhuang.png");
//		this.icon_zhuang.setScale(0.8);
//		this.icon_zhuang.setPosition(20,20);
//		headKuang.addChild(this.icon_zhuang);
//
//	},
//
//	addTypeCards:function(typeData,huId){
//		var sten=new cc.Scale9Sprite("res/res_phz/yjghz/dadi1.png");
//		sten.setContentSize(this.nodeBg.getContentSize());
//		sten.setAnchorPoint(0,0);
//
//		var clipnode = new cc.ClippingNode();
//		clipnode.attr({stencil:sten,anchorX:0.5,anchorY:0.5,x:0,y:8,alphaThreshold:0.8});
//		this.nodeBg.addChild(clipnode,1);
//
//		for(var i = 0;i<typeData.length;++i){
//			var cell = new YJGHZSmallResultCell(typeData[i],huId);
//			cell.setPosition(200 + i*50,-17);
//			clipnode.addChild(cell);
//		}
//	},
//
//	addTypeImg:function(imgArr,yuanArr){
//
//		var typeH = 40;
//		var startY = this.nodeBg.height/2 + (imgArr.length - 1)/2*typeH;
//		for(var i = 0;i<imgArr.length;++i){
//			var spr = new cc.Sprite(imgArr[i]);
//			spr.setPosition(this.nodeBg.width/2 + 180,startY - i*typeH);
//			this.nodeBg.addChild(spr);
//		}
//
//		var startY = this.nodeBg.height/2 + (yuanArr.length - 1)/2*typeH;
//		for(var i = 0;i<yuanArr.length;++i){
//			var spr = new cc.Sprite(yuanArr[i].img);
//			spr.setPosition(this.nodeBg.width/2 + 320,startY - i*typeH);
//			this.nodeBg.addChild(spr);
//
//			var num = new cc.Sprite("res/res_phz/yjghz/ghzTypeImg/phz_num_" + yuanArr[i].num +".png");
//			num.setPosition(spr.x + spr.width/2 + 20,spr.y);
//			this.nodeBg.addChild(num);
//		}
//	},
//
//	showIcon: function (iconUrl, sex) {
//		// iconUrl = "http://wx.qlogo.cn/mmopen/25FRchib0VdkrX8DkibFVoO7jAQhMc9pbroy4P2iaROShWibjMFERmpzAKQFeEKCTdYKOQkV8kvqEW09mwaicohwiaxOKUGp3sKjc8/0";
//		var sex = sex || 1;
//		var defaultimg = "res/res_phz/default_m.png";
//
//		if (iconUrl) {
//			var self = this;
//			cc.loader.loadImg(iconUrl, {width: 252, height: 252}, function (error, img) {
//				if (!error) {
//					self.iconSpr.setTexture(img);
//					// self.iconSpr.setScale(80/self.iconSpr.width);
//				}
//			});
//		}else{
//			this.iconSpr.initWithFile(defaultimg);
//		}
//	},
//});
//
//var YJGHZSmallResultPop= cc.Layer.extend({
//	pointInfo:null,
//	isRePlay:null,
//    ctor: function (data,isRePlay) {
//		this._super();
//
//        this.data = data;
//        this.isRePlay = isRePlay;
//
//		cc.eventManager.addListener(cc.EventListener.create({
//			event: cc.EventListener.TOUCH_ONE_BY_ONE,
//			swallowTouches: true,
//			onTouchBegan:function(touch,event){
//				return true;
//			}
//		}), this);
//
//		this.initLayer();
//		this.setLayerInfo();
//		this.addPlayerItem(this.data.closingPlayers || []);
//    },
//
//	onClose : function(){
//	},
//	onOpen : function(){
//	},
//	onDealClose:function(){
//	},
//
//	setLayerInfo:function(){
//		var idStr = "房间号:" + ClosingInfoModel.ext[0];
//
//		var jushuStr = "第" + PHZRoomModel.nowBurCount + "/" + PHZRoomModel.totalBurCount + "局 ";
//		if(this.isRePlay){
//			jushuStr = "第" + PHZRePlayModel.playCount + "局";
//		}
//
//		this.label_room_id.setString(idStr + " " + jushuStr);
//
//		var date = new Date();
//		var hours = date.getHours();
//		if(hours < 10)hours = "0" + hours;
//		var minutes = date.getMinutes();
//		if(minutes < 10)minutes = "0" + minutes;
//
//		this.label_time.setString(SyVersion.v + " 时间:" + hours + ":" + minutes);
//
//		var wanfaStr = "";
//		if(this.isRePlay){
//
//		}else{
//			wanfaStr = ClubRecallDetailModel.getYJGHZWanfa(PHZRoomModel.intParams);
//		}
//
//		this.label_rule.setString(wanfaStr);
//
//		var renshu = 3;
//		if(this.data && this.data.closingPlayers){
//			renshu = this.data.closingPlayers.length;
//		}
//
//		this.showLeftCards(ClosingInfoModel.leftCards || [],renshu);
//
//		this.label_tip.setVisible(this.isRePlay);
//	},
//
//	addPlayerItem:function(players){
//		var itemHeight = 250;
//		for(var i = 0;i<players.length;++i){
//			var item = new YJGHZSmallResultItem();
//			item.setPosition(cc.winSize.width/2,cc.winSize.height - 248 - i*itemHeight);
//			item.setItemWithData(players[i]);
//			this.contentNode1.addChild(item,1);
//		}
//	},
//
//	initLayer:function(){
//		var contentNode1 = new cc.Node();
//		this.addChild(contentNode1);
//
//		var gray = new cc.LayerColor(cc.color.BLACK);
//		contentNode1.addChild(gray);
//
//		var contentNode2 = new cc.Node();
//		this.addChild(contentNode2);
//
//		var bg1 = new cc.Sprite("res/res_phz/phzSmallResult/smallResultBg.png");
//		bg1.setAnchorPoint(0.5,0);
//		bg1.setPosition(cc.winSize.width/2,0);
//		contentNode1.addChild(bg1);
//
//		var bg2 = new cc.Scale9Sprite("res/res_phz/phzSmallResult/iconBg.png");
//		bg2.setContentSize(1905,880);
//		bg2.setPosition(cc.winSize.width/2,cc.winSize.height/2 + 5);
//		contentNode1.addChild(bg2);
//
//		var img = "res/res_phz/phzSmallResult/btnJixuyouxi.png";
//		this.btn_ready = new ccui.Button(img,img,"");
//		this.btn_ready.setPosition(cc.winSize.width/2 + 350,40 +15);
//		this.btn_ready.addTouchEventListener(this.onClickBtn,this);
//		contentNode1.addChild(this.btn_ready,1);
//
//		var img = "res/res_phz/phzSmallResult/btnShoupai.png";
//		this.btn_spxq = new ccui.Button(img,img,"");
//		this.btn_spxq.setPosition(cc.winSize.width/2,this.btn_ready.y);
//		this.btn_spxq.addTouchEventListener(this.onClickBtn,this);
//		contentNode1.addChild(this.btn_spxq,1);
//
//		var img = "res/res_phz/phzSmallResult/btnZhuomian.png";
//		this.btn_show_table = new ccui.Button(img,img,"");
//		this.btn_show_table.setPosition(cc.winSize.width/2 - 350,this.btn_ready.y);
//		this.btn_show_table.addTouchEventListener(this.onClickBtn,this);
//		contentNode1.addChild(this.btn_show_table,1);
//
//		// this.btn_ready.setScale(0.9);
//		// this.btn_show_table.setScale(0.9);
//		// this.btn_spxq.setScale(0.9);
//
//		var img = "res/res_phz/phzSmallResult/btnJiesan.png";
//		this.btn_jiesan = new ccui.Button(img,img,"");
//		this.btn_jiesan.setPosition(cc.winSize.width/2 + 840,cc.winSize.height - 40);
//		this.btn_jiesan.addTouchEventListener(this.onClickBtn,this);
//		contentNode1.addChild(this.btn_jiesan,1);
//
//		this.label_room_id = new cc.LabelTTF("房间号:123456 局数:1/12","res/font/bjdmj/fznt.ttf",28);
//		this.label_room_id.setAnchorPoint(1,0.5);
//		this.label_room_id.setPosition(cc.winSize.width/2 + 675,cc.winSize.height - 50);
//		contentNode1.addChild(this.label_room_id);
//
//		this.label_time = new cc.LabelTTF("v1.2.3 时间:12:12","res/font/bjdmj/fznt.ttf",28);
//		this.label_time.setAnchorPoint(1,0.5);
//		this.label_time.setPosition(this.label_room_id.x,cc.winSize.height - 25);
//		contentNode1.addChild(this.label_time);
//
//
//		var tempStr = "玩法规则测试 玩法规则测试 玩法规则测试 玩法规则测试 玩法规则测试 玩法规则测试 玩法规则测试 玩法规则测试";
//		this.label_rule = new cc.LabelTTF(tempStr,"res/font/bjdmj/fznt.ttf",28);
//		this.label_rule.setDimensions(cc.size(500,0));
//		this.label_rule.setAnchorPoint(0,0.5);
//		this.label_rule.setPosition(cc.winSize.width/2 - 960,cc.winSize.height - 50);
//		contentNode1.addChild(this.label_rule);
//
//		this.label_tip = new cc.LabelTTF("回放","res/font/bjdmj/fznt.ttf",34);
//		this.label_tip.setPosition(cc.winSize.width/2,cc.winSize.height - 30);
//		contentNode1.addChild(this.label_tip);
//
//
//		var img = "res/res_phz/phzSmallResult/btnJixuyouxi.png";
//		this.btn_ready2 = new ccui.Button(img,img,"");
//		this.btn_ready2.setPosition(cc.winSize.width/2 + 262,cc.winSize.height/2);
//		this.btn_ready2.addTouchEventListener(this.onClickBtn,this);
//		contentNode2.addChild(this.btn_ready2,1);
//
//		var img = "res/res_phz/phzSmallResult/btnXiaojie.png";
//		this.btn_jsxq = new ccui.Button(img,img,"");
//		this.btn_jsxq.setPosition(cc.winSize.width/2 - 262,cc.winSize.height/2);
//		this.btn_jsxq.addTouchEventListener(this.onClickBtn,this);
//		contentNode2.addChild(this.btn_jsxq,1);
//
//		var img = "res/res_phz/phzSmallResult/xipai.png";
//		var xipai_btn = new ccui.Button(img,img,"");
//		xipai_btn.setPosition(cc.winSize.width/2 + 700,this.btn_ready.y);
//		xipai_btn.addTouchEventListener(this.onClickBtn,this);
//		contentNode1.addChild(xipai_btn,1);
//		UITools.addClickEvent(xipai_btn,this,function(){
//			sySocket.sendComReqMsg(4501,[],"");
//			PopupManager.remove(this);
//			this.onOk();
//		});
//		var bisaiImg = new cc.Sprite("res/ui/bjdmj/popup/pyq/sai.png");
//		bisaiImg.setPosition(175, 70);
//		xipai_btn.addChild(bisaiImg);
//
//		var xpkf = PHZRoomModel.creditXpkf ? PHZRoomModel.creditXpkf.toString() : 0;
//		var label_xpkf = UICtor.cLabel(""+xpkf,50);
//		label_xpkf.setAnchorPoint(0,0.5);
//		label_xpkf.setPosition(200,70);
//		xipai_btn.addChild(label_xpkf);
//
//		if(PHZRoomModel.nowBurCount == PHZRoomModel.totalBurCount || ClosingInfoModel.ext[6] == 1){
//			xipai_btn.visible = false;
//		}else{
//			xipai_btn.visible = PHZRoomModel.creditConfig[10] == 1;
//		}
//		xipai_btn.visible = true;
//
//		this.xipai_btn = xipai_btn;
//		this.contentNode1 = contentNode1;
//		this.contentNode2 = contentNode2;
//		this.contentNode2.setVisible(false);
//	},
//
//	showLeftCards:function(leftCards,renshu){
//		var label_remain = new cc.LabelTTF("剩余底牌:","res/font/bjdmj/fznt.ttf",32);
//		label_remain.setAnchorPoint(0,0.5);
//		label_remain.setPosition(cc.winSize.width/2 - 930,renshu == 2?240:165);
//		label_remain.setColor(cc.color(128,51,6));
//		this.contentNode1.addChild(label_remain);
//
//
//		for(var i = 0;i<leftCards.length;++i){
//			var vo = PHZAI.getPHZDef(leftCards[i]);
//			var card = new PHZCard(PHZAI.getDisplayVo(1, 3), vo);
//			// card.setScale(0.7);
//			card.x = label_remain.x + 165 + (i%30)*48;
//			card.y = label_remain.y - 20 - (Math.floor(i/30)*50);
//			this.contentNode1.addChild(card);
//		}
//	},
//
//	onClickBtn:function(sender,type){
//		if(type == ccui.Widget.TOUCH_BEGAN){
//			sender.setColor(cc.color.GRAY);
//		}else if(type == ccui.Widget.TOUCH_ENDED){
//			sender.setColor(cc.color.WHITE);
//
//			if(sender == this.btn_jiesan){
//				this.onBreak();
//			}else if(sender == this.btn_ready || sender == this.btn_ready2){
//				this.onOk();
//			}else if(sender == this.btn_show_table){
//				this.contentNode1.setVisible(false);
//				this.contentNode2.setVisible(true);
//			}else if(sender == this.btn_spxq){
//				this.onHandCard();
//			}else if(sender == this.btn_jsxq){
//				this.contentNode1.setVisible(true);
//				this.contentNode2.setVisible(false);
//			}else if(sender == this.btn_xipai){
//				sySocket.sendComReqMsg(4501, [], "");
//				PopupManager.remove(this);
//				this.onOk();
//			}
//
//
//		}else if(type == ccui.Widget.TOUCH_CANCELED){
//			sender.setColor(cc.color.WHITE);
//		}
//	},
//
//	onOk:function(){
//		if(ClosingInfoModel.isReplay || !LayerManager.isInRoom()){
//			if(PopupManager.getClassByPopup(YJGHZReplay)){
//				PopupManager.removeClassByPopup(YJGHZReplay);
//			}
//			PopupManager.remove(this);
//			return;
//		}
//		var data = this.data;
//
//		if (ClosingInfoModel.ext[6] == 1) {//最后的结算
//			PopupManager.remove(this);
//			var mc = new YJGHZBigResultPop(data);
//			PopupManager.addPopup(mc);
//			var obj = HongBaoModel.getOneMsg();
//			if (obj) {
//				var mc = new HongBaoPop(obj.type, obj.data);
//				PopupManager.addPopup(mc);
//			}
//		} else {
//			if (PHZRoomModel.isStart) {
//				PHZRoomModel.cleanSPanel();
//				PopupManager.remove(this);
//				sySocket.sendComReqMsg(3);
//			} else {
//				sySocket.sendComReqMsg(3);
//			}
//		}
//
//	},
//
//	onBreak:function(){
//		PHZAlertPop.show("解散房间需所有玩家同意，确定要申请解散吗？",function(){
//			sySocket.sendComReqMsg(7);
//		},null,2)
//	},
//
//    onHandCard:function(){
//    	var mc = new PHZHandCardPop(this.data.closingPlayers,ClosingInfoModel.ext[1]);
//    	PopupManager.open(mc,true);
//    },
//
//});

var YJGHZSmallResultCell = ccui.Widget.extend({
	ctor:function(data,huId){
		this._super();

		this.setAnchorPoint(0,0);
        this.setContentSize(80,300);

		var action = data.action;
		var cards = data.cards;
        if(action>=0){
			var imgName = "";
			if(cards.length >2){
				if(action == 1 || action == 11)imgName = "phz_act_1.png";
				if(action == 2)imgName = "phz_act_2.png";
				if(action == 3)imgName = "phz_act_3.png";
				if(action == 5)imgName = "phz_act_5.png";
				if(action == 6)imgName = "phz_act_6.png";
			}

			if(imgName){
				var header = new cc.Sprite("res/res_phz/yjghz/ghzTypeImg/" + imgName);
				header.setPosition(38,300);
				// header.setScale(0.8);
				this.addChild(header);
			}

			var zorder = cards.length;
			for(var i=0;i<cards.length;i++){
				zorder--;
				var vo = PHZAI.getPHZDef(cards[i]);

				if ((action == YJGHZAction.TI || action == YJGHZAction.LIU_WEI)&& i != 0)
					vo.a = 1;
				if (action == YJGHZAction.WEI) {
					if(cards.length>=2 && i != 0)
						vo.a = 1;
				}

				vo.ishu = (cards[i]==huId);
				var card = new PHZCard(PHZAI.getDisplayVo(1,3),vo);
				// card.setScale(0.88);
				card.setPosition(0,i * 52);
				this.addChild(card,zorder);
			}
        }else{

			var voArray = [];
			for(var i=0;i<cards.length;i++){
				voArray.push(PHZAI.getPHZDef(cards[i]));
			}
			var result = PHZAI.sortHandsVo(voArray);
			for(var i=0;i<result.length;i++){
				var vo = result[i];
				var zorder = vo.length;
				for(var j=vo.length-1;j>=0;j--) {
					vo[j].ishu = (vo[j].c == huId);
					var card = new PHZCard(PHZAI.getDisplayVo(1, 3), vo[j]);
					// card.setScale(0.88);
					card.setPosition(i*80,j * 48);
					this.addChild(card,zorder);
					zorder++;
				}
			}
		}
	}
});

var YJGHZSmallResultPop=BasePopup.extend({
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

		//this.getWidget("dataLabel").setString("");/**  牌型显示 **/

		this.list = this.getWidget("ListView_6");

		for (var i = 0; i < this.data.length; i++) {
			if (this.data[i].point > 0) {
				var mcards = this.data[i].mcards
				for (var j = 0; j < mcards.length; ++j) {

					if (mcards[j].action >= 0) {
						var cell = new YJGHZSmallResultCell(mcards[j], PHZRoomModel.wanfa);
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
        this.getWidget("replay_tip").x -= 220;
        this.getWidget("replay_tip").setString("回放码:"+BaseRoomModel.curHfm);

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
			var nowPoint = this.getWidget("dataLabel");
			nowPoint.setString("共计:" + user.point);
			this.getWidget("heiji").setString("");
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
			var mc = new YJGHZBigResultPop(this.totalData);
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
