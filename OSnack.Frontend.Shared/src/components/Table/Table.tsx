import React, { useEffect, useState } from 'react';
import InputDropdown from '../Inputs/InputDropDown';
import CardView from './CardView';
import RowView from './RowView';
import { ConstMaxNumberOfPerItemsPage } from "../../_core/appConst";
import Pagination from '../Pagination/Pagination';

const Table = (props: IProps) => {
   const [currentView, setCurrentViews] = useState(props.defaultTableView ?? TableView.CardView);
   useEffect(() => {
      sizeChange();
      window.addEventListener("resize", sizeChange);
      return () => {
         window.removeEventListener("resize", sizeChange);
      };
   }, []);
   const sizeChange = () => {
      if (window.screen.width <= 650)
         setCurrentViews(TableView.CardView);
      else
         setCurrentViews(TableView.RowView);

   };
   const sort = (sortName: string) => {
      if (props.tableData.sortName === sortName) {
         props.onChange(1, undefined, !props.tableData.isSortAsc);
      } else {
         props.onChange(1, undefined, undefined, sortName);
      }
   };
   const getSortedColCss = (sortName: string) => {
      return props.tableData.sortName === sortName ?
         !props.tableData.isSortAsc ? "sort-numeric-down-icon" : "sort-numeric-up-icon"
         : "sortable-icon-light";
   };

   return (
      <div className={`row col-12 pm-0 mt-3 pb-2 ${props.className}`}>
         <div className="row col-12 pm-0  border-bottom-1 pt-1">
            {currentView == TableView.CardView && props.tableData.data.headers().length > 0 &&
               <InputDropdown dropdownTitle={`Sort By: ${props.tableData.data.headers().find(t => t.sortName == props.tableData.sortName)?.name}`}
                  className="col-12  col-md-auto pm-0 pb-0 "
                  titleClassName={`btn ${!props.tableData.isSortAsc ? "sort-numeric-down-icon" : "sort-numeric-up-icon"}`}>
                  {props.tableData.data.headers().filter(h => h.sortName != undefined).map((header, index) =>
                     <button key={index} className={`dropdown-item ${getSortedColCss(header.sortName!)}`}
                        onClick={() => { sort(header.sortName!); }}>
                        {header.name}
                     </button>
                  )}
               </InputDropdown>
            }
            <div className="row col-12 col-md-auto ml-md-auto">
               <button className={`btn-no-style table-card-icon cursor-pointer ${currentView != TableView.CardView ? "disabled" : ""}`}
                  onClick={() => setCurrentViews(TableView.CardView)} />
               <button className={`btn-no-style table-row-icon cursor-pointer ${currentView != TableView.RowView ? " disabled" : ""}`}
                  onClick={() => setCurrentViews(TableView.RowView)} />
               <div className="col-auto pm-0 ml-auto small-text text-gray mt-auto mb-auto"
                  children={props.tableData.totalItemCount != undefined ? `Total items: ${props.tableData.totalItemCount}` : ""} />
            </div>
         </div>
         {currentView == TableView.CardView &&
            <CardView className={props.tblClassName} tableData={props.tableData} />
         }
         {currentView == TableView.RowView &&
            <RowView className={props.tblClassName} tableData={props.tableData}
               onChange={(isAsc, sortName) => {
                  props.onChange(1, undefined, isAsc, sortName);
               }} />}

         {props.disablePagination != true &&
            <Pagination
               maxItemsPerPage={props.tableData.maxItemsPerPage}
               selectedPage={props.tableData.selectedPage}
               listCount={props.tableData.totalItemCount}
               onChange={(selectedPage, maxItemsPerPage) => {
                  props.onChange(selectedPage, maxItemsPerPage);
               }}
            />
         }
      </div>
   );

};

interface IProps {
   onChange: (selectedPage: number, MaxItemsPerPage?: number, isAsc?: boolean, sortName?: string) => void;
   className?: string;
   tblClassName?: string;
   tableData: ITableData;
   defaultTableView?: TableView;
   colGroup?: any;
   postRow?: any;
   disablePagination?: boolean;
}
export default Table;

export interface ITableData {
   data: TableData,
   sortName: string,
   isSortAsc: boolean,
   totalItemCount: number,
   selectedPage: number,
   maxItemsPerPage: number,
}


export const useTableData = (
   defaultSortName: string = "",
   defaultIsSortAsc: boolean = false,
   defaultMaxItemPerPage: number = ConstMaxNumberOfPerItemsPage,
   defaultTotalItemCount: number = 0,
   defaultSelectedPage: number = 1
) => {
   const [data, setData] = useState(new TableData());
   const [sortName, setSortName] = useState(defaultSortName);
   const [isSortAsc, setIsSortAsc] = useState(defaultIsSortAsc);
   const [totalItemCount, setTotalItemCount] = useState(defaultTotalItemCount);
   const [selectedPage, setSelectedPage] = useState(defaultSelectedPage);
   const [maxItemsPerPage, setMaxItemsPerPage] = useState(defaultMaxItemPerPage);
   return {
      data, setData,
      sortName, setSortName,
      isSortAsc, setIsSortAsc,
      totalItemCount, setTotalItemCount,
      selectedPage, setSelectedPage,
      maxItemsPerPage, setMaxItemsPerPage
   };
};


export enum TableView {
   RowView = 0,
   CardView = 1
}

export class TableData {
   private datarows: TableRowData[] = [];
   private dataheaders: TableHeaderData[] = [];
   rows = () => this.datarows;
   headers = () => this.dataheaders;

   AddHeader = (header: string, sortName?: string) => {
      this.dataheaders.push(new TableHeaderData(header, sortName));
      return this;
   };
   AddRow = (data: any[]) => {
      if (data.length - this.dataheaders.length != 0)
         for (var i = 0; i <= data.length - this.dataheaders.length; i++)
            this.dataheaders.push(new TableHeaderData(""));
      this.datarows.push(new TableRowData(data));
   };
}

export class TableHeaderData {
   name: string;
   sortName?: string;
   constructor(name: string, sortName?: string) {
      this.name = name;
      this.sortName = sortName;
   }

}

export class TableRowData {
   data: any[] = [];
   constructor(data: any[]) {
      this.data = data;
   }
}
