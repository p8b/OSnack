//import SearchInput from '../Inputs/SeachInput';
//import Pagination from '../Pagination/Pagination';
//import Table, { TableData, TableView } from '../Table/Table';
//import TableRowButtons from '../Table/TableRowButtons';
//import Alert, { AlertObj, useAlert } from '../Texts/Alert';
//import { checkUri, generateUri } from '../../_core/appFunc';
//import { ClientAppAccess, ConstMaxNumberOfPerItemsPage, GetAllRecords } from '../../_core/constant.Variables';
//import React, { useEffect, useRef, useState } from 'react';
//import { useHistory } from 'react-router-dom';
//import { useAddMessageSecretCommunication, useSearchCommunication, useDeleteCommunication } from '../../SecretHooks/useCommunicationHook';
//import CommunictaionModal from '../Modals/CommunictaionModal';
//import { Communication } from '../../_core/apiModels';
//import { IReturnUseAddMessageOfficialCommunication } from '../../hooks/OfficialHooks/useCommunicationHook';



//const QuestionsView = (props: IProps) => {
//   const isUnmounted = useRef(false);
//   const history = useHistory();
//   const errorAlert = useAlert(new AlertObj());
//   const [searchValue, setSearchValue] = useState("");
//   const [selectMessage, setSelectMessage] = useState(new Communication());
//   const [isOpenMessageModal, setIsOpenMessageModal] = useState(false);

//   const [tableData, setTableData] = useState(new TableData());
//   const [tblSortName, setTblsortName] = useState("Date");
//   const [tblIsSortAsc, setTblIsSortAsc] = useState(false);
//   const [tblTotalItemCount, setTblTotalItemCount] = useState(0);
//   const [tblSelectedPage, setTblSelectedPage] = useState(1);
//   const [tblMaxItemsPerPage, setTblMaxItemsPerPage] = useState(ConstMaxNumberOfPerItemsPage);

//   useEffect(() => {
//      onSearch(...checkUri(window.location.pathname,
//         [tblSelectedPage, tblMaxItemsPerPage, tblIsSortAsc, tblSortName, GetAllRecords]));
//      return () => { isUnmounted.current = true; };
//   }, []);



//   const onSearch = (
//      selectedPage = tblSelectedPage,
//      maxItemsPerPage = tblMaxItemsPerPage,
//      isSortAsc = tblIsSortAsc,
//      sortName = tblSortName,
//      searchString = GetAllRecords
//   ) => {

//      if (searchValue != null && searchValue != "")
//         searchString = searchValue;
//      if (searchString != GetAllRecords)
//         setSearchValue(searchString);

//      if (selectedPage != tblSelectedPage)
//         setTblSelectedPage(selectedPage);

//      if (isSortAsc != tblIsSortAsc)
//         setTblIsSortAsc(isSortAsc);

//      if (sortName != tblSortName)
//         setTblsortName(sortName);

//      if (selectedPage != undefined && selectedPage != tblSelectedPage)
//         setTblSelectedPage(selectedPage);

//      if (maxItemsPerPage != tblMaxItemsPerPage)
//         setTblMaxItemsPerPage(maxItemsPerPage);

//      history.push(generateUri(window.location.pathname,
//         [selectedPage || tblSelectedPage,
//            maxItemsPerPage, Number(isSortAsc), sortName, searchString != GetAllRecords ? searchString : ""]));

//      errorAlert.PleaseWait(500, isUnmounted);
//      switch (props.access) {

//         case ClientAppAccess.Official:
//            useAddMessageOfficialCommunication({
//               ...dispute,
//               messages: [...props.dispute.messages!, { body: message }]
//            }).then(onSuccess).catch(onError);
//         case ClientAppAccess.Secret:
//            props.useSearchCommunication!(selectedPage, maxItemsPerPage, searchString, isSortAsc, sortName).then(result => {
//               if (isUnmounted.current) return;
//               setTblTotalItemCount(result.data.totalCount || 0);
//               errorAlert.clear();
//               populateOrderTable(result.data.communicationList!);
//            }).catch(errors => {
//               if (isUnmounted.current) return;
//               errorAlert.set(errors);
//            });
//         default:
//      }


//   };
//   const populateOrderTable = (communicationList: Communication[]) => {
//      if (communicationList.length == 0) {
//         errorAlert.setSingleWarning("0", "No Result Found");
//         return;
//      }
//      errorAlert.clear();
//      let tData = new TableData();
//      tData.AddHeader("Id", "Id")
//         .AddHeader("FullName", "FullName")
//         .AddHeader("Email", "Email")
//         .AddHeader("Phone Number")
//         .AddHeader("Date", "Date");

//      communicationList.map(message =>
//         tData.AddRow([
//            message.id,
//            message.fullName,
//            message.email,
//            message.phoneNumber,
//            new Date(message.date!).ToShortDate(),
//            <TableRowButtons
//               btnClassName="btn-white dispute-icon"
//               btnClick={() => {
//                  setSelectMessage(message);
//                  setIsOpenMessageModal(true);
//               }}
//            />
//         ]));
//      setTableData(tData);
//   };

//   return (
//      <>
//         <Alert alert={errorAlert.alert}
//            className="col-12 mb-2"
//            onClosed={() => { errorAlert.clear(); }}
//         />
//         <div className="row col-12 pm-0">

//            <SearchInput key="searchInput"
//               value={searchValue}
//               onChange={i => setSearchValue(i.target.value)}
//               className="col-12 col-md-9 pr-md-4"
//               onSearch={() => { onSearch(1); }}
//            />
//         </div>

//         {tblTotalItemCount > 0 &&
//            <div className="row col-12 pm-0  bg-white pb-2">
//               <Table className="col-12 text-center table-striped"
//                  defaultSortName={tblSortName}
//                  data={tableData}
//                  onSortChange={(isSortAsce, sortName) => onSearch(undefined, undefined, isSortAsce, sortName)}
//                  view={TableView.CardView}
//                  listCount={tblTotalItemCount}
//               />
//               <Pagination
//                  maxItemsPerPage={tblMaxItemsPerPage}
//                  selectedPage={tblSelectedPage}
//                  onChange={(selectedPage, maxItemsPerPage) => {
//                     onSearch(selectedPage, maxItemsPerPage);
//                  }}
//                  listCount={tblTotalItemCount} />
//            </div>
//         }
//         <CommunictaionModal isOpen={isOpenMessageModal}
//            dispute={selectMessage}
//            access={Access}
//            onClose={() => { setIsOpenMessageModal(false); onSearch(); }}
//            useAddMessageSecretCommunication={useAddMessageSecretCommunication}
//            useDeleteCommunication={useDeleteCommunication}
//         />
//      </>
//   );
//};

//declare type IProps = {
//   useAddMessageSecretCommunication?: (modifyCommunication: Communication) => Promise<IReturnUseAddMessageOfficialCommunication>;
//   useDeleteCommunication?: (communication: Communication) => Promise<{ data: string, status?: number; }>;
//   useSearchCommunication?: (selectedPage: number, maxNumberPerItemsPage: number, searchValue: string | null, isSortAsce: boolean, sortName: string | null) => Promise<{ data: CommunicationListAndTotalCount, status?: number; }>;
//   access: ClientAppAccess;
//};
//export default QuestionsView;
