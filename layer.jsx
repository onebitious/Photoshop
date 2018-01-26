var myDoc = app.activeDocument;//ドキュメント
var mySel = myDoc.selection;//選択
var myLayer=myDoc.layers;//レイヤー
var docWidth=myDoc.width;//ドキュメントの幅
var docHeight=myDoc.height;//ドキュメントの高さ

var myConArray=[];//テキストの配列
var myFontArray=[];//フォント名の配列
var mySizeArray=[];//サイズの配列
alert(myDoc.width);

for(var i=0,layerLen=myLayer.length-1;i<layerLen;i++){
    myConArray.push(myLayer[i].textItem.contents);
    myFontArray.push(myLayer[i].textItem.font);
    mySizeArray.push(myLayer[i].textItem.size);
    }
alert(mySizeArray);

/*
var myContents = myActiveLayer.textItem.contents;//選択している文字
var myFontName=myActiveLayer.textItem.font;//フォント名
var myFontSize=myActiveLayer.textItem.size;//（四捨五入の必要があるが割愛）
var myFontLig=myActiveLayer.textItem.ligatures;

var myFontRedColor=myActiveLayer.textItem.color.rgb.red ;//レッド値を取得　切り捨ての必要あり
var myFontGreenColor=myActiveLayer.textItem.color.rgb.green ;//レッド値を取得　切り捨ての必要あり
var myFontBlueColor=myActiveLayer.textItem.color.rgb.blue ;//レッド値を取得　切り捨ての必要あり
var myColor="R："+myFontRedColor+"　G："+myFontGreenColor+"　B："+myFontBlueColor;



.contents{
    width:docWidth;
    height:docHeight;
<div class="contents">

</div>
*/