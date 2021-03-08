/**
 * Created by zhoufan on 2015/8/22.
 * @class
 * @extend {cc.Class}
 */
var SmallCard = Card.extend({
    /**
     * @construct
     * @param cardVo {CardVo}
     */
    ctor:function(cardVo , cardType,isPDK){
        var cardType = cardType || 1;
        this._selected = false;
        this._touched = false;
        this._super("smallcard" , cardVo , cardType,isPDK);
        this.i = cardVo.i;
        this.t = cardVo.t;
        this.n = cardVo.n;
        this.c = cardVo.c;
    }
});