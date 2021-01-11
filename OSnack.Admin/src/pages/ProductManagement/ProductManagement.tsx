import React, { useEffect, useRef, useState } from 'react';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import Table, { TableData, TableView, useTableData } from 'osnack-frontend-shared/src/components/Table/Table';
import { Category, Product, ProductUnitTypeList } from 'osnack-frontend-shared/src/_core/apiModels';
import ProductModal from './ProductModal';
import Container from '../../components/Container';
import SearchInput from 'osnack-frontend-shared/src/components/Inputs/SeachInput';
import { GetAllRecords } from 'osnack-frontend-shared/src/_core/constant.Variables';
import Pagination from 'osnack-frontend-shared/src/components/Pagination/Pagination';
import { useSearchSecretProduct } from '../../SecretHooks/useProductHook';
import DropDown from 'osnack-frontend-shared/src/components/Buttons/DropDown';
import { useAllSecretCategory } from '../../SecretHooks/useCategoryHook';
import TableRowButtons from 'osnack-frontend-shared/src/components/Table/TableRowButtons';
import { checkUri, generateUri } from 'osnack-frontend-shared/src/_core/appFunc';
import { useHistory } from 'react-router-dom';
import CommentModal from './CommentModal';

const ProductManagement = (props: IProps) => {
   const isUnmounted = useRef(false);
   const history = useHistory();
   const errorAlert = useAlert(new AlertObj());
   const tbl = useTableData("Name", true);

   const [searchValue, setSearchValue] = useState("");
   const [categoryList, setCategoryList] = useState<Category[]>([]);
   const [productUnitTypeList] = useState(ProductUnitTypeList);

   const [isOpenProductModal, setIsOpenProductModal] = useState(false);
   const [isOpenCommentModal, setIsOpenCommentModal] = useState(false);

   const [selectedProduct, setSelectedProduct] = useState(new Product());
   const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(GetAllRecords);
   const [selectedStatusFilter, setSelectedStatusFilter] = useState(GetAllRecords);

   useEffect(() => {
      useAllSecretCategory().then(result => {
         if (isUnmounted.current) return;
         setCategoryList(result.data);
      }).catch(errors => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
      });
      onSearch(...checkUri(window.location.pathname,
         [tbl.selectedPage, tbl.maxItemsPerPage, selectedStatusFilter, selectedCategoryFilter, tbl.isSortAsc, tbl.sortName, GetAllRecords]));
      return () => { isUnmounted.current = true; };
   }, []);

   const onSearch = async (
      selectedPage = tbl.selectedPage,
      maxItemsPerPage = tbl.maxItemsPerPage,
      statusFilter = selectedStatusFilter,
      categoryFilter = selectedCategoryFilter,
      isSortAsc = tbl.isSortAsc,
      sortName = tbl.sortName,
      searchString = GetAllRecords
   ) => {
      if (searchValue != null && searchValue != "") searchString = searchValue;
      if (searchString != GetAllRecords) setSearchValue(searchString);
      if (isSortAsc != tbl.isSortAsc) tbl.setIsSortAsc(isSortAsc);
      if (sortName != tbl.sortName) tbl.setSortName(sortName);
      if (maxItemsPerPage != tbl.maxItemsPerPage) tbl.setMaxItemsPerPage(maxItemsPerPage);
      if (Number(categoryFilter) == -1) categoryFilter = GetAllRecords;
      if (Number(statusFilter) == -1) statusFilter = GetAllRecords;
      if (statusFilter != selectedStatusFilter) setSelectedStatusFilter(statusFilter);
      if (categoryFilter != selectedCategoryFilter) setSelectedCategoryFilter(categoryFilter);
      if (selectedPage != tbl.selectedPage) tbl.setSelectedPage(selectedPage);

      history.push(generateUri(window.location.pathname,
         [selectedPage || tbl.selectedPage,
            maxItemsPerPage,
         statusFilter == GetAllRecords ? -1 : statusFilter,
         categoryFilter == GetAllRecords ? -1 : categoryFilter,
         Number(isSortAsc),
            sortName,
         searchString != GetAllRecords ? searchString : ""]));

      errorAlert.pleaseWait(isUnmounted);
      useSearchSecretProduct(selectedPage, maxItemsPerPage, categoryFilter, searchString, statusFilter, isSortAsc, sortName)
         .then(result => {
            if (isUnmounted.current) return;
            tbl.setTotalItemCount(result.data.totalCount || 0);
            errorAlert.clear();
            populateProductTable(result.data.productList!);
         }).catch(errors => {
            if (isUnmounted.current) return;
            errorAlert.set(errors);
         });
   };
   const populateProductTable = (productList: Product[]) => {
      if (productList.length == 0) {
         errorAlert.setSingleWarning("0", "No Result Found");
         return;
      }
      errorAlert.clear();

      let tData = new TableData();
      tData.AddHeader("Name", "Name")
         .AddHeader("Category", "Category.Name")
         .AddHeader("Price", "Price")
         .AddHeader("Unit Quantity")
         .AddHeader("Status", "Status");

      productList.map(product =>
         tData.AddRow([
            product.name,
            product.category.name,
            `£${product.price}`,
            `${product.unitQuantity} ${productUnitTypeList.find(pu => pu.Value == product.unitType)?.Name}`,
            product.status ? "Active" : "Disabled",
            <>
               {!product.hasComment &&
                  <TableRowButtons
                     btnClassName="btn-blue edit-icon"
                     btnClick={() => editProduct(product)} />
               }
               {product.hasComment &&
                  <TableRowButtons
                     btn1ClassName="col-12 col-lg-6 btn-blue edit-icon"
                     btn1Click={() => {
                        editProduct(product);
                     }}
                     btnClassName="col-12 col-lg-6 btn-white comment-icon small-text"
                     btnClick={() => { setSelectedProduct(product); setIsOpenCommentModal(true); }}
                  />
               }
            </>
         ]));

      tbl.setData(tData);
   };
   const editProduct = (product: Product) => {
      setSelectedProduct(product);
      setIsOpenProductModal(true);
   };
   const resetProductModal = () => {
      setIsOpenProductModal(false);
      setIsOpenCommentModal(false);

      setSelectedProduct(new Product());

      onSearch();
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
      <Container className="container-fluid">
         <PageHeader title="Products" className="line-header" />
         <div className="row col-12 py-3 mx-auto bg-white">
            <SearchInput
               value={searchValue}
               onChange={i => setSearchValue(i.target.value)}
               className="col-12 col-md-9 pr-md-4"
               onSearch={() => { onSearch(1); }}
            />

            <Button children={<span className="add-icon" children="Product" />}
               className="col-12 col-md-3 btn-green btn mt-2 mt-md-0"
               onClick={() => { setIsOpenProductModal(true); }}
            />

            <DropDown title={`Category: ${categoryList.find((c) => c.id?.toString() == selectedCategoryFilter)?.name ?? "All"}`}
               className="col-12 col-sm pm-0 mt-2"
               titleClassName="btn btn-white filter-icon mr-sm-1">
               <button className="dropdown-item"
                  onClick={() => { onSearch(1, undefined, undefined, GetAllRecords); }} >All</button>
               {categoryList.map(category =>
                  <button className="dropdown-item" key={category.id}
                     onClick={() => { onSearch(1, undefined, undefined, category.id?.toString()); }} >
                     {category.name}
                  </button>
               )}
            </DropDown>
            <DropDown title={`Status: ${getStatusDisplayValue()}`}
               className="col-12 col-sm pm-0 mt-2"
               titleClassName="btn btn-white filter-icon ml-sm-1">
               <button className="dropdown-item"
                  onClick={() => { onSearch(1, undefined, GetAllRecords); }} >
                  All
                  </button>
               <button className="dropdown-item"
                  onClick={() => { onSearch(1, undefined, "True"); }} >
                  Active
                  </button>
               <button className="dropdown-item"
                  onClick={() => { onSearch(1, undefined, "False"); }} >
                  Disabled
                  </button>
            </DropDown>

            <Alert alert={errorAlert.alert}
               className="col-12 mb-2"
               onClosed={() => { errorAlert.clear(); }}
            />

            {tbl.totalItemCount > 0 &&
               <div className="row col-12 pm-0">
                  <Table className="col-12 text-center table-striped"
                     defaultSortName={tbl.sortName}
                     data={tbl.data}
                     onSortChange={(selectedPage, isSortAsce, sortName) => onSearch(selectedPage, undefined, undefined, undefined, isSortAsce, sortName)}
                     view={TableView.CardView}
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
            <ProductModal isOpen={isOpenProductModal} categoryList={categoryList}
               onSuccess={() => { resetProductModal(); onSearch(); }}
               product={selectedProduct}
               onClose={resetProductModal} />
            <CommentModal isOpen={isOpenCommentModal} productId={selectedProduct.id!}
               onClose={resetProductModal} />
         </div>
      </Container>
   );
};

declare type IProps = {
};
export default ProductManagement;
