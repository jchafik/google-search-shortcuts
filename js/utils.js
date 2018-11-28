// Globals
var shortcuts = {
  defaultOptions: {
    // Style selected search result
    styleSelectedSimple: true,

    styleSelectedFancy: false,

    // Activate search box. Boolean (activate when any printable key is pressed) or keyCode
    activateSearch: true,

    // Automatically select the first search reult.
    autoselectFirst: false,

    // Navigate between results using

    // Next = Tab; Previous = Shift + TAB
    navigateWithTabs: true,

    // Next = Down; Previous = Up
    navigateWithArrows: true,

    // Next = J; Previous = K [WARNING: Conflicts with activateSearch. This takes precedence.]
    navigateWithJK: false,

    // Esc = select all text in searchbox
    selectTextInSearchbox: false
  },

  saveOptions: function(options, callback) {
    chrome.storage.sync.set(options, callback);
  },

  loadOptions: function(callback) {
    chrome.storage.sync.get(this.defaultOptions, callback);
  },

  isElementVisible: function(element) {
    return element && (element.offsetWidth > 0 || element.offsetHeight > 0) && window.getComputedStyle(element, null).getPropertyValue('visibility') != 'hidden';
  },

  getVisibleResults: function() {
    var allResults = document.querySelectorAll('h3 a, #search .r > a:first-of-type, #foot a'),
        visibleResults = [];

    for (var i = 0; i < allResults.length; i++) {
      var element = allResults[i];
      if (this.isElementVisible(element)) {
        visibleResults.push(element);
      }
    }

    return visibleResults;
  },

  hasModifierKey: function(e) {
    return e.shiftKey || e.altKey || e.ctrlKey || e.metaKey;
  },

  /**
   * Determine if an input element is focused. id=cwtltblr is a special case for the calculator.
   */
  isInputActive: function() {
    var activeElement = document.activeElement;
    return activeElement != null && (activeElement.type == 'text' || activeElement.type == 'number' || activeElement.type == 'textarea' || activeElement.nodeName == 'INPUT' || activeElement.id == 'cwtltblr');
  },

  // -- Highlight the active result
  findContainer: function(link) {
    var container = link.closest('div.gs_r, div.g, li, td');
    return container != null ? container : link;
  },

  // Add custom styling for the selected result (does not apply to footer navigation links)
  addResultHighlight: function(target) {
    var container = this.findContainer(target);

    // Don't proceed if the result is already highlighted or if we're dealing with footer navigation links
    if (container.className.indexOf('activeSearchResult') >= 0 || target.closest('#foot') != null) {
      return;
    }

    container.className += ' activeSearchResult';
    target.addEventListener('blur', this.removeResultHighlight);
  },

  removeResultHighlight: function() {
    var container = shortcuts.findContainer(this);
    container.className = container.className.replace(" activeSearchResult", "");
    this.removeEventListener('blur', shortcuts.removeResultHighlight);
  },

  focusResult: function(offset, useFancyHighlight) {
    var results = this.getVisibleResults(),
        focused = document.querySelector('h3 a:focus, #search .r > a:focus, #foot a:focus'),
        focusIndex = null;

    // No result is currently focused. Focus the first one
    if (focused == null) {
      focusIndex = 0;
    }
    else {
      for (var i = 0; i < results.length; i++) {
        var result = results[i];
        if (result === focused) {
          focusIndex = i + offset;
          if (focusIndex < 0) focusIndex = 0;
          if (focusIndex >= results.length) focusIndex = results.length - 1;
          break;
        }
      }
    }

    // Could not determine element to focus. Focus on first result.
    if (focusIndex === null) {
      return; // focusIndex = 0;
    }

    var target = results[focusIndex];
    target.focus();

    // Scroll the entire result container into view if it's not already.
    var container = this.findContainer(target);
    var rect = container.getBoundingClientRect();
    var offsetY = rect.bottom - window.innerHeight;
    if (offsetY > 0) {
      window.scrollBy(0, offsetY);
    }

    if (useFancyHighlight) {
      this.addResultHighlight(target);
    }
  }
};
