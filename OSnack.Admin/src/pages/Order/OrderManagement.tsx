import DropDown from 'osnack-frontend-shared/src/components/Buttons/DropDown';
import SearchInput from 'osnack-frontend-shared/src/components/Inputs/SeachInput';
import Pagination from 'osnack-frontend-shared/src/components/Pagination/Pagination';
import Table, { TableData, TableView, useTableData } from 'osnack-frontend-shared/src/components/Table/Table';
import TableRowButtons from 'osnack-frontend-shared/src/components/Table/TableRowButtons';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import OrderModal from 'osnack-frontend-shared/src/components/Modals/OrderModal';
import { Communication, Order, OrderStatusType, OrderStatusTypeList, PaymentTypeList } from 'osnack-frontend-shared/src/_core/apiModels';
import { checkUri, generateUri, getBadgeByOrderStatusType } from 'osnack-frontend-shared/src/_core/appFunc';
import { GetAllRecords } from 'osnack-frontend-shared/src/_core/constant.Variables';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Container from '../../components/Container';
import { useAllOrder, usePutOrderStatusOrder } from '../../SecretHooks/useOrderHook';
import { usePutSecretCommunication } from '../../SecretHooks/useCommunicationHook';
import { Access } from '../../_core/appConstant.Variables';
import CommunicationModal from 'osnack-frontend-shared/src/components/Modals/CommunicationModal';

const OrderManagement = (props: IProps) => {
   const isUnmounted = useRef(false);
   const history = useHistory();
   const errorAlert = useAlert(new AlertObj());
   const tbl = useTableData("Date", true);
   const [searchValue, setSearchValue] = useState("");
   const [selectOrder, setSelectOrder] = useState(new Order());
   const [selectType, setSelectType] = useState(OrderStatusTypeList.find(o => o.Value == OrderStatusType.InProgress)?.Id.toString() || "");
   const [isOpenOrderModal, setIsOpenOrderModal] = useState(false);
   const [isOpenDisputeModal, setIsOpenDisputeModal] = useState(false);
   const [availableStatusTypeList, setAvailableStatusTypeList] = useState<OrderStatusType[]>([]);
   const [selectedDispute, setSelectedDispute] = useState(new Communication());

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
      if (Number(filterType) == -1) filterType = GetAllRecords;
      if (filterType != selectType) setSelectType(filterType);
      if (isSortAsc != tbl.isSortAsc) tbl.setIsSortAsc(isSortAsc);
      if (sortName != tbl.sortName) tbl.setSortName(sortName);
      if (selectedPage != tbl.selectedPage) tbl.setSelectedPage(selectedPage);
      if (maxItemsPerPage != tbl.maxItemsPerPage) tbl.setMaxItemsPerPage(maxItemsPerPage);
      if (selectedPage != tbl.selectedPage) tbl.setSelectedPage(selectedPage);

      history.push(generateUri(window.location.pathname,
         [selectedPage || tbl.selectedPage,
            maxItemsPerPage, filterType == GetAllRecords ? -1 : filterType,
         Number(isSortAsc), sortName, searchString != GetAllRecords ? searchString : ""]));

      errorAlert.pleaseWait(isUnmounted);

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
   };
   const populateOrderTable = (orderList: Order[]) => {
      if (orderList.length == 0) {
         if (selectType == OrderStatusTypeList.find(o => o.Value == OrderStatusType.InProgress)?.Id.toString()) {
            onSearch(1, undefined, GetAllRecords);
            return;
         }
         errorAlert.setSingleWarning("0", "No Result Found");
         return;
      }
      errorAlert.clear();
      let tData = new TableData();
      tData.AddHeader("Status", "Status")
         .AddHeader("Name")
         .AddHeader("Total Price", "TotalPrice")
         .AddHeader("Payment")
         .AddHeader("Date", "Date");

      orderList.map(order =>
         tData.AddRow([
            <span>  <span className={`${getBadgeByOrderStatusType(order.status)} pm-0  h6 mt-auto mb-auto `}
               children={OrderStatusTypeList.find(t => t.Value == order.status)?.Name} /></span>,
            getFullNameOrEmail(order),
            `£${order.totalPrice}`,
            PaymentTypeList.find(t => t.Value == order.payment.type)?.Name,
            new Date(order.date!).ToShortDate(),
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
   const getFullNameOrEmail = (order: Order) => {
      if (order.user == undefined) {
         return <div className="row justify-content-center"><div className="small-text text-gray mr-1 mt-auto">Guest</div>{order.name}</div>;
      }
      return `${order.user.firstName} ${order.user.surname}`;
   };
   const UpdateOrder = (order: Order) => {
      setIsOpenOrderModal(false);
      usePutOrderStatusOrder!(order != undefined ? order : selectOrder).then(() => {
         errorAlert.clear();
         errorAlert.setSingleSuccess("updated", "Order Updated.");
         onSearch();
      }).catch(errors => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
      });

   };

   return (
      <Container className="container-fluid ">
         <PageHeader title="Orders" className="hr-section-sm line-limit-1" />
         <div className="row col-12 py-3 mx-auto bg-white">
            <SearchInput
               className="col-12 col-md-9 pr-md-4"
               value={searchValue}
               onChange={i => setSearchValue(i.target.value)}
               onSearch={() => { onSearch(1); }}
            />

            <DropDown title={`Status Type: ${OrderStatusTypeList.find((s) => s.Id?.toString() == selectType)?.Name || "All"}`}
               className="col-12 col-md-3 pm-0 "
               titleClassName="btn btn-white filter-icon">
               <button className="dropdown-item"
                  onClick={() => { onSearch(1, undefined, GetAllRecords); }} >
                  All
                  </button>
               {OrderStatusTypeList.filter(o => availableStatusTypeList.includes(o.Value))?.map(statusType =>
                  <button className="dropdown-item" key={statusType.Id}
                     onClick={() => { onSearch(1, undefined, statusType.Id?.toString()); }} >
                     {statusType.Name}
                  </button>
               )}
            </DropDown>

            <Alert alert={errorAlert.alert}
               className="col-12 mb-2"
               onClosed={() => { errorAlert.clear(); }}
            />
            {tbl.totalItemCount > 0 &&
               <div className="row col-12 pm-0 bg-white mt-3 pb-2">
                  <Table className="col-12 text-center table-striped"
                     defaultSortName={tbl.sortName}
                     data={tbl.data}
                     onSortChange={(selectedPage, isSortAsce, sortName) => onSearch(selectedPage, undefined, undefined, isSortAsce, sortName)}
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
            <OrderModal isOpen={isOpenOrderModal}
               order={selectOrder}
               access={Access}
               onClose={() => setIsOpenOrderModal(false)}
               onSave={UpdateOrder}
               usePutSecretCommunication={usePutSecretCommunication} />
            <CommunicationModal isOpen={isOpenDisputeModal}
               communication={selectedDispute}
               access={Access}
               onClose={() => { setIsOpenDisputeModal(false); onSearch(); }}
               usePutSecretCommunication={usePutSecretCommunication}
            />
         </div>
      </Container>
   );
};

declare type IProps = {

};
export default OrderManagement;
