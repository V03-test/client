/**
 * Created by zhoufan on 2015/8/15.
 * @class
 * @extend {ccui.Widget}
 */
var PDKCard = ccui.Widget.extend({
	/** @lends Card.prototype */
	_cardVo:null,
	_prefix:null,
	cardId:null,
	_bg:null,
	/**
	 * @construct
	 * @param cardVo {CardVo}
	 */

	ctor:function(prefix,cardVo,cardSize,cardType){
		this._prefix = prefix;
		this._super();
		//背景
		this._cardVo = cardVo;
		var color = cardVo.t;
		var number = cardVo.n;

		var path = BasePKCardSetModel.getLocalCardPathByWanfa("PDK");
		var localIndex = number < 3 ? 13 + number : number;
		var bg_pic = path + (color * 100 + localIndex) + ".png";
		var backbg_pic = BasePKCardSetModel.getLocalCardPathByName("pai_bei");

		var bg = this._bg = new cc.Sprite(bg_pic);
		this.setContentSize(bg.width,bg.height);
		bg.x = bg.width/2;
		bg.y = bg.height/2;
		this.addChild(bg);
		bg.visible =false;

		////
		//var bg = this._bg;
		//增加卡牌背面
		var backbg = new cc.Sprite(backbg_pic);
		backbg.x = backbg.width/2;
		backbg.y = backbg.height/2;
		backbg.visible = false;
		this.addChild(backbg);


		this.varNode = bg;
		this.backNode = backbg;

		if (cardType){
			bg.visible = true;
		}
	},

	/**
	 * 获取数据模型
	 * @returns {CardVo}
	 */
	getData:function(){
		return this._cardVo;
	},


	refreshCardsType:function(type){
		var color = this._cardVo.t;
		var number = this._cardVo.n;

		var path = BasePKCardSetModel.getLocalCardPathByWanfa("PDK");
		var localIndex = number < 3 ? 13 + number : number;
		var bg_pic = path + (color * 100 + localIndex) + ".png";
		var backbg_pic = BasePKCardSetModel.getLocalCardPathByName("pai_bei");

		//var frame = cc.spriteFrameCache.getSpriteFrame(bg_pic);
		var spNode = new cc.Sprite(bg_pic);
		var frame = spNode.getSpriteFrame();
		this.varNode.setSpriteFrame(frame);
		this.setContentSize(this.varNode.width,this.varNode.height);
		this.varNode.x = this.varNode.width/2;
		this.varNode.y = this.varNode.height/2;
		//var frame1 = cc.spriteFrameCache.getSpriteFrame(backbg_pic);
		spNode = new cc.Sprite(backbg_pic);
		var frame1 = spNode.getSpriteFrame();
		this.backNode.setSpriteFrame(frame1);
		this.setContentSize(this.backNode.width,this.backNode.height);
		this.backNode.x = this.backNode.width/2;
		this.backNode.y = this.backNode.height/2;

		this.refreshBlackCard(type);
	},

});