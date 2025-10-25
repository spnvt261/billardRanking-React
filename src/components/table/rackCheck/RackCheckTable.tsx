import React from "react";
import DataTable from "../DataTable";

interface HistoryItem {
    rack: number;
    winner: string;
    note: string;
}

interface RackCheckTableProps {
    show: boolean;
    history: HistoryItem[];
    onClose: () => void;
}

const RackCheckTable: React.FC<RackCheckTableProps> = ({ show, history, onClose }) => {
    if (!show) return null;

    const columns = [
        { header: "Rack", accessor: "rack", width: "20%" },
        { header: "Winner", accessor: "winner", width: "40%" },
        { header: "Note", accessor: "note", width: "40%" },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center border-b px-4 py-2">
                    <h2 className="text-lg font-bold">History</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    >
                        &times;
                    </button>
                </div>

                {/* Body */}
                <div className="p-4">
                    <DataTable
                        columns={columns}
                        data={history}
                        totalElement={history.length}
                        isLoading={false}
                    />
                </div>
            </div>
        </div>
    );
};

export default RackCheckTable;
