/*var debug;
var isServer;
var cheatVer;
var testedOn;*/
//variables init
//main
var quicklink = document.getElementById("quick-link");
var statlink = document.getElementById("stats-link");
var misclink = document.getElementById("misc-link");
var quickcontent = document.getElementById("quick-content");
var statscontent = document.getElementById("stats-content");
var misccontent = document.getElementById("misc-content");
var toastContainer = document.getElementById('toastContainer');
var modal = document.getElementById("modal");
var modalContentContainer = document.getElementById('modal-content-container');
//mycode
var functionbundle = {}; 
var dailyfunctionbundle = {}; 
var runitallIsRunning=0;
var prevHour=-1;
//sync
var syncinprogress=0;
var database="degrees-of-lewdity";
var whatversion="vanilla";
//listener
var cheat = document.getElementById("cheat");
var clickCounter=0;
var curDate=0;
//cheat init
var npctrait = ['trust', 'love', 'dom', 'lust', 'rage', 'trauma', 'purity', 'corruption'];
var characteristics=['beauty', 'purity', 'physique', 'willpower', 'awareness', 'promiscuity', 'exhibitionism', 'deviancy', 'grace', 'submissive', 'masochism', 'sadism'];
var npcinterest=["Robin", "Whitney", "Eden", "Kylar", "Avery", "Black Wolf", "Great Hawk", "Alex", "Sydney"];
var npcnamelist=SugarCube.setup.NPCNameList;
var bodyparts= ["nipples", "bottom", "penis", "balls", "clit", "anus", "vagina", "labia", "left_thigh", "right_thigh", "left_foot", "right_foot", "left_arm", "right_arm", "left_hand", "right_hand", "tummy", "back", "face", "mouth", "left_ear", "right_ear", "hair"];
var parasitename=["urchin", "slime", "maggot"];
var fame=["exhibitionism", "prostitution", "bestiality", "sex", "rape", "good", "business", "scrap", "pimp", "social", "model", "pregnancy", "impreg"];
var school_rep=["delinquency","cool"];
var animals=['pigs','horses','cattle','dogs'];
var orgasm_toggle=0;
var exam=["science_exam", "maths_exam", "english_exam", "history_exam"];
var talent_skill = ["danceskill", "swimmingskill", "skulduggery", "athletics", "tending", "housekeeping"];
var hentaiSkill = ["seductionskill", "oralskill", "vaginalskill", "analskill", "handskill", "feetskill", "bottomskill", "thighskill", "chestskill", "penileskill"];
var curVer=document.getElementById("gameVersionDisplay2").innerHTML;
var textBox=document.getElementById("tmpText");
var babyOptions = ["motherKnown", "fatherKnown", "name", "abandon"];
var babyOptionsText = ["mother Known", "father Known", "name", "Abandon"];

//endof variable init
function showToast(text) {
    const newToast = document.createElement('div'); 
    newToast.classList.add('toast'); 
    newToast.textContent = text;
    toastContainer.appendChild(newToast); 
    setTimeout(() => {
        newToast.classList.add('hidden');
        setTimeout(() => {
            toastContainer.removeChild(newToast); 
        }, 300);
    }, 3000);
}

 
 function openModal() {
  modal.style.display = "block";
  modalOpen = true; 
  loadall();
}

function closeModal() {
  modal.style.display = "none";
  modalOpen = false; 
}

function moveButton(direction) {
    const floatingButton = document.getElementById("floating-button");
    if (direction === "up") {
        floatingButton.style.top = "2%";
        document.getElementById("cheat-up").hidden = true;
        document.getElementById("cheat-down").hidden = false;
    } else if (direction === "down") {
        floatingButton.style.top = "90%";
        document.getElementById("cheat-up").hidden = false;
        document.getElementById("cheat-down").hidden = true;
    }
}



function showContent(nav, contentElement) {
	hideAllContent();
	nav.classList.add("gold");
	contentElement.classList.add("active");
}


function generatetext(ids, inputs, textInputs, category) {
	var inputcategory = document.getElementById(category);
	var modalInputs = document.createElement('div');
	modalInputs.style.paddingBottom = '5px';
	for (var i = 0; i < inputs.length; i++) {
	  if (inputs[i] === "input") {
		var input = '<input id="' + ids[i] + '" style="width: 90px;">';
	  } else if (inputs[i] === "textarea") {
		var input = '<textarea id="' + ids[i] + '" style="width: 90px;"></textarea>';
	  } else if (inputs[i] === "select") {
		var input = '<select id="' + ids[i] + '">';
		for (var j = 0; j < textInputs[i].length; j++) {
		  input += '<option value="' + textInputs[i][j] + '">' + textInputs[i][j] + '</option>';
		}
		input += '</select>';
	  } else if (inputs[i] === "button") {
		var input = '<a role="link" id="' + ids[i] + '">' + textInputs[i] + '</a>';
	  } else if (inputs[i] === "radio") {
		  var input='';
		for (var j = 0; j < textInputs[i].length; j++) {
		   input += '<input type="radio" id="' + ids[i] +j+ '" name="' + ids[i] + '" value="' + textInputs[i][j] + '"/><label for="' + ids[i] +j+ '" style="margin-right: 10px;">' + textInputs[i][j] + '</label>';
		}
	  } else if (inputs[i] === "header") {
		  input = '<span class="gold">'+textInputs[i]+'</span>';
	  } else if (inputs[i] === "newline") {
		  input = '<br>';
	  } else if (inputs[i] === "text") {
		  input = textInputs[i];
	  } else if (inputs[i]=== "range"){
		  input = '<input type="range" id="' + ids[i] + '" min="0" max="' + textInputs[i] + '" value="0">';
	  } else if (inputs[i]=== "link"){
		  input = '<a href="'+ids[i]+'" target="_blank">' + textInputs[i] + '</a>';
	  } else if (inputs[i]==="tooltip") {
		  input = '<mouse class="tooltip-small linkBlue" id="'+ids[i]+'">(?)<span>' + textInputs[i] + '</span></mouse>';
	  } else if (inputs[i]==="checkbox") {
		  input = '<input id="'+ids[i]+'" type="checkbox" style="color: var(--500);">'+ textInputs[i];
	  }
	  
	  if (inputs.length > 1 &&  i < inputs.length-1) input += " | ";
	  modalInputs.innerHTML += input;
	}
	inputcategory.appendChild(modalInputs);
}

function hideAllContent() {
	quicklink.classList.remove("gold");
	statlink.classList.remove("gold");
	misclink.classList.remove("gold");
	quickcontent.classList.remove("active");
	statscontent.classList.remove("active");
	misccontent.classList.remove("active");
}function openDatabase() {
  var request = window.indexedDB.open(database, 1);
  
  request.onerror = function(event) {
	  console.log('Error adding data:', event.target.error);
  };
  
  request.onupgradeneeded = function(event) {
    var db = event.target.result;
    var detailsStore = db.createObjectStore('details', { keyPath: 'slot' });
    var savesStore = db.createObjectStore('saves', { keyPath: 'slot' });
  };
  
  return request;
}

function addData(db, objectStoreName, data, action) {
  return new Promise((resolve, reject) => {
    var transaction = db.transaction([objectStoreName], 'readwrite');
    var objectStore = transaction.objectStore(objectStoreName);
  
    var request;
    if (action === 'add') {
	  request = objectStore.add(data);
	  request.onsuccess = function() {
          resolve(request.result); // Resolve with request.result
        };
	} else if (action === 'put') {
	  request = objectStore.put(data);
	  request.onsuccess = function() {
          resolve(request.result); // Resolve with request.result
        };
	} else if (action === 'get') {
	  request = objectStore.get(data);
	  request.onsuccess = function() {
          resolve(request.result); // Resolve with request.result
        };
	} else if (action === 'hybrid') {
      request = objectStore.get(data.slot);
      request.onsuccess = function(event) {
        var result = event.target.result;
        if (result) {
          request = objectStore.put(data);
        } else {
          request = objectStore.add(data);
        }
        request.onsuccess = function() {
          resolve(request.result); // Resolve with request.result
        };
        request.onerror = function(event) {
          reject('Error performing action: ' + event.target.error);
        };
      };
    } else if (action === 'count') {
      request = objectStore.count();
	  request.onsuccess = function() {
          resolve(request.result); // Resolve with request.result
        };
    } else if (action==='keys') {
		var keys = [];
		request = objectStore.openCursor();
		request.onsuccess = function(event) {
		  var cursor = event.target.result;
		  if (cursor) {
			keys.push(cursor.key);
			cursor.continue();
		  } else {
			resolve(keys); // Resolve the promise with the keys
		  }
		};
	}
    transaction.oncomplete = function(event) {
      resolve(); // Resolve without a result
    };
  
    request.onerror = function(event) {
      reject('Error performing action: ' + event.target.error);
    };
  });
}

