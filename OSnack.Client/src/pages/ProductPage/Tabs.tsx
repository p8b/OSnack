import { Product, Comment } from 'osnack-frontend-shared/src/_core/apiModels';
import React, { useEffect, useRef, useState } from 'react';
import { useGetComment } from 'osnack-frontend-shared/src/hooks/PublicHooks/useCommentHook';
import { StarRating } from 'osnack-frontend-shared/src/components/Inputs/StarRating';
import { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import { ReviewModal } from './ReviewModal';
import { ConstMaxNumberOfPerItemsPage } from 'osnack-frontend-shared/src/_core/constant.Variables';
import LoadMore from 'osnack-frontend-shared/src/components/Pagination/LoadMore';


const Tabs = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [selectedNav, setSelectedNav] = useState(productTabs.NutritionalInfo);
   const [showNutritionalInfo, setShowNutritionalInfo] = useState(false);
   const [commentList, setCommentList] = useState<Comment[]>([]);
   const [comment, setComment] = useState<Comment | undefined>(new Comment());
   const [isOpenReviewModal, setIsOpenReviewModal] = useState(false);

   const [tblTotalItemCount, setTblTotalItemCount] = useState(0);
   const [tblSelectedPage, setTblSelectedPage] = useState(1);
   const [tblMaxItemsPerPage, setTblMaxItemsPerPage] = useState(ConstMaxNumberOfPerItemsPage);

   useEffect(() => () => { isUnmounted.current = true; }, []);

   useEffect(() => {
      // if no nutritional information is avilable
      if (props.product.nutritionalInfo != null
         && ((props.product.nutritionalInfo.energyKcal != null && props.product.nutritionalInfo.energyKJ != null)
            || (props.product.nutritionalInfo.fat != null && props.product.nutritionalInfo.saturateFat != null)
            || (props.product.nutritionalInfo.carbohydrate != null && props.product.nutritionalInfo.carbohydrateSugar != null)
            || props.product.nutritionalInfo.fibre != null
            || props.product.nutritionalInfo.protein != null
            || props.product.nutritionalInfo.salt != null
         )) {
         setSelectedNav(productTabs.NutritionalInfo);
         setShowNutritionalInfo(true);
      }
      else {
         setSelectedNav(productTabs.Comments);
         setShowNutritionalInfo(false);
      }
      reloadComments(undefined, undefined);
   }, [props.product.id]);




   const reloadComments = (selectedPage = tblSelectedPage,
      maxItemsPerPage = tblMaxItemsPerPage) => {

      if (selectedPage != tblSelectedPage)
         setTblSelectedPage(selectedPage);

      if (maxItemsPerPage != tblMaxItemsPerPage) {
         setTblMaxItemsPerPage(maxItemsPerPage);
         selectedPage = 1;
      }

      errorAlert.PleaseWait(500, isUnmounted);
      useGetComment(props.product.id!, selectedPage, maxItemsPerPage).then(result => {
         if (isUnmounted.current) return;
         setComment(result.data.comment);
         setTblTotalItemCount(result.data.totalCount!);

         let list: Comment[] = commentList;
         if (selectedPage == 1)
            list = [] as Product[];
         if (result.data.commentList != undefined)
            list.push(...result.data.commentList);
         setCommentList(list);

      }).catch(errors => { if (isUnmounted.current) return; errorAlert.set(errors); });
   };

   return (
      <>
         <ul className="nav nav-tabs">
            {showNutritionalInfo &&
               <li className="nav-item">
                  <a onClick={() => { setSelectedNav(productTabs.NutritionalInfo); }}
                     className={`nav-link ${selectedNav === productTabs.NutritionalInfo ? "active" : ""} `}>
                     Nutritional Information
               </a>
               </li>
            }
            <li className="nav-item">
               <a onClick={() => { setSelectedNav(productTabs.Comments); }}
                  className={`nav-link ${selectedNav === productTabs.Comments ? "active" : ""} `}>
                  Comments ({commentList?.length || 0})
               </a>
            </li>
         </ul>
         <div className="col-12">
            {showNutritionalInfo && selectedNav === productTabs.NutritionalInfo &&
               <>
                  <p>Per 100g</p>
                  {props.product.nutritionalInfo?.energyKcal != null && props.product.nutritionalInfo?.energyKJ != null &&
                     <div>Energy: {props.product.nutritionalInfo?.energyKJ}KJ / {props.product.nutritionalInfo?.energyKcal}Kcal</div>
                  }
                  {props.product.nutritionalInfo?.fat != null && props.product.nutritionalInfo?.saturateFat != null &&
                     <>
                        <div>Fat: {props.product.nutritionalInfo?.fat}g</div>
                        <div className="pl-5">of which saturates, {props.product.nutritionalInfo?.saturateFat}g</div>
                     </>
                  }
                  {props.product.nutritionalInfo?.carbohydrate != null && props.product.nutritionalInfo?.carbohydrateSugar != null &&
                     <>
                        <div>Carbohydrate: {props.product.nutritionalInfo?.carbohydrate}g</div>
                        <div className="pl-5">of which Sugar, {props.product.nutritionalInfo?.carbohydrateSugar}g</div>
                     </>
                  }
                  {props.product.nutritionalInfo?.fibre != null &&
                     <div>Fiber: {props.product.nutritionalInfo?.fibre}g</div>
                  }
                  {props.product.nutritionalInfo?.protein != null &&
                     <div>Protein: {props.product.nutritionalInfo?.protein}g</div>
                  }
                  {props.product.nutritionalInfo?.salt != null &&
                     <div>Salt: {props.product.nutritionalInfo?.salt}g</div>
                  }
               </>
            }
            {selectedNav === productTabs.Comments &&
               <>
                  {comment &&
                     <Button className="btn-white" children={comment.id == 0 ? "Write a review" : "Edit a review"} onClick={() => setIsOpenReviewModal(true)} />
                  }
                  {commentList.map(comment =>
                     <div key={comment.id} className="comment">
                        <div className="row">
                           <div className="col-6 small-text text-gray">{comment.name}</div>
                           <div className="col-6">
                              <StarRating className="float-right" rate={comment.rate} readonly />
                           </div>
                        </div>
                        <div className="col-12">{comment.description}</div>
                        {comment.reply && comment.reply != "" &&
                           <div className="reply">
                              <div className="col-12 row small-text text-gray" children="Customer Support" />
                              <div className="col-12">{comment.reply}</div>
                           </div>
                        }
                     </div>
                  )
                  }
                  <LoadMore maxItemsPerPage={tblMaxItemsPerPage}
                     selectedPage={tblSelectedPage}
                     onChange={(selectedPage, maxItemsPerPage) => { reloadComments(selectedPage, maxItemsPerPage); }}
                     listCount={tblTotalItemCount} />
               </>
            }
         </div>

         <ReviewModal isOpen={isOpenReviewModal}
            onClose={() => { setIsOpenReviewModal(false); props.refreshProduct(); reloadComments(); }}
            comment={comment!}
         />
      </>
   );
};

declare type IProps = {
   product: Product;
   refreshProduct: () => void;
};
export default Tabs;

enum productTabs {
   NutritionalInfo,
   Comments
}
