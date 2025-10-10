import { useEffect, useRef} from "react";
// import { useCallback} from "react";
import "./RankingPage.css"
// import CustomButton from "../../components/customButtons/CustomButton";
// import { connect } from "react-redux";
// import viewActions from "../../redux/ui/viewActions";
import RankingTable from "../../components/table/ranking/RankingTable";
import AddPlayerForm from "../../components/forms/addPlayerForm/AddPlayerForm";
// import AddPlayerFormForwardRef ,{ type ChildHandle } from "../../components/forms/addPlayerForm/AddPlayerFormForwardRef";

const RankingPage = () => {
    // const { openAddPlayerForm } = props;
    console.log('RankingPage');
    // const btnRef = useRef<HTMLButtonElement>(null);
    // const formRef = useRef<ChildHandle>(null);

    // const btnAddPlayer = useCallback(() => {
    //     if (btnRef.current) {
    //         const rect = btnRef.current.getBoundingClientRect();
    //         const coords = { x: rect.x, y: rect.y,width:rect.width,height:rect.height };
    //         formRef.current?.updateCoords(coords);
            
    //         // console.log(coords);
    //     }
    //     openAddPlayerForm()

    // }, []);

    useEffect(() => {
        
    }, [])
    return (
        <div className="ranking-page pb-8">
            <h2 className="text-2xl font-bold mb-4">Friend Ranking</h2>
            
            {/* <CustomButton
                ref={btnRef}
                label="Thêm cơ thủ"
                variant="type-7"
                onClick={btnAddPlayer}
                needPermission
            /> */}
            <AddPlayerForm/>
            <div className="w-full border mt-4 bg-white shadow-md rounded-lg overflow-hidden">
                <RankingTable/>
            </div>
            {/* <AddPlayerFormForwardRef ref={formRef}/> */}
        </div >
    );
}

// const mapStateToProps = () => {
//     return {

//     }
// }

// const mapDispatchToProp = (dispatch: any) => {
//     return {
//         openAddPlayerForm: () => dispatch(viewActions.openAddPlayerForm())
//     }
// }

// export default connect(mapStateToProps, mapDispatchToProp)(RankingPage)
export default RankingPage