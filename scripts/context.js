// /* Copyright (c) 2017 SWGANZO. All rights reserved. */

// // Bolor toli url
// var bolor_url = "http://bolor-toli.com/dictionary/word?search=",
// lang_url  = "&selected_lang=",
// w         = 500,
// h         = 600,
// lang_map  = [];

// lang_map['mon2eng'] = '4-1';
// lang_map['mon2ger'] = '4-5';
// lang_map['mon2kor'] = '4-7';
// lang_map['mon2jap'] = '4-8';

// // Get window id
// function get_window_id(){
//   if( !localStorage.getItem('sw_window_id') ){
//     localStorage.setItem('sw_window_id', 0);
//   }

//   return localStorage.getItem('sw_window_id');
// }

// // Remove window id
// function remove_window_id(){
//   localStorage.removeItem('sw_window_id');
//   localStorage.removeItem('sw_tab_id');
// }

// // onRemoved window event
// chrome.windows.onRemoved.addListener(function(windowId) {
//   // Remove window_id storage
//   if( parseInt( get_window_id() ) === windowId) {
//     remove_window_id();
//   }
// });

// // The onClicked callback function.
// function onClickHandler(info, tab) {
//   var url = bolor_url + encodeURIComponent( info.selectionText ) + lang_url + lang_map[info.menuItemId];

//   var args = {
//     'left'    : 0,
//     'top'     : 0,
//     'width'   : w,
//     'height'  : h,
//     'type'    : 'panel',
//     'focused' : true,
//     'url'     : url
//   }

//   try {
//     // Update windows
//     chrome.windows.update(parseInt( get_window_id() ), { focused: true }, function() {
//       console.log(chrome.runtime.lastError);
//       // if error exists
//       if (chrome.runtime.lastError) {
//         // Create window
//         chrome.windows.create( args,
//           function(chromeWindow) {
//             // Set window id
//             localStorage.setItem('sw_window_id', chromeWindow.id);

//             // Set tab id
//             chrome.tabs.getAllInWindow(parseInt( get_window_id() ), function(tabs) {
//               localStorage.setItem( 'sw_tab_id', tabs[0].id );
//             });
//           });
//       }else{

//         chrome.tabs.update( parseInt( localStorage.getItem('sw_tab_id') ), {
//           'url' : url,
//           'active': true
//         });

//       }
//     });

//   } catch(e) {
//     alert(e);
//   }
// };

// chrome.contextMenus.onClicked.addListener(onClickHandler);

// // Set up context menu tree at install time.
// chrome.runtime.onInstalled.addListener(function() {
//   // Create context menu when select
//   chrome.contextMenus.create({"title": "Bolor toli-дох", "contexts":["selection"], "id": "langSelection"});
//   chrome.contextMenus.create({
//     "title": "Монгол <> Англи",
//     "parentId": "langSelection",
//     "id": "mon2eng",
//     "contexts":["selection"]
//   });
//   chrome.contextMenus.create({
//     "title": "Монгол <> Герман",
//     "parentId": "langSelection",
//     "id": "mon2ger",
//     "contexts":["selection"]
//   });
//   chrome.contextMenus.create({
//     "title": "Монгол <> Солонгос",
//     "parentId": "langSelection",
//     "id": "mon2kor",
//     "contexts":["selection"]
//   });
//   chrome.contextMenus.create({
//     "title": "Монгол <> Япон",
//     "parentId": "langSelection",
//     "id": "mon2jap",
//     "contexts":["selection"]
//   });
// });
