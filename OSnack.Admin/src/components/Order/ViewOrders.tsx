import React, { useEffect, useRef, useState } from 'react';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { Communication, Order, OrderStatusType, OrderStatusTypeList, PaymentTypeList } from 'osnack-frontend-shared/src/_core/apiModels';
import { GetAllRecords } from 'osnack-frontend-shared/src/_core/constant.Variables';
import { useHistory } from 'react-router-dom';
import { checkUri, generateUri, getBadgeByOrderStatusType } from 'osnack-frontend-shared/src/_core/appFunc';
import Table, { TableData, TableView, useTableData } from 'osnack-frontend-shared/src/components/Table/Table';
import TableRowButtons from 'osnack-frontend-shared/src/components/Table/TableRowButtons';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import Pagination from 'osnack-frontend-shared/src/components/Pagination/Pagination';
import OrderModal from '../../pages/OrderManagement/OrderModal';
import CommunicationModal from 'osnack-frontend-shared/src/components/Modals/CommunicationModal';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import DropDown from 'osnack-frontend-shared/src/components/Buttons/DropDown';
import SearchInput from 'osnack-frontend-shared/src/components/Inputs/SeachInput';
import { usePutSecretCommunication } from '../../SecretHooks/useCommunicationHook';
import { useAllOrder, useAllUserOrder } from '../../SecretHooks/useOrderHook';
import { Access } from '../../_core/appConstant.Variables';

const ViewOrders = (props: IProps) => {
   const isUnmounted = useRef(false);
   const history = useHistory();
   const errorAlert = useAlert(new AlertObj());
   const tbl = useTableData("Date", false);
   const [searchValue, setSearchValue] = useState("");
   const [selectedDispute, setSelectedDispute] = useState(new Communication());
   const [isOpenDisputeModal, setIsOpenDisputeModal] = useState(false);
   const [selectOrder, setSelectOrder] = useState(new Order());
   const [selectType, setSelectType] = useState(GetAllRecords);
   const [isOpenOrderModal, setIsOpenOrderModal] = useState(false);
   const [fullName, setFullName] = useState("");
   const [availableStatusTypeList, setAvailableStatusTypeList] = useState<OrderStatusType[]>([]);

   useEffect(() => {
      onSearch(...checkUri(window.location.pathname,
         [tbl.selectedPage, tbl.maxItemsPerPage, selectType, tbl.isSortAsc, tbl.sortName, GetAllRecords]));

      return () => { isUnmounted.current = true; };
   }, []);

   const onSearch = (
      selectedPage = tbl.selectedPage,
      maxItemsPerPage = tbl.maxItemsPerPage,
      filterType = selectType,
      isSortAsc = tbl.isSortAsc,
      sortName = tbl.sortName,
      searchString = GetAllRecords
   ) => {
      if (searchValue != null && searchValue != "") searchString = searchValue;
      if (searchString != GetAllRecords) setSearchValue(searchString);
      if (selectedPage != tbl.selectedPage) tbl.setSelectedPage(selectedPage);
      if (Number(filterType) == -1) filterType = GetAllRecords;
      if (filterType != selectType) setSelectType(filterType);
      if (isSortAsc != tbl.isSortAsc) tbl.setIsSortAsc(isSortAsc);
      if (sortName != tbl.sortName) tbl.setSortName(sortName);
      if (selectedPage != undefined && selectedPage != tbl.selectedPage) tbl.setSelectedPage(selectedPage);
      if (maxItemsPerPage != tbl.maxItemsPerPage) tbl.setMaxItemsPerPage(maxItemsPerPage);


      history.push(generateUri(window.location.pathname,
         [selectedPage,
            maxItemsPerPage,
            filterType === GetAllRecords ? -1 : filterType,
            Number(isSortAsc),
            sortName,
            searchString != GetAllRecords ? searchString : ""]),
         props.location?.state);


      errorAlert.pleaseWait(isUnmounted);
      if (props.location?.state?.userId == undefined)
         useAllOrder(selectedPage, maxItemsPerPage, searchString, filterType, isSortAsc, sortName).then(result => {
            if (isUnmounted.current) return;
            tbl.setTotalItemCount(result.data.totalCount || 0);
            setAvailableStatusTypeList(result.data.availableTypes!);
            errorAlert.clear();
            populateOrderTable(result.data.orderList!);
         }).catch(errors => {
            if (isUnmounted.current) return;
            errorAlert.set(errors);
         });
      else
         useAllUserOrder(props.location.state?.userId, selectedPage, maxItemsPerPage, searchString, filterType, isSortAsc, sortName)
            .then((result) => {
               if (isUnmounted.current) return;
               tbl.setTotalItemCount(result.data.totalCount || 0);
               setAvailableStatusTypeList(result.data.availableTypes!);
               populateOrderTable(result.data.orderList!);
               setFullName(result.data.fullName!);
               errorAlert.clear();
            })
            .catch((errors) => {
               if (isUnmounted.current) return;
               errorAlert.set(errors);
            });
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

      tbl.setData(tData);
   };


   return (
      <>
         <PageHeader title={`Orders ${props.location?.state?.userId == undefined ? "" : ` - ${fullName}`}`} className="hr-section-sm line-limit-1" />
         <Alert alert={errorAlert.alert}
            className="col-12 mb-2"
            onClosed={() => { errorAlert.clear(); }}
         />
         {props.location?.state?.backUrl != undefined &&
            <Button onClick={() => history.push(props.location?.state?.backUrl!)} children="Back" className="col-auto mr-auto btn-lg back-icon" />
         }

         <div className="col-12 bg-white pb-2 ">
            <div className="row col-12 pm-0 mb-3">
               <SearchInput
                  value={searchValue}
                  onChange={i => setSearchValue(i.target.value)}
                  className="col-12 col-md-8"
                  onSearch={() => { onSearch(1); }}
               />
               <DropDown title={`Status Type: ${OrderStatusTypeList.find((s) => s.Id?.toString() == selectType)?.Name || "All"}`}
                  className="col-12 col-md-4 p-0"
                  titleClassName="btn btn-white filter-icon">
                  <button className="dropdown-item"
                     onClick={() => { onSearch(1, undefined, GetAllRecords); }} >
                     All
                        </button>
                  {OrderStatusTypeList.filter(o => availableStatusTypeList!.includes(o.Value))?.map(statusType =>
                     <button className="dropdown-item" key={statusType.Id}
                        onClick={() => { onSearch(1, undefined, statusType.Id?.toString()); }} >
                        {statusType.Name}
                     </button>
                  )}
               </DropDown>
            </div>
            {tbl.totalItemCount > 0 &&
               <>
                  <Table className="col-12 text-center table-striped"
                     defaultSortName={tbl.sortName}
                     data={tbl.data}
                     onSortChange={(selectedPage, isSortAsce, sortName) => { onSearch(selectedPage, undefined, undefined, isSortAsce, sortName); }}
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
               </>
            }
         </div>
         <OrderModal isOpen={isOpenOrderModal}
            order={selectOrder}
            onClose={() => { setIsOpenOrderModal(false); }}
            onSuccess={() => { setIsOpenOrderModal(false); onSearch(); }}
            onDispute={props.onDispute} />
         <CommunicationModal isOpen={isOpenDisputeModal}
            communication={selectedDispute}
            access={Access}
            onClose={() => { setIsOpenDisputeModal(false); onSearch(); }}
            usePutSecretCommunication={usePutSecretCommunication}
         />


      </>
   );
};

declare type IProps = {
   location?: any;
   onDispute?: (order: Order) => void;
};
export default ViewOrders;
