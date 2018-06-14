var SERVER_URL = "http://localhost:8888";

var Table=(function(){ 
	return function(nebulasdb, userAddress, environment){
		var _userAddress = userAddress;
		var _environment = environment;
		var _nebulasdb = nebulasdb;

		this.drop = function(callback){
			var dbName = this.parentName;
			var tableName = this.name;
			var environment = _environment;
			var loginAddress = _userAddress;
			$.ajax({
				type:"POST",
				url:SERVER_URL+"/api/db/table/delete",
				data:{
					DBId : this.parentId,
					tableId : this.id,
					env : environment,
					address : loginAddress
				},
				success:function(response){
					if(response.code == 200){
						_nebulasdb.checkTx(response.msg, function(resp){
							if(_nebulasdb.checkResponseError(resp)){
								callback(resp);
							}else{
								var respJson = JSON.parse(resp);
								_nebulasdb.removeDBTableField(dbName, tableName);
								callback(respJson);
							}
						});
					}else{
						throw Error(JSON.stringify(response));
					}
				}
			});
		};
		this.insert = function(record, callback){
			var environment = _environment;
			var loginAddress = _userAddress;
			$.ajax({
				type:"POST",
				url:SERVER_URL+"/api/db/table/data/add",
				data:{
					tableId : this.id,
					record : JSON.stringify(record),
					env : environment,
					address : loginAddress
				},
				success:function(response){
					if(response.code == 200){
						_nebulasdb.checkTx(response.msg, function(resp){
							if(_nebulasdb.checkResponseError(resp)){
								callback(resp);
							}else{
								var respJson = JSON.parse(resp);
								callback(respJson);
							}
						});
					}else{
						throw Error(JSON.stringify(response));
					}
				}
			});
		};

		this.delete = function(query, callback){
			var environment = _environment;
			var loginAddress = _userAddress;
			
			$.ajax({
				type:"POST",
				url:SERVER_URL+"/api/db/table/data/delete",
				data:{
					tableId : this.id,
					query : JSON.stringify(query),
					env : environment,
					address : loginAddress
				},
				success:function(response){
					if(response.code == 200){
						_nebulasdb.checkTx(response.msg, function(resp){
							if(_nebulasdb.checkResponseError(resp)){
								callback(resp);
							}else{
								var respJson = JSON.parse(resp);
								callback(respJson);
							}
						});
					}else{
						throw Error(JSON.stringify(response));
					}
				}
			});
		};

		this.update = function(query, update, option, callback){
			var environment = _environment;
			var loginAddress = _userAddress;
			$.ajax({
				type:"POST",
				url:SERVER_URL+"/api/db/table/data/update",
				data:{
					tableId : this.id,
					query : JSON.stringify(query),
					update : JSON.stringify(update),
					option : JSON.stringify(option),
					env : environment,
					address : loginAddress
				},
				success:function(response){
					if(response.code == 200){
						_nebulasdb.checkTx(response.msg, function(resp){
							if(_nebulasdb.checkResponseError(resp)){
								callback(resp);
							}else{
								var respJson = JSON.parse(resp);
								callback(respJson);
							}
						});
					}else{
						throw Error(JSON.stringify(response));
					}
				}
			});
		};

		this.find = function(query, offset, limit, callback){
			var environment = _environment;
			var loginAddress = _userAddress;
			$.ajax({
				type:"GET",
				url:SERVER_URL+"/api/db/table/data",
				data:{
					tableId : this.id,
					query : JSON.stringify(query),
					offset : offset,
					limit : limit,
					env : environment,
					address : loginAddress
				},
				success:function(response){
					if(response.code == 200 && response.data){
						if(response.data.indexOf("Error") >= 0){
							throw Error(JSON.stringify(response));
						}else{
							var result = JSON.parse(response.data);
							callback(result.data);
						}
					}else{
						throw Error(JSON.stringify(response));
					}
				}
			});
		};
	};
})();

