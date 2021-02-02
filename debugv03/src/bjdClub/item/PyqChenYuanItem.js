/**
 * Created by leiwenwen on 2018/10/15.
 */
var PyqChenYuanItem = ccui.Widget.extend({
    ctor:function(data,root,index){
        this.data = data;
        this.parentNode = root;

        this._super();
        this.setContentSize(265, 114);

        var mainPopup=this.mainPopup= UICtor.cPanel(cc.size(265,114),cc.color(0,0,0),0);
        mainPopup.setAnchorPoint(cc.p(0,0));
        mainPopup.setPosition(0,0);
        var Button_role=this.Button_role= UICtor.cBtnBright("res/res_ui/qyq/common/commonButton/anniu1.png","res/res_ui/qyq/common/commonButton/anniu2.png");
        Button_role.setPosition(140,57);
        mainPopup.addChild(Button_role);
        var Label_role=this.Label_role= new ccui.Text("所有成员","res/font/bjdmj/fznt.ttf",40);
        Label_role.setColor(cc.color("#9d2e2e"));
        Label_role.setPosition(cc.p(0+Button_role.getAnchorPointInPoints().x, 0+Button_role.getAnchorPointInPoints().y));
        Button_role.addChild(Label_role);
        var Label_role_1=this.Label_role_1= new ccui.Text("所有成员","res/font/bjdmj/fznt.ttf",40);
        Label_role_1.setColor(cc.color("#9d2e2e"));
        Label_role_1.setPosition(cc.p(0+Button_role.getAnchorPointInPoints().x, 0+Button_role.getAnchorPointInPoints().y));
        Button_role.addChild(Label_role_1);

        Button_role.setTouchEnabled(false);
        this.addChild(mainPopup);
        this.setData(data)
    },

    //显示数据
    setData:function(roleData){
        if (roleData){
            var roleSize = 40;
            var roleName = roleData.name;
            var color = "9d2e2e";
            if (roleData.name != "所有成员"){
                this.Label_role.y = 80;
                this.Label_role_1.y = 38;
                roleSize = 32;
                roleName = UITools.truncateLabel(roleData.userName,4);
                color = "886032";
            }else{
                this.Label_role.y = 57;
                this.Label_role_1.y = 57;
                roleData.name = "";
            }
            this.Label_role_1.setFontSize(roleSize);
            this.Label_role_1.setString(roleData.name);
            this.Label_role_1.setColor(cc.color(color));
            this.Label_role.setFontSize(roleSize);
            this.Label_role.setString(roleName);
            this.Label_role.setColor(cc.color(color));
        }

    },
    refresh:function(isChoose){
        var isBright = false;
        var color = "886032";
        if (isChoose){
            isBright = true;
            color = "9d2e2e";
        }
        this.Button_role.setBright(isBright);
        this.Label_role.setColor(cc.color(color));
        this.Label_role_1.setColor(cc.color(color));
    },
})