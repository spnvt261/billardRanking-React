import { useState, useEffect, type ChangeEvent } from 'react';
import './CustomTextField.css';

interface CustomTextFieldProps {
    label: string;
    value?: string;
    type?: string;
    name?: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    helperText?: string;
    error?: boolean;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
    label,
    value: propValue,
    type = 'text',
    name,
    onChange,
    helperText,
    error = false,
}) => {
    const [value, setValue] = useState<string>(propValue || '');
    const [focus, setFocus] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        onChange(e);
    };

    const handleFocus = () => setFocus(true);
    const handleBlur = () => setFocus(false);

    useEffect(() => {
        setValue(`${propValue?propValue:''}`);
    }, [propValue]);

    const isActive = focus || value !== '';

    return (
        <div className={`custom-textfield ${error ? 'error' : ''}`}>
            <div className={`input-container ${isActive ? 'active' : ''} ${focus ? 'focus' : ''}`}>
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={isActive ? 'active' : ''}
                />
                <label className={isActive ? 'active' : ''}>{label}</label>
            </div>
            {helperText && <p className="helper-text">{helperText}</p>}
        </div>
    );
};

export default CustomTextField;
