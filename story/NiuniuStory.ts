/**
* name 牛牛剧情
*/
module gameniuniu.story {
	const enum MAP_STATUS {
		PLAY_STATUS_GAME_NONE = 0, // 初始化
		PLAY_STATUS_CARDROOM_CREATED = 1, //房间创建后
		PLAY_STATUS_CARDROOM_WAIT = 2, //房卡等人中
		PLAY_STATUS_GAME_SHUFFLE = 3, // 洗牌阶段
		PLAY_STATUS_GAME_START = 4, // 游戏开始
		PLAY_STATUS_GET_BANKER = 5, // 开始抢庄
		PLAY_STATUS_SET_BANKER = 6, // 定庄阶段
		PLAY_STATUS_BET = 7, // 下注阶段
		PLAY_STATUS_PUSH_CARD = 8, // 发牌阶段
		PLAY_STATUS_MATCH_POINT = 9, // 配牛阶段
		PLAY_STATUS_COMPARE = 10, // 比牌阶段
		PLAY_STATUS_SETTLE = 11, // 结算阶段
		PLAY_STATUS_SHOW_GAME = 12, // 本局展示阶段
	}
	export class NiuniuStory extends gamecomponent.story.StoryNormalBase {
		private _niuMgr: NiuMgr;
		private _isFaPai: number;
		private _bankerIndex: number;
		private _niuMapInfo: NiuniuMapInfo;
		private _curStatus: number;
		private _isGaiPai: boolean = false;

		constructor(v: Game, mapid: string, maplv: number) {
			super(v, mapid, maplv);
			this._last_maplv = maplv;
			this.init();
		}

		set mapLv(lv: number) {
			this.maplv = lv;
		}

		get mapLv() {
			return this.maplv;
		}

		get niuMgr() {
			return this._niuMgr;
		}

		get isFaPai() {
			return this._isFaPai;
		}

		get isGaiPai() {
			return this._isGaiPai;
		}

		set isGaiPai(v) {
			this._isGaiPai = v;
		}

		init() {
			super.init();
			if (!this._niuMgr) {
				this._niuMgr = new NiuMgr(this._game);
			}
			this._game.sceneObjectMgr.on(SceneObjectMgr.EVENT_LOAD_MAP, this, this.onIntoNewMap);
			this._game.sceneObjectMgr.on(SceneObjectMgr.EVENT_MAPINFO_CHANGE, this, this.onMapInfoChange);
			this._game.sceneObjectMgr.on(SceneObjectMgr.EVENT_MAIN_UNIT_CHANGE, this, this.onUpdateCardInfo);
			this._game.sceneObjectMgr.on(NiuniuMapInfo.EVENT_BATTLE_CHECK, this, this.onUpdateBattle);
			this._game.sceneObjectMgr.on(NiuniuMapInfo.EVENT_STATUS_CHECK, this, this.onUpdateState);

			this.onIntoNewMap();
		}

		private createObj() {
			let card = this._game.sceneObjectMgr.createOfflineObject(SceneRoot.CARD_MARK, NiuData) as NiuData;
			card.pos = new Vector2(980, 190);
			return card;
		}

		private onIntoNewMap(info?: MapAssetInfo): void {
			if (!info) return;
			this.onMapInfoChange();
			this._game.uiRoot.closeAll();
			this._game.uiRoot.HUD.open(NiuniuPageDef.PAGE_NIUNIU_MAP);
		}

		private onMapInfoChange(): void {
			let mapinfo = this._game.sceneObjectMgr.mapInfo;
			this._niuMapInfo = mapinfo as NiuniuMapInfo;
			if (mapinfo) {
				this.onUpdateState();
				this.onUpdateCardInfo();
				this.onUpdateBattle();
			} else {
				this._niuMgr.offlineUnit = this._offlineUnit;
			}
		}

