/**
 * Vietnamese Translations
 * 
 * Central translation constants for the dashboard UI.
 * Simple approach without i18n library - direct Vietnamese strings.
 */

// Category Names
export const CATEGORIES = {
    GIAI_TRI: "Giải trí",
    CONG_VIEC: "Công việc",
    CONG_CU_AI: "Công cụ AI",
} as const;

// Category name mapping (English to Vietnamese for migration)
export const CATEGORY_MIGRATION: Record<string, string> = {
    "Entertainment": CATEGORIES.GIAI_TRI,
    "Work": CATEGORIES.CONG_VIEC,
    "AI Tools": CATEGORIES.CONG_CU_AI,
};

// Common Actions
export const ACTIONS = {
    THEM: "Thêm",
    SUA: "Sửa",
    XOA: "Xóa",
    LUU: "Lưu",
    HUY: "Hủy",
    DONG: "Đóng",
    TAI_LEN: "Tải lên",
    LOAI_BO: "Loại bỏ",
    THEM_SUA: "Thêm/Sửa",
    XOA_HANG_MUC: "Xóa hạng mục",
} as const;

// Labels
export const LABELS = {
    PHIM_TAT: "Phím tắt",
    HANG_MUC: "Hạng mục",
    TEN: "Tên",
    MO_TA: "Mô tả",
    TIEU_SU: "Tiểu sử",
    ANH_DAI_DIEN: "Ảnh đại diện",
    LOAI_LIEN_KET: "Loại liên kết",
    TIM_KIEM: "Tìm kiếm",
    CHE_DO_TAP_TRUNG: "Chế độ tập trung",
    CAI_DAT: "Cài đặt",
    HO_SO: "Hồ sơ",
    NEN: "Nền",
    DU_LIEU: "Dữ liệu",
    GIAO_DIEN: "Giao diện",
} as const;

// Buttons & Actions
export const BUTTONS = {
    CHINH_SUA_HO_SO: "Chỉnh sửa hồ sơ",
    LUU_THAY_DOI: "Lưu thay đổi",
    THEM_PHIM_TAT: "Thêm phím tắt",
    SUA_PHIM_TAT: "Sửa phím tắt",
    XOA_PHIM_TAT: "Xóa phím tắt",
    QUAN_LY_PHIM_TAT: "Quản lý phím tắt",
    MO_UNG_DUNG: "Mở ứng dụng",
    XUAT_DU_LIEU: "Xuất dữ liệu",
    NHAP_DU_LIEU: "Nhập dữ liệu",
    DAT_LAI: "Đặt lại",
} as const;

// Link Types
export const LINK_TYPES = {
    WEB: "Web",
    APP: "App",
} as const;

// Placeholders
export const PLACEHOLDERS = {
    TIM_KIEM_GOOGLE: "Tìm kiếm Google...",
    TIM_KIEM_PHIM_TAT: "Tìm phím tắt...",
    NHAP_TEN: "Nhập tên...",
    NHAP_MO_TA: "Nhập mô tả...",
    NHAP_TIEU_SU: "Một vài dòng về bạn...",
    NHAP_URL: "https://example.com",
} as const;

// Dialog Messages
export const DIALOGS = {
    XOA_HANG_MUC: {
        TITLE: "Xóa hạng mục?",
        MESSAGE: "Hạng mục này và toàn bộ phím tắt bên trong sẽ bị xóa. Bạn có chắc không?",
        KHONG_THE_XOA_CUOI: "Không thể xóa hạng mục cuối cùng",
    },
    XOA_PHIM_TAT: {
        TITLE: "Xóa phím tắt?",
        MESSAGE: "Bạn có chắc muốn xóa phím tắt này? Hành động này không thể hoàn tác.",
    },
    MO_UNG_DUNG: {
        TITLE: (appName: string) => `Mở ${appName}?`,
        MESSAGE: "Ứng dụng này sẽ mở trên thiết bị của bạn.",
        NHO_LUA_CHON: "Nhớ lựa chọn của tôi",
    },
    QUAN_LY_PHIM_TAT: {
        TITLE: (categoryName: string) => `Quản lý phím tắt: ${categoryName}`,
        DESCRIPTION: "Thêm, sửa hoặc xóa phím tắt trong hạng mục này",
        PHIM_TAT_HIEN_CO: "Phím tắt hiện có:",
        KHONG_CO_PHIM_TAT: "Chưa có phím tắt nào trong hạng mục này",
    },
    DAT_LAI_DU_LIEU: {
        TITLE: "Đặt lại dữ liệu?",
        MESSAGE: "Bạn có chắc muốn đặt lại toàn bộ dữ liệu về mặc định? Hành động này không thể hoàn tác.",
        SUCCESS: "Dữ liệu đã được đặt lại về mặc định",
    },
    NHAP_DU_LIEU: {
        SUCCESS: "Nhập dữ liệu thành công!",
        ERROR: "Không thể nhập dữ liệu. Vui lòng kiểm tra định dạng tệp.",
    },
} as const;

// Validation Messages
export const VALIDATION = {
    TEN_BAT_BUOC: "Tên là bắt buộc",
    URL_BAT_BUOC: "URL là bắt buộc",
    URL_KHONG_HOP_LE: "Vui lòng nhập URL hợp lệ (https://...)",
    URL_GIAO_THUC_KHONG_HOP_LE: "Vui lòng nhập URL giao thức hợp lệ (ví dụ: discord://)",
    URL_DU_PHONG_KHONG_HOP_LE: "Vui lòng nhập URL dự phòng hợp lệ",
    LOAI_TEP_KHONG_HOP_LE: "Loại tệp không hợp lệ",
    TEP_QUA_LON: "Tệp quá lớn",
    URL_PHAI_HTTP: "URL phải sử dụng http:// hoặc https://",
    DINH_DANG_URL_KHONG_HOP_LE: "Định dạng URL không hợp lệ",
} as const;

// Theme
export const THEME = {
    SANG: "Sáng",
    TOI: "Tối",
} as const;

// Background Settings
export const BACKGROUND = {
    TAI_LEN_NEN: "Tải lên nền",
    LOAI_BO_NEN: "Loại bỏ nền",
    MAU_DON_SAC: "Màu đơn sắc",
    DO_MO: "Độ mờ",
    DO_TOI: "Độ tối",
    CHON_MAU_GRADIENT: "Gradient mẫu",
    HO_TRO: "Hỗ trợ: JPG, PNG, GIF, WebP, MP4, WebM",
} as const;

// Empty States
export const EMPTY_STATES = {
    KHONG_TIM_THAY: "Không tìm thấy kết quả",
    KHONG_CO_PHIM_TAT: "Chưa có phím tắt nào",
} as const;

// Misc
export const MISC = {
    DANG_TAI: "Đang tải...",
    LOI: "Lỗi",
    THANH_CONG: "Thành công",
} as const;

// Export all for convenience
export const VN = {
    CATEGORIES,
    CATEGORY_MIGRATION,
    ACTIONS,
    LABELS,
    BUTTONS,
    LINK_TYPES,
    PLACEHOLDERS,
    DIALOGS,
    VALIDATION,
    THEME,
    BACKGROUND,
    EMPTY_STATES,
    MISC,
} as const;
