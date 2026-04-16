import "/scss/main.scss";
import "../common/CustomSelect.js";
import "../common/Modal.js";

// sideNav
document.querySelectorAll(".side-nav__toggle").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const item = toggle.closest(".side-nav__item");
    const expanded = toggle.getAttribute("aria-expanded") === "true";

    toggle.setAttribute("aria-expanded", String(!expanded));
    item.classList.toggle("is-open", !expanded);
  });
});

// Nav sticky behavior
document.addEventListener("DOMContentLoaded", () => {
  const sideNav = document.querySelector(".side-nav");
  const sideNavWrap = document.querySelector(".side-nav_wrap");
  const appHeader = document.querySelector(".app-header");
  
  if (!sideNav || !sideNavWrap || !appHeader) {
    return;
  }
  
  // 헤더의 초기 위치 저장
  let headerInitialBottom = 0;
  const initHeaderPosition = () => {
    const headerRect = appHeader.getBoundingClientRect();
    headerInitialBottom = headerRect.bottom + window.scrollY;
  };
  initHeaderPosition();
  
  // 스크롤 위치 기반으로 고정 상태 확인
  const checkSticky = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const headerRect = appHeader.getBoundingClientRect();
    const headerBottom = headerRect.bottom;
    
    // 헤더가 viewport 상단을 벗어났는지 확인
    const isStuck = headerBottom <= 20 || scrollY >= (headerInitialBottom - 20);
    
    // 클래스 토글
    sideNav.classList.toggle("is-stuck", isStuck);
    sideNavWrap.classList.toggle("is-stuck", isStuck);
  };
  
  // 초기 상태 확인
  checkSticky();
  
  // 스크롤 이벤트 (requestAnimationFrame으로 최적화)
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        checkSticky();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  
  // 리사이즈 시 헤더 위치 재계산
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      initHeaderPosition();
      checkSticky();
    }, 150);
  });
});

// 스크롤 중복 방지 (스크롤 가능한 컨텐츠 영역)
document.addEventListener("DOMContentLoaded", () => {
  const handleScrollableWheel = (e) => {
    const element = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = element;
    
    // 스크롤 가능 여부 확인
    const isScrollable = scrollHeight > clientHeight;
    if (!isScrollable) return;
    
    // 스크롤 방향 확인
    const deltaY = e.deltaY || e.wheelDeltaY || 0;
    const isScrollingDown = deltaY > 0;
    const isScrollingUp = deltaY < 0;
    
    // 위로 스크롤 중이고 맨 위에 있으면 부모로 전파
    if (isScrollingUp && scrollTop === 0) {
      return; // 부모로 전파 허용
    }
    
    // 아래로 스크롤 중이고 맨 아래에 있으면 부모로 전파
    if (isScrollingDown && scrollTop + clientHeight >= scrollHeight - 1) {
      return; // 부모로 전파 허용
    }
    
    // 그 외의 경우는 전파 차단
    e.stopPropagation();
  };
  
  // 모든 스크롤 가능한 영역에 이벤트 리스너 추가
  const scrollableSelectors = [
    '.card__body--scrollable',
    '.table-body',
    '.side-nav__inner',
    '[data-simplebar]',
    '.output-section__body',
    '.analysis-summary'
  ];
  
  scrollableSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(element => {
      element.addEventListener('wheel', handleScrollableWheel, { passive: false });
    });
  });
  
  // 동적으로 추가되는 요소를 위한 MutationObserver
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          scrollableSelectors.forEach(selector => {
            if (node.matches && node.matches(selector)) {
              node.addEventListener('wheel', handleScrollableWheel, { passive: false });
            }
            node.querySelectorAll && node.querySelectorAll(selector).forEach(element => {
              element.addEventListener('wheel', handleScrollableWheel, { passive: false });
            });
          });
        }
      });
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});

// EDM 등 form-tbl: table-header / table-body 열 너비 동기화
document.addEventListener("DOMContentLoaded", () => {
  const TABLE_SELECTOR = ".form-tbl--edm-detail";

  function syncFormTableColumnWidths() {
    document.querySelectorAll(TABLE_SELECTOR).forEach((tbl) => {
      const headerRow = tbl.querySelector(".table-header .table-cell__row");
      const bodyFirstRow = tbl.querySelector(".table-body .table-cell__row");
      if (!headerRow || !bodyFirstRow) return;

      const bodyCells = bodyFirstRow.querySelectorAll(".table-cell");
      const headerCells = headerRow.querySelectorAll(".table-cell");
      if (bodyCells.length === 0 || bodyCells.length !== headerCells.length) return;

      const widths = Array.from(bodyCells).map((cell) => cell.getBoundingClientRect().width);
      headerRow.style.gridTemplateColumns = widths.map((w) => `${w}px`).join(" ");
    });
  }

  syncFormTableColumnWidths();

  let resizeTick = false;
  window.addEventListener("resize", () => {
    if (resizeTick) return;
    requestAnimationFrame(() => {
      syncFormTableColumnWidths();
      resizeTick = false;
    });
    resizeTick = true;
  });
});

//Modal
document.addEventListener("DOMContentLoaded", () => {
  function openModal(id) {
    document.getElementById(id).classList.add("active");
  }
  function closeModal(id) {
    document.getElementById(id).classList.remove("active");
  }

  window.openModal = openModal;
  window.closeModal = closeModal;


  // ESC 키로 닫기
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal.active").forEach((modal) => {
        modal.classList.remove("active");
      });
    }
  });
});

