import { initWorkspace, switchWorkspace, workspaceState } from '@/stores/workspace';
import { AliwangwangOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, Divider, Flex, Select } from 'antd';
import React, { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import styles from '../../../pages/home/styles.less';

interface WorkspaceSelectProps {
  className?: string;
}

const WorkspaceSelect: React.FC<WorkspaceSelectProps> = ({ className }) => {
  const { workspaces, currentWorkspace, loading } = useSnapshot(workspaceState);

  useEffect(() => {
    initWorkspace();
  }, []);

  const handleWorkspaceChange = (workspaceId: string) => {
    const workspace = workspaces.find((w) => w.id === workspaceId);
    if (workspace) {
      switchWorkspace(workspace);
    }
  };

  // 确保options中包含当前选中的工作空间，即使在数据加载期间
  const selectOptions = React.useMemo(() => {
    const options = workspaces.map((workspace) => ({
      value: workspace.id,
      label: (
        <Flex gap={4}>
          <AliwangwangOutlined />
          {workspace.name}
        </Flex>
      ),
    }));

    // 如果当前工作空间存在但不在options中（数据加载期间），添加它
    if (currentWorkspace && !workspaces.find((w) => w.id === currentWorkspace.id)) {
      options.unshift({
        value: currentWorkspace.id,
        label: (
          <Flex gap={4}>
            <AliwangwangOutlined />
            {currentWorkspace.name}
          </Flex>
        ),
      });
    }

    return options;
  }, [workspaces, currentWorkspace]);

  return (
    <Select
      size="small"
      value={currentWorkspace?.id}
      loading={loading}
      popupMatchSelectWidth={200}
      className={`${styles.workspace} ${className || ''}`}
      onChange={handleWorkspaceChange}
      popupRender={(menu) => (
        <Flex vertical>
          {menu}
          <Divider style={{ margin: '8px 0' }} />
          <Button type="text" icon={<HomeOutlined />}>
            工作空间管理
          </Button>
        </Flex>
      )}
      options={selectOptions}
      placeholder="请选择工作空间"
    />
  );
};

export default WorkspaceSelect;
