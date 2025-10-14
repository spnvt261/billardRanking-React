// 200 OK	Thành công
// 201 Created	Tạo mới thành công
// 204 No Content	Xóa thành công
// 400 Bad Request	Dữ liệu không hợp lệ
// 401 Unauthorized	Xác thực thất bại
// 403 Forbidden	Không có quyền
// 404 Not Found	Không tìm thấy resource
// 429 Too Many Requests	Vượt rate limit
// 500 Internal Server Error	Lỗi server

export const CODE_400 = "Dữ liệu không hợp lệ";
export const CODE_401 = "Xác thực thất bại";
export const CODE_403 = "Không có quyền";
export const CODE_404 = "Không tìm thấy tài nguyên";
export const CODE_429 = "Vượt quá giới hạn yêu cầu";
export const CODE_500 = "Lỗi máy chủ";
export const CODE_502 = "Lỗi cổng máy chủ";