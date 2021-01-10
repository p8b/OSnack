import React, { useEffect, useRef, useState } from 'react';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import Table, { TableData, useTableData } from 'osnack-frontend-shared/src/components/Table/Table';
import { Category } from 'osnack-frontend-shared/src/_core/apiModels';
import CategoryModal from './CategoryModal';
import Container from '../../components/Container';
import SearchInput from 'osnack-frontend-shared/src/components/Inputs/SeachInput';
import { useSearchCategory } from '../../SecretHooks/useCategoryHook';
import { GetAllRecords } from 'osnack-frontend-shared/src/_core/constant.Variables';
import Pagination from 'osnack-frontend-shared/src/components/Pagination/Pagination';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import TableRowButtons from 'osnack-frontend-shared/src/components/Table/TableRowButtons';
import { useHistory } from 'react-router-dom';
import { checkUri, generateUri } from 'osnack-frontend-shared/src/_core/appFunc';

const CategoryManagement = (props: IProps) => {
   const isUnmounted = useRef(false);
   const history = useHistory();
   const errorAlert = useAlert(new AlertObj());
   const tbl = useTableData("Name", true);
   const [searchValue, setSearchValue] = useState("");
   const [selectedCategory, setSelectedCategory] = useState(new Category());
   const [isOpenCategoryModal, setIsOpenCategoryModal] = useState(false);

   useEffect(() => {
      onSearch(...checkUri(window.location.pathname,
         [tbl.selectedPage, tbl.maxItemsPerPage, tbl.isSortAsc, tbl.sortName, GetAllRecords]));
      return () => { isUnmounted.current = true; };
   }, []);

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
      history.push(generateUri(window.location.pathname,
         [selectedPage, maxItemsPerPage, Number(isSortAsc), sortName, searchString != GetAllRecords ? searchString : ""]));

      errorAlert.pleaseWait(isUnmounted);
      useSearchCategory(selectedPage, maxItemsPerPage, searchString, isSortAsc, sortName).then(
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
               btnClick={() => { editCategory(category); }}
            />
         ]));

      tbl.setData(tData);
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
         <PageHeader title="Categories" className="line-header" />
         <div className="row col-12 py-3 mx-auto bg-white">
            <SearchInput
               value={searchValue}
               onChange={i => setSearchValue(i.target.value)}
               className="col-12 col-md-9 pr-md-4"
               onSearch={() => { onSearch(1); }}
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
               <div className="row col-12 pm-0 mt-3 pb-2">
                  <Table className="col-12 text-center table-striped"
                     defaultSortName={tbl.sortName}
                     data={tbl.data}
                     onSortChange={(selectedPage, isSortAsce, sortName) => onSearch(selectedPage, undefined, isSortAsce, sortName)}
                     listCount={tbl.totalItemCount}
                  />
                  <Pagination
                     maxItemsPerPage={tbl.maxItemsPerPage}
                     selectedPage={tbl.selectedPage}
                     listCount={tbl.totalItemCount}
                     onChange={(selectedPage, maxItemsPerPage) => { onSearch(selectedPage, maxItemsPerPage); }}
                  />

               </div>
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
