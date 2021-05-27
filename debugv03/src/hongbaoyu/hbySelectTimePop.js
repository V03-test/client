/**
 * Created by Administrator on 2021/5/19.
 */

var HBYSelectTimePop = BasePopup.extend({

    ctor:function(){
        this._super("res/hbySelectTimePop.json");
    },

    selfRender:function(){

        var btn_qx = this.getWidget("btn_qx");
        var btn_qd = this.getWidget("btn_qd");

        UITools.addClickEvent(btn_qx , this , this.onCloseHandler);
        UITools.addClickEvent(btn_qd , this , this.onSure);

        var localTime = new Date();

        var year = this.getWidget("text1");
        var yearWidget = ccui.helper.seekWidgetByName(year,"beginTimeList");
        // this.initYear(yearWidget);
        this.yearWidget = yearWidget;

        var month = this.getWidget("text2");
        var monthWidget = ccui.helper.seekWidgetByName(month,"beginTimeList");
        // this.initMonth(monthWidget,localTime.getMonth() + 1);
        this.monthWidget = monthWidget;

        var day = this.getWidget("text3");
        var dayWidget = ccui.helper.seekWidgetByName(day,"beginTimeList");
        // this.initDay(dayWidget,localTime.getDate());
        this.dayWidget = dayWidget;

        var hours = this.getWidget("text4");
        var hoursWidget = ccui.helper.seekWidgetByName(hours,"beginTimeList");
        // this.initHours(hoursWidget,localTime.getHours());
        this.hoursWidget = hoursWidget;

        var minutes = this.getWidget("text5");
        var minutesWidget = ccui.helper.seekWidgetByName(minutes,"beginTimeList");
        // this.initMinutes(minutesWidget,localTime.getMinutes());
        this.minutesWidget = minutesWidget;

        var timeData = {
            resultYear:localTime.getFullYear(),
            resultMonth:localTime.getMonth() + 1,
            resultDay:localTime.getDate(),
            resultHours:localTime.getHours(),
            resultMinutes:localTime.getMinutes(),
            resultSeconds:0
        }

        this.initYear(this.yearWidget);
        this.initNewAllDate(timeData,1);
    },

    initNewAllDate:function (timeData,index){
        var localTime = new Date();
        var yearSame = timeData.resultYear <= localTime.getFullYear();
        var monthSame = timeData.resultMonth <= (localTime.getMonth() + 1);
        var daySame = timeData.resultDay <= localTime.getDate();
        var hourSame = timeData.resultHours <= localTime.getHours();

        // cc.log(" index = ",index);
        //
        // cc.log(" yearSame = ",yearSame);
        // cc.log(" monthSame = ",monthSame);
        // cc.log(" daySame = ",daySame);
        // cc.log(" hourSame = ",hourSame);

        var minMonth = yearSame ? (localTime.getMonth() + 1) : 1;
        var minDay = yearSame && monthSame ? localTime.getDate() : 1;
        var minMours = yearSame && monthSame && daySame ? localTime.getHours() : 0;
        var minMinutes = yearSame && monthSame && daySame && hourSame ? localTime.getMinutes() : 0;

        // cc.log(" 最小值 minMonth = ",minMonth);
        // cc.log(" 最小值 minDay = ",minDay);
        // cc.log(" 最小值 minMours = ",minMours);
        // cc.log(" 最小值 minMinutes = ",minMinutes);

        (index < 2) && this.initMonth(this.monthWidget,null,minMonth);
        (index < 3) && this.initDay(this.dayWidget,null,minDay);
        (index < 4) && this.initHours(this.hoursWidget,null,minMours);
        (index < 5) && this.initMinutes(this.minutesWidget,null,minMinutes);
    },

    onClickChange:function (localWidget,localItem){
        var localArr = [];
        if(localWidget){
            localArr = localWidget.children;
        }
        for(var index = 0;index < localArr.length;++index){
            var item = localArr[index];
            if(item && item != localItem){
                item.fixShow();
            }
        }

        // if(localWidget == this.yearWidget || localWidget == this.monthWidget){
        //    this.initDay(this.dayWidget);
        // }

        var resultYear = this.getSelectData(this.yearWidget);
        var resultMonth = this.getSelectData(this.monthWidget);
        var resultDay = this.getSelectData(this.dayWidget);
        var resultHours = this.getSelectData(this.hoursWidget);
        var resultMinutes = this.getSelectData(this.minutesWidget);
        var resultSeconds = 0;//this.getSelectData(this.secondsWidget); 默认0

        var timeDataB = {resultYear:resultYear,
            resultMonth:resultMonth,
            resultDay:resultDay,
            resultHours:resultHours,
            resultMinutes:resultMinutes,
            resultSeconds:resultSeconds
        }

        // var endTimeData = HBYTimeModel.formatStrTime(HBYTimeModel.addDayByTimeData(timeDataB));
        // cc.log(" endTimeData = ",endTimeData)

        var index = 6;
        if(localWidget == this.yearWidget){
            index = 1;
        }else if(localWidget == this.monthWidget){
            index = 2;
        }else if(localWidget == this.dayWidget){
            index = 3;
        }else if(localWidget == this.hoursWidget){
            index = 4;
        }else if(localWidget == this.minutesWidget){
            index = 5;
        }

        if(index < 6){
            this.initNewAllDate(timeDataB,index);
        }

        // if(localWidget == this.yearWidget || localWidget == this.monthWidget){
        //     this.initDay(this.dayWidget);
    },

    initYear:function(widget,localVal){
        var time = new Date();
        var localMin = time.getFullYear();
        var localMax = localMin + 10;
        localVal = localVal || localMin;
        this.setViewList(widget,localMin,localMax,localVal);
    },

    initMonth:function(widget,localVal,localMin){
        // var localMin = 1;
        localMin = localMin || 1;
        var localMax = 12;
        localVal = localVal || localMin;

        this.setViewList(widget,localMin,localMax,localVal);
    },

    initDay:function(widget,localVal,localMin){
        // var localMin = 1;
        localMin = localMin || 1;
        localVal = localVal || localMin;

        var localYear = this.getSelectData(this.yearWidget);
        var localMonth = this.getSelectData(this.monthWidget);

        var localMax = HBYTimeModel.getDayByYearMonth(localYear,localMonth);

        this.setViewList(widget,localMin,localMax,localVal);
    },

    initHours:function(widget,localVal,localMin){
        // var localMin = 0;
        localMin = localMin || 0;
        var localMax = 23;
        localVal = localVal || localMin;
        this.setViewList(widget,localMin,localMax,localVal);
    },

    initMinutes:function(widget,localVal,localMin){
        // var localMin = 0;
        localMin = localMin || 0;
        var localMax = 59;
        localVal = localVal || localMin;

        this.setViewList(widget,localMin,localMax,localVal);
    },

    initSeconds:function(widget,localVal){
        var localMin = 0;
        var localMax = 59;
        localVal = localVal || localMin;
        this.setViewList(widget,localMin,localMax,localVal);
    },

    setViewList:function (widget,localMin,localMax,localVal){
        widget.removeAllChildren();
        var localCount = 1;
        var resultIndex = 1;
        for(var index = localMin; index <= localMax; index++) {
            var tItem = new hbyTimeItem(index, this, widget);
            widget.pushBackCustomItem(tItem);
            if (index == localVal) {
                tItem.choiceTime();
                resultIndex = localCount;
            }
            ++localCount;
        }
    },

    getSelectData:function(widget){
        var result = 0;
        var localArr = [];
        if(widget){
            localArr = widget.children;
        }
        for(var index = 0;index < localArr.length;++index){
            var item = localArr[index];
            if(item && item.isSelected()){
                result = item.getData();
            }
        }
        return result;
    },

    onSure:function(){
        var localTime = new Date();
        var localYear = localTime.getFullYear();
        var localMonth = localTime.getMonth() + 1;
        var localDay = localTime.getDate();
        var localHours = localTime.getHours();
        var localMinutes = localTime.getMinutes();
        var localSeconds = 0;//localTime.getSeconds();

        var resultYear = this.getSelectData(this.yearWidget);
        var resultMonth = this.getSelectData(this.monthWidget);
        var resultDay = this.getSelectData(this.dayWidget);
        var resultHours = this.getSelectData(this.hoursWidget);
        var resultMinutes = this.getSelectData(this.minutesWidget);
        var resultSeconds = 0;//this.getSelectData(this.secondsWidget); 默认0

        var timeDataA = {resultYear:localYear,
            resultMonth:localMonth,
            resultDay:localDay,
            resultHours:localHours,
            resultMinutes:localMinutes,
            resultSeconds:localSeconds
        }

        var timeDataB = {resultYear:resultYear,
            resultMonth:resultMonth,
            resultDay:resultDay,
            resultHours:resultHours,
            resultMinutes:resultMinutes,
            resultSeconds:resultSeconds
        }

        var timeData = HBYTimeModel.formatStrTime(timeDataB);
        var endTimeData = HBYTimeModel.formatStrTime(HBYTimeModel.addDayByTimeData(timeDataB));

        if(HBYTimeModel.compareTime(timeDataA,timeDataB)){
            // var timeData = HBYTimeModel.formatStrTime(timeDataB);
            // var endTimeData = HBYTimeModel.formatStrTime(HBYTimeModel.addDayByTimeData(timeDataB));
            SyEventManager.dispatchEvent("HBY_SET_TIME",{
                timeData:timeData,
                endTimeData:endTimeData
            });
            PopupManager.remove(this);
        }else{
            FloatLabelUtil.comText("设置的时间不能是已经过去的时间");
        }
    },

    add0:function(m){
        return m<10?'0'+m:m+'';
    },

});


