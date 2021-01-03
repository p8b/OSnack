import React, { useEffect, useRef, useState } from 'react';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import Table, { TableData } from 'osnack-frontend-shared/src/components/Table/Table';
import { DeliveryOption } from 'osnack-frontend-shared/src/_core/apiModels';
import Container from '../../components/Container';
import SearchInput from 'osnack-frontend-shared/src/components/Inputs/SeachInput';
import { useSearchDeliveryOption } from '../../SecretHooks/useDeliveryOptionHook';
import { ConstMaxNumberOfPerItemsPage, GetAllRecords } from 'osnack-frontend-shared/src/_core/constant.Variables';
import Pagination from 'osnack-frontend-shared/src/components/Pagination/Pagination';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import TableRowButtons from 'osnack-frontend-shared/src/components/Table/TableRowButtons';
import { useHistory } from 'react-router-dom';
import { checkUri, generateUri } from 'osnack-frontend-shared/src/_core/appFunc';
import DeliveyOptionModal from './DeliveyOptionModal';

const DeliveryOptionManagement = (props: IProps) => {
   const isUnmounted = useRef(false);
   const history = useHistory();
   const errorAlert = useAlert(new AlertObj());
   const [searchValue, setSearchValue] = useState("");
   const [selectedDeliveryOption, setSelectedDeliveryOption] = useState(new DeliveryOption());
   const [isOpenDeliveryOptionModal, setIsOpenDeliveryOptionModal] = useState(false);

   const [tableData, setTableData] = useState(new TableData());
   const [tblSortName, setTblsortName] = useState("IsPremitive");
   const [tblIsSortAsc, setTblIsSortAsc] = useState(true);
   const [tblTotalItemCount, setTblTotalItemCount] = useState(0);
   const [tblSelectedPage, setTblSelectedPage] = useState(1);
   const [tblMaxItemsPerPage, setTblMaxItemsPerPage] = useState(ConstMaxNumberOfPerItemsPage);

   useEffect(() => {
      onSearch(...checkUri(window.location.pathname,
         [tblSelectedPage, tblMaxItemsPerPage, tblIsSortAsc, tblSortName, GetAllRecords]));
      return () => { isUnmounted.current = true; };
   }, []);

   const onSearch = (
      selectedPage = tblSelectedPage,
      maxItemsPerPage = tblMaxItemsPerPage,
      isSortAsc = tblIsSortAsc,
      sortName = tblSortName,
      searchString = GetAllRecords
   ) => {

      if (searchValue != null && searchValue != "")
         searchString = searchValue;
      if (searchString != GetAllRecords)
         setSearchValue(searchString);

      if (isSortAsc != tblIsSortAsc)
         setTblIsSortAsc(isSortAsc);

      if (sortName != tblSortName)
         setTblsortName(sortName);

      if (selectedPage != tblSelectedPage)
         setTblSelectedPage(selectedPage);

      if (maxItemsPerPage != tblMaxItemsPerPage)
         setTblMaxItemsPerPage(maxItemsPerPage);

      history.push(generateUri(window.location.pathname,
         [selectedPage || tblSelectedPage,
            maxItemsPerPage, Number(isSortAsc), sortName, searchString != GetAllRecords ? searchString : ""]));

      errorAlert.PleaseWait(500, isUnmounted);
      useSearchDeliveryOption(selectedPage, maxItemsPerPage, searchString, isSortAsc, sortName).then(
         result => {
            if (isUnmounted.current) return;
            errorAlert.clear();
            setTblTotalItemCount(result.data.totalCount || 0);
            populateTable(result.data.deliveryOptionList);
         }).catch((alert) => {
            if (isUnmounted.current) return;
            errorAlert.set(alert);
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
               btnClick={() => { editDeliveyOption(deliveyOption); }}
            />
         ]));

      setTableData(tData);
   };

   const editDeliveyOption = (deliveryOption: DeliveryOption) => {
      setSelectedDeliveryOption(deliveryOption);
      setIsOpenDeliveryOptionModal(true);
   };
   const resetCategoryModal = () => {
      setIsOpenDeliveryOptionModal(false);
      setSelectedDeliveryOption(new DeliveryOption());
   };

   return (
      <Container className="container-fluid ">
         <PageHeader title="Delivey Options" className="line-header" />
         <Container className="row col-12 col-md-11 pt-2 pb-2 bg-white ml-auto mr-auto">
            {/***** Search Input and new category button  ****/}
            <SearchInput key="searchInput"
               value={searchValue}
               onChange={i => setSearchValue(i.target.value)}
               className="col-12 col-md-9 pr-md-4"
               onSearch={() => { onSearch(1); }}
            />

            <Button children={<span className="add-icon" children="Delivery Option" />}
               className="col-12 col-md-3 btn-green btn"
               onClick={() => { setSelectedDeliveryOption(new DeliveryOption()); setIsOpenDeliveryOptionModal(true); }}
            />

            <Alert alert={errorAlert.alert}
               className="col-12 mb-2"
               onClosed={() => { errorAlert.clear(); }}
            />

            {/***** Category Table  ****/}
            {tblTotalItemCount > 0 &&
               <div className="row col-12 pm-0">
                  <Table className="col-12 text-center table-striped"
                     defaultSortName={tblSortName}
                     data={tableData}
                     onSortChange={(isSortAsce, sortName) => onSearch(undefined, undefined, isSortAsce, sortName)}
                     listCount={tblTotalItemCount}
                  />
                  <Pagination
                     maxItemsPerPage={tblMaxItemsPerPage}
                     selectedPage={tblSelectedPage}
                     listCount={tblTotalItemCount}
                     onChange={(selectedPage, maxItemsPerPage) => { onSearch(selectedPage, maxItemsPerPage); }}
                  />

               </div>
            }
            {/***** Add/ modify category modal  ****/}
            <DeliveyOptionModal isOpen={isOpenDeliveryOptionModal}
               onSuccess={() => { onSearch(); }}
               deliveryOption={selectedDeliveryOption}
               onClose={() => { resetCategoryModal(); onSearch(); }} />
         </Container>
      </Container>
   );
};

declare type IProps = {
};
export default DeliveryOptionManagement;
