
import { Product } from 'osnack-frontend-shared/src/_core/apiModels';
import React, { useEffect, useState } from 'react';
import Container from '../../components/Container';
const Tabs = (props: IProps) => {
   const [selectedNav, setSelectedNav] = useState(productTabs.NutritionalInfo);
   const [showNutritionalInfo, setShowNutritionalInfo] = useState(false);
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
                  Comments ({props.product.comments?.length || 0})
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
                  <div>
                     Only logged in customers who have purchased this product may leave a comment.
                  </div>
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