		private onUpdateState(): void {
			// let mapinfo: niuniu.data.NiuniuMapInfo = this._game.sceneObjectMgr.mapInfo as niuniu.data.NiuniuMapInfo;
			if (!this._niuMapInfo) return;
			let mapStatus = this._niuMapInfo.GetMapState();
			if (this._curStatus == mapStatus) return;
			this._curStatus = mapStatus;
			let mainUnit: Unit = this._game.sceneObjectMgr.mainUnit;
			if (!mainUnit || !mainUnit.GetIndex()) return;
			switch (this._curStatus) {
				case MAP_STATUS.PLAY_STATUS_GAME_NONE:// 准备阶段

					break;
				case MAP_STATUS.PLAY_STATUS_GAME_SHUFFLE:// 洗牌阶段

					break;
				case MAP_STATUS.PLAY_STATUS_GAME_START:// 游戏开始

					break;
				case MAP_STATUS.PLAY_STATUS_GET_BANKER:// 开始抢庄

					break;
				case MAP_STATUS.PLAY_STATUS_SET_BANKER:// 定庄阶段

					break;
				case MAP_STATUS.PLAY_STATUS_BET:// 下注阶段
					this._isFaPai = 0;
					break;
				case MAP_STATUS.PLAY_STATUS_PUSH_CARD:// 发牌阶段
					this.onDealCards();
					break;
				case MAP_STATUS.PLAY_STATUS_MATCH_POINT:// 配牛阶段
					this._niuMgr.isReKaiPai = false;
					break;
				case MAP_STATUS.PLAY_STATUS_COMPARE:// 比牌阶段
					if (!this.isGaiPai) {
						this._niuMgr.gaipai();
						this.isGaiPai = true;
					}
					this._niuMgr.isShowOver = false;
					break;
				case MAP_STATUS.PLAY_STATUS_SETTLE:// 结算阶段

					break;
				case MAP_STATUS.PLAY_STATUS_SHOW_GAME:// 本局展示阶段
					this.isGaiPai = false;
					break;
			}
		}


		//正常发牌
		private onDealCards(): void {
			if (!this._niuMapInfo) return;
			let mainUnit = this._game.sceneObjectMgr.mainUnit;
			if (!mainUnit || !mainUnit.GetIndex()) return;
			if (this._isFaPai > 0) return;
			let idx = mainUnit.GetIndex();
			let max = 5;
			let cards = [];
			for (let index = 0; index < max; index++) {
				let posIdx = (idx + index) % max == 0 ? max : (idx + index) % max;
				let unit = this._game.sceneObjectMgr.getUnitByIdx(posIdx);
				let mainCards = this._game.sceneObjectMgr.mainPlayer.playerInfo.cards;
				if (unit) {
					if (unit.GetIdentity() == 1) {
						this._bankerIndex = index;
					}
					if (unit.GetIndex() == idx) {
						cards = cards.concat(mainCards);
					} else {
						cards = cards.concat([0, 0, 0, 0, 0]);
					}
				}
			}
			let handle = new Handler(this, this.createObj);
			this._niuMgr.Init(cards, handle);
			this._niuMgr.sort();
			this._niuMgr.fapai();
			this._niuMgr.fanpai();
			this._isFaPai = 1;
		}

		//断线重连,重发下牌
		private onUpdateCardInfo(): void {
			if (!this._niuMapInfo) return;
			let mainUnit: Unit = this._game.sceneObjectMgr.mainUnit;
			if (!mainUnit || !mainUnit.GetIndex()) return;
			if (this._isFaPai > 0) return;
			let status = this._niuMapInfo.GetMapState();
			if (status >= MAP_STATUS.PLAY_STATUS_PUSH_CARD && status < MAP_STATUS.PLAY_STATUS_SHOW_GAME) {
				let idx = this._game.sceneObjectMgr.mainUnit.GetIndex();
				let max = 5;
				let cards = [];
				for (let index = 0; index < max; index++) {
					let posIdx = (idx + index) % max == 0 ? max : (idx + index) % max;
					let unit = this._game.sceneObjectMgr.getUnitByIdx(posIdx);
					let mainCards = this._game.sceneObjectMgr.mainPlayer.playerInfo.cards;
					if (unit) {
						if (unit.GetIdentity() == 1) {
							this._bankerIndex = index;
						}
						if (unit.GetIndex() == idx) {
							cards = cards.concat(mainCards);
						} else {
							cards = cards.concat([0, 0, 0, 0, 0]);
						}
					}
				}
				let handle = new Handler(this, this.createObj);
				this._niuMgr.Init(cards, handle);
				this._niuMgr.sort();
				if (status > MAP_STATUS.PLAY_STATUS_MATCH_POINT) {
					this._niuMgr.regaipai();
				} else {
					this._niuMgr.refapai();
				}
				this._niuMgr.reloadFanpai();
				this._isFaPai = 2;
			}
		}

