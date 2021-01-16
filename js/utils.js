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

  focusIndex: 0,

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
    return [
      // Main items
      ...Array.from(document.querySelectorAll('#search .g div[data-ved] > * > a[data-ved]:first-of-type')).map(element => ({
        container: element.closest('.g'),
        focus: element.closest('a'),
        text: element,
      })),
      // Suggested searches in footer
      ...Array.from(document.querySelectorAll('#botstuff a')).map(element => ({
        container: element,
        focus: element,
        text: element,
      })),
    ].filter(info => this.isElementVisible(info.focus));
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

  focusResult: function(offset) {
    var results = this.getVisibleResults();

    this.focusIndex = Math.max(this.focusIndex + offset, 0);

    var target = results[this.focusIndex];

    // Scroll the entire result container into view if it's not already.
    var rect = target.container.getBoundingClientRect();
    var offsetY = rect.bottom - window.innerHeight;
    if (offsetY > 0) {
      window.scrollBy(0, offsetY);
    }

    if (target.container.classList.contains('activeSearchResultContainer')) {
      // Already focused, exit
      return;
    }

    target.focus.focus();

    target.container.classList.add('activeSearchResultContainer');
    target.focus.classList.add('activeSearchResult');
    target.text.classList.add('activeSearchResultText');

    const blurHandler = () => {
      target.container.classList.remove('activeSearchResultContainer');
      target.focus.classList.remove('activeSearchResult');
      target.focus.removeEventListener('blur', blurHandler);
      target.text.classList.remove('activeSearchResultText');
    };

    target.focus.addEventListener('blur', blurHandler);
  }
};