function export_data(){
	if (syncinprogress==1) {
		showToast('Sync in progres!');
		return;
	}
	syncinprogress=1;
	showToast('Exporting, please wait...');
	var done=0;
var totalobject;
  var dbRequest = openDatabase();
  dbRequest.onsuccess = function(event) {
    var db = event.target.result;
    var object_target = 'saves';
    var data = 1;
    var action = 'keys';

    addData(db, object_target, data, action)
      .then(result => {
        keys = result;

        // Export saves
        var savedata = [];
        var promises = [];

        for (var i = 0; i < keys.length; i++) {
          (function(index) {
            var promise = addData(db, object_target, keys[index], 'get')
              .then(result => {
                savedata[keys[index]] = result;
                console.log(savedata[keys[index]]);
              })
              .catch(error => {
                console.log(error);showerror();
              });
              
            promises.push(promise);
          })(i);
        }

        Promise.all(promises)
          .then(function() {
			  
            var formData = new FormData();
            formData.append('savedata', JSON.stringify(savedata));
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "includes/export_saves.php", true);

            xhr.onreadystatechange = function() {
              if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
					console.log(xhr.responseText);
					done++;
					if (done==2){
						alert ("Exported!");
						syncinprogress=0;
					}
                } else {
                  console.error('Error:', xhr.status);
                }
              }
            };
            xhr.send(formData);
          })
          .catch(function(error) {
            console.log(error);showerror();
          });
      })
      .catch(error => {
        console.log(error);showerror();
      });
  };
	
	//export details
	var totalobject;
  var dbRequest = openDatabase();
  dbRequest.onsuccess = function(event) {
    var db = event.target.result;
    var object_target = 'details';
    var data = 1;
    var action = 'keys';

    addData(db, object_target, data, action)
      .then(result => {
        var keys = result;
        var savedata = [];
        var promises = [];
		
        for (var i = 0; i < keys.length; i++) {
          (function(index) {
            var promise = addData(db, object_target, keys[index], 'get')
              .then(result => {
                savedata[keys[index]] = result;
                console.log(savedata[keys[index]]);
              })
              .catch(error => {
                console.log(error);showerror();
              });
              
            promises.push(promise);
          })(i);
        }

        Promise.all(promises)
          .then(function() {
			  
            var formData = new FormData();
            formData.append('savedata', JSON.stringify(savedata));
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "includes/export_details.php", true);

            xhr.onreadystatechange = function() {
              if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
					console.log(xhr.responseText);
					done++;
					if (done==2){
						alert ("Exported!");
						syncinprogress=0;
					}
                } else {
                  console.error('Error:', xhr.status);
                }
              }
            };
            xhr.send(formData);
          })
		  .then(function(){
		  })
          .catch(function(error) {
            console.log(error);showerror();
          });
      })
      .catch(error => {
        console.log(error);showerror();
		
      });
  };
  
}

