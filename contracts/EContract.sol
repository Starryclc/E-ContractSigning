pragma solidity ^0.5.0;

contract Election{
    string public name;
    uint public e_contractCount = 0;
    mapping (uint => EContract) public e_contracts;//合同索引

    struct EContract {
         uint id;//合同编号
         uint createTime;//发布时间，用当前时间表示
         string content;//内容
         uint state;//合同状态。0：新创建   2：待确认-双方签字后  4：已签署-签字后-双方确认
         string nickname1;//签署姓名1
         string nickname2;//签署姓名2     
         uint idCard1;//身份证信息1
         uint idCard2;//身份证信息1
         address  par1;//签署地址1
         address  par2;//签署地址2
         uint tel1;//联系方式1
         uint tel2;//联系方式2
    }

    //管理员地址
   address owner;

   //构造函数
    constructor () public {
        name = "Decentralized Systems";
        owner=msg.sender;
    }

    //创建合同
    function createEcontract (string memory content,string memory nickname1,string memory nickname2,uint idCard1,uint idCard2,address par1,address par2,uint tel1,uint tel2) public {
       // 自增 合同序列从1开始
        e_contractCount ++;
        //address  _author=msg.sender;
        e_contracts[e_contractCount] = EContract(e_contractCount,now,content,0,nickname1,nickname2,idCard1,idCard2,par1,par2,tel1,tel2);
         
    }


    //地址1签署合同
    function sign1 (uint snum) public {
        require(e_contracts[snum].par1 == msg.sender);
        e_contracts[snum].state += 1;
    }


    //地址2签署合同
    function sign2 (uint snum) public {
         require(e_contracts[snum].par2 == msg.sender);
         e_contracts[snum].state += 1;
    }

    //地址1确认合同
    function confirm1 (uint snum) public {
        require(e_contracts[snum].par1 == msg.sender);
        e_contracts[snum].state += 1;

          
    }

    //地址2确认合同
    function confirm2 (uint snum) public {
         require(e_contracts[snum].par2 == msg.sender);
         e_contracts[snum].state += 1;
    }
} 