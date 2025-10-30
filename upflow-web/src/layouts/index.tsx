import { Outlet, useLocation, useNavigate } from 'umi';
import styles from './index.less';
import Header from '@/layouts/components/header';
import { Flex } from 'antd';
import { useEffect, useState, useMemo } from 'react';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<string>('app');

  // 获取URL查询参数中的layout值
  const showLayout = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const layoutParam = searchParams.get('layout');
    
    // 如果没有layout参数，默认显示header
    if (layoutParam === null) {
      return true;
    }
    
    // layout=false时不显示header，其他情况都显示
    return layoutParam !== 'false';
  }, [location.search]);

  // 根据当前路由设置页面状态
  useEffect(() => {
    const pathname = location.pathname;
    if (pathname === '/' || pathname === '/app') {
      setCurrentPage('app');
    } else if (pathname === '/knowledge') {
      setCurrentPage('knowledge');
    }
  }, [location.pathname]);

  // 处理页面切换
  const handlePageChange = (value: string) => {
    setCurrentPage(value);
    if (value === 'app') {
      navigate('/');
    } else if (value === 'knowledge') {
      navigate('/knowledge');
    }
  };

  return (
    <Flex vertical gap={10} justify="space-between" align="center" className={styles.homeContainer}>
      {showLayout && <Header currentPage={currentPage} onPageChange={handlePageChange} />}
      <div style={{ width: '100%' }}>
        <Outlet />
      </div>
    </Flex>
  );
}
