import React from 'react';
import { TableData } from './Table';

const CardView = (props: IProps) => {




   return (

      <div className="row justify-content-center pm-0">
         {(props.data.rows && props.data.rows.length > 0) &&
            props.data.rows.map(row =>
               <div key={Math.random()} className="btn btn-card">
                  <div className=" card-view col-12 row pm-0">
                     {row.data.map((d, index) =>
                        <div key={Math.random()} className="row col-12 pm-0 pt-2 ">
                           {props.data.headers[index].name != "" &&
                              <>
                                 <div className="col-4 pm-0 text-left pl-2 small-text text-gray" >{props.data.headers[index].name}</div>
                                 <span data-toggle="tooltip" data-placement="top" title={d} className="col-8 p-0 text-left small-text select-all-text line-limit-1">{d}</span>
                              </>
                           }
                           {props.data.headers[index].name == "" && d}
                        </div>
                     )}
                  </div>
               </div>
            )
         }
      </div>
   );
};


interface IProps {
   onSortClick?: (isSortAsce: boolean, selectedSortName: string) => void;
   className?: string;
   data: TableData;
   defaultSortName?: string;
}
export default CardView;
