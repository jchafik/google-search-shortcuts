(function() {
  'use strict';

  // Get manifest data
  var manifestData = chrome.runtime.getManifest();

  // Display one-time installation and update messages
  chrome.runtime.onInstalled.addListener(function(details) {
    var options = {
      type: 'basic',
      title: manifestData.name
    };

    // The extension was freshly installed
    if (details.reason == 'install') {
      options.message = "Thank you for installing " + manifestData.name;
    }
    // The extension has been updated
    else if (details.reason == 'update') {
      options.message = manifestData.name + " has been updated to version " + manifestData.version;
    }

    chrome.notifications.create(null, options);
  });

})();
