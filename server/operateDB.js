/**
 * @func 操作数据库模块
 * @author qdw
 * @time 2016/4/15
 */

//引入mongoose模块  
var mongoose = require('mongoose');
//引入自定义的数据库配置模块  
var config = require('./config');

var mongos = {
	model: null,
	init: function(table, tableJSON) {
		this.model = mongoose.model(table, tableJSON);
	},
	connect: function(conf) {
		mongoose.connect(conf.db.mongodb, function(e) {
			if (e) {
				console.log(e.message);
				return;
			}
			console.log("Connect successfully!");
		});
	},
	insert: function(dataJSON) {
		var data = new this.model(dataJSON);
		data.save(function(e, data, num) {
			if (e) {
				console.log(e);
				return;
			}
			console.log('insert...');
			console.log(data);
			console.log("影响数量 " + num);
		})
	},
	find: function(findJSON) {
		this.model.find(findJSON, function(e, data) {
			if (e) {
				console.log(e);
				return;
			}
			console.log(data);
		})
	},
	update: function(conditonJSON, dataJSON) {
		this.model.update(findJSON, function(e, num, raw) {
			if (e) {
				console.log(e);
				return;
			}
			console.log(raw);
			console.log("影响数量 " + num);
		})
	},
	remove: function(conditonJSON) {
		this.model.update(findJSON, function(e) {
			if (e) {
				console.log(e);
				return;
			}
			console.log(raw);
			console.log("删除成功！");
		})
	}
}

exports.mongos;