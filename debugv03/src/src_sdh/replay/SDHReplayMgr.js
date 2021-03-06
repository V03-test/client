/**
 * Created by cyp on 2019/10/10.
 */

var SDHReplayMgr = {
    tablesArr:[],
    msgArr:[],
    resultData:null,
    diPaiArr1:null,
    diPaiArr2:null,
    cleanData:function(){
        this.tablesArr = [];
        this.msgArr = [];
        this.resultData = null;//结算数据
        this.diPaiArr1 = [];//初始底牌
        this.diPaiArr2 = [];//埋牌后的底牌
    },

    handleReplayData:function(hfData){
        this.cleanData();

        var build = MsgHandler.getResBuilder(5002);
        var tableClass = build.builder.build("CreateTableRes");
        var data = new tableClass();

        var closingMsg = JSON.parse(hfData.closingMsg);

        this.resultData = {};
        this.resultData.ext = closingMsg.ext || [];
        this.resultData.closingPlayers = [];

        data.replay = true;
        data.wanfa = hfData.playType;
        data.renshu = hfData.maxPlayerCount;
        data.tableId = hfData.tableId;
        data.roomName = "";
        if(hfData.generalExt){
            var ext = JSON.parse(hfData.generalExt);
            if(ext.roomName)data.roomName =ext.roomName;
        }
        data.nowBurCount = hfData.playCount;
        data.totalBurCount = hfData.totalCount;
        data.remain = 1;
        data.intParams = closingMsg.intParams;
        data.tableType = 0;
        if(data.roomName)data.tableType = 1;
        data.nextSeat = 1;
        data.ext = [0,0,-1,0,0,0];
        data.scoreCard = [];

        var playLogs = hfData.play.split(";");

        for(var i=0;i<hfData.resList.length;i++){
            var playerData = JSON.parse(hfData.resList[i]);
            this.resultData.closingPlayers.push(playerData);

            var pClass = build.builder.build("PlayerInTableRes");
            var p = new pClass();
            p.userId = playerData.userId;
            p.name = playerData.name;
            p.seat = playerData.seat;
            p.sex = playerData.sex;
            p.icon = playerData.icon;
            p.point = playerData.point;
            p.credit = playerData.credit;
            p.handCardIds = [];
            if(playLogs[p.seat - 1]){
                p.handCardIds = playLogs[p.seat - 1].split(",");
            }
            p.outCardIds = [];
            p.moldIds = [];

            data.players.push(p);

        }

        var stepsData = [];
        for(var i = data.renshu;i<playLogs.length;++i){
            if(playLogs[i]){
                stepsData.push(JSON.parse(playLogs[i]));
            }
        }

        for(var i = 0;i<stepsData.length;++i){
            if(stepsData[i].action == 1){
                data.nextSeat = stepsData[i].seat;
                break;
            }
        }

        this.tablesArr.push(data);
        this.msgArr.push({type:SDHTabelType.CreateTable,data:data});


        this.handStepMsg(stepsData);
    },

    handStepMsg:function(stepsData){

        var num_play = 0;

        for(var idx = 0;idx<stepsData.length;++idx){
            var step = stepsData[idx];

            var msg = {};
            var table = ObjectUtil.deepCopy(this.tablesArr[this.tablesArr.length - 1]);

            if(step.action == 1){//叫分
                msg.type = SDHTabelType.JiaoFen;
                msg.data = {};
                var params = [];
                params[0] = step.vals[0];//叫分
                params[1] = step.vals[1];//加拍
                params[2] = step.seat;
                params[3] = 0;
                if(stepsData[idx+1] && stepsData[idx+1].action == 1){
                    params[3] = step.nextSeat;
                }

                table.remain = 1;
                if(params[0] > 0){
                    table.ext[1] = params[0];
                    table.ext[4] = params[1];
                }
                for(var i = 0;i<table.players.length;++i){
                    if(table.players[i].seat == params[2]){
                        table.players[i].ext[1] = params[0];
                    }
                }
                if(params[3] > 0)table.nextSeat = params[3];

                msg.data.params = params;

            }else if(step.action == 2){//选主
                msg.type = SDHTabelType.XuanZhu;
                msg.data = {};

                var params = step.vals;

                table.ext[2] = params[0];
                table.remain = 3;

                msg.data.params = params;

            }else if(step.action == 3 || step.action == 4 || step.action == 6){//埋牌,打牌，抠底
                if(step.action == 4)num_play++;

                if(step.action == 3){
                    this.diPaiArr2 = step.vals || [];
                }

                msg.type = SDHTabelType.PlayCard;
                msg.data = {};
                msg.data.cardType = 0;
                if(step.action == 3)msg.data.cardType = 100;
                if(step.action == 6)msg.data.cardType = 200;
                msg.data.seat = step.seat;
                msg.data.nextSeat = step.nextSeat;
                msg.data.curScore = step.fen || 0;
                msg.data.scoreCard = step.fenCards || [];
                msg.data.isLet = 0;
                msg.data.cardIds = step.vals || [];
                msg.data.isClearDesk = (num_play%table.renshu == 0);

                if(step.baofu){
                    msg.data.isLet = Math.pow(10,msg.data.seat - 1);
                }

                table.nextSeat = msg.data.nextSeat;
                if(msg.data.cardType == 100){
                    table.remain = 4;
                }else if(msg.data.cardType == 200){//抠底消息
                    if(msg.data.curScore > 0){
                        table.ext[5] = msg.data.curScore;//当前得分
                    }
                    table.scoreCard = table.scoreCard.concat(msg.data.scoreCard);
                }

                //报副状态
                //1000 座位号4报副，100 座位号3报副 ，10 座位号 2 报副 ,1 座位号1报副
                //同时报副相加
                var baofuArr = [0,0,0,0];
                var temp = msg.data.isLet;
                for(var i = 3;i>=0;--i){
                    if(temp - Math.pow(10,i) >= 0){
                        baofuArr[i] = 1;
                        temp = temp - Math.pow(10,i);
                    }
                }

                for(var i = 0;i<table.players.length;++i){
                    var p = table.players[i];

                    if(baofuArr[p.seat - 1]) p.ext[2] = 1;

                    if(p.seat == msg.data.seat){
                        p.handCardIds = SDHRoomModel.delCardWithArr(p.handCardIds,msg.data.cardIds);
                        if(msg.data.cardType == 0){
                            p.outCardIds = msg.data.cardIds;
                        }else if(msg.data.cardType == 100){
                            p.moldIds = msg.data.cardIds;//埋的底牌
                        }
                    }
                }

                //一轮打完,设置玩家的第一个出牌的状态
                if(msg.data.isClearDesk){
                    if(msg.data.curScore > 0){
                        table.ext[5] = msg.data.curScore;//当前得分
                    }
                    table.scoreCard = table.scoreCard.concat(msg.data.scoreCard);

                    for(var i = 0;i<table.players.length;++i){
                        var p = table.players[i];
                        p.outCardIds = [];//打完一轮清理出的牌
                        p.shiZhongCard = ((p.seat == msg.data.nextSeat)?1:0);
                    }
                }


            }else if(step.action == 5){//选留守
                msg.type = SDHTabelType.XuanLiuShou;
                msg.data = {};
                msg.data.params = [step.seat,step.vals[0]];

                var seat = msg.data.params[0];
                var huase = msg.data.params[1];

                for(var i = 0;i<table.players.length;++i){
                    if(table.players[i].seat == seat){
                        table.players[i].ext[4] = huase;
                    }
                }

            }else if(step.action == 7){//定庄
                msg.type = SDHTabelType.DingZhuang;
                msg.data = {};

                var params = step.vals || [];
                var strParams = [step.seat];

                table.nextSeat = strParams[0];
                table.remain = 2;

                //新田包牌先选主再拿底牌
                if(table.wanfa == GameTypeEunmPK.XTBP && params.length > 0){
                    table.remain = 3;
                }

                table.banker = table.ext[3] = table.nextSeat;
                for(var i = 0;i<table.players.length;++i){
                    if(table.players[i].seat == table.banker){
                        table.players[i].handCardIds = table.players[i].handCardIds.concat(params);
                        table.players[i].shiZhongCard = 1;//该轮第一个出牌
                    }else{
                        table.players[i].shiZhongCard = 0;
                    }
                }

                msg.data.params = params;
                msg.data.strParams = strParams;

                this.diPaiArr1 = params || [];
            }else if(step.action == 100){//托管
                msg.type = SDHTabelType.ChangeTuoGuan;
                msg.data = {};

                var seat = step.seat;
                var tuoguan = step.vals[0];

                msg.data.params = [seat,tuoguan];

                for(var i = 0;i<table.players.length;++i){
                    var p = table.players[i];
                    if (p.seat == seat) {
                        p.ext[3] = tuoguan;
                        break;
                    }
                }

            }

            if(msg.type){
                this.msgArr.push(msg);
                this.tablesArr.push(table);
            }
        }

    },

    runReplay:function(hfData){
        this.handleReplayData(hfData);

        if(this.msgArr.length > 0){
            var table = ObjectUtil.deepCopy(this.tablesArr[0]);
            SDHRoomModel.init(table);

            var layerClass = SDHRoomModel.getRoomLayerById();
            var layer = new layerClass();

            var ctrLayer = new SDHReplayCtrLayer();
            ctrLayer.setShowStep();
            layer.addChild(ctrLayer,100);

            PopupManager.addPopup(layer);

            layer.handleTableData(SDHTabelType.CreateTable,table);

        }else{
            FloatLabelUtil.comText("回放数据错误");
        }
    },



    sendTableMsg:function(step){
        if(this.tablesArr.length <=0)return false;
        if(step >= this.tablesArr.length)step = this.tablesArr.length - 1;

        var table = ObjectUtil.deepCopy(this.tablesArr[step]);

        SDHRoomModel.init(table);
        SyEventManager.dispatchTableEvent(SDHTabelType.CreateTable,table);
    },

    sendPlayMsg:function(step){
        if(this.msgArr.length <=0)return false;
        if(step >= this.msgArr.length)step = this.msgArr.length - 1;

        var msgData = ObjectUtil.deepCopy(this.msgArr[step].data);

        SyEventManager.dispatchTableEvent(this.msgArr[step].type,msgData);
    },

    sendOverMsg:function(){
        SyEventManager.dispatchTableEvent(SDHTabelType.OnOver,this.resultData);
    },

}
