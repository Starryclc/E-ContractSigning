pragma solidity ^0.5.0;

contract EContract{
    string public name;
    uint public e_contractCount = 0;
    mapping (uint => econ) public e_contracts;//合同索引
    address public admin;
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


   //构造函数
    constructor () public {
        admin=msg.sender;
    }

    //创建合同
    function createEcontract (string memory content,string memory nickname1,string memory nickname2,uint idCard1,uint idCard2,address par1,address par2) public {
       // 自增 合同序列从1开始
        e_contractCount ++;
        //address  _author=msg.sender;
        e_contracts[e_contractCount] = econ(e_contractCount,now,content,0,0,nickname1,nickname2,idCard1,idCard2,par1,par2);
         
    }


    //地址1签署合同
    function sign1 (uint num) public {
        require(e_contracts[num].par1 == msg.sender && e_contracts[num].state1==0);
        e_contracts[num].state1 += 1;
    }


    //地址2签署合同
    function sign2 (uint num) public {
         require(e_contracts[num].par2 == msg.sender && e_contracts[num].state2==0);
         e_contracts[num].state2 += 1;
    }

    //地址1确认合同
    function confirm1 (uint num) public {
        require(e_contracts[num].par1 == msg.sender
        && (e_contracts[num].state1==1&&(e_contracts[num].state2>0)));
        e_contracts[num].state1 += 1;
    }

    //地址2确认合同
    function confirm2 (uint num) public {
         require(e_contracts[num].par2 == msg.sender
         && (e_contracts[num].state2==1&&(e_contracts[num].state1>0)));
         e_contracts[num].state2 += 1;
    }



    //管理员批准合同
    function pass(uint num) public {
        require(admin==msg.sender);
        e_contracts[num].state1=3;
        e_contracts[num].state2=3;
    }


    //管理员未批准=>已中止
     function reject(uint num) public {
            require(admin==msg.sender);
            e_contracts[num].state1=4;
            e_contracts[num].state2=4;
        }
} 