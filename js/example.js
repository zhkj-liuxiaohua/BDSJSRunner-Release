// 文件名：example.js
// 文件功能：示例简单的监控信息

function examplelog(e) {
	log('{' + e);
}
// 设置一个共享函数以供其它js文件调用
setShareData('FUCTION_EXLOG', examplelog);

// 待写入文本队列
var flogs = [];

// 取文本队列中文本并写入 使用延时方式调用此方法
function saveOneLog() {
	let x = flogs.shift();
	if (x != null) {
		fileWriteLine('jslog.txt', x);
	}
}

// 匿名方式设置攻击事件前监听器
setBeforeActListener('onAttack', function (e) {
	var je = JSON.parse(e);
	var str = '[测试]' + ' 玩家 ' + je.playername + ' 即将发动攻击。';
	examplelog(str);
	// 事件内随时可进行mc指令执行
	runcmd('title ' + je.playername + ' actionbar （测试）举起手来！');
	// 事件内随时可保存信息至外部文件
	flogs.push(str);
	setTimeout(saveOneLog, 1);
	// 事件内随时可读取外部信息文件或执行外部脚本
	// var outcmd = fileReadAllText('outjs.js');
	// runScript(outcmd);
	return true;	// 如果返回false，则表示拦截该事件的执行
});

// 匿名方式设置攻击事件后监听器
setAfterActListener('onAttack', function (e) {
	var je = JSON.parse(e);
	var sp = JSON.stringify(je.XYZ);
	var tnow = TimeNow();
	var str = '[' + tnow + ' AfterAttack] ' + '玩家 ' + je.playername + ' 在 ' +
		je.dimension + ' ' + sp + ' 处攻击了 ' + je.actortype + '。';
	examplelog(str);
	flogs.push(str);
	setTimeout(saveOneLog, 1);
});

// 命名函数，监听使用物品前事件
//function beforeOnUseItem(e){
//	var je = JSON.parse(e);
//	log(je.playername + '想要使用物品');
//	return true;	// 此处或可添加坐标判断实现禁使用物品操作
//}
// 设置使用物品前事件监听器
//setBeforeActListener('onUseItem', beforeOnUseItem);


// 命名函数，监听使用物品后事件
function afterUseItem(e) {
	var je = JSON.parse(e);
	if (je.result) {
		var tnow = TimeNow();
		var str = '[' + tnow + ' AfterUseItem] ' + '玩家 ' + je.playername +
			' 于(' + je.XYZ.x + ',' + je.XYZ.y + ',' + je.XYZ.z + ')位置' +
			(!je.isstand ? ' 悬空地' : '') + ' 在 ' + je.dimension +
			' (' + je.position.x + ',' + je.position.y + ',' + je.position.z + ') 处使用了 '
			+ je.itemname + ' 物品。';
		examplelog(str);
		flogs.push(str);
		setTimeout(saveOneLog, 1);
	}
}
// 设置使用物品后事件监听器
setAfterActListener('onUseItem', afterUseItem);

// 放置方块后回调
setAfterActListener('onPlacedBlock', function (e) {
	var je = JSON.parse(e);
	if (je.result) {
		var tnow = TimeNow();
		var str = '[' + tnow + ' AfterPlaceBlock] ' + '玩家 ' + je.playername +
			' 于(' + je.XYZ.x + ',' + je.XYZ.y + ',' + je.XYZ.z + ')位置' +
			(!je.isstand ? ' 悬空地' : '') + ' 在 ' + je.dimension +
			' (' + je.position.x + ',' + je.position.y + ',' + je.position.z + ') 处放置了 '
			+ je.blockname + ' 方块。';
		examplelog(str);
		flogs.push(str);
		setTimeout(saveOneLog, 1);
    }
});

// 破坏方块后触发回调
setAfterActListener('onDestroyBlock', function (e) {
	var je = JSON.parse(e);
	if (je.result) {
		var tnow = TimeNow();
		var str = '[' + tnow + ' AfterDestroyBlock] ' + '玩家 ' + je.playername +
			' 于(' + je.XYZ.x + ',' + je.XYZ.y + ',' + je.XYZ.z + ')位置' +
			(!je.isstand ? ' 悬空地' : '') + ' 在 ' + je.dimension +
			' (' + je.position.x + ',' + je.position.y + ',' + je.position.z + ') 处破坏了 '
			+ je.blockname + ' 方块。';
		examplelog(str);
		flogs.push(str);
		setTimeout(saveOneLog, 1);
	}
});


