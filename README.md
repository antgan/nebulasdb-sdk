# NebulasDB JS-SDK

## 1. 介绍

### 1.1 NebulasDB

NebulasDB是一款基于星云链、去中心化、非关系型的数据库，
并且提供了JS-SDK、客户端控制台方便开发进行数据操作。

### 1.2 JS-SDK

> JS-SDK (Javascript-Software Development Kit )

JS-SDK是调用NebulasDB的Javascript工具包,在项目中引入`nebulasdb-jssdk.js`

即可快速连接NebulasDB，进行操作数据。

### 1.3 依赖

nebulasdb-sdk依赖了jQuery


依赖 | 版本
---|---
[jQuery](http://www.bootcdn.cn/jquery/) | 3.3.1

[下载地址](http://www.bootcdn.cn/jquery/) 


### 1.4 如何引入

- Html内直接引入即可：
```
<script src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
<script src="nebulasdb-jssdk.js" type="text/javascript"></script>
```

## 2. 调用方式

### 2.1 初始化并连接数据库

#### 2.1.1 初始化连接
```
var Nebulas = new NebulasDB(userAddress, environment);
```

参数说明：

参数名 | 说明 
---|---
userAddress | 用户钱包地址，也是注册的用户地址
environment | 指定连接环境，`TESTNET` 或者 `MAINNET`

例子：
```
var Nebulas = new NebulasDB("n1NfCrXjb3STRokWap28SgFLY4hUcHCjEsp", "TESTNET");
```

#### 2.1.2 连接DB
```
Nebulas.connect();
```

> 连接成功后，SDK会帮你把用户信息、用户数据库、和表都自动挂在在Nebulas变量上。

> 数据的操作都发生在Nebulas变量上，稍后会讲到。

### 2.2 调用接口

> 注意：任何的增删改操作都会提交Transaction、上链需要等待10~20s。(查询不需要等待)。
 
> SDK提供了callback来处理执行成功后的业务逻辑。

#### 2.2.1 创建数据库

```
Nebulas.createDB(dbName, callback);
```

参数说明：

参数名 | 说明 
---|---
dbName | 数据库名称，只允许字母或下划线[a-zA-Z_]
callback | 执行成功后的callback

例子：
```
Nebulas.createDB("MyFirstDB", function(response){
    console.log(response);
});
```
--- 
#### 2.2.2 删除数据库

```
Nebulas.YourDBName.drop(callback);
```

参数说明：

参数名 | 说明 
---|---
YourDBName | 是你的数据库名称，如2.2.1创建了MyFirstDB。
callback | 执行成功后的callback

例子：
```
Nebulas.MyFirstDB.drop(function(response){
    console.log(response);
});
```
--- 
#### 2.2.3 创建表

```
Nebulas.YourDBName.createTable(tableName, callback);
```

参数说明：

参数名 | 说明 
---|---
YourDBName | 是你的数据库名称，如2.2.1创建了MyFirstDB。
tableName | 表名
callback | 执行成功后的callback

例子：
```
Nebulas.MyFirstDB.createTable("MyFirstTable", function(response){
    console.log(response);
});
```
--- 
#### 2.2.4 删除表

```
Nebulas.YourDBName.YourTableName.drop(callback);
```

参数说明：

参数名 | 说明 
---|---
YourDBName | 是你的数据库名称，如2.2.1创建了MyFirstDB
YourTableName | 是你的表名称，如2.2.2创建了MyFirstTable
callback | 执行成功后的callback

例子：
```
Nebulas.MyFirstDB.MyFirstTable.drop(function(response){
    console.log(response);
});
```

--- 
#### 2.2.5 插入数据

```
Nebulas.YourDBName.YourTableName.insert(data, callback);
```

参数说明：

参数名 | 说明 
---|---
YourDBName | 是你的数据库名称，如2.2.1创建了MyFirstDB
YourTableName | 是你的表名称，如2.2.2创建了MyFirstTable
data | 插入的数据，如：{name:"Abel", age:23}
callback | 执行成功后的callback

插入一条数据的例子：
```
Nebulas.MyFirstDB.MyFirstTable.insert({name:"Abel", age:23}, function(response){
    console.log(response);
});
```

--- 
#### 2.2.6 修改数据

```
Nebulas.YourDBName.YourTableName.update(query, update, option, callback);
```

参数说明：

参数名 | 说明 
---|---
YourDBName | 是你的数据库名称，如2.2.1创建了MyFirstDB
YourTableName | 是你的表名称，如2.2.2创建了MyFirstTable
query | 查询条件，如查询名字为Abel的数据：{name:"Abel"}
update | 修改数据，只支持$set操作符。如修改成25岁：{$set{age:25}}
option | 配置，暂时只支持upsert操作符。默认为false
callback | 执行成功后的callback

> SDK暂时只提供$set, upsert操作符。

> [$set] 需要修改成什么数据

> [upsert] 如果query找不到数据，则插入数据。false，反之则不插入。

把叫Abel的年龄修改成25的例子：
```
Nebulas.MyFirstDB.MyFirstTable.update({name:"Abel"}, {$set:{age:25}}, {upsert:false}, function(response){
    console.log(response);
});
```

--- 
#### 2.2.7 删除数据

```
Nebulas.YourDBName.YourTableName.delete(query, callback);
```

参数说明：

参数名 | 说明 
---|---
YourDBName | 是你的数据库名称，如2.2.1创建了MyFirstDB
YourTableName | 是你的表名称，如2.2.2创建了MyFirstTable
query | 查询条件，如删除名字为Abel的数据：{name:"Abel"}
callback | 执行成功后的callback

删除所有叫Abel的数据的例子：
```
Nebulas.MyFirstDB.MyFirstTable.delete({name:"Abel"}, function(response){
    console.log(response);
});
```

--- 
#### 2.2.8 查询数据

```
Nebulas.YourDBName.YourTableName.find(query, offset, limit, callback);
```

参数说明：

参数名 | 说明 
---|---
YourDBName | 是你的数据库名称，如2.2.1创建了MyFirstDB
YourTableName | 是你的表名称，如2.2.2创建了MyFirstTable
query | 查询条件，如查询所有年龄为23的数据：{age:23}
offset | 页码偏移量
limit | 数量
callback | 执行成功后的callback

> offset和limit用于分页使用。offset为页码，limit为一页显示多少数据。

> 如果不想分页查询，offset和limit传入null即可。

查询年龄为23的所有数据，从第一条开始，一共取10条。例子：
```
Nebulas.MyFirstDB.MyFirstTable.find({age:23}, 0, 10, function(response){
    console.log(response);
});
```

查询所有，并且不分页的例子：
```
Nebulas.MyFirstDB.MyFirstTable.find({}, null, null, function(response){
    console.log(response);
});
```

---

### 2.3 轮询查询Transaction状态机制

- Nebulas-sdk内置了自动查询Transaction的结果。

- 当执行成功后，会把结果回调给开发者传入的callback函数中，方便开发进行结果的处理。

- 规则：4秒轮询查询一次。


## 3. 问题反馈

如果有什么问题，[欢迎反馈到这里。](https://github.com/antgan/nebulasdb-sdk/issues)






