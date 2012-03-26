var db = require('./db.js');

var getNow=function(){
        var now = new Date();
        var year = now.getFullYear();
        return (year+'-'+(now.getMonth()+1)+'-'+now.getDate()+' '+
        now.getHours()+':'+now.getMinutes()+':'+now.getSeconds());
}

exports.add = function(req, res) {
    console.log("==add new member==");
    var reg = req.body.register;
    var sql = "SELECT _id  FROM `gs_member` WHERE `username` = '"+
                reg.username+"'";
    if(reg.email)
        sql += " OR email = '"+reg.email+"'";
    else if(reg.phone)
        sql += " OR phone = "+reg.phone;
    
    db.query(sql, function(err, rs) {
        if(db.errorHandle(err, rs, function(result) {
            if(result.status != 204) {
                res.send(result.status);
            }
            else {
                reg.regtime = getNow();
                reg.state = 0;
                reg.type = 0;
                options={
                    table: "gs_member",
                    fields:reg
                }                             
                db.insert(options,function(gid){
                    reg._id = gid;
                    req.session.member = reg;
                    var json = {member:{_id:gid, username:reg.username}};
                    res.json(json, 201);
                });
            }   
        }))
        {
            console.log(rs);
            res.send(409);//user had exist
        }
    });
}

exports.query = function(req, res) {
    console.log("query member id="+req.params.id);
    var json = {member:req.session.member};
    res.json(json);
}

exports.update = function(req, res) {
    console.log("update member id="+req.params.id);

    //check database first for valid info
    //....
        
    var opt = {
        table:"gs_member"
        ,fields:req.body.member
        ,where:"_id="+req.params.id
    }
    db.update(opt, function(err) {
        if(err) res.send(422);
        else {
            req.session.member = req.body.member;
            res.send(200);
        }
    });
}

exports.login=function(req, res){
    var id = req.body.identification;
    var sql = "select * from gs_member where "
    if(id.username.search("@") >= 0)
        sql += "email = '"+id.username+"'"
    else if(!isNaN(parseInt(id.username)))
        sql += "phone = "+parseInt(id.username);
    else
        sql += "username = '"+id.username+"'"
          
    db.query(sql,function(err, rs){
        if(!db.errorHandle(err, rs, function(result) {
            if(result.status == 204) result.status = 404;
            res.send(result.status);
        })) return;
        console.log("login==", rs);
        if(0 != rs[0].state) res.send(403);
        else{
            if(req.body.identification.password === rs[0].password){
                req.session.member = rs[0];
                var opt={
                    table: "gs_member",
                    fields:{lastlogintime:getNow()},
                    where:"_id="+rs[0]._id
                }
                db.update(opt,function(){
                    var json = {
                        member:{
                            _id:rs[0]._id
                            ,username:rs[0].username
                        }
                    }
                    res.json(json);
                });
            }
            else{
                res.send(401);
            }
        }
    });
}