var DB = (function(){ 
	return function(nebulasdb,userAddress, environment){
		var _userAddress = userAddress;
		var _environment = environment;
		var _nebulasdb = nebulasdb;

		this.createTable = function(tableName, callback){
			var environment = _environment;
			var loginAddress = _userAddress;
			$.ajax({
				type:"POST",
				url:SERVER_URL+"/api/db/table/add",
				data:{
					DBId : this.id,
					tableName : tableName,
					env : environment,
					address : loginAddress
				},
				success:function(response){
					if(response.code == 200){
						_nebulasdb.checkTx(response.msg, function(resp){
							if(_nebulasdb.checkResponseError(resp)){
								callback(resp);
							}else{
								var respJson = JSON.parse(resp);
								_nebulasdb.reConnect();
								callback(respJson);
							}
						});
					}else{
						throw Error(JSON.stringify(response));
					}
				}
			});
		};

		this.drop = function(callback){
			var dbName = this.name;
			var environment = _environment;
			var loginAddress = _userAddress;
			$.ajax({
				type:"POST",
				url:SERVER_URL+"/api/db/delete",
				data:{
					userAddress : this.parentId,
					DBId : this.id,
					env : environment,
					address : loginAddress
				},
				success:function(response){
					if(response.code == 200){
						_nebulasdb.checkTx(response.msg, function(resp){
							if(_nebulasdb.checkResponseError(resp)){
								callback(resp);
							}else{
								var respJson = JSON.parse(resp);
								_nebulasdb.removeDBField(dbName)
								callback(respJson);
							}
						});
					}else{
						throw Error(JSON.stringify(response));
					}
				}
			});
		};
	};
})();

