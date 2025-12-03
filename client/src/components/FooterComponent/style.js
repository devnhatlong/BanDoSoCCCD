import styled from "styled-components";

export const WrapperFooter = styled.div`
    width: 100%;
    
    .ant-layout-footer {
        margin-top: auto;
    }
    
    .nav-btn {
        cursor: pointer;
        transition: all 0.3s;
    }

    .nav-btn:hover {
        background: #00bcd4 !important;
        color: white !important;
        border-color: #00bcd4 !important;
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(0, 188, 212, 0.3);
    }

    .nav-btn-first {
        background: #00bcd4;
        color: white;
        border: none;
        transition: all 0.3s;
    }

    .nav-btn-first:hover {
        background: #00acc1 !important;
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(0, 188, 212, 0.3);
    }
`;
