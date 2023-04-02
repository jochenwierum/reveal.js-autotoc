!function (e, t) { 'object' == typeof exports && 'undefined' != typeof module ? module.exports = t() : 'function' == typeof define && define.amd ? define(t) : (e = 'undefined' != typeof globalThis ? globalThis : e || self).AutoToc = t();}(this, (
function () {
    'use strict';

    const MODE_HORIZONTAL = 'horizontal';
    const MODE_ALL = 'all';
    const MODE_MANUAL = 'manual';
    const LEVELS_NESTING = 'nesting';
    const LEVELS_HEADING = 'headings';

    const plugin = (reveal) => {
      const getConfig = () => {
        const config = reveal.getConfig().autotoc || {};
        const result = {};

        if (config.mode === MODE_HORIZONTAL) {
          result['mode'] = MODE_HORIZONTAL;
        } else if (config.mode === MODE_ALL) {
          result['mode'] = MODE_ALL;
        } else {
          if (config.mode !== undefined && config.mode !== MODE_MANUAL) {
            console.warn('Unknown autotoc mode: ' + config.mode);
          }
          result['mode'] = MODE_MANUAL;
        }

        if (config.levels === LEVELS_NESTING) {
          result['levels'] = LEVELS_NESTING;
        } else {
          if (config.levels !== undefined && config.levels !== LEVELS_HEADING) {
            console.warn('Unknown autotoc levels: ' + config.levels);
          }
          result['levels'] = LEVELS_HEADING;
        }

        if (typeof config.transformationFn === 'function') {
          result['transformationFn'] = config.transformationFn;
        } else {
          result['transformationFn'] = s => s;
        }

        result['defaultListStyles'] = config.defaultListStyles || 'ul';

        return result;
      };

      const isRelevant = (mode, slide) => {
        if (slide.dataset.tocIgnore !== undefined ||
          slide.dataset.tocIgnore === 'false' ||
          (
            slide.dataset.visibility === 'hidden' &&
            reveal.getConfig().showHiddenSlides !== true
          )
        ) {
          return false;
        }

        if (mode === MODE_ALL) {
          return true;
        } else if (mode === MODE_HORIZONTAL) {
          const indices = reveal.getIndices(slide);
          if (indices.v === undefined) {
            return !(slide.firstElementChild && slide.firstElementChild.tagName.toLowerCase() === 'section');
          } else {
            return indices.v === 0 || slide.dataset.toc !== undefined;
          }
        } else if (mode === MODE_MANUAL) {
          return slide.dataset.toc !== undefined;
        } else {
          return false;
        }
      };

      const firstTitleTag = (slide) => {
        for (const child of slide.children) {
          if (child.tagName.match(/^H[1-7]$/i)) {
            return {
              level: parseInt(child.tagName.substring(1)),
              title: child.innerText || '',
            };
          }
        }

        return { level: 1, title: '???' };
      };

      const getTocInfo = (config, slide) => {
        let groups = new Set(slide.dataset.tocGroups === undefined ?
          [] :
          slide.dataset.tocGroups.split(/\s*,\s*/).map(e => e.toUpperCase())
        );

        const indices = reveal.getIndices(slide);

        let htmlInfo = null;
        let title = slide.dataset.tocTitle || '';
        if (title === '') {
          htmlInfo = firstTitleTag(slide);
          title = htmlInfo.title;
        }
        title = config.transformationFn(title, slide);

        let level = 0;
        let levelString = slide.dataset.tocLevel;
        if (levelString !== undefined) {
          level = parseInt(levelString);
        }
        if (level === 0 || isNaN(level)) {
          if (config.levels === LEVELS_HEADING) {
            if (htmlInfo === null) {
              htmlInfo = firstTitleTag(slide);
            }
            level = htmlInfo.level;
          } else {
            level = (indices.v === undefined || indices.v === 0) ? 1 : 2;
          }
        }

        return {
          level,
          title,
          groups,
          indices
        };
      };

      const createLink = (tocInfo) => {
        const a = reveal.getRevealElement().ownerDocument.createElement('a');

        a.innerText = tocInfo.title;
        let href = '#/' + tocInfo.indices.h;
        if (tocInfo.indices.v !== undefined) {
          href += '/' + tocInfo.indices.v;
          if (tocInfo.indices.f !== undefined) {
            href += '/' + tocInfo.indices.f;
          }
        }
        a.href = href;

        const li = reveal.getRevealElement().ownerDocument.createElement('li');
        li.appendChild(a);
        return li;
      };

      const fillTarget = (config, target, entries) => {
        const requiredGroupsString = target.dataset.tocGroups;
        const tagStyles = (target.dataset.tocStyles || config['defaultListStyles']).split(/\s*,\s*/);
        const requiredGroups = new Set(requiredGroupsString === undefined ? [] :
          requiredGroupsString.split(/\s*,\s*/).map(s => s.toUpperCase()));

        const lastAddedElements = [target];

        const skipEntry = (entry) => {
          if (requiredGroups.size > 0) {
            let found = false;
            entry.groups.forEach(group => {
              if (requiredGroups.has(group)) {
                found = true;
              }
            });

            return !found;
          }
        };

        for (let entry of entries) {
          if (skipEntry(entry)) {
            continue;
          }

          while (entry.level + 1 < lastAddedElements.length) {
            lastAddedElements.pop();
          }

          if (entry.level + 1 === lastAddedElements.length) {
            const li = createLink(entry);
            lastAddedElements[lastAddedElements.length - 1].after(li);
            lastAddedElements[lastAddedElements.length - 1] = li;
          } else {
            let tagStyle = '';
            if (entry.level - 1 < tagStyles.length) {
              tagStyle = tagStyles[entry.level - 1];
            } else {
              tagStyle = tagStyles[tagStyles.length - 1];
            }

            // add dummy elements (happens if h3 is following a h1)
            while (entry.level > lastAddedElements.length) {
              const list = target.ownerDocument.createElement(tagStyle);
              const li = target.ownerDocument.createElement('li');
              list.append(li);
              lastAddedElements[lastAddedElements.length - 1].append(list);
              lastAddedElements.push(li);
            }

            const list = target.ownerDocument.createElement(tagStyle);
            const li = createLink(entry);
            list.append(li);
            lastAddedElements[lastAddedElements.length - 1].append(list);
            lastAddedElements.push(li);
          }
        }
      };

      const init = () => {
        const root = reveal.getSlidesElement();
        const targets = root.querySelectorAll('[data-toc-insert]');
        if (targets.length === 0) {
          console.log('No element with \'data-toc-insert\' attribute found. Won\'t generate any table of content.');
          return;
        }

        const config = getConfig();
        const entries = reveal.getSlides()
          .filter(slide => isRelevant(config['mode'], slide))
          .map(slide => getTocInfo(config, slide));

        targets.forEach(target => fillTarget(config, target, entries));
      };

      try {
        init();
      } catch (e) {
        console.error('Could not create tocs', e);
      }
    };

    return () => ({
      id: 'autotoc',
      init: plugin,
      destroy: () => {},
    });
  }
))
;
