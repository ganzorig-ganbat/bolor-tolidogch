// Watch for changes to the user's options & apply them
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.options?.newValue) {
    const debugMode = Boolean(changes.options.newValue.debug);
    console.log("enable debug mode?", debugMode);
    setDebugMode(debugMode);
  }
});
