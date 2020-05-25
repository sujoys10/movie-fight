import React from 'react';

export default function Button({ name, type, handleClick }){

    return (
        <button 
            className=" bg-gray-100 my-2 px-2 py-1 border border-gray-200 rounded shadow-md"
            type={type || "submit"}
            onClick={handleClick}
        >
            {name}
        </button>
    )
}