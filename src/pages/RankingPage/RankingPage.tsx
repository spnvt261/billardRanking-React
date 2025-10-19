import "./RankingPage.css"
import RankingTable from "../../components/table/rankings/RankingTable";
import FormToggle from "../../components/forms/FormToggle";
import addPlayerForm from "../../components/forms/addPlayerForm/AddPlayerForm";
import CustomNote from "../../components/customNote/CustomNote";

const RankingPage = () => {
    // console.log('RankingPage');
    return (
        <div className="ranking-page pb-8">
            <FormToggle
                btnLabel="Thêm cơ thủ"
                formTitle="Thêm cơ thủ mới"
                element={addPlayerForm}
                className="mb-4"
                needPermission
            />
            <div className="flex items-center mb-4">
                <h2 className="text-xl font-bold text-slate-500">FRIEND RANKINGS</h2>
                <CustomNote noteContent={`1 rack win +1Elo`} className="ml-1"/>
            </div>
            
            <div className="w-full border mt-4 bg-white shadow-md rounded-lg overflow-hidden">
                <RankingTable />
            </div>
        </div >
    );
}

export default RankingPage