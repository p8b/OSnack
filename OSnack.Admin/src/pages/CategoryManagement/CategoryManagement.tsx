import React, { useEffect, useRef, useState } from 'react';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import Table, { TableData, useTableData } from 'osnack-frontend-shared/src/components/Table/Table';
import { Category } from 'osnack-frontend-shared/src/_core/apiModels';
import CategoryModal from './CategoryModal';
import Container from '../../components/Container';
import SearchInput from 'osnack-frontend-shared/src/components/Inputs/SeachInput';
import { useSearchCategory } from '../../SecretHooks/useCategoryHook';
import { GetAllRecords } from 'osnack-frontend-shared/src/_core/appConst';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import TableRowButtons from 'osnack-frontend-shared/src/components/Table/TableRowButtons';
import { useHistory } from 'react-router-dom';
import { extractUri, generateUri } from 'osnack-frontend-shared/src/_core/appFunc';

const CategoryManagement = (props: IProps) => {
   const isUnmounted = useRef(false);
   const history = useHistory();
   const errorAlert = useAlert(new AlertObj());
   const tbl = useTableData("Name", true);
   const [searchValue, setSearchValue] = useState("");
   const [selectedCategory, setSelectedCategory] = useState(new Category());
   const [isOpenCategoryModal, setIsOpenCategoryModal] = useState(false);

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
      if (searchValue != null && searchValue != "") searchString = searchValue;
      if (searchString != GetAllRecords) setSearchValue(searchString);
      if (isSortAsc != tbl.isSortAsc) tbl.setIsSortAsc(isSortAsc);
      if (sortName != tbl.sortName) tbl.setSortName(sortName);
      if (selectedPage != tbl.selectedPage) tbl.setSelectedPage(selectedPage);
      if (maxItemsPerPage != tbl.maxItemsPerPage) tbl.setMaxItemsPerPage(maxItemsPerPage);

      const newUri = generateUri([
         selectedPage,
         maxItemsPerPage,
         Number(isSortAsc),
         sortName,
         searchString != GetAllRecords ? searchValue : ""]);
      if (window.location.pathname.toLowerCase() != newUri.toLowerCase())
         history.push(newUri);

      errorAlert.pleaseWait(isUnmounted);
      useSearchCategory(selectedPage, maxItemsPerPage, searchValue == "" ? GetAllRecords : searchValue, isSortAsc, sortName).then(
         result => {
            if (isUnmounted.current) return;
            errorAlert.clear();
            tbl.setTotalItemCount(result.data.totalCount || 0);
            populateCategoryTable(result.data.categoryList);
         }).catch((errors) => {
            if (isUnmounted.current) return;
            errorAlert.set(errors);
         });
   };

   const populateCategoryTable = (categoryList?: Category[]) => {
      if (categoryList?.length == 0) {
         errorAlert.setSingleWarning("0", "No Result Found");
         return;
      }
      errorAlert.clear();

      let tData = new TableData();
      tData.AddHeader("Name", "Name")
         .AddHeader("No. Products");

      categoryList?.map(category =>
         tData.AddRow([
            category.name,
            category.totalProducts,
            <TableRowButtons
               btnClassName="btn-blue edit-icon"
               btnClick={() => {
                  setSelectedCategory(category);
                  setIsOpenCategoryModal(true);
               }}
            />
         ]));
      tbl.setData(tData);
   };

   const resetCategoryModal = () => {
      setIsOpenCategoryModal(false);
      setSelectedCategory(new Category());
   };

   return (
      <Container className="container-fluid">
         <PageHeader title="Categories" className="line-header" />
         <div className="row col-12 py-3 mx-auto bg-white">
            <SearchInput
               value={searchValue}
               onChange={i => setSearchValue(i.target.value)}
               className="col-12 col-md-9 pr-md-4"
               onSearch={() => { onSearch(); }}
            />

            <Button children={<span className="add-icon" children="Category" />}
               className="col-12 col-md-3 btn-green btn mt-2 mt-md-0"
               onClick={() => { setIsOpenCategoryModal(true); }}
            />

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
            <CategoryModal isOpen={isOpenCategoryModal}
               onSuccess={() => { resetCategoryModal(); onSearch(); }}
               category={selectedCategory}
               onClose={resetCategoryModal} />
         </div>
      </Container>
   );
};

declare type IProps = {
};
export default CategoryManagement;
