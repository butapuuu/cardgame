const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// ★アクセスログ
const fs_node=require("fs");
const ACCESS_LOG="access_log.json";

function loadAccessLog(){
  try{ return JSON.parse(fs_node.readFileSync(ACCESS_LOG,"utf8")); }
  catch(e){ return {}; }
}
function saveAccessLog(log){
  fs_node.writeFileSync(ACCESS_LOG,JSON.stringify(log,null,2));
}
function recordAccess(page, req){
  const log=loadAccessLog();
  const now=new Date();
  const day=now.toISOString().slice(0,10);
  const hour=now.getHours();
  const ua=req.headers["user-agent"]||"不明";
  const ip=req.headers["x-forwarded-for"]||req.socket.remoteAddress||"不明";
  // デバイス判定
  let device="PC";
  if(/Mobile|Android|iPhone|iPad|iPod/i.test(ua)) device="スマホ/タブレット";
  // ブラウザ判定
  let browser="不明";
  if(/Chrome/i.test(ua)&&!/Edge|OPR/i.test(ua)) browser="Chrome";
  else if(/Firefox/i.test(ua)) browser="Firefox";
  else if(/Safari/i.test(ua)&&!/Chrome/i.test(ua)) browser="Safari";
  else if(/Edge/i.test(ua)) browser="Edge";
  else if(/OPR|Opera/i.test(ua)) browser="Opera";

  if(!log[day]) log[day]={total:0,hours:{},pages:{},visitors:[]};
  if(!log[day].hours) log[day].hours={};
  if(!log[day].pages) log[day].pages={};
  if(!log[day].visitors) log[day].visitors=[];
  log[day].total++;
  log[day].hours[hour]=(log[day].hours[hour]||0)+1;
  log[day].pages[page]=(log[day].pages[page]||0)+1;
  // アクセス詳細を記録
  const timeStr=now.toISOString().replace("T"," ").slice(0,19);
  log[day].visitors.push({time:timeStr, page, device, browser, ip});
  // 直近500件のみ保持
  if(log[day].visitors.length>500) log[day].visitors=log[day].visitors.slice(-500);
  saveAccessLog(log);
}

// ★アクセスログ確認ページ（staticより前に定義）
app.get("/admin/access",(req,res)=>{
  const log=loadAccessLog();
  let html="<html><head><meta charset='utf-8'><title>アクセス統計</title>";
  html+="<style>";
  html+="body{font-family:sans-serif;background:#1a2a1a;color:#eee;padding:20px;}";
  html+="table{border-collapse:collapse;margin-bottom:20px;width:100%;}";
  html+="td,th{border:1px solid #555;padding:6px 12px;text-align:left;}";
  html+="th{background:#333;}";
  html+="h2{color:#ffe066;}h3{color:#aaffaa;margin-top:24px;}";
  html+=".device-pc{color:#88ccff;} .device-sp{color:#ffaa88;}";
  html+=".section{background:rgba(0,0,0,0.3);border:1px solid #333;border-radius:8px;padding:12px;margin-bottom:16px;}";
  html+="</style></head><body>";
  html+="<h2>📊 アクセス統計</h2>";
  const days=Object.keys(log).sort().reverse();
  if(days.length===0){
    html+="<p style='color:#888'>まだアクセスデータがありません</p>";
  }
  days.forEach(day=>{
    html+=`<h3>📅 ${day}（合計: ${log[day].total}回）</h3>`;
    html+="<div class='section'>";
    // ページ別
    if(log[day].pages&&Object.keys(log[day].pages).length>0){
      html+="<b>ページ別</b><table><tr><th>ページ</th><th>回数</th></tr>";
      Object.entries(log[day].pages).forEach(([page,count])=>{
        html+=`<tr><td>${page}</td><td>${count}</td></tr>`;
      });
      html+="</table>";
    }
    // 時間帯別
    html+="<b>時間帯別</b><table><tr><th>時間帯</th><th>回数</th></tr>";
    for(let h=0;h<24;h++){
      const count=(log[day].hours&&log[day].hours[h])||0;
      if(count>0) html+=`<tr><td>${h}時台</td><td>${count}</td></tr>`;
    }
    html+="</table>";
    html+="</div>";
    // アクセス詳細（訪問者ログ）
    if(log[day].visitors&&log[day].visitors.length>0){
      html+="<div class='section'>";
      html+="<b>アクセス詳細ログ</b>";
      html+="<table><tr><th>時刻</th><th>ページ</th><th>デバイス</th><th>ブラウザ</th><th>IPアドレス</th></tr>";
      // 新しい順に表示
      [...log[day].visitors].reverse().forEach(v=>{
        const deviceClass=v.device.includes("スマホ")?"device-sp":"device-pc";
        const deviceIcon=v.device.includes("スマホ")?"📱":"🖥";
        html+=`<tr>
          <td>${v.time}</td>
          <td>${v.page}</td>
          <td class="${deviceClass}">${deviceIcon} ${v.device}</td>
          <td>${v.browser}</td>
          <td>${v.ip}</td>
        </tr>`;
      });
      html+="</table></div>";
    }
  });
  html+="</body></html>";
  res.send(html);
});

// ★staticより前にカウント用ミドルウェアを設置
app.use((req,res,next)=>{
  const path=req.path;
  if(path==="/"||path==="/index.html") recordAccess("index.html",req);
  else if(path==="/room.html") recordAccess("room.html",req);
  else if(path==="/deck1.html") recordAccess("deck1.html",req);
  else if(path==="/deck2.html") recordAccess("deck2.html",req);
  next();
});

app.use(express.static(__dirname));



// ★全カード（完全版）

const cards = {



//🔥火
"フレイムスパーク":{cost:1,atk:2,hp:1,type:"unit",attr:"fire",effect:"SUM_L_DMG1"},
"ファイアウルフ":{cost:1,atk:3,hp:1,type:"unit",attr:"fire"},
"ブレイズリザード":{cost:1,atk:2,hp:2,type:"unit",attr:"fire"},
"マグマウルフ":{cost:2,atk:3,hp:2,type:"unit",attr:"fire",destroyEffect:"L_DMG1"},
"フレイムナイト":{cost:2,atk:3,hp:2,type:"unit",attr:"fire",attackEffect:"L_DMG1"},
"アッシュソルジャー":{cost:2,atk:3,hp:3,type:"unit",attr:"fire"},
"フレイムレオン":{cost:2,atk:4,hp:2,type:"unit",attr:"fire"},
"ボルケーノタートル":{cost:3,atk:3,hp:5,type:"unit",attr:"fire"},
"インフェルノドラゴン":{cost:3,atk:5,hp:3,type:"unit",attr:"fire"},
"バーンアウト":{cost:3,atk:5,hp:4,type:"unit",attr:"fire",effect:"SUM_BURNOUT"},
"フレイムパージャー":{cost:3,atk:4,hp:3,type:"unit",attr:"fire",effect:"SUM_DES_COST1_ALL"},
"ブレイズフェニックス":{cost:4,atk:4,hp:4,type:"unit",attr:"fire",destroyEffect:"L_DMG3"},
"フレイムエンペラー":{cost:4,atk:5,hp:4,type:"unit",attr:"fire",effect:"FIELD_A+1_F"},
"メガフレアドラゴン":{cost:5,atk:8,hp:5,type:"unit",attr:"fire"},

"フレイムバーン":{cost:1,type:"spell",attr:"fire",effect:"FLAME_BURN"},
"ファイアボール":{cost:2,type:"spell",attr:"fire",effect:"UNIT_DMG3"},
"フレイムストーム":{cost:2,type:"spell",attr:"fire",effect:"ALL_UNIT_DMG2"},
"業火の裁き":{cost:4,type:"spell",attr:"fire",effect:"UNIT_DES_COST_L_DMG"},
"バーニングソウル":{cost:2,type:"spell",attr:"fire",effect:"A_PERM+3"},
"スカーチングレイン":{cost:2,type:"spell",attr:"fire",effect:"ALL_UNIT_DMG1_L2"},
"エンラージ":{cost:1,type:"spell",attr:"fire",effect:"A+2_H+1"},
"炎の加護":{cost:1,type:"spell",attr:"fire",effect:"TURN_ALL_A+1_L_DMGX"},
"フェニックスリバース":{cost:3,type:"spell",attr:"fire",effect:"REVIVE_TOP"},
"灼熱地獄":{cost:1,type:"spell",attr:"fire",effect:"PERM_SPELL_FIRE_OVERFLOW",durability:3
},

//💧水
"ウォータードロップ":{cost:1,atk:1,hp:3,type:"unit",attr:"water"},
"アクアフィッシュ":{cost:1,atk:2,hp:2,type:"unit",attr:"water",effect:"SUM_L+1"},
"アイスウォリアー":{cost:2,atk:3,hp:3,type:"unit",attr:"water"},
"エナジーカラパス":{cost:2,atk:2,hp:2,type:"unit",attr:"water",effect:"SUM_E+1"},
"クリスタルシェル":{cost:2,atk:1,hp:6,type:"unit",attr:"water"},
"フロストビースト":{cost:3,atk:4,hp:4,type:"unit",attr:"water"},
"アイスガーディアン":{cost:3,atk:3,hp:5,type:"unit",attr:"water"},
"バーストパファー":{cost:3,atk:2,hp:5,type:"unit",attr:"water",destroyEffect:"DES_ALL_UNIT_DMG1"},
"トレントサーペント":{cost:3,atk:2,hp:4,type:"unit",attr:"water",effect:"ALL_ATTACK"},
"アクアドラゴン":{cost:4,atk:4,hp:4,type:"unit",attr:"water",effect:"SUM_E+1"},
"オーシャンナイト":{cost:4,atk:5,hp:5,type:"unit",attr:"water"},
"テンペストシャーク":{cost:4,atk:6,hp:4,type:"unit",attr:"water"},
"タイダルリヴァイアサン":{cost:5,atk:5,hp:9,type:"unit",attr:"water"},
"フローズンキング":{cost:4,atk:3,hp:5,type:"unit",attr:"water",effect:"FIELD_H+2_W"},

"フリーズショット":{cost:1,type:"spell",attr:"water",effect:"UNIT_DMG2"},
"海の恵み":{cost:1,type:"spell",attr:"water",effect:"L+3_DRAW1"},
"アクアリターン":{cost:1,type:"spell",attr:"water",effect:"AQUA_RETURN"},
"激流":{cost:2,type:"spell",attr:"water",effect:"ALL_UNIT_DMG2"},
"アイシクルドレイン":{cost:3,type:"spell",attr:"water",effect:"UNIT_DES_COST_LHEAL"},
"大津波":{cost:4,type:"spell",attr:"water",effect:"ALL_UNIT_DMG4"},
"ウォーターカーテン":{cost:2,type:"spell",attr:"water",effect:"ALL_H_PERM+2"},
"クリスタルバリア":{cost:2,type:"spell",attr:"water",effect:"CRYSTAL_BARRIER"},
"エナジーブースト":{cost:3,type:"spell",attr:"water",effect:"E+2"},
"深海の神殿":{cost:2,type:"spell",attr:"water",effect:"PERM_SPELL_WATER_ENERGY",durability:5},

//⚡雷
"サンダービート":{cost:1,atk:2,hp:1,type:"unit",attr:"thunder",effect:"DENKOUSEKKA"},
"スパークマウス":{cost:1,atk:1,hp:1,type:"unit",attr:"thunder",destroyEffect:"DRAW1"},
"ライトニングラプター":{cost:2,atk:3,hp:3,type:"unit",attr:"thunder"},
"ボルトウォリアー":{cost:4,atk:6,hp:4,type:"unit",attr:"thunder"},
"ボルトホーク":{cost:2,atk:3,hp:2,type:"unit",attr:"thunder",effect:"DENKOUSEKKA"},
"ライトニングウルフ":{cost:2,atk:3,hp:3,type:"unit",attr:"thunder"},
"スパークレパード":{cost:2,atk:4,hp:2,type:"unit",attr:"thunder"},
"エレキドラゴン":{cost:3,atk:5,hp:3,type:"unit",attr:"thunder"},
"プラズマメイジ":{cost:3,atk:4,hp:2,type:"unit",attr:"thunder",effect:"SUM_DRAW1"},
"ボルトチェンジャー":{cost:3,atk:3,hp:3,type:"unit",attr:"thunder",effect:"SUM_DES_SUM_C2"},
"サンダーランページ":{cost:3,atk:3,hp:3,type:"unit",attr:"thunder",effect:"ALL_ATTACK"},
"サンダーロード":{cost:4,atk:6,hp:3,type:"unit",attr:"thunder",effect:"SUM_ALL_UNIT_DMG1"},
"ストームタイタン":{cost:5,atk:7,hp:5,type:"unit",attr:"thunder",attackEffect:"ALL_UNIT_DMG1"},
"ボルトエンペラー":{cost:4,atk:5,hp:4,type:"unit",attr:"thunder",effect:"FIELD_A+1_L"},

"スピードドロー":{cost:1,type:"spell",attr:"thunder",effect:"DRAW2_DISC1"},
"エレキサーキット":{cost:1,type:"spell",attr:"thunder",effect:"UNIT_DES_SUM_C2"},
"チェインライトニング":{cost:2,type:"spell",attr:"thunder",effect:"ALL_UNIT_DMG2"},
"サンダーストライク":{cost:3,type:"spell",attr:"thunder",effect:"UNIT_DES_DRAW1"},
"稲妻の速攻":{cost:1,type:"spell",attr:"thunder",effect:"UNIT_DENKOUSEKKA"},
"エナジーチャージ":{cost:2,type:"spell",attr:"thunder",effect:"DRAW3_DISC2"},
"ボルトレイジ":{cost:2,type:"spell",attr:"thunder",effect:"TURN_ALL_A+2"},
"プラズマバースト":{cost:2,type:"spell",attr:"thunder",effect:"DES_COST2_DRAW"},
"サンダーボム":{cost:4,type:"spell",attr:"thunder",effect:"ALL_UNIT_DMG4"},
"ハイボルテージゾーン":{cost:1,type:"spell",attr:"thunder",effect:"PERM_SPELL_THUNDER_NOREFLECT",durability:3},

//🌿森
"フォレストラビット":{cost:1,atk:1,hp:2,type:"unit",attr:"forest",effect:"SUM_UNIT_A_PERM+1"},
"グリーンナイト":{cost:2,atk:3,hp:3,type:"unit",attr:"forest"},
"ウッドゴーレム":{cost:2,atk:1,hp:4,type:"unit",attr:"forest",effect:"SUM_A_PERM-2"},
"グロウコア":{cost:2,atk:2,hp:2,type:"unit",attr:"forest",destroyEffect:"DES_SUMMON_C3"},
"アーマードライノス":{cost:3,atk:2,hp:4,type:"unit",attr:"forest",effect:"DAMAGE_REDUCE_1"},
"フォレストビースト":{cost:3,atk:3,hp:4,type:"unit",attr:"forest",effect:"END_A+1"},
"モスストーン":{cost:3,atk:4,hp:4,type:"unit",attr:"forest"},
"フォレストエルフ":{cost:3,atk:4,hp:4,type:"unit",attr:"forest"},
"フォレストスイーパー":{cost:3,atk:3,hp:4,type:"unit",attr:"forest",effect:"SUM_ALL_UNIT_DMG1"},
"エンシェントツリー":{cost:4,atk:3,hp:7,type:"unit",attr:"forest",effect:"FIELD_H+1_M"},
"ジャングルタイラント":{cost:4,atk:5,hp:5,type:"unit",attr:"forest"},
"ワイルドベア":{cost:4,atk:4,hp:6,type:"unit",attr:"forest"},
"グリーンドラゴン":{cost:5,atk:6,hp:7,type:"unit",attr:"forest"},
"ネイチャーロード":{cost:3,atk:3,hp:3,type:"unit",attr:"forest",effect:"SUM_DRAW1"},

"シードバースト":{cost:2,type:"spell",attr:"forest",effect:"SUM_S_TOKEN3"},
"グロウス":{cost:2,type:"spell",attr:"forest",effect:"A_H_PERM+3"},
"リンカーネーション":{cost:2,type:"spell",attr:"forest",effect:"UNIT_DES_SUM_C3"},
"森の恵み":{cost:1,type:"spell",attr:"forest",effect:"L+3_DRAW1"},
"ナチュラルアーマー":{cost:2,type:"spell",attr:"forest",effect:"TURN_ALL_A+2"},
"根の呪縛":{cost:2,type:"spell",attr:"forest",effect:"ALL_DISABLE_1T"},
"大地の力":{cost:3,type:"spell",attr:"forest",effect:"ALL_A_H_PERM+2"},
"シードスポーン":{cost:3,type:"spell",attr:"forest",effect:"SUM_H_C3X2"},
"リーフストーム":{cost:3,type:"spell",attr:"forest",effect:"ALL_UNIT_DMG3_MY_A_H+1"},
"世界樹の聖域":{cost:3,type:"spell",attr:"forest",effect:"PERM_SPELL_FOREST_BUFF",durability:7},

//🌑闇
"シャドウバット":{cost:2,atk:2,hp:1,type:"unit",attr:"dark",effect:"SUM_R_HAN1_C3"},
"ダークスライム":{cost:1,atk:1,hp:3,type:"unit",attr:"dark"},
"シャドウアサシン":{cost:3,atk:4,hp:2,type:"unit",attr:"dark",effect:"SUM_A_PERM-2"},
"ダークナイト":{cost:2,atk:3,hp:3,type:"unit",attr:"dark"},
"ナイトメアビースト":{cost:1,atk:2,hp:2,type:"unit",attr:"dark"},
"アビスナイト":{cost:3,atk:4,hp:4,type:"unit",attr:"dark"},
"ナイトリカー":{cost:3,atk:4,hp:3,type:"unit",attr:"dark",destroyEffect:"DES_BOTH_DISC1"},
"ダークサイフォナー":{cost:3,atk:3,hp:3,type:"unit",attr:"dark",effect:"SUM_OPP_E-1"},
"カースドラゴン":{cost:4,atk:4,hp:4,type:"unit",attr:"dark",attackEffect:"HAN1"},
"ヘルハウンド":{cost:4,atk:6,hp:4,type:"unit",attr:"dark"},
"ナイトテラー":{cost:4,atk:5,hp:5,type:"unit",attr:"dark"},
"ダークロード":{cost:5,atk:7,hp:5,type:"unit",attr:"dark",effect:"SUM_R_HAN1"},
"シャドウキング":{cost:4,atk:4,hp:4,type:"unit",attr:"dark",effect:"FIELD_H+2_D"},
"アビスウォール":{cost:2,atk:2,hp:5,type:"unit",attr:"dark"},

"ダークブラスト":{cost:2,type:"spell",attr:"dark",effect:"UNIT_DMG3"},
"マインドコントロール":{cost:2,type:"spell",attr:"dark",effect:"DISABLE1"},
"ソウルトレード":{cost:2,type:"spell",attr:"dark",effect:"SOUL_TRADE"},
"エナジーカース":{cost:2,type:"spell",attr:"dark",effect:"OPP_E-1_HAN1"},
"リセット":{cost:4,type:"spell",attr:"dark",effect:"ALL_UNIT_BOUNCE"},
"ソウルドレイン":{cost:3,type:"spell",attr:"dark",effect:"L_ADJ8"},
"ディスカード":{cost:1,type:"spell",attr:"dark",effect:"HAN1_DRAW1"},
"カースシャドウ":{cost:1,type:"spell",attr:"dark",effect:"A_PERM-3"},
"デスペレーション":{cost:3,type:"spell",attr:"dark",effect:"OPP_HAND_TO2"},
"瘴気の迷宮":{cost:2,type:"spell",attr:"dark",effect:"PERM_SPELL_DARK_DEBUFF",durability:4},

//☠️毒
"ポイズンインプ":{cost:1,atk:4,hp:2,type:"unit",attr:"poison",effect:"SUM_L_SELF-2"},
"トキシックスライム":{cost:1,atk:2,hp:2,type:"unit",attr:"poison"},
"トキシックビースト":{cost:2,atk:5,hp:4,type:"unit",attr:"poison",effect:"SUM_L_SELF-2"},
"プラーグハウンド":{cost:2,atk:3,hp:3,type:"unit",attr:"poison"},
"ブライトレッチ":{cost:2,atk:4,hp:2,type:"unit",attr:"poison"},
"ポイズンドレイン":{cost:3,atk:3,hp:3,type:"unit",attr:"poison",attackEffect:"ATTACK_HEAL_DMG"},
"マッドサイエンティスト":{cost:3,atk:3,hp:4,type:"unit",attr:"poison",effect:"SUM_LIFE_8_A+4"},
"ヴェノムアルケミスト":{cost:3,atk:0,hp:3,type:"unit",attr:"poison",effect:"SUM_L_SELF-X_A+X"},
"マイアズマウォーカー":{cost:3,atk:5,hp:3,type:"unit",attr:"poison"},
"ヴェノムロード":{cost:4,atk:4,hp:5,type:"unit",attr:"poison",effect:"SUM_L_SELF-X_DRAWX"},
"ベインブリンガー":{cost:4,atk:4,hp:5,type:"unit",attr:"poison",effect:"FIELD_A+1_P"},
"ポイズンナイト":{cost:4,atk:6,hp:4,type:"unit",attr:"poison"},
"コラプトジャイアント":{cost:4,atk:5,hp:5,type:"unit",attr:"poison"},
"トキシックドラゴン":{cost:5,atk:0,hp:0,type:"unit",attr:"poison",effect:"SUM_A_H_LOST_LIFE"},

"インジェクション":{cost:1,type:"spell",attr:"poison",effect:"L_SELF-1_A+3"},
"サクリファイス":{cost:1,type:"spell",attr:"poison",effect:"UNIT_DES_L_HEAL"},
"劇薬調合":{cost:1,type:"spell",attr:"poison",effect:"L_SELF-2_DRAW3"},
"ポイズンスパイク":{cost:3,type:"spell",attr:"poison",effect:"L_SELF-2_ALL_DMG4"},
"解毒剤":{cost:2,type:"spell",attr:"poison",effect:"L+8"},
"ペインシェア":{cost:1,type:"spell",attr:"poison",effect:"BOTH_L-3"},
"禁断の秘薬":{cost:3,type:"spell",attr:"poison",effect:"L_SELF_HALF_DRAW5"},
"ヴェノムハーベスト":{cost:3,type:"spell",attr:"poison",effect:"UNIT_DES_COST_LHEAL"},
"トキシックアポカリプス":{cost:4,type:"spell",attr:"poison",effect:"LIFE_5_ALL_DES"},
"薬草の湿地":{cost:2,type:"spell",attr:"poison",effect:"PERM_SPELL_HERB_HEAL",durability:5},

//⚙️鉄
"ギアスカウト":{cost:1,atk:1,hp:1,type:"unit",attr:"steel",effect:"SUM_TOKEN1"},
"プロトタイプユニット":{cost:1,atk:1,hp:1,type:"unit",attr:"steel",destroyEffect:"TOKEN2"},
"メタルブルート":{cost:2,atk:2,hp:4,type:"unit",attr:"steel"},
"ギアコンバーター":{cost:2,atk:2,hp:3,type:"unit",attr:"steel",effect:"SUM_IRON_DES_A+"},
"スチールブレイバー":{cost:2,atk:3,hp:3,type:"unit",attr:"steel"},
"スチールビースト":{cost:3,atk:5,hp:3,type:"unit",attr:"steel"},
"オートマトンファクトリー":{cost:3,atk:2,hp:7,type:"unit",attr:"steel",effect:"START_TOKEN1"},
"メカニカルアーチャー":{cost:3,atk:4,hp:3,type:"unit",attr:"steel",effect:"SUM_TOKEN_DES_UNIT_DMG2"},
"ヘビィタンク":{cost:3,atk:4,hp:4,type:"unit",attr:"steel"},
"ギアドレイク":{cost:4,atk:5,hp:5,type:"unit",attr:"steel"},
"ギアタイタン":{cost:4,atk:4,hp:5,type:"unit",attr:"steel",effect:"SUM_TOKEN1"},
"フェルムマスター":{cost:4,atk:4,hp:5,type:"unit",attr:"steel",effect:"FIELD_A+1_S"},
"アイアンレイダー":{cost:4,atk:4,hp:6,type:"unit",attr:"steel"},
"メガコンストラクト":{cost:5,atk:0,hp:4,type:"unit",attr:"steel",effect:"SUM_IRON_COUNT_X3_A"},

"リサイクル":{cost:2,type:"spell",attr:"steel",effect:"RECYCLE_IRON"},
"緊急生産":{cost:2,type:"spell",attr:"steel",effect:"SUM_TOKEN3"},
"スクラップ&ビルド":{cost:2,type:"spell",attr:"steel",effect:"SCRAP_BUILD_C3"},
"自爆装置":{cost:2,type:"spell",attr:"steel",effect:"IRON_DES_UNIT_DES"},
"装甲強化":{cost:2,type:"spell",attr:"steel",effect:"ALL_H_PERM+2"},
"ギアリペア":{cost:2,type:"spell",attr:"steel",effect:"UNIT_FULL_HEAL"},
"チェーンリアクション":{cost:3,type:"spell",attr:"steel",effect:"IRON_COUNT_ALL_DMG1"},
"メガギアフュージョン":{cost:3,type:"spell",attr:"steel",effect:"FUSION_IRON2"},
"オーバーロード":{cost:4,type:"spell",attr:"steel",effect:"OVERLOAD_A+3_END_DES_ALL"},
"機甲要塞都市":{cost:3,type:"spell",attr:"steel",effect:"PERM_SPELL_IRON_FACTORY",durability:7},

//汎用
"ダブルドロー":{cost:1,type:"spell",attr:"neutral",effect:"DRAW2"},
"解放の光":{cost:2,type:"spell",attr:"neutral",effect:"PURIFY"},
"リバース":{cost:2,type:"spell",attr:"neutral",effect:"BOUNCE_UNIT"},
"崩壊":{cost:1,type:"spell",attr:"neutral",effect:"DES_PERM_SPELL"}
};


function shuffle(deck){
  for(let i=deck.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [deck[i],deck[j]]=[deck[j],deck[i]];
  }
  return deck;
}

let game={
  player1:null,
  player2:null,
  turn:null,
  firstPlayer:null,
  board:{},
  hands:{},
  decks:{},
  graves:{},
  energy:{},
  maxEnergy:{},
  life:{},
  winner:null,
  customDeck:{},
  noAttack:{},
  // ★効果実装用追加
pendingDiscard:{},   // {プレイヤーID: 捨てる枚数} 手札捨て待ち
  turnBuffs:{},        // {プレイヤーID: {atk:N}} このターンのみのバフ
  pendingTarget:null,  // 対象選択待ち {player, effect, card, extra}
  pendingHandLimitDiscard:null, // 手札上限捨て待ちプレイヤーID
  pendingNext:null, // ★連鎖する次の効果処理
  fieldSpell:{},   // ★フィールドスペル {プレイヤーID: {name, durability}}
  allLogs:[],
  turnLogs:{},
  prevLogs:{}
};

function getOpponent(id){
  return id===game.player1 ? game.player2 : game.player1;
}

// ★カード属性を取得
function getAttr(cardName){
  if(cardName==="ギアトークン") return "steel";
　if(cardName==="ギギアトークン") return "steel";
  if(cardName==="ギギギアトークン") return "steel";
  if(cardName==="シードトークン") return "forest";
  return cards[cardName]?.attr || "neutral";
}

// ★ドロー処理
function draw(p, isTurnStart){
  if(game.decks[p].length===0){
    if(isTurnStart) game.winner=getOpponent(p);
    return;
  }
  game.hands[p].push(game.decks[p].shift());
}

// ★複数枚ドロー
function drawN(p, n){
  for(let i=0;i<n;i++) draw(p);
}

// ★手札からランダム1枚捨てる（戻り値：捨てたカード名 or null）
function discardRandom(p){
  if(game.hands[p].length===0) return null;
  const idx=Math.floor(Math.random()*game.hands[p].length);
  const card=game.hands[p][idx];
  game.hands[p].splice(idx,1);
  game.graves[p].push({name:card});
  return card;
}

// ★手札を全て捨てる
function discardAll(p){
  const discarded=[...game.hands[p]];
  discarded.forEach(c=>game.graves[p].push({name:c}));
  game.hands[p]=[];
  return discarded;
}

// ★ライフダメージ（相手プレイヤーへ）
function damageLife(p, amount){
  game.life[p]-=amount;
  if(game.life[p]<=0) game.winner=getOpponent(p);
  if(amount>0) sendDamagePop(p, amount, true, -1);
}

// ★場の全ユニットにダメージ（破壊チェック込み）
function damageAllUnits(targetPlayer, amount, attackerPlayer){
  const toDestroy=[];
  game.board[targetPlayer].forEach((u,i)=>{
    const dmg = u.damageReduce ? Math.min(1, amount) : amount;
    u.hp -= dmg;
    if(dmg>0) sendDamagePop(targetPlayer, dmg, false, i);
    if(u.hp<=0) toDestroy.push(i);
  });
  // 後ろから削除
toDestroy.reverse().forEach(i=>{
    const dead=game.board[targetPlayer][i];
    game.board[targetPlayer].splice(i,1);
    if(!dead.isToken) game.graves[targetPlayer].push(dead);
    triggerDestroyEffect(dead, targetPlayer);
  });
}

