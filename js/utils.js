// Globals
const shortcuts = {
  defaultOptions: {
    // Style selected search result
    styleSelectedSimple: false,

    styleSelectedFancy: true,

    // Activate search box. Boolean (activate when any printable key is pressed) or keyCode
    activateSearch: true,

    // Automatically select the first search result.
    autoselectFirst: false,

    // Navigate between results using

    // Next = Tab; Previous = Shift + TAB
    navigateWithTabs: true,

    // Next = Down; Previous = Up
    navigateWithArrows: true,

    // Next = J; Previous = K [WARNING: Conflicts with activateSearch. This takes precedence.]
    navigateWithJK: false,

    // Esc = select all text in searchbox
    selectTextInSearchbox: false,

    // Add space on focus
    addSpaceOnFocus: true
  },

  focusIndex: -1,

  inputElementIds: ['cwtltblr' /* Google Calculator Widget */],
  inputElementTypes: ['text', 'number', 'textarea'],

  visibleResultsQuerySelector: 'h3 a, #search a[data-ved][ping]',
  resultContainerQuerySelector: 'div.gs_r, div.g, li, td',
  navigationContainerQuerySelector: 'div[role="navigation"] table',
  navigationLinksAndSuggestedSearchesQuerySelector: 'div[role="navigation"] table a, #botstuff a',

  saveOptions: function(options, callback) {
    chrome.storage.sync.set(options, callback);
  },

  loadOptions: function(callback) {
    chrome.storage.sync.get(this.defaultOptions, callback);
  },

  isElementVisible: function(element) {
    return element && (element.offsetWidth > 0 || element.offsetHeight > 0) && window.getComputedStyle(element, null).getPropertyValue('visibility') !== 'hidden';
  },

  getVisibleResults: function() {
    const containers = [];
    return [
      // Main items
      ...Array.from(document.querySelectorAll(this.visibleResultsQuerySelector)).map(element => ({
        container: this.findContainer(element, containers),
        focusElement: element
      })),
      // Suggested searches in footer and footer links
      ...Array.from(document.querySelectorAll(this.navigationLinksAndSuggestedSearchesQuerySelector)).map(element => ({
        container: element,
        focusElement: element
      }))
    ].filter(target => target.container !== null && this.isElementVisible(target.focusElement));
  },

  hasModifierKey: function(e) {
    return e.shiftKey || e.altKey || e.ctrlKey || e.metaKey;
  },

  /**
   * Determine if an input element is focused
   */
  isInputActive: function() {
    const activeElement = document.activeElement;
    return activeElement != null && (activeElement.nodeName === 'INPUT' || this.inputElementTypes.includes(activeElement.type) || this.inputElementIds.includes(activeElement.id));
  },

  // -- Highlight the active result
  // Results without valid containers will be removed.
  findContainer: function(link, containers) {
    const container = link.closest(this.resultContainerQuerySelector);

    // Only return valid, unused containers
    if (container != null && containers.indexOf(container) < 0) {
      containers.push(container);
      return container;
    }

    return null;
  },

  // Add custom styling for the selected result (does not apply to footer navigation links)
  addResultHighlight: function(target) {
    // Don't proceed if the result is already highlighted or if we're dealing with footer navigation links
    if (target.container.classList.contains('activeSearchResultContainer') || target.focusElement.closest(this.navigationContainerQuerySelector) != null) {
      return;
    }

    target.container.classList.add('activeSearchResultContainer');
    target.focusElement.classList.add('activeSearchResult');

    const removeResultHighlight = () => {
      target.container.classList.remove('activeSearchResultContainer');
      target.focusElement.classList.remove('activeSearchResult');
      target.focusElement.removeEventListener('blur', removeResultHighlight);
    };

    target.focusElement.addEventListener('blur', removeResultHighlight);
  },

  focusResult: function(offset) {
    const results = this.getVisibleResults();

    if (results.length <= 0) {
      console.warn('No results found. Extension may need to be updated.');
      return;
    }

    // Shift focusIndex and perform boundary checks
    this.focusIndex += offset;
    this.focusIndex = Math.min(this.focusIndex, results.length - 1);
    this.focusIndex = Math.max(this.focusIndex, 0);

    const target = results[this.focusIndex];

    // Scroll the entire result container into view if it's not already.
    const rect = target.container.getBoundingClientRect();
    const offsetY = rect.bottom - window.innerHeight;
    if (offsetY > 0) {
      window.scrollBy(0, offsetY);
    }

    target.focusElement.focus();
    this.addResultHighlight(target);
  }
};
