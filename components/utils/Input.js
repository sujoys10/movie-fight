import React, { Fragment } from 'react';

export default function Input({ name, required, type, placeholder, value, handleChange, label }){
    return (
        <Fragment>
            { label && 
                <label htmlFor={name} className="my-1">{label}</label> }
            <input
                className="my-1 p-1 w-full rounded-sm text-black"
                name={name}
                required={required} 
                type={type || "text"}
                placeholder={placeholder || ''}
                value={value}
                onChange={handleChange}
            />
        </Fragment>
    )
}