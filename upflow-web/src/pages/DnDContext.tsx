import {createContext, useContext, useState} from 'react';

const DnDContext = createContext([null, (_: any) => {
}]);

export const DnDProvider = ({children}: { children: any }) => {
    const [type, setType] = useState(null);

    return (
        // @ts-ignore
        <DnDContext.Provider value={[type, setType]}>
            {children}
        </DnDContext.Provider>
    );
}

export default DnDContext;

export const useDnD = () => {
    return useContext(DnDContext);
}