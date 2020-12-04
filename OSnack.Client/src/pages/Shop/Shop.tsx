
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Container from '../../components/Container';
import { ShopContext } from '../../_core/shopContext';
import DropDown from 'osnack-frontend-shared/src/components/Buttons/DropDown';
import SearchInput from 'osnack-frontend-shared/src/components/Inputs/SeachInput';
import { Category, Product } from 'osnack-frontend-shared/src/_core/apiModels';
import { ConstMaxNumberOfPerItemsPage, GetAllRecords } from 'osnack-frontend-shared/src/_core/constant.Variables';
import { useSearchPublicProduct } from 'osnack-frontend-shared/src/hooks/PublicHooks/useProductHook';
import { useAllCategory } from 'osnack-frontend-shared/src/hooks/PublicHooks/useCategoryHook';
import ShopItem from './ShopItem';
import { useHistory } from 'react-router-dom';

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
   const { shopState, setShopState } = useContext(ShopContext);
   const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(GetAllRecords);
   const sortOptions = ["Name", "Price"];

   const history = useHistory();

   useEffect(() => {
      errorAlert.PleaseWait(500, isUnmounted);
      useAllCategory().then(categories => {
         if (isUnmounted.current) return;
         setCategoryList(categories);
         const uriPathNameArr = window.location.pathname.split('/').filter(val => val.length > 0);
         if (uriPathNameArr.length === 3 && uriPathNameArr[1] == "Category") {
            console.log(decodeURIComponent(uriPathNameArr[2]).toLowerCase());
            const uriSelectedCategory = categories.filter(val => val.name?.toLowerCase().trim() == decodeURIComponent(uriPathNameArr[2]).toLowerCase());
            if (uriSelectedCategory.length > 0)
               onSearch(undefined, undefined, undefined, undefined, uriSelectedCategory[0].id?.toString());
         } else {
            onSearch();
         }
      }
      ).catch(alert => {
         if (isUnmounted.current) return;
         errorAlert.set(alert);
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

      errorAlert.PleaseWait(500, isUnmounted);
      useSearchPublicProduct(selectedPage, maxItemsPerPage, categoryFilter, searchString, isSortAsc, sortName).then(result => {
         if (isUnmounted.current) return;

         setTblTotalItemCount(result.part2 || 0);
         setProductList(result.part1!);
         if (result.part2 === 0)
            errorAlert.setSingleWarning("", "No Result Found");
         else
            errorAlert.clear();
      }
      ).catch(alert => {
         if (isUnmounted.current) return;
         errorAlert.set(alert);
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
               <DropDown title={`Category: ${categoryList.find((c) => c.id?.toString() == selectedCategoryFilter)?.name || "All"}`}
                  className="col-12 col-sm-4 col-md-3 ml-auto m-0 p-0 pt-2"
                  titleClassName="btn btn btn-white filter-icon"
                  closeOnClickInsideMenu
               >
                  <button className="dropdown-item"
                     onClick={() => {
                        history.push("/Shop");
                        onSearch(undefined, undefined, undefined, undefined, GetAllRecords);
                     }} >
                     All
                        </button>
                  {categoryList.map(category =>
                     <button className="dropdown-item" key={category.id}
                        onClick={() => {
                           history.push(`/Shop/Category/${encodeURIComponent(category.name || "")}`);
                           onSearch(undefined, undefined, undefined, undefined, category.id?.toString());
                        }}>
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
               <Alert alert={errorAlert.alert}
                  className="col-12 mb-2"
                  onClosed={() => { errorAlert.clear(); }}
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
