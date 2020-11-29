
import Alert, { AlertObj, Error } from 'osnack-frontend-shared/src/components/Texts/Alert';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Container from '../../components/Container';
import { ShopContext } from '../../_core/shopContext';
import DropDown from 'osnack-frontend-shared/src/components/Buttons/DropDown';
import SearchInput from 'osnack-frontend-shared/src/components/Inputs/SeachInput';
import { Category, Product } from 'osnack-frontend-shared/src/_core/apiModels';
import { ConstMaxNumberOfPerItemsPage, GetAllRecords } from 'osnack-frontend-shared/src/_core/constant.Variables';
import { sleep } from 'osnack-frontend-shared/src/_core/appFunc';
import { useSearchProduct } from 'osnack-frontend-shared/src/hooks/apiCallers/product/Get.Product';
import { useGetAllCategory } from 'osnack-frontend-shared/src/hooks/apiCallers/category/Get.Category';
import ShopItem from './ShopItem';

const Shop = (props: IProps) => {
   const isUnmounted = useRef(false);
   const [alert, setAlert] = useState(new AlertObj());
   const [searchValue, setSearchValue] = useState("");
   const [categoryList, setCategoryList] = useState<Category[]>([]);
   const [productList, setProductList] = useState<Product[]>([]);
   const [tblSortName, setTblsortName] = useState("Name");
   const [tblIsSortAsc, setTblIsSortAsc] = useState(true);
   const [tblTotalItemCount, setTblTotalItemCount] = useState(0);
   const [tblSelectedPage, setTblSelectedPage] = useState(1);
   const [tblMaxItemsPerPage, setTblMaxItemsPerPage] = useState(ConstMaxNumberOfPerItemsPage);
   const { shopState, setShopState } = useContext(ShopContext);
   const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(GetAllRecords);
   const sortOptions = ["Name", "Price"];

   useEffect(() => {
      sleep(500, isUnmounted).then(() => { setAlert(alert.PleaseWait); });
      useGetAllCategory().then(result => {
         if (isUnmounted.current) return;
         if (result.alert.List.length > 0) {
            result.alert.List.push(new Error("0", "Category list cannot be loaded"));
            alert.List = result.alert.List;
            alert.Type = result.alert.Type;
            setAlert(alert);
         } else {
            setCategoryList(result.categoryList);
            const uriPathNameArr = window.location.pathname.split('/').filter(val => val.length > 0);
            if (uriPathNameArr.length === 3 && uriPathNameArr[1] == "Category") {
               const uriSelectedCategory = result.categoryList.filter(val => val.name?.toLowerCase() == decodeURIComponent(uriPathNameArr[2]).toLowerCase());
               if (uriSelectedCategory.length > 0)
                  onSearch(undefined, undefined, undefined, undefined, uriSelectedCategory[0].id.toString());
            } else {
               onSearch();
            }
         }
      });
      return () => { isUnmounted.current = true; };
   }, []);

   const onSearch = async (
      isSortAsc = tblIsSortAsc,
      sortName = tblSortName,
      selectedPage = tblSelectedPage,
      maxItemsPerPage = tblMaxItemsPerPage,
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

      if (categoryFilter != selectedCategoryFilter) {
         setSelectedCategoryFilter(categoryFilter);
      }

      sleep(500, isUnmounted).then(() => { setAlert(alert.PleaseWait); });
      useSearchProduct(selectedPage, maxItemsPerPage, categoryFilter, searchString, "true", isSortAsc, sortName).then(result => {
         if (isUnmounted.current) return;
         if (result.alert.List.length > 0) {
            alert.List = result.alert.List;
            alert.Type = result.alert.Type;
            setAlert(alert);
         }
         else {
            setTblTotalItemCount(result.totalCount);
            setProductList(result.productList);
            if (result.totalCount === 0)
               setAlert(alert.addSingleWarning("No Result Found"));
            else
               setAlert(alert.Clear);
         }
      });
   };

   const handelSort = async (sortName: string) => {
      let isSortAsc = tblIsSortAsc;
      if (tblSortName === sortName)
         isSortAsc = !isSortAsc;

      onSearch(isSortAsc, sortName);

   };
   const getSortedColCss = (sortName: string) => {
      return tblSortName === sortName ?
         !tblIsSortAsc ? "sort-numeric-down-icon" : "sort-numeric-up-icon"
         : "sortable-icon-light";
   };

   return (
      <Container className="wide-container p-0 m-0">
         <PageHeader title="Shop" className="hr-section-sm" />
         <div className="col-12 bg-white ">
            <div className="row p-3 ">
               <SearchInput key="searchInput"
                  value={searchValue}
                  onChange={i => setSearchValue(i.target.value)}
                  className="col-12 col-sm-4 col-md-6 pt-2"
                  onSearch={() => { onSearch(tblIsSortAsc, tblSortName); }}
               />
               <DropDown title={`Category: ${categoryList.find((c) => c.id.toString() == selectedCategoryFilter)?.name || "All"}`}
                  className="col-12 col-sm-4 col-md-3 ml-auto m-0 p-0 pt-2"
                  titleClassName="btn btn btn-white filter-icon">
                  <button className="dropdown-item"
                     onClick={() => { onSearch(undefined, undefined, undefined, undefined, GetAllRecords); }} >
                     All
                  </button>
                  {categoryList.map(category =>
                     <button className="dropdown-item" key={category.id}
                        onClick={() => { onSearch(undefined, undefined, undefined, undefined, category.id.toString()); }}>
                        {category.name}
                     </button>
                  )}
               </DropDown>
               <DropDown title={`Sort By: ${tblSortName}`}
                  className="col-12 col-sm-4 col-md-3 ml-auto m-0 p-0 pt-2"
                  titleClassName={`btn btn btn-white ${!tblIsSortAsc ? "sort-numeric-down-icon" : "sort-numeric-up-icon"}`}>
                  {sortOptions.map(val =>
                     <button className={`dropdown-item ${getSortedColCss(val)}`} onClick={() => { handelSort(val); }}>
                        {val}
                     </button>
                  )}
               </DropDown>
               <Alert alert={alert}
                  className="col-12 mb-2"
                  onClosed={() => { setAlert(alert.Clear); }}
               />
            </div>
            <div className="row p-3 justify-content-center">
               {productList.map((product) => <ShopItem product={product} />)}
            </div>
         </div>
      </Container >
   );
};

declare type IProps = {
};
export default Shop;
