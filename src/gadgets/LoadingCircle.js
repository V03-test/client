var LoadingCircle = BasePopup.extend({

	ctor:function(loadingStr){
		this._str = loadingStr;
		this._super("res/loadingCircle.json");
	},

	selfRender:function(){
		this.label = this.getWidget("Label_35");
		//this.lmc = this.getWidget("Image_7");
		this.show(this._str);
	},

	show:function(str){
		this._str = str;
		this.label.setString(str);
		if(!this._runAnimat){
			var _timeDiff = 0.25;
			var _timeDelay = 0.1;
			for(var i = 1;i <= 4;i++){
				var action1 = cc.sequence(
					cc.delayTime(_timeDelay * 2 * (i-1)),
					cc.moveBy(_timeDiff,cc.p(0,35)),
					cc.moveBy(_timeDiff,cc.p(0,-35)),
					cc.delayTime(_timeDelay * 2 * (4 - i))
				);
				this["Image_a"+ i] = this.getWidget("Image_a" + i);
				this["Image_a"+ i].runAction(cc.repeatForever(action1));
			}
			this._runAnimat = true;
		}
		this.visible = true;

		//需求要求在登录时两秒内登录进去的不显示转圈
		if(this._str == "正在登录"){
			this.root.setVisible(false);
			var self = this;
			this.runAction(cc.sequence(cc.delayTime(2),cc.callFunc(function(){
				self.root.setVisible(true);
			})));
		}
	},

	hide:function(){
		// if(this._runAnimat){
		// 	// this.ani.removeFromParent(true)
		// 	// ccs.armatureDataManager.removeArmatureFileInfo("res/bjdani/jiazai_bjd/jiazai_bjd.ExportJson");
		// 	this._runAnimat = false;
		// }
		this.visible = false;
		this.root.setVisible(true);
		this.stopAllActions();
	},

	onExit:function(){
		//this.lmc.stopAllActions();
		// ccs.armatureDataManager.removeArmatureFileInfo("res/bjdani/jiazai_bjd/jiazai_bjd.ExportJson");
		this._super();
	}
});