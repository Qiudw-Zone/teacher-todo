module.exports = {
	db: {
		"mongodb": "mongodb://localhost/TeacherToDo",
		"database": "TeacherToDo",
		"server": {
            auto_reconnect: true,
            poolSize:5
        }
	},
    tables:[
        {
            name:"users",
            table:{
                name:String, // 唯一
                password:String, // 6位
                createTime : { type: Date, default: Date.now }
            }
        },
        {
            name:"courses",
            table:{
                name:String,
                uname:String,
                addr:String,
                createTime : { type: Date, default: Date.now }
            }
        },
        {
            name:"todos",
            table:{
                name:String,
                uname:String,
                status:Number, // 根据时间确定状态 -1：已结束, 0：进行中, 1：未开始
                createTime : { type: Date, default: Date.now }
            }
        }
    ]
};