// 开箱前回调
setBeforeActListener('onStartOpenChest', function (e) {
	var je = JSON.parse(e);
	var tnow = TimeNow();
	var str = '[' + tnow + ' BeforeOpenChest] ' + '玩家 ' + je.playername +
		' 于(' + je.XYZ.x + ',' + je.XYZ.y + ',' + je.XYZ.z + ')位置' +
		(!je.isstand ? ' 悬空地' : '') + ' 试图在 ' + je.dimension +
		' (' + je.position.x + ',' + je.position.y + ',' + je.position.z + ') 处打开箱子。';
	examplelog(str);
	flogs.push(str);
	setTimeout(saveOneLog, 1);
	return true;	// 此处或可添加坐标判断实现锁箱操作
});


// 开桶前回调
setBeforeActListener('onStartOpenBarrel', function (e) {
	var je = JSON.parse(e);
	var tnow = TimeNow();
	var str = '[' + tnow + ' BeforeOpenBarrel] ' + '玩家 ' + je.playername +
		' 于(' + je.XYZ.x + ',' + je.XYZ.y + ',' + je.XYZ.z + ')位置' +
		(!je.isstand ? ' 悬空地' : '') + ' 试图在 ' + je.dimension +
		' (' + je.position.x + ',' + je.position.y + ',' + je.position.z + ') 处打开木桶。';
	examplelog(str);
	flogs.push(str);
	setTimeout(saveOneLog, 1);
	return true;	// 此处或可添加坐标判断实现锁桶操作
});


// 放入取出物品后回调
setAfterActListener('onSetSlot', function (e) {
	var je = JSON.parse(e);
	var tnow = TimeNow();
	var str = '[' + tnow + ' AfterSetSlot] ' + '玩家 ' + je.playername +
		' 于(' + je.XYZ.x + ',' + je.XYZ.y + ',' + je.XYZ.z + ')位置' +
		(!je.isstand ? ' 悬空地' : '') + ' 在 ' + je.dimension +
		' (' + je.position.x + ',' + je.position.y + ',' + je.position.z + ') 处的 ' +
		je.blockname + ' 内的第 ' + je.slot + ' 槽内 ' +
		(je.itemcount > 0 ? '放入了 ' + je.itemcount + ' 个 ' + je.itemname + ' 物品。' :
			'取出了物品。');
	examplelog(str);
	flogs.push(str);
	setTimeout(saveOneLog, 1);
});


// 关箱后回调
setAfterActListener('onStopOpenChest', function (e) {
	var je = JSON.parse(e);
	var tnow = TimeNow();
	var str = '[' + tnow + ' AfterStopOpenChest] ' + '玩家 ' + je.playername +
		' 于(' + je.XYZ.x + ',' + je.XYZ.y + ',' + je.XYZ.z + ')位置' +
		(!je.isstand ? ' 悬空地' : '') + ' 在 ' + je.dimension +
		' (' + je.position.x + ',' + je.position.y + ',' + je.position.z + ') 处关闭了箱子。';
	examplelog(str);
	flogs.push(str);
	setTimeout(saveOneLog, 1);
});


// 关桶后回调
setAfterActListener('onStopOpenBarrel', function (e) {
	var je = JSON.parse(e);
	var tnow = TimeNow();
	var str = '[' + tnow + ' AfterStopOpenBarrel] ' + '玩家 ' + je.playername +
		' 于(' + je.XYZ.x + ',' + je.XYZ.y + ',' + je.XYZ.z + ')位置' +
		(!je.isstand ? ' 悬空地' : '') + ' 在 ' + je.dimension +
		' (' + je.position.x + ',' + je.position.y + ',' + je.position.z + ') 处关闭了木桶。';
	examplelog(str);
	flogs.push(str);
	setTimeout(saveOneLog, 1);
});


// 切换维度回调
setAfterActListener('onChangeDimension', function (e) {
	var je = JSON.parse(e);
	if (je.result) {
		var tnow = TimeNow();
		var str = '[' + tnow + ' AfterChangeDimension] ' + '玩家 ' + je.playername +
			(!je.isstand ? ' 悬空地' : '') + ' 切换维度至 ' + je.dimension +
			' (' + je.XYZ.x + ',' + je.XYZ.y + ',' + je.XYZ.z + ') 处。';
		examplelog(str);
		flogs.push(str);
		setTimeout(saveOneLog, 1);
	}
});


// 生物死亡信息回调
setAfterActListener('onMobDie', function (e) {
	var je = JSON.parse(e);
	if (je.mobname != "") {
		var tnow = TimeNow();
		var str = '[' + tnow + ' DeathInfo] ' + je.mobname + ' 被 ' + je.srcname + ' 杀死了';
		examplelog(str);
		flogs.push(str);
		setTimeout(saveOneLog, 1);
    }
});

