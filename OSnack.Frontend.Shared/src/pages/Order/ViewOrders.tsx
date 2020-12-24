import React, { useEffect, useRef, useState } from 'react';
import { IReturnUseAllOrder, useAllOrder } from '../../hooks/OfficialHooks/useOrderHook';
import Alert, { AlertObj, useAlert } from '../../components/Texts/Alert';
import { Order, OrderStatusType, OrderStatusTypeList, PaymentTypeList } from '../../_core/apiModels';
import { ClientAppAccess, ConstMaxNumberOfPerItemsPage, GetAllRecords } from '../../_core/constant.Variables';
import { useHistory } from 'react-router-dom';
import { getBadgeByOrderStatusType } from '../../_core/appFunc';
import Table, { TableData, TableHeaderData, TableRowData, TableView } from '../../components/Table/Table';
import TableRowButtons from '../../components/Table/TableRowButtons';
import PageHeader from '../../components/Texts/PageHeader';
import Pagination from '../../components/Pagination/Pagination';
import OrderModal from './OrderModal';
import { Button } from '../../components/Buttons/Button';
import DropDown from '../../components/Buttons/DropDown';


const ViewOrders = (props: IProps) => {
   const isUnmounted = useRef(false);
   const history = useHistory();
   const errorAlert = useAlert(new AlertObj());
   const [selectUserId, setSelectUserId] = useState(0);
   const [selectOrder, setSelectOrder] = useState(new Order());
   const [selectType, setSelectType] = useState(OrderStatusTypeList.find(o => o.Value == OrderStatusType.InProgress)?.Id.toString() || "");
   const [isOpenOrderModal, setIsOpenOrderModal] = useState(false);

   const [availableStatusTypeList, setavailableStatusTypeList] = useState<OrderStatusType[]>([]);

   const [tableData, setTableData] = useState(new TableData());
   const [tblSortName, setTblsortName] = useState("Date");
   const [tblIsSortAsc, setTblIsSortAsc] = useState(false);
   const [tblTotalItemCount, setTblTotalItemCount] = useState(0);
   const [tblSelectedPage, setTblSelectedPage] = useState(1);
   const [tblMaxItemsPerPage, setTblMaxItemsPerPage] = useState(ConstMaxNumberOfPerItemsPage);

   useEffect(() => {
      const userId = Number(extractUrl(window.location.pathname)[PathNameQuery.userId]) || 0;
      setSelectUserId(userId);
      const selectPage = Number(extractUrl(window.location.pathname)[PathNameQuery.selectPage]) || tblSelectedPage;
      const maxItem = Number(extractUrl(window.location.pathname)[PathNameQuery.maxItem]) || tblMaxItemsPerPage;
      const status = extractUrl(window.location.pathname)[PathNameQuery.status] || selectType;
      const sortName = extractUrl(window.location.pathname)[PathNameQuery.sortName] || tblSortName;
      const sortType = extractUrl(window.location.pathname)[PathNameQuery.sortType] === 'true' || tblIsSortAsc;
      onSearch(sortType, sortName, selectPage, maxItem, status, userId);
   }, []);

   const extractUrl = (pathName: string) => {
      return pathName.split('/').filter(val => val.length > 0);
   };

   const onSearch = (
      isSortAsc = tblIsSortAsc,
      sortName = tblSortName,
      selectedPage = tblSelectedPage,
      maxItemsPerPage = tblMaxItemsPerPage,
      filterType = selectType,
      userId = selectUserId,
   ) => {

      if (selectedPage != tblSelectedPage)
         setTblSelectedPage(selectedPage);
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
      history.push(`/${extractUrl(window.location.pathname)[PathNameQuery.path]}/${userId}/${selectedPage || tblSelectedPage}/${maxItemsPerPage}/${filterType}/${sortName}/${isSortAsc}`);
      errorAlert.PleaseWait(500, isUnmounted);
      switch (props.access) {
         case ClientAppAccess.Official:
            useAllOrder(selectedPage, maxItemsPerPage, filterType)
               .then(onGetUserOrderSuccess)
               .catch(onGetUserOrderFailed);
            break;
         case ClientAppAccess.Secret:
            if (props.useAllUserOrderSecret != undefined)
               props.useAllUserOrderSecret(userId, selectedPage, maxItemsPerPage, filterType, isSortAsc, sortName)
                  .then(onGetUserOrderSuccess)
                  .catch(onGetUserOrderFailed);
            break;
         default:
            break;
      }


   };
   const onGetUserOrderSuccess = (result: IReturnUseAllOrder) => {
      if (isUnmounted.current) return;
      setTblTotalItemCount(result.data.totalCount || 0);
      setavailableStatusTypeList(result.data.availableTypes!);
      populateOrderTable(result.data.orderList!);
      errorAlert.clear();
   };
   const onGetUserOrderFailed = (alert: any) => {
      if (isUnmounted.current) return;
      errorAlert.set(alert);
   };
   const populateOrderTable = (orderList: Order[]) => {
      let tData = new TableData();
      tData.headers.push(new TableHeaderData("Status", "Status", true));
      tData.headers.push(new TableHeaderData("Total Price", "TotalPrice", true));
      tData.headers.push(new TableHeaderData("Date", "Date", true));
      tData.headers.push(new TableHeaderData("Payment", "", false));
      tData.headers.push(new TableHeaderData("", "", false));

      orderList.map(order =>
         tData.rows.push(new TableRowData([
            <span>  <span className={`${getBadgeByOrderStatusType(order.status)} font-weight-bold pm-0  h6 mt-auto mb-auto `}
               children={OrderStatusTypeList.find(t => t.Value == order.status)?.Name} /></span>,
            `£${order.totalPrice}`,
            new Date(order.date!).ToShortDate(),
            PaymentTypeList.find(t => t.Value == order.payment.type)?.Name,
            <TableRowButtons
               btnClassName="btn-blue edit-icon"
               btnClick={() => {
                  setSelectOrder(order);
                  setIsOpenOrderModal(true);
               }}
            />
         ])));
      if (orderList.length == 0) {
         errorAlert.setSingleWarning("0", "No Result Found");
      } else {
         errorAlert.clear();
      }
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
         <PageHeader title={undefined == undefined ? "My Orders" : `Orders - ${undefined}`} className="hr-section-sm line-limit-1" />
         <Alert alert={errorAlert.alert}
            className="col-12 mb-2"
            onClosed={() => { errorAlert.clear(); }}
         />
         <div className="row pm-0">
            <div className="col-12 col-sm-6 col-md-4 pm-0" >
               {props.backUrl != undefined &&
                  <Button onClick={() => history.push(props.backUrl!)} children="Back" className="mr-auto btn-lg back-icon" />
               }
            </div>
            <DropDown title={`Status Type: ${OrderStatusTypeList.find((s) => s.Id?.toString() == selectType)?.Name || "All"}`}
               className="col-12 col-sm-6 col-md-4 ml-auto m-0 p-1"
               titleClassName="btn btn-white filter-icon">
               <button className="dropdown-item"
                  onClick={() => { onSearch(undefined, undefined, 1, undefined, GetAllRecords); }} >
                  All
                  </button>
               {OrderStatusTypeList.filter(o => availableStatusTypeList.includes(o.Value))?.map(statusType =>
                  <button className="dropdown-item" key={statusType.Id}
                     onClick={() => { onSearch(undefined, undefined, 1, undefined, statusType.Id?.toString()); }} >
                     {statusType.Name}
                  </button>
               )}
            </DropDown>
         </div>
         <div className="row col-12 pm-0  bg-white pb-2">
            <Table className="col-12 text-center table-striped"
               defaultSortName={tblSortName}
               data={tableData}
               onSortClick={onSearch}
               view={TableView.CardView}
               listCount={tblTotalItemCount}
            />
            <Pagination
               maxItemsPerPage={tblMaxItemsPerPage}
               selectedPage={tblSelectedPage}
               onChange={(selectedPage, maxItemsPerPage) => {
                  onSearch(tblIsSortAsc, tblSortName, selectedPage, maxItemsPerPage);
               }}
               listCount={tblTotalItemCount} />
         </div>
         <OrderModal isOpen={isOpenOrderModal}
            order={selectOrder}
            access={props.access}
            onClose={() => setIsOpenOrderModal(false)}
            onSave={UpdateOrder} />


      </>
   );
};

declare type IProps = {
   access: ClientAppAccess;
   useAllUserOrderSecret?: (userId: number, selectedPage: number, maxNumberPerItemsPage: number, filterStatus: string | null, isSortAsce: boolean | undefined, sortName: string | null | undefined) => Promise<IReturnUseAllOrder>;
   usePutOrderStatusOrder?: (modifiedOrder: Order) => Promise<{ data: Order, status?: number; }>;
   backUrl?: string;
};
export default ViewOrders;

enum PathNameQuery {
   path,
   userId,
   selectPage,
   maxItem,
   status,
   sortName,
   sortType

}
