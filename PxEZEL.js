/** --------------------------------------
EZELコンテンツの実行環境ライブラリ
(C)Tomoya Koyanagi.
version 0.0.1a2
LastUpdate : 3:28 2009/04/29
**/
function PxEZEL( path_lib_dir , path_content , stageElement ){
	this.path_lib_dir = path_lib_dir;
	this.path_content = path_content;
	this.stageElement = stageElement;
	this.stageElement.PxEZEL = this;

	this.env_stage_width = 320;
	this.env_stage_height = 180;
	this.env_stage_bgcolor = '#dddddd';
	this.env_fontsize = 13;
	this.env_defaultSpeed = 5;

	this.keyElements = {};

	this.characters = [];
	this.story = [];
	this.anchorIndexes = {};

	this.playingStatus = {};

	//--------------------------------------
	//	オブジェクトの初期化
	this.init = function( path_lib_dir , path_content , stageElement ){
		this.path_lib_dir = path_lib_dir;
		this.path_content = path_content;
		this.stageElement = stageElement;

		this.characters = [];
		this.story = [];
		this.anchorIndexes = {};

		this.playingStatus = {
			chapterIndex : 0 ,
			actionIndex : 0 ,
			characterIndex : null ,
			characterAngle : null ,
			fixed : true
		};

		//	ステージをリセット
		this.resetStage();

		//	ロード開始する
		this.loadContent();
	}

	//--------------------------------------
	//	ライブラリディレクトリを取得
	this.getPathLibDir = function(){
		return	this.path_lib_dir;
	}

	//--------------------------------------
	//	コンテンツパスを取得
	this.getPathContent = function(){
		return	this.path_content;
	}

	//--------------------------------------
	//	ルート要素を取得
	this.getStageElement = function(){
		return	this.stageElement;
	}

	//--------------------------------------
	//	ステージをリセットする
	this.resetStage = function(){
		var elm = this.getStageElement();
		elm.style.overflow = 'hidden';
		elm.style.position = 'relative';
		elm.style.top = '0px';
		elm.style.left = '0px';
		elm.style.fontSize = this.env_fontsize;
		elm.style.backgroundColor = this.env_stage_bgcolor;
		elm.style.width = this.env_stage_width + 'px';
		elm.style.height = this.env_stage_height + 'px';
		elm.innerHTML = '';

		//	背景画像表示レイヤー
		this.keyElements.backgroundLayer = document.createElement('div');
		this.keyElements.backgroundLayer.PxEZEL = this;
		this.keyElements.backgroundLayer.style.position = 'absolute';
		this.keyElements.backgroundLayer.style.left = '0px';
		this.keyElements.backgroundLayer.style.bottom = '0px';
		this.keyElements.backgroundLayer.style.overflow = 'hidden';
		this.keyElements.backgroundLayer.style.backgroundColor = 'transparent';
		this.keyElements.backgroundLayer.style.backgroundImage = 'none';
		this.keyElements.backgroundLayer.style.width = '100%';
		this.keyElements.backgroundLayer.style.height = '100%';
		elm.appendChild( this.keyElements.backgroundLayer );

		//	キャラクター表示レイヤー
		this.keyElements.characterLayer = document.createElement('div');
		this.keyElements.characterLayer.PxEZEL = this;
		this.keyElements.characterLayer.style.position = 'absolute';
		this.keyElements.characterLayer.style.left = '0px';
		this.keyElements.characterLayer.style.bottom = '0px';
		this.keyElements.characterLayer.style.overflow = 'hidden';
		this.keyElements.characterLayer.style.backgroundColor = 'transparent';
		this.keyElements.characterLayer.style.backgroundImage = 'none';
		this.keyElements.characterLayer.style.width = '100%';
		this.keyElements.characterLayer.style.height = '100%';
		elm.appendChild( this.keyElements.characterLayer );

		//	スライドレイヤーを作成
		this.keyElements.slideLayer = document.createElement('div');
		this.keyElements.slideLayer.PxEZEL = this;
		this.keyElements.slideLayer.style.position = 'absolute';
		this.keyElements.slideLayer.style.right = '10%';
		this.keyElements.slideLayer.style.top = '5%';
		this.keyElements.slideLayer.style.overflow = 'auto';
		this.keyElements.slideLayer.style.backgroundColor = '#ffff99';
		this.keyElements.slideLayer.style.backgroundImage = 'none';
		this.keyElements.slideLayer.style.opacity = '0.9';
		this.keyElements.slideLayer.style.width = '80%';
		this.keyElements.slideLayer.style.height = '65%';
		this.keyElements.slideLayer.style.display = 'none';

		elm.appendChild( this.keyElements.slideLayer );

		//	メッセージパネルを作成
		this.keyElements.messagePanelFrame = document.createElement('div');
		this.keyElements.messagePanelFrame.PxEZEL = this;
		this.keyElements.messagePanelFrame.style.position = 'absolute';
		this.keyElements.messagePanelFrame.style.left = '10px';
		this.keyElements.messagePanelFrame.style.bottom = '10px';
		this.keyElements.messagePanelFrame.style.overflow = 'visible';
		this.keyElements.messagePanelFrame.style.backgroundColor = '#eeeeee';
		this.keyElements.messagePanelFrame.style.opacity = '0.9';
		this.keyElements.messagePanelFrame.style.width = ( this.env_stage_width - 20 ) + 'px';
		this.keyElements.messagePanelFrame.style.height = ( 5 ) + 'em';
		this.keyElements.messagePanelFrame.style.display = 'none';
		this.keyElements.messagePanelFrame.style.border = '1px solid #666666';
		elm.appendChild( this.keyElements.messagePanelFrame );

		this.keyElements.messagePanel = document.createElement('div');
		this.keyElements.messagePanel.PxEZEL = this;
		this.keyElements.messagePanel.style.position = 'absolute';
		this.keyElements.messagePanel.style.left = '20px';
		this.keyElements.messagePanel.style.bottom = '20px';
		this.keyElements.messagePanel.style.overflow = 'visible';
		this.keyElements.messagePanel.style.backgroundColor = 'transparent';
		this.keyElements.messagePanel.style.width = ( this.env_stage_width - 40 ) + 'px';
		this.keyElements.messagePanel.style.height = ( 3 ) + 'em';
		this.keyElements.messagePanel.style.lineHeight = '1.4em';
		this.keyElements.messagePanel.style.display = 'none';
		elm.appendChild( this.keyElements.messagePanel );

		this.keyElements.messagePanelSpeaker = document.createElement('div');
		this.keyElements.messagePanelSpeaker.PxEZEL = this;
		this.keyElements.messagePanelSpeaker.style.position = 'absolute';
		this.keyElements.messagePanelSpeaker.style.left = '15px';
		this.keyElements.messagePanelSpeaker.style.bottom = ( 6.2 ) + 'em';
		this.keyElements.messagePanelSpeaker.style.overflow = 'visible';
		this.keyElements.messagePanelSpeaker.style.float = 'left';
		this.keyElements.messagePanelSpeaker.style.padding = '3px';
		this.keyElements.messagePanelSpeaker.style.fontSize = '11px';
		this.keyElements.messagePanelSpeaker.style.color = '#f6f6f6';
		this.keyElements.messagePanelSpeaker.style.backgroundColor = '#666666';
		this.keyElements.messagePanelSpeaker.style.width = 'auto';
		this.keyElements.messagePanelSpeaker.style.height = 'auto';
		this.keyElements.messagePanelSpeaker.style.display = 'none';
		elm.appendChild( this.keyElements.messagePanelSpeaker );

		//	コントローラを作成
		this.keyElements.controller = document.createElement('div');
		this.keyElements.controller.PxEZEL = this;
		this.keyElements.controller.style.position = 'absolute';
		this.keyElements.controller.style.left = '0px';
		this.keyElements.controller.style.bottom = '0px';
		this.keyElements.controller.style.overflow = 'visible';
		this.keyElements.controller.style.backgroundColor = 'transparent';
		this.keyElements.controller.style.backgroundImage = 'none';
		this.keyElements.controller.style.width = '0%';
		this.keyElements.controller.style.height = '0%';
		elm.appendChild( this.keyElements.controller );

	}

	//----------------------------------------------------------------------------
	//	キャラクターIDからインデックス番号を得る
	this.getCharacterIndexById = function( characterId ){
		for( var i = 0; this.characters.length > i; i ++ ){
			if( this.characters[i].characterId == characterId ){
				return i;
			}
		}
		return false;
	}

	//----------------------------------------------------------------------------
	//	コンテンツを取得
	this.loadContent = function(){

		$.ajax( {
			PxEZEL: this,//仮実装
			url: this.getPathContent() ,
			error:function(){
				alert('エラー：XML取得に失敗しました。');
				this.PxEZEL.getStageElement().innerHTML = '<span class="error">XML取得に失敗しました。</span>';
			} ,
			success:function( data ){

				//--------------------------------------
				//	環境設定読み込み
				var stageElementSetting = $( 'ezel > env' , data );
				if( stageElementSetting.length ){
					this.PxEZEL.env_stage_width   = stageElementSetting[0].getAttribute('width'        );
					this.PxEZEL.env_stage_height  = stageElementSetting[0].getAttribute('height'       );
					this.PxEZEL.env_stage_bgcolor = stageElementSetting[0].getAttribute('bgcolor'      );
					this.PxEZEL.env_fontsize      = stageElementSetting[0].getAttribute('fontsize'     );
					this.PxEZEL.env_defaultSpeed  = stageElementSetting[0].getAttribute('defaultspeed' );
				}

				if( this.PxEZEL.env_defaultSpeed == undefined || !this.PxEZEL.env_defaultSpeed.length ){
					this.PxEZEL.env_defaultSpeed = 5;
				}
				this.PxEZEL.env_defaultSpeed = Number(this.PxEZEL.env_defaultSpeed);

				var characters = $( 'ezel > env > characters > character' , data );
				for( var i = 0; characters.length > i; i ++ ){
					var currentCharacterInfo = {
						characterId : characters[i].getAttribute('character-id') ,
						name : characters[i].getAttribute('name') ,
						images:{}
					};
					var characterImages = $( '> images > image' , characters[i] );
					for( var i2 = 0; characterImages.length > i2; i2 ++ ){
						var angle = characterImages[i2].getAttribute('angle');
						currentCharacterInfo.images[angle] = {}
						currentCharacterInfo.images[angle].width = characterImages[i2].getAttribute('width');
						currentCharacterInfo.images[angle].height = characterImages[i2].getAttribute('height');
						currentCharacterInfo.images[angle].src = new Image;
						currentCharacterInfo.images[angle].src.src = this.PxEZEL.getRealpath( characterImages[i2].getAttribute('src') );
						currentCharacterInfo.images[angle].srcSpeaking = new Image;
						currentCharacterInfo.images[angle].srcSpeaking.src = this.PxEZEL.getRealpath( characterImages[i2].getAttribute('src-speaking') );
					}

					this.PxEZEL.characters.push( currentCharacterInfo );
				}
				//	/ 環境設定読み込み
				//--------------------------------------

				this.PxEZEL.resetStage();

				//--------------------------------------
				//	ストーリー読み込み
				var chapterList = $( 'ezel > story > chapter' , data );
				if( !chapterList.length ){
					alert( '[ERROR] ストーリーが定義されていません。' );
					return;
				}
				//チャプターを収集
				for( var i = 0; chapterList.length > i; i ++ ){
					var currentChapter = [];
					if( chapterList[i].getAttribute('anchor') ){
						this.PxEZEL.anchorIndexes[chapterList[i].getAttribute('anchor')] = {
							chapterIndex: i ,
							actionIndex: 0
						};
					}
					var chapterProperty = $('> *',chapterList[i]);
					//チャプターを解析
					for( var i2 = 0; chapterProperty.length > i2; i2 ++ ){
//						alert( chapterProperty[i2].tagName );
						var currentAction = { action:chapterProperty[i2].tagName };
						switch( currentAction.action ){
							case 'set-character':
								currentAction.characterId = chapterProperty[i2].getAttribute( 'character-id' );
								currentAction.angle = chapterProperty[i2].getAttribute( 'angle' );
								currentAction.effect = chapterProperty[i2].getAttribute( 'effect' );
								break;
							case 'unset-character':
								currentAction.effect = chapterProperty[i2].getAttribute( 'effect' );
								break;
							case 'show-message-panel':
								currentAction.effect = chapterProperty[i2].getAttribute( 'effect' );
								break;
							case 'hide-message-panel':
								currentAction.effect = chapterProperty[i2].getAttribute( 'effect' );
								break;
							case 'set-bgimage':
								currentAction.image = new Image;
								currentAction.image.src = this.PxEZEL.getRealpath( chapterProperty[i2].getAttribute( 'src' ) );
								break;
							case 'unset-bgimage':
								break;
							case 'slide':
								currentAction.type = chapterProperty[i2].getAttribute( 'type' );
								currentAction.content = $( chapterProperty[i2] ).text();
								break;
							case 'show-slide':
								break;
							case 'hide-slide':
								break;
							case 'select':
								currentAction.message = chapterProperty[i2].getAttribute( 'message' );
								currentAction.options = new Array();
								var selectOptions = $( '> option' , chapterProperty[i2] );
								for( var optInex = 0; selectOptions.length > optInex; optInex ++ ){
									var optionInfo = {};
									optionInfo.goto = selectOptions[optInex].getAttribute( 'goto' );
									optionInfo.label = $( selectOptions[optInex] ).text();
									currentAction.options.push( optionInfo );
								}
								break;
							case 'sleep':
								currentAction.long = chapterProperty[i2].getAttribute( 'long' );
								break;
							case 'goto':
								currentAction.goto = chapterProperty[i2].getAttribute( 'goto' );
								if( currentAction.goto === null ){
									alert( 'ERROR: 行き先が指定されていません。' );
								}
								break;
							case 'message':
								var tmp_element = document.createElement('div');
								tmp_element.innerHTML = $( chapterProperty[i2] ).text();
								currentAction.text = $( tmp_element ).text();
								currentAction.html = tmp_element.innerHTML;
								currentAction.speaker = chapterProperty[i2].getAttribute( 'speaker' );
								currentAction.autonext = chapterProperty[i2].getAttribute( 'autonext' );
								switch( chapterProperty[i2].getAttribute( 'autonext' ) ){
									case 'yes':
									case 'on':
									case '1':
										currentAction.autonext = true;
										break;
								}
								currentAction.start = 0;
								if( this.PxEZEL.strlen( chapterProperty[i2].getAttribute( 'start' ) ) ){
									currentAction.start = parseInt( chapterProperty[i2].getAttribute( 'start' ) );
								}
								currentAction.speed = parseInt( this.PxEZEL.env_defaultSpeed );
								if( this.PxEZEL.strlen( chapterProperty[i2].getAttribute( 'speed' ) ) ){
									currentAction.speed = parseInt( chapterProperty[i2].getAttribute( 'speed' ) );
								}
								break;
							default:
								break;
						}
						if( chapterProperty[i2].getAttribute('anchor') ){
							this.PxEZEL.anchorIndexes[chapterProperty[i2].getAttribute('anchor')] = {
								chapterIndex: i ,
								actionIndex: i2
							};
						}
						currentChapter.push( currentAction );
					}
					this.PxEZEL.story.push( currentChapter );
				}
				//	/ ストーリー読み込み
				//--------------------------------------

				//	再生する
				this.PxEZEL.play();
			}
		} );
	}//function loadContent()
	//	/ コンテンツを取得
	//----------------------------------------------------------------------------


	//----------------------------------------------------------------------------
	//	プレゼンテーションを再生する
	this.play = function(){
		if( !this.playingStatus.fixed ){
			//	まだアクションの途中だったら
			//	UTODO : 未実装
//			this.playingStatus.fixed = true;
			return true;
		}

		//	アクションの再生の開始を宣言
		this.playingStatus.fixed = false;

		var currentAction = this.story[this.playingStatus.chapterIndex][this.playingStatus.actionIndex];
		this.setCtrl( { type: 'clear' } );

		switch( currentAction.action ){
			case 'set-character':
				this.keyElements.characterLayer.innerHTML = '';
				this.playingStatus.characterIndex = this.getCharacterIndexById( currentAction.characterId );
				this.playingStatus.characterAngle = currentAction.angle;
				var imageElm = document.createElement('img');
				imageElm.src = this.characters[this.playingStatus.characterIndex].images[this.playingStatus.characterAngle].src.src;
				imageElm.width = this.characters[this.playingStatus.characterIndex].images[this.playingStatus.characterAngle].width;
				imageElm.height = this.characters[this.playingStatus.characterIndex].images[this.playingStatus.characterAngle].height;
				imageElm.style.position = 'absolute';
				imageElm.style.bottom = '0px';
				imageElm.style.left = (this.stageElement.offsetWidth/2) - ( imageElm.width/2 ) + 'px';
				imageElm.style.display = 'none';
				this.keyElements.characterLayer.appendChild( imageElm );
				if( currentAction.effect == 'fadein' ){
					var PxEZEL = this;
					$( imageElm ).fadeIn(
						'slow' ,
						function(){
							PxEZEL.playingStatus.fixed = true;
							PxEZEL.playNext();
						}
					);
				}else{
					imageElm.style.display = 'block';
					this.playingStatus.fixed = true;
					this.playNext();
				}
				return true;
				break;
			case 'unset-character':
				this.playingStatus.characterIndex = null;
				this.playingStatus.characterAngle = null;
				if( currentAction.effect == 'fadeout' ){
					var PxEZEL = this;
					$( 'img' , this.keyElements.characterLayer ).fadeOut(
						'slow' ,
						function(){
							PxEZEL.keyElements.characterLayer.innerHTML = '';
							PxEZEL.playingStatus.fixed = true;
							PxEZEL.playNext();
						}
					);
				}else{
					this.keyElements.characterLayer.innerHTML = '';
					this.playingStatus.fixed = true;
					this.playNext();
				}
				break;
			case 'show-message-panel':
				if( currentAction.effect == 'fadein' ){
					var PxEZEL = this;
					$( this.keyElements.messagePanel ).fadeIn(
						'slow' ,
						function(){
							$( PxEZEL.keyElements.messagePanelFrame ).fadeIn(
								'slow' ,
								function(){
									PxEZEL.playingStatus.fixed = true;
									PxEZEL.playNext();
								}
							);
						}
					);
				}else{
					this.keyElements.messagePanel.style.display = 'block';
					this.keyElements.messagePanelFrame.style.display = 'block';
					this.playingStatus.fixed = true;
					this.playNext();
				}
				break;
			case 'hide-message-panel':
				if( currentAction.effect == 'fadeout' ){
					var PxEZEL = this;
					$( this.keyElements.messagePanel ).fadeOut(
						'slow' ,
						function(){
							$( PxEZEL.keyElements.messagePanelFrame ).fadeOut(
								'slow' ,
								function(){
									PxEZEL.playingStatus.fixed = true;
									PxEZEL.playNext();
								}
							);
						}
					);
				}else{
					this.keyElements.messagePanel.style.display = 'none';
					this.keyElements.messagePanelFrame.style.display = 'none';
					this.playingStatus.fixed = true;
					this.playNext();
				}
				break;
			case 'set-bgimage':
				var bgImage = document.createElement('img');
				bgImage.src = currentAction.image.src;
				bgImage.width = this.keyElements.backgroundLayer.offsetWidth;
				bgImage.height = this.keyElements.backgroundLayer.offsetWidth;
				this.keyElements.backgroundLayer.innerHTML = '';
				this.keyElements.backgroundLayer.appendChild( bgImage );
				this.playingStatus.fixed = true;
				this.playNext();
				break;
			case 'unset-bgimage':
				this.keyElements.backgroundLayer.innerHTML = '';
				this.playingStatus.fixed = true;
				this.playNext();
				break;
			case 'slide':
				this.keyElements.slideLayer.innerHTML = '';

				var elmPre = document.createElement('div');
				elmPre.PxEZEL = this;
				elmPre.style.display = 'block';
				elmPre.style.backgroundColor = 'transparent';
				elmPre.style.backgroundImage = 'none';
				elmPre.style.whiteSpace = 'pre';
				elmPre.style.padding = '10px';
				elmPre.style.margin = '0px';
				var elmPreSrc = currentAction.content;
				if( currentAction.type == 'html' ){
					$( elmPre ).html( elmPreSrc );
				}else{
					$( elmPre ).text( elmPreSrc );
				}

				this.keyElements.slideLayer.appendChild( elmPre );

				this.playingStatus.fixed = true;
				this.playNext();
				break;
			case 'show-slide':
				this.keyElements.slideLayer.style.display = 'block';
				this.playingStatus.fixed = true;
				this.playNext();
				break;
			case 'hide-slide':
				this.keyElements.slideLayer.style.display = 'none';
				this.playingStatus.fixed = true;
				this.playNext();
				break;
			case 'select':
				this.setCtrl( {
					type: 'select' ,
					message: currentAction.message ,
					options: currentAction.options
				} );
				this.playingStatus.fixed = true;
				break;
			case 'sleep':
				var localPxEZEL = this;
				setTimeout( function(){ localPxEZEL.playNext(); } , 1000 );
				this.playingStatus.fixed = true;
				break;
			case 'goto':
				this.playingStatus.fixed = true;
				this.gotoAndPlay( currentAction.goto );
				break;
			case 'message':
				if( this.strlen( currentAction.speaker ) ){
					var speakerIndex = this.getCharacterIndexById( currentAction.speaker );
					var speakerName = currentAction.speaker;
					if( typeof(speakerIndex) == 'number' ){
						speakerName = this.characters[speakerIndex].name;
					}
					$( this.keyElements.messagePanelSpeaker ).text( speakerName );
					if( this.playingStatus.characterIndex === speakerIndex ){
						$( 'img' , this.keyElements.characterLayer ).attr( 'src' , this.characters[this.playingStatus.characterIndex].images[this.playingStatus.characterAngle].srcSpeaking.src );
					}
					this.keyElements.messagePanelSpeaker.style.display = this.keyElements.messagePanel.style.display;
				}else{
					$( this.keyElements.messagePanelSpeaker ).text( '' );
					this.keyElements.messagePanelSpeaker.style.display = 'none';
				}

				this.keyElements.messagePanel.innerHTML = '';
				this.printMessage( {
					PxEZEL: this ,
					strBefore: currentAction.text ,
					finalHtml: currentAction.html ,
					autonext: currentAction.autonext ,
					start: currentAction.start ,
					speed: currentAction.speed ,//0～9 の 10段階
					success: function(){
						$( 'img' , this.PxEZEL.keyElements.characterLayer ).attr( 'src' , this.PxEZEL.characters[this.PxEZEL.playingStatus.characterIndex].images[this.PxEZEL.playingStatus.characterAngle].src.src );
						this.PxEZEL.setCtrl( {type:'next'} );
						this.PxEZEL.playingStatus.fixed = true;
						if( this.autonext ){
							this.PxEZEL.playNext();
						}
					}
				} );
				break;
			default:
				alert('ERROR! 不明なアクションが使用されました。');
				this.playingStatus.fixed = true;
				this.setCtrl( {type:'next'} );
				break;
		}

		return true;
	}
	//	/ プレゼンテーションを再生する
	//----------------------------------------------------------------------------

	//--------------------------------------
	//	メッセージパネルにメッセージを出力する
	this.printMessage = function( args ){
		if( args.speed == 9 ){
			//	最高速度なら、一発表示
			$( args.PxEZEL.keyElements.messagePanel ).html( args.finalHtml );
			args.success();
			return true;
		}
		if( !args.strAfter ){
			args.strAfter = '';
			if( args.start ){
				args.strAfter += args.strBefore.substr(0,args.start);
				args.strBefore = args.strBefore.substr(args.start);
			}
		}
		if( args.strBefore.length ){
			args.strAfter += args.strBefore.substr(0,1);
			args.strBefore = args.strBefore.substr(1);
			$( args.PxEZEL.keyElements.messagePanel ).text( args.strAfter );
		}

		if( args.strBefore.length ){
			var timerLong = 0;
			switch( args.speed ){
				case 0: timerLong = 1000; break;
				case 1: timerLong =  700; break;
				case 2: timerLong =  500; break;
				case 3: timerLong =  250; break;
				case 4: timerLong =  130; break;
				case 5: timerLong =   50; break;
				case 6: timerLong =   35; break;
				case 7: timerLong =   25; break;
				case 8: timerLong =   10; break;
				case 9: timerLong =    0; break;
			}
			setTimeout( function(){ args.PxEZEL.printMessage( args ); } , timerLong );
		}else{
			$( args.PxEZEL.keyElements.messagePanel ).html( args.finalHtml );
			var tagAs = $( 'a' , args.PxEZEL.keyElements.messagePanel );
			for( var i = 0; tagAs.length > i; i ++ ){
				tagAs[i].PxEZEL = this;
				tagAs[i].onclick = function(){
					this.PxEZEL.getURL( this.href );
					return false;
				}
			}
			args.success();
			args = undefined;
		}
		return true;
	}//function printMessage()
	//	/ メッセージパネルにメッセージを出力する
	//--------------------------------------

	//--------------------------------------
	//	次のアクションを開始する。
	this.playNext = function(){
		if( this.story[this.playingStatus.chapterIndex].length > this.playingStatus.actionIndex + 1 ){
			this.playingStatus.actionIndex ++;
		}else if( this.story.length > this.playingStatus.chapterIndex + 1 ){
			this.playingStatus.chapterIndex ++;
			this.playingStatus.actionIndex = 0;
		}else{
			this.finish();
			return true;
		}
		this.play();
		return true;
	}

	//--------------------------------------
	//	指定のアクションへ移動して再生
	this.gotoAndPlay = function( anchor ){
		if( !this.strlen( anchor ) ){
			alert( 'ERROR: アンカー名が指定されていません。' );
			return false;
		}
		this.playingStatus.chapterIndex = this.anchorIndexes[anchor].chapterIndex;
		this.playingStatus.actionIndex = this.anchorIndexes[anchor].actionIndex;
		this.play();
		return true;
	}


	//--------------------------------------
	//	次のアクションが定義されているか調べる
	this.isNextAction = function(){
		if( this.story[this.playingStatus.chapterIndex].length <= this.playingStatus.actionIndex + 1 ){
			return false;
		}else if( this.story.length <= this.playingStatus.chapterIndex + 1 ){
			return false;
		}
		return true;
	}


	//--------------------------------------
	//	コントローラをセットする
	this.setCtrl = function( prop ){
		if( !prop ){ prop = {}; }
		if( !prop.type ){ prop.type = 'next'; }
		if( !prop.options ){ prop.options = []; }
		if( !prop.callback ){
			prop.callback = function(){
				this.PxEZEL.playNext();
				return true;
			}
		}

		switch( prop.type ){
			case 'clear':
				//	コントロールできなくする
				this.keyElements.controller.innerHTML = '';
				this.keyElements.controller.style.top = '0px';
				this.keyElements.controller.style.right = 'auto';
				this.keyElements.controller.style.bottom = 'auto';
				this.keyElements.controller.style.left = '0px';
				this.keyElements.controller.style.visibility = 'hidden';
				this.keyElements.controller.style.width = '0px';
				this.keyElements.controller.style.height = '0px';
				this.keyElements.controller.style.backgroundColor = 'transparent';
				this.keyElements.controller.style.backgroundImage = 'none';
				this.keyElements.controller.onclick = function(){};
				break;
			case 'select':
				//	選択する
				this.keyElements.controller.innerHTML = '';
				var elmDiv = document.createElement( 'div' );
				elmDiv.style.padding = '10px';
				elmDiv.style.margin = '20px';
				elmDiv.style.backgroundColor = '#000000';
				if( this.strlen( prop.message ) ){
					var elmMessage = document.createElement('div');
					$( elmMessage )
								.text( prop.message )
								.css( 'color' , '#ffffff' )
								.css( 'font-weight' , 'bold' )
								.css( 'margin-bottom' , '5px' );
					elmDiv.appendChild( elmMessage );
				}
				var elmUl = document.createElement( 'ul' );
				elmUl.style.padding = '10px';
				elmUl.style.margin = '0px';
				elmUl.style.backgroundColor = '#666666';
				for( var i = 0; prop.options.length > i; i ++ ){
					var elmLi = document.createElement( 'li' );
					elmLi.style.padding = '0px';
					elmLi.style.marginTop = '5px';
					elmLi.style.marginBottom = '5px';
					elmLi.style.listStyleType = 'none';
					var button = document.createElement( 'button' );
					button.PxEZEL = this;
					button.goto = prop.options[i].goto;
					$( button ).text( prop.options[i].label );
					button.style.width = '100%';
					button.style.backgroundColor = '#cccccc';
					if( this.strlen( button.goto ) ){
						button.onclick = function(){
							this.PxEZEL.gotoAndPlay( this.goto );
						}
					}else{
						button.onclick = function(){
							this.PxEZEL.playNext();
						}
					}
					elmLi.appendChild( button );
					elmUl.appendChild( elmLi );
				}
				elmDiv.appendChild( elmUl );
				this.keyElements.controller.style.top = '0px';
				this.keyElements.controller.style.right = 'auto';
				this.keyElements.controller.style.bottom = 'auto';
				this.keyElements.controller.style.left = '0px';
				this.keyElements.controller.style.visibility = 'visible';
				this.keyElements.controller.style.width = '100%';
				this.keyElements.controller.style.height = '100%';
				this.keyElements.controller.appendChild( elmDiv );
				break;
			case 'next':
			default:
				//	次へ進む(規定値)
				var nextButton = document.createElement( 'button' );
				nextButton.innerHTML = '次へ進む';
				nextButton.style.width = '80px';
				nextButton.style.position = 'absolute';
				nextButton.style.right = '13px';
				nextButton.style.bottom = '13px';
				nextButton.style.textAlign = 'center';
				nextButton.style.fontSize = '11px';
				nextButton.style.padding = '2px';
				nextButton.style.backgroundColor = '#999999';
				nextButton.style.outline = 'none';
				nextButton.onclick = prop.callback;
				nextButton.PxEZEL = this.keyElements.controller.PxEZEL;
				this.keyElements.controller.style.top = 'auto';
				this.keyElements.controller.style.right = '0px';
				this.keyElements.controller.style.bottom = '0px';
				this.keyElements.controller.style.left = 'auto';
				this.keyElements.controller.style.visibility = 'visible';
				this.keyElements.controller.style.width = '0%';
				this.keyElements.controller.style.height = '0%';
				this.keyElements.controller.appendChild( nextButton );
				nextButton.focus();
				break;
		}

		return true;
	}//function setCtrl()
	//	/ コントローラをセットする
	//--------------------------------------


	//--------------------------------------
	//	プレゼンテーションを終了する。
	this.finish = function(){
		if( !confirm( 'お疲れ様でした。'+"\n"+'以上でプレゼンテーションは終了です。'+"\n"+'もう一度、最初から再生しますか？' ) ){
			return true;
		}
		this.init( this.path_lib_dir , this.path_content , this.stageElement );	//初期化する
		return true;
	}


	//--------------------------------------
	//	絶対パスを得る
	this.getRealpath = function( $path ){
		if( $path.match( new RegExp( '^(?:\/|http\:\/\/|https\:\/\/)' , 'i' ) ) ){
			return $path;
		}
		var $currentPath = this.path_content.replace( new RegExp( '^(.*)\/.*?$' , 'i' ) , '$1' );
		return $currentPath + '/' + $path;
	}


	//--------------------------------------
	//	URLへ遷移する
	this.getURL = function( url ){
		if( !confirm( '['+url+'] へ移動しますか？' ) ){
			return false;
		}
		window.open( url );
		return	true;
	}

	//--------------------------------------
	//	null かどうか調べる
	this.isNull = function( value ){
		if( value === null ){
			return true;
		}
		return false;
	}

	//--------------------------------------
	//	文字数を調べる
	this.strlen = function( value ){
		if( value === undefined ){
			return 0;
		}
		if( value === null ){
			return 0;
		}
		value = value + '';
		return	value.length;
	}

	this.init( path_lib_dir , path_content , stageElement );	//初期化する
}