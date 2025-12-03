import React, { useEffect, useState } from 'react';
import { ConfigProvider, Table, Button, Space, message as antdMessage, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, FileWordOutlined, EyeOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import viVN from 'antd/es/locale/vi_VN';
import 'dayjs/locale/vi';

import { useMutationHooks } from '../../../../hooks/useMutationHook';
import { useQuery } from '@tanstack/react-query';
import dailyReportService from '../../../../services/dailyReportService';
import { exportDailyReportToWord } from '../../../../utils/dailyReportWordExport';
import BreadcrumbComponent from '../../../../components/BreadcrumbComponent/BreadcrumbComponent';
import { PATHS } from '../../../../constants/path';
import { FormContainer, WrapperHeader } from '../styles/style';

export const DailyReportList = () => {
    const user = useSelector((state) => state?.user);
    const navigate = useNavigate();

    const breadcrumbItems = [
        { label: 'Trang chủ', path: `${PATHS.ROOT}` },
        { label: 'Báo cáo' },
        { label: 'Danh sách báo cáo ngày' },
    ];

    // Query để lấy danh sách báo cáo
    const { data: reportsList, isLoading, refetch, error } = useQuery({
        queryKey: ['dailyReports', user?.role, user?._id || user?.id],
        queryFn: async () => {
            const userId = user?._id || user?.id;
            const userRole = user?.role;
            
            if (userId) {
                console.log('User role:', userRole);
                
                if (userRole === 'admin') {
                    // Admin call getDailyReports để lấy tất cả báo cáo
                    const response = await dailyReportService.getDailyReports();
                    return response.forms || response.data || []; // Backend trả về `forms` field
                } else {
                    // User thường call getDailyReportsByUser để lấy báo cáo của mình
                    const response = await dailyReportService.getDailyReportsByUser(userId);
                    return response.data || [];
                }
            }
            return [];
        },
        enabled: !!(user?._id || user?.id)
    });

    // Log error nếu có
    useEffect(() => {
        if (error) {
            console.error('Error fetching reports:', error);
            antdMessage.error('Có lỗi khi tải danh sách báo cáo');
        }
    }, [error]);

    // Mutation xóa báo cáo
    const deleteMutation = useMutationHooks(
        (reportId) => {
            return dailyReportService.deleteDailyReport(reportId);
        }
    );

    const { data: deleteResult, isSuccess: deleteSuccess, isError: deleteError } = deleteMutation;

    useEffect(() => {
        if (deleteSuccess && deleteResult?.success) {
            antdMessage.success('Xóa báo cáo thành công!');
            refetch(); // Refresh danh sách
        } else if (deleteError) {
            antdMessage.error('Có lỗi xảy ra khi xóa báo cáo');
        }
    }, [deleteSuccess, deleteError, deleteResult, refetch]);

    // Xử lý tạo mới báo cáo
    const handleCreateNew = () => {
        navigate('/report/daily/new');
    };

    // Xử lý sửa báo cáo  
    const handleEdit = (record) => {
        navigate(`/report/daily/edit/${record._id}`, { state: { record } });
    };

    // Xử lý xem chi tiết
    const handleView = (record) => {
        navigate(`/report/daily/detail/${record._id}`);
    };

    // Xử lý xuất Word
    const handleExportWord = (record) => {
        try {
            antdMessage.loading('Đang tạo file Word...', 1);
            const exportData = {
                ...record,
                departmentName: record?.userId?.departmentId?.departmentName || user?.departmentId?.departmentName
            };
            exportDailyReportToWord(exportData);
            antdMessage.success('Đã xuất file Word thành công');
        } catch (error) {
            antdMessage.error('Có lỗi xảy ra khi xuất file Word');
            console.error('Word export error:', error);
        }
    };

    // Xử lý xóa báo cáo
    const handleDelete = (record) => {
        deleteMutation.mutate(record._id);
    };

    const columns = [
        {
            title: 'STT',
            key: 'index',
            width: 60,
            render: (_, record, index) => index + 1,
        },
        {
            title: 'Số báo cáo',
            dataIndex: 'reportNumber',
            key: 'reportNumber',
            render: (text) => text || 'Chưa có số',
        },
        {
            title: 'Phòng ban',
            key: 'department',
            render: (_, record) => record?.userId?.departmentId?.departmentName || 'N/A',
        },
        {
            title: 'Người tạo',
            key: 'creator',
            render: (_, record) => record?.userId?.userName || 'N/A',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => moment(date).format('DD/MM/YYYY HH:mm'),
            sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
            defaultSortOrder: 'descend',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isDraft',
            key: 'isDraft',
            render: (isDraft) => (
                <span style={{ 
                    color: isDraft ? '#faad14' : '#52c41a',
                    fontWeight: 'bold'
                }}>
                    {isDraft ? 'Bản nháp' : 'Đã hoàn thành'}
                </span>
            ),
        },
        {
            title: 'Nội dung',
            key: 'content',
            render: (_, record) => {
                // Kiểm tra nội dung báo cáo chính
                const hasMainContent = Object.values({
                    securityBorderContent: record.securityBorderContent,
                    securityFieldsContent: record.securityFieldsContent,
                    socialOrderContent: record.socialOrderContent,
                    nationalSecurityWork: record.nationalSecurityWork,
                    crimeInvestigationWork: record.crimeInvestigationWork,
                    otherWork: record.otherWork,
                    partyBuildingWork: record.partyBuildingWork,
                    suggestions: record.suggestions
                }).some(value => 
                    typeof value === 'string' && value.trim() !== '' && value !== '<p><br></p>'
                );
                
                // Kiểm tra nội dung phụ lục thống kê
                const hasAnnexContent = record.annex && Object.keys(record.annex).length > 0;
                
                const status = hasMainContent && hasAnnexContent ? 'Đầy đủ' :
                              hasMainContent ? 'Có báo cáo chính' :
                              hasAnnexContent ? 'Có phụ lục' :
                              'Chưa có nội dung';
                              
                const color = hasMainContent && hasAnnexContent ? '#52c41a' :
                             hasMainContent || hasAnnexContent ? '#faad14' :
                             '#d9d9d9';
                
                return (
                    <span style={{ color, fontWeight: 'bold' }}>
                        {status}
                    </span>
                );
            },
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 200,
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleView(record)}
                        title="Xem chi tiết"
                    />
                    <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        title="Chỉnh sửa"
                    />
                    <Button
                        size="small"
                        icon={<FileWordOutlined />}
                        onClick={() => handleExportWord(record)}
                        title="Xuất Word"
                        style={{ color: '#52c41a', borderColor: '#52c41a' }}
                    />
                    <Popconfirm
                        title="Xóa báo cáo"
                        description="Bạn có chắc chắn muốn xóa báo cáo này?"
                        onConfirm={() => handleDelete(record)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okType="danger"
                    >
                        <Button
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            title="Xóa"
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <ConfigProvider locale={viVN}>
            <WrapperHeader>Danh sách báo cáo ngày</WrapperHeader>
            <BreadcrumbComponent items={breadcrumbItems} />
            <FormContainer>
                <div style={{ marginBottom: 16 }}>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateNew}
                        size="large"
                    >
                        Tạo báo cáo mới
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={reportsList}
                    loading={isLoading}
                    rowKey="_id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `Tổng ${total} báo cáo`,
                    }}
                    scroll={{ x: 1200 }}
                    locale={{
                        emptyText: reportsList?.length === 0 ? 'Chưa có báo cáo nào' : 'Không có dữ liệu'
                    }}
                />
            </FormContainer>
        </ConfigProvider>
    );
};

export default DailyReportList;