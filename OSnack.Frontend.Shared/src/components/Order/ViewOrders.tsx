import React, { useEffect, useRef, useState } from 'react';
import { IReturnUseAllOfficialOrder, useAllOfficialOrder } from '../../hooks/OfficialHooks/useOrderHook';
import Alert, { AlertObj, useAlert } from '../Texts/Alert';
import { Communication, Message, Order, OrderStatusType, OrderStatusTypeList, PaymentTypeList } from '../../_core/apiModels';
import { ClientAppAccess, ConstMaxNumberOfPerItemsPage, GetAllRecords } from '../../_core/constant.Variables';
import { useHistory } from 'react-router-dom';
import { checkUri, generateUri, getBadgeByOrderStatusType, extractUri } from '../../_core/appFunc';
import Table, { TableData, TableView } from '../Table/Table';
import TableRowButtons from '../Table/TableRowButtons';
import PageHeader from '../Texts/PageHeader';
import Pagination from '../Pagination/Pagination';
import OrderModal from '../Modals/OrderModal';
import CommunicationModal from '../Modals/CommunicationModal';
import { Button } from '../Buttons/Button';
import DropDown from '../Buttons/DropDown';
import SearchInput from '../Inputs/SeachInput';
import { IReturnUsePutOfficialCommunication } from '../../hooks/OfficialHooks/useCommunicationHook';

