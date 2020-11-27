import React, { useEffect, useRef, useState } from 'react';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import Alert, { AlertObj, AlertTypes, Error } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import Table, { TableData, TableHeaderData, TableRowData } from 'osnack-frontend-shared/src/components/Table/Table';
import { Category, Product } from 'osnack-frontend-shared/src/_core/apiModels';
import ProductModal from './ProductModal';
import Container from '../../components/Container';
import SearchInput from 'osnack-frontend-shared/src/components/Inputs/SeachInput';
import { ConstMaxNumberOfPerItemsPage, GetAllRecords, ProductUnitType } from 'osnack-frontend-shared/src/_core/constant.Variables';
import Pagination from 'osnack-frontend-shared/src/components/Pagination/Pagination';
import { useGetAllCategory } from '../../hooks/apiCallers/category/Get.Category';
import { useSearchProduct } from '../../hooks/apiCallers/product/Get.Product';
import { enumToArray, sleep } from 'osnack-frontend-shared/src/_core/appFunc';
import DropDown from 'osnack-frontend-shared/src/components/Buttons/DropDown';

const ProductManagement = (props: IProps) => {
   const isUnmounted = useRef(false);
   const [alert, setAlert] = useState(new AlertObj());
   const [searchValue, setSearchValue] = useState("");
   const [selectedProduct, setSelectedProduct] = useState(new Product());
   const [categoryList, setCategoryList] = useState<Category[]>([]);
   const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(GetAllRecords);
   const [selectedStatusFilter, setSelectedStatusFilter] = useState(GetAllRecords);
   const [isOpenProductModal, setIsOpenProductModal] = useState(false);
   const [productUnitTypeList] = useState(enumToArray(ProductUnitType));

   const [tableData, setTableData] = useState(new TableData());
   const [tblSortName, setTblsortName] = useState("Name");
   const [tblIsSortAsc, setTblIsSortAsc] = useState(true);
   const [tblTotalItemCount, setTblTotalItemCount] = useState(0);
   const [tblSelectedPage, setTblSelectedPage] = useState(1);
   const [tblMaxItemsPerPage, setTblMaxItemsPerPage] = useState(ConstMaxNumberOfPerItemsPage);

   useEffect(() => {
      useGetAllCategory().then(result => {
         if (isUnmounted.current) return;

         if (result.alert.List.length > 0) {
            result.alert.List.push(new Error("0", "Category list cannot be loaded"));
            alert.List = result.alert.List;
            alert.Type = result.alert.Type;
            setAlert(alert);
         } else {
            setCategoryList(result.categoryList);
         }
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


      sleep(500, isUnmounted).then(() => { setAlert(alert.PleaseWait); });
      useSearchProduct(selectedPage, maxItemsPerPage, categoryFilter, searchString, statusFilter, isSortAsc, sortName).then(result => {
         if (isUnmounted.current) return;

         if (result.alert.List.length > 0) {
            alert.List = result.alert.List;
            alert.Type = result.alert.Type;
            setAlert(alert);
         }
         else {
            setTblTotalItemCount(result.totalCount);
            populateProductTable(result.productList);
            setAlert(alert.Clear);
         }
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

      productList.map(product =>
         tData.rows.push(new TableRowData([
            product.name,
            product.category.name,
            `£${product.price}`,
            `${product.unitQuantity} ${productUnitTypeList.find(ut => ut.id == product.unitType)?.name}`,
            product.status ? "Active" : "Disabled",
            <div className="col-auto p-0 m-0">
               <button className="btn btn-sm btn-blue col-12 m-0 mt-1 mt-xl-0 edit-icon"
                  onClick={() => { editProduct(product); }}
                  children="Edit" />
            </div>
         ])));
      if (productList.length == 0) {
         setAlert(new AlertObj([new Error("0", "No Result Found")], AlertTypes.Warning));
      } else {
         setAlert(alert.Clear);
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
            <div className="row col-12 m-0 p-0">

               <SearchInput key="searchInput"
                  value={searchValue}
                  onChange={i => setSearchValue(i.target.value)}
                  className="col-12 col-md-9 "
                  onSearch={() => { onSearch(tblIsSortAsc, tblSortName); }}
               />

               <Button children={<span className="add-icon" children="Product" />}
                  className="col-12 col-md-3 mt-1 mt-md-0 btn-green btn-lg"
                  onClick={() => { setIsOpenProductModal(true); }}
               />
            </div>
            <div className="row col-12 p-0 m-0 pt-3 ">

               <DropDown title={`Category: ${categoryList.find((c) => c.id.toString() == selectedCategoryFilter)?.name || "All"}`}
                  className="col-12 col-sm-6 col-md-4 ml-auto m-0 p-1"
                  titleClassName="btn btn-white filter-icon">
                  <div className="dropdown-item"
                     onClick={() => { onSearch(undefined, undefined, undefined, undefined, undefined, GetAllRecords); }} >
                     All
                  </div>
                  {categoryList.map(category =>
                     <div className="dropdown-item" key={category.id}
                        onClick={() => { onSearch(undefined, undefined, undefined, undefined, undefined, category.id.toString()); }} >
                        {category.name}
                     </div>
                  )}
               </DropDown>
               <DropDown title={`Status: ${getStatusDisplayValue()}`}
                  className="col-12 col-sm-6 col-md-4 m-0 p-1"
                  titleClassName="btn btn-white  filter-icon">
                  <div className="dropdown-item"
                     onClick={() => { onSearch(undefined, undefined, undefined, undefined, GetAllRecords); }} >
                     All
                  </div>
                  <div className="dropdown-item"
                     onClick={() => { onSearch(undefined, undefined, undefined, undefined, "True"); }} >
                     Active
                  </div>
                  <div className="dropdown-item"
                     onClick={() => { onSearch(undefined, undefined, undefined, undefined, "False"); }} >
                     Disabled
                  </div>
               </DropDown>

               <Alert alert={alert}
                  className="col-12 mb-2"
                  onClosed={() => { setAlert(alert.Clear); }}
               />
            </div>

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
