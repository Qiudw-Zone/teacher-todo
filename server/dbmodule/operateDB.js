/**
 * @func 操作数据库模块
 * @author qdw
 * @time 2016/4/15
 */

//引入mongoose模块  
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//引入自定义的数据库配置模块  
var config = require('./mgdbConf');

var demoSchema = new Schema(config.schemajson);
var Models = {};
var tables = config.tables
for(var i=0,l=tables.length; i<l; i++){
	var Model = mongoose.model(tables[i].name,tables[i].table,tables[i].name);
	Models[tables[i].name] = Model;
}

/**
 * 连接mongodb数据库
 * @param  参数1: mongodb地址
 *         参数2: mongodb连接可选信息：自动连接、连接池数量等
 * @return null
 */
mongoose.connect(config.db.mongodb,config.db.server, function(e) {
	if (e) {
		console.log(e.message);
		return;
	}
	console.log("Connection Success!");
});

var db = mongoose.connection; // 连接的数据库对象
/*db.on('error', function(error) {
	console.log('Error:\n'+error);
});
db.once('open', function() {
	console.log('mongoose open success');
});*/

/**
 * 数据插入操作
 * @param  {JSON} req{
 *     table: 表名
 *     data: [JSON]插入的数据信息，格式与定义的模型格式一样
 *     call: 数据插入之后的回调
 *  } 
 */
exports.insertDB = function(req){
	var Model = Models[req.table];
	var data = new Model(req.data);

	data.save(function(e, res, num) {
		if (e) {
			console.log(e);
			return;
		}
		console.log("影响数量 " + num);
		if(req.call){
			req.call(res);
		}
	})
}

/**
 * 查询数据（返回符合条件的全部信息）
  * @param  {JSON} req{
  *     table: 表名,
 *      data: [JSON]查询条件,
 *      call: 回调
 *  }
 */
exports.findDB = function(req) {
	var Model = Models[req.table];
	if(!req.sort){
        req.sort = {
            createTime:-1 // 按创建时间降序
        }
    }
	Model.find(req.data, function(e, res) {
		if (e) {
			console.log(e);
			return;
		}
		console.log("查询结果量：" + res.length);
		if(req.call){
			req.call(res);
		}
	}).sort(req.sort);
}

/**
 * 查询数据（返回符合条件的第一条数据）
 * @param  {JSON} req{
 *     table: 表名,
 *     data: [JSON]查询条件,
 *     callback: 回调
 * }
 */
exports.findOneDB = function(req) {
	var Model = Models[req.table];

	Model.findOne(req.data, function (e, res) {
		if (e) {
			console.log(e);
			return;
		}
		console.log('查询成功！');
		if(req.call){
			req.call(res);
		}
	})
}

/**
 * 更新数据库信息
 * @param  {JSON} req:{
 *     table: 表名,
 *     data:{
 *         condit: 更新条件,
 *         update: 更新内容,
 *         options:可选参数（eg: 更新一条or全部）
 *     },
 *     call: 更新后的回调
 * }
 */
exports.updateDB = function(req) {
	var Model = Models[req.table];

	Model.update(req.data.condit,req.data.update,req.data.options, function(e, res) {
		if (e) {
			console.log(e);
			return;
		}
		console.log("影响数量 " + res.n);
		if(req.call){
			req.call(res);
		}
	})
}

/**
 * 移除数据库信息
 * @param  {JSON} req:{
 *     table: 表名,
 *     data: [JSON]{
 *         condit: [JSON]移除条件
 *     },
 *     call：回调
 * }
 * @return {[type]}            [description]
 */
exports.removeDB = function(req) {
	var Model = Models[req.table];

	Model.remove(req.data.condit,function(e,res) {
		if (e) {
			console.log(e);
			return;
		}
		console.log("删除数量："+res.result.n);
		if(req.call){
			req.call(res.result);
		}
	})
}
