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
         props.onSortClick!(1, !isSortAsc, selectedSortName);
      } else {
         setSelectedSortName(sortName);
         props.onSortClick!(1, isSortAsc, sortName);
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
                  {props.data.headers().length > 0 &&
                     props.data.headers().map((header, index) =>
                        header.sortName != undefined ?
                           <th key={index}>
                              <span onClick={() => sort(header.sortName!)}
                                 className={`col ${getSortedColCss(header.sortName)}`}>
                                 <span className="table-header-sort text-nowrap">{header.name}</span>
                              </span>
                           </th>
                           :
                           <th key={index}>
                              <span className="col table-header text-nowrap" >{header.name}</span>
                           </th>
                     )
                  }
               </tr>
            </thead>
            {props.data.rows().length > 0 &&
               <tbody>
                  {props.data.rows().map((row, index) =>
                     <tr key={index}>
                        {row.data.map((d, index1) =>
                           <td className="align-middle" key={index1} >
                              {React.isValidElement(d) ? d :
                                 <span data-toggle="tooltip" data-placement="top"
                                    title={d}
                                    className="select-all-text line-limit-1"
                                    children={d} />
                              }
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
   onSortClick?: (selectedPage: number, isSortAsce: boolean, selectedSortName: string) => void;
   className?: string;
   data: TableData;
   defaultSortName?: string;
   colGroup?: any;
   postRow?: any;
}
export default RowView;
