
import { Product, Comment } from 'osnack-frontend-shared/src/_core/apiModels';
import React, { useEffect, useState } from 'react';
import Container from '../../components/Container';
import { useGetComment } from 'osnack-frontend-shared/src/hooks/PublicHooks/useCommentHook';
import { usePostComment } from 'osnack-frontend-shared/src/hooks/OfficialHooks/useCommentHook';
import { AddComment } from '../../components/AddComment';
import { StarRating } from 'osnack-frontend-shared/src/components/Inputs/StarRating';


const Tabs = (props: IProps) => {
   const [selectedNav, setSelectedNav] = useState(productTabs.NutritionalInfo);
   const [showNutritionalInfo, setShowNutritionalInfo] = useState(false);
   const [allowAddComment, setAllowAddComment] = useState(false);
   const [commentList, setCommentList] = useState<Comment[]>([]);

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

   }, [props.product]);

   useEffect(() => {
      useGetComment(props.product.id!).then(result => {
         setCommentList(result.data.commentList!);
         setAllowAddComment(result.data.allowComment || false);
      });
   }, [props.product]);

   const sentComment = (description: string, rate: number) => {
      usePostComment({
         description: description,
         rate: rate,
         product: props.product,
         name: ""
      }).then(result => {

      });
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
            <Container className="container-fluid p-3 pt-5 pb-5">
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
                     {allowAddComment &&
                        <AddComment onSend={sentComment} />
                     }
                     {commentList.map(comment =>
                        <div key={comment.id} className="comment">
                           <div className="row">
                              <div className="col-12 col-sm-6">{comment.name}</div>
                              <StarRating className="col-auto ml-auto" rate={comment.rate} />
                           </div>
                           <div className="col-12">{comment.description}</div>
                        </div>
                     )
                     }
                  </>
               }
            </Container>
         </div>
      </>
   );
};

declare type IProps = {
   product: Product;
};
export default Tabs;

enum productTabs {
   NutritionalInfo,
   Comments
}
