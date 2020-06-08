
App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  admin: null,
  info: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      ethereum.enable();
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');//与ganache的端口对应
      ethereum.enable();
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },


  initContract: function() {
    $.getJSON("EContract.json", function(econtract) {
      App.contracts.EContract = TruffleContract(econtract);
      App.contracts.EContract.setProvider(App.web3Provider);
     // App.listenForEvents();
      return App.render();
    });
  },

 judgeState:function(state1,state2){
     if (state1 == 0 && state2==0) {
         var state = '新创建';
     } else if (state1 == 1 && state2==0 ) {
         var state = '甲方已签署等待乙方签署';
     }else if (state1==0&&state2==1){
         var state='c';
     } else if (state1 == 1&& state2==1) {
         var state = '已签署待确认';
     } else if (state1 == 2&&state2==1) {
         var state = '甲方已确认等待乙方确认';
     }else if(state1==1&&state2==2){
         var state = '乙方已确认等待甲方确认';
     }else if(state1==2&&state2==2){
         var state='等待审核';
     }else if(state1==3&&state2==3){
         var state='成功发布'
     }else if(state1 == 4&&state2==4){
         var state='中止';
     }
     return state;
 },

  render: function() {
    // 获得账户登录地址和账户余额
    web3.eth.getCoinbase(function (err, account) {
      if (!err) {
        App.account = account;
        $("#accountAddress").html("当前登录账户地址: " + account);
        web3.eth.getBalance(account, function (err, res) {
          if (!err) {
            $("#accBalance").html("当前登录账户余额: " + res + 'wei');
          } else {
            console.log(err);
          }
        });
      }
    });

    App.contracts.EContract.deployed().then(function (instance) {
      econtractInstance = instance;
      App.admin=econtractInstance.admin().then(function (admin) {
          App.admin=admin;
          $("#admin").html("管理员账号为："+ App.admin);
      });
      return econtractInstance.e_contractCount();
    }).then(function (e_contractCount) { //获取电子合约内容
      var number = Number(e_contractCount) + 1;
      $("#e_contractCount").html("当前合同序号为: " + number);  //获取电子合约序号
      var acc = App.account;
      var count=0;
      for (var i = 1; i <= e_contractCount; i++) {
        econtractInstance.e_contracts(i).then(function (thisConInfo) {
            var id = thisConInfo[0];
            var state1 = thisConInfo[3];
            var state2 = thisConInfo[4]
            var par1 = thisConInfo[9];
            var par2 = thisConInfo[10];

            var state=App.judgeState(state1,state2);

          $("#all").append("<tr><td align='center'>" + id + "</td><td align='center'>" + state + "</td></tr>");

          if (par1 == acc) {
              $("#relative").append("<tr><td align='center'>" + id + "</td><td align='center'>" + state + "</td><td align='center'>" + "甲方" + "</td></tr>");
          } else if (par2 == acc) {
              $("#relative").append("<tr ><td align='center'>" + id + "</td><td align='center'>" + state + "</td><td align='center'>" + "乙方" + "</td></tr>");
          }

        });
      }
    })
  },

