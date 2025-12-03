import React from 'react';
import { Layout, Button } from 'antd';
import { AppstoreOutlined, HomeOutlined, LineChartOutlined, GlobalOutlined } from '@ant-design/icons';
import { WrapperFooter } from './style';

const { Footer } = Layout;

export const FooterComponent = () => {
    return (
        <WrapperFooter>
            <Footer style={{ 
                textAlign: 'center', 
                background: '#f5f5f5',
                padding: '16px 50px',
                borderTop: '1px solid #e8e8e8',
                marginTop: '20px'
            }}>
                <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <strong>Điều hướng nhanh:</strong>
                    <Button 
                        icon={<GlobalOutlined />}
                        className="nav-btn-first"
                    >
                        Bảng điều khiển Tổng quan
                    </Button>
                    <Button 
                        icon={<HomeOutlined />}
                        className="nav-btn"
                    >
                        Chi tiết Cấp xã/phường
                    </Button>
                    <Button 
                        icon={<LineChartOutlined />}
                        className="nav-btn"
                    >
                        Phân tích Dữ liệu
                    </Button>
                </div>
                <div style={{ color: '#666', fontSize: '13px' }}>
                    © 2025 Công an tỉnh Lâm Đồng • Phiên bản 1.0.0
                    <span style={{ marginLeft: '30px' }}>Hỗ trợ kỹ thuật</span>
                    <span style={{ marginLeft: '30px' }}>Hướng dẫn sử dụng</span>
                </div>
            </Footer>
        </WrapperFooter>
    );
};
