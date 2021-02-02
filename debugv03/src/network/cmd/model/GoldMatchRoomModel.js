var GoldMatchRoomModel = {
    goldMatchRoomData:[],
    goldMatchRanks:[],
    goldMatchParams:[],
    _msgDdiff:30,
    _msgdt:0,
    _msgData:null,
    getWanfaStr:function(type){
        var wfStr = ""
        if(type == 1){
            wfStr =
                "【预赛】打立出局，积分前3名进入下一轮\n"+
                "【决赛】3局PK，携带第一轮的50%积分进入擂台，决出123名"
        }else if(type == 2){
            wfStr =
                "【预赛】打立出局，低于淘汰分直接淘汰，只剩15名时截止预赛，前9名晋级\n" +
                "【半决赛】3局PK，每桌第1名晋级\n" +
                "【决赛】3局PK，决出123名"
        }else{
            wfStr =
                "【预赛】打立出局，积分前9名进入下一轮\n"+
                "【半决赛】3局PK，携带第一轮的50%积分进入擂台，每桌第1名晋级\n"+
                "【决赛】3局PK，携带第二轮的50%积分进入擂台，决出123名"
        }
        return wfStr
    },
    getMatchMarquee:function(paomadeng){
        var self = this
        NetworkJT.loginReqNew("competitionAction", "runningHorseLight", {},
            function (data) {
                if (data) {
                    //cc.log("runningHorseLight1",data.message.length, JSON.stringify(data))
                    var nowData = [];
                    for(var i = 0;i<data.message.length;i++){
                        var curContent = data.message[i];
                        curContent.endtime = curContent.eTime.replace(/-/g, '/');
                        curContent.endtime = Date.parse(curContent.endtime);
                        curContent.starttime = curContent.bTime.replace(/-/g, '/');
                        curContent.starttime = Date.parse(curContent.starttime);
                        var now = sy.scene.getCurServerTime();
                        if (now >= curContent.starttime && now <= curContent.endtime){
                            curContent.id = curContent.tid;
                            curContent.delay = curContent.diffsec / 1000;
                            curContent.type = 4;
                            curContent.round = curContent.playCount || 2
                            sy.scene.msgPlaying = true;
                            nowData.push(curContent);
                            self._msgData = curContent;
                        }
                    }
                    PaoMaDengModel.init(nowData);
                    paomadeng.playing = false;
                }
            }, function (data) {
                if (data) {
                    cc.log("runningHorseLight2", JSON.stringify(data))
                }
            });
    },
}
var MatchRoomInfo = cc.Class.extend({
    playingId:0,
    goldMatchRoomData:[],
    nowBurCount:0,
    totalBurCount:0,
    curStep:1,
    roomData:[],
    stepLength:0,
    secondWeedOut:null,
    intervalTime:0,
    ctor:function(root,posX,posY){
        this.root = root
        var infoBg = new ccui.ImageView("res/res_gold/goldMatchRoom/room_bg_1.png");
        infoBg.setPosition(posX,posY)
        root.addChild(infoBg);
        this.roomName = new ccui.Text("", "res/font/bjdmj/mljcy.ttf", 41);
        this.roomName.setPosition(infoBg.width/2,infoBg.height/2)
        infoBg.addChild(this.roomName);

        var rankBg = new ccui.ImageView("res/res_gold/goldMatchRoom/room_bg_2.png");
        rankBg.setPosition(infoBg.width/2,infoBg.height/2-80)
        infoBg.addChild(rankBg);
        this.rankInfo = new ccui.Text("", "res/font/bjdmj/mljcy.ttf", 32);
        this.rankInfo.setPosition(rankBg.width/2,rankBg.height/2)
        rankBg.addChild(this.rankInfo);

        this.stepInfo = new ccui.Text("", "res/font/bjdmj/mljcy.ttf", 32);
        this.stepInfo.setPosition(infoBg.width/2,infoBg.height/2-144)
        infoBg.addChild(this.stepInfo);

        var btn_rank = new ccui.Button("res/res_gold/goldMatchDetailPop/paiming.png", "", "");
        btn_rank.setPosition(1850,578);
        UITools.addClickEvent(btn_rank, this, this.onMatchRankClick);
        this.root.addChild(btn_rank);

        var btn_rule = new ccui.Button("res/res_mj/res_ahmj/ahmjRoom/wanfa.png", "", "");
        btn_rule.setPosition(1719,1012);
        UITools.addClickEvent(btn_rule, this, this.onMatchRuleClick);
        this.root.addChild(btn_rule);
    },

    onUpdateRoomName:function(nowBurCount,totalBurCount,curStep){
        //cc.log("onUpdateRoomName",nowBurCount,totalBurCount)
        this.roomData.nowBurCount = nowBurCount
        this.roomData.totalBurCount = totalBurCount
        if(this.stepLength == 2){
            if (this.curStep == 1) {
                this.stepInfo.setString("预赛：打立出局")
            } else if (this.curStep == 2) {
                this.stepInfo.setString("决赛 " + nowBurCount + "/" + totalBurCount + "局")
            }
        }else{
            if(this.curStep == 1){
                this.stepInfo.setString("预赛：打立出局")
            }else if(this.curStep == 2){
                this.stepInfo.setString("半决赛：前1名晋级 "+nowBurCount + "/" + totalBurCount+"局")
            }else if(this.curStep == 3){
                this.stepInfo.setString("决赛 "+nowBurCount + "/" + totalBurCount+"局")
            }
        }
    },

    addStartGameAnim:function(roomData) {
        //cc.log("addStartGameAnim",JSON.stringify(roomData))
        this.roomData =[]
        this.roomData = roomData
        this.diScore = this.roomData.diScore
        var self = this
        var params = {
            playingId: roomData.playingId,
            sessCode: PlayerModel.sessCode,
            userId: PlayerModel.userId,
        }
        NetworkJT.loginReqNew("competitionAction", "getPlayingList", params,
            function (data) {
                if (data) {
                    //cc.log("getPlayingList222",JSON.stringify(data.message))
                    var dataList = data.message.argList
                    GoldMatchRoomModel.goldMatchRoomData = dataList[0]
                    self.goldMatchRoomData = dataList[0]
                    self.curStep = dataList[0].curStep
                    self.stepLength = dataList[0].stepLength
                    if(dataList[0].secondWeedOut) {
                        self.calculateTime(dataList[0].openTime,dataList[0].secondWeedOut)
                    }
                    if(self.getIsTimingStepOne()&&self.openTime){
                        self.getScoreConfig()
                        //cc.log("onUpdateScore1",JSON.stringify(self.scoreConfig))
                        var counts =self.getCounts()
                        self.onUpdateDiScore(counts)
                    }
                    self.startGameAnim(dataList[0].curStep, dataList[0].curRound)

                }
            }, function (data) {
            });
    },

    startGameAnim:function(curStep,curRound){
        AudioManager.play("res/res_gold/goldMatchRoom/audio/start.mp3");
        var fileName = "baijindaodh3"
        if(this.getIsTimingStepOne()){
            fileName = "baijindaodh4"
        }
        var animName = "dalichuju"
        if(this.stepLength == 2){
            if (curStep == 2) {
                animName = "juesaiju"
                curRound = this.roomData.nowBurCount
            }
        }else{
            if (curStep == 2) {
                animName = "dingjujifen"
                curRound = this.roomData.nowBurCount
            } else if (curStep == 3) {
                animName = "juesaiju"
                curRound = this.roomData.nowBurCount
            }
        }
        ccs.armatureDataManager.addArmatureFileInfo("res/bjdani/kaijudonghua/"+fileName+".ExportJson");
        var kaijuAnim = new ccs.Armature(fileName);
        this.root.addChild(kaijuAnim, 99);
        kaijuAnim.setName("kaijuAnim")
        kaijuAnim.x = 960;
        kaijuAnim.y = 540;
        kaijuAnim.getAnimation().setFrameEventCallFunc(function (bone, evt) {
            if (evt == "finish") {
                kaijuAnim.getAnimation().stop();
                kaijuAnim.removeFromParent(true);
            }
        });
        kaijuAnim.getAnimation().play(animName, -1, 0);

        if(!this.getIsTimingStepOne()){
            var roundLabel = new cc.LabelBMFont(curRound, "res/res_gold/goldMatchRoom/num_1.fnt");
            if (curStep == 3 || (this.stepLength == 2 &&curStep == 2)) {
                roundLabel.x = 240;
            } else {
                roundLabel.x = 275;
            }
            roundLabel.y = 58
            roundLabel.setScale(0)
            roundLabel.setOpacity(0)
            kaijuAnim.addChild(roundLabel, 99);
            roundLabel.runAction(cc.sequence(cc.spawn(cc.scaleTo(1 / 12, 2.5), cc.fadeIn(1 / 12)), cc.scaleTo(1 / 3, 0.9), cc.scaleTo(1 / 8, 1), cc.delayTime(5 / 6), cc.fadeOut(0)))
        }

        var diScore = this.getIsTimingStepOne() ? this.diScore:this.roomData.diScore
        var scoreLabel = new cc.LabelBMFont(diScore, "res/res_gold/goldMatchRoom/num_2.fnt");
        scoreLabel.x = 160;
        scoreLabel.y = -80
        scoreLabel.setAnchorPoint(0, 0.5)
        scoreLabel.setScale(0)
        scoreLabel.setOpacity(0)
        kaijuAnim.addChild(scoreLabel, 99);
        scoreLabel.runAction(cc.sequence(cc.spawn(cc.scaleTo(1 / 12, 2.5), cc.fadeIn(1 / 12)), cc.scaleTo(1 / 3, 0.9), cc.scaleTo(1 / 8, 1), cc.delayTime(5 / 6), cc.fadeOut(0)))

    },

    loadMatchRoomData:function(roomData) {
        //cc.log("loadMatchRoomData",JSON.stringify(roomData))
        this.roomData =[]
        this.roomData = roomData
        this.diScore = this.roomData.diScore
        var self = this
        var params = {
            playingId: roomData.playingId,
            sessCode: PlayerModel.sessCode,
            userId: PlayerModel.userId,
        }
        NetworkJT.loginReqNew("competitionAction", "getPlayingList", params,
            function (data) {
                if (data) {
                    //cc.log("getPlayingList111",JSON.stringify(data.message))
                    var dataList = data.message.argList
                    GoldMatchRoomModel.goldMatchRoomData = dataList[0]
                    self.goldMatchRoomData = dataList[0]
                    self.curStep = dataList[0].curStep
                    self.stepLength = dataList[0].stepLength
                    if(dataList[0].secondWeedOut) {
                        self.calculateTime(dataList[0].openTime,dataList[0].secondWeedOut)
                    }
                    if(dataList[0].stepLength == 2){
                        if (dataList[0].curStep == 1) {
                            self.stepInfo.setString("预赛：打立出局")
                        } else if (dataList[0].curStep == 2) {
                            self.stepInfo.setString("决赛 " + self.roomData.nowBurCount + "/" + self.roomData.totalBurCount + "局")
                        }
                    }else {
                        if (dataList[0].curStep == 1) {
                            self.stepInfo.setString("预赛：打立出局")
                        } else if (dataList[0].curStep == 2) {
                            self.stepInfo.setString("半决赛：前1名晋级 " + self.roomData.nowBurCount + "/" + self.roomData.totalBurCount + "局")
                        } else if (dataList[0].curStep == 3) {
                            self.stepInfo.setString("决赛 " + self.roomData.nowBurCount + "/" + self.roomData.totalBurCount + "局")
                        }
                    }
                    self.roomName.setString(dataList[0].titleCode + " 底分:" + self.roomData.diScore);
                    if(self.getIsTimingStepOne()&&self.openTime){
                        self.getScoreConfig()
                        //cc.log("onUpdateScore1",JSON.stringify(self.scoreConfig))
                        var counts =self.getCounts()
                        self.onUpdateDiScore(counts)
                    }
                    //if (self.roomData.isAnim) {
                    //    self.addStartGameAnim(dataList[0].curStep, dataList[0].curRound)
                    //}
                    NetworkJT.loginReqNew("competitionRankAction", "getRankSimple", params,
                        function (data) {
                            if (data) {
                                //cc.log("getRankSimple", JSON.stringify(data))
                                GoldMatchRoomModel.goldMatchRanks = []
                                GoldMatchRoomModel.goldMatchRanks.push(data.message.rank)
                                GoldMatchRoomModel.goldMatchRanks.push(data.message.total)
                                var outScoreStr = ""
                                if (self.roomData.outScore && self.roomData.outScore > 0) {
                                    outScoreStr = " 淘汰分" + self.roomData.outScore
                                    self.outScore = self.roomData.outScore
                                }
                                //cc.log("onUpdateScore outScore",self.roomData.outScore)
                                //cc.log("getRankSimple", JSON.stringify(data.message))
                                //FloatLabelUtil.comText(JSON.stringify(data.message));
                                self.rankInfo.setString(data.message.rank + "/" + data.message.total + "名" + outScoreStr);
                                if(self.getIsTimingStepOne()&&self.openTime){
                                    var counts =self.getCounts()
                                    self.onUpdateOutScore(counts)
                                }
                            }
                        }, function (data) {
                        });
                }
            }, function (data) {
            });
    },

    calculateTime:function(openTime,secondWeedOut){
        this.secondWeedOut = [];
        var data = secondWeedOut.split("_")
        for(var i = 1;i<data.length;i++){
            var p = data[i].split(",");
            this.secondWeedOut.push(p);
        }
        this.openTime = openTime/1000
        //cc.log("secondWeedOut",JSON.stringify(this.secondWeedOut))
    },

    getScoreConfig:function(){
        var serverDate = sy.scene.getCurServerTime()
        serverDate = serverDate/1000
        this.totalTime = serverDate - this.openTime //开局总时间(秒)
        this.scoreConfig = this.secondWeedOut[this.secondWeedOut.length-1]
        for(var i = 0;i<this.secondWeedOut.length-1;i++){
            if(this.totalTime/60 < this.secondWeedOut[i+1][0]){
                this.scoreConfig = this.secondWeedOut[i]
                break
            }
        }
    },

    getScore:function(){
        this.getScoreConfig()
        //cc.log("onUpdateScore5",this.totalTime,JSON.stringify(this.scoreConfig))
        if(this.totalTime%this.scoreConfig[1] == 0){
            //cc.log("onUpdateScore2",JSON.stringify(this.scoreConfig),JSON.stringify(this.secondWeedOut))
            this.onUpdateScore()
        }
    },

    onUpdateScore:function(){
        var counts =this.getCounts()
        this.onUpdateDiScore(counts)
        this.onUpdateOutScore(counts)
    },
    getCounts:function(){
        var counts = []
        var totalTime = this.totalTime
        for(var i = 0;i<this.secondWeedOut.length;i++){
            if(this.secondWeedOut[i+1] && this.totalTime > this.secondWeedOut[i+1][0]*60){
                counts[i] = parseInt((this.secondWeedOut[i+1][0]-this.secondWeedOut[i][0])*60/this.secondWeedOut[i][1])
                totalTime -= (this.secondWeedOut[i+1][0]-this.secondWeedOut[i][0])*60
            }else{
                counts[i] = parseInt(totalTime/this.secondWeedOut[i][1])
                break
            }
        }
        //cc.log("counts",JSON.stringify(counts))
        return counts
    },

    onUpdateDiScore:function(counts){
        //if(count){
            //this.diScore = this.roomData.diScore + this.scoreConfig[2] * count
            this.diScore = this.roomData.diScore
            for(var i = 0;i<counts.length;i++){
                this.diScore+=this.secondWeedOut[i][2]*counts[i]
            }
            //cc.log("onUpdateScore3",this.totalTime,this.scoreConfig[1],this.roomData.diScore,this.diScore)
            this.roomName.setString(this.goldMatchRoomData.titleCode + " 底分:" + this.diScore);
        //}
    },

    onUpdateOutScore:function(counts){
        //if(count) {
            //this.outScore = this.roomData.outScore + this.scoreConfig[3] * count

        this.outScore = this.roomData.outScore
        for(var i = 0;i<counts.length;i++){
            this.outScore+=this.secondWeedOut[i][3]*counts[i]
        }
            var outScoreStr = " 淘汰分" + this.outScore
            //cc.log("onUpdateScore4", this.roomData.outScore,this.outScore)
            this.rankInfo.setString(GoldMatchRoomModel.goldMatchRanks[0] + "/" + GoldMatchRoomModel.goldMatchRanks[1] + "名" + outScoreStr);
        //}
    },

    onUpdateRank:function(ranks){
        var outScoreStr = ""
        if(this.roomData.outScore && this.roomData.outScore>0){
            outScoreStr = " 淘汰分"+(this.getIsTimingStepOne() && this.outScore ? this.outScore : this.roomData.outScore)
        }
        this.rankInfo.setString(ranks[0]+"/"+ranks[1]+"名"+outScoreStr);
    },

    getIsTimingStepOne:function(){
        return this.goldMatchRoomData.type == 2 && this.goldMatchRoomData.curStep == 1
    },

    onMatchRankClick:function(){
        if(!this.goldMatchRoomData)return
        this.goldMatchRoomData.playingId = this.roomData.playingId
        var popLayer = new GoldMatchDetailPop(this.goldMatchRoomData,1);
        PopupManager.addPopup(popLayer);
    },

    onMatchRuleClick:function(){
        var titleStr = "赛制说明"
        var wfStr = GoldMatchRoomModel.getWanfaStr(this.goldMatchRoomData.logo[0])
        var pop = new GoldRoomRulePop(wfStr,titleStr);
        PopupManager.addPopup(pop);
    },

    removeMatchRoomInfo:function(){
        this.secondWeedOut = []
        ccs.armatureDataManager.removeArmatureFileInfo("res/bjdani/kaijudonghua/baijindaodh3.ExportJson");
        ccs.armatureDataManager.removeArmatureFileInfo("res/bjdani/kaijudonghua/baijindaodh4.ExportJson");
    },
});
