/* Copyright (c) 2017 SWGANZO. All rights reserved. */
function pasteSelection() {
    chrome.tabs.query({active:true, windowId: chrome.windows.WINDOW_ID_CURRENT},
        function(tab) {
            chrome.tabs.sendMessage(tab[0].id, {method: "getSelection"},
                function(response){
                    if (response === undefined){
                        return;
                    }
                    var selectedText = response.data;

                    if (selectedText.length > 0) {
                        $searchbar = $('#search-bar');
                        $searchbar.find('input[name=q]').val(selectedText);
                        $searchbar.submit();
                    }
                });
        });
}

$(function(){
    $('#search-bar').ajaxForm({
        target: '#search-result',
        beforeSerialize: function($form, options){
            $('#search-result').html('<h2>Loading</h2>');
        },
        error: function(){
            $('#search-result').html('Request Failed. Try Again Later.');
        }
    });

    pasteSelection();
});