// ★場の全ユニットにATKバフ（永続）
function buffAllUnitsATK(p, amount){
  game.board[p].forEach(u=>u.atk+=amount);
}

// ★場の全ユニットにHPバフ（永続）
function buffAllUnitsHP(p, amount){
  game.board[p].forEach(u=>u.hp+=amount);
}

// ★場の同属性全ユニットにバフ（召喚時のFIELD系）
function applyFieldBuff(p, attr, atkDelta, hpDelta){
  game.board[p].forEach(u=>{
    if(getAttr(u.name)===attr){
      u.atk+=atkDelta;
      u.hp+=hpDelta;
    }
  });
}

// ★FIELD系効果を場全体に再適用（召喚時に呼ぶ）
function applyAllFieldEffects(p){
  // 場にいるFIELD系ユニットの効果を全ユニットに反映
  // 毎回リセットして再計算する方式は複雑になるため、
  // 召喚時のみ差分を加算するシンプル方式を採用
  game.board[p].forEach(u=>{
    const c=cards[u.name];
    if(!c || !c.effect) return;
    const eff=c.effect;
    if(eff==="FIELD_A+1_F") applyFieldBuff(p,"fire",1,0);
    else if(eff==="FIELD_A+1_L") applyFieldBuff(p,"thunder",1,0);
    else if(eff==="FIELD_H+2_D") applyFieldBuff(p,"dark",0,2);
    else if(eff==="FIELD_A+1_P") applyFieldBuff(p,"poison",1,0);
    else if(eff==="FIELD_A+1_S") applyFieldBuff(p,"steel",1,0);
    else if(eff==="FIELD_H+2_W") applyFieldBuff(p,"water",0,2);
    else if(eff==="FIELD_H+1_M") applyFieldBuff(p,"forest",0,1);
  });
}

// ★ユニット召喚後の共通バフ/デバフ適用
function applyFieldSpellOnSummon(unit, ownerPlayer){
  const op=getOpponent(ownerPlayer);
  // 世界樹の聖域：自分フィールドスペルがある場合ATK/HP+1
  if(game.fieldSpell[ownerPlayer]&&cards[game.fieldSpell[ownerPlayer].name]?.effect==="PERM_SPELL_FOREST_BUFF"){
    unit.atk+=1; unit.hp+=1;
  }
  // 深海の神殿：自分フィールドスペルがある場合ATK+1
  if(game.fieldSpell[ownerPlayer]&&cards[game.fieldSpell[ownerPlayer].name]?.effect==="PERM_SPELL_WATER_ENERGY"){
    unit.atk+=1;
  }
  // 機甲要塞都市：ギアスカウト・プロトタイプユニット召喚時ATK+1
  if(game.fieldSpell[ownerPlayer]&&cards[game.fieldSpell[ownerPlayer].name]?.effect==="PERM_SPELL_IRON_FACTORY"){
    if(unit.name==="ギアスカウト"||unit.name==="プロトタイプユニット"){
      unit.atk+=1;
    }
  }
  // 瘴気の迷宮：相手フィールドスペルがある場合ATK-1
  if(game.fieldSpell[op]&&cards[game.fieldSpell[op].name]?.effect==="PERM_SPELL_DARK_DEBUFF"){
    unit.atk=Math.max(0,unit.atk-1);
  }
}

// ★トークン召喚
function summonToken(p, tokenName, n){
  for(let i=0;i<n;i++){
    if(game.board[p].length>=3) break;
    const tokenAttr = tokenName==="ギアトークン"?"steel":"forest";
    let tokenAtk=1;
    let tokenHp=1;
    // 機甲要塞都市：ギアトークンのATK+1
    if(tokenName==="ギアトークン"&&game.fieldSpell[p]&&cards[game.fieldSpell[p].name]?.effect==="PERM_SPELL_IRON_FACTORY"){
      tokenAtk+=1;
    }
    const newToken={name:tokenName, atk:tokenAtk, hp:tokenHp, attacked:false, attr:tokenAttr, isToken:true};
    game.board[p].push(newToken);
    // ★共通バフ/デバフ適用
    applyFieldSpellOnSummon(newToken, p);
  }
}

// ★破壊時効果
function triggerDestroyEffect(unit, ownerPlayer){
  const c=cards[unit.name];
  if(!c || !c.destroyEffect) return;
  const op=getOpponent(ownerPlayer);
  showEffect(unit.name); // ★破壊時効果発動演出
  const logPlayer = game.turn || ownerPlayer; // 現ターンプレイヤーにログを記録
  switch(c.destroyEffect){
    case "L_DMG1":
      damageLife(op,1);
      addLog(logPlayer,`「${unit.name}」破壊時効果：相手ライフ-1`);
      break;
    case "L_DMG3":
      damageLife(op,3);
      addLog(logPlayer,`「${unit.name}」破壊時効果：相手ライフ-3`);
      break;
    case "DRAW1":
      draw(ownerPlayer);
      addLog(logPlayer,`「${unit.name}」破壊時効果：1枚ドロー`);
      break;
    case "TOKEN2":
      summonToken(ownerPlayer,"ギアトークン",2);
      addLog(logPlayer,`「${unit.name}」破壊時効果：ギアトークン2体召喚`);
      break;
    case "DES_ALL_UNIT_DMG1":
      damageAllUnits(op,1,ownerPlayer);
      addLog(logPlayer,`「${unit.name}」破壊時効果：相手全体1ダメージ`);
      break;
    case "DES_BOTH_DISC1":
      { const d1=discardRandom(ownerPlayer);
        const d2=discardRandom(op);
        addLog(logPlayer,`「${unit.name}」破壊時効果：両者手札1枚ランダム破棄`);
        const _sownerS=io.sockets.sockets.get(ownerPlayer);
        const _sopS=io.sockets.sockets.get(op);
        if(_sownerS&&d2) _sownerS.emit("message",`相手の手札「${d2}」が捨て場に送られました`);
        if(_sopS&&d1) _sopS.emit("message",`あなたの手札「${d1}」が捨て場に送られました`);
      }
      break;
    case "DES_SUMMON_C3":
      if(game.board[ownerPlayer].length<3){
        const validHand=game.hands[ownerPlayer].filter(name=>cards[name]?.type==="unit"&&(cards[name]?.cost||0)<=3&&getAttr(name)==="forest");
        if(validHand.length>0){
          game.pendingTarget={player:ownerPlayer,effect:"DES_SUMMON_C2_HAND",card:unit.name};
          addLog(logPlayer,`「${unit.name}」破壊時効果：コスト3以下の森ユニットを召喚できます`);
        }
      }
      break;
  }
}


// ★召喚時効果（対象選択不要なもの）
function triggerSummonEffect(unit, p, socket, io){
  const c=cards[unit.name];
  if(!c || !c.effect) return;
  const op=getOpponent(p);
  const eff=c.effect;
  // ★召喚時効果が実際に処理される場合に演出（play_card以外から呼ばれた場合に有効）
  // ただしDAMAGE_REDUCE_1・END_A+1・START_TOKEN1・DES_SUMMON_C2はUIと無関係なため除外
  const silentEffects=["DAMAGE_REDUCE_1","END_A+1","START_TOKEN1","DES_SUMMON_C2","DENKOUSEKKA","ALL_ATTACK"];
  if(!silentEffects.includes(eff)){
    showEffect(unit.name);
  }
  switch(eff){
    case "SUM_L_DMG1":
      damageLife(op,1);
      addLog(p,`「${unit.name}」召喚時効果：相手ライフ-1`);
      break;
    case "SUM_L+1":
      game.life[p]+=1;
      addLog(p,`「${unit.name}」召喚時効果：自分ライフ+1`);
      break;
    case "SUM_E+1":
      game.maxEnergy[p]=Math.min(10,game.maxEnergy[p]+1);
      game.energy[p]=Math.min(game.maxEnergy[p],game.energy[p]+1);
      addLog(p,`「${unit.name}」召喚時効果：最大エネルギー+1、エネルギー+1`);
      break;
    case "SUM_DRAW1":
      draw(p);
      addLog(p,`「${unit.name}」召喚時効果：1枚ドロー`);
      break;
    case "SUM_L_SELF-2":
      game.life[p]-=2;
      if(game.life[p]<=0) game.winner=op;
      addLog(p,`「${unit.name}」召喚時効果：自分ライフ-2`);
      break;
    case "SUM_R_HAN1":
      { const d=discardRandom(op);
        addLog(p,`「${unit.name}」召喚時効果：相手手札「${d||"なし"}」をランダム破棄`);
        const _s1=io.sockets.sockets.get(p);
        if(_s1&&d) _s1.emit("message",`相手の手札「${d}」が捨て場に送られました`);
      }
      break;
    case "SUM_R_HAN1_C3":
      if(game.hands[op].length>=3){
        const d2=discardRandom(op);
        addLog(p,`「${unit.name}」召喚時効果：相手手札「${d2||"なし"}」をランダム破棄`);
        const _s1c2=io.sockets.sockets.get(p);
        if(_s1c2&&d2) _s1c2.emit("message",`相手の手札「${d2}」が捨て場に送られました`);
      }else{
        addLog(p,`「${unit.name}」召喚時効果：相手の手札が3枚以下のため不発`);
      }
      break;
    case "SUM_OPP_E-1":
      game.maxEnergy[op]=Math.max(0,game.maxEnergy[op]-1);
      game.energy[op]=Math.min(game.energy[op],game.maxEnergy[op]);
      addLog(p,`「${unit.name}」召喚時効果：相手最大エネルギー-1`);
      break;
    case "SUM_ALL_UNIT_DMG1":
      damageAllUnits(op,1,p);
      addLog(p,`「${unit.name}」召喚時効果：相手全体1ダメージ`);
      break;
    case "SUM_DES_COST1_ALL":
      { const toDestroy1=[];
        game.board[op].forEach((u,i)=>{if((cards[u.name]?.cost||0)<=1)toDestroy1.push(i);});
        toDestroy1.reverse().forEach(i=>{const d=game.board[op].splice(i,1)[0];game.graves[op].push(d);triggerDestroyEffect(d,op);});
        addLog(p,`「${unit.name}」召喚時効果：相手コスト1以下ユニット全破壊`);
      }
      break;
    case "SUM_TOKEN1":
      summonToken(p,"ギアトークン",1);
      addLog(p,`「${unit.name}」召喚時効果：ギアトークン1体召喚`);
      break;
    case "SUM_BURNOUT":
      unit.burnout=true;
      addLog(p,`「${unit.name}」召喚時効果：ターン終了時自壊`);
      break;
    case "SUM_LIFE_8_A+4":
      if(game.life[p]<=8){unit.atk+=4;addLog(p,`「${unit.name}」召喚時効果：ライフ8以下のためATK+4`);}
      break;
    case "SUM_A_H_LOST_LIFE":
      { const lost=15-game.life[p];
        unit.atk=lost; unit.hp=lost;
        addLog(p,`「${unit.name}」召喚時効果：ATK/HP=${lost}（失ったライフ分）`);
      }
      break;
    case "SUM_IRON_COUNT_X3_A":
      { // 自分を含む鉄ユニット数（自分はすでにboard[p]に追加済み）
        const ironCount=game.board[p].filter(u=>getAttr(u.name)==="steel").length;
        unit.atk=ironCount*3;
        addLog(p,`「${unit.name}」召喚時効果：ATK=${unit.atk}（鉄${ironCount}体×3、自分含む）`);
      }
      break;
    // FIELD系
    case "FIELD_A+1_F": applyFieldBuff(p,"fire",1,0); addLog(p,`「${unit.name}」：場の火属性ATK+1`); break;
    case "FIELD_A+1_L": applyFieldBuff(p,"thunder",1,0); addLog(p,`「${unit.name}」：場の雷属性ATK+1`); break;
    case "FIELD_H+2_D": applyFieldBuff(p,"dark",0,2); addLog(p,`「${unit.name}」：場の闇属性HP+2`); break;
    case "FIELD_A+1_P": applyFieldBuff(p,"poison",1,0); addLog(p,`「${unit.name}」：場の毒属性ATK+1`); break;
    case "FIELD_A+1_S": applyFieldBuff(p,"steel",1,0); addLog(p,`「${unit.name}」：場の鉄属性ATK+1`); break;
    case "FIELD_H+2_W": applyFieldBuff(p,"water",0,2); addLog(p,`「${unit.name}」：場の水属性HP+2`); break;
    case "FIELD_H+1_M": applyFieldBuff(p,"forest",0,1); addLog(p,`「${unit.name}」：場の森属性HP+1`); break;

    // ★フェーズ2：対象選択が必要な召喚時効果
    case "SUM_A_PERM-2":
      if(game.board[op].length===0) break;
      game.pendingTarget={player:p, effect:"SUM_A_PERM-2", card:unit.name, summonPos:game.board[p].length-1};
      socket.emit("selectTarget",{type:"enemyUnit", message:`「${unit.name}」召喚時効果：ATK-2する相手ユニットを選択してください`});
      break;
case "SUM_UNIT_A_PERM+1":
      if(game.board[p].length===0) break;
      game.pendingTarget={player:p, effect:"SUM_UNIT_A_PERM+1", card:unit.name};
      socket.emit("selectTarget",{type:"myUnit", message:`「${unit.name}」召喚時効果：ATK+1する味方ユニットを選択してください`});
      break;
    case "SUM_IRON_DES_A+":
      // ギアコンバーター：場の鉄ユニット1体を破壊してそのATKを自分に加算
      { const ironUnits=game.board[p].filter(u=>getAttr(u.name)==="steel"&&u.name!==unit.name);
        if(ironUnits.length===0){addLog(p,`「${unit.name}」召喚時効果：対象なし`);break;}
        game.pendingTarget={player:p,effect:"SUM_IRON_DES_A+",card:unit.name};
        socket.emit("selectTarget",{type:"myUnit",message:`「${unit.name}」召喚時効果：破壊する鉄ユニットを選択してください（そのATKを自分に加算）`});
      }
      break;
    case "SUM_TOKEN_DES_UNIT_DMG2":
      // メカニカルアーチャー：ギアトークンを1体破壊して相手ユニット1体に2ダメージ
      { const tokens=game.board[p].filter(u=>u.isToken&&getAttr(u.name)==="steel");
        if(tokens.length===0){addLog(p,`「${unit.name}」召喚時効果：ギアトークンなし`);break;}
        if(game.board[op].length===0){addLog(p,`「${unit.name}」召喚時効果：相手ユニットなし`);break;}
        game.pendingTarget={player:p,effect:"SUM_TOKEN_DES_UNIT_DMG2",card:unit.name};
        socket.emit("selectTarget",{type:"myUnit",message:`「${unit.name}」召喚時効果：破壊するギアトークンを選択してください`});
      }
      break;
    case "SUM_DES_SUM_C2":
      // ボルトチェンジャー：場の自分のユニット1体を破壊して手札からコスト2以下召喚
      { if(game.board[p].length<=1){addLog(p,`「${unit.name}」召喚時効果：他にユニットがいません`);break;}
        game.pendingTarget={player:p,effect:"SUM_DES_SUM_C2",card:unit.name};
        socket.emit("selectTarget",{type:"myUnit",message:`「${unit.name}」召喚時効果：破壊するユニットを選択してください（コスト2以下を手札から召喚）`});
      }
      break;
    case "SUM_L_SELF-X_A+X":
      // ヴェノムアルケミスト：自分のライフを任意数支払い、その分ATKを得る
      game.pendingTarget={player:p,effect:"SUM_L_SELF-X_A+X",card:unit.name,unit:unit};
      socket.emit("selectTarget",{type:"lifeInput",message:`「${unit.name}」：支払うライフを入力してください（現在ライフ:${game.life[p]}）`});
      break;
    case "SUM_L_SELF-X_DRAWX":
      // ヴェノムロード：自分のライフを任意数支払い、その分ドロー
      game.pendingTarget={player:p,effect:"SUM_L_SELF-X_DRAWX",card:unit.name};
      socket.emit("selectTarget",{type:"lifeInput",message:`「${unit.name}」：支払うライフを入力してください（現在ライフ:${game.life[p]}）`});
      break;
case "DENKOUSEKKA":
      unit.denko=true;
      addLog(p,`「${unit.name}」：電光石火を持って召喚`);
      break;
    case "END_A+1":
      // ターン終了時効果：startTurnでは何もしない
      break;
    case "START_TOKEN1":
      // startTurnで処理
      break;
    case "DAMAGE_REDUCE_1":
      // damageReduceはunit生成時に設定済み
      break;
    case "DES_SUMMON_C2":
      break;
  }
}
// ★スペル効果処理（対象選択不要なもの）
function processSpellEffect(cardName, p, socket){
  const c=cards[cardName];
  if(!c) return false;
  const op=getOpponent(p);
  const eff=c.effect||"";

  switch(eff){
    case "DRAW2":
      drawN(p,2);
      addLog(p,`「${cardName}」でカードを2枚ドロー`);
      return true;
    case "L+3_DRAW1":
      game.life[p]+=3; draw(p);
      addLog(p,`「${cardName}」でライフ+3、1枚ドロー`);
      return true;
    case "L+8":
      game.life[p]+=8;
      addLog(p,`「${cardName}」でライフ+8`);
      return true;
    case "E+2":
      game.maxEnergy[p]=Math.min(10,game.maxEnergy[p]+2);
      game.energy[p]=Math.min(game.maxEnergy[p],game.energy[p]+2);
      addLog(p,`「${cardName}」でエネルギー+2`);
      return true;
    case "L_ADJ8":
      game.life[op]-=2; game.life[p]+=4;
      if(game.life[op]<=0) game.winner=p;
      addLog(p,`「${cardName}」で相手ライフ-2、自分ライフ+4`);
      return true;
    case "BOTH_L-3":
      game.life[p]-=3; game.life[op]-=3;
      if(game.life[p]<=0&&game.life[op]<=0) game.winner=null;
      else if(game.life[p]<=0) game.winner=op;
      else if(game.life[op]<=0) game.winner=p;
      addLog(p,`「${cardName}」で両者ライフ-3`);
      return true;
    case "ALL_UNIT_DMG2":
      damageAllUnits(op,2,p);
      addLog(p,`「${cardName}」で相手全ユニットに2ダメージ`);
      return true;
    case "ALL_UNIT_DMG4":
      damageAllUnits(op,4,p);
      addLog(p,`「${cardName}」で相手全ユニットに4ダメージ`);
      return true;
    case "ALL_UNIT_DMG1_L2":
      damageAllUnits(op,1,p); damageLife(op,2);
      addLog(p,`「${cardName}」で相手全体-1、相手ライフ-2`);
      return true;
    case "ALL_UNIT_BOUNCE":
      [[p,p],[op,op]].forEach(([player])=>{
        [...game.board[player]].forEach(u=>{
          if(!u.isToken) game.hands[player].push(u.name);
        });
        game.board[player]=[];
      });
      addLog(p,`「${cardName}」で場の全ユニットを手札に戻した`);
      return true;
    case "ALL_DISC2":
      { const discardedAll=discardAll(op);
        drawN(op,2);
        addLog(p,`「${cardName}」で相手の手札を全捨て、相手2枚ドロー`);
        const _sda=io.sockets.sockets.get(p);
        if(_sda&&discardedAll.length>0) _sda.emit("message",`相手の手札「${discardedAll.join("、")}」が捨て場に送られました`);
      }
      return true;
    case "OPP_HAND_TO2":
      { if(game.hands[op].length<=2){
          addLog(p,`「${cardName}」：相手の手札が2枚以下のため不発`);
          socket.emit("message","相手の手札が2枚以下のため不発です");
          return false;
        }
        const discarded2=[];
        while(game.hands[op].length>2){
          const d=discardRandom(op);
          if(d) discarded2.push(d);
        }
        addLog(p,`「${cardName}」で相手の手札を残り2枚まで破棄（${discarded2.length}枚）`);
        const _sdop=io.sockets.sockets.get(p);
        if(_sdop&&discarded2.length>0) _sdop.emit("message",`相手の手札「${discarded2.join("、")}」が捨て場に送られました`);
      }
      return true;
    case "HAN1_DRAW1":
      { draw(p);
        addLog(p,`「${cardName}」で1枚ドロー`);
        if(game.hands[op].length>=3){
          const discarded=discardRandom(op);
          addLog(p,`「${cardName}」で相手手札「${discarded||"なし"}」を破棄`);
          const _s2=io.sockets.sockets.get(p);
          if(_s2&&discarded) _s2.emit("message",`相手の手札「${discarded}」が捨て場に送られました`);
        }else{
          addLog(p,`「${cardName}」：相手の手札が3枚以下のためハンデス不発`);
        }
      }
      return true;
    case "DRAW2_DISC1":
      drawN(p,2);
      game.pendingDiscard[p]=1;
      addLog(p,`「${cardName}」で2枚ドロー（1枚捨て待ち）`);
      return true;
    case "DRAW3_DISC2":
      drawN(p,3);
      game.pendingDiscard[p]=2;
      addLog(p,`「${cardName}」で3枚ドロー（2枚捨て待ち）`);
      return true;
    case "L_SELF-2_DRAW3":
      game.life[p]-=2;
      if(game.life[p]<=0){game.winner=op;return true;}
      drawN(p,3);
      addLog(p,`「${cardName}」で自分ライフ-2、3枚ドロー`);
      return true;
    case "L_SELF_HALF_DRAW5":
      game.life[p]=Math.floor(game.life[p]/2);
      if(game.life[p]<=0){game.winner=op;return true;}
      drawN(p,5);
      addLog(p,`「${cardName}」でライフ半分、5枚ドロー`);
      return true;
    case "ALL_H_PERM+2":
      buffAllUnitsHP(p,2);
      addLog(p,`「${cardName}」で味方全体HP+2（永続）`);
      return true;
    case "ALL_A_H_PERM+2":
      buffAllUnitsATK(p,2); buffAllUnitsHP(p,2);
      addLog(p,`「${cardName}」で味方全体ATK/HP+2（永続）`);
      return true;
    case "TURN_ALL_A+2":
      if(!game.turnBuffs[p]) game.turnBuffs[p]={atk:0};
      game.turnBuffs[p].atk=(game.turnBuffs[p].atk||0)+2;
      game.board[p].forEach(u=>u.atk+=2);
      addLog(p,`「${cardName}」で味方全体ATK+2（このターン）`);
      return true;
    case "TURN_ALL_A+1_L_DMGX":
      { if(!game.turnBuffs[p]) game.turnBuffs[p]={atk:0};
        game.turnBuffs[p].atk=(game.turnBuffs[p].atk||0)+1;
        game.board[p].forEach(u=>u.atk+=1);
        const unitCount=game.board[p].length;
        if(unitCount>0) damageLife(op,unitCount);
        addLog(p,`「${cardName}」で全体ATK+1、相手ライフ-${unitCount}`);
      }
      return true;
    case "SUM_TOKEN3":
      summonToken(p,"ギアトークン",3);
      addLog(p,`「${cardName}」でギアトークン3体召喚`);
      return true;
    case "SUM_S_TOKEN3":
      summonToken(p,"シードトークン",3);
      addLog(p,`「${cardName}」でシードトークン3体召喚`);
      return true;
    case "LIFE_5_ALL_DES":
      if(game.life[p]>5){socket.emit("message","ライフが5以下の時のみ使用できます");return false;}
      { const toDestAll=[...game.board[op]];
        game.board[op]=[];
        toDestAll.forEach(u=>{game.graves[op].push(u);triggerDestroyEffect(u,op);});
        addLog(p,`「${cardName}」で相手全ユニット破壊`);
      }
      return true;
    case "OPP_E-1_HAN1":
      game.maxEnergy[op]=Math.max(0,game.maxEnergy[op]-1);
      game.energy[op]=Math.min(game.energy[op],game.maxEnergy[op]);
      addLog(p,`「${cardName}」で相手エネルギー-1`);
      if(game.hands[op].length>=3){
        const discarded=discardRandom(op);
        addLog(p,`「${cardName}」で相手手札「${discarded||"なし"}」破棄`);
        const _s3=io.sockets.sockets.get(p);
        if(_s3&&discarded) _s3.emit("message",`相手の手札「${discarded}」が捨て場に送られました`);
      }else{
        addLog(p,`「${cardName}」：相手の手札が3枚以下のためハンデス不発`);
      }
      return true;
    case "L_SELF-2_ALL_DMG4":
      game.life[p]-=2;
      if(game.life[p]<=0){game.winner=op;return true;}
      damageAllUnits(op,4,p);
      addLog(p,`「${cardName}」で自ライフ-2、相手全体4ダメージ`);
      return true;

    // ★フェーズ2：対象選択が必要なスペル
    case "UNIT_DMG3":
    case "UNIT_DMG2":
      if(game.board[op].length===0){socket.emit("message","対象ユニットがいません");return false;}
      game.pendingTarget={player:p, effect:eff, card:cardName};
      socket.emit("selectTarget",{type:"enemyUnit", message:`「${cardName}」の対象を選択してください`});
      return "pending";
    case "A_PERM+3":
    case "A+2_H+1":
    case "A_H_PERM+3":
    case "UNIT_FULL_HEAL":
    case "UNIT_DENKOUSEKKA":
    case "CRYSTAL_BARRIER":
      if(game.board[p].length===0){socket.emit("message","対象ユニットがいません");return false;}
      game.pendingTarget={player:p, effect:eff, card:cardName};
      socket.emit("selectTarget",{type:"myUnit", message:`「${cardName}」の対象を選択してください`});
      return "pending";
    case "PURIFY":
      if(game.board[p].length===0&&game.board[op].length===0){socket.emit("message","対象ユニットがいません");return false;}
      game.pendingTarget={player:p, effect:eff, card:cardName};
      socket.emit("selectTarget",{type:"anyUnit", message:`「${cardName}」：特殊状態を解除するユニットを選択してください（自分・相手どちらでも可）`});
      return "pending";
    case "FLAME_BURN":
      if(game.board[p].length===0){socket.emit("message","自分の場にユニットがいません");return false;}
      game.pendingTarget={player:p, effect:eff, card:cardName};
      socket.emit("selectTarget",{type:"myUnit", message:"フレイムバーン：破壊するユニットを選択してください"});
      return "pending";
    case "AQUA_RETURN":
      { const myWater=game.board[p].filter(u=>getAttr(u.name)==="water");
        if(myWater.length===0){socket.emit("message","自分の場に水ユニットがいません");return false;}
      }
      game.pendingTarget={player:p, effect:eff, card:cardName};
      socket.emit("selectTarget",{type:"myUnit", message:"アクアリターン：手札に戻す自分のユニットを選択してください"});
      return "pending";
    case "A_PERM-3":
      if(game.board[op].length===0){socket.emit("message","対象ユニットがいません");return false;}
      game.pendingTarget={player:p, effect:eff, card:cardName};
      socket.emit("selectTarget",{type:"enemyUnit", message:`「${cardName}」：弱体化する相手ユニットを選択してください`});
      return "pending";
    case "DISABLE1":
      if(game.board[op].length===0){socket.emit("message","対象ユニットがいません");return false;}
      game.pendingTarget={player:p, effect:eff, card:cardName};
      socket.emit("selectTarget",{type:"enemyUnit", message:"マインドコントロール：行動不能にする相手ユニットを選択してください"});
      return "pending";
    case "BOUNCE_UNIT":
      if(game.board[p].length===0&&game.board[op].length===0){socket.emit("message","場にユニットがいません");return false;}
      game.pendingTarget={player:p, effect:eff, card:cardName};
      socket.emit("selectTarget",{type:"anyUnit", message:"リバース：手札に戻すユニットを選択してください（自分・相手どちらでも可）"});
      return "pending";
    case "UNIT_DES_DRAW1":
      if(game.board[op].length===0){socket.emit("message","対象ユニットがいません");return false;}
      game.pendingTarget={player:p, effect:eff, card:cardName};
      socket.emit("selectTarget",{type:"enemyUnit", message:"サンダーストライク：破壊する相手ユニットを選択してください"});
      return "pending";
    case "UNIT_DES_COST_L_DMG":
      if(game.board[op].length===0){socket.emit("message","対象ユニットがいません");return false;}
      game.pendingTarget={player:p, effect:eff, card:cardName};
      socket.emit("selectTarget",{type:"enemyUnit", message:"業火の裁き：破壊する相手ユニットを選択してください"});
      return "pending";
    case "UNIT_DES_COST_LHEAL":
      if(game.board[op].length===0){socket.emit("message","対象ユニットがいません");return false;}
      game.pendingTarget={player:p, effect:eff, card:cardName};
      socket.emit("selectTarget",{type:"enemyUnit", message:"スペル：破壊する相手ユニットを選択してください"});
      return "pending";
    case "UNIT_DES_L_HEAL":
      if(game.board[p].length===0){socket.emit("message","自分の場にユニットがいません");return false;}
      game.pendingTarget={player:p, effect:eff, card:cardName};
      socket.emit("selectTarget",{type:"myUnit", message:"サクリファイス：破壊する自分のユニットを選択してください"});
      return "pending";

// ★フェーズ3追加スペル効果

    // チェーンリアクション（鉄ユニット数×1ダメージ）
    case "IRON_COUNT_ALL_DMG1":{
      const ironCount=game.board[p].filter(u=>getAttr(u.name)==="steel").length;
      if(ironCount===0){socket.emit("message","場に鉄ユニットがいません");return false;}
      damageAllUnits(op,ironCount,p);
      addLog(p,`「${cardName}」：鉄${ironCount}体により相手全体${ironCount}ダメージ`);
      return true;
    }

    // リーフストーム（相手全体3ダメ＋自分全体ATK/HP+1）
    case "ALL_UNIT_DMG3_MY_A_H+1":
      damageAllUnits(op,3,p);
      buffAllUnitsATK(p,1); buffAllUnitsHP(p,1);
      addLog(p,`「${cardName}」：相手全体3ダメージ＋自分全体ATK/HP+1`);
      return true;

    // ポイズンスパイク（自ライフ-2＋相手全体4ダメ）
    case "L_SELF-2_ALL_DMG4":
      game.life[p]-=2;
      if(game.life[p]<=0){game.winner=op;addLog(p,`「${cardName}」で自滅`);return true;}
      damageAllUnits(op,4,p);
      addLog(p,`「${cardName}」：自ライフ-2、相手全体4ダメージ`);
      return true;

    // ソウルトレード（自1枚選択捨て＋自1ドロー、相手ランダム1捨て＋相手1ドロー）
    case "SOUL_TRADE":
      game.pendingTarget={player:p, effect:"SOUL_TRADE_AFTER", card:cardName};
      addLog(p,`「${cardName}」を発動：手札から1枚捨ててください`);
      socket.emit("selectTarget",{type:"soulTrade", message:"ソウルトレード：捨てるカードを手札から選択してください"});
      return "pending";

    // プラズマバースト（相手コスト2以下全破壊＋破壊数ドロー）
    case "DES_COST2_DRAW":{
      const targets=[];
      game.board[op].forEach((u,i)=>{if((cards[u.name]?.cost||0)<=2)targets.push(i);});
      if(targets.length===0){socket.emit("message","相手のコスト2以下ユニットがいません");return false;}
      targets.reverse().forEach(i=>{
        const dead=game.board[op].splice(i,1)[0];
        game.graves[op].push(dead);
        triggerDestroyEffect(dead,op);
      });
      drawN(p,targets.length);
      addLog(p,`「${cardName}」：コスト2以下${targets.length}体破壊、${targets.length}枚ドロー`);
      return true;
    }

    // 根の呪縛（発動ターン＋次の相手ターンも行動不能）
    case "ALL_DISABLE_1T":
      if(game.board[op].length===0){socket.emit("message","相手の場にユニットがいません");return false;}
      game.board[op].forEach(u=>{u.disabled=true;u.disabledCount=1;}); // 次の相手ターン終了時に解除
      addLog(p,`「${cardName}」：相手全ユニットを次の相手ターン終了まで行動不能`);
      return true;

    // リサイクル（捨て場の鉄ユニット1体を選択して手札に戻す）
    case "RECYCLE_IRON":{
      const ironGraveList=game.graves[p].filter(u=>cards[u.name]?.type==="unit"&&getAttr(u.name)==="steel");
      if(ironGraveList.length===0){socket.emit("message","捨て場に鉄ユニットがいません");return false;}
      // 捨て場の鉄ユニット一覧を送って選択させる
      const graveNames=ironGraveList.map(u=>u.name);
      game.pendingTarget={player:p,effect:"RECYCLE_IRON_SELECT",card:cardName,graveNames};
      socket.emit("selectTarget",{type:"graveSelect",message:"リサイクル：手札に戻す鉄ユニットを選択してください",options:graveNames});
      return "pending";
    }

    // フェニックスリバース（捨て場の最上ユニットを蘇生）
    case "REVIVE_TOP":{
      if(game.board[p].length>=3){socket.emit("message","場が満杯です");return false;}
      // 捨て場の最後のユニットを検索
      let reviveIdx=-1;
      for(let i=game.graves[p].length-1;i>=0;i--){
        if(cards[game.graves[p][i].name]?.type==="unit"){reviveIdx=i;break;}
      }
      if(reviveIdx===-1){socket.emit("message","捨て場にユニットがいません");return false;}
      const revived=game.graves[p].splice(reviveIdx,1)[0];
      const rc=cards[revived.name];
      const unit={name:revived.name,atk:rc.atk,hp:rc.hp,attacked:false,attr:rc.attr||"neutral",damageReduce:rc.effect==="DAMAGE_REDUCE_1"};
      game.board[p].push(unit);
      applyFieldSpellOnSummon(unit, p);
      addLog(p,`「${cardName}」：「${revived.name}」を捨て場から蘇生`);
      triggerSummonEffect(unit,p,socket,io);
      return true;
    }

    // インジェクション（自ライフ-1、対象ATK+3）
    case "L_SELF-1_A+3":
      if(game.board[p].length===0){socket.emit("message","自分の場にユニットがいません");return false;}
      game.life[p]-=1;
      if(game.life[p]<=0){game.winner=op;return true;}
      game.pendingTarget={player:p,effect:"L_SELF-1_A+3",card:cardName};
      addLog(p,`「${cardName}」：自ライフ-1`);
      socket.emit("selectTarget",{type:"myUnit",message:"インジェクション：強化する自分のユニットを選択してください"});
      return "pending";

    // サクリファイス（自ユニット1体破壊→コスト分回復）は既にフェーズ2で実装済み

    // ヴェノムハーベスト（UNIT_DES_COST_LHEALと同じ処理）
    case "UNIT_DES_COST_LHEAL":
      if(game.board[op].length===0){socket.emit("message","対象ユニットがいません");return false;}
      game.pendingTarget={player:p,effect:"UNIT_DES_COST_LHEAL",card:cardName};
      socket.emit("selectTarget",{type:"enemyUnit",message:`「${cardName}」：破壊する相手ユニットを選択してください`});
      return "pending";

    // 解放の光（PURIFY・既にフェーズ2で実装済み、ここでは不要）

    // ギアリペア（UNIT_FULL_HEAL・既にフェーズ2で実装済み）

    // スクラップ&ビルド（鉄1体破壊→コスト3以下鉄ユニット召喚+ATK+1）
    case "SCRAP_BUILD_C3":
      if(game.board[p].filter(u=>getAttr(u.name)==="steel").length===0){
        socket.emit("message","自分の場に鉄ユニットがいません");return false;
      }
      game.pendingTarget={player:p,effect:"SCRAP_BUILD_C3",card:cardName};
      socket.emit("selectTarget",{type:"myUnit",message:"スクラップ&ビルド：破壊する自分の鉄ユニットを選択してください"});
      return "pending";

    // 自爆装置（自鉄ユニット1体破壊→相手ユニット1体破壊）
    case "IRON_DES_UNIT_DES":
      if(game.board[p].filter(u=>getAttr(u.name)==="steel").length===0){
        socket.emit("message","自分の場に鉄ユニットがいません");return false;
      }
      if(game.board[op].length===0){socket.emit("message","相手の場にユニットがいません");return false;}
      game.pendingTarget={player:p,effect:"IRON_DES_UNIT_DES_STEP1",card:cardName};
      socket.emit("selectTarget",{type:"myUnit",message:"自爆装置：破壊する自分の鉄ユニットを選択してください"});
      return "pending";

// フレイムバーン（既にフェーズ2で実装済み）

    // アクアリターン（既にフェーズ2で実装済み）

    // エレキサーキット（自分のユニット1体破壊→コスト2以下手札から召喚）
    case "UNIT_DES_SUM_C2":
      if(game.board[p].length===0){socket.emit("message","自分の場にユニットがいません");return false;}
      game.pendingTarget={player:p,effect:"UNIT_DES_SUM_C2",card:cardName};
      socket.emit("selectTarget",{type:"myUnit",message:"エレキサーキット：破壊する自分のユニットを選択してください"});
      return "pending";    

    // リンカーネーション（自分のユニット1体破壊→コスト3以下手札から召喚）
    case "UNIT_DES_SUM_C3":
      if(game.board[p].length===0){socket.emit("message","自分の場にユニットがいません");return false;}
      game.pendingTarget={player:p,effect:"UNIT_DES_SUM_C3",card:cardName};
      socket.emit("selectTarget",{type:"myUnit",message:"リンカーネーション：破壊する自分のユニットを選択してください"});
      return "pending";

    // オーバーロード（場の鉄ユニット全体ATK+3、ターン終了時全鉄ユニット破壊）
    case "OVERLOAD_A+3_END_DES_ALL":
      { const steels=game.board[p].filter(u=>getAttr(u.name)==="steel");
        if(steels.length===0){socket.emit("message","自分の場に鉄ユニットがいません");return false;}
        steels.forEach(u=>{u.atk+=3;u.overloadMark=true;});
        addLog(p,`「${cardName}」：場の鉄ユニット全体ATK+3（ターン終了時全破壊）`);
      }
      return true;

    // メガギアフュージョン（自分の鉄ユニット2体を選択して破壊→コスト0で手札から鉄召喚）
    case "FUSION_IRON2":
      if(game.board[p].filter(u=>getAttr(u.name)==="steel").length<2){socket.emit("message","自分の場に鉄ユニットが2体以上必要です");return false;}
      game.pendingTarget={player:p,effect:"FUSION_IRON2_STEP1",card:cardName,selected:[]};
      socket.emit("selectTarget",{type:"myUnit",message:"メガギアフュージョン：1体目の鉄ユニットを選択してください"});
      return "pending";

    // シードスポーン（手札のコスト3以下ユニット2体をコスト0で召喚）
    case "SUM_H_C3X2":
      { const validHand=game.hands[p].filter(name=>cards[name]?.type==="unit"&&(cards[name]?.cost||0)<=3);
        if(validHand.length===0){socket.emit("message","手札にコスト3以下のユニットがいません");return false;}
        game.pendingTarget={player:p,effect:"SUM_H_C3X2_STEP1",card:cardName,summonCount:0};
        socket.emit("selectTarget",{type:"handUnit_cost3",message:"シードスポーン：1体目に召喚するコスト3以下のユニットを選択してください"});
      }
      return "pending";

    case "PERM_SPELL_WATER_ENERGY":
    case "PERM_SPELL_HERB_HEAL":
    case "PERM_SPELL_FOREST_BUFF":
    case "PERM_SPELL_IRON_FACTORY":
    case "PERM_SPELL_FIRE_OVERFLOW":
    case "PERM_SPELL_THUNDER_NOREFLECT":
    case "PERM_SPELL_DARK_DEBUFF":{
      if(game.fieldSpell[p]){
        socket.emit("message","すでにフィールドスペルが場にあります");
        return false;
      }
      const dur=cards[cardName]?.durability||5;
      game.fieldSpell[p]={name:cardName,durability:dur};
      addLog(p,`「${cardName}」をフィールドに設置（耐久${dur}）`);
      // 深海の神殿：発動時エネルギー+1、場のユニットATK+1
      if(eff==="PERM_SPELL_WATER_ENERGY"){
        game.maxEnergy[p]=Math.min(10,game.maxEnergy[p]+1);
        game.energy[p]=Math.min(game.maxEnergy[p],game.energy[p]+1);
        addLog(p,`「${cardName}」：エネルギー+1`);
        game.board[p].forEach(u=>{u.atk+=1;});
        addLog(p,`「${cardName}」：場の全ユニットATK+1`);
      }
      // 薬草の湿地：発動時ライフ+3
      if(eff==="PERM_SPELL_HERB_HEAL"){
        game.life[p]+=3;
        addLog(p,`「${cardName}」：ライフ+3`);
      }
      // 世界樹の聖域：即座に場のユニット全体ATK/HP+1
      if(eff==="PERM_SPELL_FOREST_BUFF"){
        game.board[p].forEach(u=>{u.atk+=1;u.hp+=1;});
        addLog(p,`「${cardName}」：場の全ユニットATK/HP+1`);
      }
      // 機甲要塞都市：場のギアトークン全体ATK+1、発動時ギギアトークン召喚
      if(eff==="PERM_SPELL_IRON_FACTORY"){
        game.board[p].forEach(u=>{if(u.name==="ギアトークン"||u.name==="ギアスカウト"||u.name==="プロトタイプユニット"){u.atk+=1;}});
        addLog(p,`「${cardName}」：場のギアトークン・ギアスカウト・プロトタイプユニットATK+1`);
        if(game.board[p].length<3){
          const gigaToken={name:"ギギアトークン",atk:2,hp:2,attacked:false,attr:"steel",isToken:true};
          game.board[p].push(gigaToken);
          applyFieldSpellOnSummon(gigaToken, p);
          addLog(p,`「${cardName}」：ギギアトークンを召喚`);
        }
      }
      // 瘴気の迷宮：相手場の全ユニットATK-1
      if(eff==="PERM_SPELL_DARK_DEBUFF"){
        game.board[op].forEach(u=>{u.atk=Math.max(0,u.atk-1);});
        addLog(p,`「${cardName}」：相手場の全ユニットATK-1`);
      }
      return true;
    }
    case "DES_PERM_SPELL":{
      const hasP=game.fieldSpell[p];
      const hasOp=game.fieldSpell[op];
      if(!hasP&&!hasOp){
        socket.emit("message","場にフィールドスペルがありません");
        return false;
      }
      game.pendingTarget={player:p,effect:"DES_PERM_SPELL",card:cardName};
      socket.emit("selectTarget",{type:"fieldSpell",message:"崩壊：破壊するフィールドスペルを選択してください"});
      return "pending";
    }
    default:
      return false;
  }
}
function addLog(id, msg){
  if(!game.turnLogs[id]) game.turnLogs[id]=[];
  const prefix = id===game.player1 ? "[P1]" : "[P2]";
  const line = prefix+" "+msg;
  game.turnLogs[id].push(line);
  game.allLogs.push(line);
}

