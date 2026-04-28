/**
 * @param {number} current
 * @param {number} total
 * @returns {(number | 'ellipsis')[]}
 */
export function buildPageItems(current, total) {
    if (total <= 1) return [1];
    if (total <= 9) {
        return Array.from({ length: total }, (_, index) => index + 1);
    }

    if (current <= 5) {
        return [1, 2, 3, 4, 5, 6, 7, 8, 'ellipsis', total];
    }

    if (current >= total - 4) {
        return [1, 'ellipsis', total - 7, total - 6, total - 5, total - 4, total - 3, total - 2, total - 1, total];
    }

    return [1, 'ellipsis', current - 2, current - 1, current, current + 1, current + 2, 'ellipsis', total];
}

/**
 * @param {ParentNode} root
 * @param {() => { currentPage: number, totalPages: number }} getModel
 * @param {(page: number) => void} onPageChange
 */
export function initPagination(root, getModel, onPageChange) {
    const nav = root.querySelector('[data-al-pagination]');
    if (!nav) {
        return { render: () => {} };
    }

    const demoTotal = Number(nav.getAttribute('data-al-pagination-total'));
    const demoCurrent = Number(nav.getAttribute('data-al-pagination-current'));
    const demoModel = Number.isFinite(demoTotal) && demoTotal > 0
        ? {
            currentPage: Number.isFinite(demoCurrent) && demoCurrent > 0 ? demoCurrent : 1,
            totalPages: demoTotal,
        }
        : null;

    const pagesEl = nav.querySelector('[data-al-pagination-pages]');
    const firstBtn = nav.querySelector('[data-al-page-first]');
    const prevBtn = nav.querySelector('[data-al-page-prev]');
    const nextBtn = nav.querySelector('[data-al-page-next]');
    const lastBtn = nav.querySelector('[data-al-page-last]');

    const render = () => {
        const { currentPage, totalPages } = demoModel || getModel();

        if (firstBtn) firstBtn.disabled = currentPage <= 1 || totalPages <= 1;
        if (prevBtn) prevBtn.disabled = currentPage <= 1 || totalPages <= 1;
        if (nextBtn) nextBtn.disabled = currentPage >= totalPages || totalPages <= 1;
        if (lastBtn) lastBtn.disabled = currentPage >= totalPages || totalPages <= 1;

        if (!pagesEl) return;
        pagesEl.innerHTML = '';

        const items = buildPageItems(currentPage, totalPages);

        items.forEach((item) => {
            if (item === 'ellipsis') {
                const span = document.createElement('span');
                span.className = 'al-pagination__ellipsis';
                span.setAttribute('aria-hidden', 'true');
                span.textContent = '…';
                pagesEl.appendChild(span);
                return;
            }

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'al-pagination__page';
            btn.dataset.alPageNum = String(item);
            btn.textContent = String(item);
            if (item === currentPage) {
                btn.classList.add('al-pagination__page--active');
                btn.setAttribute('aria-current', 'page');
            }
            pagesEl.appendChild(btn);
        });
    };

    nav.addEventListener('click', (e) => {
        const target = /** @type {HTMLElement} */ (e.target);
        const { currentPage, totalPages } = demoModel || getModel();

        const setPage = (page) => {
            if (demoModel) {
                demoModel.currentPage = Math.min(Math.max(1, page), demoModel.totalPages);
                render();
                return;
            }

            onPageChange(page);
        };

        const pageBtn = target.closest('[data-al-page-num]');
        if (pageBtn) {
            const page = Number(pageBtn.getAttribute('data-al-page-num'));
            if (!Number.isFinite(page)) return;
            setPage(page);
            return;
        }

        if (target.closest('[data-al-page-first]')) {
            setPage(1);
            return;
        }

        if (target.closest('[data-al-page-prev]')) {
            setPage(Math.max(1, currentPage - 1));
            return;
        }

        if (target.closest('[data-al-page-next]')) {
            setPage(Math.min(totalPages, currentPage + 1));
            return;
        }

        if (target.closest('[data-al-page-last]')) {
            setPage(totalPages);
        }
    });

    return { render };
}
