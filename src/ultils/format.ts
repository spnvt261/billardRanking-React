export const formatDateVN = (date: Date) => {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
};

export function formatVND(amount: number): string {
    if (isNaN(amount)) return "0đ";


    if (amount >= 1_000_000_000) {
        return (amount / 1_000_000_000).toFixed(2).replace(/\.?0+$/, "") + "Bđ";
    } else if (amount >= 1_000_000) {
        return (amount / 1_000_000).toFixed(2).replace(/\.?0+$/, "") + "Mđ";
    }

    // Dạng thông thường (có dấu . ngăn cách hàng nghìn)
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
}

export function formatFullVND(amount: number): string {
    if (isNaN(amount)) return "0VND";

    // Dạng thông thường (có dấu . ngăn cách hàng nghìn)
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "VND";
}