function startTurn(p){
  game.turnBuffs[p]={atk:0};

  draw(p,true);
  if(game.maxEnergy[p]===0){
    game.maxEnergy[p]=(p===game.firstPlayer)?1:2;
  }else{
    game.maxEnergy[p]=Math.min(10,game.maxEnergy[p]+2);
  }
  game.energy[p]=game.maxEnergy[p];
  game.board[p].forEach(u=>{
    u.attacked=false;
    u.denkoAttackedThisTurn=false;
    u.rollbackAttack=false; // ★巻き戻し済みフラグをリセット
  });

  // バーンアウト（SUM_BURNOUT）はターン終了時に自壊するため、startTurnでは処理しない

  // （根の呪縛カウントダウンはend_turnで行う）

  // START_TOKEN1（オートマトンファクトリー）
  game.board[p].forEach(u=>{
    const c=cards[u.name];
    if(c && c.effect==="START_TOKEN1"){
      showEffect(u.name);
      summonToken(p,"ギアトークン",1);
    }
  });

  // END_A+1（フォレストビースト）はターン終了時に処理

  // ★フィールドスペル：ターン開始時効果
  const fs=game.fieldSpell[p];
  if(fs){
    const fsEff=cards[fs.name]?.effect||"";
    // 深海の神殿：ターン開始時エネルギー+1
    if(fsEff==="PERM_SPELL_WATER_ENERGY"){
      game.maxEnergy[p]=Math.min(10,game.maxEnergy[p]+1);
      game.energy[p]=Math.min(game.maxEnergy[p],game.energy[p]+1);
      addLog(p,`「${fs.name}」：エネルギー+1`);
    }
    // 薬草の湿地：ターン開始時ライフ+3
    if(fsEff==="PERM_SPELL_HERB_HEAL"){
      game.life[p]+=3;
      addLog(p,`「${fs.name}」：ライフ+3`);
    }
    // 機甲要塞都市：ギギギアトークン召喚
    if(fsEff==="PERM_SPELL_IRON_FACTORY"){
      if(game.board[p].length<3){
        const gigToken={name:"ギギギアトークン",atk:3,hp:3,attacked:false,attr:"steel",isToken:true};
        game.board[p].push(gigToken);
        applyFieldSpellOnSummon(gigToken, p);
        addLog(p,`「${fs.name}」：ギギギアトークンを召喚`);
      }
    }
  }
}

function resetGame(){
  if(!game.player1||!game.player2)return;
  game.board={};game.hands={};game.decks={};
  game.graves={};game.energy={};game.maxEnergy={};
  game.life={};game.winner=null;game.noAttack={};
  game.pendingDiscard={};game.turnBuffs={};game.pendingHandLimitDiscard=null;game.pendingNext=null;game.fieldSpell={};
  game.allLogs=[];game.turnLogs={};game.prevLogs={};

  [game.player1,game.player2].forEach(p=>{
    let deck=game.customDeck[p]||[];
    game.decks[p]=shuffle([...deck]);
    game.hands[p]=[];
    game.graves[p]=[];
    game.board[p]=[];
    game.energy[p]=0;
    game.maxEnergy[p]=0;
    game.life[p]=15;
    game.turnLogs[p]=[];
    game.prevLogs[p]=[];
    game.pendingDiscard[p]=0;
    game.turnBuffs[p]={atk:0};
    for(let i=0;i<5;i++)draw(p);
  });

  const first=Math.random()<0.5?game.player1:game.player2;
  game.turn=first;
  game.firstPlayer=first;
  startTurn(first);
  game.noAttack[first]=true;
}

// ★グロウコア等の破壊時効果通知を送る
function notifyPendingTarget(){
  if(!game.pendingTarget) return;
  const pt=game.pendingTarget;
  if(pt.effect==="DES_SUMMON_C2_HAND"){
    const ownerSocket=io.sockets.sockets.get(pt.player);
    if(ownerSocket){
      ownerSocket.emit("selectTarget",{
        type:"handUnit_cost2",
        message:"グロウコア破壊時効果：コスト2以下のユニットを召喚してください"
      });
    }
  }
  if(pt.effect==="UNIT_DES_SUM_C3_HAND"){
    const ownerSocket=io.sockets.sockets.get(pt.player);
    if(ownerSocket){
      ownerSocket.emit("selectTarget",{
        type:"handUnit_cost3",
        message:"リンカーネーション：召喚するコスト3以下のユニットを手札から選択してください"
      });
    }
  }
}

// ★フィールドスペル破壊処理
function destroyFieldSpell(ownerPlayer){
  const fs=game.fieldSpell[ownerPlayer];
  if(!fs) return;
  const eff=cards[fs.name]?.effect||"";
  // 世界樹の聖域：場のユニットATK/HP-1
  if(eff==="PERM_SPELL_FOREST_BUFF"){
    game.board[ownerPlayer].forEach(u=>{u.atk=Math.max(0,u.atk-1);u.hp=Math.max(1,u.hp-1);});
    addLog(ownerPlayer,`「${fs.name}」破壊：場の全ユニットATK/HP-1`);
  }
  // 深海の神殿：場の全ユニットATK-1（元に戻す）
  if(eff==="PERM_SPELL_WATER_ENERGY"){
    game.board[ownerPlayer].forEach(u=>{u.atk=Math.max(0,u.atk-1);});
    addLog(ownerPlayer,`「${fs.name}」破壊：場の全ユニットATK-1`);
  }
  // 機甲要塞都市：場のギアトークンATK-1
  if(eff==="PERM_SPELL_IRON_FACTORY"){
    game.board[ownerPlayer].forEach(u=>{if(u.name==="ギアトークン"||u.name==="ギアスカウト"||u.name==="プロトタイプユニット"){u.atk=Math.max(0,u.atk-1);}});
    addLog(ownerPlayer,`「${fs.name}」破壊：場のギアトークン・ギアスカウト・プロトタイプユニットATK-1`);
  }
  // 瘴気の迷宮：相手場の全ユニットATK+1（元に戻す）
  if(eff==="PERM_SPELL_DARK_DEBUFF"){
    const opPlayer=getOpponent(ownerPlayer);
    game.board[opPlayer].forEach(u=>{u.atk+=1;});
    addLog(ownerPlayer,`「${fs.name}」破壊：相手場の全ユニットATK+1（元に戻す）`);
  }
  addLog(ownerPlayer,`フィールドスペル「${fs.name}」が破壊されました`);
  delete game.fieldSpell[ownerPlayer];
}

// ★ダメージポップアップ送信
function sendDamagePop(targetPlayerId, amount, isLife, unitIdx){
  // ★重複排除：同じsocket.idに2回送らない
  const sent=new Set();
  [game.player1, game.player2].forEach(id=>{
    if(!id) return;
    if(sent.has(id)) return;
    sent.add(id);
    const s=io.sockets.sockets.get(id);
    if(!s) return;
    const isEnemy=(id!==targetPlayerId);
    s.emit("damagePop",{amount, isLife, unitIdx, isEnemy});
  });
}

// ★反撃ダメージポップアップ送信
// 攻撃者の画面：自分のmyUnitsのattackerUnitIdx番目に表示
// 防御者の画面：相手のenemyUnitsのattackerUnitIdx番目に表示
function sendDamagePopAttacker(attackerPlayerId, amount, attackerUnitIdx){
  // ★重複排除：同じsocket.idに2回送らない
  const sent=new Set();
  [game.player1, game.player2].forEach(id=>{
    if(!id) return;
    if(sent.has(id)) return;
    sent.add(id);
    const s=io.sockets.sockets.get(id);
    if(!s) return;
    const iAmAttacker=(id===attackerPlayerId);
    s.emit("damagePop",{
      amount,
      isLife:false,
      unitIdx:attackerUnitIdx,
      isEnemy:!iAmAttacker,
      isCounter:true
    });
  });
}

// ★効果演出送信
function showEffect(cardName, isSpell){
  [game.player1,game.player2].forEach(id=>{
    if(!id) return;
    const s=io.sockets.sockets.get(id);
    if(s) s.emit("showEffect",{cardName, isSpell:!!isSpell});
  });
}

function send(){
  [game.player1,game.player2].forEach(id=>{
    if(!id)return;
    const s=io.sockets.sockets.get(id);
    if(!s)return;
    const op=getOpponent(id);
    s.emit("update",{
      myBoard:game.board[id],
      enemyBoard:game.board[op],
      myHand:game.hands[id],
      myEnergy:game.energy[id],
      myMaxEnergy:game.maxEnergy[id],
      enemyEnergy:game.energy[op],
      enemyMaxEnergy:game.maxEnergy[op],
      enemyHandCount:game.hands[op].length,
      myDeckCount:game.decks[id].length,
      enemyDeckCount:game.decks[op].length,
      myLife:game.life[id],
      enemyLife:game.life[op],
      myGrave:game.graves[id],
      enemyGrave:game.graves[op],
      turn:game.turn,
      winner:game.winner,
      isWinner:game.winner===id,
      isLoser:game.winner!==null&&game.winner!==id,
      pendingDiscard:game.pendingDiscard[id]||0,
   isSoulTrade:!!(game.pendingTarget&&game.pendingTarget.effect==="SOUL_TRADE_AFTER"&&game.pendingTarget.player===id),
      isHandLimit:game.pendingHandLimitDiscard===id,
      prevEnemyLogs:game.prevLogs[op]||[],
      
currentTurnLogs:game.turnLogs[game.turn]||[],

      myFieldSpell:game.fieldSpell[id]||null,
      enemyFieldSpell:game.fieldSpell[op]||null,
      allLogs:[...game.allLogs]
    });
  });
}

