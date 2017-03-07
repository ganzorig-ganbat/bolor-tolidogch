/* Copyright (c) 2017 SWGANZO. All rights reserved. */



// Bolor toli url
var bolor_url = "http://bolor-toli.com/dictionary/word?search=",
window_id = 0,
clicked   = false,
tab_id    = 0,
w         = 500,
h         = 600;



// Check if window opened ( return true or false )
function is_window_opened(){
  return (window_id != 0);
}



//  onCreated window event
chrome.windows.onCreated.addListener(function(window) {
  // Clicked our app
  if( clicked === false ){
    return;
  }

  // If window not opened
  if( !is_window_opened() ){
    // Set window id
    window_id = window.id;

    chrome.tabs.getAllInWindow(window_id, function(tabs) {
      tab_id = tabs[0].id;
    });
  }

  // Set clicked to default value
  clicked = false;
});



// onRemoved window event
chrome.windows.onRemoved.addListener(function(windowId) {
  if( window_id === windowId ){
    window_id = 0;
    tab_id = 0;
    clicked = false;
  }
});


// Listen popup.js message
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.set_variables == "asdf"){
      clicked = true;
    }
  });



// The onClicked callback function.
function onClickHandler(info, tab) {
  if (info.menuItemId == "contextSelection") {
    var url = bolor_url + encodeURIComponent( info.selectionText );

    var args = {
      'left'    : 0,
      'top'     : 0,
      'width'   : w,
      'height'  : h,
      'type'    : 'panel',
      'focused' : true,
      'url'     : url
    }


    // Clicked
    clicked = true;


    // Check if window opened
    if( !is_window_opened() ){

      try {

        chrome.windows.create(args);

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



// Context menu click handler
chrome.contextMenus.onClicked.addListener(onClickHandler);



// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() {
  // Create context menu when select
  chrome.contextMenus.create({"title": "Bolor toli-дох", "contexts":["selection"], "id": "contextSelection"});
});