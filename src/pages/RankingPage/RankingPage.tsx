import "./RankingPage.css"
import RankingTable from "../../components/table/rankings/RankingTable";
import FormToggle from "../../components/forms/FormToggle";
import addPlayerForm from "../../components/forms/addPlayerForm/AddPlayerForm";

const RankingPage = () => {
    // console.log('RankingPage');
    return (
        <div className="ranking-page pb-8">
            <FormToggle
                btnLabel="Thêm cơ thủ"
                formTitle="Thêm cơ thủ mới"
                element={addPlayerForm}
                needPermission
            />
            <h2 className="text-xl font-bold mb-4 text-slate-500">FRIEND RANKINGS</h2>
            <div className="w-full border mt-4 bg-white shadow-md rounded-lg overflow-hidden">
                <RankingTable/>
            </div>
        </div >
    );
}

export default RankingPage