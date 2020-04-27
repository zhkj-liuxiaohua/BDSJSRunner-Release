// 文件名：visitor
// 功能：提供后台visitor命令 强制玩家降级权限为访客


/******************************** 预处理设置区 ********************************/

var FUCTION_EXLOG = 'FUCTION_EXLOG';

let _VISITOR_OFF = false;

// 使用一个共享函数
let examplelog = null;

// 打印调试信息
function _VISITOR_PR(e) {
	if (!_VISITOR_OFF) {
		if (examplelog != null)
			examplelog(e);
		else {
			let f = getShareData(FUCTION_EXLOG);
			examplelog = (f != null) ? f :
				function (e) {
					log('[visitor]' + e);
				};
			examplelog(e);
        }
	}
}

// tellraw 回传消息
function _visitor_tellrawmsg(pname, msg) {
	let rawtxt = {};
	rawtxt.rawtext = [];
	let text = {};
	text.text = msg;
	rawtxt.rawtext.push(text);
	runcmd('tellraw ' + '"' + pname + '" ' + JSON.stringify(rawtxt));
}

// 将玩家名写入权限配置文件，并更新权限
function _visitor_permission(pname) {
	let plstr = getOnLinePlayers();
	if (plstr != null) {
		let xuid = "";
		jpl = JSON.parse(plstr);
		if (jpl != null) {
			for (let i = 0; i < jpl.length; i++) {
				let jp = jpl[i];
				if (jp.playername == pname) {	// 找到
					xuid = jp.xuid;
					break;
				}
			}
		}
		if (xuid != "") {
			// 将此xuid加入到权限配置文件中
			let pelstr = fileReadAllText('permissions.json');
			let pel = [];
			let finded = false;
			if (pelstr != null && pelstr != "") {
				pel = JSON.parse(pelstr);	// 获取老的权限配置信息
			}
			for (let i = 0; i < pel.length; i++) {
				let jpe = pel[i];
				if (jpe.xuid == xuid) {		// 找到
					jpe.permission = "visitor";
					finded = true;
					break;
				}
			}
			if (!finded) {	// 未能找到旧配置信息，将新增信息
				let j = {};
				j.permission = "visitor";
				j.xuid = xuid;
				pel.push(j);
			}
			fileWriteAllText('permissions.json', JSON.stringify(pel));	// 保存新配置
			setTimeout(function () {
				runcmd("permission reload");	// 重载权限配置
				_visitor_tellrawmsg(pname, "您已被降级权限为访客。");
			}, 10);
			return;
		}
	}
	_VISITOR_PR("未能正确降级玩家" + pname + "，请检查该玩家是否在线。");
}

// 解析字符串
function _visitor_trans(cmd) {
	let rcmd = cmd.trim();
	if (rcmd == "")		// 空白字符串 不作处理
		return true;
	let cmdstrs = rcmd.split(' ');
	if (cmdstrs.length > 0) {
		if (cmdstrs[0] == 'visitor') {	// 进入命令
			let playername = rcmd.substr(7).trim();
			_visitor_permission(playername);
			return false;
		}
	}
	return true;
}

/******************************** 监听器设置区 ********************************/

// 待管理多监听器
var _visitor_ofs = {};

// 服务器指令回调
setBeforeActListener('onServerCmd', function (e) {
	let je = JSON.parse(e);
	let r = _visitor_trans(je.cmd);
	if (!r)
		return false;	// 直接拦截
	return true;
});

_VISITOR_PR('visitor 已加载。用法：visitor [玩家名]');