io.on("connection",(socket)=>{

  socket.on("join",(data)=>{
    if(data.player===1)game.player1=socket.id;
    else game.player2=socket.id;
    game.customDeck[socket.id]=data.deck;
  });

  socket.on("action",(data)=>{
    if(!game.player1||!game.player2)return;
    if(data.type==="reset"){resetGame();send();return;}
    if(data.type==="surrender"){
      game.winner=getOpponent(socket.id);
      addLog(socket.id,"降参しました");
      send();
      return;
    }
    if(game.winner)return;
    if(game.winner)return;
    // ★グロウコア等：ターン外プレイヤーからのselect_targetを許可
    if(socket.id!==game.turn){
      if(data.type==="select_target"&&game.pendingTarget&&game.pendingTarget.player===socket.id){
        // ターン外プレイヤーによる対象選択（グロウコア等）→そのまま処理継続
      } else {
        return;
      }
    }

const op=getOpponent(socket.id);

    // ★手札を捨てる処理
    if(data.type==="discard_hand"){
      if((game.pendingDiscard[socket.id]||0)<=0) return;
      const idx=game.hands[socket.id].indexOf(data.card);
      if(idx===-1) return;
      game.hands[socket.id].splice(idx,1);
      game.graves[socket.id].push({name:data.card});
      game.pendingDiscard[socket.id]--;
      addLog(socket.id,`手札から「${data.card}」を捨てました`);
      // ソウルトレードのチェックはsoulTradeモードで処理するためここでは行わない
      // ★手札上限捨て完了チェック
      if(game.pendingHandLimitDiscard===socket.id&&(game.pendingDiscard[socket.id]||0)===0){
        // 手札が7枚以下になったか再確認
        if(game.hands[socket.id].length<=7){
          game.pendingHandLimitDiscard=null;
          game.noAttack[socket.id]=false;
          game.prevLogs[socket.id]=[...(game.turnLogs[socket.id]||[])];
          game.turnLogs[socket.id]=[];
          game.turn=getOpponent(socket.id);
          startTurn(game.turn);
          notifyPendingTarget();
          send();
          return;
        }
      }
      send();
      return;
    }

// ★attack
    if(data.type==="attack"){
      if(game.noAttack[socket.id]){
        socket.emit("message","先攻1ターン目は攻撃できません");
        return;
      }
      const atk=game.board[socket.id][data.a];
      if(!atk)return;
      // ★相手ユニットがいる場合の直接攻撃を防ぐ
      const isDirect=data.t===undefined&&data.target!=="fieldSpell";
      if(isDirect&&game.board[op].length>0){
        socket.emit("message","相手ユニットが場にいる場合、直接攻撃はできません");
        // 攻撃済みフラグを立てない（巻き戻し）
        send();
        return;
      }

      if(atk.disabled){
        socket.emit("message","このユニットは行動不能です");
        return;
      }

      // ★電光石火チェック
      // denko=true かつ denkoUsed=false → 1回目攻撃済み、2回目可能
      // denko=true かつ denkoUsed=true  → 2回目も攻撃済み、不可
      const hasDenko=atk.denko===true;

      if(atk.attacked){
        // 電光石火持ちで、かつ今ターンまだ2回目を使っていなければ許可
        if(hasDenko && !atk.denkoAttackedThisTurn){
          // 2回目攻撃へ続行
        } else {
          socket.emit("message","このユニットはこのターンすでに攻撃済みです");
          return;
        }
      }

      // ★全体攻撃（ALL_ATTACK）チェック
      const atkCard=cards[atk.name];
      const isAllAttack = atkCard && atkCard.effect==="ALL_ATTACK";
      // ★攻撃音（攻撃者の属性で決定）
      const atkAttr=getAttr(atk.name)||"neutral";
      socket.emit("playSound","atk_"+atkAttr);

      if(isAllAttack && game.board[op].length>0){
        // 全ユニットを同時に攻撃
        const isSecondAttackAll = atk.attacked && hasDenko && !atk.denkoAttackedThisTurn;
        const isDenkoFirstAll = hasDenko && !isSecondAttackAll;
        const isDenkoSecondAll = isSecondAttackAll;

        if(isDenkoSecondAll){
          atk.attacked=true;
          atk.denkoAttackedThisTurn=true;
        } else if(isDenkoFirstAll){
          atk.attacked=true;
        } else {
          atk.attacked=true;
        }
        const atkPower = isDenkoSecondAll ? Math.floor(atk.atk/2) : atk.atk;

        let totalCounter=0;
        const toDestroy=[];

        game.board[op].forEach((def,i)=>{
          const actualDmg=def.damageReduce?Math.min(1,atkPower):atkPower;
          const barrierBlocked=def.barrier;
          // バリアはターン終了時まで持続（ここでは消さない）
          const realDmg=barrierBlocked?0:actualDmg;
          def.hp-=realDmg;
          // 反撃（電光石火1回目は反撃なし、ハイボルテージゾーンがある場合も反撃なし）
          const noReflectAll=!!(game.fieldSpell[socket.id]&&cards[game.fieldSpell[socket.id].name]?.effect==="PERM_SPELL_THUNDER_NOREFLECT");
          if(!isDenkoFirstAll&&!noReflectAll){
            const counterDmg=atk.damageReduce?Math.min(1,Math.floor(def.atk/2)):Math.floor(def.atk/2);
            totalCounter+=counterDmg;
          }
          if(def.hp<=0) toDestroy.push(i);
          addLog(socket.id,`「${atk.name}」が「${def.name}」に全体攻撃（${realDmg}ダメージ）`);
        });
        // ★全体攻撃の被弾エフェクト：全ユニットに
        const atkAttrForHit2=getAttr(atk.name)||"neutral";
        const opSock2=io.sockets.sockets.get(op);
        const hitCount=game.board[op].length+toDestroy.length;
        for(let idx=0;idx<hitCount;idx++){
          if(opSock2) opSock2.emit("hitEffect",{targetIdx:idx, attr:atkAttrForHit2});
          socket.emit("hitEffect",{targetIdx:idx, attr:atkAttrForHit2, isEnemy:true});
        }
        

        // 相手ユニット破壊
        toDestroy.reverse().forEach(i=>{
          const dead=game.board[op].splice(i,1)[0];
          if(!dead.isToken) game.graves[op].push(dead);
          addLog(socket.id,`→「${dead.name}」を撃破`);
          triggerDestroyEffect(dead,op);
        });

        // 攻撃者への反撃
        atk.hp-=totalCounter;
        if(totalCounter>0) addLog(socket.id,`「${atk.name}」が反撃${totalCounter}ダメージを受けた`);
        if(atk.hp<=0){
          const atkIdx=game.board[socket.id].indexOf(atk);
          if(atkIdx!==-1){
            game.board[socket.id].splice(atkIdx,1);
            if(!atk.isToken) game.graves[socket.id].push(atk);
            addLog(socket.id,`→「${atk.name}」が倒れた`);
            triggerDestroyEffect(atk,socket.id);
          }
        }
        notifyPendingTarget();
        send();
        return;
      }

      // ★通常攻撃
      // atk.attackedがtrueの場合は電光石火の2回目（チェック済み）
      const isSecondAttack = atk.attacked && hasDenko && !atk.denkoAttackedThisTurn;
      const isDenkoFirst = hasDenko && !isSecondAttack;
      const isDenkoSecond = isSecondAttack;

      if(isDenkoSecond){
        // 2回目完了→このターンは終わり（denkoは消さない）
        atk.attacked=true;
        atk.denkoAttackedThisTurn=true;
      } else if(isDenkoFirst){
        // 1回目完了
        atk.attacked=true;
      } else {
        // 通常
        atk.attacked=true;
      }

　　　// ★フィールドスペルへの攻撃（相手の場にユニットがいない場合も攻撃可能）
      if(data.target==="fieldSpell"&&game.fieldSpell[op]){
        const fs=game.fieldSpell[op];
        const atkPowerFS=isDenkoSecond?Math.floor(atk.atk/2):atk.atk;
        fs.durability-=atkPowerFS;
        if(atkPowerFS>0) sendDamagePop(op, atkPowerFS, false, -2); // -2=フィールドスペル
        addLog(socket.id,`「${atk.name}」がフィールドスペル「${fs.name}」に${atkPowerFS}ダメージ（残耐久${Math.max(0,fs.durability)}）`);
        if(fs.durability<=0){
          destroyFieldSpell(op);
        }
        { const opSockFS=io.sockets.sockets.get(op);
          const atkAttrFS=getAttr(atk.name)||"neutral";
          if(opSockFS) opSockFS.emit("hitEffect",{targetIdx:-1, attr:atkAttrFS, attackerIdx:data.a, hasAttackAnim:true, isFieldSpell:true});
        }
        // ★攻撃時効果
        if(atkCard && atkCard.attackEffect){
          showEffect(atk.name);
          if(atkCard.attackEffect==="L_DMG1"){
            damageLife(op,1);
            addLog(socket.id,`「${atk.name}」攻撃時効果：相手ライフ-1`);
          }
          if(atkCard.attackEffect==="HAN1"){
            if(game.hands[op].length>=3){
              const discarded=discardRandom(op);
              addLog(socket.id,`「${atk.name}」攻撃時効果：相手手札「${discarded||"なし"}」をランダム破棄`);
              const _sh=io.sockets.sockets.get(socket.id);
              if(_sh&&discarded) _sh.emit("message",`相手の手札「${discarded}」が捨て場に送られました`);
            }else{
              addLog(socket.id,`「${atk.name}」攻撃時効果：相手の手札が3枚以下のため不発`);
            }
          }
          if(atkCard.attackEffect==="ATTACK_HEAL_DMG"){
            game.life[socket.id]+=atkPowerFS;
            addLog(socket.id,`「${atk.name}」攻撃時効果：自分ライフ+${atkPowerFS}`);
          }
          if(atkCard.attackEffect==="ALL_UNIT_DMG1"){
            damageAllUnits(op,1,socket.id);
            addLog(socket.id,`「${atk.name}」攻撃時効果：相手全体1ダメージ`);
          }
        }
        // 攻撃済みフラグ
        if(isDenkoSecond){atk.attacked=true;atk.denkoAttackedThisTurn=true;}
        else{atk.attacked=true;}
        notifyPendingTarget();
        send();
        return;
      }

      if(game.board[op].length>0){
        // ★ストームタイタン：攻撃前に全体1ダメ処理
        // rollbackAttackフラグがある場合は2回目攻撃なので攻撃時効果をスキップ
        if(atkCard && atkCard.attackEffect==="ALL_UNIT_DMG1" && !atk.rollbackAttack){
          // ★演出を全体ダメージ処理前に表示
          showEffect(atk.name);
          // ★全体ダメージ処理前に攻撃対象のオブジェクト参照を保存
          const targetBeforeEffect=game.board[op][data.t];
          damageAllUnits(op,1,socket.id);
          addLog(socket.id,`「${atk.name}」攻撃時効果：相手全体1ダメージ`);
          // ★インデックスではなくオブジェクト参照で「まだ場にいるか」を確認
          const stillOnBoard=targetBeforeEffect && game.board[op].includes(targetBeforeEffect);
          if(!stillOnBoard){
            // 攻撃対象が全体ダメージで破壊された→巻き戻し
            addLog(socket.id,`攻撃対象が攻撃時効果で破壊されたため戦闘を巻き戻します`);
            // ★alertではなく専用イベントで通知（alertはselectedUnitIndexを壊す）
            socket.emit("attackRollback",{attackerIndex:data.a});
            atk.rollbackAttack=true; // ★巻き戻し済みフラグ
            if(isDenkoSecond){
              atk.attacked=true;
              atk.denkoAttackedThisTurn=false;
            } else if(isDenkoFirst){
              atk.attacked=false;
            } else {
              atk.attacked=false;
            }
            notifyPendingTarget();
            send();
            return;
          }
        }

        const def=game.board[op][data.t];
        if(!def){ send(); return; }

        const atkPower=isDenkoSecond?Math.floor(atk.atk/2):atk.atk;
        let actualAtkDmg=def.damageReduce?Math.min(1,atkPower):atkPower;
        if(def.barrier){actualAtkDmg=0;} // バリア中はダメージ0（バリアは消さない）
        // 電光石火1回目は反撃なし、ハイボルテージゾーンがある場合も反撃なし
        const noReflect=!!(game.fieldSpell[socket.id]&&cards[game.fieldSpell[socket.id].name]?.effect==="PERM_SPELL_THUNDER_NOREFLECT");
        const counterBase=(isDenkoFirst||noReflect)?0:Math.floor(def.atk/2);
        const actualDefDmg=atk.damageReduce?Math.min(1,counterBase):counterBase;

        def.hp-=actualAtkDmg;
        atk.hp-=actualDefDmg;

        // ★ダメージポップアップ（攻撃ダメージ：防御ユニット上）
        if(actualAtkDmg>0) sendDamagePop(op, actualAtkDmg, false, data.t);
        // ★反撃ダメージ：sendDamagePopAttackerのみで送信（重複なし）
        if(actualDefDmg>0) sendDamagePopAttacker(socket.id, actualDefDmg, data.a);
        addLog(socket.id,`「${atk.name}」で「${def.name}」に攻撃（${actualAtkDmg}ダメージ、反撃${actualDefDmg}ダメージ）`);
        // ★被弾エフェクト：防御側プレイヤーに送信
        { const atkAttrForHit=getAttr(atk.name)||"neutral";
          const opSock=io.sockets.sockets.get(op);
          // ★hitEffectに攻撃者情報も含めて送信
          if(opSock) opSock.emit("hitEffect",{targetIdx:data.t, attr:atkAttrForHit, attackerIdx:data.a, hasAttackAnim:true});
          socket.emit("hitEffect",{targetIdx:data.t, attr:atkAttrForHit, isEnemy:true});
        }

        if(def.hp<=0){
          // ★灼熱地獄：破壊時、自分ATKが相手ATKを超えた分だけ相手ライフにダメージ
          if(game.fieldSpell[socket.id]&&cards[game.fieldSpell[socket.id].name]?.effect==="PERM_SPELL_FIRE_OVERFLOW"){
            const overflow=atkPower-def.atk; // 自分ATK - 相手ATK
            if(overflow>0){
              damageLife(op,overflow);
              addLog(socket.id,`「${game.fieldSpell[socket.id].name}」：自ATK${atkPower}-相手ATK${def.atk}=${overflow}ダメージが相手ライフに`);
            }
          }
          game.board[op].splice(data.t,1);
          if(!def.isToken) game.graves[op].push(def);
          addLog(socket.id,`→「${def.name}」を撃破`);
          triggerDestroyEffect(def,op);
          if(game.pendingTarget&&game.pendingTarget.effect==="DES_SUMMON_C2_HAND"){
            const ownerSocket=io.sockets.sockets.get(game.pendingTarget.player);
            if(ownerSocket){
              ownerSocket.emit("selectTarget",{type:"handUnit_cost2",message:"グロウコア破壊時効果：コスト2以下のユニットを召喚してください"});
              // 相手（現ターンプレイヤー）には待機メッセージを送る
              socket.emit("message","相手がグロウコアの効果でユニットを選択中です...");
            }
          }
        }
        if(atk.hp<=0){
          const atkIdx=game.board[socket.id].indexOf(atk);
          if(atkIdx!==-1){
            game.board[socket.id].splice(atkIdx,1);
            if(!atk.isToken) game.graves[socket.id].push(atk);
            addLog(socket.id,`→「${atk.name}」が反撃で倒れた`);
            triggerDestroyEffect(atk,socket.id);
          }
        }

        // 攻撃時効果（ALL_UNIT_DMG1は上で既にshowEffect済みのためスキップ）
        if(atkCard && atkCard.attackEffect && !atk.rollbackAttack && atkCard.attackEffect!=="ALL_UNIT_DMG1"){
          showEffect(atk.name);
        }
        if(atkCard && atkCard.attackEffect==="L_DMG1"){
          damageLife(op,1);
          addLog(socket.id,`「${atk.name}」攻撃時効果：相手ライフ-1`);
        }
        if(atkCard && atkCard.attackEffect==="HAN1"){
          if(game.hands[op].length>=2){
            const discarded=discardRandom(op);
            addLog(socket.id,`「${atk.name}」攻撃時効果：相手手札「${discarded||"なし"}」をランダム破棄`);
            const _sh=io.sockets.sockets.get(socket.id);
            if(_sh&&discarded) _sh.emit("message",`相手の手札「${discarded}」が捨て場に送られました`);
          }else{
            addLog(socket.id,`「${atk.name}」攻撃時効果：相手の手札が1枚以下のため不発`);
          }
        }
        if(atkCard && atkCard.attackEffect==="ATTACK_HEAL_DMG"){
          game.life[socket.id]+=actualAtkDmg;
          addLog(socket.id,`「${atk.name}」攻撃時効果：自分ライフ+${actualAtkDmg}`);
        }

}else{
        const atkPower=isDenkoSecond?Math.floor(atk.atk/2):atk.atk;
        const dmg=atkPower;
        // ★damageLifeを使う（内部でsendDamagePopを1回だけ送信）
        damageLife(op, dmg);
        addLog(socket.id,`「${atk.name}」でプレイヤーに直接攻撃（${dmg}ダメージ、相手ライフ${game.life[op]}）`);
        { const opSockD=io.sockets.sockets.get(op);
          if(opSockD) opSockD.emit("hitEffect",{targetIdx:-1, attr:getAttr(atk.name)||"neutral", attackerIdx:data.a, hasAttackAnim:true, isDirect:true});
        }
        if(atkCard && atkCard.attackEffect && !atk.rollbackAttack){
          showEffect(atk.name);
        }
        if(atkCard && atkCard.attackEffect==="HAN1"){
          if(game.hands[op].length>=2){
            const discarded=discardRandom(op);
            addLog(socket.id,`「${atk.name}」攻撃時効果：相手手札「${discarded||"なし"}」をランダム破棄`);
            const _sh=io.sockets.sockets.get(socket.id);
            if(_sh&&discarded) _sh.emit("message",`相手の手札「${discarded}」が捨て場に送られました`);
          }else{
            addLog(socket.id,`「${atk.name}」攻撃時効果：相手の手札が1枚以下のため不発`);
          }
        }
        if(atkCard && atkCard.attackEffect==="L_DMG1"){
          damageLife(op,1);
          addLog(socket.id,`「${atk.name}」攻撃時効果：相手ライフ-1`);
        }
        if(atkCard && atkCard.attackEffect==="ATTACK_HEAL_DMG"){
          game.life[socket.id]+=dmg;
          addLog(socket.id,`「${atk.name}」攻撃時効果：自分ライフ+${dmg}`);
        }
      }
      notifyPendingTarget();
      send(); 
      return;
    }
      // ターン終了時効果
      // バーンアウト自爆
      // ★対象選択の結果を受け取る
    if(data.type==="select_target"){
      if(!game.pendingTarget) return;
      if(game.pendingTarget.player!==socket.id) return;

      const pt=game.pendingTarget;
      const p=pt.player;
      const op=getOpponent(p);
      const eff=pt.effect;
      const targetIndex=data.targetIndex;
      const targetSide=data.targetSide; // "my" or "enemy"

      // SCRAP_BUILD_HAND は手札選択なので別処理
      
// ★ソウルトレード手札捨て処理
      if(eff==="SOUL_TRADE_AFTER"){
        const hi=data.handIndex;
        const cardToDiscard=game.hands[p][hi];
        if(cardToDiscard===undefined||cardToDiscard===null){ send(); return; }
        game.hands[p].splice(hi,1);
        game.graves[p].push({name:cardToDiscard});
        addLog(p,`ソウルトレード：「${cardToDiscard}」を捨てました`);
        // 自分1ドロー
        draw(p);
        // 相手ランダム1捨て+1ドロー
        const stOp=getOpponent(p);
        const discardedST=discardRandom(stOp);
        draw(stOp);
        addLog(p,`ソウルトレード：相手「${discardedST||"なし"}」破棄、相手1ドロー`);
        // 使用者に相手が捨てたカードを通知
        const _sts=io.sockets.sockets.get(p);
        if(_sts&&discardedST) _sts.emit("message",`相手の手札「${discardedST}」が捨て場に送られました`);
        game.pendingTarget=null;
        send();
        return;
      }

// ライフ入力系（ヴェノムアルケミスト・ヴェノムロード）
      if(eff==="SUM_L_SELF-X_A+X"||eff==="SUM_L_SELF-X_DRAWX"){
        const amount=data.lifeAmount;
        const maxAmount = eff==="SUM_L_SELF-X_DRAWX" ? Math.min(3, game.life[p]-1) : game.life[p]-1;
        if(!amount||amount<=0||amount>maxAmount){
          const msg = eff==="SUM_L_SELF-X_DRAWX"
            ? `1〜${maxAmount}の範囲で入力してください（現在:${game.life[p]}）`
            : `有効なライフ量を入力してください（1以上かつ現在ライフ未満）`;
          socket.emit("message",msg);
          game.pendingTarget=pt;
          socket.emit("selectTarget",{type:"lifeInput",message:`支払うライフを入力してください（現在:${game.life[p]}）`});
          send();return;
        }
        game.life[p]-=amount;
        if(eff==="SUM_L_SELF-X_A+X"){
          const conv=game.board[p].find(u=>u.name===pt.card);
          if(conv){conv.atk+=amount;}
          addLog(p,`「${pt.card}」：ライフ${amount}を支払い、ATK+${amount}`);
        }else{
          drawN(p,amount);
          addLog(p,`「${pt.card}」：ライフ${amount}を支払い、${amount}枚ドロー`);
        }
        if(game.life[p]<=0) game.winner=op;
        game.pendingTarget=null;
        // ★pendingNextチェック
        if(game.pendingNext){
          const nxt=game.pendingNext;
          game.pendingNext=null;
          game.pendingTarget={player:nxt.player, effect:nxt.effect, card:nxt.card};
          notifyPendingTarget();
        }
        send();return;
      }

      // ★手札インデックス系（targetUnitチェック不要なケース）
      if(eff==="UNIT_DES_SUM_C2_HAND"||eff==="UNIT_DES_SUM_C3_HAND"||eff==="SUM_DES_SUM_C2_HAND"||
         eff==="DES_SUMMON_C2_HAND"||eff==="FUSION_IRON2_HAND"||
         eff==="SUM_H_C3X2_STEP1"||eff==="SUM_H_C3X2_STEP2"){
        const hi=data.handIndex;
        const handCard=game.hands[p][hi];
        const costLimit = (eff==="UNIT_DES_SUM_C2_HAND"||eff==="SUM_DES_SUM_C2_HAND") ? 2 :
                          (eff==="UNIT_DES_SUM_C3_HAND"||eff==="DES_SUMMON_C2_HAND") ? 3 :
                          (eff==="SUM_H_C3X2_STEP1"||eff==="SUM_H_C3X2_STEP2") ? 3 : 999;
        const steelOnly = eff==="FUSION_IRON2_HAND";
        const isSeedSpawn = (eff==="SUM_H_C3X2_STEP1"||eff==="SUM_H_C3X2_STEP2");
        if(!handCard||cards[handCard]?.type!=="unit"||(cards[handCard]?.cost||0)>costLimit||(steelOnly&&getAttr(handCard)!=="steel")){
          const msg=steelOnly?"鉄ユニットを選択してください":`コスト${costLimit}以下のユニットを選択してください`;
          socket.emit("message",msg);
          game.pendingTarget=pt;
          const selectType=isSeedSpawn?"handUnit_cost3":"handUnit";
          const stepNum2=eff==="SUM_H_C3X2_STEP1"?1:2;
          const selectMsg=isSeedSpawn?`${stepNum2}体目：コスト3以下のユニットを選択してください`:msg;
          socket.emit("selectTarget",{type:selectType,message:selectMsg});
          send();return;
        }
        game.hands[p].splice(hi,1);
        const hc=cards[handCard];
        const bonusAtk=pt.fusionBonusAtk||0;
        const bonusHp=pt.fusionBonusHp||0;
        const baseAtk=steelOnly?hc.atk+bonusAtk:hc.atk;
        const baseHp=steelOnly?hc.hp+bonusHp:hc.hp;
        if(game.board[p].length<3){
          const newU={name:handCard,atk:baseAtk,hp:baseHp,attacked:false,
            attr:steelOnly?"steel":(hc.attr||"neutral"),
            damageReduce:hc.effect==="DAMAGE_REDUCE_1"};
          game.board[p].push(newU);
          // ★フィールドスペルによるバフ/デバフ適用（フュージョン以外）
          if(eff!=="FUSION_IRON2_HAND") applyFieldSpellOnSummon(newU, p);
          const label = eff==="FUSION_IRON2_HAND" ? `メガギアフュージョン（ATK+${bonusAtk}/HP+${bonusHp}）` :
                        eff==="DES_SUMMON_C2_HAND" ? `「${pt.card}」破壊時` :
                        (eff==="SUM_H_C3X2_STEP1"||eff==="SUM_H_C3X2_STEP2") ? "シードスポーン" : `「${pt.card}」`;
          addLog(p,`${label}：「${handCard}」を召喚`);
          game.pendingTarget=null;
          triggerSummonEffect(newU,p,socket,io);
          // ★グロウコア召喚完了：ターンプレイヤーの待機メッセージを解除
          if(eff==="DES_SUMMON_C2_HAND"){
            const turnSocket=io.sockets.sockets.get(game.turn);
            if(turnSocket) turnSocket.emit("growCoreResolved");
            if(pt.pendingNext){
              const nxt=pt.pendingNext;
              if(game.pendingTarget){
                game.pendingTarget.pendingNext=nxt;
              } else {
                game.pendingNext=nxt;
              }
            }
          }
          if(eff==="SUM_H_C3X2_STEP1"){
            const valid2=game.hands[p].filter(name=>cards[name]?.type==="unit"&&(cards[name]?.cost||0)<=3);
            if(valid2.length>0&&game.board[p].length<3){
              game.pendingTarget={player:p,effect:"SUM_H_C3X2_STEP2",card:pt.card};
              socket.emit("selectTarget",{type:"handUnit_cost3",message:"2体目：コスト3以下のユニットを選択してください"});
              // ★game.pendingNextがあれば次の効果へ
        if(!game.pendingTarget && game.pendingNext){
          const nxt=game.pendingNext;
          game.pendingNext=null;
          game.pendingTarget={player:nxt.player, effect:nxt.effect, card:nxt.card};
          notifyPendingTarget();
        }
        send();
        return;
      }
          }
        }else{
          game.pendingTarget=null;
        }
        notifyPendingTarget();
        send();
        return;
      }
        
      // ★リサイクル選択（targetUnitチェック不要）
      if(eff==="RECYCLE_IRON_SELECT"){
        const graveIdx=data.graveIndex;
        const graveNames=pt.graveNames||[];
        if(graveIdx===undefined||graveIdx<0||graveIdx>=graveNames.length){
          socket.emit("message","有効なカードを選択してください");
          game.pendingTarget=pt;
          socket.emit("selectTarget",{type:"graveSelect",message:"手札に戻す鉄ユニットを選択してください",options:graveNames});
          send();return;
        }
        const selectedName=graveNames[graveIdx];
        const realIdx=game.graves[p].findIndex(u=>u.name===selectedName);
        if(realIdx===-1){
          socket.emit("message","対象が見つかりません");
          game.pendingTarget=pt;
          socket.emit("selectTarget",{type:"graveSelect",message:"手札に戻す鉄ユニットを選択してください",options:graveNames});
          send();return;
        }
        game.graves[p].splice(realIdx,1);
        game.hands[p].push(selectedName);
        game.pendingTarget=null;
        addLog(p,`「${pt.card}」：「${selectedName}」を手札に回収`);
        send();
        return;
      }

      if(eff==="SCRAP_BUILD_HAND"){
        const hi=data.handIndex;

        const handCard=game.hands[p][hi];
        if(!handCard){ send(); return; }
        if(getAttr(handCard)!=="steel"||(cards[handCard]?.cost||0)>3){
          socket.emit("message","コスト3以下の鉄ユニットを選択してください");
          send(); return;
        }
        game.hands[p].splice(hi,1);
        const sc=cards[handCard];
        const newUnit={name:handCard,atk:(sc.atk||0)+1,hp:sc.hp||0,attacked:false,attr:"steel",damageReduce:sc.effect==="DAMAGE_REDUCE_1"};
        game.board[p].push(newUnit);
        game.pendingTarget=null;
        addLog(p,`ビルド：「${handCard}」をATK+1で召喚`);
        triggerSummonEffect(newUnit,p,socket,io);
        send();
        return;
      }

      const targetBoard = targetSide==="my" ? game.board[p] : game.board[op];
      const targetUnit = targetBoard ? targetBoard[targetIndex] : null;

      if(!targetUnit){
        socket.emit("message","対象が見つかりません");
        return;
      }

      game.pendingTarget=null;

      switch(eff){
        case "UNIT_DMG3":
        case "UNIT_DMG2":{
          const dmg=eff==="UNIT_DMG3"?3:2;
          const actual=targetUnit.damageReduce?Math.min(1,dmg):dmg;
          targetUnit.hp-=actual;
          addLog(p,`「${pt.card}」で「${targetUnit.name}」に${actual}ダメージ`);
          if(targetUnit.hp<=0){
            game.board[op].splice(targetIndex,1);
            if(!targetUnit.isToken) game.graves[op].push(targetUnit);
            addLog(p,`→「${targetUnit.name}」を破壊`);
            triggerDestroyEffect(targetUnit,op);
          }
          if(game.pendingTarget){notifyPendingTarget();if(game.pendingTarget.effect==="DES_SUMMON_C2_HAND")socket.emit("message","相手がグロウコアの効果でユニットを選択中です...");send();return;}
          break;
        }
        case "A_PERM+3":
          targetUnit.atk+=3;
          addLog(p,`「${pt.card}」で「${targetUnit.name}」のATK+3（永続）`);
          break;
        case "A+2_H+1":
          targetUnit.atk+=2; targetUnit.hp+=1;
          addLog(p,`「${pt.card}」で「${targetUnit.name}」のATK+2/HP+1（永続）`);
          break;
        case "A_H_PERM+3":
          targetUnit.atk+=3; targetUnit.hp+=3;
          addLog(p,`「${pt.card}」で「${targetUnit.name}」のATK+3/HP+3（永続）`);
          break;
        case "A_PERM-3":
          targetUnit.atk=Math.max(0,targetUnit.atk-3);
          addLog(p,`「${pt.card}」で「${targetUnit.name}」のATK-3（永続）`);
          break;
        case "DISABLE1":
          targetUnit.disabled=true;
          addLog(p,`「${pt.card}」で「${targetUnit.name}」を行動不能にした`);
          break;
        case "UNIT_DENKOUSEKKA":
          targetUnit.denko=true;
          addLog(p,`「${pt.card}」で「${targetUnit.name}」に電光石火を付与`);
          break;
        case "UNIT_FULL_HEAL":{
          const maxHp=cards[targetUnit.name]?.hp||targetUnit.hp;
          targetUnit.hp=maxHp;
          addLog(p,`「${pt.card}」で「${targetUnit.name}」のHPを全回復`);
          break;
        }
        case "PURIFY":
          targetUnit.disabled=false;
          delete targetUnit.disabledCount;
          targetUnit.barrier=false;
          addLog(p,`「${pt.card}」で「${targetUnit.name}」の特殊状態を解除`);
          break;
        case "CRYSTAL_BARRIER":
          targetUnit.barrier=true;
          addLog(p,`「${pt.card}」で「${targetUnit.name}」にクリスタルバリアを付与`);
          break;
        case "BOUNCE_UNIT":{
          const ownerOfTarget=targetSide==="my"?p:op;
          if(targetUnit.isToken){
            targetBoard.splice(targetIndex,1);
            addLog(p,`「${pt.card}」で「${targetUnit.name}」を消滅`);
          }else{
            targetBoard.splice(targetIndex,1);
            game.hands[ownerOfTarget].push(targetUnit.name);
            addLog(p,`「${pt.card}」で「${targetUnit.name}」を手札に戻した`);
          }
          break;
        }
        case "FLAME_BURN":{
          game.board[p].splice(targetIndex,1);
          game.graves[p].push(targetUnit);
          addLog(p,`「${pt.card}」で「${targetUnit.name}」を破壊`);
          triggerDestroyEffect(targetUnit,p);
          damageLife(op,1);
          addLog(p,`フレイムバーン：相手ライフ-1`);
          break;
        }
        case "AQUA_RETURN":{
          if(getAttr(targetUnit.name)!=="water"){
            socket.emit("message","水属性ユニットを選択してください");
            game.pendingTarget={player:p,effect:eff,card:pt.card};
            socket.emit("selectTarget",{type:"myUnit",message:"アクアリターン：水属性ユニットを選択してください"});
            send(); return;
          }
          game.board[p].splice(targetIndex,1);
          game.hands[p].push(targetUnit.name);
          draw(p);
          addLog(p,`「${pt.card}」で「${targetUnit.name}」を手札に戻し、1枚ドロー`);
          break;
        }
        case "UNIT_DES_DRAW1":{
          game.board[op].splice(targetIndex,1);
          game.graves[op].push(targetUnit);
          addLog(p,`「${pt.card}」で「${targetUnit.name}」を破壊`);
          triggerDestroyEffect(targetUnit,op);
          draw(p);
          addLog(p,`→1枚ドロー`);
          if(game.pendingTarget){notifyPendingTarget();if(game.pendingTarget.effect==="DES_SUMMON_C2_HAND")socket.emit("message","相手がグロウコアの効果でユニットを選択中です...");send();return;}
          break;
        }
        case "UNIT_DES_COST_L_DMG":{
          const cost=cards[targetUnit.name]?.cost||0;
          game.board[op].splice(targetIndex,1);
          game.graves[op].push(targetUnit);
          addLog(p,`「${pt.card}」で「${targetUnit.name}」（コスト${cost}）を破壊`);
          triggerDestroyEffect(targetUnit,op);
          damageLife(op,cost);
          addLog(p,`→相手ライフ-${cost}`);
          if(game.pendingTarget){notifyPendingTarget();if(game.pendingTarget.effect==="DES_SUMMON_C2_HAND")socket.emit("message","相手がグロウコアの効果でユニットを選択中です...");send();return;}
          break;
        }
        case "UNIT_DES_COST_LHEAL":{
          const cost=cards[targetUnit.name]?.cost||0;
          game.board[op].splice(targetIndex,1);
          game.graves[op].push(targetUnit);
          addLog(p,`「${pt.card}」で「${targetUnit.name}」（コスト${cost}）を破壊`);
          triggerDestroyEffect(targetUnit,op);
          game.life[p]+=cost;
          addLog(p,`→自分ライフ+${cost}`);
          if(game.pendingTarget){notifyPendingTarget();if(game.pendingTarget.effect==="DES_SUMMON_C2_HAND")socket.emit("message","相手がグロウコアの効果でユニットを選択中です...");send();return;}
          break;
        }
        case "UNIT_DES_L_HEAL":{
          const cost=cards[targetUnit.name]?.cost||0;
          game.board[p].splice(targetIndex,1);
          game.graves[p].push(targetUnit);
          addLog(p,`「${pt.card}」で「${targetUnit.name}」（コスト${cost}）を破壊`);
          triggerDestroyEffect(targetUnit,p);
          game.life[p]+=cost;
          addLog(p,`→自分ライフ+${cost}`);
          break;
        }
        case "SUM_A_PERM-2":
          targetUnit.atk=Math.max(0,targetUnit.atk-2);
          addLog(p,`「${pt.card}」召喚時効果：「${targetUnit.name}」のATK-2（永続）`);
          if(pt.pendingNext) game.pendingNext=pt.pendingNext;
          break;
        case "SUM_UNIT_A_PERM+1":
          targetUnit.atk+=1;
          addLog(p,`「${pt.card}」召喚時効果：「${targetUnit.name}」のATK+1（永続）`);
          if(pt.pendingNext) game.pendingNext=pt.pendingNext;
          break;
        case "L_SELF-1_A+3":
          targetUnit.atk+=3;
          addLog(p,`「${pt.card}」：「${targetUnit.name}」のATK+3（永続）`);
          break;
        case "SCRAP_BUILD_C3":{
          if(getAttr(targetUnit.name)!=="steel"){
            socket.emit("message","鉄属性ユニットを選択してください");
            game.pendingTarget={player:p,effect:"SCRAP_BUILD_C3",card:pt.card};
            socket.emit("selectTarget",{type:"myUnit",message:"スクラップ&ビルド：鉄ユニットを選択してください"});
            send(); return;
          }
          const validHand=game.hands[p].filter(name=>getAttr(name)==="steel"&&(cards[name]?.cost||0)<=3&&cards[name]?.type==="unit");
          if(validHand.length===0){
            socket.emit("message","手札にコスト3以下の鉄ユニットがいません");
            send(); return;
          }
          game.board[p].splice(targetIndex,1);
          game.graves[p].push(targetUnit);
          addLog(p,`スクラップ：「${targetUnit.name}」を破壊`);
          triggerDestroyEffect(targetUnit,p);
          game.pendingTarget={player:p,effect:"SCRAP_BUILD_HAND",card:pt.card};
          socket.emit("selectTarget",{type:"handUnit_steel_cost3",message:"ビルド：召喚するコスト3以下の鉄ユニットを手札から選択してください"});
          send(); return;
        }
        case "IRON_DES_UNIT_DES_STEP1":{
          if(getAttr(targetUnit.name)!=="steel"){
            socket.emit("message","鉄属性ユニットを選択してください");
            game.pendingTarget={player:p,effect:"IRON_DES_UNIT_DES_STEP1",card:pt.card};
            socket.emit("selectTarget",{type:"myUnit",message:"自爆装置：鉄ユニットを選択してください"});
            send(); return;
          }
          game.board[p].splice(targetIndex,1);
          game.graves[p].push(targetUnit);
          addLog(p,`自爆：「${targetUnit.name}」を破壊`);
          triggerDestroyEffect(targetUnit,p);
          game.pendingTarget={player:p,effect:"IRON_DES_UNIT_DES_STEP2",card:pt.card};
          socket.emit("selectTarget",{type:"enemyUnit",message:"自爆装置：破壊する相手ユニットを選択してください"});
          send(); return;
        }

case "IRON_DES_UNIT_DES_STEP2":{
          game.board[op].splice(targetIndex,1);
          game.graves[op].push(targetUnit);
          addLog(p,`爆発：「${targetUnit.name}」を破壊`);
          triggerDestroyEffect(targetUnit,op);
          break;
        }

        case "SUM_IRON_DES_A+":{
          if(getAttr(targetUnit.name)!=="steel"||targetUnit.name===pt.card){
            socket.emit("message","自分以外の鉄ユニットを選択してください");
            game.pendingTarget={player:p,effect:"SUM_IRON_DES_A+",card:pt.card};
            socket.emit("selectTarget",{type:"myUnit",message:"破壊する鉄ユニットを選択してください"});
            send();return;
          }
          const gainAtk=targetUnit.atk;
          game.board[p].splice(targetIndex,1);
          game.graves[p].push(targetUnit);
          addLog(p,`「${pt.card}」：「${targetUnit.name}」を破壊（ATK${gainAtk}を獲得）`);
          triggerDestroyEffect(targetUnit,p);
          // 召喚済みのギアコンバーターを探してATK加算
          const conv=game.board[p].find(u=>u.name===pt.card);
          if(conv) conv.atk+=gainAtk;
          break;
        }

        case "SUM_TOKEN_DES_UNIT_DMG2":
        case "SUM_TOKEN_DES_UNIT_DMG2_STEP1":{
          // ギアトークン選択→破壊
          if(!targetUnit.isToken||getAttr(targetUnit.name)!=="steel"){
            socket.emit("message","ギアトークンを選択してください");
            game.pendingTarget={player:p,effect:"SUM_TOKEN_DES_UNIT_DMG2",card:pt.card};
            socket.emit("selectTarget",{type:"myUnit",message:"破壊するギアトークンを選択してください"});
            send();return;
          }
          game.board[p].splice(targetIndex,1);
          game.graves[p].push(targetUnit);
          addLog(p,`「${pt.card}」：ギアトークンを破壊`);
          game.pendingTarget={player:p,effect:"SUM_TOKEN_DES_UNIT_DMG2_STEP2",card:pt.card};
          socket.emit("selectTarget",{type:"enemyUnit",message:"2ダメージを与える相手ユニットを選択してください"});
          send();return;
        }

        case "SUM_TOKEN_DES_UNIT_DMG2_STEP2":{
          const actualDmg2=targetUnit.damageReduce?1:2;
          targetUnit.hp-=actualDmg2;
          addLog(p,`「${pt.card}」：「${targetUnit.name}」に${actualDmg2}ダメージ`);
          if(targetUnit.hp<=0){
            game.board[op].splice(targetIndex,1);
            game.graves[op].push(targetUnit);
            addLog(p,`→「${targetUnit.name}」を破壊`);
            triggerDestroyEffect(targetUnit,op);
          }
          break;
        }

        case "SUM_DES_SUM_C2":{
          // ボルトチェンジャー：選択ユニット破壊→手札からコスト2以下召喚
          if(targetUnit.name===pt.card){
            socket.emit("message","自分自身は選択できません");
            game.pendingTarget={player:p,effect:"SUM_DES_SUM_C2",card:pt.card};
            socket.emit("selectTarget",{type:"myUnit",message:"破壊するユニットを選択してください（自分以外）"});
            send();return;
          }
          game.board[p].splice(targetIndex,1);
          game.graves[p].push(targetUnit);
          addLog(p,`「${pt.card}」：「${targetUnit.name}」を破壊`);
          triggerDestroyEffect(targetUnit,p);
          game.pendingTarget={player:p,effect:"SUM_DES_SUM_C2_HAND",card:pt.card};
          socket.emit("selectTarget",{type:"handUnit_cost2",message:"召喚するコスト2以下のユニットを手札から選択してください"});
          send();return;
        }

case "UNIT_DES_SUM_C2":{
          // エレキサーキット：自分のユニット破壊→コスト2以下召喚
          game.board[p].splice(targetIndex,1);
          game.graves[p].push(targetUnit);
          addLog(p,`「${pt.card}」で「${targetUnit.name}」を破壊`);
          triggerDestroyEffect(targetUnit,p);
          game.pendingTarget={player:p,effect:"UNIT_DES_SUM_C2_HAND",card:pt.card};
          socket.emit("selectTarget",{type:"handUnit_cost2",message:"召喚するコスト2以下のユニットを手札から選択してください"});
          send();return;
        }
        case "UNIT_DES_SUM_C3":{
          // リンカーネーション：自分のユニット破壊→コスト3以下召喚
          game.board[p].splice(targetIndex,1);
          game.graves[p].push(targetUnit);
          addLog(p,`「${pt.card}」で「${targetUnit.name}」を破壊`);
          // ★破壊前にリンカーネーションのカード名を保存
          const linkaCard=pt.card;
          triggerDestroyEffect(targetUnit,p);
          // ★triggerDestroyEffectでpendingTarget(DES_SUMMON_C2_HAND)がセットされた場合
          if(game.pendingTarget && game.pendingTarget.effect==="DES_SUMMON_C2_HAND"){
            // グロウコア効果を先に処理し、完了後にリンカーネーション効果を続ける
            game.pendingTarget.pendingNext={effect:"UNIT_DES_SUM_C3_HAND", card:linkaCard, player:p};
            notifyPendingTarget();
            send();return;
          }
          // 破壊時効果なし→そのままリンカーネーション処理
          game.pendingTarget={player:p,effect:"UNIT_DES_SUM_C3_HAND",card:linkaCard};
          notifyPendingTarget();
          send();return;
        }
        

        case "OVERLOAD_A+3_END_DES_ALL":{
          // 場の鉄ユニット全体のATK+3、全体にoverloadMark
          game.board[p].forEach(u=>{
            if(getAttr(u.name)==="steel"){
              u.atk+=3;
              u.overloadMark=true;
            }
          });
          addLog(p,`「${pt.card}」：場の鉄ユニット全体のATK+3（ターン終了時全破壊）`);
          break;
        }

        case "FUSION_IRON2_STEP1":{
          if(getAttr(targetUnit.name)!=="steel"){
            socket.emit("message","鉄ユニットを選択してください");
            game.pendingTarget={player:p,effect:"FUSION_IRON2_STEP1",card:pt.card,selected:[]};
            socket.emit("selectTarget",{type:"myUnit",message:"1体目の鉄ユニットを選択してください"});
            send();return;
          }
          const sel=[targetIndex];
          game.pendingTarget={player:p,effect:"FUSION_IRON2_STEP2",card:pt.card,selected:sel};
          socket.emit("selectTarget",{type:"myUnit",message:"2体目の鉄ユニットを選択してください"});
          send();return;
        }

        case "FUSION_IRON2_STEP2":{
          if(getAttr(targetUnit.name)!=="steel"){
            socket.emit("message","鉄ユニットを選択してください");
            game.pendingTarget={player:p,effect:"FUSION_IRON2_STEP2",card:pt.card,selected:pt.selected};
            socket.emit("selectTarget",{type:"myUnit",message:"2体目の鉄ユニットを選択してください"});
            send();return;
          }
          if(pt.selected.includes(targetIndex)){
            socket.emit("message","同じユニットは選択できません");
            game.pendingTarget={player:p,effect:"FUSION_IRON2_STEP2",card:pt.card,selected:pt.selected};
            socket.emit("selectTarget",{type:"myUnit",message:"別のユニットを選択してください"});
            send();return;
          }
          // 2体のATK/HPを記憶してから破壊
          const idxs=[...pt.selected,targetIndex].sort((a,b)=>b-a);
          let fusionBonusAtk=0;
          let fusionBonusHp=0;
          idxs.forEach(i=>{
            const dead=game.board[p].splice(i,1)[0];
            fusionBonusAtk+=dead.atk;
            fusionBonusHp+=dead.hp;
            game.graves[p].push(dead);
            addLog(p,`フュージョン：「${dead.name}」を破壊（ATK${dead.atk}/HP${dead.hp}）`);
            triggerDestroyEffect(dead,p);
          });
          // 手札から鉄ユニットをコスト0で召喚（ボーナス値を渡す）
          game.pendingTarget={player:p,effect:"FUSION_IRON2_HAND",card:pt.card,fusionBonusAtk,fusionBonusHp};
          socket.emit("selectTarget",{type:"handUnit_steel",message:`召喚する鉄ユニットを手札から選択してください（ATK+${fusionBonusAtk}/HP+${fusionBonusHp}）`});
          send();return;
        }

        case "DES_SUMMON_C2_HAND":{
          // グロウコア破壊時：手札からコスト3以下の森ユニット召喚
          const handCard=game.hands[p][data.handIndex];
          if(!handCard||cards[handCard]?.type!=="unit"||(cards[handCard]?.cost||0)>3||getAttr(handCard)!=="forest"){
            socket.emit("message","コスト3以下の森ユニットを選択してください");
            game.pendingTarget={player:p,effect:"DES_SUMMON_C2_HAND",card:pt.card,pendingNext:pt.pendingNext};
            socket.emit("selectTarget",{type:"handUnit_cost3",message:"コスト3以下の森ユニットを選択してください"});
            send();return;
          }
          game.hands[p].splice(data.handIndex,1);
          const hc=cards[handCard];
          const newU={name:handCard,atk:hc.atk,hp:hc.hp,attacked:false,attr:hc.attr||"neutral",damageReduce:hc.effect==="DAMAGE_REDUCE_1"};
          game.board[p].push(newU);
          // ★フィールドスペルによるバフ/デバフ適用
          applyFieldSpellOnSummon(newU, p);
          addLog(p,`「${pt.card}」破壊時：「${handCard}」を召喚`);
          triggerSummonEffect(newU,p,socket,io);
          if(pt.pendingNext){
            const nxt=pt.pendingNext;
            if(game.pendingTarget){
              // 召喚時効果のpendingTargetにpendingNextを引き継ぐ
              game.pendingTarget.pendingNext=nxt;
            } else {
              // 召喚時効果なし→game.pendingNextに保存してselect_target完了時に実行
              game.pendingNext=nxt;
            }
          } else {
            if(!game.pendingTarget) game.pendingTarget=null;
          }
          send();return;
        }

        case "SUM_DES_SUM_C2_HAND":
        case "UNIT_DES_SUM_C2_HAND":{
          const handCard=game.hands[p][data.handIndex];
          if(!handCard||cards[handCard]?.type!=="unit"||(cards[handCard]?.cost||0)>2){
            socket.emit("message","コスト2以下のユニットを選択してください");
            game.pendingTarget=pt;
            socket.emit("selectTarget",{type:"handUnit_cost2",message:"コスト2以下のユニットを選択してください"});
            send();return;
          }
          game.hands[p].splice(data.handIndex,1);
          const hc=cards[handCard];
          const newU={name:handCard,atk:hc.atk,hp:hc.hp,attacked:false,attr:hc.attr||"neutral",damageReduce:hc.effect==="DAMAGE_REDUCE_1"};
          game.board[p].push(newU);
          applyFieldSpellOnSummon(newU, p);
          addLog(p,`「${pt.card}」：「${handCard}」を召喚`);
          triggerSummonEffect(newU,p,socket,io);
          break;
        }

        case "UNIT_DES_SUM_C3_HAND":{
          const handCard=game.hands[p][data.handIndex];
          if(!handCard||cards[handCard]?.type!=="unit"||(cards[handCard]?.cost||0)>3){
            socket.emit("message","コスト3以下のユニットを選択してください");
            game.pendingTarget=pt;
            socket.emit("selectTarget",{type:"handUnit_cost3",message:"コスト3以下のユニットを選択してください"});
            send();return;
          }
          game.hands[p].splice(data.handIndex,1);
          const hc=cards[handCard];
          const newU={name:handCard,atk:hc.atk,hp:hc.hp,attacked:false,attr:hc.attr||"neutral",damageReduce:hc.effect==="DAMAGE_REDUCE_1"};
          game.board[p].push(newU);
          applyFieldSpellOnSummon(newU, p);
          addLog(p,`「${pt.card}」：「${handCard}」を召喚`);
          triggerSummonEffect(newU,p,socket,io);
          break;
        }


        case "SUM_H_C3X2_STEP1":
        case "SUM_H_C3X2_STEP2":{
          const handCard=game.hands[p][data.handIndex];
          const stepNum=eff==="SUM_H_C3X2_STEP1"?1:2;
          if(!handCard||cards[handCard]?.type!=="unit"||(cards[handCard]?.cost||0)>3||cards[handCard]===undefined){
            socket.emit("message","コスト3以下のユニットを選択してください");
            game.pendingTarget=pt;
            socket.emit("selectTarget",{type:"handUnit_cost3",message:`${stepNum}体目：コスト3以下のユニットを選択してください`});
            send();return;
          }
          game.hands[p].splice(data.handIndex,1);
          const hc=cards[handCard];
          if(game.board[p].length<3){
            const newU={name:handCard,atk:hc.atk,hp:hc.hp,attacked:false,attr:hc.attr||"neutral",damageReduce:hc.effect==="DAMAGE_REDUCE_1"};
            game.board[p].push(newU);
            applyFieldSpellOnSummon(newU, p);
            addLog(p,`シードスポーン：「${handCard}」を召喚`);
            triggerSummonEffect(newU,p,socket,io);
          }
          if(stepNum===1){
            const validHand2=game.hands[p].filter(name=>cards[name]?.type==="unit"&&(cards[name]?.cost||0)<=3);
            if(validHand2.length>0&&game.board[p].length<3){
              game.pendingTarget={player:p,effect:"SUM_H_C3X2_STEP2",card:pt.card};
              socket.emit("selectTarget",{type:"handUnit_cost3",message:"2体目：コスト3以下のユニットを選択してください"});
              send();return;
            }
          }
          break;
        }
      
        case "DES_PERM_SPELL":{
          const target=data.fieldSpellTarget;
          const targetPlayer=target==="my"?p:op;
          if(!game.fieldSpell[targetPlayer]){
            socket.emit("message","対象のフィールドスペルがありません");
            game.pendingTarget=pt;
            socket.emit("selectTarget",{type:"fieldSpell",message:"崩壊：破壊するフィールドスペルを選択してください"});
            send();return;
          }
          destroyFieldSpell(targetPlayer);
          game.pendingTarget=null;
          break;
        }
        default:
          break;
      }

      // ★pendingTargetにpendingNextが残っていればgame.pendingNextに移す
      if(!game.pendingTarget && game.pendingNext){
        const nxt=game.pendingNext;
        game.pendingNext=null;
        game.pendingTarget={player:nxt.player, effect:nxt.effect, card:nxt.card};
        notifyPendingTarget();
      }
      send();
      return;
    } // if(data.type==="select_target") 終了

    // ★play_card
    if(data.type==="play_card"){
      const c=cards[data.card];
      if(game.energy[socket.id]<c.cost){
        socket.emit("message","エネルギーが不足しています");
        return;
      }
      if(c.type==="unit"&&game.board[socket.id].length>=3){
        socket.emit("message","場に出せるユニットは3体までです");
        return;
      }
      game.energy[socket.id]-=c.cost;
      const idx=game.hands[socket.id].indexOf(data.card);
      game.hands[socket.id].splice(idx,1);
      if(c.type==="unit"){
        const unit={
          name:data.card,
          atk:c.atk,
          hp:c.hp,
          attacked:false,
          attr:c.attr||"neutral",
          damageReduce:c.effect==="DAMAGE_REDUCE_1"
        };
        game.board[socket.id].push(unit);
        addLog(socket.id,`「${data.card}」を召喚（ATK${unit.atk}/HP${unit.hp}）`);
        // ★フィールドスペルによるバフ/デバフ適用
        applyFieldSpellOnSummon(unit, socket.id);
        // ★演出はtriggerSummonEffect内で行う（効果がある場合のみ）
        triggerSummonEffect(unit,socket.id,socket,io);
      }else{
        const handled=processSpellEffect(data.card,socket.id,socket);
        if(handled===false){
          // 不発（対象なし等）：コスト返還・手札に戻す（ログなし・演出なし）
          game.energy[socket.id]+=c.cost;
          game.hands[socket.id].push(data.card);
        }else{
          // 発動成功（trueまたは"pending"）→ここでログと演出
          addLog(socket.id,`スペル「${data.card}」を使用`);
          showEffect(data.card, true);
          // ★フィールドスペルは場に残るため捨て場に送らない
          if(c.effect!=="PERM_SPELL_WATER_ENERGY"&&c.effect!=="PERM_SPELL_HERB_HEAL"&&
             c.effect!=="PERM_SPELL_FOREST_BUFF"&&c.effect!=="PERM_SPELL_IRON_FACTORY"&&
             c.effect!=="PERM_SPELL_FIRE_OVERFLOW"&&c.effect!=="PERM_SPELL_THUNDER_NOREFLECT"&&
             c.effect!=="PERM_SPELL_DARK_DEBUFF"){
            game.graves[socket.id].push({name:data.card});
          }
        }
      }
      notifyPendingTarget();
      send();
      return;
    }


// ★end_turn
    if(data.type==="end_turn"){
      // オーバーロード：overloadMarkがある場合、全鉄ユニット破壊

// ★ターンバフをターン終了時に即リセット（startTurnでも行うが二重実行は問題なし）
      if(game.turnBuffs[socket.id]&&game.turnBuffs[socket.id].atk>0){
        game.board[socket.id].forEach(u=>u.atk-=game.turnBuffs[socket.id].atk);
        game.turnBuffs[socket.id].atk=0;
      }

      if(game.board[socket.id].some(u=>u.overloadMark)){
        const allSteel=[...game.board[socket.id].filter(u=>getAttr(u.name)==="steel")];
        allSteel.forEach(u=>{
          const i=game.board[socket.id].indexOf(u);
          if(i!==-1){
            game.board[socket.id].splice(i,1);
            game.graves[socket.id].push(u);
            addLog(socket.id,`オーバーロード：「${u.name}」を破壊`);
            triggerDestroyEffect(u,socket.id);
          }
        });
      }

// ★根の呪縛カウンターのカウントダウン（自分のターン終了時に自分の場を減らす）
      // 呪縛された側が自分でend_turnしたとき解除される
      game.board[socket.id].forEach(u=>{
        if(u.disabledCount!==undefined && u.disabledCount>0){
          u.disabledCount--;
          if(u.disabledCount<=0){
            u.disabled=false;
            delete u.disabledCount;
          }
        }
      });


// ★クリスタルバリア：相手（次のターンプレイヤー）のバリアはターン開始時まで維持
      // 自分のターン終了時に「相手のバリア」を消去するのではなく
      // 相手のターン終了時（次のend_turn時）に相手自身のバリアを消去する
      // → 変更：自分自身のbarrier（このターン相手から攻撃された分）を次ターン開始前に消去
      // 正しい動作：バリアはそのターン中ずっと有効、ターン終了時に消去
      // 「使用した次の相手ターン終了時」= 相手がend_turnした時に相手の場のバリアを消去
      // つまり op の board のバリアを消去する
      game.board[op].forEach(u=>{if(u.barrier)u.barrier=false;});
      const burnouts=game.board[socket.id].filter(u=>u.burnout);
      burnouts.forEach(u=>{
        const i=game.board[socket.id].indexOf(u);
        game.board[socket.id].splice(i,1);
        if(!u.isToken) game.graves[socket.id].push(u);
        triggerDestroyEffect(u,socket.id);
      });
      // END_A+1（フォレストビースト）
      game.board[socket.id].forEach(u=>{
        const c=cards[u.name];
        if(c && c.effect==="END_A+1"){
          showEffect(u.name);
          u.atk+=1;
        }
      });

      // ★手札上限チェック（7枚超えなら捨て処理）
      const handLimit=7;
      if(game.hands[socket.id].length>handLimit){
        const excess=game.hands[socket.id].length-handLimit;
        game.pendingDiscard[socket.id]=(game.pendingDiscard[socket.id]||0)+excess;
        game.pendingHandLimitDiscard=socket.id; // 手札上限捨て待ちフラグ
        const s=io.sockets.sockets.get(socket.id);
        if(s) s.emit("message",`手札が${handLimit}枚を超えています。${excess}枚捨ててください`);
        notifyPendingTarget();
        send();
        return; // ターン終了を保留
      }
      game.pendingHandLimitDiscard=null;

　　　// ★猛毒の沼地：相手ターン終了時に全ユニット1ダメージ
      const fsOp=game.fieldSpell[op];
      if(fsOp&&cards[fsOp.name]?.effect==="PERM_SPELL_POISON_DMG1"){
        damageAllUnits(socket.id,1,socket.id);
        damageAllUnits(op,1,socket.id);
        addLog(socket.id,`「${fsOp.name}」：お互いの全ユニットに1ダメージ`);
      }

      game.noAttack[socket.id]=false;
      game.prevLogs[socket.id]=[...(game.turnLogs[socket.id]||[])];
      game.turnLogs[socket.id]=[];
      game.turn=getOpponent(socket.id);
      startTurn(game.turn);
      notifyPendingTarget();
      send();
      return;
    }
  });
});

