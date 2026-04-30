const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static(__dirname));



// ★全カード（完全版）

const cards = {



//🔥火
"フレイムスパーク":{cost:1,atk:2,hp:1,type:"unit",attr:"fire",effect:"SUM_L_DMG1"},
"ファイアウルフ":{cost:1,atk:3,hp:1,type:"unit",attr:"fire"},
"ブレイズリザード":{cost:1,atk:2,hp:2,type:"unit",attr:"fire"},
"マグマウルフ":{cost:2,atk:3,hp:2,type:"unit",attr:"fire",destroyEffect:"L_DMG1"},
"フレイムナイト":{cost:2,atk:3,hp:3,type:"unit",attr:"fire",attackEffect:"L_DMG1"},
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

//🌿森
"フォレストラビット":{cost:1,atk:1,hp:2,type:"unit",attr:"forest",effect:"SUM_UNIT_A_PERM+1"},
"グリーンナイト":{cost:2,atk:3,hp:3,type:"unit",attr:"forest"},
"ウッドゴーレム":{cost:2,atk:1,hp:4,type:"unit",attr:"forest",effect:"SUM_A_PERM-2"},
"グロウコア":{cost:2,atk:2,hp:3,type:"unit",attr:"forest",destroyEffect:"DES_SUMMON_C2"},
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

//🌑闇
"シャドウバット":{cost:2,atk:2,hp:1,type:"unit",attr:"dark",effect:"SUM_R_HAN1"},
"ダークスライム":{cost:1,atk:1,hp:3,type:"unit",attr:"dark"},
"シャドウアサシン":{cost:3,atk:4,hp:2,type:"unit",attr:"dark",effect:"SUM_A_PERM-2"},
"ダークナイト":{cost:2,atk:3,hp:3,type:"unit",attr:"dark"},
"ナイトメアビースト":{cost:1,atk:2,hp:2,type:"unit",attr:"dark"},
"アビスナイト":{cost:3,atk:4,hp:4,type:"unit",attr:"dark"},
"ナイトリカー":{cost:3,atk:4,hp:3,type:"unit",attr:"dark",destroyEffect:"DES_BOTH_DISC1"},
"ダークサイフォナー":{cost:3,atk:4,hp:3,type:"unit",attr:"dark",effect:"SUM_OPP_E-1"},
"カースドラゴン":{cost:4,atk:5,hp:4,type:"unit",attr:"dark",attackEffect:"HAN1"},
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
"デスペレーション":{cost:3,type:"spell",attr:"dark",effect:"ALL_DISC2"},

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

//汎用
"ダブルドロー":{cost:1,type:"spell",attr:"neutral",effect:"DRAW2"},
"浄化の光":{cost:2,type:"spell",attr:"neutral",effect:"PURIFY"},
"リバース":{cost:3,type:"spell",attr:"neutral",effect:"BOUNCE_UNIT"}
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
  if(cardName==="シードトークン") return "forest";
  return cards[cardName]?.attr || "neutral";
}

