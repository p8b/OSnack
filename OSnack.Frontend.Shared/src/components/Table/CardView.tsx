import React from 'react';
import { TableData } from './Table';

const CardView = (props: IProps) => {
   return (
      <div className="row col-12  pm-0 justify-content-center ">
         {(props.data.rows().length > 0) &&
            props.data.rows().map(row =>
               <div key={Math.random()} className="col-11 col-sm-6  col-lg-4  btn btn-card">
                  <div className="card-view col-12 row pm-0">
                     {row.data.map((d, index) =>
                        <div key={Math.random()} className="row col-12 pm-0 pt-2 ">
                           {props.data.headers()[index].name != "" &&
                              <>
                                 <div className="col-4 pm-0 text-left pl-2 small-text text-gray" >{props.data.headers()[index].name}</div>
                                 {typeof d != "object" &&
                                    <span data-toggle="tooltip" data-placement="top" title={d}
                                       className="col-8 p-0 text-left small-text select-all-text line-limit-1">{d}</span>}
                                 {typeof d == "object" && d}
                              </>
                           }
                           {props.data.headers()[index].name == "" && d}
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
   className?: string;
   data: TableData;
   defaultSortName?: string;
}
export default CardView;
