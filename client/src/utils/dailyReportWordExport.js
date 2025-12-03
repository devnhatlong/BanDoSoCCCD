import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, BorderStyle, WidthType, Drawing, HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom, HorizontalPositionAlign, VerticalPositionAlign } from 'docx';
import { saveAs } from 'file-saver';
import moment from 'moment';

/**
 * Export Daily Report to Word Document (.docx)
 * @param {Object} reportData - Daily report data containing all form fields
 * @returns {void} - Downloads .docx file automatically
 */

export const exportDailyReportToWord = (reportData) => {
  // Tạo document Word
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header Table với 2 cột
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 44, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "CÔNG AN TỈNH LAM ĐỒNG",
                            bold: true,
                            size: 24,
                            font: "Times New Roman",
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: (reportData.departmentName || "PHÒNG THAM MƯU").toUpperCase(),
                            bold: true,
                            size: 24,
                            font: "Times New Roman",
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `Số: ${reportData.reportNumber || '...'}`,
                            size: 28,
                            font: "Times New Roman",
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 56, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
                            bold: true,
                            size: 24,
                            font: "Times New Roman",
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Độc lập - Tự do - Hạnh phúc",
                            bold: true,
                            size: 26,
                            font: "Times New Roman",
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `Lâm Đồng, ngày ${reportData.serverDate ? moment(reportData.serverDate).format('DD') : (reportData.reportDate?.format('DD') || moment().format('DD'))} tháng ${reportData.serverDate ? moment(reportData.serverDate).format('MM') : (reportData.reportDate?.format('MM') || moment().format('MM'))} năm ${reportData.serverDate ? moment(reportData.serverDate).format('YYYY') : (reportData.reportDate?.format('YYYY') || moment().format('YYYY'))}`,
                            italics: true,
                            size: 26,
                            font: "Times New Roman",
                          }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // Tiêu đề
          new Paragraph({
            children: [
              new TextRun({
                text: "BÁO CÁO",
                bold: true,
                size: 28,
                font: "Times New Roman",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 240 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Ngày ${reportData.serverDate ? moment(reportData.serverDate).format('DD/MM/YYYY') : (reportData.reportDate?.format('DD/MM/YYYY') || moment().format('DD/MM/YYYY'))}`,
                bold: true,
                size: 28,
                font: "Times New Roman",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 240 }
          }),

          // Phần I
          new Paragraph({
            children: [
              new TextRun({
                text: "I. TÌNH HÌNH AN NINH, TRẬT TỰ",
                bold: true,
                size: 28,
                font: "Times New Roman",
              }),
            ],
            spacing: { before: 120, after: 120 }
          }),

          // 1. Tình hình an ninh chính trị
          new Paragraph({
            children: [
              new TextRun({
                text: "1. Tình hình an ninh chính trị",
                bold: true,
                size: 28,
                font: "Times New Roman",
              }),
            ],
            spacing: { before: 120, after: 120 }
          }),

          // 1.1
          new Paragraph({
            children: [
              new TextRun({
                text: "1.1. Liên quan đến An ninh Biên giới, biển đảo",
                italics: true,
                size: 28,
                font: "Times New Roman",
              }),
            ],
            spacing: { before: 120, after: 120 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                size: 28,
                font: "Times New Roman",
              }),
            ],
            spacing: { before: 120, after: 120 }
          }),

          ...(reportData.securityBorderContent ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: stripHtml(reportData.securityBorderContent),
                  size: 28,
                  font: "Times New Roman",
                }),
              ],
              spacing: { before: 120, after: 120 }
            })
          ] : []),

          // 1.2
          new Paragraph({
            children: [
              new TextRun({
                text: "1.2. An ninh trên các lĩnh vực",
                italics: true,
                size: 28,
                font: "Times New Roman",
              }),
            ],
            spacing: { before: 120, after: 120 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                size: 28,
                font: "Times New Roman",
              }),
            ],
            spacing: { before: 120, after: 120 }
          }),

          ...(reportData.securityFieldsContent ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: stripHtml(reportData.securityFieldsContent),
                  size: 28,
                }),
              ],
              spacing: { before: 120, after: 120 }
            })
          ] : []),

          // 2. Tình hình trật tự an toàn xã hội
          new Paragraph({
            children: [
              new TextRun({
                text: "2. Tình hình trật tự an toàn xã hội",
                bold: true,
                size: 28,
                font: "Times New Roman",
              }),
            ],
            spacing: { before: 120, after: 120 }
          }),

          ...(reportData.socialOrderContent ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: stripHtml(reportData.socialOrderContent),
                  size: 28,
                }),
              ],
              spacing: { before: 120, after: 120 }
            })
          ] : []),

          // Phần II
          new Paragraph({
            children: [
              new TextRun({
                text: "II. KẾT QUẢ CÁC MẶT CÔNG TÁC",
                bold: true,
                size: 28,
                font: "Times New Roman",
              }),
            ],
            spacing: { before: 120, after: 120 }
          }),

          // 1. Công tác bảo vệ ANQG
          new Paragraph({
            children: [
              new TextRun({
                text: "1. Công tác bảo vệ ANQG",
                bold: true,
                size: 28,
                font: "Times New Roman",
              }),
            ],
            spacing: { before: 120, after: 120 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                size: 28,
                font: "Times New Roman",
              }),
            ],
            spacing: { before: 120, after: 120 }
          }),

          ...(reportData.nationalSecurityWork ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: stripHtml(reportData.nationalSecurityWork),
                  size: 28,
                }),
              ],
              spacing: { after: 300 }
            })
          ] : []),

          // 2. Công tác điều tra
          new Paragraph({
            children: [
              new TextRun({
                text: "2. Công tác điều tra, xử lý tội phạm; tiếp nhận, giải quyết tin báo về tội phạm và kiến nghị khởi tố",
                bold: true,
                size: 28,
              }),
            ],
            spacing: { before: 120, after: 120 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                size: 28,
              }),
            ],
            spacing: { before: 120, after: 120 }
          }),

          ...(reportData.crimeInvestigationWork ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: stripHtml(reportData.crimeInvestigationWork),
                  size: 28,
                }),
              ],
              spacing: { before: 120, after: 120 }
            })
          ] : []),

          // 3. Công tác khác
          new Paragraph({
            children: [
              new TextRun({
                text: "3. Công tác khác",
                bold: true,
                size: 28,
              }),
            ],
            spacing: { before: 120, after: 120 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                size: 28,
              }),
            ],
            spacing: { before: 120, after: 120 }
          }),

          ...(reportData.otherWork ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: stripHtml(reportData.otherWork),
                  size: 28,
                }),
              ],
              spacing: { before: 120, after: 120 }
            })
          ] : []),

          // 4. Công tác xây dựng đảng
          new Paragraph({
            children: [
              new TextRun({
                text: "4. Công tác xây dựng đảng, xây dựng lực lượng",
                bold: true,
                size: 28,
              }),
            ],
            spacing: { before: 120, after: 120 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                size: 28,
              }),
            ],
            spacing: { before: 120, after: 120 }
          }),

          ...(reportData.partyBuildingWork ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: stripHtml(reportData.partyBuildingWork),
                  size: 28,
                }),
              ],
              spacing: { before: 120, after: 120 }
            })
          ] : []),

          // Phần III
          new Paragraph({
            children: [
              new TextRun({
                text: "III. KIẾN NGHỊ, ĐỀ XUẤT",
                bold: true,
                size: 28,
                font: "Times New Roman",
              }),
            ],
            spacing: { before: 120, after: 120 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                size: 28,
              }),
            ],
            spacing: { before: 120, after: 120 }
          }),

          ...(reportData.suggestions ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: stripHtml(reportData.suggestions),
                  size: 28,
                }),
              ],
              spacing: { before: 120, after: 120 }
            })
          ] : []),
        ],
      },
    ],
  });

  // Xuất file
  Packer.toBlob(doc).then((blob) => {
    const fileName = `Bao_cao_ngay_${reportData.serverDate ? moment(reportData.serverDate).format('DD_MM_YYYY') : (reportData.reportDate?.format('DD_MM_YYYY') || moment().format('DD_MM_YYYY'))}.docx`;
    saveAs(blob, fileName);
  });
};

// Helper function để loại bỏ HTML tags
const stripHtml = (html) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};