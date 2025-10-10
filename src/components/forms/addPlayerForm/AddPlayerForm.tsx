import { useState, type ChangeEvent } from "react"
import CustomButton from "../../customButtons/CustomButton";
import CustomTextField from "../../customTextField/CustomTextField";

interface Props {
    btnCancel: () => void;
}
const addPlayerForm = ({ btnCancel }: Props) => {
    console.log('ContentForm');

    const [newPlayer, setNewPlayer] = useState<object>({})
    const textFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewPlayer({
            ...newPlayer,
            [e.target.name]: e.target.value,
        })
    }
    const btnConfirmAddPlayer = () => {
        const updated = {
            ...newPlayer,
        };
        setNewPlayer(updated);
        console.log(updated);
    }
    return (
        <form className="flex flex-col">
            <CustomTextField
                label="Tên"
                name="name"
                onChange={textFieldChange}
            />
            <CustomTextField
                label="Image"
                name="image"
                type="file"
                onChange={textFieldChange}
            />
            <div className="flex justify-end mt-4">
                <CustomButton
                    label='Hủy'
                    variant="type-4"
                    onClick={btnCancel}
                    className="mr-2"
                />
                <CustomButton
                    label='Lưu'
                    variant="type-2"
                    onClick={btnConfirmAddPlayer}
                    needPermission
                />
            </div>
        </form>
    )
}
export default addPlayerForm