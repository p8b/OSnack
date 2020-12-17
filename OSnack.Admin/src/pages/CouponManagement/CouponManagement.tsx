import React, { useEffect, useRef, useState } from 'react';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import Table, { TableData, TableHeaderData, TableRowData } from 'osnack-frontend-shared/src/components/Table/Table';
import { Coupon, CouponTypeList } from 'osnack-frontend-shared/src/_core/apiModels';
import CouponModel from './CouponModel';
import Container from '../../components/Container';
import SearchInput from 'osnack-frontend-shared/src/components/Inputs/SeachInput';
import { useSearchCoupon } from '../../SecretHooks/useCouponHook';
import { ConstMaxNumberOfPerItemsPage, GetAllRecords } from 'osnack-frontend-shared/src/_core/constant.Variables';
import Pagination from 'osnack-frontend-shared/src/components/Pagination/Pagination';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import DropDown from 'osnack-frontend-shared/src/components/Buttons/DropDown';

const CouponManagement = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [searchValue, setSearchValue] = useState("");
   const [selectedFilterType, setSelectedfilterType] = useState(GetAllRecords);
   const [selectedCoupon, setSelectedCoupon] = useState(new Coupon());
   const [isOpenCouponModal, setIsOpenCouponModal] = useState(false);

   const [tableData, setTableData] = useState(new TableData());
   const [tblSortName, setTblsortName] = useState("Name");
   const [tblIsSortAsc, setTblIsSortAsc] = useState(true);
   const [tblTotalItemCount, setTblTotalItemCount] = useState(0);
   const [tblSelectedPage, setTblSelectedPage] = useState(1);
   const [tblMaxItemsPerPage, setTblMaxItemsPerPage] = useState(ConstMaxNumberOfPerItemsPage);

   useEffect(() => {
      onSearch();
      return () => { isUnmounted.current = true; };
   }, []);

   const onSearch = (
      isSortAsc = tblIsSortAsc,
      sortName = tblSortName,
      selectedPage = tblSelectedPage,
      maxItemsPerPage = tblMaxItemsPerPage,
      filterType = selectedFilterType,
   ) => {
      let searchString = GetAllRecords;

      if (searchValue != null && searchValue != "")
         searchString = searchValue;

      if (isSortAsc != tblIsSortAsc)
         setTblIsSortAsc(isSortAsc);

      if (sortName != tblSortName)
         setTblsortName(sortName);

      if (selectedPage != tblSelectedPage)
         setTblSelectedPage(selectedPage);
      if (filterType != selectedFilterType)
         setSelectedfilterType(filterType);

      if (maxItemsPerPage != tblMaxItemsPerPage)
         setTblMaxItemsPerPage(maxItemsPerPage);

      errorAlert.PleaseWait(500, isUnmounted);
      useSearchCoupon(selectedPage, maxItemsPerPage, searchString, filterType, isSortAsc, sortName).then(
         result => {
            if (isUnmounted.current) return;
            errorAlert.clear();
            setTblTotalItemCount(result.data.totalNumber || 0);
            populateCategoryTable(result.data.couponList!);
         }).catch((alert) => {
            if (isUnmounted.current) return;
            errorAlert.set(alert);
         });
   };

   const isExpire = (date: Date) => {
      const dt = new Date(date);
      if (dt < new Date())
         return "(Expired)";
      return "";
   };

   const populateCategoryTable = (couponList?: Coupon[]) => {
      let tData = new TableData();
      tData.headers.push(new TableHeaderData("Code", "Code", true));
      tData.headers.push(new TableHeaderData("Type"));
      tData.headers.push(new TableHeaderData("", "", false));

      couponList?.map(coupon =>
         tData.rows.push(new TableRowData([
            <div>{coupon.code} <small className="text-danger" children={isExpire(coupon.expiryDate)} /></div>,
            CouponTypeList.find(c => c.Value == coupon.type)?.Name,
            <div className="col-auto pm-0">
               <button className="btn btn-sm btn-blue col-12 m-0 mt-1 mt-xl-0 edit-icon"
                  onClick={() => { editCoupon(coupon); }}
                  children="Edit" />
            </div>
         ])));
      if (couponList?.length == 0) {
         errorAlert.setSingleWarning("0", "No Result Found");
      } else {
         errorAlert.clear();
      }
      setTableData(tData);
   };

   const editCoupon = (coupon: Coupon) => {
      console.log(coupon);
      setSelectedCoupon(coupon);
      setIsOpenCouponModal(true);
   };
   const resetCategoryModal = () => {
      setIsOpenCouponModal(false);
      setSelectedCoupon(new Coupon());
   };

   return (
      <Container className="container-fluid ">
         <PageHeader title="Coupons" className="line-header-lg" />
         <Container className="row col-12 col-md-11 pt-2 pb-2 bg-white ml-auto mr-auto">
            {/***** Search Input and new category button  ****/}
            <SearchInput key="searchInput"
               value={searchValue}
               onChange={i => setSearchValue(i.target.value)}
               className="col-12 col-md-9"
               onSearch={() => { onSearch(tblIsSortAsc, tblSortName); }}
            />

            <Button children={<span className="add-icon" children="Coupon" />}
               className="col-12 col-md-3 btn-green btn"
               onClick={() => { setIsOpenCouponModal(true); }}
            />
            <div className="row col-12 pm-0 pt-3 ">

               <DropDown title={`Coupon Type: ${CouponTypeList.find((c) => c.Id?.toString() == selectedFilterType)?.Name || "All"}`}
                  className="col-12 col-sm-6 col-md-4 ml-auto m-0 p-1"
                  titleClassName="btn btn-white filter-icon">
                  <button className="dropdown-item"
                     onClick={() => { onSearch(undefined, undefined, undefined, undefined, GetAllRecords); }} >
                     All
                  </button>
                  {CouponTypeList.map(couponType =>
                     <button className="dropdown-item" key={couponType.Id}
                        onClick={() => { onSearch(undefined, undefined, undefined, undefined, couponType.Id?.toString()); }} >
                        {couponType.Name}
                     </button>
                  )}
               </DropDown>


               <Alert alert={errorAlert.alert}
                  className="col-12 mb-2"
                  onClosed={() => { errorAlert.clear(); }}
               />
            </div>

            {/***** Category Table  ****/}
            <div className="row col-12 pm-0">
               <Table className="col-12 text-center table-striped mt-4"
                  defaultSortName={tblSortName}
                  data={tableData}
                  onSortClick={onSearch}
               />
               <Pagination
                  maxItemsPerPage={tblMaxItemsPerPage}
                  selectedPage={tblSelectedPage}
                  onChange={(selectedPage, maxItemsPerPage) => { onSearch(tblIsSortAsc, tblSortName, selectedPage, maxItemsPerPage); }}
                  listCount={tblTotalItemCount} />
            </div>

            {/***** Add/ modify category modal  ****/}
            <CouponModel isOpen={isOpenCouponModal}
               onSuccess={() => { resetCategoryModal(); onSearch(tblIsSortAsc, tblSortName); }}
               coupon={selectedCoupon}
               onClose={resetCategoryModal} />
         </Container>
      </Container>
   );
};

declare type IProps = {
};
export default CouponManagement;
