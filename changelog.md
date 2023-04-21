1.1.16
- Updated search box selector to accommodate Google search updates (now using textarea instead of input)
- Added option to include a space at the end of search query when focusing the search box

1.1.15
- Updated Google selectors.

1.1.14
- Fixed bug where first result would be skipped if auto focus first was not selected
- Fixed array index out of bounds exception after last result
- Added back navigation for footer links. Don't highlight footer links
- Pulled addResultHighlight, findContainer back into their own methods
- Removed focus/text property separation. Selector guarantees they'll always be the same
- Style updates
- Added safeguard to detect outdated selectors
- Pulled all selectors out into their own properties

1.1.13
- Fix for issue #23. Updated Google selectors

1.1.12
- Fix for issue #19. Updated Google selectors

1.1.11
- Fix for issue #16. Updated Google selectors

1.1.10
- PR #15 - Updated selector to handle new search variation

1.1.9
- Don't wrap when arrow is prepended to search results
- Bug Fix: Display marker when first result is automatically selected
- Fix issue #8 - Only activate the first link for each result (don't focus "Translate" or other links)

1.1.8
- Updated simple selector styling

1.1.7
- Updated selectors to accommodate Google search updates

1.1.6
- Added support for news, books, and video search results.
- Prevent hotkeys from triggering when modifier is active
- Prevent hotkeys from triggering when using calculator

1.1.5
- Scroll to the selected search result if it's not fully visible
- Added an option to automatically select the first search result

1.1.4
- Fix issue #4 - do not remove focus from *any* input elements (type=number, etc.).

1.1.3
- Fix issue #1 - do not remove focus from input elements

1.1.2
- Fixed issue navigating between results when "People also searched for" was displayed

1.1.1
- Don't activate search if a modifier key is used (i.e., CMD+C)
- Remove selected result outline if another styling method is chosen
- Focus footer navigation links after search results
- Change "J/K" setting to "VIM Style" - option now causes "/" to focus the search box

1.1.0
- Added styling for active search result (option may be toggled on or off)
- Allow search box activation to be disabled
- Allow customization of navigation hotkeys (TABS, ARROWS, and J/K)
- Self-documentation of shortcuts - all available shortcuts (and customization) is displayed on the options page
- Updated icons
- Fixed error where result navigation would not work properly if an Ad was displayed
- Added support for Google Scholar

1.0.1
- Update manifest - allow all Google TLDs

1.0.0
- Initial Install
