const window_key = "windowId";
const tab_key = "tabId";
const bolor_url = "https://bolor-toli.com/result?";

const getWidth = () => {
  return 710;
};

const getHeight = () => {
  return 500;
};

const getLeft = () => {
  return 100;
};

const getTop = () => {
  return 100;
};

const removeWindowId = () => {
  chrome.storage.local.remove([window_key, tab_key]);
};

const getArgs = (url) => {
  return {
    focused: true,
    width: getWidth(),
    height: getHeight(),
    left: getLeft(),
    top: getTop(),
    // type: "popup",
    type: "normal",
    url: url,
  };
};

const getUrl = (search_text, direction) => {
  const encodeQueryData = (data) => {
    const ret = [];
    for (let d in data) ret.push(encodeURI(d) + "=" + encodeURI(data[d]));
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

const createWindow = (url) => {
  chrome.windows.create(getArgs(url), async (window) => {
    chrome.storage.local.set({ [window_key]: window.id });
    const tab = await getCurrentTab();
    chrome.storage.local.set({ [tab_key]: tab.id });

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
