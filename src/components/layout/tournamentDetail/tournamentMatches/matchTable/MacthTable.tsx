import MatchCard from "../matchCard/MatchCard"

const MatchTable = ()=>{
    return(
        <div className="">
            <MatchCard
                team1Name="Sơn"
                team2Name="Tien"
                team1Score={3}
                team2Score={2}
            />
        </div>
    )
}

export default MatchTable