import React from 'react';

export default function Button({ name, type, handleClick }){

    return (
        <button 
            className=" bg-gray-100 my-2 mx-1 px-2 py-1 border border-gray-200 rounded"
            type={type || "submit"}
            onClick={handleClick}
        >
            {name}
        </button>
    )
}