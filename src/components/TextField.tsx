interface TextFieldProps {
    type: string;
    value: string;
    className: string;
    onChange: (event : React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export default function TextField({type, value, className, onChange, onBlur }: TextFieldProps) {
    return(
        <input type={type} value={value} className={className} onChange={onChange} onBlur={onBlur}/>
    )
}