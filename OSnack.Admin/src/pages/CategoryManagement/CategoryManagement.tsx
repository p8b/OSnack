import React, { useEffect, useRef, useState } from 'react';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import Table, { TableData, TableHeaderData, TableRowData } from 'osnack-frontend-shared/src/components/Table/Table';
import { Category, MultiResultOfListOfCategoryAndInteger } from 'osnack-frontend-shared/src/_core/apiModels';
import CategoryModal from './CategoryModal';
import Container from '../../components/Container';
import SearchInput from 'osnack-frontend-shared/src/components/Inputs/SeachInput';
import { useSearchCategory } from 'osnack-frontend-shared/src/hooks/PublicHooks/useCategoryHook';
import { ConstMaxNumberOfPerItemsPage, GetAllRecords } from 'osnack-frontend-shared/src/_core/constant.Variables';
import Pagination from 'osnack-frontend-shared/src/components/Pagination/Pagination';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';

const CategoryManagement = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [searchValue, setSearchValue] = useState("");
   const [selectedCategory, setSelectedCategory] = useState(new Category());
   const [isOpenCategoryModal, setIsOpenCategoryModal] = useState(false);

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
      maxItemsPerPage = tblMaxItemsPerPage
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

      if (maxItemsPerPage != tblMaxItemsPerPage)
         setTblMaxItemsPerPage(maxItemsPerPage);

      errorAlert.PleaseWait(500, isUnmounted);
      useSearchCategory(selectedPage, maxItemsPerPage, searchString, isSortAsc, sortName).then(
         (result: MultiResultOfListOfCategoryAndInteger) => {
            if (isUnmounted.current) return;
            errorAlert.Clear();
            setTblTotalItemCount(result.part2 || 0);
            populateCategoryTable(result.part1);
         }).catch((alert) => {
            if (isUnmounted.current) return;
            errorAlert.set(alert);
         });
   };

   const populateCategoryTable = (categoryList?: Category[]) => {
      let tData = new TableData();
      tData.headers.push(new TableHeaderData("Name", "Name", true));
      tData.headers.push(new TableHeaderData("No. Products"));
      tData.headers.push(new TableHeaderData("", "", false));

      categoryList?.map(category =>
         tData.rows.push(new TableRowData([
            category.name,
            category.totalProducts,
            <div className="col-auto p-0 m-0">
               <button className="btn btn-sm btn-blue col-12 m-0 mt-1 mt-xl-0 edit-icon"
                  onClick={() => { editCategory(category); }}
                  children="Edit" />
            </div>
         ])));
      if (categoryList?.length == 0) {
         errorAlert.SetSingleWarning("0", "No Result Found");
      } else {
         errorAlert.Clear();
      }
      setTableData(tData);
   };
   const editCategory = (category: Category) => {
      setSelectedCategory(category);
      setIsOpenCategoryModal(true);
   };
   const resetCategoryModal = () => {
      setIsOpenCategoryModal(false);
      setSelectedCategory(new Category());
   };

   return (
      <Container className="container-fluid ">
         <PageHeader title="Categories" className="line-header-lg" />
         <Container className="row col-12 col-md-11 pt-2 pb-2 bg-white ml-auto mr-auto">
            {/***** Search Input and new category button  ****/}
            <SearchInput key="searchInput"
               value={searchValue}
               onChange={i => setSearchValue(i.target.value)}
               className="col-12 col-md-9"
               onSearch={() => { onSearch(tblIsSortAsc, tblSortName); }}
            />

            <Button children={<span className="add-icon" children="Category" />}
               className="col-12 col-md-3 btn-green btn"
               onClick={() => { setIsOpenCategoryModal(true); }}
            />

            <Alert alert={errorAlert.alert}
               className="col-12 mb-2"
               onClosed={() => { errorAlert.Clear(); }}
            />

            {/***** Category Table  ****/}
            <div className="row col-12 p-0 m-0">
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
            <CategoryModal isOpen={isOpenCategoryModal}
               onSuccess={() => { resetCategoryModal(); onSearch(tblIsSortAsc, tblSortName); }}
               category={selectedCategory}
               onClose={resetCategoryModal} />
         </Container>
      </Container>
   );
};

declare type IProps = {
};
export default CategoryManagement;