// ===== ルーム対戦 =====
const rooms={};
const usedSpectateIds=new Set(); // 使用中の観戦IDを全ルーム横断で管理

function generateSpectateId(){
  let id;
  do{
    id=String(Math.floor(1000+Math.random()*9000));
  }while(usedSpectateIds.has(id));
  usedSpectateIds.add(id);
  return id;
}

function getRoomBySpectateId(sid){
  return Object.values(rooms).find(r=>r.spectateId===sid)||null;
}

function roomGetOpponent(room, id){
  return id===room.player1 ? room.player2 : room.player1;
}

function roomGetAttr(cardName){
  if(cardName==="ギアトークン") return "steel";
  if(cardName==="ギギアトークン") return "steel";
  if(cardName==="ギギギアトークン") return "steel";
  if(cardName==="シードトークン") return "forest";
  return cards[cardName]?.attr||"neutral";
}

function roomDraw(room, p, isTurnStart){
  if(room.decks[p].length===0){
    if(isTurnStart) room.winner=roomGetOpponent(room,p);
    return;
  }
  room.hands[p].push(room.decks[p].shift());
}
function roomDrawN(room, p, n){ for(let i=0;i<n;i++) roomDraw(room,p); }

function roomDiscardRandom(room, p){
  if(room.hands[p].length===0) return null;
  const idx=Math.floor(Math.random()*room.hands[p].length);
  const card=room.hands[p][idx];
  room.hands[p].splice(idx,1);
  room.graves[p].push({name:card});
  return card;
}

function roomDiscardAll(room, p){
  const d=[...room.hands[p]];
  d.forEach(c=>room.graves[p].push({name:c}));
  room.hands[p]=[];
  return d;
}

function roomAddLog(room, id, msg){
  if(!room.turnLogs[id]) room.turnLogs[id]=[];
  const prefix=id===room.player1?"[P1]":"[P2]";
  const line=prefix+" "+msg;
  room.turnLogs[id].push(line);
  room.allLogs.push(line);
}

function roomShowEffect(room, cardName, isSpell){
  roomSendAll(room, "showEffect", {cardName, isSpell:!!isSpell});
}

function roomDamageLife(room, p, amount){
  room.life[p]-=amount;
  if(room.life[p]<=0) room.winner=roomGetOpponent(room,p);
  if(amount>0) roomSendDamagePop(room, p, amount, true, -1);
}

function roomSendDamagePop(room, targetPlayerId, amount, isLife, unitIdx){
  const sent=new Set();
  [room.player1, room.player2].forEach(id=>{
    if(!id||sent.has(id)) return;
    sent.add(id);
    const s=io.sockets.sockets.get(id);
    if(!s) return;
    s.emit("damagePop",{amount,isLife,unitIdx,isEnemy:id!==targetPlayerId});
  });
  // 観戦者にも送信
  (room.spectators||[]).forEach(sid=>{
    const s=io.sockets.sockets.get(sid);
    if(s) s.emit("damagePop",{amount,isLife,unitIdx,isEnemy:true});
  });
}

function roomSendDamagePopAttacker(room, attackerPlayerId, amount, attackerUnitIdx){
  const sent=new Set();
  [room.player1, room.player2].forEach(id=>{
    if(!id||sent.has(id)) return;
    sent.add(id);
    const s=io.sockets.sockets.get(id);
    if(!s) return;
    s.emit("damagePop",{amount,isLife:false,unitIdx:attackerUnitIdx,isEnemy:id!==attackerPlayerId,isCounter:true});
  });
}

function roomSendAll(room, event, data){
  [room.player1, room.player2].forEach(id=>{
    if(!id) return;
    const s=io.sockets.sockets.get(id);
    if(s) s.emit(event, data);
  });
  (room.spectators||[]).forEach(sid=>{
    const s=io.sockets.sockets.get(sid);
    if(s) s.emit(event, data);
  });
}

function roomSend(room){
  [room.player1, room.player2].forEach(id=>{
    if(!id) return;
    const s=io.sockets.sockets.get(id);
    if(!s) return;
    const op=roomGetOpponent(room,id);
    s.emit("roomUpdate",{
      myBoard:room.board[id],
      enemyBoard:room.board[op],
      myHand:room.hands[id],
      myEnergy:room.energy[id],
      myMaxEnergy:room.maxEnergy[id],
      enemyEnergy:room.energy[op],
      enemyMaxEnergy:room.maxEnergy[op],
      enemyHandCount:room.hands[op].length,
      myDeckCount:room.decks[id].length,
      enemyDeckCount:room.decks[op].length,
      myLife:room.life[id],
      enemyLife:room.life[op],
      myGrave:room.graves[id],
      enemyGrave:room.graves[op],
      turn:room.turn,
      winner:room.winner,
      pendingDiscard:room.pendingDiscard[id]||0,
      isSoulTrade:!!(room.pendingTarget&&room.pendingTarget.effect==="SOUL_TRADE_AFTER"&&room.pendingTarget.player===id),
      isHandLimit:room.pendingHandLimitDiscard===id,
      myFieldSpell:room.fieldSpell[id]||null,
      enemyFieldSpell:room.fieldSpell[op]||null,
      allLogs:[...room.allLogs],
      currentTurnLogs:room.turnLogs[room.turn]||[],
      playerRole:id===room.player1?"p1":"p2",
      roomId:room.roomId,
      spectateId:room.spectateId
    });
  });
  // 観戦者送信（手札は枚数のみ）
  (room.spectators||[]).forEach(sid=>{
    const s=io.sockets.sockets.get(sid);
    if(!s) return;
    s.emit("roomUpdate",{
      myBoard:room.board[room.player1],
      enemyBoard:room.board[room.player2],
      myHand:[],
      myHandCount:room.hands[room.player1].length,
      myEnergy:room.energy[room.player1],
      myMaxEnergy:room.maxEnergy[room.player1],
      enemyEnergy:room.energy[room.player2],
      enemyMaxEnergy:room.maxEnergy[room.player2],
      enemyHandCount:room.hands[room.player2].length,
      myDeckCount:room.decks[room.player1].length,
      enemyDeckCount:room.decks[room.player2].length,
      myLife:room.life[room.player1],
      enemyLife:room.life[room.player2],
      myGrave:room.graves[room.player1],
      enemyGrave:room.graves[room.player2],
      turn:room.turn,
      winner:room.winner,
      myFieldSpell:room.fieldSpell[room.player1]||null,
      enemyFieldSpell:room.fieldSpell[room.player2]||null,
      allLogs:[...room.allLogs],
      currentTurnLogs:room.turnLogs[room.turn]||[],
      playerRole:"spectator",
      roomId:room.roomId,
      spectateId:room.spectateId
    });
  });
}

