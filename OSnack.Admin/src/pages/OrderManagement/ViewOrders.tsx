import React, { useEffect, useRef, useState } from 'react';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { Communication, Order, OrderStatusType, OrderStatusTypeList, PaymentTypeList, DisputeFilterTypes } from 'osnack-frontend-shared/src/_core/apiModels';
import { GetAllRecords } from 'osnack-frontend-shared/src/_core/appConst';
import { useHistory } from 'react-router-dom';
import { extractUri, convertUriParamToBool, generateUri, getBadgeByOrderStatusType } from 'osnack-frontend-shared/src/_core/appFunc';
import Table, { TableData, useTableData } from 'osnack-frontend-shared/src/components/Table/Table';
import TableRowButtons from 'osnack-frontend-shared/src/components/Table/TableRowButtons';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import OrderModal from '../../pages/OrderManagement/OrderModal';
import CommunicationModal from 'osnack-frontend-shared/src/components/Modals/CommunicationModal';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import DropDown from 'osnack-frontend-shared/src/components/Buttons/DropDown';
import SearchInput from 'osnack-frontend-shared/src/components/Inputs/SeachInput';
import { usePutSecretCommunication } from '../../SecretHooks/useCommunicationHook';
import { useAllOrder, useAllUserOrder } from '../../SecretHooks/useOrderHook';
import { Access } from '../../_core/appConstant.Variables';
import Container from '../../components/Container';

const ViewOrders = (props: IProps) => {
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
   const [fullName, setFullName] = useState("");
   const [disputeFilterTypes, setDisputeFilterTypes] = useState(DisputeFilterTypes.None);
   const [availableStatusTypeList, setAvailableStatusTypeList] = useState<OrderStatusType[]>([]);

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
         history.push({
            pathname: newUri,
            state: {
               userId: props.location?.state?.userId,
               backUrl: props.location?.state?.backUrl
            }
         });

      errorAlert.pleaseWait(isUnmounted);
      if (props.location?.state?.userId == undefined)
         useAllOrder(selectedPage, maxItemsPerPage, searchString, filterOrderType, isSortAsc, sortName, filterDisputeType).then(result => {
            if (isUnmounted.current) return;
            tbl.setTotalItemCount(result.data.totalCount || 0);
            setAvailableStatusTypeList(result.data.availableTypes!);
            setDisputeFilterTypes(result.data.disputeFilterType!);
            errorAlert.clear();
            populateOrderTable(result.data.orderList!);
         }).catch(errors => {
            if (isUnmounted.current) return;
            errorAlert.set(errors);
         });
      else
         useAllUserOrder(props.location.state?.userId, selectedPage, maxItemsPerPage, searchString, filterOrderType, isSortAsc, sortName, filterDisputeType)
            .then((result) => {
               if (isUnmounted.current) return;
               tbl.setTotalItemCount(result.data.totalCount || 0);
               setAvailableStatusTypeList(result.data.availableTypes!);
               setDisputeFilterTypes(result.data.disputeFilterType!);
               setFullName(result.data.fullName!);
               errorAlert.clear();
               populateOrderTable(result.data.orderList!);
            })
            .catch((errors) => {
               if (isUnmounted.current) return;
               errorAlert.set(errors);
            });
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
            <span className={`${getBadgeByOrderStatusType(order.status)} font-weight-bold pm-0  h6 mt-auto mb-auto `}
               children={OrderStatusTypeList.find(t => t.Value == order.status)?.Name} />,
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
      <Container className="container-fluid">
         <PageHeader title={<>Orders <span className="line-limit-1 pl-1">{props.location?.state?.userId == undefined ? "" : ` - ${fullName}`}</span></>} className="hr-section-sm" />
         {props.location?.state?.backUrl != undefined &&
            <Button onClick={() => history.push(props.location?.state?.backUrl!)} children="Back" className="col-auto mr-auto btn-lg back-icon" />
         }
         <div className="row col-12 py-3 mx-auto bg-white">
            <SearchInput
               value={searchValue}
               onChange={i => setSearchValue(i.target.value)}
               className="col-12 "
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
                     onClick={() => { onSearch(1, undefined, undefined, undefined, statusType.Id?.toString()); }}
                     children={statusType.Name}
                  />
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
               onClose={() => { setIsOpenOrderModal(false); }}
               onSuccess={() => { setIsOpenOrderModal(false); onSearch(); }}
               onDispute={props.onDispute} />
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
   location?: any;
   onDispute?: (order: Order) => void;
};
export default ViewOrders;
