var KefunewPop = BasePopup.extend({
	ctor:function(){
		this._super("res/kefunewPop.json");
	},
	
	selfRender:function(){
		UITools.addClickEvent(this.getWidget("Button_click") , this , this.onCopy);
	},

	onCopy:function(){
		SdkUtil.sdkPaste("1992133003");
	},
});
