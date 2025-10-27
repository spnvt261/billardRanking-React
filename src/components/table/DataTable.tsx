import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect } from "react";
import './DataTable.css'
import WithLoading from "../loading/WithLoading";
// import { connect } from "react-redux";

interface Column<T> {
    header: string;
    accessor: keyof T | ((row: T) => React.ReactNode) | string;
    width?: string;
    className?: string;        // ✅ thêm class cho header
    cellClassName?: string;    // ✅ thêm class cho cell
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    showLoading?: (show: boolean) => void;
    isLoading?: boolean;
    totalElement?: number;
    getRowClassName?: (row: T) => string; 
    getHeaderClass?: (col: Column<T>, index: number) => string; 
    minHeight?:string
}

const DataTable = <T extends object>({ columns, data, showLoading, isLoading, totalElement,getRowClassName,getHeaderClass,minHeight }: DataTableProps<T>) => {
    // console.log('DataTable');
    useEffect(() => {
        if (showLoading) {
            showLoading(isLoading || false)
        }
    }, [isLoading])
    return (
        <div className="relative"
            style={{ minHeight: `${minHeight?minHeight :totalElement == 0 ? '500px' : data.length == 0 ? '700px' : ''}` }}
        >
            <table className=" w-full border-collapse text-left"
            >
                <thead>
                    <tr>
                        {columns.map((col, i) => {
                            return(
                            <th
                                key={i}
                                 className={`p-3 border-t-0 ${col.className || ""} ${getHeaderClass ? getHeaderClass(col, i) : ""}`}
                                style={{ width: col.width || "auto" }}
                            >
                                {col.header}
                            </th>
                        )})}
                    </tr>
                </thead>
                <AnimatePresence>
                    <tbody
                    >

                        {data && data.length > 0 && (data.map((row,rowIndex) => {
                            const rowClass = getRowClassName ? getRowClassName(row) : "";
                            return(
                            <motion.tr
                                key={(row as any).match_id || (row as any).id || `row-${rowIndex}`}
                                layout
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                 className={`hover:bg-[var(--tr-hover-color)] ${rowClass}`}

                            >
                                {columns.map((col, j) => {
                                    let cellContent: React.ReactNode;

                                    // nếu accessor là function → gọi function
                                    if (typeof col.accessor === "function") {
                                        cellContent = col.accessor(row);
                                    } else {
                                        // nếu accessor là key → lấy value
                                        cellContent = (row as any)[col.accessor];
                                    }

                                    return (
                                        <td key={j}  className={`p-3 border-b ${col.cellClassName || ""}`}>
                                            {cellContent}
                                        </td>
                                    );
                                })}
                            </motion.tr>
                        )}))}

                    </tbody>
                </AnimatePresence>
            </table>
            {
                totalElement == 0 &&
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-fit">
                    <h2 className="text-xl font-bold mt-4 text-slate-500">CHƯA CÓ DỮ LIỆU</h2>
                </div>
            }
        </div>
    );
}

// const mapStateToProps = (state: any) => {
//     return {
//         isLoading: state.workspace.isLoading
//     };
// }


// export default connect(mapStateToProps,null)(WithLoading(DataTable))  as typeof DataTable  ;

export default WithLoading(DataTable) as typeof DataTable;