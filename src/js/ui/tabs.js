/**
 * @param {ParentNode} root
 */
export function initTabs(root) {
    root.addEventListener('click', (e) => {
        const target = /** @type {HTMLElement} */ (e.target);
        const tabsRoot = target.closest('[data-al-tabs]');
        if (!tabsRoot || !root.contains(tabsRoot)) return;

        const btn = target.closest('[role="tab"]');
        if (!btn || !tabsRoot.contains(btn)) return;

        const tabId = btn.getAttribute('data-al-tab');
        if (!tabId) return;

        const tablist = tabsRoot.querySelector('[role="tablist"]');
        const tabs = tablist ? [...tablist.querySelectorAll('[role="tab"]')] : [];

        tabs.forEach((tab) => {
            const isSel = tab === btn;
            tab.setAttribute('aria-selected', isSel ? 'true' : 'false');
            tab.tabIndex = isSel ? 0 : -1;
            tab.classList.toggle('tabs__tab--active', isSel);
            tab.classList.toggle('al-tabs__tab--active', isSel);
            const panelId = tab.getAttribute('aria-controls');
            const currentTabId = tab.getAttribute('data-al-tab');
            const panel = panelId
                ? document.getElementById(panelId)
                : currentTabId
                    ? tabsRoot.querySelector(`[data-al-tabpanel="${CSS.escape(currentTabId)}"]`)
                    : null;
            if (panel) {
                panel.classList.toggle('tabs__panel--active', isSel);
                panel.classList.toggle('al-tabs__panel--active', isSel);
                if (isSel) panel.removeAttribute('hidden');
                else panel.setAttribute('hidden', '');
            }
        });
    });
}