		//战斗结构体 出牌
		private onUpdateBattle(): void {
			if (!this._niuMapInfo) return;
			let mainUnit: Unit = this._game.sceneObjectMgr.mainUnit;
			if (!mainUnit || !mainUnit.GetIndex()) return;
			let battleInfoMgr = this._niuMapInfo.battleInfoMgr;
			let unitNum = this.getPlayerOnSeat();
			let infos = [];
			for (let i: number = 0; i < battleInfoMgr.info.length; i++) {
				let info = battleInfoMgr.info[i] as gamecomponent.object.BattleInfoBase;
				if (info.Type == 3) {//最后出牌动作
					let info = battleInfoMgr.info[i] as gamecomponent.object.BattleInfoPlayCard<gamecomponent.object.PlayingPuKeCard>;
					infos.push(info);
				}
			}
			if (infos.length < unitNum) return;
			if (this._niuMgr.isReKaiPai && this._curStatus > MAP_STATUS.PLAY_STATUS_MATCH_POINT) {
				this._niuMgr.resetValue(infos, this._bankerIndex);
			} else {
				this._niuMgr.setValue(infos, this._bankerIndex);
			}
		}

		private getPlayerOnSeat(): number {
			let unitNum = 0
			for (let index = 0; index < 5; index++) {
				let unit = this._game.sceneObjectMgr.getUnitByIdx(index + 1)
				if (unit) {
					unitNum++;
				}
			}
			return unitNum;
		}

		createofflineUnit() {
			//创建假的地图和精灵
			let unitOffline = new UnitOffline(this._game.sceneObjectMgr);
			if (this._game.sceneObjectMgr.mainPlayer) {
				unitOffline.SetStr(UnitField.UNIT_STR_NAME, this._game.sceneObjectMgr.mainPlayer.playerInfo.nickname);
				unitOffline.SetStr(UnitField.UNIT_STR_HEAD_IMG, this._game.sceneObjectMgr.mainPlayer.playerInfo.headimg);
				unitOffline.SetDouble(UnitField.UNIT_INT_MONEY, this._game.sceneObjectMgr.mainPlayer.playerInfo.money);
				unitOffline.SetUInt32(UnitField.UNIT_INT_QI_FU_END_TIME, this._game.sceneObjectMgr.mainPlayer.playerInfo.qifu_endtime);
				unitOffline.SetUInt32(UnitField.UNIT_INT_QI_FU_TYPE, this._game.sceneObjectMgr.mainPlayer.playerInfo.qifu_type);
				unitOffline.SetUInt32(UnitField.UNIT_INT_VIP_LEVEL, this._game.sceneObjectMgr.mainPlayer.playerInfo.vip_level);
			}
			unitOffline.SetUInt16(UnitField.UNIT_INT_UINT16, 0, 1);

			this._offlineUnit = unitOffline;
		}

		enterMap() {
			//各种判断
			if (this.mapinfo) return false;
			if (!this.maplv) {
				this.maplv = this._last_maplv;
			}
			this._game.network.call_match_game(this._mapid, this.maplv);
			return true;
		}

		leavelMap() {
			//各种判断
			this._game.network.call_leave_game();
			return true;
		}

		clear() {
			this._game.sceneObjectMgr.off(NiuniuMapInfo.EVENT_BATTLE_CHECK, this, this.onUpdateBattle);
			this._game.sceneObjectMgr.off(NiuniuMapInfo.EVENT_STATUS_CHECK, this, this.onUpdateState);
			this._game.sceneObjectMgr.off(SceneObjectMgr.EVENT_LOAD_MAP, this, this.onIntoNewMap);
			this._game.sceneObjectMgr.off(SceneObjectMgr.EVENT_MAIN_UNIT_CHANGE, this, this.onUpdateCardInfo);
			this._game.sceneObjectMgr.off(SceneObjectMgr.EVENT_MAPINFO_CHANGE, this, this.onMapInfoChange);
			this._niuMapInfo = null;
			if (this._niuMgr) {
				this._niuMgr.clear();
				this._niuMgr = null;
			}
		}
	}
}