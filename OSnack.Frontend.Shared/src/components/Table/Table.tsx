import React, { useEffect, useState } from 'react';
import CardView from './CardView';
import RowView from './RowView';

const Table = (props: IProps) => {
   const [currentView, setCurrentViews] = useState(TableView.CardView);
   const [isSortAsc, setIsSortAsc] = useState(true);
   const [selectedSortName, setSelectedSortName] = useState(props.defaultSortName);

   useEffect(() => {
      setSelectedSortName(props.defaultSortName);
   }, [props.defaultSortName]);


   useEffect(() => {
      setCurrentViews(props.view || TableView.CardView);
   }, []);

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
      <>
         <div className="row col-12 pm-0">

            <div className="col text-left text-gray"
               children={props.listCount != undefined ? `Total items: ${props.listCount}` : ""} />

            {currentView == TableView.CardView && props.data.headers != null && props.data.headers.length > 0 &&
               <div className="col-auto">
                  {
                     props.data.headers.filter(h => h.isSortable).map(header =>
                        <span key={Math.random()} onClick={() => sort(header.sortName)}
                           className={`col ${getSortedColCss(header.sortName)}`}>
                           <span className="table-header-sort font-weight-bold">{header.name}</span>
                        </span>)
                  }
               </div>
            }
            <div className="row col pm-0">
               <div className="row col-auto pm-0 ml-auto ">
                  <button className={`btn-no-style table-card-icon cursor-pointer ${currentView != TableView.CardView ? "disabled" : ""}`} onClick={() => setCurrentViews(TableView.CardView)} />
                  <button className={`btn-no-style table-row-icon cursor-pointer ${currentView != TableView.RowView ? " disabled" : ""}`} onClick={() => setCurrentViews(TableView.RowView)} />
               </div>
            </div>
         </div>
         {currentView == TableView.CardView &&
            <CardView className={props.className}
               defaultSortName={props.defaultSortName}
               data={props.data}
               onSortClick={props.onSortClick}
            />}
         {currentView == TableView.RowView &&
            <RowView className={props.className}
               defaultSortName={props.defaultSortName}
               data={props.data}
               onSortClick={props.onSortClick}
            />}
      </>
   );

};


interface IProps {
   onSortClick?: (isSortAsce: boolean, selectedSortName: string) => void;
   className?: string;
   data: TableData;
   listCount?: number;
   defaultSortName?: string;
   view?: TableView;
   colGroup?: any;
   postRow?: any;
}
export default Table;



export enum TableView {
   RowView = 0,
   CardView = 1
}

export class TableData {
   rows: TableRowData[] = [];
   headers: TableHeaderData[] = [];
}

export class TableHeaderData {
   name = "";
   sortName = "";
   isSortable = false;
   constructor(name: string, sortName: string = "", isSortable: boolean = false) {
      this.name = name;
      this.sortName = sortName;
      this.isSortable = isSortable;
   }
}

export class TableRowData {
   data: any[] = [];
   constructor(data: any[]) {
      this.data = data;
   }
}
