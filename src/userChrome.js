(function () {
  const { OS } = Cu.import('resource://gre/modules/osfile.jsm', {});

  function getStyleSheetService() {
    const contractID = '@mozilla.org/content/style-sheet-service;1';
    return Cc[contractID].getService(Ci.nsIStyleSheetService);
  }
  const sss = getStyleSheetService();

  const profileDir = OS.Constants.Path.profileDir;
  const cssDir = OS.Path.join(profileDir, 'chrome', 'css');
  const cssPath = OS.Path.join(cssDir, 'userAgentStyle.uc.css');
  const uri = makeURI(OS.Path.toFileURI(cssPath));

  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);
})();
