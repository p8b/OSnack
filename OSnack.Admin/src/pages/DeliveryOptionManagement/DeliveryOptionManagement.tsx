import React, { useEffect, useRef, useState } from 'react';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import Table, { TableData, useTableData } from 'osnack-frontend-shared/src/components/Table/Table';
import { DeliveryOption } from 'osnack-frontend-shared/src/_core/apiModels';
import Container from '../../components/Container';
import SearchInput from 'osnack-frontend-shared/src/components/Inputs/SeachInput';
import { useSearchDeliveryOption } from '../../SecretHooks/useDeliveryOptionHook';
import { GetAllRecords } from 'osnack-frontend-shared/src/_core/appConst';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import TableRowButtons from 'osnack-frontend-shared/src/components/Table/TableRowButtons';
import { useHistory } from 'react-router-dom';
import { extractUri, generateUri } from 'osnack-frontend-shared/src/_core/appFunc';
import DeliveyOptionModal from './DeliveyOptionModal';

const DeliveryOptionManagement = (props: IProps) => {
   const isUnmounted = useRef(false);
   const history = useHistory();
   const errorAlert = useAlert(new AlertObj());
   const tbl = useTableData("IsPremitive", true);
   const [searchValue, setSearchValue] = useState("");
   const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(new DeliveryOption());
   const [isOpenDeliveryOptionModal, setIsOpenDeliveryOptionModal] = useState(false);

   useEffect(() => {
      return () => { isUnmounted.current = true; };
   }, []);
   useEffect(() => {
      onSearch(...extractUri([
         tbl.selectedPage,
         tbl.maxItemsPerPage,
         tbl.isSortAsc,
         tbl.sortName,
         GetAllRecords]));
   }, [window.location.pathname]);

   const onSearch = (
      selectedPage = tbl.selectedPage,
      maxItemsPerPage = tbl.maxItemsPerPage,
      isSortAsc = tbl.isSortAsc,
      sortName = tbl.sortName,
      searchString = GetAllRecords
   ) => {

      if (searchValue != null && searchValue != "")
         searchString = searchValue;

      if (searchString != GetAllRecords)
         setSearchValue(searchString);

      if (isSortAsc != tbl.isSortAsc)
         tbl.setIsSortAsc(isSortAsc);

      if (sortName != tbl.sortName)
         tbl.setSortName(sortName);

      if (selectedPage != tbl.selectedPage)
         tbl.setSelectedPage(selectedPage);

      if (maxItemsPerPage != tbl.maxItemsPerPage)
         tbl.setMaxItemsPerPage(maxItemsPerPage);

      const newUri = generateUri([
         selectedPage,
         maxItemsPerPage,
         Number(isSortAsc),
         sortName,
         searchString != GetAllRecords ? searchValue : ""]);
      if (window.location.pathname.toLowerCase() != newUri.toLowerCase())
         history.push(newUri);

      errorAlert.pleaseWait(isUnmounted);
      useSearchDeliveryOption(selectedPage, maxItemsPerPage, searchString, isSortAsc, sortName).then(
         result => {
            if (isUnmounted.current) return;
            errorAlert.clear();
            tbl.setTotalItemCount(result.data.totalCount || 0);
            populateTable(result.data.deliveryOptionList);
         }).catch((errors) => {
            if (isUnmounted.current) return;
            errorAlert.set(errors);
         });
   };
   const populateTable = (deliveryOptionList?: DeliveryOption[]) => {
      if (deliveryOptionList?.length == 0) {
         errorAlert.setSingleWarning("0", "No Result Found");
         return;
      }
      errorAlert.clear();

      let tData = new TableData();
      tData.AddHeader("Name", "Name")
         .AddHeader("Is Primitive", "IsPremitive");

      deliveryOptionList?.map(deliveyOption =>
         tData.AddRow([
            deliveyOption.name,
            deliveyOption.isPremitive ? "Yes" : "No",
            <TableRowButtons
               btnClassName="btn-blue edit-icon"
               btnClick={() => {
                  setSelectedDeliveryOption(deliveyOption);
                  setIsOpenDeliveryOptionModal(true);
               }}
            />
         ]));

      tbl.setData(tData);
   };
   const resetCategoryModal = () => {
      setIsOpenDeliveryOptionModal(false);
      setSelectedDeliveryOption(new DeliveryOption());
   };

   return (
      <Container className="container-fluid ">
         <PageHeader title="Delivery Options" className="line-header" />
         <div className="row col-12 py-3 mx-auto bg-white">
            <SearchInput
               value={searchValue}
               onChange={i => setSearchValue(i.target.value)}
               className="col-12 col-md-9 pr-md-4"
               onSearch={() => { onSearch(1); }}
            />

            <Button children={<span className="add-icon" children="Delivery Option" />}
               className="col-12 col-md-3 btn-green btn mt-2 mt-md-0"
               onClick={() => { setSelectedDeliveryOption(new DeliveryOption()); setIsOpenDeliveryOptionModal(true); }}
            />

            <Alert alert={errorAlert.alert}
               className="col-12 mb-2"
               onClosed={() => { errorAlert.clear(); }}
            />

            {/***** Category Table  ****/}
            {tbl.totalItemCount > 0 &&
               <Table tableData={tbl}
                  onChange={onSearch}
                  tblClassName="col-12 text-center table-striped"
               />
            }
            {/***** Add/ modify category modal  ****/}
            <DeliveyOptionModal isOpen={isOpenDeliveryOptionModal}
               onSuccess={() => { resetCategoryModal(); onSearch(); }}
               deliveryOption={selectedDeliveryOption}
               onClose={() => { resetCategoryModal(); onSearch(); }} />
         </div>
      </Container>
   );
};

declare type IProps = {
};
export default DeliveryOptionManagement;
