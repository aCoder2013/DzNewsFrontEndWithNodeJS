var express = require('express');
var router = express.Router();
var http  = require('http');
var querystring = require('querystring');


//从服务器取得新闻数据
router.get('/api/news',function (req,res) {
	//得到相关查询参数
	var page = req.query.page;
	var size =req.query.size;
	var sort = req.query.sort;
	var url =  '/api/news';
	//构造URL
	if(page){
		url+='?page='+page;
		if(size){
			url+='&size='+size
		}
		if(sort){
			url+='&sort='+sort;
		}
	}
	getFromServer(url,function (data) {
		res.json(JSON.parse(data));
	});
});
//得到单个新闻项
router.get('/api/news/:id',function (req,res) {
	var newsId = req.params.id;
	getFromServer('/api/news/'+newsId,function (data) {
		res.json(JSON.parse(data));
	});
});

//得到评论
router.get('/api/news/detail/:id/comment',function (req,res) {
	var newsDetailId =  req.params.id;
	getFromServer('/api/news/detail/'+newsDetailId+"/comment",function (data) {
		res.json(JSON.parse(data));
	});
});


//得到新闻详情
router.get('/api/news/detail/:id',function(req,res){
		var newsDetailId = req.params.id;
		data = getFromServer('/api/news/detail/'+newsDetailId,function (data) {
			res.json(JSON.parse(data));
		});
});


//发表评论
router.post('/api/news/detail/:id/comment/new',function (req,res) {
	var newsDetailId = req.params.id;
	var postData =  querystring.stringify({
		userid:req.body.userid,
		content : req.body.content
	});
	var options = {
	  hostname: 'localhost',
	  port: '8080',
	  path: "/api/news/detail/"+newsDetailId+"/comment/new",
	  method: 'post',
	  headers: {
	    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			 'Content-Length': postData.length
	  }
	};
	var req = http.request(options,function (response) {
		var body = "";
		response.setEncoding('utf8');
		response.on('data', function (chunk) {
			body += chunk;
		});
		response.on('end', function() {
			res.json(JSON.parse(body));
		})
		response.on('error', function(e) {
		console.log('problem with request: ' + e.message);});
		});

	req.write(postData);
	req.end();
});

//注册新用户
router.post('/api/user/register',function (req,res) {
	var postData =  querystring.stringify({
		name : req.body.name,
		email : req.body.email,
		password : req.body.password
	});
	var options = {
		hostname: 'localhost',
		port: '8080',
		path: '/api/user/register',
		method: 'post',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			 'Content-Length': postData.length
		}
	};
	var req = http.request(options,function (response) {
		var body = "";
		response.setEncoding('utf8');
		response.on('data', function (chunk) {
			body += chunk;
		});
		response.on('end', function() {
			body = JSON.parse(body);
			if(body.meta.success === false){
				res.status(401).json({msg:body.meta.message});
				return;
			}
			res.json(body);
		})
		response.on('error', function(e) {
			console.log('problem with request: ' + e.message);
		});
	});
	req.write(postData);
	req.end();
});


//验证用户是否登陆
router.get('/api/validate',function (req,res) {
	var sess = req.session;
	if(sess._userId){
		console.log(sess._userId);
			getFromServer('/api/user/'+sess._userId,function (data) {
			return res.json(data);
		});
	}else{
		return res.json(401,{msg:'error'});
	}
});

//用户登录
router.post('/api/user/login',function (req,res) {
	var sess  = req.session;
	var postData =  querystring.stringify({
		email : req.body.email,
		password : req.body.password
	});
	var options = {
		hostname: 'localhost',
		port: '8080',
		path: '/api/user/login',
		method: 'post',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			 'Content-Length': postData.length
		}
	};
	var req = http.request(options,function (response) {
		var body = "";
		response.setEncoding('utf8');
		response.on('data', function (chunk) {
			body += chunk;
		});
		response.on('end', function() {
				var json_body  = JSON.parse(body);
				if(json_body.meta.success === false){
					res.status(401).json({msg:json_body.meta.message});
					return;
				}
				sess._userId= json_body.data.id;//设置session
				res.json(body.data);
		})
		response.on('error', function(e) {
			console.log('problem with request: ' + e.message);
		});
	});
	req.write(postData);
	req.end();
});

//注销
router.get('/api/user/logout',function (req,res) {
	 var sess = req.session;
	 sess.destroy(req.sessionID,function (err) {
	 		console.log("problem with  session destory :"+err);
	 });
	 res.json('success');
});

//其他的全部转发到index.html，让Angular处理
router.use(function (req,res) {
	res.sendfile('./static/index.html');
});



//向后端服务器发送GET请求，调用callback回调方法
var getFromServer = function (path,callback) {
	http.get({
		host:'localhost',
		port:'8080',
		path:path
	},function (response) {
			var body ="";
			response.on('data',function (data) {
				body+=data;
			});
			response.on('end',function () {
				callback(body);
			});
	});
}

module.exports = router;
