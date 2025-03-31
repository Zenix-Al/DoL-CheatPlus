/** SYNC NOW REMOVED */
// function openDatabase() {
//     var request = window.indexedDB.open(database, 1);

//     request.onerror = function(event) {
//         console.log('Error adding data:', event.target.error);
//     };

//     request.onupgradeneeded = function(event) {
//       var db = event.target.result;
//       var detailsStore = db.createObjectStore('details', { keyPath: 'slot' });
//       var savesStore = db.createObjectStore('saves', { keyPath: 'slot' });
//     };

//     return request;
//   }

//   function addData(db, objectStoreName, data, action) {
//     return new Promise((resolve, reject) => {
//       var transaction = db.transaction([objectStoreName], 'readwrite');
//       var objectStore = transaction.objectStore(objectStoreName);

//       var request;
//       if (action === 'add') {
//         request = objectStore.add(data);
//         request.onsuccess = function() {
//             resolve(request.result); // Resolve with request.result
//           };
//       } else if (action === 'put') {
//         request = objectStore.put(data);
//         request.onsuccess = function() {
//             resolve(request.result); // Resolve with request.result
//           };
//       } else if (action === 'get') {
//         request = objectStore.get(data);
//         request.onsuccess = function() {
//             resolve(request.result); // Resolve with request.result
//           };
//       } else if (action === 'hybrid') {
//         request = objectStore.get(data.slot);
//         request.onsuccess = function(event) {
//           var result = event.target.result;
//           if (result) {
//             request = objectStore.put(data);
//           } else {
//             request = objectStore.add(data);
//           }
//           request.onsuccess = function() {
//             resolve(request.result); // Resolve with request.result
//           };
//           request.onerror = function(event) {
//             reject('Error performing action: ' + event.target.error);
//           };
//         };
//       } else if (action === 'count') {
//         request = objectStore.count();
//         request.onsuccess = function() {
//             resolve(request.result); // Resolve with request.result
//           };
//       } else if (action==='keys') {
//           var keys = [];
//           request = objectStore.openCursor();
//           request.onsuccess = function(event) {
//             var cursor = event.target.result;
//             if (cursor) {
//               keys.push(cursor.key);
//               cursor.continue();
//             } else {
//               resolve(keys); // Resolve the promise with the keys
//             }
//           };
//       }
//       transaction.oncomplete = function(event) {
//         resolve(); // Resolve without a result
//       };

//       request.onerror = function(event) {
//         reject('Error performing action: ' + event.target.error);
//       };
//     });
//   }

//   function export_data(){
//       if (syncinprogress==1) {
//           showToast('Sync in progres!');
//           return;
//       }
//       syncinprogress=1;
//       showToast('Exporting, please wait...');
//       var done=0;
//   var totalobject;
//     var dbRequest = openDatabase();
//     dbRequest.onsuccess = function(event) {
//       var db = event.target.result;
//       var object_target = 'saves';
//       var data = 1;
//       var action = 'keys';

//       addData(db, object_target, data, action)
//         .then(result => {
//           keys = result;

//           // Export saves
//           var savedata = [];
//           var promises = [];

//           for (var i = 0; i < keys.length; i++) {
//             (function(index) {
//               var promise = addData(db, object_target, keys[index], 'get')
//                 .then(result => {
//                   savedata[keys[index]] = result;
//                   console.log(savedata[keys[index]]);
//                 })
//                 .catch(error => {
//                   console.log(error);showerror();
//                 });

//               promises.push(promise);
//             })(i);
//           }

//           Promise.all(promises)
//             .then(function() {

//               var formData = new FormData();
//               formData.append('savedata', JSON.stringify(savedata));
//               var xhr = new XMLHttpRequest();
//               xhr.open("POST", "includes/export_saves.php", true);

