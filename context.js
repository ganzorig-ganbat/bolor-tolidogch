/* Copyright (c) 2017 SWGANZO. All rights reserved. */



// Bolor toli url
var bolor_url = "http://bolor-toli.com/dictionary/word?search=",
window_id = 0,
tab_id    = 0,
w         = 500,
h         = 600;



// Check if window opened ( return true or false )
function is_window_opened(){
  return (window_id !== 0);
}


// Remove window event
chrome.windows.onRemoved.addListener(function(windowId) {
  if( window_id === windowId ){
    window_id = 0;
  }
});



// The onClicked callback function.
function onClickHandler(info, tab) {
  if (info.menuItemId == "contextSelection") {
    var url = bolor_url + encodeURIComponent( info.selectionText );

    var args = {
      'left'        : 0,
      'top'         : 0,
      'width'       : w,
      'height'      : h,
      'type'        : 'panel',
      'focused'     : true,
      'url'         : url
    }

    // Check if window openned
    if( !is_window_opened() ){

      try {

        chrome.windows.create(args,
          function(window) {
            window_id = window.id;

            chrome.tabs.getAllInWindow(window_id, function(tabs) {
              tab_id = tabs[0].id;
            });
          });

      } catch(e) {
        alert(e);
      }

    }else{

      try {

        chrome.windows.update(window_id, {focused: true});

        chrome.tabs.update(tab_id, {
          'url' : url,
          'active': true
        });

      } catch(e) {
        alert(e);
      }

    }
  }
};



chrome.contextMenus.onClicked.addListener(onClickHandler);



// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() {
  // Create context menu when select
  chrome.contextMenus.create({"title": "Bolor toli-дох", "contexts":["selection"], "id": "contextSelection"});
});