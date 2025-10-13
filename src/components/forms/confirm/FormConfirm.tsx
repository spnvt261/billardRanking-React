import CustomButton from "../../customButtons/CustomButton"

interface Props{
    btnCancel: ()=>void;
    label:string;
    onConfirm: () => void;
}
const FormConfirm = ({btnCancel,label,onConfirm}:Props) => {
    return (
        <form className="flex flex-col">
            <h2>{label}</h2>
            <div className="flex justify-end mt-2">
                <CustomButton
                    label="Hủy"
                    variant="type-4"
                    className="mr-2 mb-0"
                    onClick={btnCancel}
                    type="button"
                />
                <CustomButton
                    label="Xác nhận"
                    variant="type-2"
                    type="button" 
                    className="mb-0"
                    onClick={onConfirm}
                />
            </div>
        </form>
    )
}

export default FormConfirm