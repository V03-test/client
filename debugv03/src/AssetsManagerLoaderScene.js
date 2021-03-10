var failCount = 0;
var maxFailCount = 5;   //最大错误重试次数

var startEnterGame = function() {
	sy.assetsScene.logo.visible = true;
	sy.assetsScene.bgLayer.visible = true;
	sy.assetsScene.initDt();
}

var initConfigList = {

	initConfig:function(onSuc){
		var self = this;
		var url = "http://testxsg.tuishey.cn/configList.json"
		var xhr = cc.loader.getXMLHttpRequest();
		xhr.open("GET", url);
		xhr.timeout = 12000;
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=utf-8");
		var self = this;
		var onerror = function(){
//		    onSuc();
			xhr.abort();
		};
		xhr.onerror = onerror;
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				if(xhr.status == 200){
					var data = JSON.parse(xhr.responseText);
					cc.log("initConfig===",JSON.stringify(data))
					var url = (data && data.hotList && data.hotList.ips) ? data.hotList.ips : null;
					if (url){
						self.checkNeedModifyManifest(data.hotList.ips,"res/project.manifest",onSuc);
					}
				}else{
					onerror.call(self);
				}
			}
		}
		xhr.send();
	},
	/**
	 * 检测是否需要修改.manifest文件
	 * @param {新的升级包地址} newAppHotUpdateUrl
	 * @param {本地project.manifest文件地址} localManifestPath
	 * @param {修改manifest文件后回调} resultCallback
	 */
	checkNeedModifyManifest:function(newAppHotUpdateUrl, localManifestPath, resultCallback) {
		if (!cc.sys.isNative) return;
		var tempUpdateUrl = cc.sys.localStorage.getItem("appHotUpdateUrl2");
		//第一次安装并启动的时候，本地没有存储“appHotUpdateUrl”,所以需要将App内的原始升级包地址存放在下面
		if (!tempUpdateUrl) {
			cc.sys.localStorage.setItem("appHotUpdateUrl2", "");
		}
		tempUpdateUrl = cc.sys.localStorage.getItem('appHotUpdateUrl2');
		console.log("tempUpdateUrl : ", tempUpdateUrl);
		console.log("newAppHotUpdateUrl : ", newAppHotUpdateUrl);
//		if (tempUpdateUrl) {
			//如果本地存储的升级包地址和服务器返回的升级包地址相同，则不需要修改.manifest文件。
			// if (tempUpdateUrl == newAppHotUpdateUrl) return;
			//否则 --> 修改manifest文件下载地址
			this.modifyAppLoadUrlForManifestFile(newAppHotUpdateUrl, localManifestPath, function(manifestPath) {
				resultCallback(manifestPath);
			});
//		}
	},
	/**
	 * 修改.manifest文件
	 * @param {新的升级包地址} newAppHotUpdateUrl
	 * @param {本地project.manifest文件地址} localManifestPath
	 * @param {修改manifest文件后回调} resultCallback
	 */
	modifyAppLoadUrlForManifestFile:function(newAppHotUpdateUrl, localManifestPath, resultCallback) {
		try {
		    cc.log("jsb.fileUtils.getWritablePath()==",jsb.fileUtils.getWritablePath())
			if (jsb.fileUtils.isFileExist(jsb.fileUtils.getWritablePath() + "/project.manifest")) {
			    cc.log("&&&&&&&&&&&&&&&1")
				console.log("有下载的manifest文件");
				var storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "");
				console.log("StoragePath for remote asset : ", storagePath);
				var loadManifest = jsb.fileUtils.getStringFromFile(storagePath + '/project.manifest');
				var manifestObject = JSON.parse(loadManifest);
				manifestObject.packageUrl = newAppHotUpdateUrl;
				manifestObject.remoteManifestUrl = manifestObject.packageUrl + "project.manifest";
				manifestObject.remoteVersionUrl = manifestObject.packageUrl + "version.manifest";
				resultCallback(storagePath + "/project.manifest");
				var afterString = JSON.stringify(manifestObject);
				var isWritten = jsb.fileUtils.writeStringToFile(afterString, storagePath + "/project.manifest");
				//更新数据库中的新请求地址，下次如果检测到不一致就重新修改 manifest 文件
				console.log("StoragePath for remote asset : ", storagePath);
				if (isWritten) {
					cc.sys.localStorage.setItem("appHotUpdateUrl2", newAppHotUpdateUrl);
				}
				// console.log("Written Status : ", isWritten);
			} else {
                cc.log("&&&&&&&&&&&&&&&2")
				var initializedManifestPath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "");
				if (!jsb.fileUtils.isDirectoryExist(initializedManifestPath)) jsb.fileUtils.createDirectory(initializedManifestPath);
				//修改原始manifest文件

				var originManifestPath = localManifestPath;

				var originManifest = jsb.fileUtils.getStringFromFile(originManifestPath);
				var originManifestObject = JSON.parse(originManifest);
				cc.log("originManifestObject===",initializedManifestPath,JSON.stringify(originManifestObject));
				originManifestObject.packageUrl = newAppHotUpdateUrl;
				originManifestObject.remoteManifestUrl = originManifestObject.packageUrl + 'project.manifest';
				originManifestObject.remoteVersionUrl = originManifestObject.packageUrl + 'version.manifest';
				var afterString = JSON.stringify(originManifestObject);
				var isWritten = jsb.fileUtils.writeStringToFile(afterString, initializedManifestPath + '/project.manifest');
				resultCallback(initializedManifestPath + "project.manifest");

                cc.log("originManifestObject===",JSON.stringify(originManifestObject))
				if (isWritten) {
				    cc.log("&&&&&&&&&&&&&&&3")
					cc.sys.localStorage.setItem("appHotUpdateUrl2", newAppHotUpdateUrl);
				}
				// console.log("Written Status : ", isWritten);
			}

		} catch (error) {
			console.log("读写manifest文件错误!!!(请看错误详情-->) ", error);
		}
	}
}

