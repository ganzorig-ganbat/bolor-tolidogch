/* Copyright (c) 2017 Kenzo. All rights reserved. */

import { bolorLocales } from "./locales.js";
import { updateWindow } from "./window.js";

chrome.runtime.onInstalled.addListener(async () => {
  for (const { direction, title } of bolorLocales) {
    chrome.contextMenus.create({
      id: direction,
      title: title,
      type: "normal",
      contexts: ["selection"],
    });
  }
});

chrome.contextMenus.onClicked.addListener((item) => {
  const direction = item.menuItemId;
  const search_text = item.selectionText;
  console.log(direction, search_text);
  updateWindow(search_text, direction);
});
