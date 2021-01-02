import React, { useEffect, useRef, useState } from 'react';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import Table, { TableData } from 'osnack-frontend-shared/src/components/Table/Table';
import { Category } from 'osnack-frontend-shared/src/_core/apiModels';
import CategoryModal from './CategoryModal';
import Container from '../../components/Container';
import SearchInput from 'osnack-frontend-shared/src/components/Inputs/SeachInput';
import { useSearchCategory } from '../../SecretHooks/useCategoryHook';
import { ConstMaxNumberOfPerItemsPage, GetAllRecords } from 'osnack-frontend-shared/src/_core/constant.Variables';
import Pagination from 'osnack-frontend-shared/src/components/Pagination/Pagination';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import TableRowButtons from 'osnack-frontend-shared/src/components/Table/TableRowButtons';
import { useHistory } from 'react-router-dom';
import { checkUri, generateUri } from 'osnack-frontend-shared/src/_core/appFunc';

const CategoryManagement = (props: IProps) => {
   const isUnmounted = useRef(false);
   const history = useHistory();
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
      useSearchCategory(selectedPage, maxItemsPerPage, searchString, isSortAsc, sortName).then(
         result => {
            if (isUnmounted.current) return;
            errorAlert.clear();
            setTblTotalItemCount(result.data.totalCount || 0);
            populateCategoryTable(result.data.categoryList);
         }).catch((alert) => {
            if (isUnmounted.current) return;
            errorAlert.set(alert);
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
         <PageHeader title="Categories" className="line-header" />
         <Container className="row col-12 col-md-11 pt-2 pb-2 bg-white ml-auto mr-auto">
            {/***** Search Input and new category button  ****/}
            <SearchInput key="searchInput"
               value={searchValue}
               onChange={i => setSearchValue(i.target.value)}
               className="col-12 col-md-9 pr-md-4"
               onSearch={() => { onSearch(1); }}
            />

            <Button children={<span className="add-icon" children="Category" />}
               className="col-12 col-md-3 btn-green btn"
               onClick={() => { setIsOpenCategoryModal(true); }}
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
            <CategoryModal isOpen={isOpenCategoryModal}
               onSuccess={() => { resetCategoryModal(); onSearch(); }}
               category={selectedCategory}
               onClose={resetCategoryModal} />
         </Container>
      </Container>
   );
};

declare type IProps = {
};
export default CategoryManagement;
