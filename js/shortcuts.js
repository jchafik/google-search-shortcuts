(function () {
  'use strict';

  // Enforce that the script is only run on search result pages (Google Search or Google Scholar)
  const isResultsPage = document.querySelector('html[itemtype="http://schema.org/SearchResultsPage"], .gs_r');
  if (!isResultsPage) {
    return;
  }

  // Globals
  const KEYS = {UP: 'ArrowUp', DOWN: 'ArrowDown', TAB: 'Tab', J: 'j', K: 'k', SLASH: '/', ESC: 'Escape'};

  const addHighlightStyles = (options) => {
    const body = document.body;
    if (options.styleSelectedSimple || options.styleSelectedFancy) body.classList.add('useHighlight');
    if (options.styleSelectedSimple) body.classList.add('useSimpleHighlight');
    if (options.styleSelectedFancy) body.classList.add('useFancyHighlight');
  };

  const addNavigationListener = (options) => {
    const searchBox = document.querySelector('form[role="search"] textarea:nth-of-type(1)');

    window.addEventListener('keydown', (event) => {
      const key = event.key;
      const noInputOrModifierActive = !shortcuts.isInputActive() && !shortcuts.hasModifierKey(event),

        isPrintable = key.length === 1 && !event.ctrlKey && !event.metaKey,

        shouldNavigateNext = (options.navigateWithArrows && key === KEYS.DOWN && noInputOrModifierActive) ||
          (options.navigateWithTabs && key === KEYS.TAB && !event.shiftKey) ||
          (options.navigateWithJK && key === KEYS.J && noInputOrModifierActive),

        shouldNavigateBack = (options.navigateWithArrows && key === KEYS.UP && noInputOrModifierActive) ||
          (options.navigateWithTabs && key === KEYS.TAB && event.shiftKey) ||
          (options.navigateWithJK && key === KEYS.K && noInputOrModifierActive),

        shouldActivateSearch = noInputOrModifierActive && (
          (options.activateSearch === true && isPrintable) ||
          (options.activateSearch !== false && key === options.activateSearch)
        ),

        shouldActivateSearchAndHighlightText = noInputOrModifierActive && options.selectTextInSearchbox && key === KEYS.ESC;

      if (shouldNavigateNext || shouldNavigateBack) {
        event.preventDefault();
        event.stopPropagation();
        shortcuts.focusResult(shouldNavigateNext ? 1 : -1);
      } else if (shouldActivateSearch) {
        // Otherwise, force caret to end of text and focus the search box
        if (options.addSpaceOnFocus) {
          searchBox.value += ' ';
        }
        const searchBoxLength = searchBox.value.length;
        searchBox.focus();
        searchBox.setSelectionRange(searchBoxLength, searchBoxLength);
      } else if (shouldActivateSearchAndHighlightText) {
        window.scrollTo(0, 0);
        searchBox.focus();
        searchBox.select();
      }
    });

    window.addEventListener('keyup', (event) => {
      if (!shortcuts.isInputActive() && !shortcuts.hasModifierKey(event) && options.navigateWithJK && event.key === KEYS.SLASH) {
        if (options.addSpaceOnFocus) {
          searchBox.value += ' ';
        }
        searchBox.focus();
      }
    });
  };

  // Load options
  shortcuts.loadOptions((options) => {
    addHighlightStyles(options);
    addNavigationListener(options);

    // Auto select the first search result
    if (options.autoselectFirst === true) {
      shortcuts.focusResult(1);
    }
  });

})();