var AssetsUpdateFailedPopup = cc.Layer.extend({
	root:null,
	mainpopup : null,
	ctor : function(){
		this._super();
		var _this = this;
		cc.loader.loadJson("res/alertPop.json", function(err, configJson){
			_this.loadComplete();
		});
	},

	getWidget : function(name){
		return ccui.helper.seekWidgetByName(this.root,name);
	},

	/**
	 * 加载完成后初始化UI
	 *
	 */
	loadComplete : function(){
		this.root = ccs.uiReader.widgetFromJsonFile("res/alertPop.json");
		this.addChild(this.root);
		this.getWidget("Label_35").setString("更新失败！请重新登录游戏！");
		this.btnok = this.getWidget("Button_36");
		this.btnok.addTouchEventListener(this.onOk, this);
		var btncancel = this.getWidget("Button_37");
		this.btnok.x-=122;
		btncancel.visible=false;
	},

	onOk : function(obj,type){
		if(type == ccui.Widget.TOUCH_ENDED){
			if(cc.sys.os == cc.sys.OS_IOS){
				ios_sdk_exit();
			}else{
				cc.director.end();
			}
		}
	}
})

var AssetsUpdateModel = {

	init: function() {
		this.tags = [];
		this.isLog = false;
	},

	log: function(tag) {
		this.tags.push(tag);
	},

	getTags: function() {
		return this.tags.toString();
	}

}

/**
 * 自动更新js和资源
 */
