import React, { useEffect, useRef, useState } from 'react';
import { useAllOrder } from '../../hooks/OfficialHooks/useOrderHook';
import Alert, { AlertObj, useAlert } from '../../components/Texts/Alert';
import { Order, OrderListAndTotalCount, OrderStatusTypeList } from '../../_core/apiModels';
import PageHeader from '../../components/Texts/PageHeader';
import ButtonCard from '../../components/Buttons/ButtonCard';
import OrderModal from './OrderModal';
import DropDown from '../../components/Buttons/DropDown';
import { ClientAppAccess, ConstMaxNumberOfPerItemsPage, GetAllRecords } from '../../_core/constant.Variables';
import LoadMore from '../../components/Pagination/LoadMore';

const ViewOrders = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [selectOrder, setSelectOrder] = useState(new Order());
   const [orderList, setOrderList] = useState<Order[]>([]);
   const [selectType, setSelectType] = useState(GetAllRecords);
   const [tblSelectedPage, setTblSelectedPage] = useState(1);
   const [tblTotalItemCount, setTblTotalItemCount] = useState(0);
   const [tblMaxItemsPerPage, setTblMaxItemsPerPage] = useState(ConstMaxNumberOfPerItemsPage);
   const [isOpenOrderModal, setIsOpenOrderModal] = useState(false);

   useEffect(() => {
      onSearch();
   }, []);

   const onSearch = (
      selectedPage = tblSelectedPage,
      maxItemsPerPage = tblMaxItemsPerPage,
      filterType = selectType,
   ) => {
      if (selectedPage != tblSelectedPage)
         setTblSelectedPage(selectedPage);
      if (filterType != selectType)
         setSelectType(filterType);

      if (maxItemsPerPage != tblMaxItemsPerPage)
         setTblMaxItemsPerPage(maxItemsPerPage);

      errorAlert.PleaseWait(500, isUnmounted);
      switch (props.access) {
         case ClientAppAccess.Official:
            useAllOrder(selectedPage, maxItemsPerPage, filterType)
               .then(onGetUserOrderSuccess)
               .catch(onGetUserOrderFailed);
            break;
         case ClientAppAccess.Secret:
            if (props.useAllUserOrderSecret != undefined)
               props.useAllUserOrderSecret(props.location.state?.userId || 0, selectedPage, maxItemsPerPage, filterType)
                  .then(onGetUserOrderSuccess)
                  .catch(onGetUserOrderFailed);
            break;
         default:
            break;
      }


   };
   const onGetUserOrderSuccess = (result: any) => {
      if (isUnmounted.current) return;
      errorAlert.clear();
      setTblTotalItemCount(result.data.totalNumber || 0);
      let list = orderList;
      if (result.data.orderList != undefined)
         list = list.concat(result.data.orderList);
      setOrderList(list);
   };
   const onGetUserOrderFailed = (alert: any) => {
      if (isUnmounted.current) return;
      errorAlert.set(alert);
   };

   return (
      <div className="container pb-4 ">
         <PageHeader title="My Orders" className="hr-section-sm" />
         <Alert alert={errorAlert.alert}
            className="col-12 mb-2"
            onClosed={() => { errorAlert.clear(); }}
         />
         <DropDown title={`Status Type: ${OrderStatusTypeList.find((s) => s.Id?.toString() == selectType)?.Name || "All"}`}
            className="col-12 col-sm-6 col-md-4 ml-auto m-0 p-1"
            titleClassName="btn btn-white filter-icon">
            <button className="dropdown-item"
               onClick={() => { onSearch(undefined, undefined, GetAllRecords); }} >
               All
                  </button>
            {OrderStatusTypeList.map(statusType =>
               <button className="dropdown-item" key={statusType.Id}
                  onClick={() => { onSearch(undefined, undefined, statusType.Id?.toString()); }} >
                  {statusType.Name}
               </button>
            )}
         </DropDown>

         <div className="row justify-content-center pm-0">
            {orderList.length > 0 &&
               orderList.map(order => {
                  return (
                     <ButtonCard key={order.id} cardClassName="card-lg col-12 row pm-0"
                        onClick={() => {
                           setSelectOrder(order);
                           setIsOpenOrderModal(true);
                        }} >
                        <div className="col-12  mt-3 ">
                           <div className="row text-left ml-2  mt-auto">Status: <p className="pm-0 ml-1 h6 mt-auto mb-auto "
                              children={OrderStatusTypeList.find(t => t.Value == order.status)?.Name} /> </div>
                           <div className="row text-left ml-2">Total Price: <div className="pm-0 ml-1 h6 mt-auto mb-auto"
                              children={`£${order.totalPrice}`} /> </div>
                           <div className="row text-left ml-2 ">Date:
                              <div className="pm-0 h6 ml-1 mt-auto mb-auto"
                                 children={new Date(order.date!).ToShortDate()} /> </div>

                           <div className="text-left ml-2">Delivery Address:
                              <p className="pm-0 ml-1 h6 line-limit-1" children={order.name} />
                              <p className="pm-0 ml-1 h6 line-limit-2" children={order.firstLine} />
                              <p className="pm-0 ml-1 h6 line-limit-2" children={order.secondLine} />
                              <p className="pm-0 ml-1 h6 line-limit-2" children={order.city} />
                              <p className="pm-0 ml-1 h6 line-limit-2" children={order.postcode} />
                           </div>

                        </div>
                        <div className="row col-12 pm-0  mt-auto">
                           <div className="btn-sm  col m-0 radius-none" children="Details" />

                        </div>
                     </ButtonCard>
                  );
               })
            }
         </div>
         <LoadMore
            maxItemsPerPage={tblMaxItemsPerPage}
            selectedPage={tblSelectedPage}
            onChange={(selectedPage, maxItemsPerPage) => { onSearch(selectedPage, maxItemsPerPage); }}
            listCount={tblTotalItemCount} />
         <OrderModal isOpen={isOpenOrderModal}
            order={selectOrder}
            onClose={() => setIsOpenOrderModal(false)} />
      </div >
   );
};

declare type IProps = {
   access: ClientAppAccess;
   useAllUserOrderSecret?: (userId: number, selectedPage: number, maxNumberPerItemsPage: number, filterStatus: string | null) => Promise<{ data: OrderListAndTotalCount, status?: number; }>;
   location: any;
};
export default ViewOrders;