// Tab
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".tab--btn__nav").forEach((nav) => {
    const tabs = nav.querySelectorAll(".tab--item");
    
    tabs.forEach((tab) => {
      tab.addEventListener("click", (e) => {
        e.preventDefault();
        const targetTab = tab.getAttribute("data-tab");
        if (!targetTab) return;

        // 같은 네비게이션의 모든 탭 버튼 비활성화
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        // 해당 탭 패널 찾기 (id="tab-{targetTab}" 형식)
        const targetPanel = document.getElementById(`tab-${targetTab}`);
        if (!targetPanel) {
          console.warn(`탭 패널을 찾을 수 없습니다: tab-${targetTab}`);
          return;
        }

        // 같은 페이지의 모든 탭 패널 숨기기 (같은 부모 컨테이너 내)
        const container = nav.closest(".page") || nav.parentElement;
        if (container) {
          const panels = container.querySelectorAll(".tab-panel");
          panels.forEach((panel) => {
            panel.classList.remove("active");
          });
        } else {
          document.querySelectorAll(".tab-panel").forEach((panel) => {
            panel.classList.remove("active");
          });
        }

        // 해당 탭 패널 표시
        targetPanel.classList.add("active");
      });
    });
  });
});

// Toggle
document.addEventListener("DOMContentLoaded", function () {
  const toggles = document.querySelectorAll("[data-toggle]");

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const group = toggle.dataset.group;

      if (group) {
        document.querySelectorAll(`[data-group="${group}"]`).forEach((el) => {
          el.classList.remove("active");
        });
        toggle.classList.add("active");
      } else {
        toggle.classList.toggle("active");
      }
    });
  });
});

// Accordion
const accItems = document.querySelectorAll(".acc-item");

accItems.forEach((item) => {
  const btn = item.querySelector(".acc-btn");
  const panel = item.querySelector(".acc-panel");

  btn.addEventListener("click", () => {
    const isActive = item.classList.contains("is-active");

    // 다른 항목 닫기
    accItems.forEach((other) => {
      if (other !== item) {
        other.classList.remove("is-active");
        const otherPanel = other.querySelector(".acc-panel");
        otherPanel.style.height = 0;
      }
    });

    // 현재 항목 토글
    if (isActive) {
      // 닫기
      item.classList.remove("is-active");
      panel.style.height = 0;
    } else {
      // 열기
      item.classList.add("is-active");
      panel.style.height = panel.scrollHeight + "px"; // 실제 내용 높이 계산
    }
  });
});

const drake = dragula([document.getElementById("dragArea")], {
  mirrorContainer: document.body,
});

drake.on("cloned", function (clone, original, type) {
  if (type === "mirror") {
    clone.innerHTML = "";

    clone.innerHTML = `
      <div class="ghost-drag-item">
        이동 중.
      </div>
    `;

    clone.classList.add("ghost-wrapper");
  }
});

// 테이블화 - 스크롤 대응
const listheads = document.querySelectorAll(".listhead");
const listbodies = document.querySelectorAll(".listbody");

listheads.forEach((head, i) => {
  const body = listbodies[i];

  if (!body) return;

  const headSpans = head.querySelectorAll("span");
  const widths = Array.from(headSpans).map(
    (span) => span.style.width || window.getComputedStyle(span).width,
  );

  const gridTemplate = widths.join(" ");

  const rows = body.querySelectorAll(".board li");

  rows.forEach((row) => {
    row.style.display = "grid";
    row.style.gridTemplateColumns = gridTemplate;
  });
});

$(".date-picker").datetimepicker({
  format: "Y-m-d",
  timepicker: false,
  lang: "ko",
});

// 파일 업로드 기능
document.addEventListener("DOMContentLoaded", () => {
  const fileUpload = document.getElementById("file-upload");
  const fileList = document.getElementById("file-list");
  
  if (fileUpload && fileList) {
    fileUpload.addEventListener("change", (e) => {
      const files = Array.from(e.target.files);
      fileList.innerHTML = "";
      
      files.forEach((file, index) => {
        const fileItem = document.createElement("div");
        fileItem.className = "file-item";
        
        const fileSize = (file.size / 1024 / 1024).toFixed(2) + "MB";
        
        fileItem.innerHTML = `
          <div class="file-item__info">
            <i class="ico ico-file"></i>
            <span class="file-item__name">${file.name}</span>
            <span class="file-item__size">${fileSize}</span>
          </div>
          <button type="button" class="file-item__remove" data-index="${index}">삭제</button>
        `;
        
        fileList.appendChild(fileItem);
      });
      
      // 삭제 버튼 이벤트
      fileList.querySelectorAll(".file-item__remove").forEach((btn) => {
        btn.addEventListener("click", () => {
          const index = parseInt(btn.getAttribute("data-index"));
          const dt = new DataTransfer();
          const files = Array.from(fileUpload.files);
          files.splice(index, 1);
          
          files.forEach((file) => dt.items.add(file));
          fileUpload.files = dt.files;
          
          // 파일 목록 다시 렌더링
          fileUpload.dispatchEvent(new Event("change"));
        });
      });
    });
    
    // 드래그 앤 드롭
    const uploadLabel = fileUpload.nextElementSibling;
    if (uploadLabel) {
      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        uploadLabel.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
        });
      });
      
      uploadLabel.addEventListener("drop", (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
          const dt = new DataTransfer();
          Array.from(files).forEach((file) => dt.items.add(file));
          fileUpload.files = dt.files;
          fileUpload.dispatchEvent(new Event("change"));
        }
      });
    }
  }
});