checkID:function(ID) {
    if(typeof ID !== 'string') return 0;
    var city = {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
    var birthday = ID.substr(6, 4) + '/' + Number(ID.substr(10, 2)) + '/' + Number(ID.substr(12, 2));
    var d = new Date(birthday);
    var newBirthday = d.getFullYear() + '/' + Number(d.getMonth() + 1) + '/' + Number(d.getDate());
    var currentTime = new Date().getTime();
    var time = d.getTime();
    var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    var arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    var sum = 0, i, residue;

    if(!/^\d{17}(\d|x)$/i.test(ID)) return 0;
    if(city[ID.substr(0,2)] === undefined) return 0;
    if(time >= currentTime || birthday !== newBirthday) return 0;
    for(i=0; i<17; i++) {
        sum += ID.substr(i, 1) * arrInt[i];
    }
    residue = arrCh[sum % 11];
    if (residue !== ID.substr(17, 1)) return 0;
    return 1;
},

createC: function() {
    var nickname1= $('#nickname1').val();
    var nickname2= $('#nickname2').val();
    var idCard1= $('#idCard1').val();
    var idCard2= $('#idCard2').val();
    var con= $('#con').val();
    var par1= $('#par1').val();
    var par2= $('#par2').val();
    var userAccount = web3.eth.accounts[0];

    var reg = /^1[3|4|5|7|8][0-9]{9}$/;
    if(App.checkID(idCard1)==0){
        alert('甲方身份证号码有误，请重新填写！');
        return false;
    }else if((App.checkID(idCard2))==0){
        alert('乙方身份证号码有误，请重新填写！');
        return false;
    }else{
        App.contracts.EContract.deployed().then(function(instance) {
            return instance.createEcontract(con,nickname1,nickname2,idCard1,idCard2,par1,par2,{gas: 3000000, from: userAccount});
        }).then(function(result) {
            console.log(accounts[0]);
        }).catch(function(err) {
            console.error(err);
        });
    }},

quary: function() {
   qID= $('#qID').val();
    var userAccount = web3.eth.accounts[0];
    console.log("!!");
    App.contracts.EContract.deployed().then(function (instance) {
        instance.e_contracts(qID).then(function (thisConInfo) {
            console.log(thisConInfo);
            if(thisConInfo==null){
                alert("未查询到当前合同，请检查合同序号");
            }else{
            var id = thisConInfo[0];
            var createTime = thisConInfo[1];
            var content = thisConInfo[2];
            var state1 = thisConInfo[3];
            var state2 = thisConInfo[4]
            var nickname1 = thisConInfo[5];
            var nickname2 = thisConInfo[6];
            var idCard1 = thisConInfo[7];
            var idCard2 = thisConInfo[8];
            var par1 = thisConInfo[9];
            var par2 = thisConInfo[10];
            idCard1.toString(10);
            console.log(idCard1);

            var state=App.judgeState(state1,state2);
            var unixTimestamp = new Date(createTime * 1000);
            var createTime = unixTimestamp.toLocaleString()

            var infoTemplate ="<tr><td align='left'>"
                + "当前合同状态：" + state + "</td></tr><tr><td align='left'>"
                + "合同序号：   " + id + "</td></tr><tr><td align='left'>"
                + "甲方姓名：   " + nickname1 +"</td></tr><tr><td align='left'>"
                + "乙方姓名：   " + nickname2 + "</td></tr> <tr><td align='left'>"
                + "甲方身份证号：" + idCard1 + " </td></tr> <tr><td align='left'>"
                + "乙方身份证号：" + idCard2 + " </td></tr> <tr><td align='left'>"
                + "甲方区块链地址：   " + par1 + "</td></tr> <tr><td align='left'>"
                + "乙方区块链地址：   " + par2 + "</td></tr> <tr><td align='left'>"
                + "合同创建时间：   " + createTime + "</td></tr> <tr><td align='left'>"
                + "合同内容：   " + content + "</td align='left'></tr>  "
            console.log(infoTemplate);
            $("#e_contractInfo").html(infoTemplate);
        }
        }
        )
    });
 },
    
//甲方签署
sign1: function() {
  var num1= $('#num1').val(); //获取合约序号
  var userAccount = web3.eth.accounts[0];

  App.contracts.EContract.deployed().then(function (instance) {
    return instance.sign1(num1, {gas: 3000000, from: userAccount});
  }).then(function(result) {
    console.log(accounts[0]); 
  }).catch(function(err) {
    console.error(err);
  });
},

sign2: function() {
  var num2= $('#num2').val();
  var userAccount = web3.eth.accounts[0];
  App.contracts.EContract.deployed().then(function(instance) {
    return instance.sign2(num2,{gas: 3000000, from: userAccount});
  }).then(function(result) {
    console.log(accounts[0]); 
  }).catch(function(err) {
    console.error(err);
  });
},

confirm1: function() {
  var confirm1= $('#confirm1').val();
  var userAccount = web3.eth.accounts[0];
  App.contracts.EContract.deployed().then(function(instance) {
    return instance.confirm1(confirm1,{gas: 3000000, from: userAccount});
  }).then(function(result) {
    // Wait for to update
    console.log(accounts[0]); 
  }).catch(function(err) {
    console.error(err);
  });
},

confirm2: function() {
  var confirm2= $('#confirm2').val();
  var userAccount = web3.eth.accounts[0];
  App.contracts.EContract.deployed().then(function(instance) {
    return instance.confirm2(confirm2,{gas: 3000000, from: userAccount});
  }).then(function(result) {
    // Wait for to update
    console.log(accounts[0]); 
  }).catch(function(err) {
    console.error(err);
  });
},

//管理员批准合同
pass: function () {
    var id = $("#sp").val();
    var userAccount = web3.eth.accounts[0];
    App.contracts.EContract.deployed().then(function (instance) {
        return instance.pass(id,{gas: 3000000, from: userAccount});
    }).catch(function(err){
       console.log(err);
    });
},

//管理员未通过or终止合同
reject: function() {
    var id = $("#sp").val();
    var userAccount = web3.eth.accounts[0];
    App.contracts.EContract.deployed().then(function (instance) {
        return instance.reject(id,{gas: 3000000, from: userAccount});
    }).catch(function(err){
        console.log(err);
    });
},

};


$(function() {
  $(window).load(function() {
    App.init();
  });
});