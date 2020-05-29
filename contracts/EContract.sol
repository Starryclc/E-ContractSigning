pragma solidity ^0.5.0;

contract EContract{
    string public name;
    uint public e_contractCount = 0;
    mapping (uint => econ) public e_contracts;//合同索引

    struct econ {
         uint id;//合同编号
         uint createTime;//发布时间，用当前时间表示
         string content;//内容
         uint state1; //state1：par1状态 0为未签署 1为未确认
         uint state2; //state2: par2状态 0未签署 1未确认
         string nickname1;//签署姓名1
         string nickname2;//签署姓名2     
         uint idCard1;//身份证信息1
         uint idCard2;//身份证信息1
         address  par1;//签署地址1
         address  par2;//签署地址2
    }

    //管理员地址
   address owner;

   //构造函数
    constructor () public {
        name = "Decentralized Systems";
        owner=msg.sender;
    }

    //创建合同
    function createEcontract (string memory content,string memory nickname1,string memory nickname2,uint idCard1,uint idCard2,address par1,address par2) public {
       // 自增 合同序列从1开始
        e_contractCount ++;
        //address  _author=msg.sender;
        e_contracts[e_contractCount] = econ(e_contractCount,now,content,0,0,nickname1,nickname2,idCard1,idCard2,par1,par2);
         
    }


    //地址1签署合同
    function sign1 (uint snum) public {
        require(e_contracts[snum].par1 == msg.sender && e_contracts[snum].state1==0);
        e_contracts[snum].state1 += 1;
    }


    //地址2签署合同
    function sign2 (uint snum) public {
         require(e_contracts[snum].par2 == msg.sender && e_contracts[snum].state2==0);
         e_contracts[snum].state2 += 1;
    }

    //地址1确认合同
    function confirm1 (uint snum) public {
        require(e_contracts[snum].par1 == msg.sender
        && (e_contracts[snum].state1==1&&(e_contracts[snum].state2>0)));
        e_contracts[snum].state1 += 1;
    }

    //地址2确认合同
    function confirm2 (uint snum) public {
         require(e_contracts[snum].par2 == msg.sender
         && (e_contracts[snum].state2==1&&(e_contracts[snum].state1>0)));
         e_contracts[snum].state2 += 1;
    }
} 