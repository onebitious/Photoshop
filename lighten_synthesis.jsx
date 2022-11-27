/*
仕様
2022/11/26 記述
ダイアログを開き、処理するファイルが格納されたフォルダを選択。
「いくつおきに処理しますか？」のダイアログで何枚おきに処理するかの数値を入力します。
「おきに」とは「置きに」と書きます。
例；
「0」と入力
1、2、3、4、5、6、7、8、9、10.....
「1」と入力
1、3、5、7、9、11、13、15、17.....
「2」と入力
1、4、7、10、13、16、19、22.....
「10」と入力
1、12、23、34、45、56、78、89.....
「100」と入力
1、102、203、304、405、506、607、708、809、910.....
入力した数値が、開くファイルの間の数になります。

ファイルを開いた後、レイヤー名をファイル名（拡張子なし）に、レイヤーモードを「カラー比較（明）」にし、一番最初のファイルにレイヤー複製を行います。
一番最初のファイルだけ残し、開いたファイルは保存せずに閉じます。
レイヤーの順番は昇順に並びます。
ファイルは保存せずに開いた状態にします。
*/

MAIN: { //ラベル
    var preFolder = Folder.selectDialog("処理するフォルダを選択してください");
    if (!preFolder) {
        alert("処理を中断します。");
        break MAIN; //キャンセルの場合処理を抜ける
    }
    var preFiles = new Array;
    var preFiles = preFolder.getFiles(); //処理前のフォルダから全てのファイルを取得
    var firstFileName = preFiles[1].name; //最初のファイル名を取得

    var flag = false; //フラグの初期化
    while (flag == false) {
        var myDialog = new Window('dialog', '数値入力', [830, 480, 1090, 580]); //見出し
        myDialog.center();
        myDialog.staticText = myDialog.add("statictext", [10, 5, 275, 25], "いくつおきに処理しますか？"); //固定テキスト
        myDialog.inputNum = myDialog.add("edittext", [10, 35, 100, 45], "0"); //入力欄。デフォルトは「0」
        myDialog.okBtn = myDialog.add("button", [135, 70, 220, 35], "OK", {
            name: "ok"
        }); //OKボタン
        myDialog.cancelBtn = myDialog.add("button", [50, 70, 135, 35], "キャンセル", {
            name: "cancel"
        }); //キャンセルボタン

        var bottomFlag = myDialog.show(); //ダイアログを表示し、OK、キャンセルボタンの結果を取得
        var flag = true;
        if (bottomFlag == 2) { //キャンセルの場合処理を抜ける
            alert("処理を中断します。");
            break MAIN;
        }

        if (isNaN(myDialog.inputNum.text) == true) { //数値以外が入力されたら繰り返す　※入力値はstringになる
            var flag = false;
            alert("整数を入力してください。");
        }
    }

    var inputNum = Number(myDialog.inputNum.text); //数値へ型変換
    for (var i = 1, preFilesLength = preFiles.length; i < preFilesLength - 1; i = i + (inputNum+1)) { //一度全てのファイルを開ききる
        open(preFiles[i]);
        var doc = app.activeDocument, //アクティブドキュメント
            fileName = doc.name, //ファイル名を取得
            fileNameResult = fileName.split("."), //ファイル名を小数点で分割
            layer = app.activeDocument.activeLayer;
        layer.name = fileNameResult[0]; //レイヤー名をファイル名にする

        // ▼▼▼ ScriptListenerの処理
        // =======================================================
        // レイヤーモードを「カラー比較（明るい）」に設定
        var idset = stringIDToTypeID("set");
        var desc1080 = new ActionDescriptor();
        var idnull = stringIDToTypeID("null");
        var ref205 = new ActionReference();
        var idlayer = stringIDToTypeID("layer");
        var idordinal = stringIDToTypeID("ordinal");
        var idtargetEnum = stringIDToTypeID("targetEnum");
        ref205.putEnumerated(idlayer, idordinal, idtargetEnum);
        desc1080.putReference(idnull, ref205);
        var idto = stringIDToTypeID("to");
        var desc1081 = new ActionDescriptor();
        var idmode = stringIDToTypeID("mode");
        var idblendMode = stringIDToTypeID("blendMode");
        var idlighterColor = stringIDToTypeID("lighterColor");
        desc1081.putEnumerated(idmode, idblendMode, idlighterColor);
        var idlayer = stringIDToTypeID("layer");
        desc1080.putObject(idto, idlayer, desc1081);
        executeAction(idset, desc1080, DialogModes.NO);
    }

    for (var j = 0, docLength = app.documents.length; j < docLength - 1; j++) { //開いてから処理を開始する
        // ▼▼▼ ScriptListenerの処理
        // =======================================================
        // レイヤーを複製
        var idduplicate = stringIDToTypeID("duplicate");
        var desc687 = new ActionDescriptor();
        var idnull = stringIDToTypeID("null");
        var ref136 = new ActionReference();
        var idlayer = stringIDToTypeID("layer");
        var idordinal = stringIDToTypeID("ordinal");
        var idtargetEnum = stringIDToTypeID("targetEnum");
        ref136.putEnumerated(idlayer, idordinal, idtargetEnum);
        desc687.putReference(idnull, ref136);
        var idto = stringIDToTypeID("to");
        var ref137 = new ActionReference();
        var iddocument = stringIDToTypeID("document");
        ref137.putName(iddocument, firstFileName); //最初のファイルに複製
        desc687.putReference(idto, ref137);
        var iddestinationDocumentID = stringIDToTypeID("destinationDocumentID");
        desc687.putInteger(iddestinationDocumentID, 283);
        var idversion = stringIDToTypeID("version");
        desc687.putInteger(idversion, 5);
        executeAction(idduplicate, desc687, DialogModes.NO);

        //▼保存しないで閉じる
        app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
    }
    var layerLength = app.activeDocument.layers.length; //レイヤー数を取得

    //▼最下部のレイヤーを最上部に移動
    app.activeDocument.layers[layerLength - 1].move(app.activeDocument.layers[0], ElementPlacement.PLACEBEFORE);

    alert("処理が終わりました");
}
