
App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // 如果MetaMask已经提供了web3
      App.web3Provider = web3.currentProvider;
      ethereum.enable();
      web3 = new Web3(web3.currentProvider);
    } else {
      // 如果没有提供web3实例，指定默认实例
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');//与ganache的端口对应
      ethereum.enable();
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },


  initContract: function() {
    // 加载Election.json，保存了ABI及部署后的地址信息
    $.getJSON("Election.json", function(election) {
      // 初始化合约
      App.contracts.Election = TruffleContract(election);
      // 连接与合约进行交互
      App.contracts.Election.setProvider(App.web3Provider);
      App.listenForEvents();
      return App.render();
    });
  },


    // 监听合约事件
    listenForEvents: function() {
      App.contracts.Election.deployed().then(function(instance) {
  
      });
    },

  render: function() {
    // 获得账户登录地址和账户余额
    web3.eth.getCoinbase(function (err, account) {
      if (!err) {
        App.account = account;
        $("#accountAddress").html("当前登录账户地址: " + account);
        web3.eth.getBalance(account, function (err, res) {
          if (!err) {
            console.log(res);
            $("#accBalance").html("当前登录账户余额: " + res + 'wei');
          } else {
            console.log(err);
          }
        });
      }
    });


    App.contracts.Election.deployed().then(function (instance) {
      electionInstance = instance;
      console.log(instance);
      return electionInstance.e_contractCount();
    }).then(function (e_contractCount) { //获取电子合约内容
      var e_contractInfo = $("#e_contractInfo");
      e_contractInfo.empty();
      var htt = Number(e_contractCount) + 1;
      $("#e_contractCount").html("当前合同序号为: " + htt);  //获取电子合约序号

      for (var i = 1; i <= e_contractCount; i++) {
        electionInstance.e_contracts(i).then(function (thisConInfo) {
          // tag=false;
          //  uint id;//合同编号
          //  uint createTime;//发布时间，用当前时间表示
          //  string content;//内容
          //  uint state;//合同状态。0：新创建   1：待确认-双方签字后  2：已签署-签字后-双方确认
          //  string nickname1;//签署姓名1
          //  string nickname2;//签署姓名2
          //  uint idCard1;//身份证信息1
          //  uint idCard2;//身份证信息1
          //  address  par1;//签署地址1
          //  address  par2;//签署地址2
          //  uint tel1;//联系方式1
          //  uint tel2;//联系方式2
          // cargoNames

          var id = thisConInfo[0];
          var createTime = thisConInfo[1];
          var content = thisConInfo[2];
          var state = thisConInfo[3];
          var nickname1 = thisConInfo[4];
          var nickname2 = thisConInfo[5];
          var idCard1 = thisConInfo[6];
          var idCard2 = thisConInfo[7];
          var par1 = thisConInfo[8];
          var par2 = thisConInfo[9];
          var tel1 = thisConInfo[10];
          var tel2 = thisConInfo[11];

          if (state == 0) {
            var state = '新创建';
          }
          if (state == 1 ) {
            var state = '一方已签署';
          }
          if (state==2){
            var state='双方已签署';
          }
          if (state == 3) {
            var state = '一方已确认';
          }
          if (state == 4) {
            var state = '双方已签署成功';
          }

          var unixTimestamp = new Date(createTime * 1000);
          var createTime = unixTimestamp.toLocaleString()
          var infoTemplate =
              " <tr><td width='1309px'  align=center ><font size=3 >"
              + "当前合同状态：" + state + "</font></td></tr>    <tr><td><font size=3 >" + "甲方姓名：   " + nickname1 + "</font></td></tr>    <tr><td><font size=3 >" + "乙方姓名：   " + nickname2 + "</font></td></tr>   <tr><td><font size=3 >" + "甲方电话:" + tel1 + "</font></td></tr>   <tr><td><font size=3 >" + "乙方电话：" + tel2 + "</font></td></tr>     <tr><td><font size=3 >" + "甲方身份证号：" + idCard1 + "</font></td></tr>   <tr><td><font size=3 >" + "乙方身份证号：" + idCard2 + "</font></td></tr>    <tr><td><font size=3 >" + "甲方区块链地址：   " + par1 + "</font></td></tr>     <tr><td><font size=3 >" + "乙方区块链地址：   " + par2 + "</font></td></tr>    <tr><td><font size=3 >" + "合同创建时间：   " + createTime + "</font></td></tr>     <tr><td><font size=3 >" + "合同序号：   " + id + "</font></td></tr>      <tr><td><font size=3 >" + "合同内容：   " + content + "</font></td></tr>      "

          var qID = document.cookie.split(";")[0].split("=")[1]; //获得cookie中的qID
          if (id == qID) {
            e_contractInfo.append(infoTemplate);
          }
        });
      }
    })
  },

quaryC: function() {  //给修改cookie中qID代表合同序号
  qID= $('#qID').val();
  document.cookie="qID="+qID;
 },

 createC: function() {
  var nickname1= $('#nickname1').val();
  var nickname2= $('#nickname2').val();
  var idCard1= $('#idCard1').val();
  var idCard2= $('#idCard2').val();
  var tel1= $('#tel1').val();
  var tel2= $('#tel2').val();
  var con= $('#con').val();
  var par1= $('#par1').val();
  var par2= $('#par2').val();
  var userAccount = web3.eth.accounts[0];

  var reg = /^1[3|4|5|7|8][0-9]{9}$/;
  if((idCard1.length) != 18){
    alert('甲方身份证号码长度有误，请重新填写！');
    return false;
  }else if(!(reg.test(tel1))){
    alert('甲方手机号手机号码有误，请重新填写！');
    return false;
  }else if((idCard2.length)!=18){
    alert('乙方身份证号码长度有误，请重新填写！');
    return false;
  }else if(!(reg.test(tel2))){
    alert('乙方手机号手机号码有误，请重新填写！');
    return false;
  }else{
  App.contracts.Election.deployed().then(function(instance) {
    return instance.createEcontract(con,nickname1,nickname2,idCard1,idCard2,par1,par2,tel1,tel2,{gas: 3000000, from: userAccount});
  }).then(function(result) {
    console.log(accounts[0]); 
  }).catch(function(err) {
    console.error(err);
  });
}},

//甲方签署
sign1: function() {
  var num1= $('#num1').val(); //获取合约序号
  var userAccount = web3.eth.accounts[0];

  App.contracts.Election.deployed().then(function (instance) {
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
  App.contracts.Election.deployed().then(function(instance) {
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
  App.contracts.Election.deployed().then(function(instance) {
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
  App.contracts.Election.deployed().then(function(instance) {
    return instance.confirm2(confirm2,{gas: 3000000, from: userAccount});
  }).then(function(result) {
    // Wait for to update
    console.log(accounts[0]); 
  }).catch(function(err) {
    console.error(err);
  });
},
};


$(function() {
  $(window).load(function() {
    App.init();
  });
});