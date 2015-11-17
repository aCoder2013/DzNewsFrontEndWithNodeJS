var express = require('express');
var router = express.Router();


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
	//向后端服务器发出GET请求，得到新闻json数据
	http.get({
		host:'localhost',
		port:'8080',
		path:url
	},function(response){
		// 不断接受流中的数据
		var body ="";
		response.on('data',function(data){
			body+=data;
		});
		response.on('end',function(){
			//数据接收完成
			var parsed = JSON.parse(body);
			res.json(parsed);//写到响应流中
		});
	});
});
//得到单个新闻项
router.get('/api/news/:id',function (req,res) {
	var newsId = req.params.id;
	http.get({
		host:'localhost',
		port:'8080',
		path:'/api/news/'+newsId
	},function (response) {
		var body = "";
		response.on('data',function (data) {
			body+=data;
		});

		response.on('end',function () {
			var parsed = JSON.parse(body);
			res.json(parsed);
		});
	});
});

//得到评论
router.get('/api/news/detail/:id/comment',function (req,res) {
	var newsDetailId =  req.params.id;
	http.get({
		host:'localhost',
		port:'8080',
		path:'/api/news/detail/'+newsDetailId+"/comment"
	},function (response) {
		var body ="";
		response.on('data',function (data) {
			body+=data;
		});

		response.on('end',function () {
			var parsed = JSON.parse(body);
			res.json(parsed);
		});
	});
});


//得到新闻详情
router.get('/api/news/detail/:id',function(req,res){
		var newsDetailId = req.params.id;
		http.get({
			host:'localhost',
			port:'8080',
			path:'/api/news/detail/'+newsDetailId
		},function (response) {
				var body ="";
				response.on('data',function (data) {
					body+=data;
				});
				response.on('end',function () {
					var parsed = JSON.parse(body);
					console.log(parsed);
					res.json(parsed);//写到输出流
				});
		});
});


//其他的全部转发到index.html，让Angular处理
router.use(function (req,res) {
	res.sendfile('./static/index.html');
});
