import { createFlowFolder, deleteFlowFolder, listFlowFolders, renameFlowFolder } from '@/api/flow';
import FolderContextMenu from '@/pages/flow/components/folder-context-menu';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Input, message, Modal, Tree, TreeDataNode } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './styles.less';

const { DirectoryTree } = Tree;

// 将后端返回的目录结构转换为 Antd TreeDataNode
const toTreeData = (nodes: any[]): TreeDataNode[] => {
  if (!nodes) return [];
  return nodes.map((n: any) => ({
    title: n.name,
    key: n.id,
    children: toTreeData(n.children || []),
  }));
};

const FolderTree: React.FC = () => {
  const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]); // 默认展开根节点，数据加载后设置
  const [editingKey, setEditingKey] = useState<React.Key | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const [creatingParentKey, setCreatingParentKey] = useState<React.Key | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    position: { x: number; y: number };
    nodeKey?: React.Key;
  }>({ visible: false, position: { x: 0, y: 0 }, nodeKey: undefined });

  useEffect(() => {
    const loadFolders = async () => {
      try {
        const res = await listFlowFolders();
        const data = toTreeData(res.data || []);
        setTreeData(data);
        // 默认展开所有根节点
        setExpandedKeys(data.map((n) => n.key as React.Key));
      } catch (e) {
        // 错误提示在请求拦截器中已处理，这里保持静默
      }
    };
    loadFolders();
  }, []);

  const handleRightClick = useCallback((info: { event: React.MouseEvent; node: any }) => {
    info.event.preventDefault();
    const key = info?.node?.key as React.Key;
    if (key) {
      setSelectedKeys([key]);
    }
    setContextMenu({ visible: true, position: { x: info.event.clientX, y: info.event.clientY }, nodeKey: key });
  }, []);

  // 获取指定 key 的标题文本
  const getTitleByKey = useCallback((nodes: TreeDataNode[], key: React.Key): string | undefined => {
    for (const n of nodes) {
      if (n.key === key) {
        return typeof n.title === 'string' ? n.title : undefined;
      }
      if (n.children && n.children.length) {
        const t = getTitleByKey(n.children as TreeDataNode[], key);
        if (t !== undefined) return t;
      }
    }
    return undefined;
  }, []);

  // 更新指定 key 的标题
  const updateTitleByKey = useCallback((nodes: TreeDataNode[], key: React.Key, title: string): TreeDataNode[] => {
    return nodes.map((n) => {
      if (n.key === key) {
        return { ...n, title };
      }
      const children = n.children ? updateTitleByKey(n.children as TreeDataNode[], key, title) : undefined;
      return { ...n, children };
    });
  }, []);

  // 在指定父节点下新增子节点
  const insertChildUnderKey = useCallback((nodes: TreeDataNode[], parentKey: React.Key, child: TreeDataNode): TreeDataNode[] => {
    return nodes.map((n) => {
      if (n.key === parentKey) {
        const children = Array.isArray(n.children) ? (n.children as TreeDataNode[]) : [];
        return { ...n, children: [...children, child] };
      }
      const children = n.children ? insertChildUnderKey(n.children as TreeDataNode[], parentKey, child) : undefined;
      return { ...n, children };
    });
  }, []);

  // 删除指定 key 的节点
  const removeNodeByKey = useCallback((nodes: TreeDataNode[], key: React.Key): TreeDataNode[] => {
    return nodes
      .map((n) => {
        const children = n.children ? removeNodeByKey(n.children as TreeDataNode[], key) : undefined;
        return { ...n, children };
      })
      .filter((n) => n.key !== key);
  }, []);

  // 更新指定节点的 key 与标题
  const updateNodeKeyAndTitle = useCallback(
    (nodes: TreeDataNode[], oldKey: React.Key, newKey: React.Key, title: string): TreeDataNode[] => {
      return nodes.map((n) => {
        if (n.key === oldKey) {
          return { ...n, key: newKey, title };
        }
        const children = n.children ? updateNodeKeyAndTitle(n.children as TreeDataNode[], oldKey, newKey, title) : undefined;
        return { ...n, children };
      });
    },
    [],
  );

  // 应用编辑态的标题（在渲染时替换）
  const renderTreeData = useMemo(() => {
    const applyEditableTitle = (nodes: TreeDataNode[]): TreeDataNode[] => {
      return nodes.map((n) => {
        const isEditing = editingKey !== null && n.key === editingKey;
        const titleNode = isEditing ? (
          <Input
            size="small"
            autoFocus
            value={editingValue}
            onChange={(e) => setEditingValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (creatingParentKey) {
                  handleConfirmCreate();
                } else {
                  handleConfirmRename();
                }
              } else if (e.key === 'Escape') {
                handleCancelEdit();
              }
            }}
            onBlur={handleCancelEdit}
            style={{
              display: 'inline-block',
              verticalAlign: 'middle',
              height: 22,
              lineHeight: '22px',
              paddingInline: 6,
            }}
          />
        ) : (
          n.title
        );
        const children = n.children ? applyEditableTitle(n.children as TreeDataNode[]) : undefined;
        // 编辑态不改变图标与文字，仅通过选中态背景色提示
        return { ...n, title: titleNode, children, className: isEditing ? styles.editingNode : undefined };
      });
    };
    return applyEditableTitle(treeData);
  }, [treeData, editingKey, editingValue]);

  const handleStartRename = useCallback(
    (key?: React.Key) => {
      if (!key) return;
      const title = getTitleByKey(treeData, key) ?? '';
      setEditingKey(key);
      setEditingValue(title);
    },
    [treeData, getTitleByKey],
  );

  const handleConfirmRename = useCallback(async () => {
    if (!editingKey) return;
    const newName = editingValue.trim();
    if (!newName) {
      message.warning('名称不能为空');
      return;
    }
    try {
      await renameFlowFolder(String(editingKey), newName);
      setTreeData((prev) => updateTitleByKey(prev, editingKey, newName));
      setEditingKey(null);
      message.success('重命名成功');
    } catch (e) {
      // 错误提示由请求拦截器处理，这里兜底提示
      message.error('重命名失败');
    }
  }, [editingKey, editingValue, updateTitleByKey]);

  const handleStartCreate = useCallback(
    (parentKey?: React.Key) => {
      const tempKey = `__new__-${Date.now()}`;
      // 新建占位节点
      const child: TreeDataNode = {
        key: tempKey,
        title: '',
      };

      if (!parentKey) {
        // 参数为空时，在第一级目录（根级）最后插入
        setTreeData((prev) => [...prev, child]);
        setCreatingParentKey(null);
      } else {
        // 在指定父节点下插入
        setTreeData((prev) => insertChildUnderKey(prev, parentKey, child));
        setCreatingParentKey(parentKey);
        // 展开父节点以显示输入框
        setExpandedKeys((prev) => (prev.includes(parentKey) ? prev : [...prev, parentKey]));
      }

      setEditingKey(tempKey);
      setEditingValue('');
    },
    [insertChildUnderKey],
  );

  const handleConfirmCreate = useCallback(async () => {
    if (!editingKey) return;
    const newName = editingValue.trim();
    if (!newName) {
      message.warning('名称不能为空');
      return;
    }
    try {
      const res = await createFlowFolder(creatingParentKey ? String(creatingParentKey) : undefined, newName);
      const newId = res?.data?.id ?? `folder-${Date.now()}`;
      setTreeData((prev) => updateNodeKeyAndTitle(prev, editingKey, newId, newName));
      setEditingKey(null);
      setCreatingParentKey(null);
      message.success('创建成功');
    } catch (e) {
      message.error('创建失败');
    }
  }, [editingKey, editingValue, creatingParentKey, updateNodeKeyAndTitle]);

  const handleCancelEdit = useCallback(() => {
    if (creatingParentKey && editingKey) {
      // 取消新建时移除占位节点
      setTreeData((prev) => removeNodeByKey(prev, editingKey));
      setCreatingParentKey(null);
    }
    setEditingKey(null);
  }, [creatingParentKey, editingKey, removeNodeByKey]);

  const handleDelete = useCallback(
    (key?: React.Key) => {
      if (!key) return;
      Modal.confirm({
        title: '确认删除',
        content: '确定要删除该文件夹及其子项吗？此操作不可恢复。',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk: async () => {
          try {
            await deleteFlowFolder(String(key));
            setTreeData((prev) => removeNodeByKey(prev, key));
            setSelectedKeys((prev) => prev.filter((k) => k !== key));
            setExpandedKeys((prev) => prev.filter((k) => k !== key));
            message.success('删除成功');
          } catch (e) {
            message.error('删除失败');
          }
        },
      });
    },
    [removeNodeByKey],
  );
  return (
    <>
      <Card
        title="资源管理器"
        size="small"
        extra={<Button type="text" icon={<PlusOutlined />} onClick={() => handleStartCreate()} />}
      >
        <DirectoryTree
          treeData={renderTreeData}
          selectedKeys={selectedKeys}
          expandedKeys={expandedKeys}
          onSelect={setSelectedKeys}
          onExpand={setExpandedKeys}
          onRightClick={handleRightClick}
          className={styles.folderTree}
        />
      </Card>

      <FolderContextMenu
        visible={contextMenu.visible}
        position={contextMenu.position}
        nodeKey={contextMenu.nodeKey}
        onClose={() => setContextMenu((prev) => ({ ...prev, visible: false }))}
        onMenuClick={(key) => {
          if (key === 'rename') {
            handleStartRename(contextMenu.nodeKey);
          } else if (key === 'new-folder') {
            handleStartCreate(contextMenu.nodeKey);
          } else if (key === 'delete') {
            handleDelete(contextMenu.nodeKey);
          }
        }}
      />
    </>
  );
};

export default FolderTree;
