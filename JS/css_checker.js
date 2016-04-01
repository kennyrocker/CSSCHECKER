/**
 * Created by kchen on 4/1/2016.
 */

// CSS Checker JS

var lineArr, selectorArr, dupArr, count, dupNum, out;
document.getElementById("clear").addEventListener("click",function() {
    document.getElementById("inStyle").value = "";
    clearTableBody();
    clearCompareArea();
    reset();
});
document.getElementById("check").addEventListener("click",function(){
    var input = "" ||document.getElementById("inStyle").value;
    reset();
    getEachLine(input);
    getDuplicate(lineArr);
});


var bindDupeItemEvent = function(){


        if(document.querySelectorAll(".dupeItem")) {
            document.querySelectorAll(".dupeItem").addEventListener("click", function (e) {

                //var i = parseInt((this.id).replace("item-",""));
                //compareAttr(dupArr[i]);
            });
        }

    $(".dupeItem").bind("click",function(){
        var i = parseInt(($(this).attr("id")).replace("item-",""));
        compareAttr(dupArr[i]);
        doDiff();
    });

};




var reset = function(){
    lineArr = [];
    selectorArr = [];
    dupArr = [];
    count = 0;
    dupNum = 0;
    MAX_RESULT_SHOWN = 5;
    outLeft = document.getElementById("leftOut");
    outLeft.innerHTML = "";
};

var getEachLine = function(s){
    lineArr = s.split("\n");
};


var getDuplicate = function(arr){
    var i;
    var combineSelector = "";
    var item = {
        attrArr: []
    };

    for(i=0; i<arr.length; i++){
        var s = arr[i];

        if(!isComment(s)){

            if(isEndWithComma(s)){
                combineSelector += s;
            }

            if(isIdentifier(s)){
                item.selectorStr = combineSelector+s;
                item.lineNum = i+1;
                item.compareSelectorStr =  sortSelctor(combineSelector+s);
                combineSelector = "";
            }

            if(isAttribute(s)){
                item.attrArr.push(s);
            }

            if(isStyleEnd(s)){
                selectorArr.push(item);
                item = {
                    attrArr: []
                };
            }
        }
    }
    compareSelector();

    showDupeList();

    console.log("XXX", selectorArr);

    bindDupeItemEvent();

};


var isComment = function(s){
    var regex = new RegExp(/\*.+?\*/g);
    //var regex = new RegExp(/(^\/\*.*)|(.*\*\/$)/gm);
    if(s.match(regex)) return true;
    else return false;

};

var isEndWithComma = function(s){
    var regex = new RegExp(/(.*,$)/gm);
    if(s.match(regex)) return true;
    if(s.match(regex)) return true;
    else return false;

};

var isIdentifier = function(s){
    var regex = new RegExp(/([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/g);
    if(s.match(regex)) return true;
    else return false;

};

var isAttribute = function(s){
    var regex = new RegExp(/.*:.*;/gm);
    if(s.match(regex)) return true;
    else return false;

};

var isStyleEnd = function(s){
    var regex = new RegExp(/.*}$/gm);
    if(s.match(regex)) return true;
    else return false;

};

var sortSelctor = function(s){
    var i;
    var oStr = "";
    s = s.replace("{","");
    var sArr = s.split(",");
    var arr = [];
    for(i=0;i<sArr.length;i++){
        var str = sArr[i].replace(/^\s+|\s+$/g,"");
        arr.push(str);
    }
    arr.sort();
    oStr = arr.join(",");
    return oStr;
};

var compareSelector = function(){
    var i, j;
    for(i=0;i<selectorArr.length;i++){
        var compareStr = selectorArr[i].compareSelectorStr;
        var lineNum =  selectorArr[i].lineNum;
        var selectorStr = selectorArr[i].selectorStr;
        var attrArr = selectorArr[i].attrArr;
        for(j=0;j<selectorArr.length;j++){
            var subCompareStr = selectorArr[j].compareSelectorStr;
            var subLineNum =  selectorArr[j].lineNum;
            var subSelectorStr = selectorArr[j].selectorStr;
            var subAttrArr = selectorArr[j].attrArr;
            if(i !== j){
                if(compareStr == subCompareStr){
                    if(count < MAX_RESULT_SHOWN) {
                        console.log("j => "+j, selectorArr[j]);
                        console.log("i => "+i, selectorArr[i]);
                        dupArr.push({lineNum: lineNum, selectorStr: selectorStr, attrArr: attrArr, subLineNum: subLineNum, subSelectorStr: subSelectorStr, subAttrArr: subAttrArr});
                        count++;
                    }
                }
                dupNum ++;
            }
        }
    }
};



var displayDupeItem = function(o){
    console.log(o);
    var outStr =  "<div class='dupeItem' id='item-"+ o.count+"'>";
    outStr += "<div>//----------------------------  " + (o.count + 1) + "  -----------------------------//</div>";
    outStr += "<div>----------------------------------------------------------------</div>";
    outStr += "<div> Line: " + o.lineNum + " :: '" + o.selectorStr + "'</div>";
    outStr += "<div> Duplicated Line: " + o.subLineNum + " :: '" + o.subSelectorStr + "'</div>";
    outStr += "<div>----------------------------------------------------------------</div>";
    outStr += "</div>";
    outLeft.innerHTML = outLeft.innerHTML + outStr;
};

var displayDupeTotal = function(i){
    outLeft.innerHTML = outLeft.innerHTML + "<div style='margin-top:30px;'>TOTAL DUPE :: "+i+ "</div>";
}


var showDupeList = function(){
    var i;
    for(i=0; i<dupArr.length; i++){
        var o = dupArr[i];
        displayDupeItem({count:i, lineNum: o.lineNum, selectorStr: o.selectorStr, subLineNum: o.subLineNum, subSelectorStr: o.subSelectorStr});
    }
    displayDupeTotal(dupNum/2);
};

var compareAttr = function(o){
    updateCompareText({id:"leftLabel", text:"LINE : "+ o.lineNum});
    updateCompareText({id:"rightLabel", text:"LINE : "+ o.subLineNum});
    printCSSToTextArea({id:"een", selectorStr:o.selectorStr, attrArr:o.attrArr});
    printCSSToTextArea({id:"twee", selectorStr:o.subSelectorStr, attrArr:o.subAttrArr});
};

var updateCompareText = function(o){
    var ele = document.getElementById(o.id);
    ele.innerHTML = o.text;
};

var printCSSToTextArea = function(o){
    var i;
    var div = document.getElementById(o.id);
    div.value = "";
    div.value = div.value + o.selectorStr + "\n";
    for(i=0; i<o.attrArr.length; i++){
        div.value = div.value + o.attrArr[i]+ "\n";
    }
    div.value = div.value + "}";
};
