/* Copyright (c) 2017 SWGANZO. All rights reserved. */
var text_input,
selected_lang,
search_btn,
bolor_url = "http://bolor-toli.com/dictionary/word?search=",
bolor_lang = "&selected_lang=",
w = 500,
h = 600;



// Get window id
function get_window_id(){
  if( !localStorage.getItem('sw_window_id') ){
    localStorage.setItem('sw_window_id', 0);
  }

  return localStorage.getItem('sw_window_id');
}



// Remove window id
function remove_window_id(){
  localStorage.removeItem('sw_window_id');
  localStorage.removeItem('sw_tab_id');
}



// Dom content loaded event
document.addEventListener('DOMContentLoaded', function () {
  text_input = document.getElementById("text-input");
  search_btn = document.getElementById("sw-button");
  selected_lang = document.getElementById("selected_lang");


  // Restore selected lang
  if( !localStorage.getItem('sw_lang') ){
    localStorage.setItem('sw_lang', '4-1');
  }

  selected_lang.value = localStorage.getItem('sw_lang');

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


    try {
      // Update windows
      chrome.windows.update(parseInt( get_window_id() ), { focused: true }, function() {
        console.log(chrome.runtime.lastError);
        // if error exists
        if (chrome.runtime.lastError) {
          // Create window
          chrome.windows.create( args,
            function(chromeWindow) {
              // Set window id
              localStorage.setItem('sw_window_id', chromeWindow.id);

              // Set tab id
              chrome.tabs.getAllInWindow(parseInt( get_window_id() ), function(tabs) {
                localStorage.setItem( 'sw_tab_id', tabs[0].id );
              });
            });
        }else{

          chrome.tabs.update( parseInt( localStorage.getItem('sw_tab_id') ), {
            'url' : url,
            'active': true
          });

        }
      });
    } catch(e) {
      alert(e);
    }
  });

  // Keep lang setting
  selected_lang.addEventListener('change', function(event) {
    localStorage.setItem('sw_lang', selected_lang.value);
  });


  text_input.addEventListener("keyup", function(event) {
    event.preventDefault();
    // Hit enter
    if (event.keyCode == 13) {
      search_btn.click();
    }
  });
});



