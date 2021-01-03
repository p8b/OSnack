import React, { useEffect, useRef, useState } from 'react';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import Table, { TableData, TableView } from 'osnack-frontend-shared/src/components/Table/Table';
import { Category, Product, ProductUnitTypeList } from 'osnack-frontend-shared/src/_core/apiModels';
import ProductModal from './ProductModal';
import Container from '../../components/Container';
import SearchInput from 'osnack-frontend-shared/src/components/Inputs/SeachInput';
import { ConstMaxNumberOfPerItemsPage, GetAllRecords } from 'osnack-frontend-shared/src/_core/constant.Variables';
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
   const [searchValue, setSearchValue] = useState("");
   const [selectedProduct, setSelectedProduct] = useState(new Product());
   const [categoryList, setCategoryList] = useState<Category[]>([]);
   const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(GetAllRecords);
   const [selectedStatusFilter, setSelectedStatusFilter] = useState(GetAllRecords);
   const [isOpenProductModal, setIsOpenProductModal] = useState(false);
   const [isOpenCommentModal, setIsOpenCommentModal] = useState(false);
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
      onSearch(...checkUri(window.location.pathname,
         [tblSelectedPage, tblMaxItemsPerPage, selectedStatusFilter, selectedCategoryFilter, tblIsSortAsc, tblSortName, GetAllRecords]));
      return () => { isUnmounted.current = true; };
   }, []);

   const onSearch = async (
      selectedPage = tblSelectedPage,
      maxItemsPerPage = tblMaxItemsPerPage,
      statusFilter = selectedStatusFilter,
      categoryFilter = selectedCategoryFilter,
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

      if (Number(categoryFilter) == -1)
         categoryFilter = GetAllRecords;
      if (categoryFilter != selectedCategoryFilter)
         setSelectedCategoryFilter(categoryFilter);

      if (Number(statusFilter) == -1)
         statusFilter = GetAllRecords;
      if (statusFilter != selectedStatusFilter)
         setSelectedStatusFilter(statusFilter);

      history.push(generateUri(window.location.pathname,
         [selectedPage || tblSelectedPage,
            maxItemsPerPage, statusFilter == GetAllRecords ? -1 : statusFilter,
         categoryFilter == GetAllRecords ? -1 : categoryFilter,
         Number(isSortAsc),
            sortName,
         searchString != GetAllRecords ? searchString : ""]));

      errorAlert.PleaseWait(500, isUnmounted);
      useSearchSecretProduct(selectedPage, maxItemsPerPage, categoryFilter, searchString, statusFilter, isSortAsc, sortName)
         .then(result => {
            if (isUnmounted.current) return;
            console.log(result.data);
            setTblTotalItemCount(result.data.totalCount || 0);
            errorAlert.clear();
            populateProductTable(result.data.productList!);
         }).catch(alert => {
            if (isUnmounted.current) return;
            errorAlert.set(alert);
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
         .AddHeader("Unit Quantity", "UnitQuantity")
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
                     btnClassName={`col-12 col-lg-6 btn-white ${product.commentReview ? "comment-review-icon" : "comment-icon"} small-text`}
                     btnClick={() => { setSelectedProduct(product); setIsOpenCommentModal(true); }}
                  />
               }
            </>
         ]));

      setTableData(tData);
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
      <Container className="container-fluid pr-0">
         <PageHeader title="Products" className="line-header" />
         <div className="row col-12 col-md-11 pt-2 pb-2 bg-white ml-auto mr-auto">
            {/***** Search Input and new product button  ****/}
            <div className="row col-12 pm-0">

               <SearchInput key="searchInput"
                  value={searchValue}
                  onChange={i => setSearchValue(i.target.value)}
                  className="col-12 col-md-9 pr-md-4"
                  onSearch={() => { onSearch(1); }}
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
                     onClick={() => { onSearch(1, undefined, undefined, GetAllRecords); }} >
                     All
                  </button>
                  {categoryList.map(category =>
                     <button className="dropdown-item" key={category.id}
                        onClick={() => { onSearch(1, undefined, undefined, category.id?.toString()); }} >
                        {category.name}
                     </button>
                  )}
               </DropDown>
               <DropDown title={`Status: ${getStatusDisplayValue()}`}
                  className="col-12 col-sm-6 col-md-4 m-0 p-1"
                  titleClassName="btn btn-white  filter-icon">
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
            </div>

            {/***** Category Table  ****/}
            {tblTotalItemCount > 0 &&
               <div className="row col-12 pm-0">
                  <Table className="col-12 text-center table-striped"
                     defaultSortName={tblSortName}
                     data={tableData}
                     onSortChange={(isSortAsce, sortName) => onSearch(undefined, undefined, undefined, undefined, isSortAsce, sortName)}
                     view={TableView.CardView}
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