const ViewOrders = (props: IProps) => {
   const isUnmounted = useRef(false);
   const history = useHistory();
   const errorAlert = useAlert(new AlertObj());
   const [selectUserId, setSelectUserId] = useState(Number(extractUri(window.location.pathname)[1]));
   const [searchValue, setSearchValue] = useState("");
   const [selectedDispute, setSelectedDispute] = useState(new Communication());
   const [isOpenDisputeModal, setIsOpenDisputeModal] = useState(false);
   const [selectOrder, setSelectOrder] = useState(new Order());
   const [selectType, setSelectType] = useState(GetAllRecords);
   const [isOpenOrderModal, setIsOpenOrderModal] = useState(false);
   const [fullName, setFullName] = useState("");
   const [availableStatusTypeList, setavailableStatusTypeList] = useState<OrderStatusType[]>([]);

   const [tableData, setTableData] = useState(new TableData());
   const [tblSortName, setTblsortName] = useState("Date");
   const [tblIsSortAsc, setTblIsSortAsc] = useState(false);
   const [tblTotalItemCount, setTblTotalItemCount] = useState(0);
   const [tblSelectedPage, setTblSelectedPage] = useState(1);
   const [tblMaxItemsPerPage, setTblMaxItemsPerPage] = useState(ConstMaxNumberOfPerItemsPage);

   useEffect(() => {
      switch (props.access) {
         case ClientAppAccess.Official:
            onSearch(undefined, ...checkUri(window.location.pathname,
               [tblSelectedPage, tblMaxItemsPerPage, selectType, tblIsSortAsc, tblSortName, GetAllRecords]));
            break;
         case ClientAppAccess.Secret:
            onSearch(...checkUri(window.location.pathname,
               [selectUserId, tblSelectedPage, tblMaxItemsPerPage, selectType, tblIsSortAsc, tblSortName, GetAllRecords]));
            break;
         default:
            break;
      }
      return () => { isUnmounted.current = true; };
   }, []);

   const onSearch = (
      userId = selectUserId,
      selectedPage = tblSelectedPage,
      maxItemsPerPage = tblMaxItemsPerPage,
      filterType = selectType,
      isSortAsc = tblIsSortAsc,
      sortName = tblSortName,
      searchString = GetAllRecords
   ) => {
      if (searchValue != null && searchValue != "")
         searchString = searchValue;

      if (searchString != GetAllRecords)
         setSearchValue(searchString);

      setSelectUserId(userId);

      if (selectedPage != tblSelectedPage)
         setTblSelectedPage(selectedPage);

      if (Number(filterType) == -1)
         filterType = GetAllRecords;

      if (filterType != selectType) {
         setSelectType(filterType);
      }

      if (isSortAsc != tblIsSortAsc)
         setTblIsSortAsc(isSortAsc);

      if (sortName != tblSortName)
         setTblsortName(sortName);

      if (selectedPage != undefined && selectedPage != tblSelectedPage)
         setTblSelectedPage(selectedPage);

      if (maxItemsPerPage != tblMaxItemsPerPage)
         setTblMaxItemsPerPage(maxItemsPerPage);
      switch (props.access) {
         case ClientAppAccess.Official:
            history.push(generateUri(window.location.pathname,
               [selectedPage,
                  maxItemsPerPage,
                  filterType === GetAllRecords ? -1 : filterType,
                  Number(isSortAsc),
                  sortName,
                  searchString != GetAllRecords ? searchString : ""]),
               props.location?.state);
            break;
         case ClientAppAccess.Secret:
            history.push(generateUri(window.location.pathname,
               [selectUserId, selectedPage,
                  maxItemsPerPage,
                  filterType === GetAllRecords ? -1 : filterType,
                  Number(isSortAsc),
                  sortName,
                  searchString != GetAllRecords ? searchString : ""]),
               props.location?.state);
            break;
         default:
            break;
      }

      errorAlert.PleaseWait(500, isUnmounted);
      switch (props.access) {
         case ClientAppAccess.Official:
            useAllOfficialOrder(selectedPage, maxItemsPerPage, searchString, filterType, isSortAsc, sortName)
               .then(onGetUserOrderSuccess)
               .catch(onGetUserOrderFailed);
            break;
         case ClientAppAccess.Secret:
            if (props.useAllUserOrderSecret != undefined)
               props.useAllUserOrderSecret(userId, selectedPage, maxItemsPerPage, searchString, filterType, isSortAsc, sortName)
                  .then(onGetUserOrderSuccess)
                  .catch(onGetUserOrderFailed);
            break;
         default:
            break;
      }


   };
   const onGetUserOrderSuccess = (result: IReturnUseAllOfficialOrder) => {
      if (isUnmounted.current) return;
      setTblTotalItemCount(result.data.totalCount || 0);
      setavailableStatusTypeList(result.data.availableTypes!);
      populateOrderTable(result.data.orderList!);
      setFullName(result.data.fullName!);
      errorAlert.clear();


   };
   const onGetUserOrderFailed = (errors: AlertObj) => {
      if (isUnmounted.current) return;
      errorAlert.set(errors);
   };
   const populateOrderTable = (orderList: Order[]) => {

      if (orderList.length == 0) {
         errorAlert.setSingleWarning("0", "No Result Found");
         return;
      }
      errorAlert.clear();
      let tData = new TableData();
      tData.AddHeader("Status", "Status")
         .AddHeader("Total Price", "TotalPrice")
         .AddHeader("Date", "Date")
         .AddHeader("Payment");

      orderList.map(order =>
         tData.AddRow([
            <span>  <span className={`${getBadgeByOrderStatusType(order.status)} font-weight-bold pm-0  h6 mt-auto mb-auto `}
               children={OrderStatusTypeList.find(t => t.Value == order.status)?.Name} /></span>,
            `£${order.totalPrice}`,
            new Date(order.date!).ToShortDate(),
            PaymentTypeList.find(t => t.Value == order.payment.type)?.Name,
            <>
               {(order.dispute == undefined || !order.dispute.status) &&
                  <TableRowButtons
                     btnClassName="btn-blue edit-icon"
                     btnClick={() => {
                        setSelectOrder(order);
                        setIsOpenOrderModal(true);
                     }}
                  />}
               {(order.dispute != undefined && order.dispute.status) &&
                  <TableRowButtons
                     btn1ClassName="col-12 col-lg-6 btn-blue edit-icon"
                     btn1Click={() => {
                        setSelectOrder(order);
                        setIsOpenOrderModal(true);
                     }}
                     btnClassName="col-12 col-lg-6 btn-white small-text"
                     btnChildren="Dispute"
                     btnClick={() => { setSelectedDispute(order.dispute!); setIsOpenDisputeModal(true); }}
                  />}
            </>
         ]));

      setTableData(tData);
   };
   const UpdateOrder = (order: Order) => {
      setIsOpenOrderModal(false);

      switch (props.access) {
         case ClientAppAccess.Official:
            break;
         case ClientAppAccess.Secret:
            props.usePutOrderStatusOrder!(order != undefined ? order : selectOrder).then(() => {
               errorAlert.clear();
               errorAlert.setSingleSuccess("updated", "Order Updated.");
               onSearch();
            }).catch(onGetUserOrderFailed);
            break;
         default:
            break;
      };
   };

   return (
      <>
         <PageHeader title={props.access == ClientAppAccess.Official ? "My Orders" : `Orders - ${fullName}`} className="hr-section-sm line-limit-1" />
         <Alert alert={errorAlert.alert}
            className="col-12 mb-2"
            onClosed={() => { errorAlert.clear(); }}
         />
         {props.location?.state?.backUrl != undefined &&
            <Button onClick={() => history.push(props.location.state?.backUrl!)} children="Back" className="col-auto mr-auto btn-lg back-icon" />
         }
         {props.location?.state?.backUrl == undefined && tblTotalItemCount == 0 &&
            <div className="row col-12 justify-content-center">
               <div className="col-12 text-center mt-4">You do not have any orders. <br /> Let's do something about it.</div>
               <Button className="btn btn-green col-auto mt-4" children="Shop now" onClick={() => { history.push("/Shop"); }} />
            </div>
         }
         {tblTotalItemCount > 0 &&
            <>
               <div className="col-12 bg-white pb-2 ">
                  <div className="row col-12 pm-0 mb-3">
                     <SearchInput key="searchInput"
                        value={searchValue}
                        onChange={i => setSearchValue(i.target.value)}
                        className="col-12 col-md-8"
                        onSearch={() => { onSearch(undefined, 1); }}
                     />
                     <DropDown title={`Status Type: ${OrderStatusTypeList.find((s) => s.Id?.toString() == selectType)?.Name || "All"}`}
                        className="col-12 col-md-4 p-0"
                        titleClassName="btn btn-white filter-icon">
                        <button className="dropdown-item"
                           onClick={() => { onSearch(undefined, 1, undefined, GetAllRecords); }} >
                           All
                        </button>
                        {OrderStatusTypeList.filter(o => availableStatusTypeList!.includes(o.Value))?.map(statusType =>
                           <button className="dropdown-item" key={statusType.Id}
                              onClick={() => { onSearch(undefined, 1, undefined, statusType.Id?.toString()); }} >
                              {statusType.Name}
                           </button>
                        )}
                     </DropDown>
                  </div>
                  <Table className="col-12 text-center table-striped"
                     defaultSortName={tblSortName}
                     data={tableData}
                     onSortChange={(isSortAsce, sortName) => { onSearch(undefined, undefined, undefined, undefined, isSortAsce, sortName); }}
                     view={TableView.CardView}
                     listCount={tblTotalItemCount}
                  />
                  <Pagination
                     maxItemsPerPage={tblMaxItemsPerPage}
                     selectedPage={tblSelectedPage}
                     onChange={(selectedPage, maxItemsPerPage) => {
                        onSearch(undefined, selectedPage, maxItemsPerPage);
                     }}
                     listCount={tblTotalItemCount} />
               </div>
            </>
         }
         <OrderModal isOpen={isOpenOrderModal}
            order={selectOrder}
            access={props.access}
            onClose={() => { setIsOpenOrderModal(false); onSearch(); }}
            onSave={UpdateOrder}
            onDispute={props.onDispute}
            usePutSecretCommunication={props.usePutSecretCommunication} />
         <CommunicationModal isOpen={isOpenDisputeModal}
            communication={selectedDispute}
            access={props.access}
            onClose={() => { setIsOpenDisputeModal(false); }}
            usePutSecretCommunication={props.usePutSecretCommunication}
         />


      </>
   );
};

declare type IProps = {
   access: ClientAppAccess;
   usePutSecretCommunication?: (message: Message, communicationId: string | null, status: boolean) => Promise<IReturnUsePutOfficialCommunication>;
   useAllUserOrderSecret?: (userId: number, selectedPage: number, maxNumberPerItemsPage: number, searchString: string | null, filterStatus: string | null, isSortAsce: boolean | undefined, sortName: string | null | undefined) => Promise<IReturnUseAllOfficialOrder>;
   usePutOrderStatusOrder?: (modifiedOrder: Order) => Promise<{ data: Order, status?: number; }>;
   location?: any;
   onDispute?: (order: Order) => void;
};
export default ViewOrders;
