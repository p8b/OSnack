import React, { useEffect, useRef, useState } from 'react';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import Table, { TableData, TableHeaderData, TableRowData } from 'osnack-frontend-shared/src/components/Table/Table';
import { Category, Product, ProductUnitTypeList } from 'osnack-frontend-shared/src/_core/apiModels';
import ProductModal from './ProductModal';
import Container from '../../components/Container';
import SearchInput from 'osnack-frontend-shared/src/components/Inputs/SeachInput';
import { ConstMaxNumberOfPerItemsPage, GetAllRecords } from 'osnack-frontend-shared/src/_core/constant.Variables';
import Pagination from 'osnack-frontend-shared/src/components/Pagination/Pagination';
import { useSearchSecretProduct } from '../../SecretHooks/useProductHook';
import DropDown from 'osnack-frontend-shared/src/components/Buttons/DropDown';
import { useAllSecretCategory } from '../../SecretHooks/useCategoryHook';

const ProductManagement = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [searchValue, setSearchValue] = useState("");
   const [selectedProduct, setSelectedProduct] = useState(new Product());
   const [categoryList, setCategoryList] = useState<Category[]>([]);
   const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(GetAllRecords);
   const [selectedStatusFilter, setSelectedStatusFilter] = useState(GetAllRecords);
   const [isOpenProductModal, setIsOpenProductModal] = useState(false);
   const [productUnitTypeList] = useState(ProductUnitTypeList);

   const [tableData, setTableData] = useState(new TableData());
   const [tblSortName, setTblsortName] = useState("Name");
   const [tblIsSortAsc, setTblIsSortAsc] = useState(true);
   const [tblTotalItemCount, setTblTotalItemCount] = useState(0);
   const [tblSelectedPage, setTblSelectedPage] = useState(1);
   const [tblMaxItemsPerPage, setTblMaxItemsPerPage] = useState(ConstMaxNumberOfPerItemsPage);

   useEffect(() => {
      useAllSecretCategory().then(result => {
         if (isUnmounted.current) return;
         setCategoryList(result.data);
      }).catch(alert => {
         if (isUnmounted.current) return;
         errorAlert.set(alert);
      });
      onSearch();
      return () => { isUnmounted.current = true; };
   }, []);

   const onSearch = async (
      isSortAsc = tblIsSortAsc,
      sortName = tblSortName,
      selectedPage = tblSelectedPage,
      maxItemsPerPage = tblMaxItemsPerPage,
      statusFilter = selectedStatusFilter,
      categoryFilter = selectedCategoryFilter
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

      if (categoryFilter != selectedCategoryFilter)
         setSelectedCategoryFilter(categoryFilter);

      if (statusFilter != selectedStatusFilter)
         setSelectedStatusFilter(statusFilter);


      errorAlert.PleaseWait(500, isUnmounted);
      useSearchSecretProduct(selectedPage, maxItemsPerPage, categoryFilter, searchString, statusFilter, isSortAsc, sortName)
         .then(result => {
            if (isUnmounted.current) return;
            setTblTotalItemCount(result.data.totalNumber || 0);
            populateProductTable(result.data.productList!);
            errorAlert.clear();
         }).catch(alert => {
            if (isUnmounted.current) return;
            errorAlert.set(alert);
         });
   };

   const populateProductTable = (productList: Product[]) => {
      let tData = new TableData();
      tData.headers.push(new TableHeaderData("Name", "Name", true));
      tData.headers.push(new TableHeaderData("Category", "Category.Name", true));
      tData.headers.push(new TableHeaderData("Price", "Price", true));
      tData.headers.push(new TableHeaderData("Unit Quantity", "UnitQuantity", false));
      tData.headers.push(new TableHeaderData("Status", "Status", true));
      tData.headers.push(new TableHeaderData("", "", false));

      productList.map(product => {
         tData.rows.push(new TableRowData([
            product.name,
            product.category.name,
            `£${product.price}`,
            `${product.unitQuantity} ${productUnitTypeList.find(pu => pu.Value == product.unitType)?.Name}`,
            product.status ? "Active" : "Disabled",
            <div className="col-auto pm-0">
               <button className="btn btn-sm btn-blue col-12 m-0  edit-icon"
                  onClick={() => { editProduct(product); }}
                  children="Edit" />
            </div>
         ]));
      });
      if (productList.length == 0) {
         errorAlert.setSingleWarning("0", "No Result Found");
      } else {
         errorAlert.clear();
      }
      setTableData(tData);
   };
   const editProduct = (product: Product) => {
      setSelectedProduct(product);
      setIsOpenProductModal(true);
   };
   const resetProductModal = () => {
      setIsOpenProductModal(false);
      setSelectedProduct(new Product());
   };
   const getStatusDisplayValue = () => {
      switch (selectedStatusFilter) {
         case "True":
            return "Active";
         case "False":
            return "Disabled";
      }
      return "All";
   };

   return (
      <Container className="container-fluid pr-0">
         <PageHeader title="Products" className="line-header-lg" />
         <div className="row col-12 col-md-11 pt-2 pb-2 bg-white ml-auto mr-auto">
            {/***** Search Input and new product button  ****/}
            <div className="row col-12 pm-0">

               <SearchInput key="searchInput"
                  value={searchValue}
                  onChange={i => setSearchValue(i.target.value)}
                  className="col-12 col-md-9 "
                  onSearch={() => { onSearch(tblIsSortAsc, tblSortName); }}
               />

               <Button children={<span className="add-icon" children="Product" />}
                  className="col-12 col-md-3 mt-1 mt-md-0 btn-green btn"
                  onClick={() => { setIsOpenProductModal(true); }}
               />
            </div>
            <div className="row col-12 pm-0 pt-3 ">

               <DropDown title={`Category: ${categoryList.find((c) => c.id?.toString() == selectedCategoryFilter)?.name || "All"}`}
                  className="col-12 col-sm-6 col-md-4 ml-auto m-0 p-1"
                  titleClassName="btn btn-white filter-icon">
                  <button className="dropdown-item"
                     onClick={() => { onSearch(undefined, undefined, undefined, undefined, undefined, GetAllRecords); }} >
                     All
                  </button>
                  {categoryList.map(category =>
                     <button className="dropdown-item" key={category.id}
                        onClick={() => { onSearch(undefined, undefined, undefined, undefined, undefined, category.id?.toString()); }} >
                        {category.name}
                     </button>
                  )}
               </DropDown>
               <DropDown title={`Status: ${getStatusDisplayValue()}`}
                  className="col-12 col-sm-6 col-md-4 m-0 p-1"
                  titleClassName="btn btn-white  filter-icon">
                  <button className="dropdown-item"
                     onClick={() => { onSearch(undefined, undefined, undefined, undefined, GetAllRecords); }} >
                     All
                  </button>
                  <button className="dropdown-item"
                     onClick={() => { onSearch(undefined, undefined, undefined, undefined, "True"); }} >
                     Active
                  </button>
                  <button className="dropdown-item"
                     onClick={() => { onSearch(undefined, undefined, undefined, undefined, "False"); }} >
                     Disabled
                  </button>
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
            <ProductModal isOpen={isOpenProductModal} categoryList={categoryList}
               onSuccess={() => { resetProductModal(); onSearch(tblIsSortAsc, tblSortName); }}
               product={selectedProduct}
               onClose={resetProductModal} />
         </div>
      </Container>
   );
};

declare type IProps = {
};
export default ProductManagement;
