import React, { useEffect, useState } from "react";

const Pagination = (props: IProps) => {
   const [arrayOfPageNumbers, setArrayOfPageNumbers] = useState<number[]>([]);
   const [totalPages, setTotalPages] = useState(1);

   const onMaxItemPerPageChange = async (MaxItemsPerPage: number) => {
      props.onChange(props.selectedPage, MaxItemsPerPage);
   };

   const onPageAddOrMinus = (AddPage: number) => {
      let pendingSelectedPage = props.selectedPage + AddPage;
      if ((pendingSelectedPage > 0 && pendingSelectedPage <= totalPages)) {
         props.onChange(pendingSelectedPage, props.maxItemsPerPage);
      }
   };

   const onButtonClick = (pageNum: number) => {
      props.onChange(pageNum, props.maxItemsPerPage);
   };

   const CalculateVisibleButtons = async () => {
      let firstPage = 1, lastPage = 1, maxButtonsToBeShown = 4, halfMaxButtonsToBeShown = Math.floor(maxButtonsToBeShown / 2);

      let selectedPage = props.selectedPage; /// currently selected page
      let TOTALpages = 0; /// Total Number of Pages
      let ARRAYofPages = []; /// Array of page numbers to be shown

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

      /// if the current page is less than half of the
      /// max number of buttons to be shown.
      /// (The beginning of the pagination is shown)
      if (selectedPage < halfMaxButtonsToBeShown) {
         /// set the First page to the current page
         firstPage = 1;
         if (TOTALpages < maxButtonsToBeShown)
            lastPage = TOTALpages;
         else
            /// set the Last page the max number of buttons to be shown
            lastPage = maxButtonsToBeShown;

      }

      /// current page is more than the total number of pages
      /// minus half of the Max number of pages to be shown
      /// (The end of the pagination is shown)
      else if (selectedPage > TOTALpages - halfMaxButtonsToBeShown) {
         /// the fist page would be the result of the
         /// selected page minus the product of Max number of buttons
         /// minus the result of total pages - selected page
         firstPage = selectedPage
            - (maxButtonsToBeShown - (TOTALpages - selectedPage));

         /// and the last page would the value of total pages
         /// which is the last possible position
         lastPage = TOTALpages;

      } else {
         firstPage = selectedPage - halfMaxButtonsToBeShown;
         lastPage = selectedPage + halfMaxButtonsToBeShown;
      }

      if ((lastPage - firstPage) >= maxButtonsToBeShown)
         firstPage++;

      if (firstPage <= 0)
         firstPage = 1;

      while (firstPage <= lastPage) {
         ARRAYofPages.push(firstPage);
         firstPage++;
      }

      if (lastPage < maxButtonsToBeShown && (lastPage + 1) <= TOTALpages)
         ARRAYofPages.push(lastPage + 1);

      setTotalPages(TOTALpages);
      setArrayOfPageNumbers(ARRAYofPages);
   };

   useEffect(() => {
      CalculateVisibleButtons();
   }, [props.listCount]);

   useEffect(() => {
      CalculateVisibleButtons();
   }, [props.selectedPage]);

   useEffect(() => {
      CalculateVisibleButtons();
   }, [props.maxItemsPerPage]);

   const btnClassName = "col-auto btn  boarder-radius-none outline-none ";

   return (
      <>
         { arrayOfPageNumbers.length == 0 && <></>}
         { arrayOfPageNumbers.length > 0 &&
            <div className="row col-12 p-0 m-0">
               <button
                  type="button"
                  className={btnClassName}
                  children={<i className="pagination-left-arrow m-0 p-0" />}
                  onClick={() => { onPageAddOrMinus(-1); }}
               />
               {arrayOfPageNumbers.map(i => {
                  let isActiveCss = "";
                  if (i === props.selectedPage)
                     isActiveCss = " active";

                  return (
                     <button key={i}
                        type="button"
                        className={btnClassName + isActiveCss}
                        children={i}
                        onClick={() => onButtonClick(i)}
                     />);
               }
               )}
               <button
                  type="button"
                  className={btnClassName}
                  children={<i className="pagination-right-arrow m-0 p-0" />}
                  onClick={() => onPageAddOrMinus(1)}
               />
               <select className="w-auto form-control outline-none" defaultValue={props.maxItemsPerPage}
                  onChange={(i) => { onMaxItemPerPageChange(i.target.value as unknown as number); }}
               >
                  <option value="1" children="1" />
                  <option value="5" children="5" />
                  <option value="10" children="10" />
                  <option value="20" children="20" />
                  <option value="30" children="30" />
                  <option value="40" children="40" />
                  <option value="50" children="50" />
                  <option value="60" children="60" />
                  <option value="70" children="70" />
                  <option value="80" children="80" />
                  <option value="90" children="90" />
                  <option value="100" children="100" />
               </select>
               <div className="col-auto align-self-center mr-auto mr-md-0 ml-0 ml-md-auto" children={`Total items: ${props.listCount}`} />
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
}
export default Pagination;
