import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import './DataTable.css'

interface Column<T> {
    header: string;
    accessor: keyof T | ((row: T) => React.ReactNode);
    width?: string;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
}

function DataTable<T extends object>({ columns, data }: DataTableProps<T>) {
    console.log('DataTable');

    return (
        <table className="w-full border-collapse text-left">
            <thead>
                <tr>
                    {columns.map((col, i) => (
                        <th
                            key={i}
                            className="p-3 border-t-0"
                            style={{ width: col.width || "auto" }}
                        >
                            {col.header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                <AnimatePresence>
                    {data.map((row) => (
                        <motion.tr
                            key={(row as any).id}
                            layout                   
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
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
                                    <td key={j} className="p-3 border-b">
                                        {cellContent}
                                    </td>
                                );
                            })}
                        </motion.tr>
                    ))}
                </AnimatePresence>
            </tbody>
        </table>
    );
}

export default DataTable;
