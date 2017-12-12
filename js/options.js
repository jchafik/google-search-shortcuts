(function() {
  'use strict';

  var extOptions = {};

  function displayDialog() {
    document.getElementById('dialog').style.marginTop = '0px';
    setTimeout(function() {
      document.getElementById('dialog').style.marginTop = '-100px';
    }, 5000);
  }

  function loadFormOptions() {
    document.getElementById('navigateWithTabs').checked = extOptions.navigateWithTabs;
    document.getElementById('navigateWithArrows').checked = extOptions.navigateWithArrows;
    document.getElementById('navigateWithJK').checked = extOptions.navigateWithJK;
    document.getElementById('styleSelectedSimple').checked = extOptions.styleSelectedSimple;
    document.getElementById('styleSelectedFancy').checked = extOptions.styleSelectedFancy;
    document.getElementById('activateSearch').checked = extOptions.activateSearch;
    document.getElementById('autoselectFirst').checked = extOptions.autoselectFirst;
    document.getElementById('selectTextInSearchbox').checked = extOptions.selectTextInSearchbox;
  }

  function saveOptions() {
    extOptions.navigateWithTabs = document.getElementById('navigateWithTabs').checked === true;
    extOptions.navigateWithArrows = document.getElementById('navigateWithArrows').checked === true;
    extOptions.navigateWithJK = document.getElementById('navigateWithJK').checked === true;
    extOptions.styleSelectedSimple = document.getElementById('styleSelectedSimple').checked === true;
    extOptions.styleSelectedFancy = document.getElementById('styleSelectedFancy').checked === true;
    extOptions.activateSearch = document.getElementById('activateSearch').checked === true;
    extOptions.autoselectFirst = document.getElementById('autoselectFirst').checked === true;
    extOptions.selectTextInSearchbox = document.getElementById('selectTextInSearchbox').checked === true;
    persistOptions();
  }

  function restoreDefaults() {
    extOptions = shortcuts.defaultOptions;
    persistOptions();
  }

  function persistOptions() {
    shortcuts.saveOptions(extOptions, function() {
      loadFormOptions();
      displayDialog();
    });
  }

  // Load options
  shortcuts.loadOptions(function(options) {
    extOptions = options;
    loadFormOptions();

    document.getElementById('save').addEventListener('click', saveOptions);
    document.getElementById('restore').addEventListener('click', restoreDefaults);
  });

})();