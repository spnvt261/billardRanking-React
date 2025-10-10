import { useState } from "react";
import CustomSelect from "../../components/customSelect/CustomSelect";
import CustomButton from "../../components/customButtons/CustomButton";


const OverallPage = () => {
    console.log('OverallPages');
    const [selected, setSelected] = useState<string[]>([]);

    const options = [
        { label: "Football", value: "football" },
        { label: "Basketball", value: "basketball" },
        { label: "Tennis", value: "tennis" },
        { label: "Badminton", value: "badminton" },
        { label: "Football2", value: "football2" },
        { label: "Basketball2", value: "basketball2" },
        { label: "Tennis2", value: "tennis2" },
        { label: "Badminton2", value: "badminton3" },
        { label: "Football3", value: "football22" },
        { label: "Basketball3", value: "basketball22" },
        { label: "Tennis3", value: "tennis2" },
        { label: "Badminton3", value: "badminton22" },
    ];
    return (
        <div className="overall-page">
            <h1>Overall</h1>
            <h1 className="text-xl font-bold">Multi Select Example</h1>
            <CustomSelect
                options={options}
                value={selected}
                onChange={setSelected}
                multiple
                placeholder="Select your favorite sports"
            />
            <p className="mt-2 text-gray-700">
                Selected: {selected.length > 0 ? selected.join(", ") : "None"}
            </p>
            <CustomButton
                label='Test'
                variant= 'type-7'
            />
        </div>
    )
}

export default OverallPage