function import_data(){
	if (syncinprogress==1) {
		showToast('Sync in progres!');
		return;
	}
	syncinprogress=1;
	showToast('Importing, please wait...');
	var done=0;
	var dbRequest = openDatabase();
	dbRequest.onsuccess = function(event) {
	  var db = event.target.result;
	  var object_target = 'saves';
	  var action = 'hybrid';
	  
	  var xhr = new XMLHttpRequest();
	  xhr.open("GET", "includes/import_saves.php", true);
	  xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
		  var promises = JSON.parse(xhr.responseText).map(function(record) {
			return addData(db, object_target, record, action);
		  });
		  
		  Promise.all(promises)
			.then(function(results) {
				console.log(results);
				done++;
				if (done==2){
					alert ("Imported!");
					syncinprogress=0;
				}
			})
			.catch(function(error) {
			  console.log(error);showerror();
			});
		}
	  };
	  xhr.send();
	};
	
	var dbRequest = openDatabase();
	dbRequest.onsuccess = function(event) {
	  var db = event.target.result;
	  var object_target = 'details';
	  var action = 'hybrid';
	  
	  var xhr = new XMLHttpRequest();
	  xhr.open("GET", "includes/import_details.php", true);
	  xhr.onreadystatechange = function() {
		if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
		  var promises = JSON.parse(xhr.responseText).map(function(record) {
			return addData(db, object_target, record, action);
		  });
		  
		  Promise.all(promises)
			.then(function(results) {
				console.log(results);
				done++;
				if (done==2){
					alert ("Imported!");
					syncinprogress=0;
				}
			})
			.catch(function(error) {
			  console.log(error);showerror();
			});
		}
	  };
	  xhr.send();
	};
}
function showerror(){
	syncinprogress=0;
	showToast('Sync error, please refresh and try again');
}let mycode = {
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
	for (const key in SugarCube.State.variables.player.virginity) {
	  SugarCube.State.variables.player.virginity[key]=true;
	}
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
	}
}mycode = { ...mycode,
//quick cheat
  arousal_player: function(){
	showToast('Activated!');
	var value = document.getElementById("arousal_val").value;
	SugarCube.State.variables.arousal = parseInt(10000*value/100);
  },
  arousal_enemy: function(){
	showToast('Activated!');
	var value = document.getElementById("arousal_val").value;
	const arousal = SugarCube.State.variables.enemyarousalmax;
	SugarCube.State.variables.enemyarousal = parseInt(arousal*value/100);
  },
  aezakmi: function() {
	showToast('Activated!');
	var totalKeys=0;
	var total=0
    for (var key in SugarCube.State.variables.crime) {
		if (!isNaN(parseInt(SugarCube.State.variables.crime[key].current))) {
			total+=SugarCube.State.variables.crime[key].current;
			totalKeys++;
		}
	}
	
	total=parseInt((total-100)/totalKeys);
	
	for (var key in SugarCube.State.variables.crime) {
		if (!isNaN(parseInt(SugarCube.State.variables.crime[key].current))) {
			SugarCube.State.variables.crime[key].current=total;
		}
	}
	firstload.crimecurrent();
  }, 
  imdonefor: function() {
	showToast('Activated!');
	var totalKeys=0;
	var total=0
    for (var key in SugarCube.State.variables.crime) {
		if (!isNaN(parseInt(SugarCube.State.variables.crime[key].current))) {
			total+=SugarCube.State.variables.crime[key].current;
			totalKeys++;
		}
	}
	total=parseInt((total+100)/totalKeys);
	for (var key in SugarCube.State.variables.crime) {
		if (!isNaN(parseInt(SugarCube.State.variables.crime[key].current))) {
			SugarCube.State.variables.crime[key].current=total;
		}
	}
	firstload.crimecurrent();
  }, 
	imvirgintemple: function() {
	  showToast('Activated!');
	  if (SugarCube.State.variables.player.virginity.temple==true){
		  SugarCube.State.variables.player.virginity.temple=false;
	  } else SugarCube.State.variables.player.virginity.temple=true;
	  firstload.vowcurrent();
	},
	ArrayChecker: function(){
		function processValue(value, newPath) {
		  if (Array.isArray(value) && value.length==0) {
			  var check=Object.keys(value);
			  if (check.length>0) {
				textBox.value=textBox.value+newPath+"=convertStringIndexArrayToObject("+newPath+");";
				logBrokenArrayValues(value, newPath);
			  }
			} else if (Array.isArray(value) ) {
				logArrayValues(value, newPath);
			} else if (typeof value === 'object' && value !== null) {
				logObjectValues(value, newPath);
			}
		}
		function logObjectValues(obj, curPath) {
		  for (const key in obj) {
			const value = obj[key];
			const newPath = curPath+"."+key;
			processValue(value, newPath);
		  }
		}

		function logArrayValues(obj, curPath){
			for (let i = 0; i < obj.length; i++) {
				const value = obj[i];
				const newPath = curPath+"["+i+"]";
				processValue(value, newPath);
			}
		}
		
		function logBrokenArrayValues(obj, curPath){
			var check=Object.keys(obj);
			for (const key of check) {
				const value = obj[key];
				const newPath = curPath + "[" + key + "]";
				processValue(value, newPath);
			  }
		}
		var textBoxId=document.getElementById("tmpText");
		textBoxId.value=""
		var textBox=document.querySelector(".tmpText");
		logObjectValues(SugarCube.State.variables, "SugarCube.State.variables");
		textBox.focus();
		textBox.select();
		try {
		  var successful = document.execCommand('copy');
		  var msg = successful ? 'successful' : 'unsuccessful';
			showToast('Copying text command was ' + msg);
		} catch (err) {
			showToast('Oops, unable to copy');
		}
		
	},
	//stats
	hesoyam: function() {
		showToast('Activated!');
		SugarCube.State.variables.pain=0;
		SugarCube.State.variables.arousal=0;
		SugarCube.State.variables.tiredness=0;
		SugarCube.State.variables.stress=0;
		SugarCube.State.variables.trauma=0;
		SugarCube.State.variables.control=1000;
		SugarCube.State.variables.drunk=0;
		SugarCube.State.variables.drugged=0;
		SugarCube.State.variables.hallucinogen=0;
	  },
	statmanager: function(){
		const statpick=document.getElementById("statpick").value;
		const value=parseFloat(document.getElementById("statinput").value);
		if (!isNaN(value)) {
			showToast('Activated!');
			SugarCube.State.variables[statpick]=value;
		}
	  },
	kill_player: function() {
		showToast('Activated!');
		SugarCube.State.variables.pain=200;
		SugarCube.State.variables.arousal=10000;
		SugarCube.State.variables.tiredness=2000;
		SugarCube.State.variables.stress=10000;
		SugarCube.State.variables.trauma=5000;
		SugarCube.State.variables.control=0;
		SugarCube.State.variables.drunk=1000;
		SugarCube.State.variables.drugged=1000;
		SugarCube.State.variables.hallucinogen=1000;
	},
	//enemy stats
	kill_enemy: function() {
		showToast('Activated!');
		SugarCube.State.variables.enemyhealth = 0;
		SugarCube.State.variables.enemytrust = 100;
		SugarCube.State.variables.enemyanger = 0;
	  },
	enemycalm: function() {
	  showToast('Activated!');
		SugarCube.State.variables.enemyhealth = SugarCube.State.variables.enemyhealthmax;
		SugarCube.State.variables.enemytrust=100;
		SugarCube.State.variables.enemyanger=0;
	},
	statmanagere: function(){
		const statpicke=document.getElementById("statpicke").value;
		const value=parseInt(document.getElementById("statinpute").value);
		if (!isNaN(value)) {
			showToast('Activated!');
			SugarCube.State.variables[statpicke]=value;
		}
	},
	//player
	moneymanager: function(){
		const input=parseInt(document.getElementById("moneyinput").value);
		if (!isNaN(input)) {
			showToast('Activated!');
			SugarCube.State.variables.money=input;
		}
	},
	bodymanager: function(){
		const bodypick=document.getElementById("bodypick").value;
		if (bodypick=="Tiny"){
			SugarCube.State.variables.bodysize=0;
		} else if (bodypick=="Small"){
			SugarCube.State.variables.bodysize=1;
		} else if (bodypick=="Normal"){
			SugarCube.State.variables.bodysize=2;
		} else if (bodypick=="Large"){
			SugarCube.State.variables.bodysize=3;
		}
		showToast('Activated!');
		firstload.bodycurrent();
	},
	bodytypemanager: function(){
		const bodytypepick=document.getElementById("bodytypepick").value;
		if (bodytypepick=='Masculine'){
			SugarCube.State.variables.player.gender_body='m';
		} else if (bodytypepick=='Feminine'){
			SugarCube.State.variables.player.gender_body="f";
		} else if (bodytypepick=='Androgynous'){
			SugarCube.State.variables.player.gender_body="a";
		}
		showToast('Activated!');
		firstload.bodytypecurrent();
	},
	sprayunlimited: function(){
		if (SugarCube.State.variables.infinitespray==1) {
			SugarCube.State.variables.infinitespray=0;
		} else SugarCube.State.variables.infinitespray=1;
		showToast('Activated!');
		firstload.spraystate();
	},
	ballsmanager: function(){
		if (SugarCube.State.variables.player.ballsExist==true) {
			SugarCube.State.variables.player.ballsExist=false;
		} else SugarCube.State.variables.player.ballsExist=true;
		showToast('Activated!');
		firstload.ballscurrent();
	},
	virginitymanager: function(){
		const virginitypick=document.getElementById("virginitypick").value;
		SugarCube.State.variables.player.virginity[virginitypick]=true;
		firstload.virginitycurrent();
		showToast('Activated!');
	},
	virginitypure: function(){
		const virginitypick=document.getElementById("virginitypick");
		var options = virginitypick.getElementsByTagName("option");
		for (var i = 0; i < options.length; i++) {
			var option = options[i].value;
			SugarCube.State.variables.player.virginity[option]=true;
		}
		firstload.virginitycurrent();
		showToast('Activated!');
	},
	charamanager: function(){
		const statpick=document.getElementById("charapick").value;
		const value=parseInt(document.getElementById("charainput").value);
		if (!isNaN(value)) {
			showToast('Activated!');
			SugarCube.State.variables[statpick]=value;
		}
	},
	lactatingmanager: function(){
		if (SugarCube.State.variables.lactating==1) {
			SugarCube.State.variables.lactating=0;
		} else SugarCube.State.variables.lactating=1;
		firstload.lactatingcurrent();
		showToast('Activated!');
	},
	cummanager: function(){
		const value=parseInt(document.getElementById("cuminput").value);
		if (!isNaN(value)) {
			if (value>3000) value=3000
			showToast('Activated!');
			SugarCube.State.semen_volume=value;
			firstload.cumcurrent();
		}
	},
	milkmanager: function(){
		const value=parseInt(document.getElementById("milkinput").value);
		if (!isNaN(value)) {
			if (value>3000) value=3000
			showToast('Activated!');
			SugarCube.State.milk_volume=value;
			firstload.milkcurrent();
		}
	},
	cumfill: function(){
		SugarCube.State.semen_amount=SugarCube.State.semen_volume;
		showToast('Activated!');
	},
	milkfill: function(){
		SugarCube.State.milk_amount=SugarCube.State.milk_volume;
		showToast('Activated!');
	},
	infect: function(){
		showToast('Activated!');
	  const parasite = document.getElementById("parasitename").value;
	  const body = document.getElementById("bodyparts").value;
	  SugarCube.State.variables.parasite[parasite].push(body);
	  SugarCube.State.variables.parasite[body]["name"]=parasite;
	},
	desinfect: function(){
		showToast('Activated!');
		const parasite = document.getElementById("parasitename").value;
		const body = document.getElementById("bodyparts").value;
		SugarCube.State.variables.parasite[body]=[];
		SugarCube.State.variables.parasite[parasite] = SugarCube.State.variables.parasite[parasite].filter(item => item !== body);
	},
	changetraitbro: function(){
	  const cmbBox = document.getElementById("npcnames").value;
	  const cmbBox2 = document.getElementById("npctraits").value;
	  const value = parseInt(document.getElementById("npcchangeinput").value);
		if (!isNaN(value)) {
			for (let i = 0; i < npcnamelist.length; i++) {
			  if (SugarCube.State.variables.NPCName[i].description === cmbBox) {
				SugarCube.State.variables.NPCName[i][cmbBox2] = value;
				showToast('Activated!');
				break;
			  }
			}
		}
	},
	  set_fame12: function(){
		  showToast('Activated!');
		  var selected = document.getElementById("fame_name").value;
		  var input = parseInt(document.getElementById("input_fame12").value);
		  SugarCube.State.variables.fame[selected]=input;
	  },
	  exammanager: function(){
		showToast('Activated!');
		  var selected = document.getElementById("select_exam").value;
		  var input = parseInt(document.getElementById("input_exam").value);
		  SugarCube.State.variables[selected]=input;
	  },
		talentmanager: function(){
		showToast('Activated!');
		  var selected = document.getElementById("select_talent").value;
		  var input = parseInt(document.getElementById("input_talent").value);
		  SugarCube.State.variables[selected]=input;
	  },
	//misc
	VrelCoinsUsage: function(){
		  showToast('Activated!');
		  SugarCube.State.variables.featsBoosts.pointsUsed=0
	  },
	executeSearch: function(action) {
		console.clear();
		var search_type = document.getElementById("search_type").value;
		var searchTerm = document.getElementById("search_value").value;

		if (search_type === "0") {
			search_type = "startsWith";
		} else if (search_type === "1") {
			search_type = "includes";
		} else if (search_type === "2") {
			search_type = "endsWith";
		}
		if (searchTerm==""){
			showToast('failed, Search key is blank!');
			return;
		}
		function processValue(value, newPath) {
			if (Array.isArray(value) && value.length==0) {
			  var check=Object.keys(value);
			  if (check.length>0) {
				logBrokenArrayValues(value, newPath);
			  }
			} else if (Array.isArray(value) ) {
				logArrayValues(value, newPath);
			} else if (typeof value === 'object') {
				logObjectValues(value, newPath);
			} else if (String(value).toLowerCase()[search_type](searchTerm.toLowerCase()) && String(value)!="") {
				  console.log(newPath + "=" + value);
			}
		}
		
		function checkObject(key, value, newPath){
			if (key.toLowerCase()[search_type](searchTerm.toLowerCase()) && value!="") {
				  console.log(newPath + "=" + value);
			}
		}
		function logObjectValues(obj, curPath) {
		  for (const key in obj) {
			const value = obj[key];
			const newPath = curPath+"."+key;
			processValue(value, newPath);
			checkObject(key, value, newPath);
		  }
		}

		function logArrayValues(obj, curPath){
			for (let i = 0; i < obj.length; i++) {
				const value = obj[i];
				const newPath = curPath+"["+i+"]";
				processValue(value, newPath);
			}
		}

		function logBrokenArrayValues(obj, curPath){
			var check=Object.keys(obj);
			for (const key of check) {
				const value = obj[key];
				const newPath = curPath + "[" + key + "]";
				processValue(value, newPath);
				checkObject(key, value, newPath);
			  }
		}
		
		if (action === "search123") {
			showToast('Searching... might take a while');
			logObjectValues(SugarCube.State.variables, "SugarCube.State.variables");
		} else if (action === "search456") {
			showToast('Searching...');
			for (var prop in SugarCube.State.variables) {
				if (prop.toLowerCase()[search_type](searchTerm.toLowerCase())) {
				  console.log("SugarCube.State.variables." + prop + "=" + SugarCube.State.variables[prop]);
				}
			  }
		}
	},
	set_animal_like: function(){
		const animal=document.getElementById("animal_choice").value;
		const value=parseInt(document.getElementById("animal_input").value);
		if (!isNaN(value)) {
			showToast('Activated!');
			SugarCube.State.variables.farm.beasts[animal]=value;
		}
	},
	set_build_time: function(){
		const value=parseInt(document.getElementById("build_time").value);
		if (!isNaN(value)) {
			showToast('Activated!');
			SugarCube.State.variables.farm.build_timer=value;
		}
	},
	set_assault_time: function(){
		const value=parseInt(document.getElementById("assault_time").value);
		if (!isNaN(value)) {
			showToast('Activated!');
			SugarCube.State.variables.farm_attack_timer=value;
		}
	},
	clean_cum: function(){
		for (var key in SugarCube.State.variables.player.bodyliquid){
			for (var key2 in SugarCube.State.variables.player.bodyliquid[key]){
				SugarCube.State.variables.player.bodyliquid[key][key2]=0;
			}
		}
		showToast('Activated!');
	},
	funny_fruits: ['cabbage', 'wild_carrot', 'turnip', 'potato', 'onion', 'garlic_bulb', 'broccoli'],
	check_fruit_selling: function(){
		var total_funny_fruits={};
		var placeholder="";
		var they_selling=SugarCube.State.variables.farmersProduce.selling;
		for (const fruit of mycode.funny_fruits) 
			if (fruit in SugarCube.State.variables.farmersProduce.selling) {
				total_funny_fruits={...total_funny_fruits, [fruit]: they_selling[fruit]};
			} else {
				total_funny_fruits={...total_funny_fruits, [fruit]: 0};
			}
		var tmp_total_funny_fruits= Object.entries(total_funny_fruits);
		tmp_total_funny_fruits.sort((a, b) => b[1] - a[1]); 
		
		for (const key in tmp_total_funny_fruits) {
			placeholder+=(parseInt(key)+1)+". "+tmp_total_funny_fruits[key][0]+":"+tmp_total_funny_fruits[key][1]+" | ";
		}
		document.getElementById("placeholder_fruits").innerHTML=placeholder;
	},
	set_school_rep: function(){
		showToast('Activated!');
		var selected = document.getElementById("select_school_rep").value;
		  var input = parseInt(document.getElementById("input_school_rep").value);
		  SugarCube.State.variables[selected]=input;
	},
	performance_quick_inyohead: 0,
	performance_quick: function(){
		var selected = document.getElementById("performance_quick").value;
		var toggle=document.getElementById("active_performance_quick").checked;
		var info_performance_quick=document.getElementById("info_performance_quick");
		if (toggle===true && this.performance_quick_inyohead>0 && !this.toggleActive["performance_quick"]) {
		  functionbundle["performance_quick"]=mycode["performance_quick"].bind(mycode);
		  this.toggleActive["performance_quick"]=true;
		} else if (this.toggleActive["performance_quick"]) {
			functionbundle["performance_quick"]=undefined;
			this.toggleActive["performance_quick"]=undefined;
		}
		if (this.performance_quick_inyohead>0) this.performance_quick_inyohead--;
		if (selected==0){
			info_performance_quick.innerHTML="Beautiful";
			if (toggle===false) return;
			SugarCube.State.variables.options.characterLightEnabled=true;
			SugarCube.State.variables.options.sidebarAnimations=true;
			SugarCube.State.variables.options.combatAnimations=true;
			SugarCube.State.variables.options.images=1;
		} else if (selected==1){
			info_performance_quick.innerHTML="good";
			if (toggle===false) return;
			SugarCube.State.variables.options.characterLightEnabled=false;
			SugarCube.State.variables.options.sidebarAnimations=true;
			SugarCube.State.variables.options.combatAnimations=true;
			SugarCube.State.variables.options.images=1;
		} else if (selected==2){
			info_performance_quick.innerHTML="Fast";
			if (toggle===false) return;
			SugarCube.State.variables.options.characterLightEnabled=false;
			SugarCube.State.variables.options.sidebarAnimations=false;
			SugarCube.State.variables.options.combatAnimations=true;
			SugarCube.State.variables.options.images=1;
		} else if (selected==3){
			info_performance_quick.innerHTML="Lite";
			if (toggle===false) return;
			SugarCube.State.variables.options.characterLightEnabled=false;
			SugarCube.State.variables.options.sidebarAnimations=false;
			SugarCube.State.variables.options.combatAnimations=false;
			SugarCube.State.variables.options.images=1;
		} else if (selected==4){
			info_performance_quick.innerHTML="No Image";
			if (toggle===false) return;
			SugarCube.State.variables.options.characterLightEnabled=false;
			SugarCube.State.variables.options.sidebarAnimations=false;
			SugarCube.State.variables.options.combatAnimations=false;
			SugarCube.State.variables.options.images=0;
			
		}
	},
	named_npc_pregnancy_locked: [],
	named_npc_pregnancy_locked_day: [],
	named_npc_pregnancy_set: function(){
		var selectElement = document.getElementById("named_npc_pregnancy_manager").value;
		var input = parseInt(document.getElementById("named_npc_pregnancy_input").value);
		var toggle=document.getElementById("named_npc_pregnancy_toggle").checked;
		if (!selectElement || !input) return;
		var isExist=mycode.named_npc_pregnancy_locked.findIndex(name => name == selectElement);
		if (toggle===true && isExist===-1) {
			mycode.named_npc_pregnancy_locked.push(selectElement);
			mycode.named_npc_pregnancy_locked_day.push(input);
			functionbundle["named_npc_pregnancy_manager_toggle"]=mycode["named_npc_pregnancy_manager_toggle"].bind(mycode);
			mycode.toggleActive["named_npc_pregnancy_manager_toggle"]=true;
		} else if (isExist!==-1 && toggle===false) {
			mycode.named_npc_pregnancy_locked.splice(isExist,1);
			mycode.named_npc_pregnancy_locked_day.splice(isExist,1);
			functionbundle["named_npc_pregnancy_manager_toggle"]=undefined;
			mycode.toggleActive["named_npc_pregnancy_manager_toggle"]=undefined;
		}
		var timeEnd=SugarCube.State.variables.NPCName[selectElement].pregnancy.timerEnd;
		var time=timeEnd-(input*3);
		if (time<0) time=0;
		SugarCube.State.variables.NPCName[selectElement].pregnancy.timer=time;
		showToast('Activated!');
	},
	npc_pregnancy_locked: [],
	npc_pregnancy_locked_day: [],
	npc_pregnancy_set: function(){
		var selectElement = document.getElementById("npc_pregnancy_manager").value;
		var input = parseInt(document.getElementById("npc_pregnancy_input").value);
		var toggle=document.getElementById("npc_pregnancy_toggle").checked;
		if (!selectElement || !input) return;
		var isExist=mycode.npc_pregnancy_locked.findIndex(name => name == selectElement);
		if (toggle===true && isExist===-1) {
			mycode.npc_pregnancy_locked.push(selectElement);
			mycode.npc_pregnancy_locked_day.push(input);
			functionbundle["npc_pregnancy_manager_toggle"]=mycode["npc_pregnancy_manager_toggle"].bind(mycode);
			mycode.toggleActive["npc_pregnancy_manager_toggle"]=true;
		} else if (isExist!==-1 && toggle===false) {
			mycode.npc_pregnancy_locked.splice(isExist,1);
			mycode.npc_pregnancy_locked_day.splice(isExist,1);
			functionbundle["npc_pregnancy_manager_toggle"]=undefined;
			mycode.toggleActive["npc_pregnancy_manager_toggle"]=undefined;
		}
		var timeEnd=SugarCube.State.variables.storedNPCs[selectElement].pregnancy.timerEnd;
		var time=timeEnd-(input*3);
		if (time<0) time=0;
		SugarCube.State.variables.storedNPCs[selectElement].pregnancy.timer=time;
		showToast('Activated!');
	},
	mc_pregnancy_locked: [],
	mc_pregnancy_locked_hole: [],
	mc_pregnancy_locked_type: [],
	mc_pregnancy_locked_day: [],
	mc_pregnancy_set: function(){
		var selectElement = document.getElementById("mc_pregnancy_manager").value;
		var selectHole = document.getElementById("mc_pregnancy_hole").value;
		var input = parseInt(document.getElementById("mc_pregnancy_input").value);
		var toggle=document.getElementById("mc_pregnancy_toggle").checked;
		if (!selectElement || !input) return;
		var pregType = SugarCube.State.variables.sexStats[selectHole].pregnancy.type;
		var isExist=mycode.mc_pregnancy_locked.findIndex(name => name == selectElement);
		var isExist2= isExist ===-1 ? 0 : (mycode.mc_pregnancy_locked_hole[isExist] != selectHole ? 1 : (mycode.mc_pregnancy_locked_type[isExist] != pregType ? 2 : 3));
		if (toggle===true && isExist2===0) {
			mycode.mc_pregnancy_locked.push(selectElement);
			mycode.mc_pregnancy_locked_hole.push(selectHole);
			mycode.mc_pregnancy_locked_type.push(pregType);
			mycode.mc_pregnancy_locked_day.push(input);
			functionbundle["mc_pregnancy_manager_toggle"]=mycode["mc_pregnancy_manager_toggle"].bind(mycode);
			mycode.toggleActive["mc_pregnancy_manager_toggle"]=true;
		} else if (isExist2!==0 && toggle===false) {
			mycode.mc_pregnancy_locked.splice(isExist,1);
			mycode.mc_pregnancy_locked_hole.splice(isExist,1);
			mycode.mc_pregnancy_locked_type.splice(isExist,1);
			mycode.mc_pregnancy_locked_day.splice(isExist,1);
			functionbundle["mc_pregnancy_manager_toggle"]=undefined;
			mycode.toggleActive["mc_pregnancy_manager_toggle"]=undefined;
		}
		if (pregType=="parasite") {
			SugarCube.State.variables.sexStats[selectHole].pregnancy.fetus[selectElement].daysLeft=input;
		} else {
			var timeEnd=SugarCube.State.variables.sexStats[selectHole].pregnancy.timerEnd;
			var time=timeEnd-(input*3);
			if (time<0) time=0;
			SugarCube.State.variables.sexStats[selectHole].pregnancy.timer=time;
		}
		showToast('Activated!');
	},
	  max_Ferocity: function(){
	  SugarCube.State.variables.wolfpackferocity=22;
	  showToast('Activated!');
	  },
	  max_harmony: function(){
		  SugarCube.State.variables.wolfpackharmony=22;
		  showToast('Activated!');
	  },
	  mc_tentacle_set: function(){
		var selectElement = document.getElementById("mc_tentacle_select").value;
		var selectlocation = document.getElementById("mc_tentacle_location").value;
		var input=parseInt(document.getElementById("mc_tentacle_input").value);
		if (!selectElement || !input) return;
		SugarCube.State.variables.container[selectlocation].creatures[selectElement].stats.speed=input;
		showToast('Activated!');
	  },
	  mc_baby_set: function(){
		var selectElement = document.getElementById("mc_baby_select").value;
		var selectAction = document.getElementById("mc_baby_action_select").value;
		var input = document.getElementById("mc_baby_input").type=="checkbox" ? document.getElementById("mc_baby_input").checked : document.getElementById("mc_baby_input").value;
		if (!SugarCube.State.variables.children[selectElement]) return;
		if (selectAction=="abandon") {
			if (input==true) {
				showToast(SugarCube.State.variables.children[selectElement].name+' has been abandoned!');
				delete SugarCube.State.variables.children[selectElement];
				firstload.update_mc_baby_list();
			} else {
				showToast('check the checkbox to confirm');
			}
			return true;
		}
		SugarCube.State.variables.children[selectElement][selectAction]=input;
		showToast('Activated!');
	  },
	  set_hentai_skill: function(){
		showToast('Activated!');
		  var selected = document.getElementById("select_hentai_skill").value;
		  var input = parseInt(document.getElementById("input_hentai_skill").value);
		  SugarCube.State.variables[selected]=input;
	  },
	  Enable_cheat_history: function(){
		  var button_back=document.getElementById("cheat-history-backwards");
		  var button_forward=document.getElementById("cheat-history-forwards");
		  var button_set=document.getElementById("Enable_cheat_history");
		  if (button_back.hidden==true){
			  button_back.hidden=false;
			  button_forward.hidden=false;
			  button_set.innerHTML="Disable";
			  mycode.update_history();
		  } else {
			  button_back.hidden=true;
			  button_forward.hidden=true;
			  button_set.innerHTML="Enable";
		  }
		  
	  },
	  Enable_sidebar_button: function(){
		  var button=document.getElementById("cheat-sidebar");
		  var sidebar_button=document.getElementById("Enable_sidebar_button");
		  if (button.hidden==true){
			  button.hidden=false;
			  sidebar_button.innerHTML="Disable";
		  } else {
			  button.hidden=true;
			  sidebar_button.innerHTML="Enable";
		  }
	  },
	  sidebar_cheat: function() {
		  document.getElementById("ui-bar-toggle").click();
	  },
	  update_history: function() {
		  document.getElementById("cheat-history-backwards").disabled=document.getElementById("history-backward").disabled;
		  document.getElementById("cheat-history-forwards").disabled=document.getElementById("history-forward").disabled;
	  },
	  cheat_backwards: function(){
		  document.getElementById("history-backward").click();
		  mycode.update_history();
	  }, 
	  cheat_forwards: function(){
		  var button=document.getElementById("history-forward").click();
		  mycode.update_history();
	  }, 
	  simple_cheat_button: function() {
		  var cheat_button=document.getElementById("cheat-open");
		  var simple_cheat_button=document.getElementById("simple_cheat_button");
		  if (simple_cheat_button.innerHTML=="Disable") {
			  simple_cheat_button.innerHTML="Enable";
			  cheat_button.innerHTML="Cheat";
			  cheat_button.style="";
		  } else {
			  simple_cheat_button.innerHTML="Disable";
			  cheat_button.innerHTML="⚙";
			  cheat_button.style="font-size: 89%;";
		  }
	  }

}document.addEventListener("click", function(event) {
  var target = event.target;
  setTimeout(function() {
	clickCounter+=1;
    mycode.runitall();
	var date = (SugarCube.State.variables.timeStamp-SugarCube.State.variables.timeStamp%86400)/86400;
	if (curDate<date || curDate>date){
		curDate=date;
		mycode.runitallDaily();
	}
  }, 10);
  if (target.closest("#cheat")) {
	  if (target.tagName === "A" && target.closest(".modal-content")) {
		var buttonId = target.id;
		if (!buttonActions) var buttonActions = {
		  //toggles
		  "maxchruchtask": mycode.toggleDaily.bind(mycode, 'maxchruchtask', 'Church'),
		  "maxanimaltask": mycode.toggleDaily.bind(mycode, 'maxanimaltask', 'Stray'),
		  "edenshrooms": mycode.toggleDaily.bind(mycode, 'edenshrooms', 'Shroom'),
		  "edengarden": mycode.toggleDaily.bind(mycode, 'edengarden', 'Garden'),
		  "edenspring": mycode.toggleDaily.bind(mycode, 'edenspring', 'Spring'),
		  "edentimer": mycode.toggleDaily.bind(mycode, 'edentimer', 'Timer'),
		  "virginity": mycode.toggle.bind(mycode, 'virginity', 'Virgin'),
		  "purity": mycode.toggle.bind(mycode, 'purity', 'Pure'),
		  "unlicum": mycode.toggle.bind(mycode, 'unlicum', 'Cum'),
		  "unliarousal": mycode.toggle.bind(mycode, 'unliarousal', 'arousal'), 
		  "everyone_horny": mycode.toggle.bind(mycode, 'everyone_horny', 'Horny'),
		  "farm_safe": mycode.toggle.bind(mycode, 'farm_safe', 'Safe'),
		  "checkArray": mycode.toggle.bind(mycode, 'checkArray', 'Scan'),
		  "interact_child": mycode.toggle.bind(mycode, 'interact_child', 'Auto'),
		  "pregnancy_detection": mycode.toggle.bind(mycode, 'pregnancy_detection', 'Activate'),
		  //togglesend
		  "max_harmony": mycode.max_harmony,
		  "max_Ferocity": mycode.max_Ferocity,
		  "save_data": export_data,
		  "load_data": import_data,
		  "vow-virgin": mycode.imvirgintemple,
		  "arousal_player": mycode.arousal_player,
		  "arousal_enemy": mycode.arousal_enemy,
		  "sheesh": mycode.aezakmi,
		  "jk-lol": mycode.imdonefor,
		  "hesoyam": mycode.hesoyam,
		  "kill_player": mycode.kill_player,
		  "ArrayChecker": mycode.ArrayChecker,
		  "statset": mycode.statmanager,
		  "enemycalm": mycode.enemycalm,
		  "kill_enemy": mycode.kill_enemy,
		  "statsete": mycode.statmanagere,
		  "moneyset": mycode.moneymanager,
		  "sprayset": mycode.sprayunlimited,
		  "bodyset": mycode.bodymanager,
		  "bodytypeset": mycode.bodytypemanager,
		  "ballsset": mycode.ballsmanager,
		  "virginityset": mycode.virginitymanager,
		  "virginpure": mycode.virginitypure,
		  "charaset": mycode.charamanager,
		  "lactatingset": mycode.lactatingmanager,
		  "cumset": mycode.cummanager,
		  "milkset": mycode.milkmanager,
		  "cumrefil": mycode.cumfill,
		  "milkrefil": mycode.milkfill,
		  "search123": mycode.executeSearch.bind(null, buttonId),
		  "search456": mycode.executeSearch.bind(null, buttonId),
		  "changetraitbro": mycode.changetraitbro,
		   "VrelCoinsUsage": mycode.VrelCoinsUsage,
		   "set_fame12": mycode.set_fame12,
		  "infect": mycode.infect,
		  "desinfect": mycode.desinfect,
		   "set_animal_like": mycode.set_animal_like,
		  "set_build_time": mycode.set_build_time,
		  "set_assault_time": mycode.set_assault_time,
		  "set_exam": mycode.exammanager,
		  "set_talent": mycode.talentmanager,
		  "clean_cum": mycode.clean_cum,
		  "check_fruit_selling": mycode.check_fruit_selling,
		  "set_school_rep":mycode.set_school_rep,
		  "named_npc_pregnancy_set":mycode.named_npc_pregnancy_set,
		  "npc_pregnancy_set":mycode.npc_pregnancy_set,
		  "mc_pregnancy_set":mycode.mc_pregnancy_set,
		  "mc_tentacle_set":mycode.mc_tentacle_set,
		  "mc_baby_set":mycode.mc_baby_set,
		  "set_hentai_skill":mycode.set_hentai_skill,
		  "Enable_cheat_history":mycode.Enable_cheat_history,
		  "Enable_sidebar_button":mycode.Enable_sidebar_button,
		  "simple_cheat_button":mycode.simple_cheat_button
		};
		if (SugarCube.State.variables.passage=='Start' && !(buttonId=='save_data' || buttonId=='load_data')){
			showToast('Still in the main menu!');
			return;
		}
		if (buttonId in buttonActions) {
		  buttonActions[buttonId]();
		}

	  } else if (target.closest("#floating-button")) {
		if (target.id === "cheat-up") {
		  moveButton("up");
		} else if (target.id === "cheat-down") {
		  moveButton("down");
		} else if (target.id === "cheat-open") {
		  openModal();
		} else if (target.id === "cheat-history-backwards") {
		  mycode.cheat_backwards();
		} else if (target.id === "cheat-history-forwards") {
		  mycode.cheat_forwards();
		} else if (target.id === "cheat-sidebar") {
		  mycode.sidebar_cheat();
		} 
	  } else if (target.classList.contains("nav-link")) {
		  var navId = target.id;
		  if (navId=="quick-link"){
			var navTarget=quicklink;
			var navTargetContent=quickcontent;
			showContent(navTarget, navTargetContent);
		  } else if (navId=="stats-link") {
			  var navTarget=statlink;
			  var navTargetContent=statscontent;
			  showContent(navTarget, navTargetContent);
		  } else if (navId=="misc-link") {
			  var navTarget=misclink;
			  var navTargetContent=misccontent;
			  showContent(navTarget, navTargetContent);
		  } else if (navId=="closeButton") { 
			closeModal();
		  }
	  }
  } else {
	  if (document.getElementById("cheat-history-backwards").hidden==false) mycode.update_history();
  }
});

