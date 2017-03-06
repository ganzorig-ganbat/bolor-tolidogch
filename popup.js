/* Copyright (c) 2017 SWGANZO. All rights reserved. */
var bg,
text_input,
bolor_url = "http://bolor-toli.com/dictionary/word?search=",
window_id,
tab_id,
w,
h;

// Get variables from context.js
function get_variables(){
  bolor_url = bg.bolor_url;
  window_id = bg.window_id;
  tab_id    = bg.tab_id;
  w         = bg.w;
  h         = bg.h;
}



// Set variables to context.js
function set_variables(){
  bg.window_id = window_id;
  bg.tab_id    = tab_id;
}



// Dom content loaded event
document.addEventListener('DOMContentLoaded', function () {
  // Defining variables

  bg = chrome.extension.getBackgroundPage();

  // Getting variables from context.js
  get_variables();

  text_input = document.getElementById("text-input");

  // Search button click event
  document.getElementById("sw-button").addEventListener("click", function( event ) {
    event.preventDefault();

    var value = text_input.value;

    if( value.trim() === '' ){
      return;
    }

    // Get variables when click button
    get_variables();

    var url = bolor_url + encodeURIComponent( value );


    var args = {
      'left'        : 0,
      'top'         : 0,
      'width'       : w,
      'height'      : h,
      'type'        : 'panel',
      'focused'     : true,
      'url'         : url
    }

    // Check if window has opened or not
    if( window_id === 0 ){
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

    // Setting variables to context.js
    set_variables();

  });


  document.getElementById("text-input")
  .addEventListener("keyup", function(event) {
    event.preventDefault();
    // Hit enter
    if (event.keyCode == 13) {
      document.getElementById("sw-button").click();
    }
  });
});