var hbyTimeItem = ccui.Widget.extend({

    ctor:function(text , parenteScript , parenteNode){
        this.curTime = text;
        this.parenteNode = parenteNode;
        this.parenteScript = parenteScript;
        this._super();
        this.setContentSize(280, 96);

        var Panel_16=this.Panel_16= UICtor.cPanel(cc.size(280,96),cc.color(150,200,255),0);
        Panel_16.setAnchorPoint(cc.p(0,0));
        Panel_16.setPosition(0,0);
        var lbTime=this.lbTime= new ccui.Text("01月29日","res/font/bjdmj/fznt.ttf",32);
        lbTime.setPosition(150,48);
        Panel_16.addChild(lbTime);
        var line=this.line= UICtor.cImg("res/ui/bjdmj/popup/extImg/memberLine.png");
        line.setPosition(150,90);
        Panel_16.addChild(line);
        var line2=this.line2= UICtor.cImg("res/ui/bjdmj/popup/extImg/memberLine.png");
        line2.setPosition(cc.p(0+line.getAnchorPointInPoints().x, -84+line.getAnchorPointInPoints().y));
        line.addChild(line2);
        var isChoice=this.isChoice= UICtor.cImg("res/ui/bjdmj/popup/extImg/sign.png");
        isChoice.setPosition(60,48);
        Panel_16.addChild(isChoice);


        this.line.visible = false;
        this.isChoice.visible = false;

        this.addChild(Panel_16);
        this.setData(this.curTime);
        Panel_16.setTouchEnabled(true);
        UITools.addClickEvent(this.Panel_16 , this , this.choiceTime);

    },

    fixShow:function(){
        this.line.visible = false;
        this.isChoice.visible = false;
        this.lbTime.setColor(cc.color(255,255,255));
    },

    choiceTime:function(btn){
        if(this.parenteScript){
            this.lbTime.setColor(cc.color(255,111,24))
            this.line.visible = true;
            this.isChoice.visible = true;
            if(this.parenteNode && btn){
                this.parenteScript.onClickChange(this.parenteNode,this);
            }
        }
    },

    isSelected:function(){
        return this.isChoice.visible;
    },

    getData:function (){
       return this.curTime;
    },

    setData:function(text){
        this.lbTime.setString(""+text);
    },

});

