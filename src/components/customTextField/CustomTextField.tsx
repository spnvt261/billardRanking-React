import { useState, useEffect, type ChangeEvent } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './CustomTextField.css';
import { viShort } from '../../ultils/locale-vi-short';
import { BiHide, BiShow } from 'react-icons/bi';

interface CustomTextFieldProps {
    label: string;
    value?: string;
    type?: string;
    name: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    helperText?: string;
    error?: boolean;
    className?: string;
}


const CustomTextField: React.FC<CustomTextFieldProps> = ({
    label,
    value: propValue,
    type = 'text',
    name,
    onChange,
    onBlur,
    helperText,
    error = false,
    className = ''
}) => {
    const [value, setValue] = useState<string>(propValue || '');

    const [focus, setFocus] = useState<boolean>(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [showPassword, setShowPassword] = useState<boolean>(false);

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
            <div className={`custom-textfield mb-4 file-input ${error ? 'error' : ''} ${className ? className : ''}`}>
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
            <div className={`custom-textfield mb-4 ${error ? 'error' : ''} ${className ? className : ''}`}>
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
                        className="react-datepicker-input cursor-pointer"
                        onFocus={()=>{handleFocus(); }}
                        onBlur={handleBlur}
                        onKeyDown={(e) => e.preventDefault()}
                        // readOnly
                    />
                    <label className={isActive ? 'active' : ''}>{label}</label>
                </div>
                {helperText && <p className="helper-text">{helperText}</p>}
            </div>
        );
    }
    //type default
    return (
        <div className={`custom-textfield mb-4 ${error ? 'error' : ''} ${className ? className : ''}`}>
            <div className={`input-container ${isActive ? 'active' : ''} ${error ? 'error' : ''} ${focus ? 'focus' : ''}`}>

                {
                    type === 'money' && <span className='money-type'>vnđ</span>
                }
                {
                    type === 'password' && (
                        <span
                            className='show-hide cursor-pointer select-none'
                            onClick={() => setShowPassword(prev => !prev)}
                        >
                            {showPassword ? <BiHide size={24} /> : <BiShow size={24} />}
                        </span>
                    )
                }
                <input
                    // type={type === 'money' ? 'tel' : type}
                    type={type === 'money' ? 'tel' : type === 'password' && showPassword ? 'text' : type}
                    inputMode={type === 'money' || type ==='number' ? 'numeric' : undefined}
                    name={name}
                    value={value || ''}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={(e) => {
                        handleBlur();
                        if (onBlur) onBlur(e);
                    }}
                    className={`${isActive ? 'active' : ''}` }
                    // disabled
                />
                <label className={isActive ? 'active' : ''}>{label}</label>
            </div>
            {helperText && <p className="helper-text">{helperText}</p>}
        </div>
    );
};

export default CustomTextField;