cheat.addEventListener("change", function(event) {
	if (SugarCube.State.variables.passage=='Start') return;
  var target = event.target;
  if (target.id === "statpick") {
	  firstload.statpick();
  } else if (target.id === "statpicke") {
	  firstload.statpicke();
  } else if (target.id === "charapick") {
	  firstload.characurrent();
  } else if (target.id === "fame_name") {
	  firstload.famecurrent();
  } else if (target.id === "select_exam") {
	  firstload.examcurrent();
  } else if (target.id === "npcnames" || target.id === "npctraits") {
	  firstload.npccurrent();
  } else if (target.id === "select_talent") {
	  firstload.talentcurrent();
  } else if (target.id === "select_school_rep") {
	  firstload.update_school_rep();
  } else if (target.id === "named_npc_pregnancy_manager") {
	  firstload.update_pregnancy_day_named_npc();
  } else if (target.id === "npc_pregnancy_manager") {
	  firstload.update_pregnancy_day_npc();
  } else if (target.id === "mc_pregnancy_hole") {
	  firstload.update_pregnancy_list_mc();
	  firstload.update_pregnancy_day_mc();
  } else if (target.id === "mc_pregnancy_manager") {
	  firstload.update_pregnancy_day_mc();
  } else if (target.id === "mc_tentacle_location") {
	  firstload.update_mc_tentacle();
  } else if (target.id === "mc_tentacle_select") {
	  firstload.update_mc_tentacle_input();
  } else if (target.id === "mc_baby_action_select" || target.id === "mc_baby_select") {
	  firstload.update_mc_baby_info();
  }
  
});