var HBYTimeModel = {

    /**
     * 比较两个时间早晚
     * @param timeDataA 早时间
     * @param timeDataB 晚时间
     * @param isHasSeconds 是否比较秒
     * @returns {boolean}
     */
    compareTime:function (timeDataA,timeDataB,isHasSeconds){
        var localYear = timeDataA.resultYear;
        var localMonth = timeDataA.resultMonth;
        var localDay = timeDataA.resultDay;
        var localHours = timeDataA.resultHours;
        var localMinutes = timeDataA.resultMinutes;
        var localSeconds = timeDataA.resultSeconds;

        var isYearLow = localYear > timeDataB.resultYear;
        var isMonthLow = localYear == timeDataB.resultYear && localMonth > timeDataB.resultMonth;
        var isDayLow = localYear == timeDataB.resultYear && localMonth == timeDataB.resultMonth && localDay > timeDataB.resultDay;
        var isHoursLow = localYear == timeDataB.resultYear && localMonth == timeDataB.resultMonth && localDay == timeDataB.resultDay && localHours > timeDataB.resultHours;
        var isMinutesLow = localYear == timeDataB.resultYear && localMonth == timeDataB.resultMonth && localDay == timeDataB.resultDay &&
            localHours == timeDataB.resultHours && localMinutes > timeDataB.resultMinutes;

        var isSecondsLow = localYear == timeDataB.resultYear && localMonth == timeDataB.resultMonth && localDay == timeDataB.resultDay &&
            localHours == timeDataB.resultHours && localMinutes == timeDataB.resultMinutes && localSeconds > timeDataB.resultSeconds;

        if(!isHasSeconds){
            return !isYearLow && !isMonthLow && !isDayLow && !isHoursLow && !isMinutesLow;
        }else{
            return !isYearLow && !isMonthLow && !isDayLow && !isHoursLow && !isMinutesLow && !isSecondsLow;
        }
    },

    add0:function(m){
        return m<10?'0'+m:m+'';
    },

    formatStrTime:function (timeData){
        var resultStr = "";
        if(timeData){
            resultStr = timeData.resultYear+"-"+this.add0(timeData.resultMonth)+"-"+this.add0(timeData.resultDay)+" "+
            this.add0(timeData.resultHours)+":"+this.add0(timeData.resultMinutes)+":"+this.add0(timeData.resultSeconds);
        }
      return resultStr;
    },

    getDayByYearMonth: function (localYear,localMonth){
        var localMax = 31;
        if(localMonth == 2){
            localMax = 28;
            if((localYear % 4 == 0 && localYear % 100 != 0) || localYear % 400==0){
                localMax = 29;
            }
        }else if(localMonth == 4 || localMonth == 6 || localMonth == 9 || localMonth == 11){
            localMax = 30;
        }
        return localMax;
    },

    addDayByTimeData:function (timeData){
        var resultData = {};
        for(var val in timeData){
            resultData[val] = timeData[val];
        }

        var localMaxDay = this.getDayByYearMonth(timeData.resultYear,timeData.resultMonth);

        if(resultData.resultDay + 1 > localMaxDay){//是当月最后一天
            if(resultData.resultMonth < 12){//不是12月
                resultData.resultMonth += 1;
            }else{
                resultData.resultYear += 1;
                resultData.resultMonth = 1;
            }
            resultData.resultDay = 1;
        }else{
            resultData.resultDay += 1;//日期加一天
        }

        return resultData;
    },

    timeToTimeStr:function (time){
        var timeObj = new Date(time);

        var timeData = {};
        timeData.resultYear = timeObj.getFullYear();
        timeData.resultMonth = timeObj.getMonth() + 1;
        timeData.resultDay = timeObj.getDate();
        timeData.resultHours = timeObj.getHours();
        timeData.resultMinutes = timeObj.getMinutes();
        timeData.resultSeconds = timeObj.getSeconds();

        return this.formatStrTime(timeData);
    },
}



