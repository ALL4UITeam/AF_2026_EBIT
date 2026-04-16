import TreeView from '/js/common/TreeView.js';

/**
   * ==============================================
   * 페이지별 트리 데이터 및 초기화 스크립트
   * ==============================================
   * 이 파일은 각 페이지에서 수정하여 사용합니다.
   */

  /**
   * ==============================================
   * 트리 데이터 구조 설명
   * ==============================================
   * 
   * 각 노드는 다음과 같은 속성을 가질 수 있습니다:
   * 
   * @property {string} label - 표시될 텍스트 (필수)
   * @property {string} type - 'folder' 또는 'file' (필수)
   * @property {boolean} expanded - 폴더가 펼쳐진 상태인지 (선택, 기본값: false)
   * @property {boolean} selected - 선택된 상태인지 (선택, 기본값: false)
   * @property {string} action - 상태 텍스트 (선택, 예: '분석 완료', '처리중', '오류' 등)
   * @property {string} tag - 파일 태그 (선택, 예: 'ZIP', 'TIF', 'XML' 등)
   * @property {string} size - 파일 크기 (선택, 예: '85.3MB', '1.2GB' 등)
   * @property {boolean} downloadable - 다운로드 버튼 표시 여부 (선택)
   * @property {boolean} deletable - 삭제 버튼 표시 여부 (선택)
   * @property {Array} children - 자식 노드 배열 (선택)
   */

  // ========================================
  // 트리 데이터 정의
  // ========================================

  const treeData1 = {
    label: '백두산',
    type: 'folder',
    expanded: true,
    children: [
      {
        label: 'Landsat',
        type: 'folder',
        expanded: true,
        children: [
          {
            label: 'LC09_L1TP_116031_20231012...',
            type: 'file',
            tag: 'ZIP',
            size: '56.2MB',
            downloadable: true,
            deletable: true
          }
        ]
      }
    ]
  };

  const treeData2 = {
    label: 'OUTPUT',
    type: 'folder',
    expanded: true,
    children: [
      {
        label: 'ALOS-2',
        type: 'folder',
        expanded: false,
        children: []
      },
      {
        label: 'Sentinel-2',
        type: 'folder',
        expanded: true,
        children: [
          {
            label: '백두산',
            type: 'folder',
            expanded: true,
            children: [
              {
                label: '20250125',
                type: 'folder',
                expanded: true,
                selected: true,
                action: '분석 완료',
                children: [
                  {
                    label: 'Sentinel2_백두산_20250125.tif',
                    type: 'file',
                    tag: 'TIF',
                    size: '85.3MB',
                    downloadable: true,
                    deletable: true
                  },
                  {
                    label: 'Sentinel2_백두산_20250125.xml',
                    type: 'file',
                    tag: 'XML',
                    size: '13.4MB',
                    downloadable: true,
                    deletable: true
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };

  // ========================================
  // 이벤트 핸들러 정의
  // ========================================

  /**
   * 다운로드 버튼 클릭 핸들러
   */
  function handleDownload(node) {
    console.log('다운로드 요청:', node);
    alert(`다운로드 시작: ${node.label}`);
  }

  /**
   * 삭제 버튼 클릭 핸들러
   */
  function handleDelete(node) {
    console.log('삭제 요청:', node);
    if (confirm(`"${node.label}"을(를) 정말 삭제하시겠습니까?`)) {
      alert(`삭제 완료: ${node.label}`);
    }
  }

  /**
   * 노드 클릭 핸들러
   */
  function handleNodeClick(node) {
    console.log('노드 클릭:', node);
    
    // 파일 상세정보 표시, 미리보기 등
    // showFileDetail(node);
  }

  // ========================================
  // 트리 초기화
  // ========================================

  // DOM이 로드된 후 실행
  document.addEventListener('DOMContentLoaded', function() {
    
    // 트리 1 초기화
    const tree1 = new TreeView(
      document.getElementById('tree-1'),
      treeData1,
      {
        onDownloadClick: handleDownload,
        onDeleteClick: handleDelete,
        onNodeClick: handleNodeClick
      }
    );

    // 트리 2 초기화
    const tree2 = new TreeView(
      document.getElementById('tree-2'),
      treeData2,
      {
        onDownloadClick: handleDownload,
        onDeleteClick: handleDelete,
        onNodeClick: handleNodeClick
      }
    );

  });