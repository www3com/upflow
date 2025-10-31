import styles from '@/layouts/styles.less';
import { initWorkspace, switchWorkspace, workspaceState } from '@/stores/layout/workspace';
import { AliwangwangOutlined, HomeOutlined } from '@ant-design/icons';
import { Button, Divider, Flex, Select } from 'antd';
import React, { FC, useEffect } from 'react';
import { useSnapshot } from 'valtio';

interface WorkspaceSelectProps {}

const WorkspaceSelect: FC<WorkspaceSelectProps> = () => {
  const { asyncWorkspaces, currWorkspace } = useSnapshot(workspaceState);

  useEffect(() => {
    initWorkspace();
  }, []);

  const handleWorkspaceChange = (workspaceId: string) => {
    const workspace = asyncWorkspaces.data?.find((w) => w.id === workspaceId);
    if (workspace) {
      switchWorkspace(workspace);
    }
  };

  // 确保options中包含当前选中的工作空间，即使在数据加载期间
  const selectOptions = React.useMemo(() => {
    const options = asyncWorkspaces.data?.map((workspace) => ({
      value: workspace.id,
      label: (
        <Flex gap={4}>
          <AliwangwangOutlined />
          {workspace.name}
        </Flex>
      ),
    }));

    // 如果当前工作空间存在但不在options中（数据加载期间），添加它
    if (currWorkspace && !asyncWorkspaces.data?.find((w) => w.id === currWorkspace.id)) {
      options?.unshift({
        value: currWorkspace.id,
        label: (
          <Flex gap={4}>
            <AliwangwangOutlined />
            {currWorkspace.name}
          </Flex>
        ),
      });
    }

    return options;
  }, [asyncWorkspaces, currWorkspace]);

  return (
    <Select
      size="small"
      value={currWorkspace?.id}
      loading={asyncWorkspaces.loading}
      popupMatchSelectWidth={200}
      className={styles.workspace}
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
