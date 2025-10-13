import { useEffect, useState, type ChangeEvent } from "react"
import CustomTextField from "../../customTextField/CustomTextField";
import { listplayerSelect, listTypeTournament } from "../../../data/tournamentData";
import CustomSelect from "../../customSelect/CustomSelect";
import CustomButton from "../../customButtons/CustomButton";

interface Props {
    btnCancel: () => void;
    showLoading?: (show: boolean) => void;
    isLoading?: boolean;
}
const AddTournamentForm = ({ btnCancel,showLoading,isLoading }: Props) => {
    useEffect(() => {
        if (isLoading&& showLoading) {
            showLoading(isLoading)
        }
    }, [isLoading])
    const [newTournament, setNewTournament] = useState<object>({})
    const [listPlayerSelected, setListPlayerSelected] = useState<string[]>([]);
    const [listTypeTournamentSelected, setListTypeTournamentSelected] = useState<string[]>([]);
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
            listType: listTypeTournamentSelected,
        };
        setNewTournament(updated);
        console.log(updated);
    }
    return (
        <form className='flex flex-col'>
            <CustomTextField
                label='Tên giải đấu*'
                name='name'
                onChange={textFieldChange}
            />
            <CustomTextField
                label='Banner'
                name='banner'
                type='file'
                onChange={textFieldChange}
            />
            <CustomTextField
                label='Ngày bắt đầu*'
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
                label='Tổng giải thưởng'
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
            <div className='flex mb-4 max-h-[40px]'>
                <div className='flex items-center mr-[0.3rem]'>
                    <p>Thể thức* </p>
                </div>
                <CustomSelect
                    options={listTypeTournament}
                    value={listTypeTournamentSelected}
                    onChange={setListTypeTournamentSelected}
                    multiple
                    placeholder='Chọn thể thức'
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
export default AddTournamentForm