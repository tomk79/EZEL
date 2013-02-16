#
#	PxEZEL
#	@charset 'UTF-8'
#______________________________________

EZEL(Easy eLearning)は、eラーニングコンテンツの効率的な開発と配布を
目的として開発されたXMLの規格です。

PxEZEL は、EZELのブラウザ上での実行環境を提供する
JavaScript のライブラリです。
PxEZEL は、jQueryライブラリに依存します。

詳しくは、次のサイトを参照してください。
http://ezel.pxt.jp/

【サンプルコンテンツ】

sampledata/start.xml に同梱。

【使い方】

<!--↓ライブラリをロード-->
<script type="text/javascript" src="resources/jquery.js"></script>
<script type="text/javascript" src="resources/PxEZEL/PxEZEL.js"></script>

<!--↓コンテンツを展開するステージを作成-->
<div id="cont_ezel"></div>

<!--↓コンテンツを展開する-->
<script type="text/javascript">
$(document).ready( function(){
	//	PxEZELは、3つの引数を取る
	var cont_PxEZEL = new PxEZEL(
		//PxEZEL.jsを置いたディレクトリのパス
		'resources/PxEZEL' ,
		//コンテンツXMLのパス
		'resources/PxEZEL/sampledata/start.xml' ,
		//ステージの要素
		document.getElementById('cont_ezel')
	);
} );
</script>

【更新履歴】

changelog.txt を参照してください。

--------------------------------------
Copyright (C)Tomoya Koyanagi.
http://www.pxt.jp/

