/**
* name 
*/
module gameniuniu.page {
	export class NiuniuPageDef extends game.gui.page.PageDef {
		static GAME_NAME: string;
		//牛牛界面
		static PAGE_NIUNIU: string = "1";
		//牛牛地图UI
		static PAGE_NIUNIU_MAP: string = "2";
		//牛牛开始游戏动画界面
		static PAGE_NIUNIU_BEGIN: string = "3";

		//牛牛游戏规则界面
		static PAGE_NIUNIU_RULE: string = "101";

		static myinit(str: string) {
			super.myinit(str);
			NiuniuClip.init();
			PageDef._pageClassMap[NiuniuPageDef.PAGE_NIUNIU] = NiuNiuPage;
			PageDef._pageClassMap[NiuniuPageDef.PAGE_NIUNIU_MAP] = NiuNiuMapPage;
			PageDef._pageClassMap[NiuniuPageDef.PAGE_NIUNIU_BEGIN] = NiuNiuBeginPage;
			PageDef._pageClassMap[NiuniuPageDef.PAGE_NIUNIU_RULE] = NiuNiuRulePage;


			this["__needLoadAsset"] = [
				DatingPath.atlas_dating_ui + "qifu.atlas",
				Path_game_niuniu.atlas_game_ui + "niuniu.atlas",
				Path_game_niuniu.atlas_game_ui_niuniu + "qp.atlas",
                Path_game_niuniu.atlas_game_ui_niuniu + "niupai.atlas",
				PathGameTongyong.atlas_game_ui_tongyong + "hud.atlas",
				PathGameTongyong.atlas_game_ui_tongyong + "pai.atlas",
				PathGameTongyong.atlas_game_ui_tongyong + "general.atlas",
				PathGameTongyong.atlas_game_ui_tongyong + "touxiang.atlas",
				PathGameTongyong.atlas_game_ui_tongyong + "dating.atlas",
				PathGameTongyong.atlas_game_ui_tongyong + "logo.atlas",
				PathGameTongyong.atlas_game_ui_tongyong + "qz.atlas",
				PathGameTongyong.atlas_game_ui_tongyong + "qifu.atlas",
				PathGameTongyong.atlas_game_ui_tongyong + "zjts.atlas",
				PathGameTongyong.atlas_game_ui_tongyong + "zjtp.atlas",
				PathGameTongyong.atlas_game_ui_tongyong + "nyl.atlas",
				PathGameTongyong.atlas_game_ui_tongyong + "yq.atlas",
				PathGameTongyong.atlas_game_ui_tongyong + "chongzhi.atlas",
				PathGameTongyong.atlas_game_ui_tongyong + "general/effect/suiji.atlas",
				PathGameTongyong.atlas_game_ui_tongyong + "general/effect/fapai_1.atlas",
				PathGameTongyong.atlas_game_ui_tongyong + "general/effect/xipai.atlas",
				PathGameTongyong.atlas_game_ui_tongyong_general + "anniu.atlas",
				PathGameTongyong.atlas_game_ui_tongyong_general_effect + "anniug.atlas",

				Path.custom_atlas_scene + 'card.atlas',
				Path.map + 'pz_niuniu.png',
				Path.map_far + 'bg_niuniu.jpg',
			]

			if (WebConfig.needMusicPreload) {
				this["__needLoadAsset"] = this["__needLoadAsset"].concat([
					Path_game_niuniu.music_niuniu + "nn_bgm.mp3",
					Path_game_niuniu.music_niuniu + "dianjipai.mp3",
					Path_game_niuniu.music_niuniu + "gaipai.mp3",
					Path_game_niuniu.music_niuniu + "kaishi.mp3",
					Path_game_niuniu.music_niuniu + "niu0_1.mp3",
					Path_game_niuniu.music_niuniu + "niu0_2.mp3",
					Path_game_niuniu.music_niuniu + "niu1_1.mp3",
					Path_game_niuniu.music_niuniu + "niu1_2.mp3",
					Path_game_niuniu.music_niuniu + "niu2_1.mp3",
					Path_game_niuniu.music_niuniu + "niu2_2.mp3",
					Path_game_niuniu.music_niuniu + "niu3_1.mp3",
					Path_game_niuniu.music_niuniu + "niu3_2.mp3",
					Path_game_niuniu.music_niuniu + "niu4_1.mp3",
					Path_game_niuniu.music_niuniu + "niu4_2.mp3",
					Path_game_niuniu.music_niuniu + "niu5_1.mp3",
					Path_game_niuniu.music_niuniu + "niu5_2.mp3",
					Path_game_niuniu.music_niuniu + "niu6_1.mp3",
					Path_game_niuniu.music_niuniu + "niu6_2.mp3",
					Path_game_niuniu.music_niuniu + "niu7_1.mp3",
					Path_game_niuniu.music_niuniu + "niu7_2.mp3",
					Path_game_niuniu.music_niuniu + "niu8_1.mp3",
					Path_game_niuniu.music_niuniu + "niu8_2.mp3",
					Path_game_niuniu.music_niuniu + "niu9_1.mp3",
					Path_game_niuniu.music_niuniu + "niu9_2.mp3",
					Path_game_niuniu.music_niuniu + "niu10_1.mp3",
					Path_game_niuniu.music_niuniu + "niu10_2.mp3",
					Path_game_niuniu.music_niuniu + "niu11_1.mp3",
					Path_game_niuniu.music_niuniu + "niu11_2.mp3",
					Path_game_niuniu.music_niuniu + "niu12_1.mp3",
					Path_game_niuniu.music_niuniu + "niu12_2.mp3",
					Path_game_niuniu.music_niuniu + "niu13_1.mp3",
					Path_game_niuniu.music_niuniu + "niu13_2.mp3",
					Path_game_niuniu.music_niuniu + "niu14_1.mp3",
					Path_game_niuniu.music_niuniu + "niu14_2.mp3",
					Path_game_niuniu.music_niuniu + "piaoqian.mp3",
					Path_game_niuniu.music_niuniu + "pingpaiwancheng.mp3",
					Path_game_niuniu.music_niuniu + "shengli.mp3",
					Path_game_niuniu.music_niuniu + "shibai.mp3",
					Path_game_niuniu.music_niuniu + "suidao.mp3",
					Path_game_niuniu.music_niuniu + "suiji.mp3",
					Path_game_niuniu.music_niuniu + "zjtongchi.mp3",
				])
			}
		}
	}
}