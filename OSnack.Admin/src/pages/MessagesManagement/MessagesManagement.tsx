import SearchInput from 'osnack-frontend-shared/src/components/Inputs/SeachInput';
import Pagination from 'osnack-frontend-shared/src/components/Pagination/Pagination';
import Table, { TableData, TableView, useTableData } from 'osnack-frontend-shared/src/components/Table/Table';
import TableRowButtons from 'osnack-frontend-shared/src/components/Table/TableRowButtons';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { checkUri, generateUri } from 'osnack-frontend-shared/src/_core/appFunc';
import { GetAllRecords } from 'osnack-frontend-shared/src/_core/constant.Variables';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Container from '../../components/Container';
import { usePutSecretCommunication, useSearchCommunication, useDeleteCommunication } from '../../SecretHooks/useCommunicationHook';
import { Access } from '../../_core/appConstant.Variables';
import CommunicationModal from 'osnack-frontend-shared/src/components/Modals/CommunicationModal';
import { Communication } from 'osnack-frontend-shared/src/_core/apiModels';
import DropDown from 'osnack-frontend-shared/src/components/Buttons/DropDown';



const MessagesManagement = (props: IProps) => {
   const isUnmounted = useRef(false);
   const history = useHistory();
   const errorAlert = useAlert(new AlertObj());
   const tbl = useTableData("Date", true);
   const [searchValue, setSearchValue] = useState("");
   const [selectCommunication, setSelectCommunication] = useState(new Communication());
   const [isOpenMessageModal, setIsOpenMessageModal] = useState(false);

   useEffect(() => {
      onSearch(...checkUri(window.location.pathname,
         [tbl.selectedPage, tbl.maxItemsPerPage, tbl.isSortAsc, tbl.sortName, GetAllRecords]));
      return () => { isUnmounted.current = true; };
   }, []);



   const onSearch = (
      selectedPage = tbl.selectedPage,
      maxItemsPerPage = tbl.maxItemsPerPage,
      isSortAsc = tbl.isSortAsc,
      sortName = tbl.sortName,
      searchString = GetAllRecords
   ) => {

      if (searchValue != null && searchValue != "")
         searchString = searchValue;
      if (searchString != GetAllRecords)
         setSearchValue(searchString);

      if (selectedPage != tbl.selectedPage)
         tbl.setSelectedPage(selectedPage);

      if (isSortAsc != tbl.isSortAsc)
         tbl.setIsSortAsc(isSortAsc);

      if (sortName != tbl.sortName)
         tbl.setSortName(sortName);

      if (selectedPage != undefined && selectedPage != tbl.selectedPage)
         tbl.setSelectedPage(selectedPage);

      if (maxItemsPerPage != tbl.maxItemsPerPage)
         tbl.setMaxItemsPerPage(maxItemsPerPage);

      history.push(generateUri(window.location.pathname,
         [selectedPage || tbl.selectedPage,
            maxItemsPerPage, Number(isSortAsc), sortName, searchString != GetAllRecords ? searchString : ""]));

      errorAlert.pleaseWait(isUnmounted);
      useSearchCommunication(selectedPage, maxItemsPerPage, searchString, isSortAsc, sortName).then(result => {
         if (isUnmounted.current) return;
         tbl.setTotalItemCount(result.data.totalCount || 0);
         errorAlert.clear();
         populateOrderTable(result.data.communicationList!);
      }).catch(errors => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
      });
   };
   const populateOrderTable = (communicationList: Communication[]) => {
      if (communicationList.length == 0) {
         errorAlert.setSingleWarning("0", "No Result Found");
         return;
      }
      errorAlert.clear();
      let tData = new TableData();
      tData.AddHeader("Date", "Date")
         .AddHeader("FullName", "FullName")
         .AddHeader("Email", "Email")
         .AddHeader("Status", "IsOpen");

      communicationList.map(message =>
         tData.AddRow([
            new Date(message.date!).ToShortDate(),
            message.fullName,
            message.email,
            message.status ? "Open" : "Closed",
            <TableRowButtons
               btnClassName="btn-white dispute-icon"
               btnClick={() => {
                  setSelectCommunication(message);
                  setIsOpenMessageModal(true);
               }}
            />
         ]));
      tbl.setData(tData);
   };

   return (
      <Container className="container-fluid ">
         <PageHeader title="Contact Us Message" className="hr-section-sm line-limit-1" />
         <div className="row col-12 py-3 mx-auto bg-white">
            <SearchInput
               className="col-12 col-md-9 pr-md-4"
               value={searchValue}
               onChange={i => setSearchValue(i.target.value)}
               onSearch={() => { onSearch(1); }}
            />

            <DropDown title={`Status Type: ${"All"}`}
               className="col-12 col-md-3 pm-0 "
               titleClassName="btn btn-white filter-icon">
               <button className="dropdown-item"
                  onClick={() => { /*onSearch(1, undefined); */ }} >
                  All
                  </button>
               {/***** {OrderStatusTypeList.filter(o => availableStatusTypeList.includes(o.Value))?.map(statusType =>
                  <button className="dropdown-item" key={statusType.Id}
                     onClick={() => { onSearch(1, undefined, statusType.Id?.toString()); }} >
                     {statusType.Name}
                  </button> 
               )}
                  ****/}
            </DropDown>
            <Alert alert={errorAlert.alert}
               className="col-12 mb-2"
               onClosed={() => { errorAlert.clear(); }}
            />
            {tbl.totalItemCount > 0 &&
               <div className="row col-12 pm-0 mt-3 pb-2">
                  <Table className="col-12 text-center table-striped"
                     defaultSortName={tbl.sortName}
                     data={tbl.data}
                     onSortChange={(selectedPage, isSortAsce, sortName) => onSearch(selectedPage, undefined, isSortAsce, sortName)}
                     view={TableView.CardView}
                     listCount={tbl.totalItemCount}
                  />
                  <Pagination
                     maxItemsPerPage={tbl.maxItemsPerPage}
                     selectedPage={tbl.selectedPage}
                     onChange={(selectedPage, maxItemsPerPage) => {
                        onSearch(selectedPage, maxItemsPerPage);
                     }}
                     listCount={tbl.totalItemCount} />
               </div>
            }
            <CommunicationModal isOpen={isOpenMessageModal}
               communication={selectCommunication}
               access={Access}
               onClose={() => { setIsOpenMessageModal(false); onSearch(); }}
               usePutSecretCommunication={usePutSecretCommunication}
               useDeleteCommunication={useDeleteCommunication}
            />
         </div>
      </Container>
   );
};

declare type IProps = {

};
export default MessagesManagement;
