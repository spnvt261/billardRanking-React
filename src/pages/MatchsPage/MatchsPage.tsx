import AddMatchForm from "../../components/forms/addMatchForm/AddMatchForm";
import FormToggle from "../../components/forms/FormToggle";
import MatchesHistoryTable from "../../components/table/matchs/MatchsHistoryTable";

const MatchesPage = () =>{
    // console.log('Matches Pages');
    
    return(
        <div className="matches-page">
            <FormToggle
                btnLabel="Thêm trận"
                formTitle="Thêm trận đã ấn định tỉ số"
                element={AddMatchForm}
                className="mb-4"
                needPermission
            />
            <h2 className="text-xl font-bold mb-4 text-slate-500">MATCHES HISTORY</h2>
            <MatchesHistoryTable/>
        </div>
    )
}

export default MatchesPage