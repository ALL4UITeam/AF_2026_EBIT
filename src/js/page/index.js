import '../../scss/main.scss';

import { initFileUpload, renderFileList, makeFileId } from '../ui/fileUpload.js';
import { initModals } from '../ui/modal.js';
import { initTabs } from '../ui/tabs.js';
import { initToggle } from '../ui/toggle.js';
import { initPagination } from '../ui/pagination.js';
import { initSidenav } from '../ui/sidenav.js';
import '../common/CustomSelect.js';

/**
 * @typedef {{ id: string, file: File }} GuideFileRow
 */

function initGuidePage() {
    const root = document.getElementById('alContent');
    if (!root) return;

    /** @type {{ files: GuideFileRow[], filteredFiles: GuideFileRow[], currentPage: number, pageSize: number }} */
    const model = {
        files: [],
        filteredFiles: [],
        currentPage: 1,
        pageSize: 5,
    };

    const { render: renderPagination } = initPagination(
        root,
        () => ({
            currentPage: model.currentPage,
            totalPages: Math.max(1, Math.ceil(model.filteredFiles.length / model.pageSize)),
        }),
        (page) => {
            const totalPages = Math.max(1, Math.ceil(model.filteredFiles.length / model.pageSize));
            model.currentPage = Math.min(Math.max(1, page), totalPages);
            refreshListView();
        }
    );

    function handleDownload(fileId) {
        const target = model.files.find((item) => item.id === fileId);
        if (!target) return;

        const url = URL.createObjectURL(target.file);
        const a = document.createElement('a');
        a.href = url;
        a.download = target.file.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    function handleRemove(fileId) {
        model.files = model.files.filter((item) => item.id !== fileId);
        applyFilter();
    }

    function refreshListView() {
        const totalPages = Math.max(1, Math.ceil(model.filteredFiles.length / model.pageSize));
        if (model.currentPage > totalPages) {
            model.currentPage = totalPages;
        }

        const start = (model.currentPage - 1) * model.pageSize;
        const pageSlice = model.filteredFiles.slice(start, start + model.pageSize);

        renderFileList(root, pageSlice, (action, fileId) => {
            if (action === 'download') handleDownload(fileId);
            if (action === 'remove') handleRemove(fileId);
        });

        renderPagination();
    }

    function applyFilter() {
        const kw = root.querySelector('[data-al-guide-kw]');
        const keyword = (kw instanceof HTMLInputElement ? kw.value : '').trim().toLowerCase();

        model.filteredFiles = keyword
            ? model.files.filter(({ file }) => file.name.toLowerCase().includes(keyword))
            : [...model.files];

        const tot = root.querySelector('[data-al-total-count]');
        if (tot) tot.textContent = String(model.filteredFiles.length);

        model.currentPage = 1;
        refreshListView();
    }

    function appendValidFiles(/** @type {File[]} */ newFiles) {
        newFiles.forEach((file) => {
            const id = makeFileId(file);
            if (!model.files.some((row) => row.id === id)) {
                model.files.push({ id, file });
            }
        });
        applyFilter();
    }

    initFileUpload({ root, onValidFiles: appendValidFiles });
    initModals();
    initTabs(root);
    initToggle(root);
    initDatePop(root);

    const searchBtn = root.querySelector('[data-al-guide-search]');
    const kw = root.querySelector('[data-al-guide-kw]');

    const runSearch = () => applyFilter();
    searchBtn?.addEventListener('click', runSearch);
    kw?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') runSearch();
    });

    applyFilter();
}

function initDatePop(root) {
    const closeAll = () => {
        root.querySelectorAll('[data-date-pop]').forEach((pop) => {
            if (pop instanceof HTMLElement) pop.hidden = true;
        });
    };

    const getDateValue = (button) => {
        const days = button.closest('.date-pop__days');
        if (!days) return '';
        const buttons = [...days.querySelectorAll('button')];
        const index = buttons.indexOf(button);
        const day = button.textContent?.trim().padStart(2, '0') || '';

        if (index < 2) return `2026-03-${day}`;
        if (index > 31) return `2026-05-${day}`;
        return `2026-04-${day}`;
    };

    const paintSelectedDays = (field) => {
        const start = field.dataset.dateStart;
        const end = field.dataset.dateEnd;

        field.querySelectorAll('.date-pop__days button').forEach((button) => {
            if (!(button instanceof HTMLButtonElement)) return;
            const value = getDateValue(button);
            button.classList.toggle('is-selected', value === start || value === end);
            button.classList.toggle('is-range', Boolean(start && end && value > start && value < end));
        });
    };

    root.addEventListener('click', (e) => {
        const target = /** @type {HTMLElement} */ (e.target);
        const field = target.closest('.form__field--date');
        const pop = field?.querySelector('[data-date-pop]');
        const dayButton = target.closest('.date-pop__days button');

        if (dayButton && field instanceof HTMLElement && dayButton instanceof HTMLButtonElement) {
            const input = field.querySelector('.form__input');
            const value = getDateValue(dayButton);

            if (!field.dataset.dateStart || field.dataset.dateEnd) {
                field.dataset.dateStart = value;
                field.dataset.dateEnd = '';
                if (input instanceof HTMLInputElement) input.value = `${value} ~ `;
            } else {
                const start = field.dataset.dateStart;
                const sorted = [start, value].sort();
                field.dataset.dateStart = sorted[0];
                field.dataset.dateEnd = sorted[1];
                if (input instanceof HTMLInputElement) input.value = `${sorted[0]} ~ ${sorted[1]}`;
                if (pop instanceof HTMLElement) pop.hidden = true;
            }

            paintSelectedDays(field);
            return;
        }

        if (field instanceof HTMLElement && !target.closest('[data-date-pop]')) {
            const isOpen = pop instanceof HTMLElement && !pop.hidden;
            closeAll();
            if (pop instanceof HTMLElement) {
                pop.hidden = isOpen && target.closest('[data-date-toggle]') ? true : false;
                paintSelectedDays(field);
            }
        }
    });

    document.addEventListener('click', (e) => {
        const target = /** @type {HTMLElement} */ (e.target);
        if (root.contains(target) && target.closest('.form__field--date')) return;
        closeAll();
    });

    root.querySelectorAll('.form__field--date').forEach((field) => {
        if (!(field instanceof HTMLElement)) return;
        field.dataset.dateStart = '2026-03-31';
        field.dataset.dateEnd = '2026-04-07';
        paintSelectedDays(field);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initSidenav();
});

initGuidePage();
