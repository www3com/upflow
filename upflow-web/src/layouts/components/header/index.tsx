import IconFont from '@/components/icon-font';
import WorkspaceSelect from '@/layouts/components/workspace-select';
import { AppstoreOutlined, WalletOutlined } from '@ant-design/icons';
import { Avatar, Divider, Flex, Segmented } from 'antd';
import React from 'react';
import styles from '../../../pages/home/styles.less';

interface HeaderProps {
  currentPage: string;
  onPageChange: (value: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange }) => {
  return (
    <Flex justify="space-between" align="center" className={styles.header}>
      <Flex align="center" gap={5} className={styles.logoArea}>
        <IconFont type="icon-agent" className={styles.logoIcon} />
        <span>知识罗盘</span>
      </Flex>

      <Segmented<string>
        block
        size="large"
        className={styles.segmented}
        shape={'round'}
        value={currentPage}
        options={[
          { label: '工坊', value: 'app', icon: <AppstoreOutlined /> },
          { label: '知识库', value: 'knowledge', icon: <WalletOutlined /> },
        ]}
        onChange={onPageChange}
      />
      <Flex className={styles.userArea} justify="end" align="center">
        <WorkspaceSelect />
        <Divider type="vertical" />
        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
        <span>Jason</span>
      </Flex>
    </Flex>
  );
};

export default Header;
