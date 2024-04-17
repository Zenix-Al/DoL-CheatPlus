let mycode = {
	runitall: function(){
		if (runitallIsRunning===1 && clickCounter>0) {
			setTimeout(function() {
				mycode.runitall();
			  }, 10);
		}
		runitallIsRunning=1;
		functionsInProcess = 0;
		functionsCompleted = 0;
		var itsin=0;
	  for (var key in functionbundle) {
		if (functionbundle.hasOwnProperty(key) && typeof functionbundle[key] === 'function') {
			var itsin=1;
			let promise = new Promise((resolve, reject) => {
				functionbundle[key]();
				resolve(1);
			});
			promise.then((value) => {
				clickCounter-=1;
				runitallIsRunning=0;
			});
	    }
	  }
	  if (itsin==0) {
		  clickCounter-=1;
		  runitallIsRunning=0;
	  }
  },
   toggleActive: [],
toggle: function(id, name) {
    const button = document.getElementById(id);
    if (this.toggleActive[id]) {
	  functionbundle[id]=undefined;
      button.innerHTML = name;
	  this.toggleActive[id]=undefined;
	  console.log("Deactive!");
    } else {
	  functionbundle[id]=mycode[id].bind(mycode);
      button.innerHTML = name + "&#10003;";
	  this.toggleActive[id]=true;
      console.log("Active!");
    }
  },
     toggleActiveDaily: {},
   functionbundleDaily: {},
  	runitallDaily: function(){
	  for (var key in mycode.functionbundleDaily) {
		if (mycode.functionbundleDaily.hasOwnProperty(key) && typeof mycode.functionbundleDaily[key] === 'function') {
			mycode.functionbundleDaily[key]();
	    }
	  }
  },
toggleDaily: function(id, name) {
    const button = document.getElementById(id);
    if (mycode.toggleActive[id]) {
	  mycode.functionbundleDaily[id]=undefined;
      button.innerHTML = name;
	  mycode.toggleActive[id]=undefined;
	  console.log("Deactive!");
    } else {
	  mycode.functionbundleDaily[id]=mycode[id].bind(mycode);
      button.innerHTML = name + "&#10003;";
	  mycode.toggleActive[id]=true;
	  mycode.functionbundleDaily[id]();
      console.log("Active!");
    }
  },
  
    everyone_horny: function(){
		for (let i = 0; i < npcnamelist.length; i++) {
			if (SugarCube.State.variables.NPCName[i].description!="Ivory Wraith")
				SugarCube.State.variables.NPCName[i].lust = 100;
		}
  },
  
  edenspring: function() {
	SugarCube.State.variables.edenspring=4;
  }, 
edengarden: function() {
	SugarCube.State.variables.edengarden=4;
  }, 
    edentimer: function() {
	SugarCube.State.variables.edendays=0;
  }, 
  edenshrooms: function() {
	SugarCube.State.variables.edenshrooms=4;
  }, 
  checkArrayTreshold: 0,
  checkArray: function(){
	   this.checkArrayTreshold++;
	   if (this.checkArrayTreshold<=10){
		   return;
	   }
	   this.checkArrayTreshold=0;
	   const button = document.getElementById("auto_check_status");
	   button.innerHTML="not found";
	   	function processValue(value) {
		  if (Array.isArray(value) && value.length==0) {
			  var check=Object.keys(value);
			  if (check.length>0) {
				const button = document.getElementById("auto_check_status");
				  button.innerHTML="found";
				  showToast('Broken array has been found!');
				  return;
				logBrokenArrayValues(value);
			  }
			} else if (Array.isArray(value) ) {
				logArrayValues(value);
			} else if (typeof value === 'object' && value !== null) {
				logObjectValues(value);
			}
		}
		function logObjectValues(obj) {
		  for (const key in obj) {
			const value = obj[key];
			processValue(value);
		  }
		}

		function logArrayValues(obj){
			for (let i = 0; i < obj.length; i++) {
				const value = obj[i];
				processValue(value);
			}
		}
		
		function logBrokenArrayValues(obj){
			var check=Object.keys(obj);
			for (const key of check) {
				const value = obj[key];
				processValue(value);
			  }
		}
	   logObjectValues(SugarCube.State.variables);
  },
  orgasm_toggle:0,
  tmpArousal:0,
  unlicum: function() {
	if (SugarCube.State.variables.semen_amount<3000) {
		SugarCube.State.variables.semen_volume=3000;
		SugarCube.State.variables.semen_amount=3000;
	}
	if (SugarCube.State.variables.orgasmcurrent !=1){
		mycode.orgasm_toggle=0;
		SugarCube.State.variables.orgasmcount = 0;
	} else if (mycode.orgasm_toggle==0) {
		mycode.orgasm_toggle=1;
		mycode.tmpArousal=SugarCube.State.variables.arousal;
		SugarCube.State.variables.arousal;
		SugarCube.State.variables.orgasmdown=5;
		var orgasmdown= database.toLowerCase().includes(whatversion.toLowerCase()) ? (SugarCube.State.variables.npcArousalMult-100)/25*5 : 5;
		SugarCube.State.variables.orgasmdown= orgasmdown>=5 ? orgasmdown : 5;
	}
	if (SugarCube.State.variables.orgasmdown>0) SugarCube.State.variables.arousal=mycode.tmpArousal;
  },
  unliarousal: function() {
    SugarCube.State.variables.arousal=10000;
  },
   virginity: function(){
	  SugarCube.State.variables.player.virginity.penile=true;
	  SugarCube.State.variables.player.virginity.vaginal=true;
  },
  maxchruchtask: function() {
	SugarCube.State.variables.temple_garden=100;
    SugarCube.State.variables.temple_quarters=100;
	SugarCube.State.variables.grace=100;
  },
  maxanimaltask: function() {
	SugarCube.State.variables.stray_happiness=100;
  },
    purity: function() {
	  SugarCube.State.variables.purity=1000;
  },
  farm_safe: function(){
	SugarCube.State.variables.farm.aggro=0;
  },
  interact_child: function(){
	  for (var key in SugarCube.State.variables.children) {
		if (SugarCube.State.variables.children[key].localVariables.event==true) {
			SugarCube.State.variables.children[key].localVariables.interactions+=1;
			SugarCube.State.variables.children[key].localVariables.interactionsTotal+=1;
			SugarCube.State.variables.children[key].localVariables.event=false;
		}
	  }
  },
	total_npc_pregnant: 0,
	pc_pregnant: 0,
	pregnancy_detection: function(){
		if (this.total_npc_pregnant==0){
			this.total_npc_pregnant=Object.keys(SugarCube.State.variables.storedNPCs).length;
			for (var i=0;i<SugarCube.State.variables.NPCName.length;i++){
				if (Object.keys(SugarCube.State.variables.NPCName[i].pregnancy).length!=0) {
					this.total_npc_pregnant++;
				}
			}
			this.pc_pregnant= SugarCube.State.variables.sexStats.vagina.pregnancy.fetus.length+SugarCube.State.variables.sexStats.anus.pregnancy.fetus.length;
		} else {
			var tmp_npc=Object.keys(SugarCube.State.variables.storedNPCs).length;
			for (var i=0;i<SugarCube.State.variables.NPCName.length;i++){
				if (Object.keys(SugarCube.State.variables.NPCName[i].pregnancy).length!=0) {
					tmp_npc++;
				}
			}
			var tmp_pc=SugarCube.State.variables.sexStats.vagina.pregnancy.fetus.length+SugarCube.State.variables.sexStats.anus.pregnancy.fetus.length;
		}
		
		if (tmp_npc>this.total_npc_pregnant){
			showToast('NPC is impregnated!');
			this.total_npc_pregnant=tmp_npc;
		} else if (tmp_npc<this.total_npc_pregnant) {
			showToast('NPC\'s baby has been born!');
			this.total_npc_pregnant=tmp_npc;
		}
		if (tmp_pc>this.pc_pregnant) {
			showToast('MC is impregnated!');
			this.pc_pregnant= tmp_pc;
		} else if (tmp_pc<this.pc_pregnant) {
			showToast('your baby has been born!!');
			this.pc_pregnant= tmp_pc;
		}
	},
	named_npc_pregnancy_manager_toggle: function(){
		for (const key in this.named_npc_pregnancy_locked) {
			var total =SugarCube.State.variables.NPCName[this.named_npc_pregnancy_locked[key]].pregnancy.timerEnd-(this.named_npc_pregnancy_locked_day[key]*3);
			if (total<0) total=0;
			SugarCube.State.variables.NPCName[this.named_npc_pregnancy_locked[key]].pregnancy.timer=total;
		}
	},
	npc_pregnancy_manager_toggle: function(){
		for (const key in this.npc_pregnancy_locked) {
			var total =SugarCube.State.variables.storedNPCs[this.npc_pregnancy_locked[key]].pregnancy.timerEnd-(this.npc_pregnancy_locked_day[key]*3);
			if (total<0) total=0;
			SugarCube.State.variables.storedNPCs[this.npc_pregnancy_locked[key]].pregnancy.timer=total;
		}
	},
	mc_pregnancy_manager_toggle: function(){
		var lap=0;
		for (const key in this.mc_pregnancy_locked) {
			if (this.mc_pregnancy_locked_type[lap]=="parasite") {
				SugarCube.State.variables.sexStats[this.mc_pregnancy_locked_hole[lap]].pregnancy.fetus[key].daysLeft=this.mc_pregnancy_locked_day[lap];
			} else {
				var timeEnd=SugarCube.State.variables.sexStats[this.mc_pregnancy_locked_hole[lap]].pregnancy.timerEnd;
				var time=timeEnd-(this.mc_pregnancy_locked_day[lap]*3);
				console.log(time);
				if (time<0) time=0;
				SugarCube.State.variables.sexStats[this.mc_pregnancy_locked_hole[lap]].pregnancy.timer=time;
			}
		}
	},
	prevAngelBuild: 0,
	restoreAngel: false,
	invincibleAngel: function(){
		if (SugarCube.State.variables.penisstate.match(/entrance/)) {
			if (!this.restoreAngel) this.prevAngelBuild=SugarCube.State.variables.angel;
			SugarCube.State.variables.angel=0;
			SugarCube.State.variables.angelbuild=100;
			this.restoreAngel=true;
		} else if (!SugarCube.State.variables.penisstate.match(/entrance/) && this.restoreAngel){
			this.restoreAngel=false;
			SugarCube.State.variables.angel=this.prevAngelBuild;
			SugarCube.State.variables.angelbuild=100;
} 
	}
}