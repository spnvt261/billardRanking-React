import AddTournamentForm from "../../components/forms/addTournamentForm/AddTournamentForm"

const CreateTournamentPage = () => {
    return (
        <div>
            <h1>CREATE TOURNAMENT PAGES</h1>
            <div className="w-[700px] border shadow p-3">
                <AddTournamentForm
                    btnCancel={() => { }}
                />
            </div>

        </div>
    )
}

export default CreateTournamentPage