import TreeView from '/js/common/TreeView.js';

// 전처리 페이지용 트리 데이터
document.addEventListener('DOMContentLoaded', () => {
    const treeData = {
        label: '2025-10-10',
        type: 'folder',
        expanded: true,
        children: [
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
                                label: 'sentinel-2_baekdusan_001',
                                type: 'file',
                                tag: 'TIF',
                                size: '85.3MB',
                                downloadable: true,
                                deletable: true,
                                action: '분석 중'
                            },
                            {
                                label: 'sentinel-2_baekdusan_002',
                                type: 'file',
                                tag: 'TIF',
                                size: '87.1MB',
                                downloadable: true,
                                deletable: true,
                                action: '분석 완료',
                                selected: true
                            }
                        ]
                    },
                    {
                        label: '울릉도',
                        type: 'folder',
                        expanded: false,
                        children: [
                            {
                                label: 'sentinel-2_ulleungdo_001',
                                type: 'file',
                                tag: 'TIF',
                                size: '78.9MB',
                                downloadable: true,
                                deletable: true
                            }
                        ]
                    }
                ]
            },
            {
                label: 'ALOS-2',
                type: 'folder',
                expanded: true,
                children: [
                    {
                        label: '백두산',
                        type: 'folder',
                        expanded: true,
                        children: [
                            {
                                label: 'alos-2_baekdusan_002',
                                type: 'file',
                                tag: 'TIF',
                                size: '92.5MB',
                                downloadable: true,
                                deletable: true,
                                action: '실패'
                            }
                        ]
                    }
                ]
            }
        ]
    };

    const container = document.getElementById('preprocessing-tree');
    if (container && TreeView) {
        new TreeView(container, treeData, {
            onNodeClick: (node) => {
                console.log('Node clicked:', node);
            },
            onDownloadClick: (node) => {
                console.log('Download:', node);
            },
            onDeleteClick: (node) => {
                console.log('Delete:', node);
            }
        });
    }
});