// 生物受伤监听
setAfterActListener('onMobHurt', function (e) {
	var je = JSON.parse(e);
	if (je.mobname != "" && je.result) {
		var tnow = TimeNow();
		var str = '[' + tnow + ' HurtInfo] ' + je.mobname + ' 受到来自 ' + je.srcname + ' 的 ' + je.dmcount + ' 点伤害，类型' + je.dmtype;
		examplelog(str);
	}
});

// 玩家重生回调
setAfterActListener('onRespawn', function (e) {
	var je = JSON.parse(e);
	var tnow = TimeNow();
	var str = '[' + tnow + ' AfterRespawn] 玩家 ' + je.playername + ' 已于 ' + je.dimension +
		' (' + je.XYZ.x + ',' + je.XYZ.y + ',' + je.XYZ.z + ') 处重生。';
	examplelog(str);
	flogs.push(str);
	setTimeout(saveOneLog, 1);
});


// 玩家输入文本回调
setBeforeActListener('onInputText', function (e) {
	var je = JSON.parse(e);
	examplelog('<' + je.playername + '> ' + je.msg);
	return true;
});


// 玩家输入指令回调
setBeforeActListener('onInputCommand', function (e) {
	let je = JSON.parse(e);
	examplelog('<' + je.playername + '> ' + je.cmd);
	return true;
});


// 聊天回调
setAfterActListener('onChat', function (e) {
	var je = JSON.parse(e);
	if (je.chatstyle != "title") {
		var tnow = TimeNow();
		var str = '[' + tnow + ' Chat] ' + je.playername +
			(je.target != '' ? ' 悄悄地对 ' + je.target : '') +
			' 说: ' + je.msg;
		examplelog(str);
		flogs.push(str);
		setTimeout(saveOneLog, 1);
	}
});

// 玩家修改命令块回调
setBeforeActListener('onCommandBlockUpdate', function (e) {
	var je = JSON.parse(e);
	var tnow = TimeNow();
	var str = '[' + tnow + ' AfterCommandBlockUpdate] ' + '玩家 ' + je.playername +
		' 于(' + je.XYZ.x + ',' + je.XYZ.y + ',' + je.XYZ.z + ')位置' +
		(!je.isstand ? ' 悬空地' : '') + ' 在 ' + je.dimension +
		' (' + je.position.x + ',' + je.position.y + ',' + je.position.z + ') 处试图修改 '
		+ (je.isblock ? '命令块' : '命令矿车') + ' 的指令为 ' + je.cmd + '。';
	examplelog(str);
	flogs.push(str);
	setTimeout(saveOneLog, 1);
	return true;	// 此处或可拦截命令块更改命令
});

setBeforeActListener('onLevelExplode', function (e) {
	var je = JSON.parse(e);
	var tnow = TimeNow();
	var str = '[' + tnow + ' BeforeExplode] ' + je.dimension + ' 的(' +
		je.position.x + ',' + je.position.y + ',' + je.position.z + ')位置 试图发生由 ' +
		je.entity + ' 引发的爆炸。';
	examplelog(str);
	flogs.push(str);
	setTimeout(saveOneLog, 1);
	return true;	// 此处或可拦截爆炸事件
});

// 服务器指令回调
//setBeforeActListener('onServerCmd', function (e) {
//	let je = JSON.parse(e);
//	return true;	// 此处或可拦截后台输入的指令
//});

// 命令方块指令回调
//setBeforeActListener('onBlockCmd', function (e) {
//	let je = JSON.parse(e);
//	return true;	// 此处或可拦截命令方块及命令方块矿车指令的执行
//});

// NPC指令回调
//setBeforeActListener('onNpcCmd', function (e) {
//	let je = JSON.parse(e);
//	return true;	// 此处或可拦截NPC指令的执行
//});

// 服务器指令执行输出回调
//setBeforeActListener('onServerCmdOutput', function (e) {
//	let je = JSON.parse(e);
//	return true;	// 此处或可拦截后台指令输出信息
//});

// 玩家选择GUI菜单回调
//setBeforeActListener('onFormSelect', function (e) {
//	let je = JSON.parse(e);
//	return true;
//});

// 装载名字回调
//setAfterActListener('onLoadName', function (e) {
//	var je = JSON.parse(e);
//	log(je.playername + '已装载入游戏，xuid=' + je.xuid);
//});

// 玩家离开游戏回调
//setAfterActListener('onPlayerLeft', function (e) {
//	let je = JSON.parse(e);
//	log(je.playername + '已离开游戏，xuid=' + je.xuid);
//});

// 玩家移动回调
//setAfterActListener('onMove', function (e) {
//	var je = JSON.parse(e);
//	// 此处或可根据玩家位置设置移动监听
//});

// 执行一条远程http请求
//request('http://localhost:8088/farcmd.ashx', 'GET', 'user=administrator&password=654321&cmd=me 你好', function (e) {
//	log(e);
//});

examplelog('example 已装载至文件末尾');