var NebulasDB = (function(){
	return function(userAddress, environment){
		var _environment, _userAddress;
		if(!userAddress){
			throw Error("User can't be empty! please call setUser()");
		}
		if(!(environment == "TESTNET" || environment == "MAINNET")){
			throw Error("Please set up the environment. (TESTNET or MAINNET)")
		}
		var _serverUrl;
		this.setServerUrl = function(serverUrl){
			_serverUrl = serverUrl;
		};

		this.getServerUrl = function(){
			return _serverUrl;
		};

		this.setUser = function(userAddress){
			// NebulasDB.prototype.userAddress = userAddress;\
			_userAddress = userAddress;
		};

		this.getUser = function(){
			return _userAddress;
		};

		this.setEnvironment = function(environment){
			// NebulasDB.prototype.environment = environment;
			_environment = environment;
		};

		this.getEnvironment = function(){
			return _environment;
		};
		
		this.connect = function(){
			this.reConnect();
		};

		//init 
		this.setUser(userAddress);
		this.setEnvironment(environment);
		this.setServerUrl(SERVER_URL);

		//private function
		this.checkUserExist = function(userAddress){
			var environment = _environment;
			var isExist = false;
			$.ajax({
				type:"GET",
				async:false,
				url:_serverUrl+"/api/user/exist",
				data:{
					address:userAddress,
					env:environment,
				},
				success:function(response){
					if(response.data === "true"){
		    			isExist = true;
		    		}
				},
				error:function(error){
					throw Error(JSON.stringify(error));
				}
			});
			return isExist;
		};

		this.initUserConfig = function(userAddress){
			var environment = _environment;
			var dbConfigs = [];
			$.ajax({
				type:"GET",
				async:false,
				url:_serverUrl+"/api/db/"+userAddress,
				data:{
					env : environment,
					address : userAddress
				},
				success:function(responseForDB){
					if(responseForDB.data){
						var allDBs = JSON.parse(responseForDB.data);
						for(var dbName in allDBs){
							var dbId = allDBs[dbName];
							var DBObject = {};
							DBObject.dbName = dbName;
							DBObject.dbId = dbId;

							$.ajax({
								type:"GET",
								async:false,
								url:_serverUrl+"/api/db/table/"+dbId,
								data:{
									env : environment,
									address : userAddress
								},
								success:function(responseForTable){
									if(responseForTable.data){
										var allTables = JSON.parse(responseForTable.data);
										DBObject.tables = allTables;
									}
								}
							});
							dbConfigs.push(DBObject);
						}
					}
				}
			});
			return dbConfigs;
		};

		this.createDB = function(dbName, callback){
			var self = this;
			var userAddress = this.getUser();
			var environment = this.getEnvironment();
			if(!userAddress){
				throw Error("User can't be empty! please call setUser()");
			}
			$.ajax({
				type:"POST",
				url:SERVER_URL+"/api/db/add",
				data:{
					userAddress : userAddress,
					dbName : dbName,
					env : environment,
					address : userAddress
				},
				success:function(response){
					if(response.code == 200){
						self.checkTx(response.msg, function(resp){
							if(self.checkResponseError(resp)){
								callback(resp);
							}else{
								var respJson = JSON.parse(resp);
								self.reConnect();
								callback(respJson);
							}
							
						});
					}else{
						throw Error(JSON.stringify(response));
					}
				}
			});
		};

		this.reConnect = function(){
			var address = this.getUser();
			var environment = this.getEnvironment();
			//check user exist
			if(!address){
				throw Error("User can't be empty! please call setUser()");
			}
			if(this.checkUserExist(address)){
				var dbConfigs = this.initUserConfig(address);
				for(var i = 0; i < dbConfigs.length; i++){
					this[dbConfigs[i].dbName] = new DB(this, address, environment);
					this[dbConfigs[i].dbName]["id"] = dbConfigs[i].dbId;
					this[dbConfigs[i].dbName]["name"] = dbConfigs[i].dbName;
					this[dbConfigs[i].dbName]["parentId"] = address;
					for(var tableName in dbConfigs[i].tables){
						this[dbConfigs[i].dbName][tableName] = new Table(this, address, environment);
						this[dbConfigs[i].dbName][tableName]["id"] = dbConfigs[i].tables[tableName];
						this[dbConfigs[i].dbName][tableName]["name"] = tableName;
						this[dbConfigs[i].dbName][tableName]["parentId"] = dbConfigs[i].dbId;
						this[dbConfigs[i].dbName][tableName]["parentName"] = dbConfigs[i].dbName;
					}
				}
			}else{
				throw Error("User is not yet registered!");
			}
		};

		this.removeDBField = function(fieldName){
			delete this[fieldName];
		};

		this.removeDBTableField = function(dbName, tableName){
			delete this[dbName][tableName];
		};

		this.checkTx = function(txHash, callback){
			var address = this.getUser();
			var environment = this.getEnvironment();
			//check tx
			var interval = setInterval(function(){
				$.ajax({
					type:"GET",
					url:SERVER_URL+"/api/tx/"+txHash,
					data:{
						env : environment,
						address : address
					},
					success:function(response){
						var data = response.data;
						if(data){
							if(data.result.executeResult){
								clearInterval(interval);
								callback(data.result.executeResult);
							}else{
								console.log("[Checking transaction]"+JSON.stringify(response));
							}
						}else{
							console.log("[Checking transaction]"+JSON.stringify(response));
						}

					}
				});
			}, 4000);
		};

		this.checkResponseError = function(resp){
			if(resp.indexOf("Error") >= 0){
				return true;
			}
			return false;
		};

		this.getAllDBs = function(callback){
			var address = this.getUser();
			var environment = this.getEnvironment();
			$.ajax({
				type:"GET",
				url:_serverUrl+"/api/db/"+address,
				data:{
					env : environment,
					address : userAddress
				},
				success: callback
			});
		};

		this.getAllTables = function(dbId, callback){
			var address = this.getUser();
			var environment = this.getEnvironment();
			$.ajax({
				type:"GET",
				url:_serverUrl+"/api/db/table/"+dbId,
				data:{
					env : environment,
					address : address
				},
				success:callback
			});
		};


	}
})();