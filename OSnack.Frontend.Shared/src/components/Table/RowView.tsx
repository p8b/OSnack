import React, { useEffect, useState } from 'react';
import { TableData } from './Table';

const RowView = (props: IProps) => {
   const [isSortAsc, setIsSortAsc] = useState(true);
   const [selectedSortName, setSelectedSortName] = useState(props.defaultSortName);

   useEffect(() => {
      setSelectedSortName(props.defaultSortName);
   }, [props.defaultSortName]);

   const sort = (sortName: string) => {
      if (selectedSortName === sortName) {
         setIsSortAsc(!isSortAsc);
         props.onSortClick!(!isSortAsc, selectedSortName);
      } else {
         setSelectedSortName(sortName);
         props.onSortClick!(isSortAsc, sortName);
      }
   };

   const getSortedColCss = (sortName: string) => {
      return selectedSortName === sortName ?
         !isSortAsc ? "sort-numeric-down-icon" : "sort-numeric-up-icon"
         : "sortable-icon-light";
   };

   return (
      <div className={`table-responsive`}>
         <table className={`table ${props.className} `}>
            {props?.colGroup}
            <thead>
               <tr>
                  {(props.data.headers != null && props.data.headers.length > 0) &&
                     props.data.headers.map(header =>
                        header.isSortable ?
                           <th key={Math.random()}>
                              <span onClick={() => sort(header.sortName)}
                                 className={`col ${getSortedColCss(header.sortName)}`}>
                                 <span className="table-header-sort">{header.name}</span>
                              </span>
                           </th>
                           :
                           <th key={Math.random()}>
                              <span className="col table-header" >{header.name}</span>
                           </th>
                     )
                  }
               </tr>
            </thead>
            {(props.data.rows && props.data.rows.length > 0) &&
               <tbody>
                  {props.data.rows.map(row =>
                     <tr key={Math.random()}>
                        {row.data.map(d =>
                           <td className="align-middle" key={Math.random()} >
                              {(typeof d === "string") &&
                                 <span data-toggle="tooltip" data-placement="top" title={d} className="select-all-text line-limit-1">{d}</span>
                              }
                              {(typeof d !== "string") && d}
                           </td>
                        )}
                     </tr>
                  )}
                  {props.postRow && props.postRow}
               </tbody>
            }
         </table>
      </div >
   );
};


interface IProps {
   onSortClick?: (isSortAsce: boolean, selectedSortName: string) => void;
   className?: string;
   data: TableData;
   defaultSortName?: string;
   colGroup?: any;
   postRow?: any;
}
export default RowView;
