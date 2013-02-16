#
#	PxEZEL.js
#	@charset 'UTF-8'
#______________________________________

EZEL(Easy eLearning)は、eラーニングコンテンツの効率的な開発と配布を
目的として開発されたXMLの規格です。

PxEZEL.js は、EZELのブラウザ上での実行環境を提供します。
PxEZEL.js は、jQueryライブラリに依存します。

【サンプルコンテンツ】

sampledata/start.xml に同梱。

【使い方】

<!--↓ライブラリをロード-->
<script type="text/javascript" src="resources/jquery.js"></script>
<script type="text/javascript" src="resources/EZEL/PxEZEL.js"></script>

<!--↓コンテンツを展開するステージを作成-->
<div id="cont_ezel_content"></div>

<!--↓コンテンツを展開する-->
<script type="text/javascript">
$(document).ready( function(){
	//	PxEZELは、3つの引数を取る
	var cont_PxEZEL = new PxEZEL(
		//PxEZEL.jsを置いたディレクトリのパス
		'resources/EZEL' ,
		//コンテンツXMLのパス
		'resources/EZEL/sampledata/start.xml' ,
		//ステージの要素
		document.getElementById('cont_ezel_content')
	);
} );
</script>

【更新履歴】

changelog.txt を参照してください。

--------------------------------------
Copyright (C)Tomoya Koyanagi.
http://www.pxt.jp/