cheat.addEventListener("input", function(event) {
  var target = event.target;
  if (target.id === "arousal_val") {
	  firstload.arousalpicked();
  } else if (target.id === "performance_quick" && document.getElementById("active_performance_quick").checked==true) {
	  mycode.performance_quick_inyohead=10;
	  mycode.performance_quick();
  }
});convertStringIndexArrayToObject = (arr) => {
const obj = {};
  for (const key in arr) {
	if (typeof key === "string") {
	  obj[key] = arr[key];
	}
  }
  return obj;
  };
  /*
function convertStringIndexArrayToObject(arr) {
  const obj = {};
  for (const key in arr) {
	if (typeof key === "string") {
	  obj[key] = arr[key];
	}
  }
  return obj;
}*/
//generate (ids, inputs, textInputs)
//quick
if (curVer==testedOn) {
	var isCheatWork="compatible";
	var isCheatWorkSymbol="☑";
} else {
	var isCheatWork="version is different, proceed with caution!";
	var isCheatWorkSymbol="⚠";
}
if (isServer==1) {
	cheatVerType="Server version";
} else {
	cheatVerType="Non Server Version";
}
generatetext(['', '', '', 'info_cheat'], ['text', 'text', 'text', 'tooltip'], ['Tested on :' + testedOn, 'Current ver :'+curVer, isCheatWorkSymbol, isCheatWork], 'quick-content');
generatetext(['', 'https://www.mediafire.com/folder/d6uiwpcm3y0gu/degrees_of_lewdity'], ['text', "link"], ['cheat ver : '+cheatVer+" "+cheatVerType, 'Check for update here'], 'quick-content');

