/* Copyright (c) 2017 SWGANZO. All rights reserved. */
var text_input,
selected_lang,
search_btn,
bolor_url = "http://bolor-toli.com/dictionary/word?search=",
bolor_lang = "&selected_lang=",
window_id = 0,
tab_id = 0,
w = 500,
h = 600;



// Check if window opened
function is_window_opened(){
  var bgPage = chrome.extension.getBackgroundPage();

  if( window_id === 0 ){
    window_id = bgPage.window_id;
    tab_id = bgPage.tab_id;
  }else{
    bgPage.window_id = window_id;
    bgPage.tab_id = tab_id;
  }

  return (window_id != 0);
}



// Set clicked to true
function set_clicked(){
  chrome.runtime.sendMessage({
    set_variables: "asdf"
  }, function(response) {

  });
}



// Dom content loaded event
document.addEventListener('DOMContentLoaded', function () {

  text_input = document.getElementById("text-input");
  search_btn = document.getElementById("sw-button");
  selected_lang = document.getElementById("selected_lang");


  // Restore selected lang
  if (chrome.storage) {
    chrome.storage.local.get('lang', function (data) {
      if (data.lang) {
        selected_lang.value = data.lang;
      }
    });
  }


  // Search button click event
  search_btn.addEventListener("click", function( event ) {
    event.preventDefault();

    var value = text_input.value;
    var lang = selected_lang.value;

    if( value.trim() === '' ){
      return;
    }

    var url = bolor_url + encodeURIComponent( value ) + bolor_lang + encodeURIComponent( lang );


    var args = {
      'left'        : 0,
      'top'         : 0,
      'width'       : w,
      'height'      : h,
      'type'        : 'panel',
      'focused'     : true,
      'url'         : url
    }

    // Set clicked to true
    set_clicked();

    // Check if window has opened or not
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
  });


  // Keep lang setting
  if (chrome.storage) {
    selected_lang.addEventListener('change', function(event) {
      chrome.storage.local.set({
        'lang': selected_lang.value
      });
    });
  }


  text_input.addEventListener("keyup", function(event) {
    event.preventDefault();
    // Hit enter
    if (event.keyCode == 13) {
      search_btn.click();
    }
  });
});



