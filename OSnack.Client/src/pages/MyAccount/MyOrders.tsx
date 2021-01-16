import Table, { TableData, useTableData } from 'osnack-frontend-shared/src/components/Table/Table';
import TableRowButtons from 'osnack-frontend-shared/src/components/Table/TableRowButtons';
import Pagination from 'osnack-frontend-shared/src/components/Pagination/Pagination';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { Communication, Order, OrderStatusType, OrderStatusTypeList, PaymentTypeList } from 'osnack-frontend-shared/src/_core/apiModels';
import { checkUri, generateUri, getBadgeByOrderStatusType } from 'osnack-frontend-shared/src/_core/appFunc';
import { GetAllRecords } from 'osnack-frontend-shared/src/_core/constant.Variables';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Container from '../../components/Container';
import { IReturnUseAllOfficialOrder, useAllOfficialOrder } from 'osnack-frontend-shared/src/hooks/OfficialHooks/useOrderHook';
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

   useEffect(() => {
      onSearch(...checkUri(window.location.pathname,
         [tbl.selectedPage, tbl.maxItemsPerPage, selectOrderType, selectDisputeType, tbl.isSortAsc, tbl.sortName, GetAllRecords]));
      return () => { isUnmounted.current = true; };
   }, []);

   const onSearch = (
      selectedPage = tbl.selectedPage,
      maxItemsPerPage = tbl.maxItemsPerPage,
      filterOrderType = selectOrderType,
      filterDisputeType = selectDisputeType,
      isSortAsc = tbl.isSortAsc,
      sortName = tbl.sortName,
      searchString = GetAllRecords
   ) => {
      if (searchValue != null && searchValue != "") searchString = searchValue;
      if (searchString != GetAllRecords) setSearchValue(searchString);
      if (selectedPage != tbl.selectedPage) tbl.setSelectedPage(selectedPage);
      if (Number(filterOrderType) == -1) filterOrderType = GetAllRecords;
      if (filterOrderType != selectOrderType) setSelectOrderType(filterOrderType);
      if (Number(filterDisputeType) == -1) filterDisputeType = GetAllRecords;
      if (filterDisputeType != selectDisputeType) setSelectDisputeType(filterDisputeType);
      if (isSortAsc != tbl.isSortAsc) tbl.setIsSortAsc(isSortAsc);
      if (sortName != tbl.sortName) tbl.setSortName(sortName);
      if (selectedPage != undefined && selectedPage != tbl.selectedPage) tbl.setSelectedPage(selectedPage);
      if (maxItemsPerPage != tbl.maxItemsPerPage) tbl.setMaxItemsPerPage(maxItemsPerPage);

      history.push(generateUri(window.location.pathname,
         [selectedPage,
            maxItemsPerPage,
            filterOrderType === GetAllRecords ? -1 : filterOrderType,
            filterDisputeType === GetAllRecords ? -1 : filterDisputeType,
            Number(isSortAsc),
            sortName,
            searchString != GetAllRecords ? searchString : ""]));


      errorAlert.pleaseWait(isUnmounted);
      useAllOfficialOrder(selectedPage, maxItemsPerPage, searchString, filterOrderType, isSortAsc, sortName, filterDisputeType)
         .then(onGetUserOrderSuccess)
         .catch(onGetUserOrderFailed);



   };
   const onGetUserOrderSuccess = (result: IReturnUseAllOfficialOrder) => {
      if (isUnmounted.current) return;
      tbl.setTotalItemCount(result.data.totalCount || 0);
      setavailableStatusTypeList(result.data.availableTypes!);
      populateOrderTable(result.data.orderList!);
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

      tbl.setData(tData);
   };
   const getDisputeDisplayValue = () => {
      switch (selectDisputeType) {
         case "True":
            return "Open ";
         case "False":
            return "Closed ";
      }
      return "All";
   };
   return (
      <Container className="mt-2 mb-2">
         <PageHeader title="My Orders" className="hr-section-sm line-limit-1" />
         <Alert alert={errorAlert.alert}
            className="col-12 mb-2"
            onClosed={() => { errorAlert.clear(); }}
         />
         {tbl.totalItemCount == 0 &&
            <div className="row col-12 justify-content-center">
               <div className="col-12 text-center mt-4">You do not have any orders. <br /> Let's do something about it.</div>
               <Button className="btn btn-green col-auto mt-4" children="Shop now" onClick={() => { history.push("/Shop"); }} />
            </div>
         }
         {tbl.totalItemCount > 0 &&
            <>
               <div className="col-12 bg-white pb-2 ">
                  <div className="row col-12 pm-0 mb-3">
                     <SearchInput
                        value={searchValue}
                        onChange={i => setSearchValue(i.target.value)}
                        className="col-12"
                        onSearch={() => { onSearch(1); }}
                     />
                     <DropDown title={`Status Type: ${OrderStatusTypeList.find((s) => s.Id?.toString() == selectOrderType)?.Name || "All"}`}
                        className="col-12 col-sm pm-0 mt-2"
                        titleClassName="btn btn-white filter-icon mr-sm-1">
                        <button children="All"
                           className="dropdown-item"
                           onClick={() => { onSearch(1, undefined, GetAllRecords); }} />
                        {OrderStatusTypeList.filter(o => availableStatusTypeList!.includes(o.Value))?.map(statusType =>
                           <button className="dropdown-item" key={statusType.Id}
                              onClick={() => { onSearch(1, undefined, statusType.Id?.toString()); }} >
                              {statusType.Name}
                           </button>
                        )}
                     </DropDown>
                     <DropDown title={`Dispute: ${getDisputeDisplayValue()}`}
                        className="col-12 col-sm pm-0 mt-2"
                        titleClassName="btn btn-white filter-icon ml-sm-1">
                        <button children="All"
                           onClick={() => onSearch(1, undefined, undefined, GetAllRecords)}
                           className="dropdown-item" />
                        <button children="Open Disputes"
                           onClick={() => onSearch(1, undefined, undefined, "True")}
                           className="dropdown-item" />
                        <button children="Closed Disputes"
                           onClick={() => onSearch(1, undefined, undefined, "False")}
                           className="dropdown-item" />
                     </DropDown>
                  </div>
                  <Table className="col-12 text-center table-striped"
                     defaultSortName={tbl.sortName}
                     data={tbl.data}
                     onSortChange={(selectedPage, isSortAsce, sortName) => { onSearch(selectedPage, undefined, undefined, undefined, isSortAsce, sortName); }}
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
            </>
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
   );
};

declare type IProps = {
};
export default MyOrders;
