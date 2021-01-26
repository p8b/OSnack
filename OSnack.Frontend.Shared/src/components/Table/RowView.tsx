import React from 'react';
import { ITableData } from './Table';

const RowView = (props: IProps) => {
   const sort = (sortName: string) => {
      if (props.tableData.sortName === sortName)
         props.onChange(!props.tableData.isSortAsc);
      else
         props.onChange(undefined, sortName);
   };

   const getSortedColCss = (sortName: string) => {
      return props.tableData.sortName === sortName ?
         !props.tableData.isSortAsc ? "sort-numeric-down-icon" : "sort-numeric-up-icon"
         : "sortable-icon-light";
   };

   return (
      <div className={`table-responsive`}>
         <table className={`table ${props.className} `}>
            {props?.colGroup}
            <thead>
               <tr>
                  {props.tableData.data.headers().length > 0 &&
                     props.tableData.data.headers().map((header, index) =>
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
            {props.tableData.data.rows().length > 0 &&
               <tbody>
                  {props.tableData.data.rows().map((row, index) =>
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
   onChange: (isAsc?: boolean, sortName?: string) => void;
   className?: string;
   tableData: ITableData;
   colGroup?: any;
   postRow?: any;
}
export default RowView;
