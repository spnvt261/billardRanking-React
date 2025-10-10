import { useState, useEffect, type ChangeEvent } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './CustomTextField.css';
import { viShort } from '../../ultils/locale-vi-short';

interface CustomTextFieldProps {
    label: string;
    value?: string;
    type?: string;
    name: string;
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
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (type === 'money') {
            const numericValue = e.target.value.replace(/[^\d]/g, '');
            setValue(numericValue ? parseInt(numericValue, 10).toLocaleString('vi-VN') : '');
            e.target.value = numericValue;
            onChange(e);
            return;
        }
        setValue(e.target.value);
        onChange(e);
    };

    const handleFocus = () => setFocus(true);
    const handleBlur = () => setFocus(false);

    const isActive = focus || (value !== '' && type !== 'file') || (type === 'date' && selectedDate !== null);

    useEffect(() => {
        if (type !== 'file') {
            setValue(`${propValue ? propValue : ''}`);
        }
    }, [propValue]);
    //type = file
    if (type === 'file') {
        return (
            <div className={`custom-textfield file-input ${error ? 'error' : ''}`}>
                <label htmlFor={name} className={`file-label active`}>{label}</label>
                <input
                    id={name}
                    type="file"
                    name={name}
                    onChange={handleChange}
                    className="file-upload-input"
                />
                {helperText && <p className="helper-text">{helperText}</p>}
            </div>
        );
    }
    //type=date
    if (type === 'date') {
        return (
            <div className={`custom-textfield ${error ? 'error' : ''}`}>
                <div className={`input-container ${isActive ? 'active' : ''} ${focus ? 'focus' : ''}`}>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => {
                            setSelectedDate(date);
                            if (date) {
                                const event = {
                                    target: {
                                        name,
                                        value: date.toISOString().split('T')[0]
                                    }
                                } as unknown as ChangeEvent<HTMLInputElement>;
                                onChange(event);
                            }
                        }}
                        dateFormat="dd/MM/yyyy"
                        locale={viShort}
                        className="react-datepicker-input"
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    />
                    <label className={isActive ? 'active' : ''}>{label}</label>
                </div>
                {helperText && <p className="helper-text">{helperText}</p>}
            </div>
        );
    }
    //type default
    return (
        <div className={`custom-textfield ${error ? 'error' : ''}`}>
            <div className={`input-container ${isActive ? 'active' : ''} ${focus ? 'focus' : ''}`}>

                {
                    type === 'money' && <span className='money'>vnđ</span>
                }
                <input
                    type={type === 'money' ? 'tel' : type}
                    inputMode={type === 'money' ? 'numeric' : undefined}
                    name={name}
                    value={value || ''}
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
