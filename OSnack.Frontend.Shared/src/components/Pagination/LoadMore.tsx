import React, { useEffect, useState } from "react";

const LoadMore = (props: IProps) => {
   const [totalPages, setTotalPages] = useState(1);
   const [isLoadingMoreInView, setIsLoadingMoreInView] = useState(false);
   const [btnLoadMore] = useState(React.createRef<HTMLButtonElement>());

   useEffect(() => {
      if (props.auto)
         window.addEventListener("scroll", onScrollChange);
      return () => {
         window.removeEventListener("scroll", onScrollChange);
      };
   }, []);
   useEffect(() => {
      CalculateVisibleButtons();
   }, [props.listCount]);
   useEffect(() => {
      CalculateVisibleButtons();
   }, [props.maxItemsPerPage]);

   const onPageAdd = () => {
      let pendingSelectedPage = props.selectedPage + 1;
      if ((pendingSelectedPage <= totalPages)) {
         props.onChange(pendingSelectedPage, props.maxItemsPerPage);
      }
   };
   const CalculateVisibleButtons = async () => {

      let selectedPage = props.selectedPage; /// currently selected page
      let TOTALpages = 0; /// Total Number of Pages

      if (props.listCount == 0)
         return;

      const remainder = Math.floor(props.listCount % props.maxItemsPerPage);
      /// if the remainder is 0
      if (remainder === 0)
         /// the total page is the result of item list count divided
         /// by max items per page value
         TOTALpages = Math.floor(props.listCount / props.maxItemsPerPage);
      /// else if the remainder is more than 0
      else if (remainder > 0)
         /// The total page is the result of item list count divided
         /// by max items per page value, plus one
         TOTALpages = Math.floor(props.listCount / props.maxItemsPerPage) + 1;

      if (props.selectedPage >= TOTALpages) {
         selectedPage = TOTALpages;
         props.onChange(selectedPage, props.maxItemsPerPage);
      }
      setTotalPages(TOTALpages);
   };
   const onScrollChange = () => {
      if (btnLoadMore.current?.getBoundingClientRect().top != undefined && btnLoadMore.current?.getBoundingClientRect().top < window.screen.height)
         setIsLoadingMoreInView(true);
      else
         setIsLoadingMoreInView(false);
   };

   if (isLoadingMoreInView) onPageAdd();
   return (
      <>
         { totalPages <= props.selectedPage && <></>}
         { totalPages > props.selectedPage &&
            <div className="row col-12 p-0 m-0">
               <button ref={btnLoadMore} className="btn col-auto pl-4 pr-4 ml-auto mr-auto" children="Load More" onClick={() => onPageAdd()} />
            </div>
         }
      </>
   );
};
interface IProps {
   selectedPage: number;
   maxItemsPerPage: number;
   onChange: (selectedPage: number, MaxItemsPerPage: number) => void;
   listCount: number;
   auto?: boolean;
}
export default LoadMore;
