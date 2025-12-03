import React, { useState, useRef } from 'react';
import { Card, Row, Col, Tag, Button, Space } from 'antd';
import { 
    IdcardOutlined, 
    UserSwitchOutlined, 
    CheckCircleOutlined, 
    ClockCircleOutlined,
    ReloadOutlined,
    ExpandOutlined,
    ZoomInOutlined,
    ZoomOutOutlined,
    BarChartOutlined,
    AimOutlined,
    TrophyOutlined,
    EnvironmentOutlined
} from '@ant-design/icons';
import { MapContainer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FooterComponent } from '../../../../components/FooterComponent/FooterComponent';
import mapData from '../../../../map.json';
import './style.css';

export const ProvinceMap = () => {
    const [hoveredCommune, setHoveredCommune] = useState(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [selectedCommune, setSelectedCommune] = useState(null);
    const [currentZoom, setCurrentZoom] = useState(8);
    const geoJsonRef = useRef();
    const mapRef = useRef();
    
    // Tạo dữ liệu màu cố định cho mỗi xã (chỉ chạy 1 lần)
    const [communeValues] = useState(() => {
        const values = {};
        mapData.features.forEach((feature) => {
            const communeName = feature.properties?.ten_xa || feature.properties?.name;
            if (communeName) {
                values[communeName] = Math.random() * 100; // Tạo giá trị ngẫu nhiên 1 lần duy nhất
            }
        });
        return values;
    });

    // Dữ liệu thống kê
    const statistics = [
        {
            title: 'Tổng số CCCD đã cấp',
            value: '3.9M',
            icon: <IdcardOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
            trend: '+2%',
            trendUp: true,
            bgColor: '#f6ffed',
            borderColor: '#b7eb8f'
        },
        {
            title: 'Tỷ lệ công dân 14+ có TKĐD',
            value: '97.0%',
            icon: <UserSwitchOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
            trend: '+1%',
            trendUp: true,
            bgColor: '#e6f7ff',
            borderColor: '#91d5ff'
        },
        {
            title: 'Tỷ lệ kích hoạt VNeID (Mức 2)',
            value: '77.9%',
            icon: <CheckCircleOutlined style={{ fontSize: '24px', color: '#faad14' }} />,
            trend: '+3%',
            trendUp: true,
            bgColor: '#fffbe6',
            borderColor: '#ffe58f'
        },
        {
            title: 'Lượt sử dụng CCCD thay BHYT',
            value: '1.3M',
            icon: <ClockCircleOutlined style={{ fontSize: '24px', color: '#13c2c2' }} />,
            trend: '+12%',
            trendUp: true,
            bgColor: '#e6fffb',
            borderColor: '#87e8de'
        }
    ];

    // Danh sách khu vực điểm nóng
    const hotspots = [
        {
            name: 'Phường 1 Bảo Lộc',
            issue: 'Tỷ lệ kích hoạt VNeID',
            rate: '58.3%',
            status: 'danger',
            action: 'Cấp cao'
        },
        {
            name: 'Xã Bảo Lâm 3',
            issue: 'Phủ sóng CCCD',
            rate: '60.9%',
            status: 'danger',
            action: 'Cấp cao'
        },
        {
            name: 'Đặc khu Phú Quý',
            issue: 'Lượt thông báo xác thực',
            rate: '87.1%',
            status: 'warning',
            action: 'Cấp trung'
        },
        {
            name: 'Phường Phan Thiết',
            issue: 'Tỷ lệ kích hoạt ứng thể',
            rate: '65.5%',
            status: 'danger',
            action: 'Cấp cao'
        }
    ];

    // Chú thích bản đồ
    const mapLegend = [
        { label: 'Xuất sắc', range: '≥ 95%', color: '#52c41a' },
        { label: 'Tốt', range: '85% - 94.9%', color: '#95de64' },
        { label: 'Trung bình', range: '70% - 84.9%', color: '#faad14' },
        { label: 'Yếu', range: '< 70%', color: '#ff4d4f' }
    ];

    // Component để theo dõi zoom level
    const ZoomTracker = () => {
        const map = useMap();
        
        React.useEffect(() => {
            const handleZoom = () => {
                setCurrentZoom(map.getZoom());
            };
            
            map.on('zoomend', handleZoom);
            
            return () => {
                map.off('zoomend', handleZoom);
            };
        }, [map]);

        return null;
    };

    // Component hiển thị tên xã
    const CommuneLabels = () => {
        const map = useMap();

        React.useEffect(() => {
            if (currentZoom >= 9) {
                mapData.features.forEach((feature) => {
                    const communeName = feature.properties?.ten_xa || feature.properties?.name;
                    if (communeName && feature.geometry && feature.geometry.coordinates) {
                        // Tính toán vị trí trung tâm của polygon
                        let centerLat = 0;
                        let centerLng = 0;
                        let pointCount = 0;

                        const processCoordinates = (coords) => {
                            coords.forEach((coord) => {
                                if (Array.isArray(coord[0])) {
                                    processCoordinates(coord);
                                } else {
                                    centerLng += coord[0];
                                    centerLat += coord[1];
                                    pointCount++;
                                }
                            });
                        };

                        processCoordinates(feature.geometry.coordinates);

                        if (pointCount > 0) {
                            centerLat /= pointCount;
                            centerLng /= pointCount;

                            // Tạo div marker cho tên xã
                            const label = window.L.divIcon({
                                className: 'commune-label',
                                html: `<div style="
                                    font-size: 11px;
                                    font-weight: 600;
                                    color: #fff;
                                    text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
                                    white-space: nowrap;
                                    pointer-events: none;
                                    text-align: center;
                                ">${communeName}</div>`,
                                iconSize: null
                            });

                            window.L.marker([centerLat, centerLng], { 
                                icon: label,
                                interactive: false 
                            }).addTo(map);
                        }
                    }
                });
            }

            // Cleanup - xóa tất cả labels khi zoom out
            return () => {
                map.eachLayer((layer) => {
                    if (layer instanceof window.L.Marker && layer.options.interactive === false) {
                        map.removeLayer(layer);
                    }
                });
            };
        }, [map, currentZoom]);

        return null;
    };

    // Xử lý di chuột
    const handleMouseMove = (e) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Hàm lấy màu theo giá trị
    const getColorByValue = (value) => {
        if (value >= 95) return '#52c41a'; // Xuất sắc
        if (value >= 85) return '#95de64'; // Tốt
        if (value >= 70) return '#faad14'; // Trung bình
        return '#ff4d4f'; // Yếu
    };

    // Style cho từng layer
    const getLayerStyle = (feature) => {
        const isSelected = selectedCommune?.properties?.ten_xa === feature.properties?.ten_xa;
        const communeName = feature.properties?.ten_xa || feature.properties?.name;
        // Lấy giá trị cố định từ state
        const value = communeValues[communeName] || 0;
        const fillColor = getColorByValue(value);

        return {
            fillColor: isSelected ? '#1890ff' : fillColor,
            weight: isSelected ? 3 : 1,
            opacity: 1,
            color: '#fff',
            fillOpacity: isSelected ? 0.8 : 0.6
        };
    };

    // Xử lý sự kiện cho từng feature
    const onEachFeature = (feature, layer) => {
        layer.on({
            mouseover: (e) => {
                const communeName = feature.properties?.ten_xa || 'Unknown';
                setHoveredCommune(communeName);

                e.target.setStyle({
                    fillOpacity: 0.9,
                    weight: 3
                });
            },
            mouseout: (e) => {
                setHoveredCommune(null);
                geoJsonRef.current?.resetStyle(e.target);
            },
            click: (e) => {
                const communeName = feature.properties?.ten_xa || 'Unknown';
                setSelectedCommune(feature);
                console.log('Clicked commune:', communeName);
            }
        });
    };

    const handleZoomIn = () => {
        if (mapRef.current) {
            mapRef.current.zoomIn();
        }
    };

    const handleZoomOut = () => {
        if (mapRef.current) {
            mapRef.current.zoomOut();
        }
    };

    const handleResetZoom = () => {
        if (mapRef.current) {
            mapRef.current.setView([11.9, 108], 8);
        }
    };

    return (
        <div 
            style={{ background: '#f0f2f5', minHeight: 'calc(100vh - 64px)', paddingBottom: '20px' }}
            onMouseMove={handleMouseMove}
        >
            {/* Tooltip hiển thị tên xã */}
            {hoveredCommune && (
                <div style={{
                    position: 'fixed',
                    top: mousePosition.y - 40,
                    left: mousePosition.x + 15,
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    color: '#00ffffcc',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    zIndex: 1001,
                    fontSize: '14px',
                    fontWeight: 'bold',
                    border: '1px solid #1890ff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    pointerEvents: 'none',
                    whiteSpace: 'nowrap'
                }}>
                    {hoveredCommune}
                </div>
            )}

            {/* Header */}
            <div style={{ 
                background: '#fff', 
                padding: '20px 24px',
                marginBottom: '20px',
                borderBottom: '1px solid #f0f0f0'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 600, color: '#012970' }}>
                            Giám sát Bản đồ Số Toàn Tỉnh
                        </h2>
                        <p style={{ margin: '4px 0 0 0', color: '#6c757d', fontSize: '14px' }}>
                            Theo dõi tiến độ cấp CCCD – VNeID trên 124 xã/phường
                        </p>
                    </div>
                    <Space>
                        <Button icon={<ReloadOutlined />}>Cập nhật</Button>
                        <Button icon={<ExpandOutlined />}>Xuất</Button>
                    </Space>
                </div>
            </div>

            <div style={{ padding: '0 24px' }}>
                {/* Statistics Cards */}
                <Row gutter={16} style={{ marginBottom: '20px' }}>
                    {statistics.map((stat, index) => (
                        <Col xs={24} sm={12} lg={6} key={index}>
                            <Card 
                                bordered={false}
                                style={{ 
                                    background: stat.bgColor,
                                    border: `1px solid ${stat.borderColor}`
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                                            {stat.title}
                                        </div>
                                        <div style={{ fontSize: '28px', fontWeight: 600, marginBottom: '8px' }}>
                                            {stat.value}
                                        </div>
                                        <Tag color={stat.trendUp ? 'success' : 'error'} style={{ fontSize: '12px' }}>
                                            {stat.trend} so với tháng trước
                                        </Tag>
                                    </div>
                                    <div>{stat.icon}</div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Main Content */}
                <Row gutter={16}>
                    {/* Map Section */}
                    <Col xs={24} lg={18}>
                        <Card 
                            title={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Space>
                                        <EnvironmentOutlined />
                                        <span>Bản đồ Tỉnh Lâm Đồng</span>
                                    </Space>
                                    <Space>
                                        <Button size="small" icon={<ZoomInOutlined />} onClick={handleZoomIn} />
                                        <Button size="small" icon={<ZoomOutOutlined />} onClick={handleZoomOut} />
                                        <Button size="small" icon={<ReloadOutlined />} onClick={handleResetZoom}>100%</Button>
                                    </Space>
                                </div>
                            }
                            bordered={false}
                            style={{ marginBottom: '20px' }}
                        >
                            <div style={{ width: '100%', height: '700px' }}>
                                <MapContainer
                                    center={[11.9, 108]}
                                    zoom={8}
                                    minZoom={8}
                                    maxZoom={15}
                                    maxBounds={[[9.8, 105.8], [14.2, 110.2]]}
                                    maxBoundsViscosity={0.5}
                                    style={{ height: '100%', width: '100%', borderRadius: 8 }}
                                    attributionControl={false}
                                    zoomControl={false}
                                    ref={mapRef}
                                >
                                    <ZoomTracker />
                                    <CommuneLabels />
                                    <GeoJSON
                                        ref={geoJsonRef}
                                        data={mapData}
                                        style={getLayerStyle}
                                        onEachFeature={onEachFeature}
                                    />
                                </MapContainer>
                            </div>

                            {/* Map Legend */}
                            <div style={{ marginTop: '16px', padding: '12px', background: '#fafafa', borderRadius: '4px' }}>
                                <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>
                                    Chú thích Bản đồ
                                </div>
                                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                                    {mapLegend.map((item, index) => (
                                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ 
                                                width: '20px', 
                                                height: '20px', 
                                                background: item.color,
                                                borderRadius: '2px'
                                            }} />
                                            <span style={{ fontSize: '13px' }}>
                                                <strong>{item.label}</strong> {item.range}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </Col>

                    {/* Hotspots Section */}
                    <Col xs={24} lg={6}>
                        <Card 
                            title={
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <i className="fas fa-fire" style={{ color: '#ff4d4f' }} />
                                    Khu vực Điểm Nóng (4)
                                </div>
                            }
                            bordered={false}
                            style={{ marginBottom: '20px' }}
                        >
                            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                {hotspots.map((hotspot, index) => (
                                    <Card 
                                        key={index}
                                        size="small"
                                        style={{ 
                                            marginBottom: '12px',
                                            border: `1px solid ${hotspot.status === 'danger' ? '#ffccc7' : '#ffe7ba'}`
                                        }}
                                        bodyStyle={{ padding: '12px' }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                            <i 
                                                className={hotspot.status === 'danger' ? 'fas fa-exclamation-triangle' : 'fas fa-info-circle'}
                                                style={{ 
                                                    color: hotspot.status === 'danger' ? '#ff4d4f' : '#faad14',
                                                    fontSize: '18px',
                                                    marginTop: '2px'
                                                }} 
                                            />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 600, color: '#ff4d4f', marginBottom: '4px' }}>
                                                    {hotspot.name}
                                                </div>
                                                <div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>
                                                    Vấn đề: {hotspot.issue}
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '13px' }}>
                                                        Tỷ lệ VNeID: <strong>{hotspot.rate}</strong>
                                                    </span>
                                                    <Button size="small" type="primary" danger={hotspot.status === 'danger'}>
                                                        {hotspot.action}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </Card>

                        {/* Quick Actions */}
                        <Card 
                            title="Hành động nhanh"
                            bordered={false}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <Button 
                                    block 
                                    icon={<BarChartOutlined />}
                                    className="quick-action-btn-outline"
                                    style={{ 
                                        textAlign: 'left',
                                        height: 'auto',
                                        padding: '12px 16px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    Xem Tổng quan Tỉnh
                                </Button>
                                <Button 
                                    block 
                                    icon={<AimOutlined />}
                                    className="quick-action-btn-outline"
                                    style={{ 
                                        textAlign: 'left',
                                        height: 'auto',
                                        padding: '12px 16px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    Theo dõi Chiến dịch
                                </Button>
                                <Button 
                                    block 
                                    icon={<TrophyOutlined />}
                                    className="quick-action-btn-outline"
                                    style={{ 
                                        textAlign: 'left',
                                        height: 'auto',
                                        padding: '12px 16px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    Xếp hạng & So sánh
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>

            <FooterComponent />
        </div>
    );
};
