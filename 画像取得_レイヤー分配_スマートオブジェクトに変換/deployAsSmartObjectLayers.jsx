/*
 選択したフォルダ内の画像をレイヤーごとに配置しスマートオブジェクトに変換する。
 全ての画像から幅、高さ、解像度の最大値を取得し、取得した最大値で新規ドキュメントを作成する。
 カラーモードはRGB固定とする。
 処理時間をファイル名にしデスクトップに保存する。

 例：
 yyyy年mmmm月dddd日hh時mm分ss秒.psd
 psdオプションはカラープロファイルとレイヤーのみtrueとする。
*/

MAIN: { //ラベル
    flag = false;
    while (flag == false) {
        var fol = Folder.selectDialog("画像が格納されているフォルダを選択してください。"); //フォルダを選択

        if (fol == null) { //キャンセルの場合　※ゴミ箱を選んでもnullが返る
            alert("キャンセルします。");
            break MAIN;
        }
        var selFiles = fol.getFiles(); //ファイルを取得

        if (selFiles == "") { //中身が空の場合
            alert("画像が格納されているフォルダを選択してください。");
            flag = false;
        } else {
            flag = true
        }
    }

    try {
        var wArray = []; //幅の配列を準備
        var hArray = []; //高さの配列を準備
        var resArray = []; //解像度の配列を準備

        //▼幅、高さ、解像度を取得するため一度ファイルを開く　※開かないで取得は可能か？？？
        for (var i = 0, selFilesLen = selFiles.length; i < selFilesLen; i++) {
            var openFiles = new File(selFiles[i]);
            open(openFiles);
            var doc = app.activeDocument; //ドキュメント
            //var fileName = doc.name; //ファイル名
            var meta = doc.xmpMetadata; //xmpデータ
            var raw = meta.rawData; //rawデータ
            var wMatch = raw.match(/<exif:PixelXDimension>(\d.+?\d)<\/exif:PixelXDimension>/); //幅
            wArray.push(wMatch[1]); //幅を配列に格納
            var hMatch = raw.match(/<exif:PixelYDimension>(\d.+?\d)<\/exif:PixelYDimension>/); //高さ
            hArray.push(hMatch[1]); //高さを配列に格納
            var resMatch = raw.match(/<tiff:XResolution>(\d.+?\d)\/(\d.+?\d)<\/tiff:XResolution>/); //解像度
            resArray.push(resMatch[1] / resMatch[2]); //解像度を配列に格納
            doc.close(); //閉じる
        }

        //▼ドキュメントのサイズと解像度を決定
        var wMaxValue = Math.max.apply(this, wArray); //幅の最大値を取得
        var hMaxValue = Math.max.apply(this, hArray); //高さの最大値を取得
        var resMaxValue = Math.max.apply(this, resArray); //解像度の最大値を取得

        //▼ドキュメント作成
        preferences.rulerUnits = Units.PIXELS; //単位はピクセル
        var doc = app.documents.add(wMaxValue, hMaxValue, resMaxValue, NewDocumentMode.RGB); //上記で得た最大値で新規ドキュメント作成
        var lay = doc.artLayers; //レイヤー

        //▼配置～スマートオブジェクト変換
        for (var j = 0, selFilesLen = selFiles.length; j < selFilesLen; j++) {
            //▼画像をリンク配置　※ScriptListener使用
            var idPlc = charIDToTypeID("Plc ");
            var desc8 = new ActionDescriptor();
            var idIdnt = charIDToTypeID("Idnt");
            desc8.putInteger(idIdnt, 3);
            var idnull = charIDToTypeID("null");
            desc8.putPath(idnull, new File(selFiles[j]));
            var idLnkd = charIDToTypeID("Lnkd");
            desc8.putBoolean(idLnkd, true);
            var idFTcs = charIDToTypeID("FTcs");
            var idQCSt = charIDToTypeID("QCSt");
            var idQcsa = charIDToTypeID("Qcsa");
            desc8.putEnumerated(idFTcs, idQCSt, idQcsa);
            var idOfst = charIDToTypeID("Ofst");
            var desc9 = new ActionDescriptor();
            var idHrzn = charIDToTypeID("Hrzn");
            var idRlt = charIDToTypeID("#Rlt");
            desc9.putUnitDouble(idHrzn, idRlt, 0.000000);
            var idVrtc = charIDToTypeID("Vrtc");
            var idRlt = charIDToTypeID("#Rlt");
            desc9.putUnitDouble(idVrtc, idRlt, 0.000000);
            var idOfst = charIDToTypeID("Ofst");
            desc8.putObject(idOfst, idOfst, desc9);
            executeAction(idPlc, desc8, DialogModes.NO);

            //▼スマートオブジェクトに変換　※ScriptListener使用
            var idnewPlacedLayer = stringIDToTypeID("newPlacedLayer");
            executeAction(idnewPlacedLayer, undefined, DialogModes.NO);
        }

        var layLen = lay.length;
        lay[layLen - 1].remove(); //背景レイヤーを削除

        //▼ファイル名にする日付を取得
        var myDate = new Date();
        var myYear = myDate.getFullYear();
        var myMonth = myDate.getMonth() + 1;
        var myDay = myDate.getDate();
        var myHours = myDate.getHours();
        var myMinutes = myDate.getMinutes();
        var mySeconds = myDate.getSeconds();
        var nowTime = myYear + "年" + myMonth + "月" + myDay + "日" + myHours + "時" + myMinutes + "分" + mySeconds + "秒";

        //▼Photoshop保存オプション
        var psdOpt = new PhotoshopSaveOptions();
        var fileObj = new File("~/Desktop/" + nowTime + ".psd");
        psdOpt.alphaChannels = false; //アルファチャンネル
        psdOpt.annotations = false; //注釈
        psdOpt.embedColorProfile = true; //カラープロファイル
        psdOpt.layers = true; //レイヤー
        psdOpt.spotColors = false; //スポットカラー
        //psdOpt.typename = "";
        doc.saveAs(fileObj, psdOpt);
    } catch (e) {
        alert("エラーがおきました。処理を中断します。");
        break MAIN;
    }
alert("処理が終わりました");
}