import React from 'react';
import { InputText, InputTextProps } from './InputText';

export const InputNumber: React.FC<InputTextProps> = (props) => {
    return <InputText type="number" {...props} />;
};
