import React from 'react';

export const SearchInput = (props: IProps) => {
   return (
      <div className={`${props.className || ""}`}>
         <div className={`row`}>
            <input type="text"
               placeholder="Search"
               value={props.value}
               className="col m-0 p-0"
               onChange={props.onChange}
               disabled={props.disabled || false}
               onKeyDown={e => { if (e.key === 'Enter') props.onSearch(); }}
            />
            <button className={`col-auto m-0 btn-green btn radius-none-l 
                              ${props.value === '' ? 'search-all-icon' : "search-icon"}
                              ${props.btnClassName || ""}`}
               onClick={props.onSearch}
            />

         </div>
      </div>
   );
};

interface IProps {
   onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
   onSearch: () => void;
   value: string;
   className?: string;
   btnClassName?: string;
   disabled?: boolean;
}
export default SearchInput;