import React, { useEffect, useRef, useState } from 'react';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import Table, { TableData, useTableData } from 'osnack-frontend-shared/src/components/Table/Table';
import { Coupon, CouponTypeList } from 'osnack-frontend-shared/src/_core/apiModels';
import CouponModel from './CouponModel';
import Container from '../../components/Container';
import SearchInput from 'osnack-frontend-shared/src/components/Inputs/SeachInput';
import { useSearchCoupon } from '../../SecretHooks/useCouponHook';
import { GetAllRecords } from 'osnack-frontend-shared/src/_core/constant.Variables';
import Pagination from 'osnack-frontend-shared/src/components/Pagination/Pagination';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import DropDown from 'osnack-frontend-shared/src/components/Buttons/DropDown';
import TableRowButtons from 'osnack-frontend-shared/src/components/Table/TableRowButtons';
import { useHistory } from 'react-router-dom';
import { checkUri, generateUri } from 'osnack-frontend-shared/src/_core/appFunc';

const CouponManagement = (props: IProps) => {
   const isUnmounted = useRef(false);
   const history = useHistory();
   const errorAlert = useAlert(new AlertObj());
   const tbl = useTableData("Name", true);
   const [searchValue, setSearchValue] = useState("");
   const [selectedFilterType, setSelectedfilterType] = useState(GetAllRecords);
   const [selectedCoupon, setSelectedCoupon] = useState(new Coupon());
   const [isOpenCouponModal, setIsOpenCouponModal] = useState(false);

   useEffect(() => {
      onSearch(...checkUri(window.location.pathname,
         [tbl.selectedPage, tbl.maxItemsPerPage, selectedFilterType, tbl.isSortAsc, tbl.sortName, GetAllRecords]));
      return () => { isUnmounted.current = true; };
   }, []);

   const onSearch = (
      selectedPage = tbl.selectedPage,
      maxItemsPerPage = tbl.maxItemsPerPage,
      filterType = selectedFilterType,
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

      if (Number(filterType) == -1)
         filterType = GetAllRecords;
      if (filterType != selectedFilterType)
         setSelectedfilterType(filterType);

      if (selectedPage != tbl.selectedPage)
         tbl.setSelectedPage(selectedPage);
      if (maxItemsPerPage != tbl.maxItemsPerPage)
         tbl.setMaxItemsPerPage(maxItemsPerPage);

      history.push(generateUri(window.location.pathname,
         [selectedPage || tbl.selectedPage,
            maxItemsPerPage, filterType == GetAllRecords ? -1 : filterType,
         Number(isSortAsc), sortName, searchString != GetAllRecords ? searchString : ""]));


      errorAlert.pleaseWait(isUnmounted);
      useSearchCoupon(selectedPage, maxItemsPerPage, searchString, filterType, isSortAsc, sortName).then(
         result => {
            if (isUnmounted.current) return;
            errorAlert.clear();
            tbl.setTotalItemCount(result.data.totalCount || 0);
            populateCategoryTable(result.data.couponList!);
         }).catch((errors) => {
            if (isUnmounted.current) return;
            errorAlert.set(errors);
         });
   };
   const isExpire = (date: Date) => {
      const dt = new Date(date);
      if (dt < new Date())
         return "(Expired)";
      return "";
   };
   const populateCategoryTable = (couponList?: Coupon[]) => {
      if (couponList?.length == 0) {
         errorAlert.setSingleWarning("0", "No Result Found");
         return;
      }
      errorAlert.clear();

      let tData = new TableData();
      tData.AddHeader("Code", "Code").AddHeader("Type");

      couponList?.map(coupon =>
         tData.AddRow([
            <div>{coupon.code} <small className="text-danger" children={isExpire(coupon.expiryDate)} /></div>,
            CouponTypeList.find(c => c.Value == coupon.type)?.Name,
            <TableRowButtons
               btnClassName="btn-blue edit-icon"
               btnClick={() => { editCoupon(coupon); }}
            />
         ]));
      tbl.setData(tData);
   };
   const editCoupon = (coupon: Coupon) => {
      setSelectedCoupon(coupon);
      setIsOpenCouponModal(true);
   };
   const resetCategoryModal = () => {
      setIsOpenCouponModal(false);
      setSelectedCoupon(new Coupon());
   };

   return (
      <Container className="container-fluid ">
         <PageHeader title="Coupons" className="line-header" />
         <div className="row col-12 py-3 mx-auto bg-white">
            <SearchInput
               value={searchValue}
               onChange={i => setSearchValue(i.target.value)}
               className="col-12 col-md-9 pr-md-4"
               onSearch={() => { onSearch(1); }}
            />

            <Button children={<span className="add-icon" children="Coupon" />}
               className="col-12 col-md-3 btn-green btn mt-2 mt-md-0"
               onClick={() => { setIsOpenCouponModal(true); }}
            />

            <DropDown title={`Coupon Type: ${CouponTypeList.find((c) => c.Id?.toString() == selectedFilterType)?.Name || "All"}`}
               className="col-12 col-sm pm-0 mt-2"
               titleClassName="btn btn-white filter-icon">
               <button className="dropdown-item"
                  onClick={() => { onSearch(1, undefined, GetAllRecords); }} >
                  All
                  </button>
               {CouponTypeList.map(couponType =>
                  <button className="dropdown-item" key={couponType.Id}
                     onClick={() => { onSearch(1, undefined, couponType.Id?.toString()); }} >
                     {couponType.Name}
                  </button>
               )}
            </DropDown>

            <Alert alert={errorAlert.alert}
               className="col-12 mb-2 mt-2"
               onClosed={() => { errorAlert.clear(); }}
            />

            {/***** Category Table  ****/}
            {tbl.totalItemCount > 0 &&
               <div className="row col-12 pm-0 mt-3 pb-2">
                  <Table className="col-12 text-center table-striped"
                     defaultSortName={tbl.sortName}
                     data={tbl.data}
                     onSortChange={(selectedPage, isSortAsce, sortName) => onSearch(selectedPage, undefined, undefined, isSortAsce, sortName)}
                     listCount={tbl.totalItemCount}
                  />
                  <Pagination
                     maxItemsPerPage={tbl.maxItemsPerPage}
                     selectedPage={tbl.selectedPage}
                     onChange={(selectedPage, maxItemsPerPage) => { onSearch(selectedPage, maxItemsPerPage); }}
                     listCount={tbl.totalItemCount}
                  />
               </div>
            }

            {/***** Add/ modify category modal  ****/}
            <CouponModel isOpen={isOpenCouponModal}
               onSuccess={() => { resetCategoryModal(); onSearch(); }}
               coupon={selectedCoupon}
               onClose={resetCategoryModal} />
         </div>
      </Container>
   );
};

declare type IProps = {
};
export default CouponManagement;