//               xhr.onreadystatechange = function() {
//                 if (xhr.readyState === XMLHttpRequest.DONE) {
//                   if (xhr.status === 200) {
//                       console.log(xhr.responseText);
//                       done++;
//                       if (done==2){
//                           alert ("Exported!");
//                           syncinprogress=0;
//                       }
//                   } else {
//                     console.error('Error:', xhr.status);
//                   }
//                 }
//               };
//               xhr.send(formData);
//             })
//             .catch(function(error) {
//               console.log(error);showerror();
//             });
//         })
//         .catch(error => {
//           console.log(error);showerror();
//         });
//     };

//       //export details
//       var totalobject;
//     var dbRequest = openDatabase();
//     dbRequest.onsuccess = function(event) {
//       var db = event.target.result;
//       var object_target = 'details';
//       var data = 1;
//       var action = 'keys';

//       addData(db, object_target, data, action)
//         .then(result => {
//           var keys = result;
//           var savedata = [];
//           var promises = [];

//           for (var i = 0; i < keys.length; i++) {
//             (function(index) {
//               var promise = addData(db, object_target, keys[index], 'get')
//                 .then(result => {
//                   savedata[keys[index]] = result;
//                   console.log(savedata[keys[index]]);
//                 })
//                 .catch(error => {
//                   console.log(error);showerror();
//                 });

//               promises.push(promise);
//             })(i);
//           }

//           Promise.all(promises)
//             .then(function() {

//               var formData = new FormData();
//               formData.append('savedata', JSON.stringify(savedata));
//               var xhr = new XMLHttpRequest();
//               xhr.open("POST", "includes/export_details.php", true);

//               xhr.onreadystatechange = function() {
//                 if (xhr.readyState === XMLHttpRequest.DONE) {
//                   if (xhr.status === 200) {
//                       console.log(xhr.responseText);
//                       done++;
//                       if (done==2){
//                           alert ("Exported!");
//                           syncinprogress=0;
//                       }
//                   } else {
//                     console.error('Error:', xhr.status);
//                   }
//                 }
//               };
//               xhr.send(formData);
//             })
//             .then(function(){
//             })
//             .catch(function(error) {
//               console.log(error);showerror();
//             });
//         })
//         .catch(error => {
//           console.log(error);showerror();

//         });
//     };

//   }

//   function import_data(){
//       if (syncinprogress==1) {
//           showToast('Sync in progres!');
//           return;
//       }
//       syncinprogress=1;
//       showToast('Importing, please wait...');
//       var done=0;
//       var dbRequest = openDatabase();
//       dbRequest.onsuccess = function(event) {
//         var db = event.target.result;
//         var object_target = 'saves';
//         var action = 'hybrid';

//         var xhr = new XMLHttpRequest();
//         xhr.open("GET", "includes/import_saves.php", true);
//         xhr.onreadystatechange = function() {
//           if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
//             var promises = JSON.parse(xhr.responseText).map(function(record) {
//               return addData(db, object_target, record, action);
//             });

//             Promise.all(promises)
//               .then(function(results) {
//                   console.log(results);
//                   done++;
//                   if (done==2){
//                       alert ("Imported!");
//                       syncinprogress=0;
//                   }
//               })
//               .catch(function(error) {
//                 console.log(error);showerror();
//               });
//           }
//         };
//         xhr.send();
//       };

//       var dbRequest = openDatabase();
//       dbRequest.onsuccess = function(event) {
//         var db = event.target.result;
//         var object_target = 'details';
//         var action = 'hybrid';

//         var xhr = new XMLHttpRequest();
//         xhr.open("GET", "includes/import_details.php", true);
//         xhr.onreadystatechange = function() {
//           if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
//             var promises = JSON.parse(xhr.responseText).map(function(record) {
//               return addData(db, object_target, record, action);
//             });

//             Promise.all(promises)
//               .then(function(results) {
//                   console.log(results);
//                   done++;
//                   if (done==2){
//                       alert ("Imported!");
//                       syncinprogress=0;
//                   }
//               })
//               .catch(function(error) {
//                 console.log(error);showerror();
//               });
//           }
//         };
//         xhr.send();
//       };
//   }
//   function showerror(){
//       syncinprogress=0;
//       showToast('Sync error, please refresh and try again');
//   }