var AssetsManagerLoaderScene = cc.Scene.extend({
	_am:null,
	_progress:null,
	_percent:0,
	_percentByFile : 0,
	_loadingBar : null,
	_fileLoadingBar : null,
	_normalLayer:null,
	_popupLayer:null,
    _checkNetworkNode: null,
	_manifestList: null,
	onEnter:function(){
		this._super();
		sy.assetsScene = this;
		AssetsUpdateModel.init();
		var self = this;

		this._manifestList = null;

        this._checkNetworkNode = new cc.Layer();
        this.addChild(this._checkNetworkNode);
		// this.timeId = setTimeout(function() {
		// 	AssetsUpdateModel.isLog = true;
		// 	self.loadGame();
		// }, 7000);
		this._normalLayer = new cc.Layer();
		this.addChild(this._normalLayer, 0);
		this._popupLayer = new cc.Layer();
		this.addChild(this._popupLayer, 10);
		var winSize = cc.director.getWinSize();
		// bg
		var bgLayer = new cc.Sprite("res/res_ui/login/bg.jpg");
		bgLayer.setPosition(winSize.width/2,winSize.height/2);
		this.bgLayer = bgLayer;
		this._normalLayer.addChild(bgLayer, 1);

		// ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/csd/csd.ExportJson");
		// var logo = new ccs.Armature("csd");
		// logo.setPosition(cc.winSize.width/2 + 90  ,cc.winSize.height/2 + 140);
		// logo.getAnimation().play("Animation1",-1,1);
		// this.logo = logo;
		// this._normalLayer.addChild(logo, 2);


		var logo = new cc.Sprite("res/res_ui/login/logo1.png");
		logo.setPosition(cc.winSize.width/2 + 90  ,cc.winSize.height/2 + 140);
		this.logo = logo;
		this._normalLayer.addChild(logo, 2);

		AssetsUpdateModel.log("i1");

		var nettip = this.noNetworkLabel = new cc.Sprite("res/starlogo/nettip.png");
		var nettip_size = nettip.getContentSize();
		var nettip_txt = new cc.LabelTTF("请在设置中找到湘娱棋牌，查看网络是否打开...", "Arial", 36);
		nettip_txt.anchorX = nettip_txt.anchorY = 0.5;
		nettip_txt.x = nettip_size.width / 2;
		nettip_txt.y = nettip_size.height / 2;
		nettip.addChild(nettip_txt);
		nettip.visible = false;
		nettip.x = winSize.width / 2;
		nettip.y = 100;
		this._normalLayer.addChild(nettip, 3);

        var onSuc = function(path){
            self._manifestList = path ? path : self._manifestList;
            cc.log("path===",path,self._manifestList)
            self.initSyConfig();

        };
        initConfigList.initConfig(onSuc);
	},

	initSyConfig:function(){
	var self = this;
	var winSize = cc.director.getWinSize();
	cc.log("************3")
	    //load config
        cc.loader.loadJson("syconfig.json", function(err, configJson){
            if(err){
                cc.log("load syconfig.json error");
            }else{
                // cc.log("configJson===",JSON.stringify(configJson))
                SyConfig.init(configJson);
                if (SyConfig.IS_STARTANI) {
                    var pre_time = parseInt(cc.sys.localStorage.getItem("playVedioTime"));
                    var cur_time = new Date().getTime();
                    cc.sys.localStorage.setItem("playVedioTime", cur_time);
                    var starlogo = new cc.Sprite("res/starlogo/startBg.jpg");
                    self.starlogo = starlogo;
                    starlogo.setPosition(winSize.width / 2, winSize.height / 2);
                    self._normalLayer.addChild(starlogo, 0);
                    self.logo.visible = false;
                    self.bgLayer.visible = false;
                    self.starlogo.runAction(cc.sequence(
                        cc.delayTime(1),
                        cc.fadeOut(1),
                        cc.delayTime(0.1),
                        cc.callFunc(function () {
                            startEnterGame();
                        }, this))
                    )
                } else {
                    startEnterGame();
                }
            }
        })
	},

	isAcrossDay: function(c_time, p_time) {
		var c_day = Math.floor(c_time / (86400000));
		var p_day = Math.floor(p_time / (86400000));
		cc.log("c_day, p_day", c_day, p_day);
		return c_day > p_day;
	},

	initDt: function() {
		if(!SyConfig.isSdk()){
			this.checkUpdate();
		}else{
			if(SyConfig.isAndroid())
				jsb.reflection.callStaticMethod("net/sy599/common/SDKHelper", "sdkInit", "()V");
			else {
				this.checkUpdate();
            } 
		}
	},

	checkNetworkstate: function() {
    	if (ios_sdk_nettype() != 0) {
    		cc.log("come here..................")
    		this.noNetworkLabel.visible = false;
    		this._checkNetworkNode.unscheduleAllCallbacks();
    		this.checkUpdate();
    	}
    },

	sdkInitcb:function(){
		setTimeout(function(){
			sy.assetsScene.checkUpdate();
		},10);
	},

	updateLoadingBar:function(percent){
		var baseWidth = 1667;
		var nowWidth = parseInt(baseWidth*(percent/100));
		if(!this._loadingbar){
			this._loadingbar = new cc.Sprite("res/res_gameCom/img_21.png");
			this._loadingbar.anchorX=0;
			this._loadingbar.x = 2;
			this._loadingbar.y = this.loadingbg.height/2;
			this.loadingbg.addChild(this._loadingbar);
		}
		this._loadingbar.setTextureRect(cc.rect(0, 0, nowWidth, 23));
	},

	checkUpdate:function(){
		if(SyConfig.IGNORE_HOTUPDATE){
			cc.log("checkUpdate::IGNORE_HOTUPDATE....cancel");
			this.loadGame();
			return;
		}
		this.dt = 0;
		this.diandt = 0;
		var self = this;
		var winSize = cc.director.getWinSize();
		//loading条
		var loadingbg = this.loadingbg =  new cc.Sprite("res/res_gameCom/img_20.png");
		loadingbg.x = winSize.width/2;
		loadingbg.y = 100;
		this._normalLayer.addChild(loadingbg,3);
		AssetsUpdateModel.log("i2");
		//loading percent
		var txt = "正在检查更新";
		var label = this._progress = new cc.LabelTTF(txt,"Arial",30,cc.size(winSize.width, 45));
		label.setColor(cc.color(0,0,0));
		label.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
		label.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
		label.x = winSize.width/2;
		label.y = 100;
		this._normalLayer.addChild(this._progress, 10);
		self.updateLoadingBar(100);
		AssetsUpdateModel.log("i3");

		this.checkManifest();

		this.schedule(this.updateProgress, 0.8);
		this.scheduleUpdate();
	},

	update: function(dt) {
		this.dt += dt;
		if (this.dt >= 0.5) {
			this.dt = 0;
			this.diandt += 1;
			if (this._percent == 0) {
				var dian = [".","..","..."];
				this._progress.setString("正在检查更新"+dian[this.diandt-1]);
				if (this.diandt >= 3) {
					this.diandt = 0;
				}
			}
		}
	},

	checkManifest:function(){
		if(this._am){
			this._am.release();
		}

		var storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "./");
		cc.log("this._manifestList[0]==",storagePath,this._manifestList);
		this._am = new jsb.AssetsManager(""+this._manifestList, storagePath);
		this._am.retain();
		if (!this._am.getLocalManifest().isLoaded()) {
			AssetsUpdateModel.log("i4");
			cc.log("Fail to update assets, step skipped.");
			this.loadGame();
		} else {
			var that = this;
			var listener = new jsb.EventListenerAssetsManager(this._am, function(event) {
				switch (event.getEventCode()) {
//				        cc.log("event.getEventCode()==",event.getEventCode())
					case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
						AssetsUpdateModel.log("e1");
						cc.log("No local manifest file found, skip assets update.");
						that.loadGame();
						break;
					case jsb.EventAssetsManager.UPDATE_PROGRESSION:
						//clearTimeout(that.timeId);
						that._percent = event.getPercent();
						break;
					case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
					case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
						AssetsUpdateModel.log("e2");
						cc.log("Fail to download manifest file, update skipped.");
						that.loadGame();
						break;
					case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
						AssetsUpdateModel.log("e3");
						cc.log("ALREADY_UP_TO_DATE.");
						that.loadGame();
						break;
					case jsb.EventAssetsManager.UPDATE_FINISHED:
						AssetsUpdateModel.log("e4");
						cc.log("Update finished.");
						that.loadGame();
						break;
					case jsb.EventAssetsManager.UPDATE_FAILED:
						AssetsUpdateModel.log("e5");
						cc.log("Update failed. " + event.getMessage());
						failCount++;
						if (failCount < maxFailCount) {
							that._am.downloadFailedAssets();
						}else{
							cc.log("Reach maximum fail count, exit update process");
							var popup = new AssetsUpdateFailedPopup();
							that._popupLayer.addChild(popup);
						}
						break;
					case jsb.EventAssetsManager.ERROR_UPDATING:
						AssetsUpdateModel.log("e6");
						cc.log("Asset update error: " + event.getAssetId() + ", " + event.getMessage());
						that.loadGame();
						break;
					case jsb.EventAssetsManager.ERROR_DECOMPRESS:
						AssetsUpdateModel.log("e7");
						cc.log("ERROR_DECOMPRESS. " + event.getMessage());
						that.loadGame();
						break;
					default:
						AssetsUpdateModel.log("e8");
						break;
				}
			});
			cc.eventManager.addListener(listener, 1);
			this._am.update();
		}
		// this._manifestList.splice(0, 1);
		// cc.log("this._manifestList===",this._manifestList)
	},

	loadGame:function(){
		//clearTimeout(this.timeId);
		if(this._loadingbar){
			this.unscheduleUpdate();
			this.updateLoadingBar(100);
		}
		cc.sys.localStorage.setItem("manifestIndex",this._manifestIndex);
		AssetsUpdateModel.log("s1");
		// jsList是jsList.js的变量，记录全部js。
		this.scheduleOnce(function(){
			cc.loader.loadJs(["src/jsList.js"], function(){
				//for(var i=0;i<jsList.length;i++){
				//	cc.loader.loadJs(jsList[i], function(){
				//		cc.log("loadGame::-----"+jsList[i]);
				//	});
				//}
				AssetsUpdateModel.log("s2");
				cc.loader.loadJs(jsList, function(){
					AssetsUpdateModel.log("s3");
					cc.director.runScene(new MainScene());
				});
			});
		}, 0.3);
	},


	updateProgress:function(dt){
		if(this._percent > 0){
			var p = parseInt(this._percent);
			if(p >= 100){
				this._progress.setString("更新完成");
			}else{
				this._progress.setString("正在更新..."+(p+"%"));
			}
			this.updateLoadingBar(this._percent);
		}
	},

	onExit:function(){
		cc.log("AssetsManager::onExit");
		if(this._am){
			this._am.release();
		}
		// ccs.armatureDataManager.removeArmatureFileInfo("res/bjdani/csd/csd.ExportJson");
		this._super();
	}
});
