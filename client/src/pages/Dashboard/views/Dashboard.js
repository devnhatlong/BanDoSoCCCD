import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AppstoreOutlined, DesktopOutlined, EnvironmentOutlined, BarChartOutlined } from '@ant-design/icons';
import { Menu, Layout } from 'antd';
import { useSelector } from 'react-redux';

import '../styles/style.css';
import { NavbarLoginComponent } from "../../../components/NavbarLoginComponent/NavbarLoginComponent";
import { getItem } from "../../../utils/utils";
import { AdminCommune } from "../../Admin/AdminCommune/views/AdminCommune";
import { ProvinceMap } from "../../Overview/ProvinceMap/views/ProvinceMap";
import { PATHS } from '../../../constants/path';

const { Sider, Content } = Layout;

export const Dashboard = () => {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();
    const location = useLocation();

    // State for collapsed and openKeys
    const [collapsed, setCollapsed] = useState(() => {
        const savedCollapsed = localStorage.getItem('menuCollapsed');
        return savedCollapsed === 'true';
    });
    const [openKeys, setOpenKeys] = useState([]);

    // Menu styles
    const menuItemStyle = {
        whiteSpace: 'normal',
        lineHeight: 'normal',
        fontSize: "14px",
        fontWeight: "400",
        margin: "8px 0",
    };

    const menuChildrenItemStyle = {
        display: "flex",
        alignItems: "center",
        fontSize: "14px",
        fontWeight: "400",
        paddingLeft: "48px",
    };

    // Menu items
    const items = [
        {
            key: 'overview',
            label: 'Tổng quan',
            icon: <AppstoreOutlined />,
            style: menuItemStyle,
            children: [
                getItem('Bản đồ tỉnh', PATHS.OVERVIEW.MAP, null, null, menuChildrenItemStyle),
                getItem('Dashboard tổng quan', PATHS.OVERVIEW.DASHBOARD, null, null, menuChildrenItemStyle),
                getItem('Phân tích dữ liệu', PATHS.OVERVIEW.ANALYSIS, null, null, menuChildrenItemStyle),
            ]
        },
        {
            key: 'monitor',
            label: 'Giám sát',
            icon: <DesktopOutlined />,
            style: menuItemStyle,
            children: [
                getItem('Dữ liệu thời gian thực', PATHS.MONITOR.REALTIME, null, null, menuChildrenItemStyle),
                getItem('Theo dõi chiến dịch', PATHS.MONITOR.CAMPAIGN, null, null, menuChildrenItemStyle),
                getItem('Chi tiết chiến dịch', PATHS.MONITOR.CAMPAIGN_DETAIL, null, null, menuChildrenItemStyle),
            ]
        },
        {
            key: 'administrative',
            label: 'Đơn vị hành chính',
            icon: <EnvironmentOutlined />,
            style: menuItemStyle,
            children: [
                getItem('Cấp xã/phường', PATHS.ADMINISTRATIVE.COMMUNE, null, null, menuChildrenItemStyle),
                getItem('Tổng quan xã/phường', PATHS.ADMINISTRATIVE.COMMUNE_OVERVIEW, null, null, menuChildrenItemStyle),
            ]
        },
        {
            key: 'report',
            label: 'Báo cáo & Xếp hạng',
            icon: <BarChartOutlined />,
            style: menuItemStyle,
            children: [
                getItem('Xếp hạng & So sánh', PATHS.REPORT.RANKING, null, null, menuChildrenItemStyle),
                getItem('Bảng xếp hạng', PATHS.REPORT.LEADERBOARD, null, null, menuChildrenItemStyle),
                getItem('Báo cáo lịch sử', PATHS.REPORT.HISTORY, null, null, menuChildrenItemStyle),
                getItem('Biểu đồ phân tích', PATHS.REPORT.CHART, null, null, menuChildrenItemStyle),
            ]
        },
    ].filter(Boolean);

    // Handle menu click
    const handleOnClick = ({ key }) => {
        navigate(key);
    };

    // Handle open keys
    const onOpenChange = (keys) => {
        const latestOpenKey = keys.find(key => !openKeys.includes(key));
        setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    };

    // Handle collapse toggle
    const toggleCollapsed = () => {
        const newCollapsed = !collapsed;
        setCollapsed(newCollapsed);
        localStorage.setItem('menuCollapsed', newCollapsed);
    };

    // Sync openKeys with URL
    useEffect(() => {
        const pathToKeyMap = {
            [PATHS.OVERVIEW.MAP]: 'overview',
            [PATHS.OVERVIEW.DASHBOARD]: 'overview',
            [PATHS.OVERVIEW.ANALYSIS]: 'overview',
            [PATHS.MONITOR.REALTIME]: 'monitor',
            [PATHS.MONITOR.CAMPAIGN]: 'monitor',
            [PATHS.MONITOR.CAMPAIGN_DETAIL]: 'monitor',
            [PATHS.ADMINISTRATIVE.DISTRICT]: 'administrative',
            [PATHS.ADMINISTRATIVE.COMMUNE]: 'administrative',
            [PATHS.ADMINISTRATIVE.COMMUNE_OVERVIEW]: 'administrative',
            [PATHS.REPORT.RANKING]: 'report',
            [PATHS.REPORT.LEADERBOARD]: 'report',
            [PATHS.REPORT.HISTORY]: 'report',
            [PATHS.REPORT.CHART]: 'report',
        };

        const currentPath = location.pathname;
        const openKey = pathToKeyMap[currentPath];
        if (!collapsed && openKey) {
            setOpenKeys([openKey]);
        }
    }, [location, collapsed]);

    // Handle responsive behavior
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setCollapsed(true);
            } else {
                setCollapsed(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <NavbarLoginComponent />
            <Layout style={{ marginTop: "40px" }}>
                <Sider
                    collapsible
                    collapsed={collapsed}
                    onCollapse={toggleCollapsed}
                    width={300}
                    style={{
                        background: '#fff',
                        boxShadow: '2px 0 8px 0 rgba(29, 35, 41, 0.05)',
                        height: '100vh',
                        position: 'fixed',
                        left: 0,
                        overflowY: 'auto',
                    }}
                >
                    <Menu
                        mode="inline"
                        style={{ borderRight: 0 }}
                        items={items}
                        onClick={handleOnClick}
                        openKeys={openKeys}
                        onOpenChange={onOpenChange}
                        selectedKeys={[location.pathname]}
                        defaultSelectedKeys={[location.pathname]}
                    />
                </Sider>
                <Content
                    style={{
                        transition: 'margin-left 0.6s ease-in-out',
                        marginTop: 0,
                        marginRight: 12,
                        marginBottom: 0,
                        marginLeft: collapsed ? 90 : 310,
                        padding: 18,
                        background: '#fff',
                        minHeight: '280px',
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                        borderRadius: '8px',
                    }}
                >
                    <Routes>
                        {/* Tổng quan */}
                        <Route path={PATHS.OVERVIEW.MAP} element={<ProvinceMap />} />
                        <Route path={PATHS.OVERVIEW.DASHBOARD} element={<div>Dashboard tổng quan</div>} />
                        <Route path={PATHS.OVERVIEW.ANALYSIS} element={<div>Phân tích dữ liệu</div>} />
                        
                        {/* Giám sát */}
                        <Route path={PATHS.MONITOR.REALTIME} element={<div>Dữ liệu thời gian thực</div>} />
                        <Route path={PATHS.MONITOR.CAMPAIGN} element={<div>Theo dõi chiến dịch</div>} />
                        <Route path={PATHS.MONITOR.CAMPAIGN_DETAIL} element={<div>Chi tiết chiến dịch</div>} />
                        
                        {/* Đơn vị hành chính */}
                        <Route path={PATHS.ADMINISTRATIVE.DISTRICT} element={<div>Cấp huyện</div>} />
                        <Route path={PATHS.ADMINISTRATIVE.COMMUNE} element={<AdminCommune />} />
                        <Route path={PATHS.ADMINISTRATIVE.COMMUNE_OVERVIEW} element={<div>Tổng quan xã/phường</div>} />
                        
                        {/* Báo cáo & Xếp hạng */}
                        <Route path={PATHS.REPORT.RANKING} element={<div>Xếp hạng & So sánh</div>} />
                        <Route path={PATHS.REPORT.LEADERBOARD} element={<div>Bảng xếp hạng</div>} />
                        <Route path={PATHS.REPORT.HISTORY} element={<div>Báo cáo lịch sử</div>} />
                        <Route path={PATHS.REPORT.CHART} element={<div>Biểu đồ phân tích</div>} />
                        
                        <Route
                            path="*"
                            element={(
                                <div style={{ padding: '24px', background: '#fff', minHeight: '280px' }}>
                                    <h1>Bản đồ số CCCD-VNeID Lâm Đồng</h1>
                                    <p>Sản phẩm của Đội Công nghệ thông tin - Phòng Tham mưu - Lâm Đồng.</p>
                                    <p>Vui lòng chọn một tùy chọn từ menu để bắt đầu.</p>
                                </div>
                            )}
                        />
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
};