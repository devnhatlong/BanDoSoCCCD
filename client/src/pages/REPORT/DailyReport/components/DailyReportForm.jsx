import React, { useState, useCallback } from 'react';
import { Button, Space, Input, Modal, message } from 'antd';
import { PrinterOutlined, SaveOutlined, FileWordOutlined, EyeOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import moment from 'moment';
import { exportDailyReportToWord } from '../../../../utils/dailyReportWordExport';
import './DailyReportForm.css';

const DailyReportForm = ({ reportData, onUpdateData, isLoading, readOnly = false }) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const user = useSelector((state) => state?.user);

  // Cấu hình toolbar cho ReactQuill (giống Word) 
  const quillModules = {
    toolbar: readOnly ? false : [
      [{ 'font': ['Times New Roman'] }],
      ['bold', 'italic', 'underline'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ],
  };

  const quillFormats = [
    'font',
    'bold', 'italic', 'underline',
    'color', 'background',
    'align', 'list', 'bullet',
  ];

  const handleQuillChange = useCallback((field) => (content) => {
    onUpdateData(field, content);
  }, [onUpdateData]);

  const handleInputChange = useCallback((field) => (e) => {
    onUpdateData(field, e.target.value);
  }, [onUpdateData]);

  const handleExportWord = () => {
    try {
      message.loading('Đang tạo file Word...', 1);
      // Truyền thông tin department vào dữ liệu export
      const exportData = {
        ...reportData,
        departmentName: user?.departmentId?.departmentName
      };
      exportDailyReportToWord(exportData);
      message.success('Đã xuất file Word thành công');
    } catch (error) {
      message.error('Có lỗi xảy ra khi xuất file Word');
      console.error('Word export error:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const showPreview = () => {
    setPreviewVisible(true);
  };

  return (
    <div className="daily-report-form">
      {/* Header */}
      <div className="report-header">
        <div className="header-row">
          <div className="header-left">
            <div><strong>CÔNG AN TỈNH LÂM ĐỒNG</strong></div>
            <div>
              <strong>
                {(user?.departmentId?.departmentName || 'PHÒNG THAM MƯU').toUpperCase()}
              </strong>
            </div>
            <div className="report-number">
              Số: 
              <Input 
                value={reportData.reportNumber} 
                onChange={handleInputChange('reportNumber')}
                placeholder="..."
                disabled={readOnly}
                style={{ 
                  width: '150px', 
                  marginLeft: '5px',
                  border: 'none',
                  borderBottom: '1px dotted #ccc',
                  backgroundColor: readOnly ? 'transparent' : undefined,
                  cursor: readOnly ? 'default' : undefined
                }}
              />
            </div>
          </div>
          <div className="header-right">
            <div><strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong></div>
            <div><strong>Độc lập - Tự do - Hạnh phúc</strong></div>
            <div className="report-date">
              Lâm Đồng, ngày {moment().format('DD')} tháng {moment().format('MM')} năm {moment().format('YYYY')}
            </div>
          </div>
        </div>
        
        <div className="report-title">
          <h2>
            BÁO CÁO<br />
            <span>Ngày {moment().format('DD/MM/YYYY')}</span>
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="report-content">
        {/* Section I */}
        <div className="report-section">
          <h3 className="section-title">I. TÌNH HÌNH AN NINH, TRẬT TỰ</h3>
          
          {/* Section 1 */}
          <div className="sub-section">
            <h4 className="sub-title">1. Tình hình an ninh chính trị</h4>
            
            {/* Section 1.1 */}
            <div className="sub-sub-section">
              <div className="sub-sub-title">1.1. Liên quan đến An ninh Biên giới, biển đảo</div>
              <div className="editor-container">
                <ReactQuill
                  value={reportData.securityBorderContent || ''}
                  onChange={handleQuillChange('securityBorderContent')}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Nhập nội dung về tình hình an ninh biên giới, biển đảo..."
                  style={{ height: 'auto' }}
                  readOnly={readOnly}
                />
              </div>
            </div>

            {/* Section 1.2 */}
            <div className="sub-sub-section">
              <div className="sub-sub-title">1.2. An ninh trên các lĩnh vực</div>
              <div className="editor-container">
                <ReactQuill
                  value={reportData.securityFieldsContent || ''}
                  onChange={handleQuillChange('securityFieldsContent')}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Nhập nội dung về tình hình an ninh trên các lĩnh vực..."
                  readOnly={readOnly}
                />
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="sub-section">
            <h4 className="sub-title">2. Tình hình trật tự an toàn xã hội</h4>
            <div className="editor-container">
              <ReactQuill
                value={reportData.socialOrderContent || ''}
                onChange={handleQuillChange('socialOrderContent')}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Nhập nội dung về tình hình trật tự an toàn xã hội..."
                readOnly={readOnly}
              />
            </div>
          </div>
        </div>

        {/* Section II */}
        <div className="report-section">
          <h3 className="section-title">II. KẾT QUẢ CÁC MẶT CÔNG TÁC</h3>
          
          {/* Section 1 */}
          <div className="sub-section">
            <h4 className="sub-title">1. Công tác bảo vệ ANQG</h4>
            <div className="editor-container">
              <ReactQuill
                value={reportData.nationalSecurityWork || ''}
                onChange={handleQuillChange('nationalSecurityWork')}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Nhập nội dung về công tác bảo vệ an ninh quốc gia..."
                readOnly={readOnly}
              />
            </div>
          </div>

          {/* Section 2 */}
          <div className="sub-section">
            <h4 className="sub-title">2. Công tác điều tra, xử lý tội phạm; tiếp nhận, giải quyết tin báo về tội phạm và kiến nghị khởi tố</h4>
            <div className="editor-container">
              <ReactQuill
                value={reportData.crimeInvestigationWork || ''}
                onChange={handleQuillChange('crimeInvestigationWork')}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Nhập nội dung về công tác điều tra, xử lý tội phạm..."
                readOnly={readOnly}
              />
            </div>
          </div>

          {/* Section 3 */}
          <div className="sub-section">
            <h4 className="sub-title">3. Công tác khác</h4>
            <div className="editor-container">
              <ReactQuill
                value={reportData.otherWork || ''}
                onChange={handleQuillChange('otherWork')}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Nhập nội dung về các công tác khác..."
                readOnly={readOnly}
              />
            </div>
          </div>

          {/* Section 4 */}
          <div className="sub-section">
            <h4 className="sub-title">4. Công tác xây dựng đảng, xây dựng lực lượng</h4>
            <div className="editor-container">
              <ReactQuill
                value={reportData.partyBuildingWork || ''}
                onChange={handleQuillChange('partyBuildingWork')}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Nhập nội dung về công tác xây dựng đảng, xây dựng lực lượng..."
                readOnly={readOnly}
              />
            </div>
          </div>
        </div>

        {/* Section III */}
        <div className="report-section">
          <h3 className="section-title">III. KIẾN NGHỊ, ĐỀ XUẤT</h3>
          <div className="editor-container">
            <ReactQuill
              value={reportData.suggestions || ''}
              onChange={handleQuillChange('suggestions')}
              modules={quillModules}
              formats={quillFormats}
              placeholder="Nhập các kiến nghị, đề xuất..."
              readOnly={readOnly}
            />
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        title="Xem trước báo cáo"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        width="90%"
        style={{ top: 20 }}
        footer={[
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            Đóng
          </Button>,
          <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={handlePrint}>
            In báo cáo
          </Button>
        ]}
      >
        <div className="preview-content">
          <div style={{ fontFamily: '"Times New Roman", serif', fontSize: '14px', lineHeight: 1.6 }}>
            {/* Preview content sẽ được render ở đây */}
            <div dangerouslySetInnerHTML={{ __html: reportData.securityBorderContent || '' }} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DailyReportForm;