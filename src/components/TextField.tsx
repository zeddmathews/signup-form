
export default function TextField({type, value, className, onChange, onBlur }: React.InputHTMLAttributes<HTMLInputElement>) {
    return(
        <input  type={type} value={value} className={className} onChange={onChange} onBlur={onBlur}/>
    )
}