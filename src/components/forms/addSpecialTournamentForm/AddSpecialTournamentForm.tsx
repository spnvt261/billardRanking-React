import { useEffect, useState, type ChangeEvent } from "react";
import CustomTextField from "../../customTextField/CustomTextField";
import CustomSelect from "../../customSelect/CustomSelect";
import CustomButton from "../../customButtons/CustomButton";
import { listplayerSelect } from "../../../data/tournamentData";

interface Props {
    btnCancel:()=>void;
    showLoading?: (show: boolean) => void;
    isLoading?: boolean;
}

const AddSpecialTournamentForm = ({btnCancel,showLoading,isLoading}:Props) =>{
    useEffect(() => {
        if (isLoading&& showLoading) {
            showLoading(isLoading)
        }
    }, [isLoading])
    
    const [newTournament, setNewTournament] = useState<object>({})
        const [listPlayerSelected, setListPlayerSelected] = useState<string[]>([]);
        const textFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
            setNewTournament({
                ...newTournament,
                [e.target.name]: e.target.value,
            })
        }
        const btnConfirmAddTournament = () => {
            const updated = {
                ...newTournament,
                listPlayerId: listPlayerSelected,
                listType: 'Đền',
            };
            setNewTournament(updated);
            // console.log(updated);
        }
    return(
        <form className='flex flex-col'>
            <CustomTextField
                label='Ngày*'
                name='date'
                type='date'
                onChange={textFieldChange}
            />
            <CustomTextField
                label='Địa điểm'
                name='location'
                type='text'
                onChange={textFieldChange}
            />
            <CustomTextField
                label='Bao tiền 1 điểm'
                name='prize'
                type='money'
                onChange={textFieldChange}
            />
            <div className='flex mb-4 max-h-[40px]'>
                <div className='flex items-center mr-[0.3rem]'>
                    <p>Players* </p>
                </div>
                <CustomSelect
                    options={listplayerSelect}
                    value={listPlayerSelected}
                    onChange={setListPlayerSelected}
                    multiple
                    placeholder='Thêm người chơi'
                    className='mb-[0] flex-1 w-[70%]'
                    spanMaxWidth='150px'
                />
            </div>
            <div className='flex justify-end mt-[7rem]'>
                <CustomButton
                    label='Hủy'
                    variant='type-4'
                    className='mr-2'
                    onClick={btnCancel}
                />
                <CustomButton
                    label='Tạo'
                    variant='type-2'
                    onClick={btnConfirmAddTournament}
                    needPermission
                />
            </div>
        </form>
    )
}

export default AddSpecialTournamentForm