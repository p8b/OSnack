import SearchInput from 'osnack-frontend-shared/src/components/Inputs/SeachInput';
import Pagination from 'osnack-frontend-shared/src/components/Pagination/Pagination';
import Table, { TableData, TableView } from 'osnack-frontend-shared/src/components/Table/Table';
import TableRowButtons from 'osnack-frontend-shared/src/components/Table/TableRowButtons';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { checkUri, generateUri } from 'osnack-frontend-shared/src/_core/appFunc';
import { ConstMaxNumberOfPerItemsPage, GetAllRecords } from 'osnack-frontend-shared/src/_core/constant.Variables';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Container from '../../components/Container';
import { useAddMessageSecretCommunication, useSearchCommunication } from '../../SecretHooks/useCommunicationHook';
import { Access } from '../../_core/appConstant.Variables';
import DisputeModal from 'osnack-frontend-shared/src/components/Modals/DisputeModal';
import { Communication } from 'osnack-frontend-shared/src/_core/apiModels';



const ContactUsMessage = (props: IProps) => {
   const isUnmounted = useRef(false);
   const history = useHistory();
   const errorAlert = useAlert(new AlertObj());
   const [searchValue, setSearchValue] = useState("");
   const [selectMessage, setSelectMessage] = useState(new Communication());
   const [isOpenMessageModal, setIsOpenMessageModal] = useState(false);

   const [tableData, setTableData] = useState(new TableData());
   const [tblSortName, setTblsortName] = useState("Date");
   const [tblIsSortAsc, setTblIsSortAsc] = useState(true);
   const [tblTotalItemCount, setTblTotalItemCount] = useState(0);
   const [tblSelectedPage, setTblSelectedPage] = useState(1);
   const [tblMaxItemsPerPage, setTblMaxItemsPerPage] = useState(ConstMaxNumberOfPerItemsPage);

   useEffect(() => {
      onSearch(...checkUri(window.location.pathname,
         [tblSelectedPage, tblMaxItemsPerPage, tblIsSortAsc, tblSortName, GetAllRecords]));

   }, []);



   const onSearch = (
      selectedPage = tblSelectedPage,
      maxItemsPerPage = tblMaxItemsPerPage,
      isSortAsc = tblIsSortAsc,
      sortName = tblSortName,
      searchString = GetAllRecords
   ) => {

      if (searchValue != null && searchValue != "")
         searchString = searchValue;
      if (searchString != GetAllRecords)
         setSearchValue(searchString);

      if (selectedPage != tblSelectedPage)
         setTblSelectedPage(selectedPage);

      if (isSortAsc != tblIsSortAsc)
         setTblIsSortAsc(isSortAsc);

      if (sortName != tblSortName)
         setTblsortName(sortName);

      if (selectedPage != undefined && selectedPage != tblSelectedPage)
         setTblSelectedPage(selectedPage);

      if (maxItemsPerPage != tblMaxItemsPerPage)
         setTblMaxItemsPerPage(maxItemsPerPage);

      history.push(generateUri(window.location.pathname,
         [selectedPage || tblSelectedPage,
            maxItemsPerPage, Number(isSortAsc), sortName, searchString != GetAllRecords ? searchString : ""]));

      errorAlert.PleaseWait(500, isUnmounted);

      useSearchCommunication(selectedPage, maxItemsPerPage, searchString, isSortAsc, sortName).then(result => {
         if (isUnmounted.current) return;
         setTblTotalItemCount(result.data.totalCount || 0);
         errorAlert.clear();
         populateOrderTable(result.data.communicationList!);
      }).catch(alert => {
         if (isUnmounted.current) return;
         errorAlert.set(alert);
      });
   };
   const populateOrderTable = (communicationList: Communication[]) => {
      if (communicationList.length == 0) {
         errorAlert.setSingleWarning("0", "No Result Found");
         return;
      }
      errorAlert.clear();
      let tData = new TableData();
      tData.AddHeader("Id", "Id")
         .AddHeader("FullName", "FullName")
         .AddHeader("Email", "Email")
         .AddHeader("Phone Number")
         .AddHeader("Date", "Date");

      communicationList.map(message =>
         tData.AddRow([
            message.id,
            message.fullName,
            message.email,
            message.phoneNumber,
            new Date(message.date!).ToShortDate(),
            <TableRowButtons
               btnClassName="btn-white dispute-icon"
               btnClick={() => {
                  setSelectMessage(message);
                  setIsOpenMessageModal(true);
               }}
            />
         ]));
      setTableData(tData);
   };

   return (
      <Container className="container-fluid ">
         <PageHeader title="Contact Us Message" className="hr-section-sm line-limit-1" />
         <Container className="row col-12 col-md-11 pt-2 pb-2 bg-white ml-auto mr-auto">
            <Alert alert={errorAlert.alert}
               className="col-12 mb-2"
               onClosed={() => { errorAlert.clear(); }}
            />
            <div className="row col-12 pm-0">

               <SearchInput key="searchInput"
                  value={searchValue}
                  onChange={i => setSearchValue(i.target.value)}
                  className="col-12 col-md-9 pr-md-4"
                  onSearch={() => { onSearch(1); }}
               />
            </div>

            {tblTotalItemCount > 0 &&
               <div className="row col-12 pm-0  bg-white pb-2">
                  <Table className="col-12 text-center table-striped"
                     defaultSortName={tblSortName}
                     data={tableData}
                     onSortClick={(isSortAsce, sortName) => onSearch(undefined, undefined, isSortAsce, sortName)}
                     view={TableView.CardView}
                     listCount={tblTotalItemCount}
                  />
                  <Pagination
                     maxItemsPerPage={tblMaxItemsPerPage}
                     selectedPage={tblSelectedPage}
                     onChange={(selectedPage, maxItemsPerPage) => {
                        onSearch(selectedPage, maxItemsPerPage);
                     }}
                     listCount={tblTotalItemCount} />
               </div>
            }
            <DisputeModal isOpen={isOpenMessageModal}
               dispute={selectMessage}
               access={Access}
               onClose={() => { setIsOpenMessageModal(false); onSearch(); }}
               useAddMessageSecretCommunication={useAddMessageSecretCommunication}
            />
         </Container>
      </Container>
   );
};

declare type IProps = {

};
export default ContactUsMessage;
