import React, { createContext, useState } from "react";

export const myContext = createContext();

export const CreateContextProvider = (props) => {
    const [id, setId] = useState('');

    return (
        <myContext.Provider value={{ id, setId }}>
            {props.children}
        </myContext.Provider>
    );
};