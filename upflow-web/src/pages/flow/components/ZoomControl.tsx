import {memo, useEffect, useState, useCallback, useMemo} from "react";
import {Panel, useReactFlow, useKeyPress} from "@xyflow/react";
import {
    FullscreenOutlined,
    ZoomInOutlined,
    ZoomOutOutlined
} from "@ant-design/icons";

import {Button, Dropdown, MenuProps, Space} from "antd";

const items: MenuProps['items'] = [
    {
        key: '2',
        label: '200%',
        extra: '⌘ 2',
    }, {
        key: '1',
        label: '100%',
        extra: '⌘ 1',
    }, {
        key: '0.75',
        label: '75%',
    }, {
        key: '0.5',
        label: '50%',
        extra: '⌘ 5',
    }
];

interface ZoomControlProps {
    currentZoom?: number;
}

export default memo(({currentZoom}: ZoomControlProps) => {

    const {zoomIn, zoomOut, fitView, getZoom, zoomTo} = useReactFlow();
    const [zoom, setZoom] = useState(1);

    // 使用传入的 currentZoom 或者获取当前缩放值
    useEffect(() => {
        if (currentZoom !== undefined) {
            setZoom(currentZoom);
        } else {
            setZoom(getZoom());
        }
    }, [currentZoom, getZoom]);

    // 处理菜单点击事件
    const handleMenuClick: MenuProps['onClick'] = useCallback(({key}: { key: string }) => {
        const zoomLevel = parseFloat(key);
        zoomTo(zoomLevel, {duration: 200});
        // 使用setTimeout确保zoomTo操作完成后再更新状态
        setTimeout(() => {
            setZoom(getZoom());
        }, 250);
    }, [zoomTo, getZoom]);

    // 键盘快捷键处理 - 修复性能问题
    const cmd1Pressed = useKeyPress(['Meta+1', 'Ctrl+1']);
    const cmd2Pressed = useKeyPress(['Meta+2', 'Ctrl+2']);
    const cmd5Pressed = useKeyPress(['Meta+5', 'Ctrl+5']);

    // 优化的更新缩放状态函数
    const updateZoomState = useCallback(() => {
        setTimeout(() => setZoom(getZoom()), 250);
    }, [getZoom]);

    // 键盘快捷键映射表
    const keyboardActions = useMemo(() => [
        {pressed: cmd1Pressed, action: () => zoomTo(1, {duration: 200})},
        {pressed: cmd2Pressed, action: () => zoomTo(2, {duration: 200})},
        {pressed: cmd5Pressed, action: () => zoomTo(0.5, {duration: 200})},
    ], [cmd1Pressed, cmd2Pressed, cmd5Pressed, zoomTo, fitView, zoomIn, zoomOut]);

    // 处理键盘快捷键 - 优雅的实现
    useEffect(() => {
        const activeAction = keyboardActions.find(({pressed}) => pressed);
        if (activeAction) {
            activeAction.action();
            updateZoomState();
        }
    }, [keyboardActions, updateZoomState]);


    // 优化的按钮点击事件处理函数
    const onZoomIn = useCallback(() => {
        zoomIn({duration: 200, interpolate: 'smooth'});
        // 使用setTimeout确保zoomIn操作完成后再更新状态
        setTimeout(() => setZoom(getZoom()), 250);
    }, [zoomIn, getZoom]);

    const onZoomOut = useCallback(() => {
        zoomOut({duration: 200, interpolate: 'smooth'});
        // 使用setTimeout确保zoomOut操作完成后再更新状态
        setTimeout(() => setZoom(getZoom()), 250);
    }, [zoomOut, getZoom]);

    const onFitView = useCallback(() => {
        fitView({duration: 200, interpolate: 'smooth'});
        // 使用setTimeout确保fitView操作完成后再更新状态
        setTimeout(() => setZoom(getZoom()), 250);
    }, [fitView, getZoom]);

    // 优化的样式对象
    const panelStyle = useMemo(() => ({
        backgroundColor: "white",
        borderRadius: "8px"
    }), []);

    const spanStyle = useMemo(() => ({
        cursor: "pointer"
    }), []);

    return (
        <Panel position="bottom-left">
            <Space direction="horizontal" size={3} style={panelStyle}>
                <Button type={"text"} icon={<ZoomInOutlined/>} onClick={onZoomIn}/>
                <Dropdown menu={{items, onClick: handleMenuClick}}>
                    <span style={spanStyle}>{(zoom * 100).toFixed(0) + "%"}</span>
                </Dropdown>
                <Button type={"text"} icon={<ZoomOutOutlined/>} onClick={onZoomOut}/>
                <Button type={"text"} icon={<FullscreenOutlined/>} onClick={onFitView}/>
            </Space>
        </Panel>)
});