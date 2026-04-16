/**
 * 모달 공통 기능
 */
class Modal {
  constructor(modalElement) {
    this.modal = modalElement;
    this.closeBtn = this.modal.querySelector('.modal-close');
    this.init();
  }
  
  init() {
    // 닫기 버튼 클릭
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => {
        this.close();
      });
    }
    
    // 배경 클릭 시 닫기
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });
    
    // ESC 키로 닫기
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.close();
      }
    });
  }
  
  open() {
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  toggle() {
    if (this.modal.classList.contains('active')) {
      this.close();
    } else {
      this.open();
    }
  }
}

// 자동 초기화
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal').forEach(modal => {
    new Modal(modal);
  });
  
  // 모달 열기 버튼
  document.querySelectorAll('[data-modal-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal-open');
      const modal = document.getElementById(modalId);
      if (modal) {
        const modalInstance = new Modal(modal);
        modalInstance.open();
      }
    });
  });
  
  // 모달 필터 버튼 (라디오 버튼처럼 동작)
  document.querySelectorAll('.modal-filter__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');
      const row = btn.closest('.modal-filter__row');
      
      // 같은 행의 다른 버튼 비활성화
      row.querySelectorAll('.modal-filter__btn').forEach(b => {
        b.classList.remove('active');
      });
      
      // 클릭한 버튼 활성화
      btn.classList.add('active');
    });
  });
});

export default Modal;
