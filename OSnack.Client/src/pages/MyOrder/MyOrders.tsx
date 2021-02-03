import Table, { TableData, useTableData } from 'osnack-frontend-shared/src/components/Table/Table';
import TableRowButtons from 'osnack-frontend-shared/src/components/Table/TableRowButtons';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { Communication, DisputeFilterTypes, Order, OrderStatusType, OrderStatusTypeList, PaymentTypeList } from 'osnack-frontend-shared/src/_core/apiModels';
import { convertUriParamToBool, extractUri, generateUri, getBadgeByOrderStatusType } from 'osnack-frontend-shared/src/_core/appFunc';
import { GetAllRecords } from 'osnack-frontend-shared/src/_core/appConst';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Container from '../../components/Container';
import { useAllOfficialOrder } from 'osnack-frontend-shared/src/hooks/OfficialHooks/useOrderHook';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import SearchInput from 'osnack-frontend-shared/src/components/Inputs/SeachInput';
import DropDown from 'osnack-frontend-shared/src/components/Buttons/DropDown';
import OrderModal from './OrderModal';
import CommunicationModal from 'osnack-frontend-shared/src/components/Modals/CommunicationModal';
import { Access } from '../../_core/appConstant.Variables';

const MyOrders = (props: IProps) => {
   const isUnmounted = useRef(false);
   const history = useHistory();
   const errorAlert = useAlert(new AlertObj());
   const tbl = useTableData("Date", false);
   const [searchValue, setSearchValue] = useState("");
   const [selectedDispute, setSelectedDispute] = useState(new Communication());
   const [isOpenDisputeModal, setIsOpenDisputeModal] = useState(false);
   const [selectOrder, setSelectOrder] = useState(new Order());
   const [selectOrderType, setSelectOrderType] = useState(GetAllRecords);
   const [selectDisputeType, setSelectDisputeType] = useState(GetAllRecords);
   const [isOpenOrderModal, setIsOpenOrderModal] = useState(false);
   const [availableStatusTypeList, setavailableStatusTypeList] = useState<OrderStatusType[]>([]);
   const [disputeFilterTypes, setDisputeFilterTypes] = useState(DisputeFilterTypes.None);

   useEffect(() => {
      return () => { isUnmounted.current = true; };
   }, []);
   useEffect(() => {
      onSearch(...extractUri([
         tbl.selectedPage,
         tbl.maxItemsPerPage,
         tbl.isSortAsc,
         tbl.sortName,
         selectOrderType,
         selectDisputeType,
         GetAllRecords]));
   }, [window.location.pathname]);

   const onSearch = (
      selectedPage = tbl.selectedPage,
      maxItemsPerPage = tbl.maxItemsPerPage,
      isSortAsc = tbl.isSortAsc,
      sortName = tbl.sortName,
      filterOrderType = selectOrderType,
      filterDisputeType = selectDisputeType,
      searchString = GetAllRecords
   ) => {
      if (searchValue != null && searchValue != "") searchString = searchValue;
      if (searchString != GetAllRecords) setSearchValue(searchString);
      if (selectedPage != tbl.selectedPage) tbl.setSelectedPage(selectedPage);
      if (Number(filterOrderType) == -1) filterOrderType = GetAllRecords;
      if (filterOrderType != selectOrderType) setSelectOrderType(filterOrderType);
      filterDisputeType = convertUriParamToBool(filterDisputeType);
      if (filterDisputeType != selectDisputeType) setSelectDisputeType(filterDisputeType);
      if (isSortAsc != tbl.isSortAsc) tbl.setIsSortAsc(isSortAsc);
      if (sortName != tbl.sortName) tbl.setSortName(sortName);
      if (selectedPage != undefined && selectedPage != tbl.selectedPage) tbl.setSelectedPage(selectedPage);
      if (maxItemsPerPage != tbl.maxItemsPerPage) tbl.setMaxItemsPerPage(maxItemsPerPage);

      const newUri = generateUri([
         selectedPage,
         maxItemsPerPage,
         Number(isSortAsc),
         sortName,
         filterOrderType === GetAllRecords ? -1 : filterOrderType,
         filterDisputeType === GetAllRecords ? -1 : (filterDisputeType == 'true' ? 1 : 0),
         searchString != GetAllRecords ? searchValue : ""]);
      if (window.location.pathname.toLowerCase() != newUri.toLowerCase())
         history.push(newUri);

      errorAlert.pleaseWait(isUnmounted);
      useAllOfficialOrder(selectedPage, maxItemsPerPage, searchString, filterOrderType, isSortAsc, sortName, filterDisputeType)
         .then(result => {
            if (isUnmounted.current) return;
            tbl.setTotalItemCount(result.data.totalCount || 0);
            setavailableStatusTypeList(result.data.availableTypes!);
            setDisputeFilterTypes(result.data.disputeFilterType!);
            errorAlert.clear();
            populateOrderTable(result.data.orderList!);
         })
         .catch(errors => {
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
   const getDisputeDisplayValue = () => {
      switch (selectDisputeType) {
         case "true":
            return "Open ";
         case "false":
            return "Closed ";
      }
      return "All";
   };
   return (
      <>
         <PageHeader title="My Orders" className="hr-section-sm line-limit-1" />
         <Container className="bg-white pt-4 pb-5">
            <div className="row col-12 pm-0 mb-3">
               <SearchInput
                  value={searchValue}
                  onChange={i => setSearchValue(i.target.value)}
                  className="col-12"
                  onSearch={() => { onSearch(1); }}
               />
               <DropDown title={`Status Type: ${OrderStatusTypeList.find((s) => s.Id?.toString() == selectOrderType)?.Name || "All"}`}
                  className={`col-12 ${disputeFilterTypes != DisputeFilterTypes.None ? "col-sm" : ""} pm-0 mt-2`}
                  titleClassName={`btn btn-white filter-icon ${disputeFilterTypes != DisputeFilterTypes.None ? "mr-sm-1" : ""}`}>
                  <button children="All"
                     className="dropdown-item"
                     onClick={() => { onSearch(1, undefined, undefined, undefined, GetAllRecords); }} />
                  {OrderStatusTypeList.filter(o => availableStatusTypeList!.includes(o.Value))?.map(statusType =>
                     <button className="dropdown-item" key={statusType.Id}
                        onClick={() => { onSearch(1, undefined, undefined, undefined, statusType.Id?.toString()); }} >
                        {statusType.Name}
                     </button>
                  )}
               </DropDown>
               {disputeFilterTypes != DisputeFilterTypes.None &&
                  <DropDown title={`Dispute: ${getDisputeDisplayValue()}`}
                     className="col-12 col-sm pm-0 mt-2"
                     titleClassName="btn btn-white filter-icon ml-sm-1">
                     <button children="All"
                        onClick={() => onSearch(1, undefined, undefined, undefined, undefined, GetAllRecords)}
                        className="dropdown-item" />
                     {(disputeFilterTypes == DisputeFilterTypes.Open || disputeFilterTypes == DisputeFilterTypes.OpenAndClose) &&
                        <button children="Open Disputes"
                           onClick={() => onSearch(1, undefined, undefined, undefined, undefined, "true")}
                           className="dropdown-item" />
                     }
                     {(disputeFilterTypes == DisputeFilterTypes.Close || disputeFilterTypes == DisputeFilterTypes.OpenAndClose) &&
                        <button children="Closed Disputes"
                           onClick={() => onSearch(1, undefined, undefined, undefined, undefined, "false")}
                           className="dropdown-item" />
                     }
                  </DropDown>
               }
            </div>
            {tbl.totalItemCount == 0 && availableStatusTypeList.length < 1 &&
               <div className="row col-12 pm-0 justify-content-center">
                  <div className="col-12 text-center mt-4">You don't have any orders. <br /> Let's do something about it.</div>
                  <Button className="btn btn-green col-auto mt-4" children="Shop now" onClick={() => { history.push("/Shop"); }} />
               </div>
            }
            <Alert alert={errorAlert.alert}
               className="col-12 mb-2"
               onClosed={() => { errorAlert.clear(); }}
            />
            {tbl.totalItemCount > 0 &&
               <Table tableData={tbl}
                  onChange={onSearch}
                  tblClassName="col-12 text-center table-striped"
               />
            }
            <OrderModal isOpen={isOpenOrderModal}
               order={selectOrder}
               onClose={() => { setIsOpenOrderModal(false); onSearch(); }} />
            <CommunicationModal isOpen={isOpenDisputeModal}
               communication={selectedDispute}
               access={Access}
               onClose={() => { setIsOpenDisputeModal(false); onSearch(); }}
            />
         </Container>
      </>
   );
};

declare type IProps = {
};
export default MyOrders;
