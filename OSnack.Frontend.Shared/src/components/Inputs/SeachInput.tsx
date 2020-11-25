import React from 'react';

export const SearchInput = (props: IProps) => {
   return (
      <div className={`${props.className || ""}`}>
         <div className={`row`}>
            <input type="text"
               placeholder="Search"
               defaultValue={props.value}
               className="col m-0 p-0"
               onChange={props.onChange}
               disabled={props.disabled || false}
               onKeyDown={e => { if (e.key === 'Enter') props.onSearch(); }}
            />
            <div className={`col-auto m-0 btn-green btn-lg radius-none-l ${props.value === '' ? 'search-all-icon' : "search-icon"}`}
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
   disabled?: boolean;
}
export default SearchInput;