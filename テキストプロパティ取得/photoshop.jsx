var myDocument = app.activeDocument;
var mySelection = myDocument.selection;

var myActiveLayer = activeDocument.activeLayer;//Photoshopは文字をレイヤーとして持つ

var myContents = myActiveLayer.textItem.contents;//選択している文字
var myFontName=myActiveLayer.textItem.font;//フォント名
var myFontSize=myActiveLayer.textItem.size;//（四捨五入の必要があるが割愛）

var myFontRedColor=myActiveLayer.textItem.color.rgb.red ;//レッド値を取得　切り捨ての必要あり
var myFontGreenColor=myActiveLayer.textItem.color.rgb.green ;//レッド値を取得　切り捨ての必要あり
var myFontBlueColor=myActiveLayer.textItem.color.rgb.blue ;//レッド値を取得　切り捨ての必要あり
var myColor="R："+myFontRedColor+"　G："+myFontGreenColor+"　B："+myFontBlueColor;

alert(myContents+"\r\n"+myFontName+"\r\n"+myFontSize+"\r\n"+myColor);
