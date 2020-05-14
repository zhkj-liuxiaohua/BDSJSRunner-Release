// 文件名：testcase
// 文件功能：测试附加功能是否正常

/******************************** 预处理设置区 ********************************/

// 表单事件处理器
var formcallback = {};
// 表单超时计时器
var timeouts = {};

// 临时状态
var tmpeff = "";

function getUuid(p) {
	let pl = getOnLinePlayers();
	if (pl != null) {
		let jpl = JSON.parse(pl);
		if (jpl != null) {
			for (let i = 0, l = jpl.length; i < l; i++) {
				let jp = jpl[i];
				if (jp.playername == p)	// 找到
					return jp.uuid;
            }
        }
	}
	return null;
}

const strtest = ['后台指令tell', '前缀/去前缀名', '穿墙能力开/关', '传送至梦之故里大厅', '跨维传送至末地祭坛', '模拟喊话', '模拟执行me指令',
	'查询当前状态至后台', '读当前属性值至后台', '攻击+10,生命+2,附命+2,抗飞+1,等级+5,食物+2', '读属性上限值至后台', '攻限+10,命限+10,食限+10',
	'读当前选中物品至后台', '给32个白桦木', '给1个附魔叉', '替换副手为一个叉子', '保存玩家所有物品列表至pit.json并清空',
	'读pit.json到当前玩家', '读玩家当前效果列表到后台', '设置玩家临时存储的效果列表', '显示欢迎一个血条', '清除欢迎血条',
	'导出当前位置+长宽高x10的结构到st1.json','读结构st1.json到当前位置'];

// 定义前缀、取消前缀
function cusName(p) {
	const pre = '[前缀]';
	let i = p.indexOf(pre);
	if (i > -1) {
		return p.substring(pre.length);
	}
	return pre + p;
}