function roomNotifyPendingTarget(room){
  if(!room.pendingTarget) return;
  const pt=room.pendingTarget;
  if(pt.effect==="DES_SUMMON_C2_HAND"){
    const s=io.sockets.sockets.get(pt.player);
    if(s) s.emit("selectTarget",{type:"handUnit_cost2",message:"グロウコア破壊時効果：コスト2以下のユニットを召喚してください"});
  }
  if(pt.effect==="UNIT_DES_SUM_C3_HAND"){
    const s=io.sockets.sockets.get(pt.player);
    if(s) s.emit("selectTarget",{type:"handUnit_cost3",message:"リンカーネーション：召喚するコスト3以下のユニットを手札から選択してください"});
  }
}

function roomSummonToken(room, p, tokenName, n){
  for(let i=0;i<n;i++){
    if(room.board[p].length>=3) break;
    const tokenAttr=tokenName==="ギアトークン"?"steel":"forest";
    let tokenAtk=1, tokenHp=1;
    if(tokenName==="ギアトークン"&&room.fieldSpell[p]&&cards[room.fieldSpell[p].name]?.effect==="PERM_SPELL_IRON_FACTORY") tokenAtk+=1;
    const newToken={name:tokenName,atk:tokenAtk,hp:tokenHp,attacked:false,attr:tokenAttr,isToken:true};
    room.board[p].push(newToken);
    roomApplyFieldSpellOnSummon(room,newToken,p);
  }
}

function roomApplyFieldSpellOnSummon(room, unit, ownerPlayer){
  const op=roomGetOpponent(room,ownerPlayer);
  if(room.fieldSpell[ownerPlayer]&&cards[room.fieldSpell[ownerPlayer].name]?.effect==="PERM_SPELL_FOREST_BUFF"){unit.atk+=1;unit.hp+=1;}
  if(room.fieldSpell[ownerPlayer]&&cards[room.fieldSpell[ownerPlayer].name]?.effect==="PERM_SPELL_WATER_ENERGY"){unit.atk+=1;}
  if(room.fieldSpell[ownerPlayer]&&cards[room.fieldSpell[ownerPlayer].name]?.effect==="PERM_SPELL_IRON_FACTORY"){
    if(unit.name==="ギアスカウト"||unit.name==="プロトタイプユニット") unit.atk+=1;
  }
  if(room.fieldSpell[op]&&cards[room.fieldSpell[op].name]?.effect==="PERM_SPELL_DARK_DEBUFF"){unit.atk=Math.max(0,unit.atk-1);}
}

function roomDestroyFieldSpell(room, ownerPlayer){
  const fs=room.fieldSpell[ownerPlayer];
  if(!fs) return;
  const eff=cards[fs.name]?.effect||"";
  if(eff==="PERM_SPELL_FOREST_BUFF"){room.board[ownerPlayer].forEach(u=>{u.atk=Math.max(0,u.atk-1);u.hp=Math.max(1,u.hp-1);});roomAddLog(room,ownerPlayer,`「${fs.name}」破壊：場の全ユニットATK/HP-1`);}
  if(eff==="PERM_SPELL_WATER_ENERGY"){room.board[ownerPlayer].forEach(u=>{u.atk=Math.max(0,u.atk-1);});roomAddLog(room,ownerPlayer,`「${fs.name}」破壊：場の全ユニットATK-1`);}
  if(eff==="PERM_SPELL_IRON_FACTORY"){room.board[ownerPlayer].forEach(u=>{if(u.name==="ギアトークン"||u.name==="ギアスカウト"||u.name==="プロトタイプユニット"){u.atk=Math.max(0,u.atk-1);}});roomAddLog(room,ownerPlayer,`「${fs.name}」破壊：場のギアトークン等ATK-1`);}
  if(eff==="PERM_SPELL_DARK_DEBUFF"){const op=roomGetOpponent(room,ownerPlayer);room.board[op].forEach(u=>{u.atk+=1;});roomAddLog(room,ownerPlayer,`「${fs.name}」破壊：相手場ATK+1`);}
  roomAddLog(room,ownerPlayer,`フィールドスペル「${fs.name}」が破壊されました`);
  delete room.fieldSpell[ownerPlayer];
}

function roomDamageAllUnits(room, targetPlayer, amount, attackerPlayer){
  const toDestroy=[];
  room.board[targetPlayer].forEach((u,i)=>{
    const dmg=u.damageReduce?Math.min(1,amount):amount;
    u.hp-=dmg;
    if(dmg>0) roomSendDamagePop(room,targetPlayer,dmg,false,i);
    if(u.hp<=0) toDestroy.push(i);
  });
  toDestroy.reverse().forEach(i=>{
    const dead=room.board[targetPlayer][i];
    room.board[targetPlayer].splice(i,1);
    if(!dead.isToken) room.graves[targetPlayer].push(dead);
    roomTriggerDestroyEffect(room,dead,targetPlayer);
  });
}

function roomTriggerDestroyEffect(room, unit, ownerPlayer){
  const c=cards[unit.name];
  if(!c||!c.destroyEffect) return;
  const op=roomGetOpponent(room,ownerPlayer);
  roomShowEffect(room,unit.name);
  const lp=room.turn||ownerPlayer;
  switch(c.destroyEffect){
    case "L_DMG1": roomDamageLife(room,op,1); roomAddLog(room,lp,`「${unit.name}」破壊時：相手ライフ-1`); break;
    case "L_DMG3": roomDamageLife(room,op,3); roomAddLog(room,lp,`「${unit.name}」破壊時：相手ライフ-3`); break;
    case "DRAW1": roomDraw(room,ownerPlayer); roomAddLog(room,lp,`「${unit.name}」破壊時：1枚ドロー`); break;
    case "TOKEN2": roomSummonToken(room,ownerPlayer,"ギアトークン",2); roomAddLog(room,lp,`「${unit.name}」破壊時：ギアトークン2体召喚`); break;
    case "DES_ALL_UNIT_DMG1": roomDamageAllUnits(room,op,1,ownerPlayer); roomAddLog(room,lp,`「${unit.name}」破壊時：相手全体1ダメージ`); break;
    case "DES_BOTH_DISC1":{
      const d1=roomDiscardRandom(room,ownerPlayer);
      const d2=roomDiscardRandom(room,op);
      roomAddLog(room,lp,`「${unit.name}」破壊時：両者手札1枚破棄`);
      const so=io.sockets.sockets.get(ownerPlayer); if(so&&d2) so.emit("message",`相手の手札「${d2}」が捨て場に送られました`);
      const sop=io.sockets.sockets.get(op); if(sop&&d1) sop.emit("message",`あなたの手札「${d1}」が捨て場に送られました`);
      break;
    }
    case "DES_SUMMON_C3":
      if(room.board[ownerPlayer].length<3){
        const vh=room.hands[ownerPlayer].filter(name=>cards[name]?.type==="unit"&&(cards[name]?.cost||0)<=3&&roomGetAttr(name)==="forest");
        if(vh.length>0){ room.pendingTarget={player:ownerPlayer,effect:"DES_SUMMON_C2_HAND",card:unit.name}; roomAddLog(room,lp,`「${unit.name}」破壊時：森ユニット召喚可能`); }
      }
      break;
  }
}

function roomTriggerSummonEffect(room, unit, p, socket){
  const c=cards[unit.name];
  if(!c||!c.effect) return;
  const op=roomGetOpponent(room,p);
  const eff=c.effect;
  const silent=["DAMAGE_REDUCE_1","END_A+1","START_TOKEN1","DES_SUMMON_C2","DENKOUSEKKA","ALL_ATTACK"];
  if(!silent.includes(eff)) roomShowEffect(room,unit.name);
  switch(eff){
    case "SUM_L_DMG1": roomDamageLife(room,op,1); roomAddLog(room,p,`「${unit.name}」召喚時：相手ライフ-1`); break;
    case "SUM_L+1": room.life[p]+=1; roomAddLog(room,p,`「${unit.name}」召喚時：自分ライフ+1`); break;
    case "SUM_E+1": room.maxEnergy[p]=Math.min(10,room.maxEnergy[p]+1);room.energy[p]=Math.min(room.maxEnergy[p],room.energy[p]+1); roomAddLog(room,p,`「${unit.name}」召喚時：エネルギー+1`); break;
    case "SUM_DRAW1": roomDraw(room,p); roomAddLog(room,p,`「${unit.name}」召喚時：1枚ドロー`); break;
    case "SUM_L_SELF-2": room.life[p]-=2; if(room.life[p]<=0)room.winner=op; roomAddLog(room,p,`「${unit.name}」召喚時：自分ライフ-2`); break;
    case "SUM_R_HAN1":{ const d=roomDiscardRandom(room,op); roomAddLog(room,p,`「${unit.name}」召喚時：相手手札「${d||"なし"}」破棄`); const s=io.sockets.sockets.get(p); if(s&&d) s.emit("message",`相手の手札「${d}」が捨て場に送られました`); break; }
    case "SUM_OPP_E-1": room.maxEnergy[op]=Math.max(0,room.maxEnergy[op]-1);room.energy[op]=Math.min(room.energy[op],room.maxEnergy[op]); roomAddLog(room,p,`「${unit.name}」召喚時：相手エネルギー-1`); break;
    case "SUM_ALL_UNIT_DMG1": roomDamageAllUnits(room,op,1,p); roomAddLog(room,p,`「${unit.name}」召喚時：相手全体1ダメージ`); break;
    case "SUM_DES_COST1_ALL":{ const td=[]; room.board[op].forEach((u,i)=>{if((cards[u.name]?.cost||0)<=1)td.push(i);}); td.reverse().forEach(i=>{const d=room.board[op].splice(i,1)[0];room.graves[op].push(d);roomTriggerDestroyEffect(room,d,op);}); roomAddLog(room,p,`「${unit.name}」召喚時：相手コスト1以下全破壊`); break; }
    case "SUM_TOKEN1": roomSummonToken(room,p,"ギアトークン",1); roomAddLog(room,p,`「${unit.name}」召喚時：ギアトークン1体召喚`); break;
    case "SUM_BURNOUT": unit.burnout=true; roomAddLog(room,p,`「${unit.name}」召喚時：ターン終了時自壊`); break;
    case "SUM_LIFE_8_A+4": if(room.life[p]<=8){unit.atk+=4;roomAddLog(room,p,`「${unit.name}」召喚時：ライフ8以下のためATK+4`);} break;
    case "SUM_A_H_LOST_LIFE":{ const lost=15-room.life[p]; unit.atk=lost;unit.hp=lost; roomAddLog(room,p,`「${unit.name}」召喚時：ATK/HP=${lost}`); break; }
    case "SUM_IRON_COUNT_X3_A":{ const ic=room.board[p].filter(u=>roomGetAttr(u.name)==="steel").length; unit.atk=ic*3; roomAddLog(room,p,`「${unit.name}」召喚時：ATK=${unit.atk}`); break; }
    case "FIELD_A+1_F": room.board[p].forEach(u=>{if(roomGetAttr(u.name)==="fire")u.atk+=1;}); roomAddLog(room,p,`「${unit.name}」：火属性ATK+1`); break;
    case "FIELD_A+1_L": room.board[p].forEach(u=>{if(roomGetAttr(u.name)==="thunder")u.atk+=1;}); roomAddLog(room,p,`「${unit.name}」：雷属性ATK+1`); break;
    case "FIELD_H+2_D": room.board[p].forEach(u=>{if(roomGetAttr(u.name)==="dark")u.hp+=2;}); roomAddLog(room,p,`「${unit.name}」：闇属性HP+2`); break;
    case "FIELD_A+1_P": room.board[p].forEach(u=>{if(roomGetAttr(u.name)==="poison")u.atk+=1;}); roomAddLog(room,p,`「${unit.name}」：毒属性ATK+1`); break;
    case "FIELD_A+1_S": room.board[p].forEach(u=>{if(roomGetAttr(u.name)==="steel")u.atk+=1;}); roomAddLog(room,p,`「${unit.name}」：鉄属性ATK+1`); break;
    case "FIELD_H+2_W": room.board[p].forEach(u=>{if(roomGetAttr(u.name)==="water")u.hp+=2;}); roomAddLog(room,p,`「${unit.name}」：水属性HP+2`); break;
    case "FIELD_H+1_M": room.board[p].forEach(u=>{if(roomGetAttr(u.name)==="forest")u.hp+=1;}); roomAddLog(room,p,`「${unit.name}」：森属性HP+1`); break;
    case "SUM_A_PERM-2":
      if(room.board[op].length===0) break;
      room.pendingTarget={player:p,effect:"SUM_A_PERM-2",card:unit.name};
      socket.emit("selectTarget",{type:"enemyUnit",message:`「${unit.name}」召喚時：ATK-2する相手ユニットを選択`});
      break;
    case "SUM_UNIT_A_PERM+1":
      if(room.board[p].length===0) break;
      room.pendingTarget={player:p,effect:"SUM_UNIT_A_PERM+1",card:unit.name};
      socket.emit("selectTarget",{type:"myUnit",message:`「${unit.name}」召喚時：ATK+1する味方ユニットを選択`});
      break;
    case "SUM_IRON_DES_A+":{ const iu=room.board[p].filter(u=>roomGetAttr(u.name)==="steel"&&u.name!==unit.name); if(iu.length===0){roomAddLog(room,p,`「${unit.name}」召喚時：対象なし`);break;} room.pendingTarget={player:p,effect:"SUM_IRON_DES_A+",card:unit.name}; socket.emit("selectTarget",{type:"myUnit",message:`「${unit.name}」召喚時：破壊する鉄ユニットを選択`}); break; }
    case "SUM_TOKEN_DES_UNIT_DMG2":{ const tk=room.board[p].filter(u=>u.isToken&&roomGetAttr(u.name)==="steel"); if(tk.length===0){roomAddLog(room,p,`「${unit.name}」召喚時：ギアトークンなし`);break;} if(room.board[op].length===0){roomAddLog(room,p,`「${unit.name}」召喚時：相手ユニットなし`);break;} room.pendingTarget={player:p,effect:"SUM_TOKEN_DES_UNIT_DMG2",card:unit.name}; socket.emit("selectTarget",{type:"myUnit",message:`「${unit.name}」召喚時：破壊するギアトークンを選択`}); break; }
    case "SUM_DES_SUM_C2":{ if(room.board[p].length<=1){roomAddLog(room,p,`「${unit.name}」召喚時：他にユニットなし`);break;} room.pendingTarget={player:p,effect:"SUM_DES_SUM_C2",card:unit.name}; socket.emit("selectTarget",{type:"myUnit",message:`「${unit.name}」召喚時：破壊するユニットを選択`}); break; }
    case "SUM_L_SELF-X_A+X": room.pendingTarget={player:p,effect:"SUM_L_SELF-X_A+X",card:unit.name,unit:unit}; socket.emit("selectTarget",{type:"lifeInput",message:`「${unit.name}」：支払うライフを入力（現在:${room.life[p]}）`}); break;
    case "SUM_L_SELF-X_DRAWX": room.pendingTarget={player:p,effect:"SUM_L_SELF-X_DRAWX",card:unit.name}; socket.emit("selectTarget",{type:"lifeInput",message:`「${unit.name}」：支払うライフを入力（現在:${room.life[p]}）`}); break;
    case "DENKOUSEKKA": unit.denko=true; roomAddLog(room,p,`「${unit.name}」：電光石火を持って召喚`); break;
    case "END_A+1": break;
    case "START_TOKEN1": break;
    case "DAMAGE_REDUCE_1": break;
    case "DES_SUMMON_C2": break;
  }
}

function roomProcessSpellEffect(room, cardName, p, socket){
  const c=cards[cardName];
  if(!c) return false;
  const op=roomGetOpponent(room,p);
  const eff=c.effect||"";
  switch(eff){
    case "DRAW2": roomDrawN(room,p,2); roomAddLog(room,p,`「${cardName}」：2枚ドロー`); return true;
    case "L+3_DRAW1": room.life[p]+=3; roomDraw(room,p); roomAddLog(room,p,`「${cardName}」：ライフ+3、1枚ドロー`); return true;
    case "L+8": room.life[p]+=8; roomAddLog(room,p,`「${cardName}」：ライフ+8`); return true;
    case "E+2": room.maxEnergy[p]=Math.min(10,room.maxEnergy[p]+2);room.energy[p]=Math.min(room.maxEnergy[p],room.energy[p]+2); roomAddLog(room,p,`「${cardName}」：エネルギー+2`); return true;
    case "L_ADJ8": room.life[op]-=2;room.life[p]+=4; if(room.life[op]<=0)room.winner=p; roomAddLog(room,p,`「${cardName}」：相手ライフ-2、自分ライフ+4`); return true;
    case "BOTH_L-3": room.life[p]-=3;room.life[op]-=3; if(room.life[p]<=0&&room.life[op]<=0)room.winner=null; else if(room.life[p]<=0)room.winner=op; else if(room.life[op]<=0)room.winner=p; roomAddLog(room,p,`「${cardName}」：両者ライフ-3`); return true;
    case "ALL_UNIT_DMG2": roomDamageAllUnits(room,op,2,p); roomAddLog(room,p,`「${cardName}」：相手全体2ダメージ`); return true;
    case "ALL_UNIT_DMG4": roomDamageAllUnits(room,op,4,p); roomAddLog(room,p,`「${cardName}」：相手全体4ダメージ`); return true;
    case "ALL_UNIT_DMG1_L2": roomDamageAllUnits(room,op,1,p);roomDamageLife(room,op,2); roomAddLog(room,p,`「${cardName}」：相手全体-1、ライフ-2`); return true;
    case "ALL_UNIT_BOUNCE": [[p],[op]].forEach(([pl])=>{[...room.board[pl]].forEach(u=>{if(!u.isToken)room.hands[pl].push(u.name);});room.board[pl]=[];}); roomAddLog(room,p,`「${cardName}」：全ユニット手札へ`); return true;
    case "OPP_HAND_TO2":{ if(room.hands[op].length<=2){socket.emit("message","相手の手札が2枚以下のため不発");return false;} const d2=[]; while(room.hands[op].length>2){const d=roomDiscardRandom(room,op);if(d)d2.push(d);} roomAddLog(room,p,`「${cardName}」：相手手札${d2.length}枚破棄`); return true; }
    case "HAN1_DRAW1":{ roomDraw(room,p); roomAddLog(room,p,`「${cardName}」：1枚ドロー`); if(room.hands[op].length>=3){const d=roomDiscardRandom(room,op);roomAddLog(room,p,`「${cardName}」：相手手札「${d||"なし"}」破棄`);const s=io.sockets.sockets.get(p);if(s&&d)s.emit("message",`相手の手札「${d}」が捨て場に送られました`);}else{roomAddLog(room,p,`「${cardName}」：ハンデス不発`);} return true; }
    case "DRAW2_DISC1": roomDrawN(room,p,2);room.pendingDiscard[p]=1; roomAddLog(room,p,`「${cardName}」：2枚ドロー（1枚捨て待ち）`); return true;
    case "DRAW3_DISC2": roomDrawN(room,p,3);room.pendingDiscard[p]=2; roomAddLog(room,p,`「${cardName}」：3枚ドロー（2枚捨て待ち）`); return true;
    case "L_SELF-2_DRAW3": room.life[p]-=2; if(room.life[p]<=0){room.winner=op;return true;} roomDrawN(room,p,3); roomAddLog(room,p,`「${cardName}」：ライフ-2、3枚ドロー`); return true;
    case "L_SELF_HALF_DRAW5": room.life[p]=Math.floor(room.life[p]/2); if(room.life[p]<=0){room.winner=op;return true;} roomDrawN(room,p,5); roomAddLog(room,p,`「${cardName}」：ライフ半分、5枚ドロー`); return true;
    case "ALL_H_PERM+2": room.board[p].forEach(u=>u.hp+=2); roomAddLog(room,p,`「${cardName}」：味方全体HP+2`); return true;
    case "ALL_A_H_PERM+2": room.board[p].forEach(u=>{u.atk+=2;u.hp+=2;}); roomAddLog(room,p,`「${cardName}」：味方全体ATK/HP+2`); return true;
    case "TURN_ALL_A+2": if(!room.turnBuffs[p])room.turnBuffs[p]={atk:0}; room.turnBuffs[p].atk+=2; room.board[p].forEach(u=>u.atk+=2); roomAddLog(room,p,`「${cardName}」：味方全体ATK+2（このターン）`); return true;
    case "TURN_ALL_A+1_L_DMGX":{ if(!room.turnBuffs[p])room.turnBuffs[p]={atk:0}; room.turnBuffs[p].atk+=1; room.board[p].forEach(u=>u.atk+=1); const uc=room.board[p].length; if(uc>0)roomDamageLife(room,op,uc); roomAddLog(room,p,`「${cardName}」：全体ATK+1、ライフ-${uc}`); return true; }
    case "SUM_TOKEN3": roomSummonToken(room,p,"ギアトークン",3); roomAddLog(room,p,`「${cardName}」：ギアトークン3体召喚`); return true;
    case "SUM_S_TOKEN3": roomSummonToken(room,p,"シードトークン",3); roomAddLog(room,p,`「${cardName}」：シードトークン3体召喚`); return true;
    case "LIFE_5_ALL_DES": if(room.life[p]>5){socket.emit("message","ライフが5以下の時のみ使用できます");return false;} { const td=[...room.board[op]]; room.board[op]=[]; td.forEach(u=>{room.graves[op].push(u);roomTriggerDestroyEffect(room,u,op);}); roomAddLog(room,p,`「${cardName}」：相手全ユニット破壊`); } return true;
    case "OPP_E-1_HAN1": room.maxEnergy[op]=Math.max(0,room.maxEnergy[op]-1);room.energy[op]=Math.min(room.energy[op],room.maxEnergy[op]); roomAddLog(room,p,`「${cardName}」：相手エネルギー-1`); if(room.hands[op].length>=3){const d=roomDiscardRandom(room,op);roomAddLog(room,p,`「${cardName}」：相手手札「${d||"なし"}」破棄`);const s=io.sockets.sockets.get(p);if(s&&d)s.emit("message",`相手の手札「${d}」が捨て場に送られました`);}else{roomAddLog(room,p,`「${cardName}」：ハンデス不発`);} return true;
    case "L_SELF-2_ALL_DMG4": room.life[p]-=2; if(room.life[p]<=0){room.winner=op;return true;} roomDamageAllUnits(room,op,4,p); roomAddLog(room,p,`「${cardName}」：ライフ-2、相手全体4ダメージ`); return true;
    case "UNIT_DMG3": case "UNIT_DMG2": if(room.board[op].length===0){socket.emit("message","対象ユニットがいません");return false;} room.pendingTarget={player:p,effect:eff,card:cardName}; socket.emit("selectTarget",{type:"enemyUnit",message:`「${cardName}」の対象を選択`}); return "pending";
    case "A_PERM+3": case "A+2_H+1": case "A_H_PERM+3": case "UNIT_FULL_HEAL": case "UNIT_DENKOUSEKKA": case "CRYSTAL_BARRIER": if(room.board[p].length===0){socket.emit("message","対象ユニットがいません");return false;} room.pendingTarget={player:p,effect:eff,card:cardName}; socket.emit("selectTarget",{type:"myUnit",message:`「${cardName}」の対象を選択`}); return "pending";
    case "PURIFY": if(room.board[p].length===0&&room.board[op].length===0){socket.emit("message","対象ユニットがいません");return false;} room.pendingTarget={player:p,effect:eff,card:cardName}; socket.emit("selectTarget",{type:"anyUnit",message:`「${cardName}」：解除するユニットを選択`}); return "pending";
    case "FLAME_BURN": if(room.board[p].length===0){socket.emit("message","自分の場にユニットがいません");return false;} room.pendingTarget={player:p,effect:eff,card:cardName}; socket.emit("selectTarget",{type:"myUnit",message:"フレイムバーン：破壊するユニットを選択"}); return "pending";
    case "AQUA_RETURN":{ const mw=room.board[p].filter(u=>roomGetAttr(u.name)==="water"); if(mw.length===0){socket.emit("message","水ユニットがいません");return false;} room.pendingTarget={player:p,effect:eff,card:cardName}; socket.emit("selectTarget",{type:"myUnit",message:"アクアリターン：手札に戻すユニットを選択"}); return "pending"; }
    case "A_PERM-3": if(room.board[op].length===0){socket.emit("message","対象ユニットがいません");return false;} room.pendingTarget={player:p,effect:eff,card:cardName}; socket.emit("selectTarget",{type:"enemyUnit",message:`「${cardName}」：弱体化する相手ユニットを選択`}); return "pending";
    case "DISABLE1": if(room.board[op].length===0){socket.emit("message","対象ユニットがいません");return false;} room.pendingTarget={player:p,effect:eff,card:cardName}; socket.emit("selectTarget",{type:"enemyUnit",message:"マインドコントロール：行動不能にする相手ユニットを選択"}); return "pending";
    case "BOUNCE_UNIT": if(room.board[p].length===0&&room.board[op].length===0){socket.emit("message","場にユニットがいません");return false;} room.pendingTarget={player:p,effect:eff,card:cardName}; socket.emit("selectTarget",{type:"anyUnit",message:"リバース：手札に戻すユニットを選択"}); return "pending";
    case "UNIT_DES_DRAW1": if(room.board[op].length===0){socket.emit("message","対象ユニットがいません");return false;} room.pendingTarget={player:p,effect:eff,card:cardName}; socket.emit("selectTarget",{type:"enemyUnit",message:"サンダーストライク：破壊する相手ユニットを選択"}); return "pending";
    case "UNIT_DES_COST_L_DMG": if(room.board[op].length===0){socket.emit("message","対象ユニットがいません");return false;} room.pendingTarget={player:p,effect:eff,card:cardName}; socket.emit("selectTarget",{type:"enemyUnit",message:"業火の裁き：破壊する相手ユニットを選択"}); return "pending";
    case "UNIT_DES_COST_LHEAL": if(room.board[op].length===0){socket.emit("message","対象ユニットがいません");return false;} room.pendingTarget={player:p,effect:eff,card:cardName}; socket.emit("selectTarget",{type:"enemyUnit",message:`「${cardName}」：破壊する相手ユニットを選択`}); return "pending";
    case "UNIT_DES_L_HEAL": if(room.board[p].length===0){socket.emit("message","自分の場にユニットがいません");return false;} room.pendingTarget={player:p,effect:eff,card:cardName}; socket.emit("selectTarget",{type:"myUnit",message:"サクリファイス：破壊する自分のユニットを選択"}); return "pending";
    case "IRON_COUNT_ALL_DMG1":{ const ic=room.board[p].filter(u=>roomGetAttr(u.name)==="steel").length; if(ic===0){socket.emit("message","鉄ユニットがいません");return false;} roomDamageAllUnits(room,op,ic,p); roomAddLog(room,p,`「${cardName}」：鉄${ic}体→相手全体${ic}ダメージ`); return true; }
    case "ALL_UNIT_DMG3_MY_A_H+1": roomDamageAllUnits(room,op,3,p); room.board[p].forEach(u=>{u.atk+=1;u.hp+=1;}); roomAddLog(room,p,`「${cardName}」：相手全体3ダメ＋味方ATK/HP+1`); return true;
    case "SOUL_TRADE": room.pendingTarget={player:p,effect:"SOUL_TRADE_AFTER",card:cardName}; roomAddLog(room,p,`「${cardName}」：手札から1枚捨ててください`); socket.emit("selectTarget",{type:"soulTrade",message:"ソウルトレード：捨てるカードを選択"}); return "pending";
    case "DES_COST2_DRAW":{ const tg=[]; room.board[op].forEach((u,i)=>{if((cards[u.name]?.cost||0)<=2)tg.push(i);}); if(tg.length===0){socket.emit("message","コスト2以下ユニットがいません");return false;} tg.reverse().forEach(i=>{const d=room.board[op].splice(i,1)[0];room.graves[op].push(d);roomTriggerDestroyEffect(room,d,op);}); roomDrawN(room,p,tg.length); roomAddLog(room,p,`「${cardName}」：コスト2以下${tg.length}体破壊、${tg.length}枚ドロー`); return true; }
    case "ALL_DISABLE_1T": if(room.board[op].length===0){socket.emit("message","相手の場にユニットがいません");return false;} room.board[op].forEach(u=>{u.disabled=true;u.disabledCount=1;}); roomAddLog(room,p,`「${cardName}」：相手全ユニット行動不能`); return true;
    case "RECYCLE_IRON":{ const gl=room.graves[p].filter(u=>cards[u.name]?.type==="unit"&&roomGetAttr(u.name)==="steel"); if(gl.length===0){socket.emit("message","捨て場に鉄ユニットがいません");return false;} const gn=gl.map(u=>u.name); room.pendingTarget={player:p,effect:"RECYCLE_IRON_SELECT",card:cardName,graveNames:gn}; socket.emit("selectTarget",{type:"graveSelect",message:"リサイクル：手札に戻す鉄ユニットを選択",options:gn}); return "pending"; }
    case "REVIVE_TOP":{ if(room.board[p].length>=3){socket.emit("message","場が満杯です");return false;} let ri=-1; for(let i=room.graves[p].length-1;i>=0;i--){if(cards[room.graves[p][i].name]?.type==="unit"){ri=i;break;}} if(ri===-1){socket.emit("message","捨て場にユニットがいません");return false;} const rv=room.graves[p].splice(ri,1)[0]; const rc=cards[rv.name]; const u={name:rv.name,atk:rc.atk,hp:rc.hp,attacked:false,attr:rc.attr||"neutral",damageReduce:rc.effect==="DAMAGE_REDUCE_1"}; room.board[p].push(u); roomApplyFieldSpellOnSummon(room,u,p); roomAddLog(room,p,`「${cardName}」：「${rv.name}」を蘇生`); roomTriggerSummonEffect(room,u,p,socket); return true; }
    case "L_SELF-1_A+3": if(room.board[p].length===0){socket.emit("message","自分の場にユニットがいません");return false;} room.life[p]-=1; if(room.life[p]<=0){room.winner=op;return true;} room.pendingTarget={player:p,effect:"L_SELF-1_A+3",card:cardName}; roomAddLog(room,p,`「${cardName}」：ライフ-1`); socket.emit("selectTarget",{type:"myUnit",message:"インジェクション：強化するユニットを選択"}); return "pending";
    case "SCRAP_BUILD_C3": if(room.board[p].filter(u=>roomGetAttr(u.name)==="steel").length===0){socket.emit("message","鉄ユニットがいません");return false;} room.pendingTarget={player:p,effect:"SCRAP_BUILD_C3",card:cardName}; socket.emit("selectTarget",{type:"myUnit",message:"スクラップ&ビルド：破壊する鉄ユニットを選択"}); return "pending";
    case "IRON_DES_UNIT_DES": if(room.board[p].filter(u=>roomGetAttr(u.name)==="steel").length===0){socket.emit("message","鉄ユニットがいません");return false;} if(room.board[op].length===0){socket.emit("message","相手の場にユニットがいません");return false;} room.pendingTarget={player:p,effect:"IRON_DES_UNIT_DES_STEP1",card:cardName}; socket.emit("selectTarget",{type:"myUnit",message:"自爆装置：破壊する鉄ユニットを選択"}); return "pending";
    case "UNIT_DES_SUM_C2": if(room.board[p].length===0){socket.emit("message","ユニットがいません");return false;} room.pendingTarget={player:p,effect:"UNIT_DES_SUM_C2",card:cardName}; socket.emit("selectTarget",{type:"myUnit",message:"エレキサーキット：破壊するユニットを選択"}); return "pending";
    case "UNIT_DES_SUM_C3": if(room.board[p].length===0){socket.emit("message","ユニットがいません");return false;} room.pendingTarget={player:p,effect:"UNIT_DES_SUM_C3",card:cardName}; socket.emit("selectTarget",{type:"myUnit",message:"リンカーネーション：破壊するユニットを選択"}); return "pending";
    case "OVERLOAD_A+3_END_DES_ALL":{ const st=room.board[p].filter(u=>roomGetAttr(u.name)==="steel"); if(st.length===0){socket.emit("message","鉄ユニットがいません");return false;} st.forEach(u=>{u.atk+=3;u.overloadMark=true;}); roomAddLog(room,p,`「${cardName}」：鉄全体ATK+3（ターン終了時全破壊）`); return true; }
    case "FUSION_IRON2": if(room.board[p].filter(u=>roomGetAttr(u.name)==="steel").length<2){socket.emit("message","鉄ユニットが2体以上必要です");return false;} room.pendingTarget={player:p,effect:"FUSION_IRON2_STEP1",card:cardName,selected:[]}; socket.emit("selectTarget",{type:"myUnit",message:"メガギアフュージョン：1体目の鉄ユニットを選択"}); return "pending";
    case "SUM_H_C3X2":{ const vh=room.hands[p].filter(name=>cards[name]?.type==="unit"&&(cards[name]?.cost||0)<=3); if(vh.length===0){socket.emit("message","コスト3以下のユニットがいません");return false;} room.pendingTarget={player:p,effect:"SUM_H_C3X2_STEP1",card:cardName}; socket.emit("selectTarget",{type:"handUnit_cost3",message:"シードスポーン：1体目を選択"}); return "pending"; }
    case "PERM_SPELL_WATER_ENERGY": case "PERM_SPELL_HERB_HEAL": case "PERM_SPELL_FOREST_BUFF": case "PERM_SPELL_IRON_FACTORY": case "PERM_SPELL_FIRE_OVERFLOW": case "PERM_SPELL_THUNDER_NOREFLECT": case "PERM_SPELL_DARK_DEBUFF":{
      if(room.fieldSpell[p]){socket.emit("message","すでにフィールドスペルがあります");return false;}
      const dur=cards[cardName]?.durability||5;
      room.fieldSpell[p]={name:cardName,durability:dur};
      roomAddLog(room,p,`「${cardName}」をフィールドに設置（耐久${dur}）`);
      if(eff==="PERM_SPELL_WATER_ENERGY"){room.maxEnergy[p]=Math.min(10,room.maxEnergy[p]+1);room.energy[p]=Math.min(room.maxEnergy[p],room.energy[p]+1);roomAddLog(room,p,`「${cardName}」：エネルギー+1`);room.board[p].forEach(u=>{u.atk+=1;});roomAddLog(room,p,`「${cardName}」：場の全ユニットATK+1`);}
      if(eff==="PERM_SPELL_HERB_HEAL"){room.life[p]+=3;roomAddLog(room,p,`「${cardName}」：ライフ+3`);}
      if(eff==="PERM_SPELL_FOREST_BUFF"){room.board[p].forEach(u=>{u.atk+=1;u.hp+=1;});roomAddLog(room,p,`「${cardName}」：全ユニットATK/HP+1`);}
      if(eff==="PERM_SPELL_IRON_FACTORY"){room.board[p].forEach(u=>{if(u.name==="ギアトークン"||u.name==="ギアスカウト"||u.name==="プロトタイプユニット"){u.atk+=1;}});roomAddLog(room,p,`「${cardName}」：ギアトークン等ATK+1`);if(room.board[p].length<3){const gt={name:"ギギアトークン",atk:2,hp:2,attacked:false,attr:"steel",isToken:true};room.board[p].push(gt);roomApplyFieldSpellOnSummon(room,gt,p);roomAddLog(room,p,`「${cardName}」：ギギアトークン召喚`);}}
      if(eff==="PERM_SPELL_DARK_DEBUFF"){room.board[op].forEach(u=>{u.atk=Math.max(0,u.atk-1);});roomAddLog(room,p,`「${cardName}」：相手全ユニットATK-1`);}
      return true;
    }
    case "DES_PERM_SPELL":{ const hp=room.fieldSpell[p]; const hop=room.fieldSpell[op]; if(!hp&&!hop){socket.emit("message","フィールドスペルがありません");return false;} room.pendingTarget={player:p,effect:"DES_PERM_SPELL",card:cardName}; socket.emit("selectTarget",{type:"fieldSpell",message:"崩壊：破壊するフィールドスペルを選択"}); return "pending"; }
    default: return false;
  }
}

