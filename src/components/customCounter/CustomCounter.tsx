import React, { useState, useEffect } from "react";
import "./CustomCounter.css";
import CustomButton from "../customButtons/CustomButton";

interface CounterProps {
    minValue?: number;
    maxValue?: number;
    value?: number;
    step?: number;
    onChange?: (value: number) => void;
    disabled?: boolean;
    className?: string
}

const CustomCounter: React.FC<CounterProps> = ({
    minValue = 0,
    maxValue = 100,
    value = 0,
    step = 1,
    onChange,
    disabled = false,
    className,
}) => {
    const [count, setCount] = useState<number>(value);

    useEffect(() => {
        setCount(value);
    }, [value]);

    const handleIncrease = () => {
        if (count + step <= maxValue) {
            const newValue = count + step;
            setCount(newValue);
            onChange?.(newValue);
        }
    };

    const handleDecrease = () => {
        if (count - step >= minValue) {
            const newValue = count - step;
            setCount(newValue);
            onChange?.(newValue);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        // 🧩 Nếu người dùng xóa hết => tự động set lại = 1
        if (val.trim() === "") {
            const defaultValue = Math.max(minValue, 1);
            setCount(defaultValue);
            onChange?.(defaultValue);
            return;
        }
        if (val === "") {
            setCount(NaN);
            return;
        }
        const newValue = Number(val);
        if (!isNaN(newValue) && newValue >= minValue && newValue <= maxValue) {
            setCount(newValue);
            onChange?.(newValue);
        }
    };

    return (
        <div className={`counter-container ${disabled ? "disabled" : ""} ${className}`}>
            <CustomButton
                label="-"
                variant="type-4"
                onClick={handleDecrease}
                textPadding=".1rem .6rem"
            />
            <input
                type="number"
                inputMode="numeric"
                value={isNaN(count) ? "" : count}
                onChange={handleInputChange}
                min={minValue}
                max={maxValue}
                disabled={disabled}
                className="counter-input"
            />
            <CustomButton
                label="+"
                variant="type-2"
                onClick={handleIncrease}
                textPadding=".1rem .6rem"
            />
        </div>
    );
};

export default CustomCounter;