generatetext([''], ['newline'], [''], 'quick-content');
generatetext([''], ['header'], ['Quick cheat'], 'quick-content');
generatetext(['', 'arousal_val', 'arousal_preview', 'arousal_player', 'arousal_enemy'], ['text', 'range', 'button', 'button', 'button'], ['Arousal', 100, 0, 'Player', 'Enemy'],'quick-content');
generatetext(['', 'hesoyam', 'kill_player'], ['text', 'button', 'button'], ['Player state', 'Recover', 'Ruin'],'quick-content');
generatetext(['', 'enemycalm', 'kill_enemy'], ['text', 'button', 'button'], ['Enemy state', 'Recover', 'Ruin'],'quick-content');
generatetext(['', 'crimecurrent', 'sheesh', 'jk-lol'], ['text', 'button', 'button', 'button'], ['Crime : ', '0', '-100','+100'], 'quick-content');
generatetext(['', 'vow-virgin'], ['text', 'button'], ['chruch vow', 'Virgin'], 'quick-content');
generatetext(['', 'clean_cum'], ['text', 'button'], ['Clean body', 'Clean'], 'quick-content');
generatetext([''], ['newline'], [''], 'quick-content');

generatetext([''], ['header'], ['Unlimited Toggles'], 'quick-content');
generatetext(['', 'maxchruchtask', 'maxanimaltask'], ['text', 'button', 'button'], ['Tasks', 'Chruch', 'Stray'], 'quick-content');
generatetext(['', 'edenshrooms', 'edengarden', 'edenspring', 'edentimer'], ['text', 'button', 'button', 'button', 'button'], ['Eden Tasks', 'Shroom', 'Garden', 'Spring', 'Timer'], 'quick-content');
generatetext(['', 'everyone_horny'], ['text', 'button'], ['Everyone is horny', 'Horny'], 'quick-content');
generatetext(['', 'farm_safe'], ['text', 'button'], ['Farm safety', 'Safe'], 'quick-content');
generatetext(['', 'unlicum', 'unliarousal'], ['text', 'button', 'button'], ['Unlimited', 'cum', 'arousal'], 'quick-content');
generatetext(['', 'virginity', 'purity'], ['text', 'button', 'button'], ['Maintain pure', 'virgin', 'pure'], 'quick-content');
generatetext(['', 'interact_child','info_interact_child'], ['text', 'button', 'tooltip'], ['Auto Child Interact ', 'Auto', 'you must visit your baby first to trigger it.'], 'quick-content');
generatetext(['', 'pc_pregnancy', 'npc_pregnancy', 'pregnancy_detection'], ['text', 'button', 'button', 'button'], ['pregnancy detection ', 'pc=0', 'NPC=0','Activate'], 'quick-content');

generatetext([''], ['newline'], [''], 'quick-content');
if (isServer===1){
	generatetext([''], ['header'], ['Server'], 'quick-content');
	if (curVer!=testedOn) generatetext(['', 'server_save_info'], ['text', 'tooltip'], ['caution! game version is different', "Lower version or moded version could potentially cause problem."], 'quick-content');
	generatetext(['', 'save_data', 'load_data', 'serversaveinfo'], ['text', 'button', 'button', 'tooltip'], ['Server Save', 'Export', 'Import', 'this will export all of your save data (1-10) to the local server, allows you to import it anywhere else in the same local network'], 'quick-content');
	generatetext([''], ['newline'], [''], 'quick-content');
}
generatetext([''], ['header'], ['tool'], 'quick-content');
generatetext(['', 'tmpText', 'ArrayChecker', 'infoArrayChecker', 'infoArrayChecker2'], ['text', 'input', 'button', 'tooltip', 'tooltip'], ['Array error fix', '', 'Check', 'This is array checker, this is useful if you use server save/in game export save feature. Due to server save export and in game save export is using json format to export, array with string index will left blank, making some data in your save file gone.', 'How to use : open browser console by pressing f12 and press check and paste it in the browser console and then press enter.'], 'quick-content');
var element = document.getElementById('tmpText');
element.classList.add('tmpText');
generatetext(['', 'auto_check_status', 'checkArray', 'infoCheckArray'], ['text', 'button', 'button', 'tooltip'], ['Auto Array Check', 'unknown', 'Scan', 'check for further array error(might cause lag)'], 'quick-content');
//stats
generatetext([''], ['header'], ['Stats'], 'stats-content');
generatetext(['hesoyam', 'kill_player'], ['button', 'button'], ['Recover', 'Ruin'],'stats-content');
generatetext(['statpick', 'statinput', 'statset'], ['select', 'input', 'button'], [['pain', 'arousal', 'tiredness', 'stress', 'trauma', 'control', 'drunk', 'drugged', 'hallucinogen'], '', 'set'],'stats-content');
generatetext([''], ['newline'], [''], 'stats-content');

