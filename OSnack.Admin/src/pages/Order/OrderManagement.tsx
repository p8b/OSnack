import DropDown from 'osnack-frontend-shared/src/components/Buttons/DropDown';
import SearchInput from 'osnack-frontend-shared/src/components/Inputs/SeachInput';
import Pagination from 'osnack-frontend-shared/src/components/Pagination/Pagination';
import Table, { TableData, TableView } from 'osnack-frontend-shared/src/components/Table/Table';
import TableRowButtons from 'osnack-frontend-shared/src/components/Table/TableRowButtons';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import OrderModal from 'osnack-frontend-shared/src/components/Modals/OrderModal';
import { Communication, Order, OrderStatusType, OrderStatusTypeList, PaymentTypeList } from 'osnack-frontend-shared/src/_core/apiModels';
import { checkUri, generateUri, getBadgeByOrderStatusType } from 'osnack-frontend-shared/src/_core/appFunc';
import { ConstMaxNumberOfPerItemsPage, GetAllRecords } from 'osnack-frontend-shared/src/_core/constant.Variables';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Container from '../../components/Container';
import { useAllOrder, usePutOrderStatusOrder } from '../../SecretHooks/useOrderHook';
import { useAddMessageSecretCommunication } from '../../SecretHooks/useCommunicationHook';
import { Access } from '../../_core/appConstant.Variables';
import DisputeModal from 'osnack-frontend-shared/src/components/Modals/DisputeModal';



const OrderManagement = (props: IProps) => {
   const isUnmounted = useRef(false);
   const history = useHistory();
   const errorAlert = useAlert(new AlertObj());
   const [searchValue, setSearchValue] = useState("");
   const [selectOrder, setSelectOrder] = useState(new Order());
   const [selectType, setSelectType] = useState(OrderStatusTypeList.find(o => o.Value == OrderStatusType.InProgress)?.Id.toString() || "");
   const [isOpenOrderModal, setIsOpenOrderModal] = useState(false);
   const [isOpenDisputeModal, setIsOpenDisputeModal] = useState(false);
   const [availableStatusTypeList, setAvailableStatusTypeList] = useState<OrderStatusType[]>([]);
   const [selectedDispute, setSelectedDispute] = useState(new Communication());

   const [tableData, setTableData] = useState(new TableData());
   const [tblSortName, setTblsortName] = useState("Date");
   const [tblIsSortAsc, setTblIsSortAsc] = useState(false);
   const [tblTotalItemCount, setTblTotalItemCount] = useState(0);
   const [tblSelectedPage, setTblSelectedPage] = useState(1);
   const [tblMaxItemsPerPage, setTblMaxItemsPerPage] = useState(ConstMaxNumberOfPerItemsPage);

   useEffect(() => {
      onSearch(...checkUri(window.location.pathname,
         [tblSelectedPage, tblMaxItemsPerPage, selectType, tblIsSortAsc, tblSortName, GetAllRecords]));

   }, []);



   const onSearch = (
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

      history.push(generateUri(window.location.pathname,
         [selectedPage || tblSelectedPage,
            maxItemsPerPage, filterType == GetAllRecords ? -1 : filterType,
         Number(isSortAsc), sortName, searchString != GetAllRecords ? searchString : ""]));

      errorAlert.PleaseWait(500, isUnmounted);

      useAllOrder(selectedPage, maxItemsPerPage, searchString, filterType, isSortAsc, sortName).then(result => {
         if (isUnmounted.current) return;
         setTblTotalItemCount(result.data.totalCount || 0);
         setAvailableStatusTypeList(result.data.availableTypes!);
         errorAlert.clear();
         populateOrderTable(result.data.orderList!);
      }).catch(alert => {
         if (isUnmounted.current) return;
         errorAlert.set(alert);
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
         .AddHeader("UserName")
         .AddHeader("Total Price", "TotalPrice")
         .AddHeader("Payment")
         .AddHeader("Date", "Date");

      orderList.map(order =>
         tData.AddRow([
            <span>  <span className={`${getBadgeByOrderStatusType(order.status)} font-weight-bold pm-0  h6 mt-auto mb-auto `}
               children={OrderStatusTypeList.find(t => t.Value == order.status)?.Name} /></span>,
            getFullNameOrEmail(order),
            `£${order.totalPrice}`,
            new Date(order.date!).ToShortDate(),
            PaymentTypeList.find(t => t.Value == order.payment.type)?.Name,
            <>
               {order.dispute == undefined &&
                  <TableRowButtons
                     btnClassName="btn-blue edit-icon"
                     btnClick={() => {
                        setSelectOrder(order);
                        setIsOpenOrderModal(true);
                     }}
                  />}
               {order.dispute != undefined &&
                  <TableRowButtons
                     btn1ClassName="col-12 col-lg-6 btn-blue edit-icon"
                     btn1Click={() => {
                        setSelectOrder(order);
                        setIsOpenOrderModal(true);
                     }}
                     btnClassName="col-12 col-lg-6 btn-white dispute-icon small-text"
                     btnChildren="Dispute"
                     btnClick={() => { setSelectedDispute(order.dispute!); setIsOpenDisputeModal(true); }}
                  />}
            </>
         ]));

      setTableData(tData);
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
      }).catch(alert => {
         if (isUnmounted.current) return;
         errorAlert.set(alert);
      });

   };


   return (

      <Container className="container-fluid ">
         <PageHeader title="Order Management" className="hr-section-sm line-limit-1" />

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

               <DropDown title={`Status Type: ${OrderStatusTypeList.find((s) => s.Id?.toString() == selectType)?.Name || "All"}`}
                  className="col-12 col-md-3 m-0 "
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
            </div>

            {tblTotalItemCount > 0 &&
               <div className="row col-12 pm-0  bg-white pb-2">
                  <Table className="col-12 text-center table-striped"
                     defaultSortName={tblSortName}
                     data={tableData}
                     onSortClick={(isSortAsce, sortName) => onSearch(undefined, undefined, undefined, isSortAsce, sortName)}
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
            <OrderModal isOpen={isOpenOrderModal}
               order={selectOrder}
               access={Access}
               onClose={() => setIsOpenOrderModal(false)}
               onSave={UpdateOrder} />
            <DisputeModal isOpen={isOpenDisputeModal}
               dispute={selectedDispute}
               access={Access}
               onClose={() => { setIsOpenDisputeModal(false); onSearch(); }}
               useAddMessageSecretCommunication={useAddMessageSecretCommunication}
            />
         </Container>
      </Container>
   );
};

declare type IProps = {

};
export default OrderManagement;
