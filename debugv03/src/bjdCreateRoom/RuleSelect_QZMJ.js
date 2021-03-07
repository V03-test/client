/**
 * Created by Administrator on 2021/1/22 0022.
 */
var RuleSelect_QZMJ = RuleSelectBase.extend({
    ctor:function(gametype,createlayer){
        this._super(gametype,createlayer);
        this.createNumBox(9);
        this.createChangeScoreBox(11);//创建低于xx分加xx分
        this.getItemByIdx(11,0).itemBtn.setContentSize(80,40);
        this.updateItemShow();
    },

    setConfigData:function(){
        this.ruleConfig = [
            {title:"局数选择",type:1,content:["1局","8局","12局","16局"]},//0
            {title:"房费",type:1,content:["AA支付","房主支付"]},//1
            {title:"人数选择",type:1,content:["4人","3人","2人"]},//2
            {title:"翻醒",type:2,content:["上醒","中醒","下醒"],col:3},            //3
            {title:"玩法",type:1,content:["自摸无分","自摸翻倍"],col:3},            //4
            {title:"托管",type:1,content:["不托管","1分钟","2分钟","3分钟","5分钟"],col:3},    //5
            {title:"托管",type:1,content:["单局托管","整局托管","三局托管"],col:3},             //6
            {title:"小局封顶",type:1,content:["5分","10分","15分"],col:3},//7
            {title:"大局封顶",type:1,content:["100分","200分","300分"],col:3},//8
            {title:"玩法选择",type:1,content:["不加","加倍"],col:3},                           //9
            {title:"玩法选择",type:1,content:["翻2倍","翻3倍","翻4倍"],col:3},                  //10
            {title:"加分",type:2,content:["低于"]},//11
        ];

        this.defaultConfig = [[0],[0],[0],[],[0],[0],[1],[0],[0],[0],[0],[]];
        this.syDScore = parseInt(cc.sys.localStorage.getItem("QZMJ_diScore")) || 5;
        this.addScore = parseInt(cc.sys.localStorage.getItem("QZMJ_addBoxScore")) || 10;/** 加xx分 **/
        this.allowScore = parseInt(cc.sys.localStorage.getItem("QZMJ_allowBoxScore")) || 10;/** 低于xx分 **/

        if(this.createRoomLayer.clubData){

            if(ClickClubModel.getClubIsOpenLeaderPay()){
                this.ruleConfig[1].content = ["群主支付"];
                this.defaultConfig[1][0] = 0;
            }
            if(ClickClubModel.getClubIsGold()){
                this.ruleConfig[1].content = ["白金豆AA支付"];
                this.defaultConfig[1][0] = 0;
            }

            var params = this.createRoomLayer.clubData.wanfaList;
            if(params[1] == GameTypeEunmMJ.QZMJ){
                this.readSelectData(params);
            }
        }

        return true;
    },

    createChangeScoreBox:function(row){
        if(!this.layoutArr[row]){
            return;
        }
        this.addNumBox = new changeEditBox(["",10,"分"],1);
        //参数1 显示文字（分三段，第二个参数必须是值）参数2 点击按钮每次改变值 （参数3 最小值默认1，参数4 最大值默认100）
        this.addNumBox.setWidgetPosition(850,0);//设置位置
        this.addNumBox.setScoreLabel(this.addScore);//设置初始值
        this.layoutArr[row].addChild(this.addNumBox);

        this.addLabel = UICtor.cLabel("加",38,null,cc.color(126,49,2));
        //this.addLabel.setAnchorPoint(0.5,0.5);
        this.addLabel.setPosition(770,0);
        this.layoutArr[row].addChild(this.addLabel);

        this.allowNumBox = new changeEditBox(["",10,"分"],1);
        this.allowNumBox.setWidgetPosition(380,0);
        this.allowNumBox.setScoreLabel(this.allowScore);
        this.layoutArr[row].addChild(this.allowNumBox);
    },

    onShow:function(){
        this.updateZsNum();
    },

    changeHandle:function(item){
        var tag = item.getTag();
        if(tag < 300){
            this.updateZsNum();
        }
        this.updateItemShow();
    },

    updateItemShow:function(){
        if (this.getItemByIdx(2,2).isSelected()){
            this.layoutArr[9].visible = true;
            if (this.getItemByIdx(9,1).isSelected()){
                this.layoutArr[10].visible= true;
                this.numBox.visible = true;
            }else{
                this.layoutArr[10].visible= false;
                this.numBox.visible = false;
            }
            this.layoutArr[11].setVisible(true);
            this.addNumBox.itemBox.visible = true;
            this.allowNumBox.itemBox.visible = true;
            var isOpen = this.getItemByIdx(11,0).isSelected();
            this.addNumBox.setTouchEnable(isOpen);
            this.allowNumBox.setTouchEnable(isOpen);
            this.layoutArr[7].visible = true;
            this.layoutArr[8].visible= true;
        }else{
            this.layoutArr[7].visible = false;
            this.layoutArr[8].visible= false;
            this.numBox.visible = false;
            this.layoutArr[9].visible = false;
            this.layoutArr[10].visible= false;
            this.layoutArr[11].setVisible(false);
            this.addNumBox.itemBox.visible = false;
            this.allowNumBox.itemBox.visible = false;
        }

        if (this.getItemByIdx(5,0).isSelected()){
            this.layoutArr[6].visible = false;
        }else{
            this.layoutArr[6].visible = true;
        }
    },

    updateZsNum:function(){
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()){
            this.updateDouziNum();
            return;
        }

        var zsNum = 5;
        var zsNumArr = [1,5,8,10];
        var temp = 0;
        var renshu = 4;
        for(var i = 0;i < 3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4 - i;
                break;
            }
        }

        for(var i = 0;i<zsNumArr.length;++i){
            var item = this.getItemByIdx(0,i);
            if(item.isSelected()){
                temp = i;
                break;
            }
        }

        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            zsNum = zsNumArr[temp];
        }else{
            if(this.getItemByIdx(1,0).isSelected()){
                zsNum = Math.ceil(zsNumArr[temp]/renshu);
            }else{
                zsNum = zsNumArr[temp]
            }
        }
        zsNum = 0;
        this.createRoomLayer && this.createRoomLayer.updateZsNum(zsNum);
    },

    updateDouziNum:function(){
        var renshu = 4;
        for(var i = 0;i < 3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4 - i;
                break;
            }
        }

        var temp = 0;
        for(var i = 0;i<2;++i){
            var item = this.getItemByIdx(0,i);
            if(item.isSelected()){
                temp = i;
                break;
            }
        }

        var configArr = [
            {2:3000,3:2000,4:1500},{2:5000,3:3300,4:2500}
        ]

        var num = configArr[temp][renshu];

        this.createRoomLayer && this.createRoomLayer.updateZsNum(num);
    },

    //row 第几列
    createNumBox:function (row) {
        if (!this.layoutArr[row]){
            return null
        }
        var BoxBg = new cc.Sprite("res/ui/createRoom/createroom_img_bg_1.png");
        this.layoutArr[row].addChild(BoxBg);
        BoxBg.setAnchorPoint(0,0.5);
        BoxBg.x = 430 + (788/(this.layoutArr[row].itemArr.length));

        var reduceBtn = new ccui.Button();
        reduceBtn.loadTextureNormal("res/ui/createRoom/createroom_btn_sub.png");
        reduceBtn.setAnchorPoint(0,0);
        reduceBtn.setPosition(-5,-4);
        reduceBtn.temp = 1;
        BoxBg.addChild(reduceBtn,1);
        //
        var addBtn = new ccui.Button();
        addBtn.loadTextureNormal("res/ui/createRoom/createroom_btn_add.png");
        addBtn.setAnchorPoint(0,0);
        addBtn.setPosition(BoxBg.width-addBtn.width+5,-4);
        addBtn.temp = 2;
        BoxBg.addChild(addBtn,1);

        var scoreLabel = this.scoreLabel = UICtor.cLabel("小于"+this.syDScore+"分",38,null,cc.color(126,49,2));
        scoreLabel.setPosition(BoxBg.width/2,BoxBg.height/2);
        BoxBg.addChild(scoreLabel,0);

        UITools.addClickEvent(reduceBtn,this,this.onChangeScoreClick);
        UITools.addClickEvent(addBtn,this,this.onChangeScoreClick);

        this.numBox = BoxBg;
        this.numBox.visible = false;

        this.numBox = BoxBg;
        this.numBox.visible = false;
    },

    onChangeScoreClick:function(obj){
        var temp = parseInt(obj.temp);
        var num = this.syDScore;

        if (temp == 1){
            num = num - 10;
        }else{
            num = num + 10;
        }

        if (num && num >= 10 && num < 40){
            if (num%10 == 5){
                this.syDScore = num - 5;
            }else{
                this.syDScore = num;
            }
        }else if ( num < 10){
            this.syDScore = 5;
        }
        // cc.log("this.syDScore =",this.syDScore);
        this.scoreLabel.setString("小于"+ this.syDScore + "分");
    },

    getSocketRuleData:function(){
        var data = {params:[],strParams:""};
        var jushu = 1;
        if(this.getItemByIdx(0,1).isSelected()){
            jushu = 8;
        }else if(this.getItemByIdx(0,2).isSelected()){
            jushu = 12;
        }else if(this.getItemByIdx(0,3).isSelected()){
            jushu = 16;
        }

        var costway = 1;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()) {
            costway = 4;
        }else if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costway = 3;
        }else{
            if(this.getItemByIdx(1,1).isSelected()) costway = 2;
        }

        var renshu = 4;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4-i;
                break;
            }
        }

        var shangXing = this.getItemByIdx(3,0).isSelected() ? 1 : 0;
        var zhongXing = this.getItemByIdx(3,1).isSelected() ? 1 : 0;
        var xiaXing = this.getItemByIdx(3,2).isSelected() ? 1 : 0;

        var value = ""+shangXing+zhongXing+xiaXing;
        var xingValue = parseInt(value).toString(2);
        xingValue = parseInt(xingValue);

        var wanfa = 0;
        if(this.getItemByIdx(4,1).isSelected()){
            wanfa = 1;
        }

        var autoPlay = 0;
        for(var i = 0;i<4;++i){
            if(this.getItemByIdx(5,i).isSelected()){
                autoPlay = i*60;
                break;
            }
        }


        if(this.getItemByIdx(5,4).isSelected()){
            autoPlay = 300;
        }

        var djtg = 2;
        if (this.getItemByIdx(6,0).isSelected()){
            djtg = 1;
        }else if (this.getItemByIdx(6,2).isSelected()){
            djtg = 3;
        }

        var xjScore = 5;
        if(this.getItemByIdx(7,1).isSelected()){
            xjScore = 10;
        }else if(this.getItemByIdx(7,2).isSelected()){
            xjScore = 15;
        }

        var djScore = 100;
        if(this.getItemByIdx(8,1).isSelected()){
            djScore = 200;
        }else if(this.getItemByIdx(8,2).isSelected()){
            djScore = 300;
        }

        var isDouble = 0;
        if(this.getItemByIdx(9,1).isSelected())isDouble = 1;

        var doubleNum = 2;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(10,i).isSelected()){
                doubleNum = 2 + i;
            }
        }

        var dScore = this.syDScore;
        cc.sys.localStorage.setItem("QZMJ_diScore",dScore);

        var morefen = 0;
        var allowScore= 0;
        if(this.getItemByIdx(11,0).isSelected()){//如果勾选
            morefen = this.addNumBox.localScore;
            allowScore = this.allowNumBox.localScore;
        }
        cc.sys.localStorage.setItem("QZMJ_addBoxScore",morefen);
        cc.sys.localStorage.setItem("QZMJ_allowBoxScore",allowScore);

        data.params = [
            jushu,//局数 0
            GameTypeEunmMJ.QZMJ,//玩法ID 1
            costway,//支付方式 2
            0,// 3
            wanfa,// 4  自摸无分/翻倍
            xjScore,// 5  小局封顶
            djScore,// 6  大局封顶
            renshu,// 7
            0,//8
            0,//9
            xingValue,//10  翻醒 1上2中3下

            autoPlay,//托管时间//11
            djtg,//单局托管，和整局托管//12

            isDouble,// 是否加倍 13
            this.syDScore,// 加倍分 14
            doubleNum,// 加倍数 15

            morefen,//16 "加xx分"
            allowScore,//17 "低于xx分"
            0,//18

            0,//19
        ];

        return data;
    },

    //单独获取游戏类型id,支付方式选项,局数,人数的选择项
    //用于俱乐部的创建
    getWanfas:function(){
        var jushu = 1;
        if(this.getItemByIdx(0,1).isSelected()){
            jushu = 8;
        }else if(this.getItemByIdx(0,2).isSelected()){
            jushu = 12;
        }else if(this.getItemByIdx(0,3).isSelected()){
            jushu = 16;
        }

        var costway = 1;
        if(this.createRoomLayer.clubData && ClickClubModel.getClubIsGold()) {
            costway = 4;
        }else if(this.createRoomLayer.clubData && ClickClubModel.getClubIsOpenLeaderPay()){
            costway = 3;
        }else{
            if(this.getItemByIdx(1,1).isSelected())costway = 2;
        }


        var renshu = 4;
        for(var i = 0;i<3;++i){
            if(this.getItemByIdx(2,i).isSelected()){
                renshu = 4-i;
                break;
            }
        }
        return [GameTypeEunmMJ.QZMJ,costway,jushu,renshu];
    },

    //俱乐部创建玩法包厢,读取配置选项
    readSelectData:function(params){
        var defaultConfig = [[0],[0],[0],[],[0],[0],[1],[0],[0],[0],[0],[]];

        defaultConfig[0][0] = params[0] == 16?3:params[0] == 12?2:params[0] == 8?1:0;
        defaultConfig[1][0] = params[2] == 3||params[2] == 4?0:params[2] - 1;
        defaultConfig[2][0] = params[7] == 4 ? 0: params[7] == 3?1:2;
        defaultConfig[4][0] = params[4] == 1 ? 1 : 0;
        defaultConfig[5][0] = params[11]?params[11] == 300?4:params[11]/60:0;
        defaultConfig[6][0] = params[12]== 1 ? 0:params[12]== 2 ? 1 : 2;//单局托管/整局/三局
        defaultConfig[7][0] = params[5] == 5 ? 0:params[5] == 10 ? 1:2;
        defaultConfig[8][0] = params[6] == 100 ? 0:params[6] == 200 ? 1:2;
        defaultConfig[9][0] = params[13] == 1?1:0;
        defaultConfig[10][0] = parseInt(params[15])-2;
        if(params[15] && params[15] != 0 && params[16] && params[16] != 0){
            defaultConfig[11].push(0);
        }

        var temp = parseInt(params[10],2);
        if (Math.floor(temp/100) == 1) defaultConfig[3].push(0);
        if (Math.floor(temp/10)%10 == 1) defaultConfig[3].push(1);
        if (temp%10 == 1) defaultConfig[3].push(2);

        this.syDScore = parseInt(params[14]) || 5;
        this.addScore = parseInt(params[16])|| 10;
        this.allowScore = parseInt(params[17])||10;

        this.defaultConfig = defaultConfig;
    },
});