// ★ドロー処理
function draw(p){
  if(game.decks[p].length===0){
    game.winner=getOpponent(p);
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
}

// ★場の全ユニットにダメージ（破壊チェック込み）
function damageAllUnits(targetPlayer, amount, attackerPlayer){
  const toDestroy=[];
  game.board[targetPlayer].forEach((u,i)=>{
    const dmg = u.damageReduce ? Math.min(1, amount) : amount;
    u.hp -= dmg;
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

// ★トークン召喚
function summonToken(p, tokenName, n){
  for(let i=0;i<n;i++){
    if(game.board[p].length>=3) break;
    const tokenAttr = tokenName==="ギアトークン"?"steel":"forest";
    game.board[p].push({name:tokenName, atk:1, hp:1, attacked:false, attr:tokenAttr, isToken:true});
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
    case "DES_SUMMON_C2":
      if(game.board[ownerPlayer].length<3){
        const validHand=game.hands[ownerPlayer].filter(name=>cards[name]?.type==="unit"&&(cards[name]?.cost||0)<=2);
        if(validHand.length>0){
          game.pendingTarget={player:ownerPlayer,effect:"DES_SUMMON_C2_HAND",card:unit.name};
          addLog(logPlayer,`「${unit.name}」破壊時効果：コスト2以下ユニットを召喚できます`);
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
    case "HAN1_DRAW1":
      { const discarded=discardRandom(op);
        draw(p);
        addLog(p,`「${cardName}」で相手手札「${discarded||"なし"}」を破棄、自分1枚ドロー`);
        const _s2=io.sockets.sockets.get(p);
        if(_s2&&discarded) _s2.emit("message",`相手の手札「${discarded}」が捨て場に送られました`);
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
      { const discarded=discardRandom(op);
        addLog(p,`「${cardName}」で相手エネルギー-1、相手手札「${discarded||"なし"}」破棄`);
        const _s3=io.sockets.sockets.get(p);
        if(_s3&&discarded) _s3.emit("message",`相手の手札「${discarded}」が捨て場に送られました`);
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
    case "PURIFY":
      if(game.board[p].length===0){socket.emit("message","対象ユニットがいません");return false;}
      game.pendingTarget={player:p, effect:eff, card:cardName};
      socket.emit("selectTarget",{type:"myUnit", message:`「${cardName}」の対象を選択してください`});
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

    // 浄化の光（PURIFY・既にフェーズ2で実装済み、ここでは不要）

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
  // ターンバフは end_turn 時にリセット済みなので、ここでは初期化のみ
  game.turnBuffs[p]={atk:0};

  draw(p);
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
}

function resetGame(){
  if(!game.player1||!game.player2)return;
  game.board={};game.hands={};game.decks={};
  game.graves={};game.energy={};game.maxEnergy={};
  game.life={};game.winner=null;game.noAttack={};
  game.pendingDiscard={};game.turnBuffs={};game.pendingHandLimitDiscard=null;game.pendingNext=null;
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
          // 反撃（電光石火1回目は反撃なし）
          if(!isDenkoFirstAll){
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
        // 電光石火1回目は反撃なし
        const counterBase=isDenkoFirst?0:Math.floor(def.atk/2);
        const actualDefDmg=atk.damageReduce?Math.min(1,counterBase):counterBase;

        def.hp-=actualAtkDmg;
        atk.hp-=actualDefDmg;

        addLog(socket.id,`「${atk.name}」で「${def.name}」に攻撃（${actualAtkDmg}ダメージ、反撃${actualDefDmg}ダメージ）`);
        // ★被弾エフェクト：防御側プレイヤーに送信
        { const atkAttrForHit=getAttr(atk.name)||"neutral";
          const opSock=io.sockets.sockets.get(op);
          if(opSock) opSock.emit("hitEffect",{targetIdx:data.t, attr:atkAttrForHit});
          // 攻撃者側の画面にも表示（自分が攻撃した相手に）
          socket.emit("hitEffect",{targetIdx:data.t, attr:atkAttrForHit, isEnemy:true});
        }

        if(def.hp<=0){
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
          const discarded=discardRandom(op);
          addLog(socket.id,`「${atk.name}」攻撃時効果：相手手札「${discarded||"なし"}」をランダム破棄`);
          const _sh=io.sockets.sockets.get(socket.id);
          if(_sh&&discarded) _sh.emit("message",`相手の手札「${discarded}」が捨て場に送られました`);
        }
        if(atkCard && atkCard.attackEffect==="ATTACK_HEAL_DMG"){
          game.life[socket.id]+=actualAtkDmg;
          addLog(socket.id,`「${atk.name}」攻撃時効果：自分ライフ+${actualAtkDmg}`);
        }

}else{
        const atkPower=isDenkoSecond?Math.floor(atk.atk/2):atk.atk;
        const dmg=atkPower;
        game.life[op]-=dmg;
        addLog(socket.id,`「${atk.name}」でプレイヤーに直接攻撃（${dmg}ダメージ、相手ライフ${game.life[op]}）`);
        if(game.life[op]<=0) game.winner=socket.id;
        if(atkCard && atkCard.attackEffect && !atk.rollbackAttack){
          showEffect(atk.name);
        }
        if(atkCard && atkCard.attackEffect==="HAN1"){
          const discarded=discardRandom(op);
          addLog(socket.id,`「${atk.name}」攻撃時効果：相手手札「${discarded||"なし"}」をランダム破棄`);
          const _sh=io.sockets.sockets.get(socket.id);
          if(_sh&&discarded) _sh.emit("message",`相手の手札「${discarded}」が捨て場に送られました`);
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
        if(!handCard||cards[handCard]?.type!=="unit"||(cards[handCard]?.cost||0)>costLimit||(steelOnly&&getAttr(handCard)!=="steel")){
          const msg=steelOnly?"鉄ユニットを選択してください":`コスト${costLimit}以下のユニットを選択してください`;
          socket.emit("message",msg);
          game.pendingTarget=pt;
          socket.emit("selectTarget",{type:"handUnit",message:msg});
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
          addLog(p,`「${pt.card}」で「${targetUnit.name}」の状態異常を回復`);
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
          // グロウコア破壊時：手札からコスト2以下召喚
          const handCard=game.hands[p][data.handIndex];
          if(!handCard||cards[handCard]?.type!=="unit"||(cards[handCard]?.cost||0)>2){
            socket.emit("message","コスト2以下のユニットを選択してください");
            game.pendingTarget={player:p,effect:"DES_SUMMON_C2_HAND",card:pt.card,pendingNext:pt.pendingNext};
            socket.emit("selectTarget",{type:"handUnit_cost2",message:"コスト2以下のユニットを選択してください"});
            send();return;
          }
          game.hands[p].splice(data.handIndex,1);
          const hc=cards[handCard];
          const newU={name:handCard,atk:hc.atk,hp:hc.hp,attacked:false,attr:hc.attr||"neutral",damageReduce:hc.effect==="DAMAGE_REDUCE_1"};
          game.board[p].push(newU);
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
          addLog(p,`「${pt.card}」：「${handCard}」を召喚`);
          triggerSummonEffect(newU,p,socket,io);
          break;
        }


        case "SUM_H_C3X2_STEP1":
        case "SUM_H_C3X2_STEP2":{
          const handCard=game.hands[p][data.handIndex];
          const stepNum=eff==="SUM_H_C3X2_STEP1"?1:2;
          if(!handCard||cards[handCard]?.type!=="unit"||(cards[handCard]?.cost||0)>3){
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
          game.graves[socket.id].push({name:data.card});
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

http.listen(3000);