function roomStartTurn(room, p){
  room.turnBuffs[p]={atk:0};
  roomDraw(room,p,true);
  if(room.maxEnergy[p]===0){ room.maxEnergy[p]=(p===room.firstPlayer)?1:2; }
  else{ room.maxEnergy[p]=Math.min(10,room.maxEnergy[p]+2); }
  room.energy[p]=room.maxEnergy[p];
  room.board[p].forEach(u=>{u.attacked=false;u.denkoAttackedThisTurn=false;u.rollbackAttack=false;});
  room.board[p].forEach(u=>{const c=cards[u.name];if(c&&c.effect==="START_TOKEN1"){roomShowEffect(room,u.name);roomSummonToken(room,p,"ギアトークン",1);}});
  const fs=room.fieldSpell[p];
  if(fs){
    const fe=cards[fs.name]?.effect||"";
    if(fe==="PERM_SPELL_WATER_ENERGY"){room.maxEnergy[p]=Math.min(10,room.maxEnergy[p]+1);room.energy[p]=Math.min(room.maxEnergy[p],room.energy[p]+1);roomAddLog(room,p,`「${fs.name}」：エネルギー+1`);}
    if(fe==="PERM_SPELL_HERB_HEAL"){room.life[p]+=3;roomAddLog(room,p,`「${fs.name}」：ライフ+3`);}
    if(fe==="PERM_SPELL_IRON_FACTORY"){if(room.board[p].length<3){const gt={name:"ギギギアトークン",atk:3,hp:3,attacked:false,attr:"steel",isToken:true};room.board[p].push(gt);roomApplyFieldSpellOnSummon(room,gt,p);roomAddLog(room,p,`「${fs.name}」：ギギギアトークン召喚`);}}
  }
}

function roomResetGame(room){
  room.board={};room.hands={};room.decks={};room.graves={};
  room.energy={};room.maxEnergy={};room.life={};room.winner=null;
  room.noAttack={};room.pendingDiscard={};room.turnBuffs={};
  room.pendingHandLimitDiscard=null;room.pendingNext=null;room.fieldSpell={};
  room.allLogs=[];room.turnLogs={};room.prevLogs={};
  [room.player1,room.player2].forEach(p=>{
    room.decks[p]=shuffle([...(room.customDeck[p]||[])]);
    room.hands[p]=[];room.graves[p]=[];room.board[p]=[];
    room.energy[p]=0;room.maxEnergy[p]=0;room.life[p]=15;
    room.turnLogs[p]=[];room.prevLogs[p]=[];
    room.pendingDiscard[p]=0;room.turnBuffs[p]={atk:0};
    for(let i=0;i<5;i++)roomDraw(room,p);
  });
  const first=Math.random()<0.5?room.player1:room.player2;
  room.turn=first;room.firstPlayer=first;
  roomStartTurn(room,first);
  room.noAttack[first]=true;
}

// ルーム対戦のselect_target処理（フリー対戦のものを流用・room対応版）
function roomHandleSelectTarget(room, socket, data){
  if(!room.pendingTarget) return;
  if(room.pendingTarget.player!==socket.id) return;
  const pt=room.pendingTarget;
  const p=pt.player;
  const op=roomGetOpponent(room,p);
  const eff=pt.effect;
  const targetIndex=data.targetIndex;
  const targetSide=data.targetSide;

  if(eff==="SOUL_TRADE_AFTER"){
    const hi=data.handIndex;
    const ctd=room.hands[p][hi];
    if(ctd===undefined||ctd===null){roomSend(room);return;}
    room.hands[p].splice(hi,1);room.graves[p].push({name:ctd});
    roomAddLog(room,p,`ソウルトレード：「${ctd}」を捨てました`);
    roomDraw(room,p);
    const stOp=roomGetOpponent(room,p);
    const dST=roomDiscardRandom(room,stOp);
    roomDraw(room,stOp);
    roomAddLog(room,p,`ソウルトレード：相手「${dST||"なし"}」破棄、相手1ドロー`);
    const ss=io.sockets.sockets.get(p);if(ss&&dST)ss.emit("message",`相手の手札「${dST}」が捨て場に送られました`);
    room.pendingTarget=null;roomSend(room);return;
  }

  if(eff==="SUM_L_SELF-X_A+X"||eff==="SUM_L_SELF-X_DRAWX"){
    const amount=data.lifeAmount;
    const maxA=eff==="SUM_L_SELF-X_DRAWX"?Math.min(3,room.life[p]-1):room.life[p]-1;
    if(!amount||amount<=0||amount>maxA){socket.emit("message",`有効なライフ量を入力してください`);room.pendingTarget=pt;socket.emit("selectTarget",{type:"lifeInput",message:`支払うライフを入力（現在:${room.life[p]}）`});roomSend(room);return;}
    room.life[p]-=amount;
    if(eff==="SUM_L_SELF-X_A+X"){const cv=room.board[p].find(u=>u.name===pt.card);if(cv)cv.atk+=amount;roomAddLog(room,p,`「${pt.card}」：ライフ${amount}→ATK+${amount}`);}
    else{roomDrawN(room,p,amount);roomAddLog(room,p,`「${pt.card}」：ライフ${amount}→${amount}枚ドロー`);}
    if(room.life[p]<=0)room.winner=op;
    room.pendingTarget=null;roomSend(room);return;
  }

  if(eff==="RECYCLE_IRON_SELECT"){
    const graveIdx=data.graveIndex;const gn=pt.graveNames||[];
    if(graveIdx===undefined||graveIdx<0||graveIdx>=gn.length){socket.emit("message","有効なカードを選択してください");room.pendingTarget=pt;socket.emit("selectTarget",{type:"graveSelect",message:"手札に戻す鉄ユニットを選択",options:gn});roomSend(room);return;}
    const sn=gn[graveIdx];const ri=room.graves[p].findIndex(u=>u.name===sn);
    if(ri===-1){socket.emit("message","対象が見つかりません");room.pendingTarget=pt;socket.emit("selectTarget",{type:"graveSelect",message:"手札に戻す鉄ユニットを選択",options:gn});roomSend(room);return;}
    room.graves[p].splice(ri,1);room.hands[p].push(sn);room.pendingTarget=null;
    roomAddLog(room,p,`「${pt.card}」：「${sn}」を手札に回収`);roomSend(room);return;
  }

  if(eff==="SCRAP_BUILD_HAND"){
    const hc=room.hands[p][data.handIndex];
    if(!hc){roomSend(room);return;}
    if(roomGetAttr(hc)!=="steel"||(cards[hc]?.cost||0)>3){socket.emit("message","コスト3以下の鉄ユニットを選択してください");roomSend(room);return;}
    room.hands[p].splice(data.handIndex,1);
    const sc=cards[hc];
    const nu={name:hc,atk:(sc.atk||0)+1,hp:sc.hp||0,attacked:false,attr:"steel",damageReduce:sc.effect==="DAMAGE_REDUCE_1"};
    room.board[p].push(nu);room.pendingTarget=null;
    roomAddLog(room,p,`ビルド：「${hc}」をATK+1で召喚`);
    roomTriggerSummonEffect(room,nu,p,socket);roomSend(room);return;
  }

  // 手札インデックス系
  if(["UNIT_DES_SUM_C2_HAND","UNIT_DES_SUM_C3_HAND","SUM_DES_SUM_C2_HAND","DES_SUMMON_C2_HAND","FUSION_IRON2_HAND","SUM_H_C3X2_STEP1","SUM_H_C3X2_STEP2"].includes(eff)){
    const hi=data.handIndex;const hcard=room.hands[p][hi];
    const cl=(eff==="UNIT_DES_SUM_C2_HAND"||eff==="SUM_DES_SUM_C2_HAND")?2:(eff==="UNIT_DES_SUM_C3_HAND"||eff==="DES_SUMMON_C2_HAND"||eff==="SUM_H_C3X2_STEP1"||eff==="SUM_H_C3X2_STEP2")?3:999;
    const so=eff==="FUSION_IRON2_HAND";
    const isSeedR=(eff==="SUM_H_C3X2_STEP1"||eff==="SUM_H_C3X2_STEP2");
    if(!hcard||cards[hcard]?.type!=="unit"||(cards[hcard]?.cost||0)>cl||(so&&roomGetAttr(hcard)!=="steel")){
      const errMsg=so?"鉄ユニットを選択してください":`コスト${cl}以下のユニットを選択してください`;
      socket.emit("message",errMsg);room.pendingTarget=pt;
      const sType=isSeedR?"handUnit_cost3":"handUnit";
      const sNum=eff==="SUM_H_C3X2_STEP1"?1:2;
      const sMsg=isSeedR?`${sNum}体目：コスト3以下のユニットを選択してください`:errMsg;
      socket.emit("selectTarget",{type:sType,message:sMsg});roomSend(room);return;}
    room.hands[p].splice(hi,1);
    const hc2=cards[hcard];const ba=pt.fusionBonusAtk||0;const bh=pt.fusionBonusHp||0;
    const bAtk=so?hc2.atk+ba:hc2.atk;const bHp=so?hc2.hp+bh:hc2.hp;
    if(room.board[p].length<3){
      const nu={name:hcard,atk:bAtk,hp:bHp,attacked:false,attr:so?"steel":(hc2.attr||"neutral"),damageReduce:hc2.effect==="DAMAGE_REDUCE_1"};
      room.board[p].push(nu);
      if(eff!=="FUSION_IRON2_HAND")roomApplyFieldSpellOnSummon(room,nu,p);
      const lbl=eff==="FUSION_IRON2_HAND"?`フュージョン（ATK+${ba}/HP+${bh}）`:eff==="DES_SUMMON_C2_HAND"?`「${pt.card}」破壊時`:(eff==="SUM_H_C3X2_STEP1"||eff==="SUM_H_C3X2_STEP2")?"シードスポーン":`「${pt.card}」`;
      roomAddLog(room,p,`${lbl}：「${hcard}」を召喚`);
      room.pendingTarget=null;
      roomTriggerSummonEffect(room,nu,p,socket);
      if(eff==="DES_SUMMON_C2_HAND"){const ts=io.sockets.sockets.get(room.turn);if(ts)ts.emit("growCoreResolved");if(pt.pendingNext){const nxt=pt.pendingNext;if(room.pendingTarget)room.pendingTarget.pendingNext=nxt;else room.pendingNext=nxt;}}
      if(eff==="SUM_H_C3X2_STEP1"){const vv=room.hands[p].filter(n=>cards[n]?.type==="unit"&&(cards[n]?.cost||0)<=3);if(vv.length>0&&room.board[p].length<3){room.pendingTarget={player:p,effect:"SUM_H_C3X2_STEP2",card:pt.card};socket.emit("selectTarget",{type:"handUnit_cost3",message:"2体目：コスト3以下のユニットを選択"});roomSend(room);return;}}
    }else{room.pendingTarget=null;}
    roomNotifyPendingTarget(room);roomSend(room);return;
  }

  const targetBoard=targetSide==="my"?room.board[p]:room.board[op];
  const targetUnit=targetBoard?targetBoard[targetIndex]:null;
  if(!targetUnit){socket.emit("message","対象が見つかりません");return;}
  room.pendingTarget=null;

  switch(eff){
    case "UNIT_DMG3":case "UNIT_DMG2":{const dmg=eff==="UNIT_DMG3"?3:2;const ac=targetUnit.damageReduce?Math.min(1,dmg):dmg;targetUnit.hp-=ac;roomAddLog(room,p,`「${pt.card}」→「${targetUnit.name}」に${ac}ダメージ`);if(targetUnit.hp<=0){room.board[op].splice(targetIndex,1);if(!targetUnit.isToken)room.graves[op].push(targetUnit);roomAddLog(room,p,`→「${targetUnit.name}」を破壊`);roomTriggerDestroyEffect(room,targetUnit,op);}if(room.pendingTarget){roomNotifyPendingTarget(room);if(room.pendingTarget.effect==="DES_SUMMON_C2_HAND")socket.emit("message","相手がグロウコアの効果でユニットを選択中です...");roomSend(room);return;}break;}
    case "A_PERM+3":targetUnit.atk+=3;roomAddLog(room,p,`「${pt.card}」→「${targetUnit.name}」ATK+3`);break;
    case "A+2_H+1":targetUnit.atk+=2;targetUnit.hp+=1;roomAddLog(room,p,`「${pt.card}」→「${targetUnit.name}」ATK+2/HP+1`);break;
    case "A_H_PERM+3":targetUnit.atk+=3;targetUnit.hp+=3;roomAddLog(room,p,`「${pt.card}」→「${targetUnit.name}」ATK+3/HP+3`);break;
    case "A_PERM-3":targetUnit.atk=Math.max(0,targetUnit.atk-3);roomAddLog(room,p,`「${pt.card}」→「${targetUnit.name}」ATK-3`);break;
    case "DISABLE1":targetUnit.disabled=true;roomAddLog(room,p,`「${pt.card}」→「${targetUnit.name}」行動不能`);break;
    case "UNIT_DENKOUSEKKA":targetUnit.denko=true;roomAddLog(room,p,`「${pt.card}」→「${targetUnit.name}」電光石火付与`);break;
    case "UNIT_FULL_HEAL":{const mh=cards[targetUnit.name]?.hp||targetUnit.hp;targetUnit.hp=mh;roomAddLog(room,p,`「${pt.card}」→「${targetUnit.name}」HP全回復`);break;}
    case "PURIFY":targetUnit.disabled=false;delete targetUnit.disabledCount;targetUnit.barrier=false;roomAddLog(room,p,`「${pt.card}」→「${targetUnit.name}」特殊状態解除`);break;
    case "CRYSTAL_BARRIER":targetUnit.barrier=true;roomAddLog(room,p,`「${pt.card}」→「${targetUnit.name}」バリア付与`);break;
    case "BOUNCE_UNIT":{const oot=targetSide==="my"?p:op;if(targetUnit.isToken){targetBoard.splice(targetIndex,1);roomAddLog(room,p,`「${pt.card}」→「${targetUnit.name}」消滅`);}else{targetBoard.splice(targetIndex,1);room.hands[oot].push(targetUnit.name);roomAddLog(room,p,`「${pt.card}」→「${targetUnit.name}」手札へ`);}break;}
    case "FLAME_BURN":room.board[p].splice(targetIndex,1);room.graves[p].push(targetUnit);roomAddLog(room,p,`「${pt.card}」→「${targetUnit.name}」破壊`);roomTriggerDestroyEffect(room,targetUnit,p);roomDamageLife(room,op,1);roomAddLog(room,p,`フレイムバーン：相手ライフ-1`);break;
    case "AQUA_RETURN":{if(roomGetAttr(targetUnit.name)!=="water"){socket.emit("message","水属性ユニットを選択してください");room.pendingTarget={player:p,effect:eff,card:pt.card};socket.emit("selectTarget",{type:"myUnit",message:"水属性ユニットを選択"});roomSend(room);return;}room.board[p].splice(targetIndex,1);room.hands[p].push(targetUnit.name);roomDraw(room,p);roomAddLog(room,p,`「${pt.card}」→「${targetUnit.name}」手札へ、1枚ドロー`);break;}
    case "UNIT_DES_DRAW1":room.board[op].splice(targetIndex,1);room.graves[op].push(targetUnit);roomAddLog(room,p,`「${pt.card}」→「${targetUnit.name}」破壊`);roomTriggerDestroyEffect(room,targetUnit,op);roomDraw(room,p);roomAddLog(room,p,`→1枚ドロー`);if(room.pendingTarget){roomNotifyPendingTarget(room);if(room.pendingTarget.effect==="DES_SUMMON_C2_HAND")socket.emit("message","相手がグロウコアの効果でユニットを選択中です...");roomSend(room);return;}break;
    case "UNIT_DES_COST_L_DMG":{const cost=cards[targetUnit.name]?.cost||0;room.board[op].splice(targetIndex,1);room.graves[op].push(targetUnit);roomAddLog(room,p,`「${pt.card}」→「${targetUnit.name}」（コスト${cost}）破壊`);roomTriggerDestroyEffect(room,targetUnit,op);roomDamageLife(room,op,cost);roomAddLog(room,p,`→相手ライフ-${cost}`);if(room.pendingTarget){roomNotifyPendingTarget(room);if(room.pendingTarget.effect==="DES_SUMMON_C2_HAND")socket.emit("message","相手がグロウコアの効果でユニットを選択中です...");roomSend(room);return;}break;}
    case "UNIT_DES_COST_LHEAL":{const cost=cards[targetUnit.name]?.cost||0;room.board[op].splice(targetIndex,1);room.graves[op].push(targetUnit);roomAddLog(room,p,`「${pt.card}」→「${targetUnit.name}」破壊`);roomTriggerDestroyEffect(room,targetUnit,op);room.life[p]+=cost;roomAddLog(room,p,`→自分ライフ+${cost}`);if(room.pendingTarget){roomNotifyPendingTarget(room);if(room.pendingTarget.effect==="DES_SUMMON_C2_HAND")socket.emit("message","相手がグロウコアの効果でユニットを選択中です...");roomSend(room);return;}break;}
    case "UNIT_DES_L_HEAL":{const cost=cards[targetUnit.name]?.cost||0;room.board[p].splice(targetIndex,1);room.graves[p].push(targetUnit);roomAddLog(room,p,`「${pt.card}」→「${targetUnit.name}」破壊`);roomTriggerDestroyEffect(room,targetUnit,p);room.life[p]+=cost;roomAddLog(room,p,`→自分ライフ+${cost}`);break;}
    case "SUM_A_PERM-2":targetUnit.atk=Math.max(0,targetUnit.atk-2);roomAddLog(room,p,`「${pt.card}」召喚時：「${targetUnit.name}」ATK-2`);if(pt.pendingNext)room.pendingNext=pt.pendingNext;break;
    case "SUM_UNIT_A_PERM+1":targetUnit.atk+=1;roomAddLog(room,p,`「${pt.card}」召喚時：「${targetUnit.name}」ATK+1`);if(pt.pendingNext)room.pendingNext=pt.pendingNext;break;
    case "L_SELF-1_A+3":targetUnit.atk+=3;roomAddLog(room,p,`「${pt.card}」→「${targetUnit.name}」ATK+3`);break;
    case "SCRAP_BUILD_C3":{if(roomGetAttr(targetUnit.name)!=="steel"){socket.emit("message","鉄ユニットを選択してください");room.pendingTarget={player:p,effect:"SCRAP_BUILD_C3",card:pt.card};socket.emit("selectTarget",{type:"myUnit",message:"鉄ユニットを選択"});roomSend(room);return;}const vh=room.hands[p].filter(n=>roomGetAttr(n)==="steel"&&(cards[n]?.cost||0)<=3&&cards[n]?.type==="unit");if(vh.length===0){socket.emit("message","手札にコスト3以下の鉄ユニットがいません");roomSend(room);return;}room.board[p].splice(targetIndex,1);room.graves[p].push(targetUnit);roomAddLog(room,p,`スクラップ：「${targetUnit.name}」を破壊`);roomTriggerDestroyEffect(room,targetUnit,p);room.pendingTarget={player:p,effect:"SCRAP_BUILD_HAND",card:pt.card};socket.emit("selectTarget",{type:"handUnit_steel_cost3",message:"召喚するコスト3以下の鉄ユニットを選択"});roomSend(room);return;}
    case "IRON_DES_UNIT_DES_STEP1":{if(roomGetAttr(targetUnit.name)!=="steel"){socket.emit("message","鉄ユニットを選択してください");room.pendingTarget={player:p,effect:"IRON_DES_UNIT_DES_STEP1",card:pt.card};socket.emit("selectTarget",{type:"myUnit",message:"鉄ユニットを選択"});roomSend(room);return;}room.board[p].splice(targetIndex,1);room.graves[p].push(targetUnit);roomAddLog(room,p,`自爆：「${targetUnit.name}」を破壊`);roomTriggerDestroyEffect(room,targetUnit,p);room.pendingTarget={player:p,effect:"IRON_DES_UNIT_DES_STEP2",card:pt.card};socket.emit("selectTarget",{type:"enemyUnit",message:"破壊する相手ユニットを選択"});roomSend(room);return;}
    case "IRON_DES_UNIT_DES_STEP2":room.board[op].splice(targetIndex,1);room.graves[op].push(targetUnit);roomAddLog(room,p,`爆発：「${targetUnit.name}」を破壊`);roomTriggerDestroyEffect(room,targetUnit,op);break;
    case "SUM_IRON_DES_A+":{if(roomGetAttr(targetUnit.name)!=="steel"||targetUnit.name===pt.card){socket.emit("message","自分以外の鉄ユニットを選択してください");room.pendingTarget={player:p,effect:"SUM_IRON_DES_A+",card:pt.card};socket.emit("selectTarget",{type:"myUnit",message:"鉄ユニットを選択"});roomSend(room);return;}const ga=targetUnit.atk;room.board[p].splice(targetIndex,1);room.graves[p].push(targetUnit);roomAddLog(room,p,`「${pt.card}」→「${targetUnit.name}」破壊（ATK${ga}獲得）`);roomTriggerDestroyEffect(room,targetUnit,p);const cv=room.board[p].find(u=>u.name===pt.card);if(cv)cv.atk+=ga;break;}
    case "SUM_TOKEN_DES_UNIT_DMG2":case "SUM_TOKEN_DES_UNIT_DMG2_STEP1":{if(!targetUnit.isToken||roomGetAttr(targetUnit.name)!=="steel"){socket.emit("message","ギアトークンを選択してください");room.pendingTarget={player:p,effect:"SUM_TOKEN_DES_UNIT_DMG2",card:pt.card};socket.emit("selectTarget",{type:"myUnit",message:"ギアトークンを選択"});roomSend(room);return;}room.board[p].splice(targetIndex,1);room.graves[p].push(targetUnit);roomAddLog(room,p,`「${pt.card}」：ギアトークンを破壊`);room.pendingTarget={player:p,effect:"SUM_TOKEN_DES_UNIT_DMG2_STEP2",card:pt.card};socket.emit("selectTarget",{type:"enemyUnit",message:"2ダメージを与える相手ユニットを選択"});roomSend(room);return;}
    case "SUM_TOKEN_DES_UNIT_DMG2_STEP2":{const ad2=targetUnit.damageReduce?1:2;targetUnit.hp-=ad2;roomAddLog(room,p,`「${pt.card}」→「${targetUnit.name}」に${ad2}ダメージ`);if(targetUnit.hp<=0){room.board[op].splice(targetIndex,1);room.graves[op].push(targetUnit);roomAddLog(room,p,`→「${targetUnit.name}」を破壊`);roomTriggerDestroyEffect(room,targetUnit,op);}break;}
    case "SUM_DES_SUM_C2":{if(targetUnit.name===pt.card){socket.emit("message","自分自身は選択できません");room.pendingTarget={player:p,effect:"SUM_DES_SUM_C2",card:pt.card};socket.emit("selectTarget",{type:"myUnit",message:"破壊するユニットを選択（自分以外）"});roomSend(room);return;}room.board[p].splice(targetIndex,1);room.graves[p].push(targetUnit);roomAddLog(room,p,`「${pt.card}」→「${targetUnit.name}」破壊`);roomTriggerDestroyEffect(room,targetUnit,p);room.pendingTarget={player:p,effect:"SUM_DES_SUM_C2_HAND",card:pt.card};socket.emit("selectTarget",{type:"handUnit_cost2",message:"コスト2以下のユニットを召喚"});roomSend(room);return;}
    case "UNIT_DES_SUM_C2":room.board[p].splice(targetIndex,1);room.graves[p].push(targetUnit);roomAddLog(room,p,`「${pt.card}」→「${targetUnit.name}」破壊`);roomTriggerDestroyEffect(room,targetUnit,p);room.pendingTarget={player:p,effect:"UNIT_DES_SUM_C2_HAND",card:pt.card};socket.emit("selectTarget",{type:"handUnit_cost2",message:"コスト2以下のユニットを召喚"});roomSend(room);return;
    case "UNIT_DES_SUM_C3":{room.board[p].splice(targetIndex,1);room.graves[p].push(targetUnit);roomAddLog(room,p,`「${pt.card}」→「${targetUnit.name}」破壊`);const lc=pt.card;roomTriggerDestroyEffect(room,targetUnit,p);if(room.pendingTarget&&room.pendingTarget.effect==="DES_SUMMON_C2_HAND"){room.pendingTarget.pendingNext={effect:"UNIT_DES_SUM_C3_HAND",card:lc,player:p};roomNotifyPendingTarget(room);roomSend(room);return;}room.pendingTarget={player:p,effect:"UNIT_DES_SUM_C3_HAND",card:lc};roomNotifyPendingTarget(room);roomSend(room);return;}
    case "FUSION_IRON2_STEP1":{if(roomGetAttr(targetUnit.name)!=="steel"){socket.emit("message","鉄ユニットを選択してください");room.pendingTarget={player:p,effect:"FUSION_IRON2_STEP1",card:pt.card,selected:[]};socket.emit("selectTarget",{type:"myUnit",message:"1体目の鉄ユニットを選択"});roomSend(room);return;}room.pendingTarget={player:p,effect:"FUSION_IRON2_STEP2",card:pt.card,selected:[targetIndex]};socket.emit("selectTarget",{type:"myUnit",message:"2体目の鉄ユニットを選択"});roomSend(room);return;}
    case "FUSION_IRON2_STEP2":{if(roomGetAttr(targetUnit.name)!=="steel"){socket.emit("message","鉄ユニットを選択してください");room.pendingTarget={player:p,effect:"FUSION_IRON2_STEP2",card:pt.card,selected:pt.selected};socket.emit("selectTarget",{type:"myUnit",message:"2体目の鉄ユニットを選択"});roomSend(room);return;}if(pt.selected.includes(targetIndex)){socket.emit("message","同じユニットは選択できません");room.pendingTarget={player:p,effect:"FUSION_IRON2_STEP2",card:pt.card,selected:pt.selected};socket.emit("selectTarget",{type:"myUnit",message:"別のユニットを選択"});roomSend(room);return;}const idxs=[...pt.selected,targetIndex].sort((a,b)=>b-a);let fa=0,fh=0;idxs.forEach(i=>{const d=room.board[p].splice(i,1)[0];fa+=d.atk;fh+=d.hp;room.graves[p].push(d);roomAddLog(room,p,`フュージョン：「${d.name}」破壊`);roomTriggerDestroyEffect(room,d,p);});room.pendingTarget={player:p,effect:"FUSION_IRON2_HAND",card:pt.card,fusionBonusAtk:fa,fusionBonusHp:fh};socket.emit("selectTarget",{type:"handUnit_steel",message:`鉄ユニットを召喚（ATK+${fa}/HP+${fh}）`});roomSend(room);return;}
    case "DES_PERM_SPELL":{const tgt=data.fieldSpellTarget;const tp=tgt==="my"?p:op;if(!room.fieldSpell[tp]){socket.emit("message","対象のフィールドスペルがありません");room.pendingTarget=pt;socket.emit("selectTarget",{type:"fieldSpell",message:"崩壊：破壊するフィールドスペルを選択"});roomSend(room);return;}roomDestroyFieldSpell(room,tp);room.pendingTarget=null;break;}

case "SUM_H_C3X2_STEP1":
case "SUM_H_C3X2_STEP2":{
const hc3=room.hands[p][data.handIndex];
const sn=eff==="SUM_H_C3X2_STEP1"?1:2;
if(!hc3||cards[hc3]?.type!=="unit"||(cards[hc3]?.cost||0)>3){
socket.emit("message","コスト3以下のユニットを選択してください");
room.pendingTarget=pt;
socket.emit("selectTarget",{type:"handUnit_cost3",message:`${sn}体目：コスト3以下のユニットを選択`});roomSend(room);return;}room.hands[p].splice(data.handIndex,1);const hcc=cards[hc3];if(room.board[p].length<3){const nu={name:hc3,atk:hcc.atk,hp:hcc.hp,attacked:false,attr:hcc.attr||"neutral",damageReduce:hcc.effect==="DAMAGE_REDUCE_1"};room.board[p].push(nu);roomApplyFieldSpellOnSummon(room,nu,p);roomAddLog(room,p,`シードスポーン：「${hc3}」を召喚`);roomTriggerSummonEffect(room,nu,p,socket);}if(sn===1){const vv2=room.hands[p].filter(n=>cards[n]?.type==="unit"&&(cards[n]?.cost||0)<=3);if(vv2.length>0&&room.board[p].length<3){room.pendingTarget={player:p,effect:"SUM_H_C3X2_STEP2",card:pt.card};socket.emit("selectTarget",{type:"handUnit_cost3",message:"2体目：コスト3以下のユニットを選択"});roomSend(room);return;}}break;}
    default: break;
  }
  if(!room.pendingTarget&&room.pendingNext){const nxt=room.pendingNext;room.pendingNext=null;room.pendingTarget={player:nxt.player,effect:nxt.effect,card:nxt.card};roomNotifyPendingTarget(room);}
  roomSend(room);
}

