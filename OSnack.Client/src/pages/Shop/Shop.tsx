
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import React, { useEffect, useRef, useState } from 'react';
import Container from '../../components/Container';
import DropDown from 'osnack-frontend-shared/src/components/Buttons/DropDown';
import SearchInput from 'osnack-frontend-shared/src/components/Inputs/SeachInput';
import { Category, Product } from 'osnack-frontend-shared/src/_core/apiModels';
import { GetAllRecords } from 'osnack-frontend-shared/src/_core/constant.Variables';
import { useSearchPublicProduct } from 'osnack-frontend-shared/src/hooks/PublicHooks/useProductHook';
import ShopItem from './ShopItem';
import { useHistory } from 'react-router-dom';
import LoadMore from 'osnack-frontend-shared/src/components/Pagination/LoadMore';
import { useAllPublicCategory } from 'osnack-frontend-shared/src/hooks/PublicHooks/useCategoryHook';
import { useTableData } from 'osnack-frontend-shared/src/components/Table/Table';

const Shop = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const tbl = useTableData("Name", true);
   const [searchValue, setSearchValue] = useState("");
   const [categoryList, setCategoryList] = useState<Category[]>([]);
   const [productList, setProductList] = useState<Product[]>([]);
   const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(GetAllRecords);
   const sortOptions = ["Name", "Price"];

   const history = useHistory();

   useEffect(() => {
      errorAlert.pleaseWait(isUnmounted);
      useAllPublicCategory().then(result => {
         if (isUnmounted.current) return;
         setCategoryList(result.data);
         const uriPathNameArr = window.location.pathname.split('/').filter(val => val.length > 0);
         if (uriPathNameArr.length === 3 && uriPathNameArr[1] == "Category") {
            const uriSelectedCategory = result.data.filter(val => val.name?.toLowerCase().trim() == decodeURIComponent(uriPathNameArr[2]).toLowerCase());
            if (uriSelectedCategory.length > 0)
               onSearch(undefined, undefined, undefined, undefined, undefined, uriSelectedCategory[0].id?.toString());
         } else {
            onSearch();
         }
      }
      ).catch(errors => {
         if (isUnmounted.current) return;
         errorAlert.set(errors);
      });
      return () => { isUnmounted.current = true; };
   }, []);

   const onSearch = async (
      searchVal = searchValue,
      isSortAsc = tbl.isSortAsc,
      sortName = tbl.sortName,
      selectedPage = tbl.selectedPage,
      maxItemsPerPage = tbl.maxItemsPerPage,
      categoryFilter = selectedCategoryFilter
   ) => {
      let searchString = GetAllRecords;
      setSearchValue(searchVal);
      if (searchVal != searchValue) {
         selectedPage = 1;
      }
      if (searchVal != "")
         searchString = searchVal;

      if (isSortAsc != tbl.isSortAsc) {
         tbl.setIsSortAsc(isSortAsc);
         selectedPage = 1;
      }

      if (sortName != tbl.sortName) {
         tbl.setSortName(sortName);
         selectedPage = 1;
      }

      if (selectedPage != tbl.selectedPage)
         tbl.setSelectedPage(selectedPage);

      if (maxItemsPerPage != tbl.maxItemsPerPage) {
         tbl.setMaxItemsPerPage(maxItemsPerPage);
         selectedPage = 1;
      }

      if (categoryFilter != selectedCategoryFilter) {
         setSelectedCategoryFilter(categoryFilter);
         selectedPage = 1;
      }
      errorAlert.pleaseWait(isUnmounted, 1000);
      useSearchPublicProduct(selectedPage, maxItemsPerPage, categoryFilter, searchString, isSortAsc, sortName)
         .then(result => {
            if (isUnmounted.current) return;

            tbl.setTotalItemCount(result.data.totalCount || 0);
            let list: Product[] = productList;
            if (selectedPage == 1)
               list = [] as Product[];
            if (result.data.productList != undefined)
               list.push(...result.data.productList);
            setProductList(list);
            if (result.data.totalCount === 0)
               errorAlert.setSingleDefault("", "No Result Found");
            else
               errorAlert.clear();
         }
         ).catch(errors => {
            if (isUnmounted.current) return;
            errorAlert.set(errors);
         });
   };

   const handelSort = async (sortName: string) => {
      let isSortAsc = tbl.isSortAsc;
      if (tbl.sortName === sortName)
         isSortAsc = !isSortAsc;

      onSearch(searchValue, isSortAsc, sortName);

   };
   const getSortedColCss = (sortName: string) => {
      return tbl.sortName === sortName ?
         !tbl.isSortAsc ? "sort-numeric-down-icon" : "sort-numeric-up-icon"
         : "sortable-icon-light";
   };

   return (
      <Container className="wide-container pm-0">
         <PageHeader title="Shop" className="hr-section-sm" />
         <Container className="bg-white pb-5">
            <div className="row p-3 ">
               <SearchInput
                  value={searchValue}
                  onChange={i => setSearchValue(i.target.value || "")}
                  className="col-12 col-sm-4 col-md-6 pt-2"
                  onSearch={() => { onSearch(undefined, tbl.isSortAsc, tbl.sortName); }}
               />
               <DropDown title={`Category: ${categoryList.find((c) => c.id?.toString() == selectedCategoryFilter)?.name || "All"}`}
                  className="col-12 col-sm-4 col-md-3 ml-auto pm-0 pt-2"
                  titleClassName="btn btn btn-white filter-icon"
               >
                  <button className="dropdown-item"
                     onClick={() => {
                        history.push("/Shop");
                        onSearch(undefined, undefined, undefined, undefined, undefined, GetAllRecords);
                     }} >
                     All
                        </button>
                  {categoryList.map(category =>
                     <button className="dropdown-item" key={category.id}
                        onClick={() => {
                           history.push(`/Shop/Category/${encodeURIComponent(category.name || "")}`);
                           onSearch(undefined, undefined, undefined, undefined, undefined, category.id?.toString());
                        }}>
                        {category.name}
                     </button>
                  )}
               </DropDown>
               <DropDown title={`Sort By: ${tbl.sortName}`}
                  className="col-12 col-sm-4 col-md-3 ml-auto pm-0 pt-2"
                  titleClassName={`btn btn btn-white ${!tbl.isSortAsc ? "sort-numeric-down-icon" : "sort-numeric-up-icon"}`}>
                  {sortOptions.map(val =>
                     <button className={`dropdown-item ${getSortedColCss(val)}`} onClick={() => { handelSort(val); }}>
                        {val}
                     </button>
                  )}
               </DropDown>
               <p className="col-12 pm-0 small-text text-gray" >Total Items Found: {tbl.totalItemCount}</p>
               <Alert alert={errorAlert.alert}
                  className="col-12 mb-2"
                  onClosed={() => { errorAlert.clear(); }}
               />
            </div>
            <div className="row  p-3 justify-content-center">
               {productList.map((product) => <ShopItem className="col-12 col-sm-6 col-md-4 p-0 pb-2" product={product} />)}
            </div>
            <LoadMore auto
               maxItemsPerPage={tbl.maxItemsPerPage}
               selectedPage={tbl.selectedPage}
               onChange={(selectedPage, maxItemsPerPage) => { onSearch(undefined, tbl.isSortAsc, tbl.sortName, selectedPage, maxItemsPerPage); }}
               listCount={tbl.totalItemCount} />
         </Container>
      </Container >
   );
};

declare type IProps = {};
export default Shop;
