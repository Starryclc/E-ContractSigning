# contract-signing-platform-based-on-truffle
基于truffle实现简单电子合同签署平台

## 已实现功能
### 链上所有合法用户
* 合同发布
* 合同签署+再确认
* 合同查询
* 申请中止
### 管理员
* 自动显示链上所有合同状态列表
* 合同审核
* 批复中止申请
### 基本功能校验
* 身份证号合法性校验
* 重复操作校验
* 查询合同序列号是否存在校验

## 流程
### 合同发布
>任意链上合法用户填写必要合同信息后均可发布合同，此使合同状态为“新创建”，合同未成功签署。
### 合同签署+再确认
>发布者告知甲乙双方合同已新发布后，甲乙双方先各自进行首次签署操作，均签署完成后，需要再进行二次确认操作，签署和再确认都执行完毕后，合同等待管理员审核。
### 合同审核
>管理员审核合同内容是否合法以及双方账户是否为链上账户，然后决定通过/中止。
### 合同中止申请
>若甲乙方需要意外终止合同，则需在联系管理员提供证明，管理员查证后，选择是否予以通过。

## 环境
* Truffle v5.1.26
* Node.js v12.16.3.
* 依赖：npm包管理
* truffle-config.js配置文件设置为自己host和port

## 运行
编译：`$ truffle compile`
部署：`$ truffle migrate`
运行：`$ npm run dev`


## 开发日志

### 2020/05/26
已实现：
* 基本合约
* 基本前端页面
* 前后端交互

未实现：
* 管理员功能
### 2020/05/30
* 增加重复签署重复确认判断
* 增加当前地址相关合约列表

### 2020/06/06

* 增加身份证号校验
* 增加管理员功能
* 修改查询合约内容实现方式