import Header from '@/layouts/components/header';
import { Flex } from 'antd';
import { useState } from 'react';
import styles from './styles.less';

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState<string>('app');

  return (
    <Flex vertical gap={10} justify="space-between" align="center" className={styles.homeContainer}>
      <Header currentPage={currentPage} onPageChange={(value) => setCurrentPage(value)} />
      <iframe src={currentPage === 'app' ? '/flow' : '/knowledge'} className={styles.contentIframe} />
    </Flex>
  );
}