generatetext([''], ['header'], ['Enemy stats'], 'stats-content');
generatetext(['enemycalm', 'kill_enemy'], ['button', 'button'], ['Recover', 'Ruin'],'stats-content');
generatetext(['statpicke', 'statinpute', 'statsete'], ['select', 'input', 'button'], [['enemyhealth', 'enemytrust', 'enemyanger'], '', 'set'],'stats-content');
generatetext([''], ['newline'], [''], 'stats-content');
generatetext([''], ['header'], ['Player'], 'stats-content');
generatetext(['', 'moneyinput', 'moneyset'], ['text', 'input', 'button'], ['Money', '', 'set'],'stats-content');
generatetext(['', 'sprayset'], ['text', 'button'], ['Unlimited spray', 'set'],'stats-content');
generatetext(['', 'bodycurrent', 'bodypick', 'bodyset'], ['text', 'button', 'select', 'button'], ['Body Size : ', '', ['Tiny', 'Small', 'Normal', 'Large'], 'set'],'stats-content');
generatetext(['', 'bodytypecurrent', 'bodytypepick', 'bodytypeset'], ['text', 'button', 'select', 'button'], ['Natural features : ', '', ['Masculine', 'Feminine', 'Androgynous'], 'set'],'stats-content');
generatetext(['', 'ballsset'], ['text', 'button'], ['Balls : ', 'Remove'],'stats-content');
generatetext(['', 'virginitypick', 'virginitycurrent' , 'virginityset' , 'virginpure' ], ['text','select', 'button','button','button'], ['Virginity : ', ['anal','oral','penile','vaginal', 'temple', 'handholding', 'kiss'], '', 'Restore', 'pure'],'stats-content');
generatetext(['', 'sheesh', 'jk-lol'], ['text', 'button', 'button'], ['Crime', '-100','+100'], 'stats-content');
generatetext(['', 'parasitename', 'bodyparts', 'infect', 'desinfect'], ['text', 'select', 'select', 'button', 'button'], ['Parasite', parasitename, bodyparts, "infect", "remove"], 'stats-content');
generatetext([''], ['newline'], [''], 'stats-content');
generatetext([''], ['header'], ['Characteristics'], 'stats-content');
generatetext(['charapick', 'charainput', 'charaset'], ['select', 'input', 'button'], [characteristics, '', 'set'],'stats-content');
generatetext(['', 'lactatingset'], ['text', 'button'], ['lactating : ', 'Yes'],'stats-content');
generatetext(['', 'milkinput', 'milkset', 'milkrefil'], ['text','input','button', 'button'], ['milk volume', '', 'set', 'Refil'],'stats-content');
generatetext(['', 'cuminput', 'cumset', 'cumrefil'], ['text','input','button', 'button'], ['cum volume', '', 'set', 'Refil'],'stats-content');
generatetext([''], ['newline'], [''], 'stats-content');
generatetext([''], ['header'], ['Fame'], 'stats-content');
generatetext(['fame_name', 'input_fame12', 'set_fame12'], ['select', 'input', 'button'], [fame, '', 'Set'], 'stats-content');
generatetext([''], ['newline'], [''], 'stats-content');
generatetext([''], ['header'], ['School'], 'stats-content');
generatetext(['', 'select_exam', 'input_exam', 'set_exam'], ['text', 'select', 'input', 'button'], ['Exam', exam, '', 'Set'], 'stats-content');
generatetext(['', 'select_school_rep', 'input_school_rep', 'set_school_rep'], ['text', 'select', 'input', 'button'], ['School reputation', school_rep, '', 'Set'], 'stats-content');
generatetext([''], ['newline'], [''], 'stats-content');
generatetext([''], ['header'], ['Talent'], 'stats-content');
generatetext(['', 'select_talent', 'input_talent', 'set_talent'], ['text', 'select', 'input', 'button'], ['Talent',talent_skill, '', 'Set'], 'stats-content');
generatetext(['', 'select_hentai_skill', 'input_hentai_skill', 'set_hentai_skill'], ['text', 'select', 'input', 'button'], ['Ero Talent',hentaiSkill, '', 'Set'], 'stats-content');
//misc
generatetext([''], ['header'], ['NPC'], 'misc-content');
generatetext(['', 'npcnames', 'npctraits', 'npcchangeinput', 'changetraitbro'], ['text', 'select', 'select', 'input', 'button'], ['NPC manager', npcnamelist, npctrait,'','Set'], 'misc-content');
generatetext(['', 'max_harmony', 'max_Ferocity'], ['text', 'button', 'button'], ['wolfpack', 'max harmony', 'max Ferocity'], 'misc-content');
generatetext([''], ['newline'], [''], 'misc-content');
generatetext([''], ['header'], ['Pregnancy Manager'], 'misc-content');
generatetext(['','pregnancy_manager_time_tooltip'], ['header', 'tooltip'], ['Pregnancy time','day'], 'misc-content');
generatetext(['', 'named_npc_pregnancy_manager', 'named_npc_pregnancy_input', 'named_npc_pregnancy_toggle', 'named_npc_pregnancy_set'], ['text', 'select', 'input', 'checkbox','button'], ['Named NPC', ['placeholder'], '','lock preg','Set'], 'misc-content');
generatetext(['', 'npc_pregnancy_manager', 'npc_pregnancy_input', 'npc_pregnancy_toggle', 'npc_pregnancy_set'], ['text', 'select', 'input', 'checkbox','button'], ['NPC', ['placeholder'], '','lock preg','Set'], 'misc-content');
generatetext(['', 'mc_pregnancy_hole', 'mc_pregnancy_manager', 'mc_pregnancy_input', 'mc_pregnancy_toggle', 'mc_pregnancy_set'], ['text', 'select', 'select', 'input', 'checkbox','button'], ['Player', ['vagina', 'anus'], ['placeholder'], '','lock preg','Set'], 'misc-content');
generatetext(['','pregnancy_manager_time_tooltip'], ['header'], ['MC Offspring'], 'misc-content');
generatetext(['', 'mc_tentacle_location', 'mc_tentacle_select', 'mc_tentacle_input', 'mc_tentacle_set', 'mc_tentacle_tooltip'], ['text', 'select', 'select', 'input', 'button', 'tooltip'], ['Tentacle Speed', ['home', 'lake', 'farm'], ['placeholder'], '','Set', 'The lower the better'], 'misc-content');
generatetext(['', 'mc_baby_select', 'mc_baby_tooltip', 'mc_baby_action_select', 'mc_baby_input', 'mc_baby_set'], ['text', 'select', 'tooltip', 'select', 'checkbox', 'button'], ['Baby', ['placeholder'], "placeholder", ['placeholder'], '','Set'], 'misc-content');