// 针对某玩家进行测试
function testcasefunc(p) {
	let uuid = getUuid(p);
	if (uuid != null) {
		// 即将进入测试环节
		let ghandle = sendSimpleForm(uuid, '测试用例', '请在30秒内做出选择测试项：', JSON.stringify(strtest));
		let strhandle = "" + ghandle;
		timeouts[strhandle] = Date.now();	// 设置一个计时器
		formcallback[strhandle] = function (e) {
			timeouts[strhandle] = null;	// 撤计时器
			delete timeouts[strhandle];
			switch (e.selected) {
				case "0":
					runcmd('tell "' + p + '" 你好 js');
					break;
				case "1":
					reNameByUuid(uuid, cusName(p));
					break;
				case "2":
					{
						let sa = getPlayerAbilities(uuid);
						if (sa != null) {
							let ja = JSON.parse(sa);
							let cja = {};
							cja.noclip = !ja.noclip;
							setPlayerAbilities(uuid, JSON.stringify(cja));
                        }
					}
					break;
				case "3":
					transferserver(uuid, 'www.xiafox.com', 19132);
					break;
				case "4":
					teleport(uuid, 10, 99, 10, 2);
					break;
				case "5":
					talkAs(uuid, '你好 js');
					break;
				case "6":
					runcmdAs(uuid, '/me 你好 js');
					break;
				case "7":
					{
						let ope = selectPlayer(uuid);
						if (ope != null) {
							let opje = JSON.parse(ope);
							var str = '玩家 ' + opje.playername + ' 已于 ' + opje.dimension +
								' (' + opje.XYZ.x + ',' + opje.XYZ.y + ',' + opje.XYZ.z + ') 处被查询，当前生命值为'
								+ opje.health + '。';
							logout(str);
                        }
					}
					break;
				case "8":
					logout(getPlayerAttributes(uuid));
					break;
				case "9":
					{
						let sa = getPlayerAttributes(uuid);
						if (sa != null) {
							let ja = JSON.parse(sa);
							let cja = {};
							cja.attack_damage = ja.attack_damage + 10;
							cja.absorption = ja.absorption + 2;
							cja.health = ja.health + 2;
							cja.knockback_resistance = ja.knockback_resistance + 1;
							cja.level = ja.level + 5;
							cja.hunger = ja.hunger + 2;
							setPlayerAttributes(uuid, JSON.stringify(cja));
						}
                    }
					break;
				case "10":
					logout(getPlayerMaxAttributes(uuid));
					break;
				case "11":
					{
						let sa = getPlayerMaxAttributes(uuid);
						if (sa != null) {
							let ja = JSON.parse(sa);
							let cja = {};
							cja.maxattack_damage = ja.maxattack_damage + 10;
							cja.maxhealth = ja.maxhealth + 10;
							cja.maxhunger = ja.maxhunger + 10;
							setPlayerMaxAttributes(uuid, JSON.stringify(cja));
						}
					}
					break;
				case "12":
					logout(getPlayerSelectedItem(uuid));
					break;
				case "13":
						addPlayerItem(uuid, 17, 2, 32);
						break;
				case "14":
					{
						// tt - TAG_TYPE		标签数据类型，总计11种类型
						// tv - TAG_VALUE		标签值，由类型决定
						// ck - Compound_KEY	nbt关键字，字符串类型
						// cv - Compound_VALUE	nbt值，总是为一个TAG
						let jitem = {
							"tt": 10, "tv": [
								{ "ck": "Count", "cv": { "tt": 1, "tv": 1 } },
								{ "ck": "Damage", "cv": { "tt": 2, "tv": 0 } },
								{ "ck": "Name", "cv": { "tt": 8, "tv": "minecraft:trident" } },
								{ "ck": "tag", "cv": { "tt": 10, "tv": [
										{ "ck": "ench", "cv": { "tt": 9, "tv": [
											{ "tt": 10, "tv": [
														{ "ck": "id", "cv": { "tt": 2, "tv": 10 } },
														{ "ck": "lvl", "cv": { "tt": 2, "tv": 9999 } }]
											}]}
										}]}
								}]
						};
						addPlayerItemEx(uuid, JSON.stringify(jitem));
                    }
					break;
				case "15":
					{
						let jtem = {
							"Offhand": { "tt": 9, "tv": [
									{ "tt": 10, "tv": [
											{ "ck": "Count", "cv": { "tt": 1, "tv": 1 } },
											{ "ck": "Damage", "cv": { "tt": 2, "tv": 0 } },
											{ "ck": "Name", "cv": { "tt": 8, "tv": "minecraft:trident" } },
											{ "ck": "tag", "cv": { "tt": 10, "tv": [
														{ "ck": "ench", "cv": {
																"tt": 9, "tv": [
																	{ "tt": 10, "tv": [
																			{ "ck": "id", "cv": { "tt": 2, "tv": 7 } },
																			{ "ck": "lvl", "cv": { "tt": 2, "tv": 8888 } }]
																	}]}
														}]}
											}]
									}]}
						};
						setPlayerItems(uuid, JSON.stringify(jtem));
                    }
					break;
				case "16":
					{
						let its = getPlayerItems(uuid);
						fileWriteAllText('pit.json', its);
						// 此处使用空气填充末影箱
						let sair = '{"tt":10,"tv":[{"ck":"Count","cv":{"tt":1,"tv":0}},{"ck":"Damage","cv":{"tt":2,"tv":0}},{"ck":"Name","cv":{"tt":8,"tv":""}},{"ck":"Slot","cv":{"tt":1,"tv":0}}]}';
						//let air = { "tt": 10, "tv": [{ "ck": "Count", "cv": { "tt": 1, "tv": 0 } }, { "ck": "Damage", "cv": { "tt": 2, "tv": 0 } }, { "ck": "Name", "cv": { "tt": 8, "tv": "" } }, { "ck": "Slot", "cv": { "tt": 1, "tv": 0 } }] };
						let endc = {};
						endc.EnderChestInventory = {};
						endc.EnderChestInventory.tt = 9;	// Type ListTag
						endc.EnderChestInventory.tv = [];
						for (let i = 0; i < 27; i++) {
							let mair = JSON.parse(sair);
							if (mair.tv[3].ck == "Slot") {		// 此处需修改并应用
								mair.tv[3].cv.tv = i;
                            }
							endc.EnderChestInventory.tv.push(mair);
						}
						setPlayerItems(uuid, JSON.stringify(endc));
						runcmd('clear "' + p + '"');
					}
					break;
				case "17":
					{
						let its = fileReadAllText('pit.json');
						if (its != null) {
							setPlayerItems(uuid, its);
                        }
                    }
					break;
				case "18":
					{
						let efs = getPlayerEffects(uuid);
						tmpeff = efs;
						log(efs);
					}
					break;
				case "19":
					{
						setPlayerEffects(uuid, tmpeff);
					}
					break;
				case "20":
					setPlayerBossBar(uuid, '欢迎使用JSRunner自定义血条！', Math.random());
					break;
				case "21":
					removePlayerBossBar(uuid);
					break;
				case "22":
					{
						let posa = e.XYZ;
						let posb = {};
						posa.x = Number.parseInt(posa.x);
						posa.y = Number.parseInt(posa.y);
						posa.z = Number.parseInt(posa.z);
						posb.x = posa.x + 10;
						posb.y = posa.y + 10;
						posb.z = posa.z + 10;
						let data = getStructure(e.dimensionid, JSON.stringify(posa), JSON.stringify(posb), false, true);
						fileWriteAllText('st1.json', data);
                    }
					break;
				case "23":
					{
						let data = fileReadAllText('st1.json');
						setStructure(data, e.dimensionid, JSON.stringify(e.XYZ), 0, true, true);
                    }
					break;
				case "null":
					log('玩家' + p + '取消了选择测试项。');
					break;
			}
			formcallback[strhandle] = null;		// 撤回调处理
			delete formcallback[strhandle];
		};
		setTimeout(function () {	// 超时检测
			if (timeouts[strhandle] != null) {
				let nat = Date.now();
				log('当前待选择时间：' + nat + ',预设时间：' + timeouts[strhandle]);
				if (nat - timeouts[strhandle] > 30000) {
					// 超时
					log('玩家' + p + '的表单已超时, fid=' + strhandle);
					releaseForm(ghandle);
					formcallback[strhandle] = null;
					delete formcallback[strhandle];
					timeouts[strhandle] = null;
					delete timeouts[strhandle];
				}
			}
		}, 31000);
    }
}

function _testcase_trans(c, p) {
	let dc = c.trim();
	if (dc == '/testcase') {		// 进入检测环节
		setTimeout('testcasefunc("' + p + '")', 100);
		return false;
	}
	return true;
}

function resolve(e) {
	if (formcallback[e.formid] != null) {
		formcallback[e.formid](e);
    }
}

/******************************** 监听器设置区 ********************************/

// 设置GUI接收监听器
setAfterActListener('onFormSelect', function (e) {
	let je = JSON.parse(e);
	resolve(je);
});

setBeforeActListener('onInputCommand', function (e) {
    let je = JSON.parse(e);
	let r = _testcase_trans(je.cmd, je.playername);
	if (!r)
		return false;	// 直接拦截
	return true;
});

// 注册指令
setCommandDescribe('testcase', '测试附加功能是否正常');

log('testcase 已加载。用法(仅限玩家)：/testcase');