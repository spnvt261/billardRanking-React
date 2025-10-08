import viewTypes from "./viewTypes"

const openAddPlayerForm =()=>{
    return{
        type: viewTypes.OPEN_ADD_PLAYER_FORM,
        payload:null,
    }
}

const closeAddPlayerForm =()=>{
    return{
        type: viewTypes.CLOSE_ADD_PLAYER_FORM,
        payload:null,
    }
}

const viewActions ={
    openAddPlayerForm,
    closeAddPlayerForm
}

export default viewActions