generatetext([''], ['newline'], [''], 'misc-content');
generatetext([''], ['header'], ['Farm'], 'misc-content');
generatetext(['', 'placeholder_fruits', 'check_fruit_selling'], ['text','button', 'button'], ['Vegetables in process', 'Fruits here', 'Check'], 'misc-content');
generatetext(['', 'assault_time', 'set_assault_time'], ['text','input', 'button'], ['Assault day', '', 'set'], 'misc-content');
generatetext(['', 'build_time', 'set_build_time'], ['text', 'input', 'button'], ['build time', '', 'set'], 'misc-content');
generatetext(['', 'animal_choice', 'animal_input', 'set_animal_like'], ['text','select', 'input', 'button'], ['animals like', animals, '', 'set'], 'misc-content');
generatetext([''], ['newline'], [''], 'misc-content');
generatetext([''], ['header'], ['Misc'], 'misc-content');
generatetext(['', 'VrelCoinsUsage'], ['text', 'button'], ['Vrel Coins Usage 0', 'Set'], 'misc-content');
generatetext([''], ['newline'], [''], 'misc-content');
generatetext([''], ['header'], ['accessibility'], 'misc-content');
generatetext(['', 'Enable_cheat_history', 'info_cheat_history'], ['text', 'button', 'tooltip'], ['Enable history button', 'Enable', 'will enable history button beside cheat button. recommended for mobile user.'], 'misc-content');
generatetext(['', 'Enable_sidebar_button', 'info_sidebar_button'], ['text', 'button', 'tooltip'], ['Enable sidebar button', 'Enable', 'will enable sidebar button beside cheat button. recommended for mobile user.'], 'misc-content');
generatetext(['', 'simple_cheat_button', 'info_cheat_button'], ['text', 'button', 'tooltip'], ['simple cheat button', 'Enable', 'will makes cheat button simpler. recommended for mobile user.'], 'misc-content');
generatetext([''], ['newline'], [''], 'misc-content');
generatetext([''], ['header'], ['Debug'], 'misc-content');
generatetext(['', 'performance_quick', 'info_performance_quick', 'active_performance_quick','tooltip_performance_quick'], ['text', 'range', 'button', 'checkbox', 'tooltip'], ['Quick Performance', 4, 'beautiful', 'Activate', 'Info Here'],'misc-content');
generatetext(['', 'search_type', 'search_value', 'search123', 'search456'], ['text', 'select', 'input', 'button', 'button'], ['Search', [0,1,2],'', 'Deep', 'quick'], "misc-content");const firstload = {
	statpick: function(){
		var selectedValue = document.getElementById("statpick").value;
		var input = document.getElementById("statinput");
		var value = SugarCube.State.variables[selectedValue];
		input.value=value;
	},
	statpicke: function(){
		var selectedValue = document.getElementById("statpicke").value;
		var input = document.getElementById("statinpute");
		var value = SugarCube.State.variables[selectedValue];
		input.value=value;
	},
	spraystate: function(){
		const button = document.getElementById('sprayset');
		if (SugarCube.State.variables.infinitespray==1){
			button.innerHTML="unset";
		} else button.innerHTML="set";
	},
	bodycurrent: function(){
		const button = document.getElementById('bodycurrent');
		if (SugarCube.State.variables.bodysize==0){
			button.innerHTML="Tiny";
		} else if (SugarCube.State.variables.bodysize==1){
			button.innerHTML="Small";
		} else if (SugarCube.State.variables.bodysize==2){
			button.innerHTML="Normal";
		} else if (SugarCube.State.variables.bodysize==3){
			button.innerHTML="Large";
		}
	}, 
	bodytypecurrent: function(){
		const button = document.getElementById('bodytypecurrent');
		if (SugarCube.State.variables.player.gender_body=='m'){
			button.innerHTML='Masculine';
		} else if (SugarCube.State.variables.player.gender_body=='f'){
			button.innerHTML="Feminine";
		} else if (SugarCube.State.variables.player.gender_body=='a'){
			button.innerHTML="Androgynous";
		}
	},
	ballscurrent: function(){
		const button = document.getElementById('ballsset');
		if (SugarCube.State.variables.player.ballsExist==true) {
			button.innerHTML="remove";
		} else button.innerHTML="add";
	},
	virginitycurrent: function(){
		const virginitypick=document.getElementById("virginitypick").value;
		const button = document.getElementById('virginitycurrent');
		if (SugarCube.State.variables.player.virginity[virginitypick]==true) {
			button.innerHTML="pure";
		} else button.innerHTML="Taken";
	}, 
	crimecurrent: function(){
		var total=0;
		for (var key in SugarCube.State.variables.crime) {
		  if (key !== "events") total+=SugarCube.State.variables.crime[key].current;
		}
		const button = document.getElementById('crimecurrent');
		button.innerHTML=total;
	}, 
	vowcurrent: function(){
		const button = document.getElementById('vow-virgin');
		if (SugarCube.State.variables.player.virginity.temple==true){
		  button.innerHTML="Virgin";
	    } else button.innerHTML="Not Virgin";
	}, 
	characurrent: function(){
		var selectedValue = document.getElementById("charapick").value;
		var input = document.getElementById("charainput");
		var value = SugarCube.State.variables[selectedValue];
		input.value=value;
	}, 
	lactatingcurrent: function(){
		const button = document.getElementById('lactatingset');
		if (SugarCube.State.variables.lactating==1){
		  button.innerHTML="Yes";
	    } else button.innerHTML="Not";
	},
	milkcurrent: function(){
		var input = document.getElementById("milkinput");
		input.value=SugarCube.State.variables.milk_volume;
	}, 
	cumcurrent: function(){
		var input = document.getElementById("cuminput");
		input.value=SugarCube.State.variables.semen_volume;
	}, 
	famecurrent: function(){
		var selectedValue = document.getElementById("fame_name").value;
		var input = document.getElementById("input_fame12");
		var value = SugarCube.State.variables.fame[selectedValue];
		input.value=value;
	}, 
	npccurrent: function(){
		const cmbBox = document.getElementById("npcnames").value;
	    const cmbBox2 = document.getElementById("npctraits").value;
	    const input = document.getElementById("npcchangeinput");
		for (let i = 0; i < npcnamelist.length; i++) {
		  if (SugarCube.State.variables.NPCName[i].description === cmbBox) {
			var value=SugarCube.State.variables.NPCName[i][cmbBox2];
			input.value=value;
			break;
		  }
		}
	},
	examcurrent: function(){
		var selectedValue = document.getElementById("select_exam").value;
		var input = document.getElementById("input_exam");
		var value = SugarCube.State.variables[selectedValue];
		input.value=value;
	},
	talentcurrent: function(){
		var selectedValue = document.getElementById("select_talent").value;
		var input = document.getElementById("input_talent");
		var value = SugarCube.State.variables[selectedValue];
		input.value=value;
	},
	arousalpicked: function(){
		var button = document.getElementById("arousal_preview");
		var value = document.getElementById("arousal_val").value;
		button.innerHTML=value + "%";
	},
	update_pregnancy: function(){
		var button1 = document.getElementById("pc_pregnancy");
		var button2 = document.getElementById("npc_pregnancy");
		var value1 = mycode.pc_pregnant;
		var value2 = mycode.total_npc_pregnant;
		button1.innerHTML="MC = " + value1;
		button2.innerHTML="NPC = " + value2;
	},
	update_school_rep: function(){
		var selected = document.getElementById("select_school_rep").value;
	    document.getElementById("input_school_rep").value=SugarCube.State.variables[selected];
	},
	update_pregnancy_list_named_npc: function(){
		const selectElement = document.getElementById("named_npc_pregnancy_manager");
		while (selectElement.firstChild) {
			selectElement.removeChild(selectElement.firstChild);
		}
		// Add new options
		var fetuses=SugarCube.State.variables.sexStats.vagina.pregnancy.fetus;
		for (var i=0;i<SugarCube.State.variables.NPCName.length;i++){
			if (SugarCube.State.variables.NPCName[i].pregnancy.timer!=null) {
				const option = document.createElement("option");
				option.value = i;
				option.text = SugarCube.State.variables.NPCName[i].description;
				selectElement.appendChild(option);
			}
		}
	},
	update_pregnancy_day_named_npc: function(){
		const selectElement = document.getElementById("named_npc_pregnancy_manager").value;
		const named_npc_pregnancy_toggle = document.getElementById("named_npc_pregnancy_toggle").value;
		if (!selectElement) return;
		document.getElementById("named_npc_pregnancy_input").value=(SugarCube.State.variables.NPCName[selectElement].pregnancy.timerEnd-SugarCube.State.variables.NPCName[selectElement].pregnancy.timer)/3;
		var isExist=mycode.named_npc_pregnancy_locked.findIndex(name => name == selectElement);
		if (isExist!==-1) {
			named_npc_pregnancy_toggle.checked=true;
		} else {
			named_npc_pregnancy_toggle.checked=false;
		}
	},
	update_pregnancy_list_npc: function(){
		const selectElement = document.getElementById("npc_pregnancy_manager");
		while (selectElement.firstChild) {
			selectElement.removeChild(selectElement.firstChild);
		}
		// Add new options
		for (var key in SugarCube.State.variables.storedNPCs){
			const option = document.createElement("option");
			option.value = key;
			option.text = SugarCube.State.variables.storedNPCs[key].pregnancy.fetus[0].mother;
			selectElement.appendChild(option);
		}
	},
	update_pregnancy_day_npc: function(){
		const selectElement = document.getElementById("npc_pregnancy_manager").value;
		let npc_pregnancy_toggle = document.getElementById("npc_pregnancy_toggle");
		if (!selectElement) return;
		document.getElementById("npc_pregnancy_input").value=(SugarCube.State.variables.storedNPCs[selectElement].pregnancy.timerEnd-SugarCube.State.variables.storedNPCs[selectElement].pregnancy.timer)/3;
		var isExist=mycode.npc_pregnancy_locked.findIndex(name => name == selectElement);
		if (isExist!==-1) {
			npc_pregnancy_toggle.checked=true;
		} else {
			npc_pregnancy_toggle.checked=false;
		}
	},
	update_pregnancy_list_mc: function(){
		var selectElement = document.getElementById("mc_pregnancy_manager");
		var selectHole = document.getElementById("mc_pregnancy_hole").value;
		while (selectElement.firstChild) {
			selectElement.removeChild(selectElement.firstChild);
		}
		if (SugarCube.State.variables.sexStats[selectHole].pregnancy.type=="parasite") {
			for (var key in SugarCube.State.variables.sexStats[selectHole].pregnancy.fetus){
				const option = document.createElement("option");
				option.value = key;
				option.text = SugarCube.State.variables.sexStats[selectHole].pregnancy.fetus[key].creature;
				selectElement.appendChild(option);
			}
		} else if (SugarCube.State.variables.sexStats[selectHole].pregnancy.timerEnd!=null) {
			const option = document.createElement("option");
			option.value = "baby";
			option.text = "baby";
			selectElement.appendChild(option);
		}
	},
	update_pregnancy_day_mc: function(){
		var selectElement = document.getElementById("mc_pregnancy_manager").value;
		var selectHole = document.getElementById("mc_pregnancy_hole").value;
		var mc_pregnancy_input=document.getElementById("mc_pregnancy_input");
		var mc_pregnancy_toggle=document.getElementById("mc_pregnancy_toggle");
		if (!selectElement) return;
		var pregType=SugarCube.State.variables.sexStats[selectHole].pregnancy.type;
		if (pregType=="parasite") {
			mc_pregnancy_input.value=SugarCube.State.variables.sexStats[selectHole].pregnancy.fetus[selectElement].daysLeft;
		} else {
			mc_pregnancy_input.value=(SugarCube.State.variables.sexStats[selectHole].pregnancy.timerEnd-SugarCube.State.variables.sexStats[selectHole].pregnancy.timer)/3;
		}
		var isExist=mycode.mc_pregnancy_locked.findIndex(name => name == selectElement);
		var isExist2= isExist ===-1 ? 0 : (mycode.mc_pregnancy_locked_hole[isExist] != selectHole ? 1 : (mycode.mc_pregnancy_locked_type[isExist] != pregType ? 2 : 3));
		if (isExist2===3) {
			mc_pregnancy_toggle.checked=true;
		} else {
			mc_pregnancy_toggle.checked=false;
		}
	},
	update_mc_tentacle: function(){
		var selectElement = document.getElementById("mc_tentacle_select");
		var selectlocation = document.getElementById("mc_tentacle_location").value;
		while (selectElement.firstChild) {
			selectElement.removeChild(selectElement.firstChild);
		}
		if (SugarCube.State.variables.container[selectlocation].creatures.length>0)
			for (var key in SugarCube.State.variables.container[selectlocation].creatures){
				if (SugarCube.State.variables.container[selectlocation].creatures[key]!=null) {
					const option = document.createElement("option");
					option.value = key;
					option.text = SugarCube.State.variables.container[selectlocation].creatures[key].creature;
					selectElement.appendChild(option);
				}
			}
		this.update_mc_tentacle_input();
	},
	update_mc_tentacle_input: function(){
		var selectElement = document.getElementById("mc_tentacle_select").value;
		var selectlocation = document.getElementById("mc_tentacle_location").value;
		if (!selectElement) return;
		document.getElementById("mc_tentacle_input").value=SugarCube.State.variables.container[selectlocation].creatures[selectElement].stats.speed;
	},
	update_mc_baby_info: function(){
		var selectElement = document.getElementById("mc_baby_select").value;
		var selectAction = document.getElementById("mc_baby_action_select").value;
		var mc_baby_input = document.getElementById("mc_baby_input");
		if (!SugarCube.State.variables.children[selectElement]) return;
		const spanElement = document.getElementById("mc_baby_tooltip").querySelector("span");
		spanElement.textContent = "Name:"+SugarCube.State.variables.children[selectElement].name+", father:"+SugarCube.State.variables.children[selectElement].father+", mother:"+SugarCube.State.variables.children[selectElement].mother+", location:"+SugarCube.State.variables.children[selectElement].birthLocation;
		if (selectAction=="name") {
			mc_baby_input.type="";
			mc_baby_input.value=SugarCube.State.variables.children[selectElement][selectAction];
		} else {
			mc_baby_input.value="";
			mc_baby_input.type="checkbox";
			mc_baby_input.checked= SugarCube.State.variables.children[selectElement][selectAction]===true ? true : false;
		}
	},
	update_mc_baby_list_options:0,
	update_mc_baby_list: function(){
		var selectElement = document.getElementById("mc_baby_select");
		while (selectElement.firstChild) {
			selectElement.removeChild(selectElement.firstChild);
		}
		for (var key in SugarCube.State.variables.children) {
			const option = document.createElement("option");
			option.value = key;
			option.text = key;
			selectElement.appendChild(option);
		}
		this.update_mc_baby_info();
		if (this.update_mc_baby_list_options===0) {
			this.update_mc_baby_list_options=1;
			document.getElementById("mc_baby_input").style=""
			selectElement = document.getElementById("mc_baby_action_select");
			while (selectElement.firstChild) {
				selectElement.removeChild(selectElement.firstChild);
			}
			for (var key in babyOptions) {
				const option = document.createElement("option");
				option.value = babyOptions[key];
				option.text = babyOptionsText[key];
				selectElement.appendChild(option);
			}
		}
	}
	
}
function loadall() {
	if (SugarCube.State.variables.saveName=='') return;
	document.getElementById("moneyinput").value=SugarCube.State.variables.money;
	for (const functionName in firstload) {
		if (typeof firstload[functionName] === 'function') setTimeout(function() {
			firstload[functionName]();
		  }, 10);
	}
}