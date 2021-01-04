
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import React, { useEffect, useRef, useState } from 'react';
import Container from '../../components/Container';
import DropDown from 'osnack-frontend-shared/src/components/Buttons/DropDown';
import SearchInput from 'osnack-frontend-shared/src/components/Inputs/SeachInput';
import { Category, Product } from 'osnack-frontend-shared/src/_core/apiModels';
import { ConstMaxNumberOfPerItemsPage, GetAllRecords } from 'osnack-frontend-shared/src/_core/constant.Variables';
import { useSearchPublicProduct } from 'osnack-frontend-shared/src/hooks/PublicHooks/useProductHook';
import ShopItem from './ShopItem';
import { useHistory } from 'react-router-dom';
import LoadMore from 'osnack-frontend-shared/src/components/Pagination/LoadMore';
import { useAllPublicCategory } from 'osnack-frontend-shared/src/hooks/PublicHooks/useCategoryHook';

const Shop = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [searchValue, setSearchValue] = useState("");
   const [categoryList, setCategoryList] = useState<Category[]>([]);
   const [productList, setProductList] = useState<Product[]>([]);
   const [tblSortName, setTblsortName] = useState("Name");
   const [tblIsSortAsc, setTblIsSortAsc] = useState(true);
   const [tblTotalItemCount, setTblTotalItemCount] = useState(0);
   const [tblSelectedPage, setTblSelectedPage] = useState(1);
   const [tblMaxItemsPerPage, setTblMaxItemsPerPage] = useState(ConstMaxNumberOfPerItemsPage);
   const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(GetAllRecords);
   const sortOptions = ["Name", "Price"];

   const history = useHistory();

   useEffect(() => {
      errorAlert.PleaseWait(500, isUnmounted);
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
      isSortAsc = tblIsSortAsc,
      sortName = tblSortName,
      selectedPage = tblSelectedPage,
      maxItemsPerPage = tblMaxItemsPerPage,
      categoryFilter = selectedCategoryFilter
   ) => {
      let searchString = GetAllRecords;
      setSearchValue(searchVal);
      if (searchVal != searchValue) {
         selectedPage = 1;
      }
      if (searchVal != "")
         searchString = searchVal;

      if (isSortAsc != tblIsSortAsc) {
         setTblIsSortAsc(isSortAsc);
         selectedPage = 1;
      }

      if (sortName != tblSortName) {
         setTblsortName(sortName);
         selectedPage = 1;
      }

      if (selectedPage != tblSelectedPage)
         setTblSelectedPage(selectedPage);

      if (maxItemsPerPage != tblMaxItemsPerPage) {
         setTblMaxItemsPerPage(maxItemsPerPage);
         selectedPage = 1;
      }

      if (categoryFilter != selectedCategoryFilter) {
         setSelectedCategoryFilter(categoryFilter);
         selectedPage = 1;
      }
      errorAlert.PleaseWait(1000, isUnmounted);
      useSearchPublicProduct(selectedPage, maxItemsPerPage, categoryFilter, searchString, isSortAsc, sortName)
         .then(result => {
            if (isUnmounted.current) return;

            setTblTotalItemCount(result.data.totalCount || 0);
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
      let isSortAsc = tblIsSortAsc;
      if (tblSortName === sortName)
         isSortAsc = !isSortAsc;

      onSearch(searchValue, isSortAsc, sortName);

   };
   const getSortedColCss = (sortName: string) => {
      return tblSortName === sortName ?
         !tblIsSortAsc ? "sort-numeric-down-icon" : "sort-numeric-up-icon"
         : "sortable-icon-light";
   };

   return (
      <Container className="wide-container pm-0">
         <PageHeader title="Shop" className="hr-section-sm" />
         <Container className="bg-white pb-5">
            <div className="row p-3 ">
               <SearchInput key="searchInput"
                  value={searchValue}
                  onChange={i => setSearchValue(i.target.value || "")}
                  className="col-12 col-sm-4 col-md-6 pt-2"
                  onSearch={() => { onSearch(undefined, tblIsSortAsc, tblSortName); }}
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
               <DropDown title={`Sort By: ${tblSortName}`}
                  className="col-12 col-sm-4 col-md-3 ml-auto pm-0 pt-2"
                  titleClassName={`btn btn btn-white ${!tblIsSortAsc ? "sort-numeric-down-icon" : "sort-numeric-up-icon"}`}>
                  {sortOptions.map(val =>
                     <button className={`dropdown-item ${getSortedColCss(val)}`} onClick={() => { handelSort(val); }}>
                        {val}
                     </button>
                  )}
               </DropDown>
               <p className="col-12 pm-0 small-text text-gray" >Total Items Found: {tblTotalItemCount}</p>
               <Alert alert={errorAlert.alert}
                  className="col-12 mb-2"
                  onClosed={() => { errorAlert.clear(); }}
               />
            </div>
            <div className="row p-3 justify-content-center">
               {productList.map((product) => <ShopItem className="col-12 col-sm-6 col-md-4 p-0 pb-2" product={product} />)}
               <div className="col-12 col-sm-6 col-md-4 mr-auto" />
            </div>
            <LoadMore
               maxItemsPerPage={tblMaxItemsPerPage}
               selectedPage={tblSelectedPage}
               onChange={(selectedPage, maxItemsPerPage) => { onSearch(undefined, tblIsSortAsc, tblSortName, selectedPage, maxItemsPerPage); }}
               listCount={tblTotalItemCount} />
         </Container>
      </Container >
   );
};

declare type IProps = {};
export default Shop;
