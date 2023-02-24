/* Copyright (c) 2017 Kenzo. All rights reserved. */

const window_key = "windowId",
  tab_key = "tabId",
  bolor_url = "https://bolor-toli.com/result?",
  top = 100,
  top_key = "top",
  left = 100,
  left_key = "left",
  height = 500,
  height_key = "height",
  width = 710,
  width_key = "width";

const getWidth = async () => {
  const width_obj = await chrome.storage.local.get([width_key]);
  return width_obj[width_key] ?? width;
};

const getHeight = async () => {
  const height_obj = await chrome.storage.local.get([height_key]);
  return height_obj[height_key] ?? height;
};

const getLeft = async () => {
  const left_obj = await chrome.storage.local.get([left_key]);
  return left_obj[left_key] ?? left;
};

const getTop = async () => {
  const top_obj = await chrome.storage.local.get([top_key]);
  return top_obj[top_key] ?? top;
};

const removeWindowId = () => {
  chrome.storage.local.remove([window_key, tab_key]);
};

const getArgs = async (url) => {
  return {
    focused: true,
    width: await getWidth(),
    height: await getHeight(),
    left: await getLeft(),
    top: await getTop(),
    type: "popup",
    url: url,
  };
};

const updateArgs = (window) => {
  chrome.storage.local.set({ [top_key]: window.top });
  chrome.storage.local.set({ [left_key]: window.left });
  chrome.storage.local.set({ [height_key]: window.height });
  chrome.storage.local.set({ [width_key]: window.width });
};

const getUrl = (search_text, direction) => {
  const encodeQueryData = (data) => {
    const ret = [];
    for (let d in data)
      ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
    return ret.join("&");
  };
  const params = {
    word: search_text,
    direction: direction,
  };
  const url = `${bolor_url}${encodeQueryData(params)}`;
  return url;
};

const getWindowId = async () => {
  let window_id_obj = await chrome.storage.local.get([window_key]);
  if (!window_id_obj[window_key]) {
    return 0;
  }
  return parseInt(window_id_obj[window_key]);
};

const getCurrentTab = async () => {
  const queryOptions = { active: true, lastFocusedWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

const createWindow = async (url) => {
  chrome.windows.create(await getArgs(url), async (window) => {
    await chrome.storage.local.set({ [window_key]: window.id });
    const tab = await getCurrentTab();
    await chrome.storage.local.set({ [tab_key]: tab.id });

    chrome.windows.onBoundsChanged.addListener((window) => {
      updateArgs(window);
    });

    chrome.windows.onRemoved.addListener(async (window_id) => {
      if (window_id == (await getWindowId())) {
        removeWindowId();
      }
    });
  });
};

const updateWindow = async (search_text, direction) => {
  const window_id = await getWindowId();
  const url = getUrl(search_text, direction);
  if (!window_id) {
    createWindow(url);
    return;
  }
  const tab_id = await chrome.storage.local.get([tab_key]);
  chrome.windows.update(window_id, { focused: true }, function () {
    if (chrome.runtime.lastError) {
      createWindow(url);
    } else {
      chrome.tabs.update(parseInt(tab_id[tab_key]), {
        url: url,
        active: true,
      });
    }
  });
};

export { updateWindow };
