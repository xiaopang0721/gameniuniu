/**
* 牛牛
*/
module gameniuniu.page {
	export class NiuNiuPageOld extends game.gui.base.Page {
		private _viewUI: ui.nqp.game_ui.niuniu.QiangZhuangNN_HUDUI;
		private _difenTmep: any = [1, 10, 50, 100];
		private _leastTmep: any = [20, 200, 500, 1000];
		private _player: any;
		private _playerInfo: any;
		private _niuMgr: NiuMgr;
		private _isRoomcardType: boolean;

		constructor(v: Game, onOpenFunc?: Function, onCloseFunc?: Function) {
			super(v, onOpenFunc, onCloseFunc);
			this._asset = [
				Path_game_niuniu.atlas_game_ui + "niuniu.atlas",
				PathGameTongyong.atlas_game_ui_tongyong + "general.atlas",
				PathGameTongyong.atlas_game_ui_tongyong + "touxiang.atlas",
				PathGameTongyong.atlas_game_ui_tongyong + "hud.atlas",
				PathGameTongyong.atlas_game_ui_tongyong + "dating.atlas",
				PathGameTongyong.atlas_game_ui_tongyong + "logo.atlas",
			];
			this._isNeedDuang = false;
		}

		// 页面初始化函数
		protected init(): void {
			this._viewUI = this.createView('game_ui.niuniu.QiangZhuangNN_HUDUI', ["game_ui.tongyong.HudUI"]);
			this.addChild(this._viewUI);
			this._niuMgr = new NiuMgr(this._game);

			for (let index = 0; index < this._viewUI.box_right.numChildren; index++) {
				this._viewUI.box_right._childs[index].visible = false;
			}
			this._viewUI.box_room.visible = false;
		}

		/**数据*/
		set dataSource(v: any) {
			this._dataSource = v;
			this._isRoomcardType = this._dataSource == PageDef.TYPE_CARD;
		}

		// 页面打开时执行函数
		protected onOpen(): void {
			super.onOpen();
			this.initRoomInfo();
			this.initRoomcardMode();
			this._viewUI.btn_xinshou.on(LEvent.CLICK, this, this.onBtnClickWithTween);
			this._viewUI.btn_chuji.on(LEvent.CLICK, this, this.onBtnClickWithTween);
			this._viewUI.btn_zhongji.on(LEvent.CLICK, this, this.onBtnClickWithTween);
			this._viewUI.btn_gaoji.on(LEvent.CLICK, this, this.onBtnClickWithTween);
			this._viewUI.img_room_create.on(LEvent.CLICK, this, this.onBtnClickWithTween);
			this._viewUI.img_room_join.on(LEvent.CLICK, this, this.onBtnClickWithTween);

			(this._viewUI.view as TongyongHudPage).onOpen(this._game, NiuniuPageDef.GAME_NAME, this._isRoomcardType);
			this._game.playMusic(Path_game_niuniu.music_niuniu + "nn_bgm.mp3");

			for (let index = 0; index < this._viewUI.box_right.numChildren; index++) {
				this._viewUI.box_right._childs[index].visible = true;
				Laya.Tween.from(this._viewUI.box_right._childs[index], {
					right: -300
				}, 200 + index * 100, Laya.Ease.linearNone);
			}
		}

		private initRoomInfo(): void {
			for (let index = 0; index < 4; index++) {
				this._viewUI["txt_least" + index] && (this._viewUI["txt_least" + index].text = "准入: " + this._leastTmep[index]);
				this._viewUI["txt_difen" + index] && (this._viewUI["txt_difen" + index].text = "底分: " + this._difenTmep[index]);
			}
		}

		/** 房卡模式下的布局 */
		private initRoomcardMode() {
			this._viewUI.box_normal.visible = !this._isRoomcardType;
			this._viewUI.box_room.visible = this._isRoomcardType;
			this._viewUI.img_mn.visible = WebConfig.baseplatform == PageDef.BASE_PLATFORM_TYPE_DZQP && !this._isRoomcardType ? false : true;
			this._viewUI.img_mn.visible = !this._isRoomcardType ? false : true;
		}

