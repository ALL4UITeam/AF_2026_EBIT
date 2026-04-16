/**
 * ==============================================
 * TreeView UI 컴포넌트 (재사용 가능)
 * ==============================================
 * 여러 페이지에서 import하여 사용할 수 있습니다.
 */

class TreeView {
  /**
   * TreeView 생성자
   * @param {HTMLElement} container - 트리를 표시할 DOM 요소
   * @param {Object} data - 트리 데이터 객체
   * @param {Object} callbacks - 콜백 함수들
   * @param {Function} callbacks.onDownloadClick - 다운로드 버튼 클릭 시
   * @param {Function} callbacks.onDeleteClick - 삭제 버튼 클릭 시
   * @param {Function} callbacks.onActionClick - 상태 태그 클릭 시
   * @param {Function} callbacks.onNodeClick - 노드 클릭 시
   */
  constructor(container, data, callbacks = {}) {
    this.container = container;
    this.data = data;
    this.onDownloadClick = callbacks.onDownloadClick;
    this.onDeleteClick = callbacks.onDeleteClick;
    this.onActionClick = callbacks.onActionClick;
    this.onNodeClick = callbacks.onNodeClick;
    this.render();
  }

  /**
   * 폴더 펼치기/접기
   */
  toggleNode(node, element) {
    node.expanded = !node.expanded;
    const childrenEl = element.querySelector('.tree-children');
    const iconEl = element.querySelector('.tree-item-icon');

    if (childrenEl) {
      childrenEl.classList.toggle('collapsed');

      // 아이콘 변경
      if (node.expanded) {
        iconEl.className = 'tree-item-icon folder-open-icon';
      } else {
        iconEl.className = 'tree-item-icon folder-icon';
      }
    }
  }

  /**
   * 노드 선택
   */
  selectNode(node, element) {
    // 이전 선택 제거 (같은 트리 컨테이너 내에서만)
    const container = element.closest('.tree-container');
    container.querySelectorAll('.tree-item-content.selected').forEach(el => {
      el.classList.remove('selected');
    });

    // 새로운 선택 추가
    element.classList.add('selected');
  }

  /**
   * 노드 요소 생성
   */
  createNodeElement(node, depth = 0) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'tree-item';
    itemDiv.classList.add(`depth-${depth}`);

    const contentDiv = document.createElement('div');
    contentDiv.className = 'tree-item-content';
    if (node.selected) {
      contentDiv.classList.add('selected');
    }

    // 아이콘
    const icon = document.createElement('span');
    icon.className = 'tree-item-icon';
    if (node.type === 'folder') {
      icon.classList.add(node.expanded ? 'folder-open-icon' : 'folder-icon');
    } else {
      icon.classList.add('file-icon');
    }
    contentDiv.appendChild(icon);

    // 레이블
    const label = document.createElement('span');
    label.className = 'tree-item-label';
    label.textContent = node.label;
    contentDiv.appendChild(label);

    // 메타 정보 영역
    const meta = document.createElement('div');
    meta.className = 'tree-item-meta';

    // 파일 태그
    if (node.tag) {
      const tag = document.createElement('span');
      tag.className = 'file-tag';
      tag.textContent = node.tag;
      meta.appendChild(tag);
    }

    // 파일 크기
    if (node.size) {
      const size = document.createElement('span');
      size.className = 'file-size';
      size.textContent = node.size;
      meta.appendChild(size);
    }

    // 상태 태그 (분석 완료, 처리중, 오류)
    if (node.action) {
      const statusTag = document.createElement('span');
      statusTag.className = 'status-tag';
      statusTag.textContent = node.action;
      
      // 상태에 따른 클래스 추가
      if (node.action === '분석 완료') {
        statusTag.classList.add('complete');
      } else if (node.action === '처리중' || node.action === '분석 중') {
        statusTag.classList.add('processing');
      } else if (node.action === '실패') {
        statusTag.classList.add('error');
      } else {
        statusTag.classList.add('error');
      }
      
      meta.appendChild(statusTag);
    }

    // 다운로드 버튼
    if (node.downloadable) {
      const downloadBtn = document.createElement('button');
      downloadBtn.className = 'download-button';
      downloadBtn.innerHTML = '';
      downloadBtn.onclick = (e) => {
        e.stopPropagation();
        
        if (this.onDownloadClick) {
          this.onDownloadClick(node);
        } else {
          alert(`다운로드 시작: ${node.label}`);
        }
      };
      meta.appendChild(downloadBtn);
    }

    // 삭제 버튼
    if (node.deletable) {
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-button';
      deleteBtn.innerHTML = '🗑️';
      deleteBtn.onclick = (e) => {
        e.stopPropagation();
        
        if (this.onDeleteClick) {
          this.onDeleteClick(node);
        } else {
          if (confirm(`"${node.label}"을(를) 삭제하시겠습니까?`)) {
            alert(`삭제됨: ${node.label}`);
          }
        }
      };
      meta.appendChild(deleteBtn);
    }

    contentDiv.appendChild(meta);

    // 노드 클릭 이벤트
    contentDiv.onclick = () => {
      // 폴더면 펼치기/접기
      if (node.type === 'folder' && node.children && node.children.length > 0) {
        this.toggleNode(node, itemDiv);
      }
      
      // 노드 선택
      this.selectNode(node, contentDiv);
      
      // 커스텀 콜백 실행
      if (this.onNodeClick) {
        this.onNodeClick(node);
      }
    };

    itemDiv.appendChild(contentDiv);

    // 자식 노드들
    if (node.children && node.children.length > 0) {
      const childrenDiv = document.createElement('div');
      childrenDiv.className = 'tree-children';
      if (!node.expanded) {
        childrenDiv.classList.add('collapsed');
      }

      node.children.forEach(child => {
        childrenDiv.appendChild(this.createNodeElement(child, depth + 1));
      });

      itemDiv.appendChild(childrenDiv);
    }

    return itemDiv;
  }

  /**
   * 트리 렌더링
   */
  render() {
    this.container.innerHTML = '';
    this.container.appendChild(this.createNodeElement(this.data));
  }

  /**
   * 데이터 업데이트 및 재렌더링
   */
  updateData(newData) {
    this.data = newData;
    this.render();
  }
}

export default TreeView;