// ルーム対戦のattack処理
function roomHandleAttack(room, socket, data){
  const p=socket.id;
  const op=roomGetOpponent(room,p);
  if(room.noAttack[p]){socket.emit("message","先攻1ターン目は攻撃できません");return;}
  const atk=room.board[p][data.a];
  if(!atk) return;
  const isDirect=data.t===undefined&&data.target!=="fieldSpell";
  if(isDirect&&room.board[op].length>0){socket.emit("message","相手ユニットがいる場合直接攻撃できません");roomSend(room);return;}
  if(atk.disabled){socket.emit("message","このユニットは行動不能です");return;}
  const hasDenko=atk.denko===true;
  if(atk.attacked){if(hasDenko&&!atk.denkoAttackedThisTurn){}else{socket.emit("message","このユニットはすでに攻撃済みです");return;}}
  const atkCard=cards[atk.name];
  const isAllAttack=atkCard&&atkCard.effect==="ALL_ATTACK";
  if(isAllAttack&&room.board[op].length>0){
    const isSecA=atk.attacked&&hasDenko&&!atk.denkoAttackedThisTurn;
    const isDFirst=hasDenko&&!isSecA;
    if(isSecA){atk.attacked=true;atk.denkoAttackedThisTurn=true;}else{atk.attacked=true;}
    const ap=isSecA?Math.floor(atk.atk/2):atk.atk;
    let tc=0;const td=[];
    room.board[op].forEach((def,i)=>{
      const ad=def.damageReduce?Math.min(1,ap):ap;const bb=def.barrier;const rd=bb?0:ad;def.hp-=rd;
      const nr=!!(room.fieldSpell[p]&&cards[room.fieldSpell[p].name]?.effect==="PERM_SPELL_THUNDER_NOREFLECT");
      if(!isDFirst&&!nr){const cd=atk.damageReduce?Math.min(1,Math.floor(def.atk/2)):Math.floor(def.atk/2);tc+=cd;}
      if(def.hp<=0)td.push(i);
      roomAddLog(room,p,`「${atk.name}」が「${def.name}」に全体攻撃（${rd}ダメージ）`);
    });
    const aa=roomGetAttr(atk.name)||"neutral";
    // 全体攻撃：相手の全ユニットに被弾エフェクト（破壊前の枚数分）
    const hitCountAll=room.board[op].length;
    for(let _hi=0;_hi<hitCountAll;_hi++){
      const ops_=io.sockets.sockets.get(op);
      if(ops_) ops_.emit("hitEffect",{targetIdx:_hi,attr:aa,isEnemy:false});
      const atk_s=io.sockets.sockets.get(p);
      if(atk_s) atk_s.emit("hitEffect",{targetIdx:_hi,attr:aa,isEnemy:true});
    }
    td.reverse().forEach(i=>{const d=room.board[op].splice(i,1)[0];
if(!d.isToken)room.graves[op].push(d);roomAddLog(room,p,`→「${d.name}」を撃破`);roomTriggerDestroyEffect(room,d,op);});
    atk.hp-=tc;if(tc>0)roomAddLog(room,p,`「${atk.name}」が反撃${tc}ダメージ`);
    if(atk.hp<=0){const ai=room.board[p].indexOf(atk);if(ai!==-1){room.board[p].splice(ai,1);if(!atk.isToken)room.graves[p].push(atk);roomAddLog(room,p,`→「${atk.name}」が倒れた`);roomTriggerDestroyEffect(room,atk,p);}}
    roomNotifyPendingTarget(room);roomSend(room);return;
  }
  const isSecond=atk.attacked&&hasDenko&&!atk.denkoAttackedThisTurn;
  const isDFirst=hasDenko&&!isSecond;
  if(isSecond){atk.attacked=true;atk.denkoAttackedThisTurn=true;}else{atk.attacked=true;}
  // フィールドスペルへの攻撃
  if(data.target==="fieldSpell"&&room.fieldSpell[op]){
    const fs=room.fieldSpell[op];const ap=isSecond?Math.floor(atk.atk/2):atk.atk;
    fs.durability-=ap;if(ap>0)roomSendDamagePop(room,op,ap,false,-2);
    roomAddLog(room,p,`「${atk.name}」がFS「${fs.name}」に${ap}ダメ（残耐久${Math.max(0,fs.durability)}）`);
    if(fs.durability<=0)roomDestroyFieldSpell(room,op);
    (room.spectators||[]).forEach(sid=>{const ss=io.sockets.sockets.get(sid);if(ss)ss.emit("hitEffect",{targetIdx:-1,attr:roomGetAttr(atk.name)||"neutral",attackerIdx:data.a,hasAttackAnim:true,isFieldSpell:true,attackerIsP1:socket.id===room.player1});});
    const atkAttrFS=roomGetAttr(atk.name)||"neutral";
    const opSockFS=io.sockets.sockets.get(op);
    if(opSockFS)opSockFS.emit("hitEffect",{targetIdx:-1,attr:atkAttrFS,attackerIdx:data.a,hasAttackAnim:true,isFieldSpell:true});
    socket.emit("hitEffect",{targetIdx:-2,attr:atkAttrFS,isEnemy:true,isFieldSpell:true});
    (room.spectators||[]).forEach(sid=>{const ss=io.sockets.sockets.get(sid);if(ss)ss.emit("hitEffect",{targetIdx:-1,attr:atkAttrFS,attackerIdx:data.a,hasAttackAnim:true,isFieldSpell:true,attackerIsP1:socket.id===room.player1});});
    if(atkCard&&atkCard.attackEffect){roomShowEffect(room,atk.name);if(atkCard.attackEffect==="L_DMG1"){roomDamageLife(room,op,1);roomAddLog(room,p,`攻撃時効果：相手ライフ-1`);}if(atkCard.attackEffect==="ATTACK_HEAL_DMG"){room.life[p]+=ap;roomAddLog(room,p,`攻撃時効果：自分ライフ+${ap}`);}if(atkCard.attackEffect==="ALL_UNIT_DMG1"){roomDamageAllUnits(room,op,1,p);roomAddLog(room,p,`攻撃時効果：相手全体1ダメ`);}}
    roomNotifyPendingTarget(room);roomSend(room);return;
  }
  if(room.board[op].length>0){
    if(atkCard&&atkCard.attackEffect==="ALL_UNIT_DMG1"&&!atk.rollbackAttack){
      roomShowEffect(room,atk.name);
      const tbef=room.board[op][data.t];
      roomDamageAllUnits(room,op,1,p);
      roomAddLog(room,p,`「${atk.name}」攻撃時効果：相手全体1ダメ`);
      const still=tbef&&room.board[op].includes(tbef);
      if(!still){
        socket.emit("attackRollback",{attackerIndex:data.a});
        atk.rollbackAttack=true;
        if(isSecond){atk.attacked=true;atk.denkoAttackedThisTurn=false;}else if(isDFirst){atk.attacked=false;}else{atk.attacked=false;}
        roomNotifyPendingTarget(room);roomSend(room);return;
      }
    }
    const def=room.board[op][data.t];if(!def){roomSend(room);return;}
    const ap=isSecond?Math.floor(atk.atk/2):atk.atk;
    let aad=def.damageReduce?Math.min(1,ap):ap;if(def.barrier)aad=0;
    const nr=!!(room.fieldSpell[p]&&cards[room.fieldSpell[p].name]?.effect==="PERM_SPELL_THUNDER_NOREFLECT");
    const cb=(isDFirst||nr)?0:Math.floor(def.atk/2);const add=atk.damageReduce?Math.min(1,cb):cb;
    def.hp-=aad;atk.hp-=add;
    if(aad>0)roomSendDamagePop(room,op,aad,false,data.t);
    if(add>0)roomSendDamagePopAttacker(room,p,add,data.a);
    roomAddLog(room,p,`「${atk.name}」→「${def.name}」（${aad}ダメ、反撃${add}）`);
    const aa2=roomGetAttr(atk.name)||"neutral";
    const ops=io.sockets.sockets.get(op);if(ops)ops.emit("hitEffect",{targetIdx:data.t,attr:aa2,attackerIdx:data.a,hasAttackAnim:true});
    socket.emit("hitEffect",{targetIdx:data.t,attr:aa2,isEnemy:true});
    (room.spectators||[]).forEach(sid=>{const ss=io.sockets.sockets.get(sid);if(ss)ss.emit("hitEffect",{targetIdx:data.t,attr:aa2,attackerIdx:data.a,hasAttackAnim:true,attackerIsP1:socket.id===room.player1});});
    if(def.hp<=0){
      if(room.fieldSpell[p]&&cards[room.fieldSpell[p].name]?.effect==="PERM_SPELL_FIRE_OVERFLOW"){const ov=ap-def.atk;if(ov>0){roomDamageLife(room,op,ov);roomAddLog(room,p,`灼熱地獄：${ov}ダメ`);}}
      room.board[op].splice(data.t,1);if(!def.isToken)room.graves[op].push(def);roomAddLog(room,p,`→「${def.name}」を撃破`);roomTriggerDestroyEffect(room,def,op);
      if(room.pendingTarget&&room.pendingTarget.effect==="DES_SUMMON_C2_HAND"){const os2=io.sockets.sockets.get(room.pendingTarget.player);if(os2){os2.emit("selectTarget",{type:"handUnit_cost2",message:"グロウコア：コスト2以下のユニットを召喚"});socket.emit("message","相手がグロウコアの効果を処理中...");}}
    }
    if(atk.hp<=0){const ai=room.board[p].indexOf(atk);if(ai!==-1){room.board[p].splice(ai,1);if(!atk.isToken)room.graves[p].push(atk);roomAddLog(room,p,`→「${atk.name}」が反撃で倒れた`);roomTriggerDestroyEffect(room,atk,p);}}
    if(atkCard&&atkCard.attackEffect&&!atk.rollbackAttack&&atkCard.attackEffect!=="ALL_UNIT_DMG1")roomShowEffect(room,atk.name);
    if(atkCard&&atkCard.attackEffect==="L_DMG1"){roomDamageLife(room,op,1);roomAddLog(room,p,`攻撃時効果：ライフ-1`);}
    if(atkCard&&atkCard.attackEffect==="HAN1"){if(room.hands[op].length>=2){const d=roomDiscardRandom(room,op);roomAddLog(room,p,`攻撃時効果：相手手札「${d||"なし"}」破棄`);const sh=io.sockets.sockets.get(p);if(sh&&d)sh.emit("message",`相手の手札「${d}」が捨て場に送られました`);}else{roomAddLog(room,p,`攻撃時効果：ハンデス不発`);}}
    if(atkCard&&atkCard.attackEffect==="ATTACK_HEAL_DMG"){room.life[p]+=aad;roomAddLog(room,p,`攻撃時効果：自分ライフ+${aad}`);}
  }else{
    const ap=isSecond?Math.floor(atk.atk/2):atk.atk;
    roomDamageLife(room,op,ap);
    roomAddLog(room,p,`「${atk.name}」で直接攻撃（${ap}ダメ、相手ライフ${room.life[op]}）`);
    const ops2=io.sockets.sockets.get(op);if(ops2)ops2.emit("hitEffect",{targetIdx:-1,attr:roomGetAttr(atk.name)||"neutral",attackerIdx:data.a,hasAttackAnim:true,isDirect:true});
    (room.spectators||[]).forEach(sid=>{const ss=io.sockets.sockets.get(sid);if(ss)ss.emit("hitEffect",{targetIdx:-1,attr:roomGetAttr(atk.name)||"neutral",attackerIdx:data.a,hasAttackAnim:true,isDirect:true,attackerIsP1:socket.id===room.player1});});
    if(atkCard&&atkCard.attackEffect&&!atk.rollbackAttack)roomShowEffect(room,atk.name);
    if(atkCard&&atkCard.attackEffect==="L_DMG1"){roomDamageLife(room,op,1);roomAddLog(room,p,`攻撃時効果：ライフ-1`);}
    if(atkCard&&atkCard.attackEffect==="HAN1"){if(room.hands[op].length>=2){const d=roomDiscardRandom(room,op);roomAddLog(room,p,`攻撃時効果：相手手札「${d||"なし"}」破棄`);const sh=io.sockets.sockets.get(p);if(sh&&d)sh.emit("message",`相手の手札「${d}」が捨て場に送られました`);}else{roomAddLog(room,p,`攻撃時効果：ハンデス不発`);}}
    if(atkCard&&atkCard.attackEffect==="ATTACK_HEAL_DMG"){room.life[p]+=ap;roomAddLog(room,p,`攻撃時効果：自分ライフ+${ap}`);}
  }
  roomNotifyPendingTarget(room);roomSend(room);
}

// ルームソケット処理
io.on("connection",(socket)=>{
  // ルーム作成
  socket.on("createRoom",(data)=>{
    const roomId=data.roomId;
    if(!roomId||roomId.trim()===""){socket.emit("roomError","ルームIDを入力してください");return;}
    if(rooms[roomId]){socket.emit("roomError","そのルームIDはすでに使用されています");return;}
    const spectateId=generateSpectateId();
    rooms[roomId]={
      roomId,spectateId,
      player1:socket.id,player2:null,
      spectators:[],
      customDeck:{},
      board:{},hands:{},decks:{},graves:{},
      energy:{},maxEnergy:{},life:{},winner:null,
      noAttack:{},pendingDiscard:{},turnBuffs:{},
      pendingHandLimitDiscard:null,pendingNext:null,fieldSpell:{},
      allLogs:[],turnLogs:{},prevLogs:{},turn:null,firstPlayer:null
    };
    rooms[roomId].customDeck[socket.id]=data.deck||[];
    socket.join("room_"+roomId);
    socket.emit("roomCreated",{roomId,spectateId,playerRole:"p1"});
  });

  // ルーム参加
  socket.on("joinRoom",(data)=>{
    const roomId=data.roomId;
    const room=rooms[roomId];
    if(!room){socket.emit("roomError","ルームが見つかりません");return;}
    if(room.player2){socket.emit("roomError","そのルームはすでに満員です");return;}
    room.player2=socket.id;
    room.customDeck[socket.id]=data.deck||[];
    socket.join("room_"+roomId);
    socket.emit("roomJoined",{roomId,spectateId:room.spectateId,playerRole:"p2"});
    // 両プレイヤー揃ったらゲーム開始
    roomResetGame(room);
    roomSend(room);
  });

  // 観戦参加
  socket.on("joinSpectate",(data)=>{
    const spectateId=data.spectateId;
    const room=getRoomBySpectateId(spectateId);
    if(!room){socket.emit("roomError","観戦IDが正しくありません");return;}
    room.spectators=room.spectators||[];
    room.spectators.push(socket.id);
    socket.join("room_"+room.roomId);
    socket.emit("spectateJoined",{roomId:room.roomId,spectateId,playerRole:"spectator"});
    roomSend(room);
  });

  // ルームアクション
  socket.on("roomAction",(data)=>{
    // どのルームか特定
    let room=null;
    for(const r of Object.values(rooms)){
      if(r.player1===socket.id||r.player2===socket.id){room=r;break;}
    }
    // resetと surrenderはwinnerチェック前に処理
    if(data.type==="reset"){
      // deckが送られた場合のみ更新、なければ前回のcustomDeckをそのまま使用
      if(data.deck&&data.deck.length>0) room.customDeck[socket.id]=data.deck;
      if(!room.readyForRematch) room.readyForRematch={};
      room.readyForRematch[socket.id]=true;
      const bothReady=!!(room.player1&&room.player2&&
        room.readyForRematch[room.player1]&&room.readyForRematch[room.player2]);
      if(bothReady){
        room.readyForRematch={};
        roomResetGame(room);
        roomSend(room);
      }else{
        const op2=roomGetOpponent(room,socket.id);
        const ops=io.sockets.sockets.get(op2);
        if(ops)ops.emit("rematchReady",{msg:"相手が再戦準備完了しました。あなたも「このルームで再戦」を押してください。"});
        socket.emit("rematchWaiting",{msg:"相手の準備を待っています..."});
      }
      return;
    }
    if(!room||room.winner) return;
    const op=roomGetOpponent(room,socket.id);
    if(data.type==="surrender"){room.winner=op;roomAddLog(room,socket.id,"降参しました");roomSend(room);return;}
    if(socket.id!==room.turn){
      if(data.type==="select_target"&&room.pendingTarget&&room.pendingTarget.player===socket.id){}
      else return;
    }
    if(data.type==="discard_hand"){
      if((room.pendingDiscard[socket.id]||0)<=0)return;
      const idx=room.hands[socket.id].indexOf(data.card);if(idx===-1)return;
      room.hands[socket.id].splice(idx,1);room.graves[socket.id].push({name:data.card});
      room.pendingDiscard[socket.id]--;
      roomAddLog(room,socket.id,`手札「${data.card}」を捨てた`);
      if(room.pendingHandLimitDiscard===socket.id&&(room.pendingDiscard[socket.id]||0)===0){
        if(room.hands[socket.id].length<=7){room.pendingHandLimitDiscard=null;room.noAttack[socket.id]=false;room.prevLogs[socket.id]=[...(room.turnLogs[socket.id]||[])];room.turnLogs[socket.id]=[];room.turn=op;roomStartTurn(room,room.turn);roomNotifyPendingTarget(room);roomSend(room);return;}
      }
      roomSend(room);return;
    }
    if(data.type==="attack"){roomHandleAttack(room,socket,data);return;}
    if(data.type==="select_target"){roomHandleSelectTarget(room,socket,data);return;}
    if(data.type==="play_card"){
      const c=cards[data.card];
      if(room.energy[socket.id]<c.cost){socket.emit("message","エネルギーが不足しています");return;}
      if(c.type==="unit"&&room.board[socket.id].length>=3){socket.emit("message","場に出せるユニットは3体までです");return;}
      room.energy[socket.id]-=c.cost;
      const idx=room.hands[socket.id].indexOf(data.card);room.hands[socket.id].splice(idx,1);
      if(c.type==="unit"){
        const unit={name:data.card,atk:c.atk,hp:c.hp,attacked:false,attr:c.attr||"neutral",damageReduce:c.effect==="DAMAGE_REDUCE_1"};
        room.board[socket.id].push(unit);
        roomAddLog(room,socket.id,`「${data.card}」を召喚（ATK${unit.atk}/HP${unit.hp}）`);
        roomApplyFieldSpellOnSummon(room,unit,socket.id);
        roomTriggerSummonEffect(room,unit,socket.id,socket);
      }else{
        const handled=roomProcessSpellEffect(room,data.card,socket.id,socket);
        if(handled===false){room.energy[socket.id]+=c.cost;room.hands[socket.id].push(data.card);}
        else{roomAddLog(room,socket.id,`スペル「${data.card}」を使用`);roomShowEffect(room,data.card,true);if(c.effect!=="PERM_SPELL_WATER_ENERGY"&&c.effect!=="PERM_SPELL_HERB_HEAL"&&c.effect!=="PERM_SPELL_FOREST_BUFF"&&c.effect!=="PERM_SPELL_IRON_FACTORY"&&c.effect!=="PERM_SPELL_FIRE_OVERFLOW"&&c.effect!=="PERM_SPELL_THUNDER_NOREFLECT"&&c.effect!=="PERM_SPELL_DARK_DEBUFF"){room.graves[socket.id].push({name:data.card});}}
      }
      roomNotifyPendingTarget(room);roomSend(room);return;
    }
    if(data.type==="end_turn"){
      if(room.turnBuffs[socket.id]&&room.turnBuffs[socket.id].atk>0){room.board[socket.id].forEach(u=>u.atk-=room.turnBuffs[socket.id].atk);room.turnBuffs[socket.id].atk=0;}
      if(room.board[socket.id].some(u=>u.overloadMark)){const as=[...room.board[socket.id].filter(u=>roomGetAttr(u.name)==="steel")];as.forEach(u=>{const i=room.board[socket.id].indexOf(u);if(i!==-1){room.board[socket.id].splice(i,1);room.graves[socket.id].push(u);roomAddLog(room,socket.id,`オーバーロード：「${u.name}」破壊`);roomTriggerDestroyEffect(room,u,socket.id);}});}
      room.board[socket.id].forEach(u=>{if(u.disabledCount!==undefined&&u.disabledCount>0){u.disabledCount--;if(u.disabledCount<=0){u.disabled=false;delete u.disabledCount;}}});
      room.board[op].forEach(u=>{if(u.barrier)u.barrier=false;});
      const bo=room.board[socket.id].filter(u=>u.burnout);bo.forEach(u=>{const i=room.board[socket.id].indexOf(u);room.board[socket.id].splice(i,1);if(!u.isToken)room.graves[socket.id].push(u);roomTriggerDestroyEffect(room,u,socket.id);});
      room.board[socket.id].forEach(u=>{const c=cards[u.name];if(c&&c.effect==="END_A+1"){roomShowEffect(room,u.name);u.atk+=1;}});
      if(room.hands[socket.id].length>7){const ex=room.hands[socket.id].length-7;room.pendingDiscard[socket.id]=(room.pendingDiscard[socket.id]||0)+ex;room.pendingHandLimitDiscard=socket.id;const s=io.sockets.sockets.get(socket.id);if(s)s.emit("message",`手札が7枚を超えています。${ex}枚捨ててください`);roomNotifyPendingTarget(room);roomSend(room);return;}
      room.pendingHandLimitDiscard=null;
      room.noAttack[socket.id]=false;room.prevLogs[socket.id]=[...(room.turnLogs[socket.id]||[])];room.turnLogs[socket.id]=[];room.turn=op;
      roomStartTurn(room,room.turn);roomNotifyPendingTarget(room);roomSend(room);return;
    }
  });

  // 切断時：ルームから削除
  socket.on("disconnect",()=>{
    for(const [roomId,room] of Object.entries(rooms)){
      if(room.player1===socket.id||room.player2===socket.id){
        // 相手に通知
        const op2=room.player1===socket.id?room.player2:room.player1;
        const ops3=io.sockets.sockets.get(op2);
        if(ops3) ops3.emit("message","相手が切断しました");
        // 観戦IDを解放
        usedSpectateIds.delete(room.spectateId);
        delete rooms[roomId];
        break;
      }
      // 観戦者の切断
      if(room.spectators&&room.spectators.includes(socket.id)){
        room.spectators=room.spectators.filter(s=>s!==socket.id);
      }
    }
  });
});

http.listen(3000);