		protected onBtnTweenEnd(e: any, target: any): void {
			this._player = this._game.sceneObjectMgr.mainPlayer;
			if (!this._player) return;
			if (this.chkPlayerIsGuest()) return;
			switch (target) {
				case this._viewUI.btn_xinshou:
					if (this._player.playerInfo.money < this._leastTmep[0]) {
						this.showTipsBox(this._leastTmep[0]);
						return;
					}
					this._game.sceneObjectMgr.intoStory(NiuniuPageDef.GAME_NAME, Web_operation_fields.GAME_ROOM_CONFIG_QIANGZHUANG_NIUNIU_1.toString());

					break;
				case this._viewUI.btn_chuji:
					if (this._player.playerInfo.money < this._leastTmep[1]) {
						this.showTipsBox(this._leastTmep[1]);
						return;
					}
					this._game.sceneObjectMgr.intoStory(NiuniuPageDef.GAME_NAME, Web_operation_fields.GAME_ROOM_CONFIG_QIANGZHUANG_NIUNIU_2.toString());//Web_operation_fields.game_room_config_table[7]
					break;
				case this._viewUI.btn_zhongji:
					if (this._player.playerInfo.money < this._leastTmep[2]) {
						this.showTipsBox(this._leastTmep[2]);
						return;
					}
					this._game.sceneObjectMgr.intoStory(NiuniuPageDef.GAME_NAME, Web_operation_fields.GAME_ROOM_CONFIG_QIANGZHUANG_NIUNIU_3.toString());
					break;
				case this._viewUI.btn_gaoji:
					if (this._player.playerInfo.money < this._leastTmep[3]) {
						this.showTipsBox(this._leastTmep[3]);
						return;
					}
					this._game.sceneObjectMgr.intoStory(NiuniuPageDef.GAME_NAME, Web_operation_fields.GAME_ROOM_CONFIG_QIANGZHUANG_NIUNIU_4.toString());
					break;
				case this._viewUI.img_room_create:
					this._game.uiRoot.general.open(NiuniuPageDef.PAGE_NIUNIU_CREATE_CARDROOM);
					break;
				case this._viewUI.img_room_join:
					this._game.uiRoot.general.open(NiuniuPageDef.PAGE_NIUNIU_JOIN_CARDROOM);
					break;
				default:
					break;
			}
		}

		private chkPlayerIsGuest(): boolean {
			let result: boolean = false;
			if (this._player.playerInfo.isguest) {
				TongyongPageDef.ins.alertRecharge("亲爱的玩家，您正使用游客模式进行游戏，该模式下的游戏数据（包括付费数据）在删除游戏、更换设备后清空！对此造成的损失，本平台将不承担任何责任。为保障您的虚拟财产安全，我们强力建议您绑定手机号升级为正式账号。", () => {
					this._game.uiRoot.general.open(DatingPageDef.PAGE_BINDPHONE);
				}, () => {
				}, false, PathGameTongyong.ui_tongyong_general + "btn_qw.png");
				result = true;
			}
			return result;
		}

		private showTipsBox(limit: number) {
			TongyongPageDef.ins.alertRecharge(StringU.substitute("老板，您的金币少于{0}哦~\n补充点金币去大杀四方吧~", limit), () => {
				this._game.uiRoot.general.open(DatingPageDef.PAGE_CHONGZHI);
			}, () => {
			}, false, PathGameTongyong.ui_tongyong_general + "btn_cz.png");
		}

		public close(): void {
			this._player = null;
			if (this._viewUI) {
				this._viewUI.btn_xinshou.off(LEvent.CLICK, this, this.onBtnClickWithTween);
				this._viewUI.btn_chuji.off(LEvent.CLICK, this, this.onBtnClickWithTween);
				this._viewUI.btn_zhongji.off(LEvent.CLICK, this, this.onBtnClickWithTween);
				this._viewUI.btn_gaoji.off(LEvent.CLICK, this, this.onBtnClickWithTween);
				this._viewUI.img_room_create.off(LEvent.CLICK, this, this.onBtnClickWithTween);
				this._viewUI.img_room_join.off(LEvent.CLICK, this, this.onBtnClickWithTween);
				this._game.stopMusic();
			}
			super.close();
		}
	}
}