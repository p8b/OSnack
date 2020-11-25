
import { Product } from 'osnack-frontend-shared/src/_core/apiModels';
import React, { useEffect, useState } from 'react';
import Container from '../../components/Container';
const Tabs = (props: IProps) => {
   const [selectedNav, setSelectedNav] = useState(productTabs.NutritionalInfo);
   useEffect(() => {
   }, []);
   return (
      <>
         <ul className="nav nav-tabs">
            <li className="nav-item">
               <a onClick={() => { setSelectedNav(productTabs.NutritionalInfo); }}
                  className={`nav-link ${selectedNav === productTabs.NutritionalInfo ? "active" : ""} `}>
                  Nutritional Information
               </a>
            </li>
            <li className="nav-item">
               <a onClick={() => { setSelectedNav(productTabs.Comments); }}
                  className={`nav-link ${selectedNav === productTabs.Comments ? "active" : ""} `}>
                  Comments ({props.product.comments?.length || 0})
               </a>
            </li>
         </ul>
         <div className="col-12">
            <Container className="container-fluid p-3 pt-5 pb-5">
               {selectedNav === productTabs.NutritionalInfo &&
                  <>
                     <p>Per 100g</p>
                  <div>Energy: {props.product.nutritionalInfo?.energyKJ}KJ / {props.product.nutritionalInfo?.energyKcal}Kcal</div>
                  <div>Fat: {props.product.nutritionalInfo?.fat}g</div>
                  <div className="pl-5">of which saturates, {props.product.nutritionalInfo?.saturateFat}g</div>
                  <div>Carbohydrate: {props.product.nutritionalInfo?.carbohydrate}g</div>
                  <div className="pl-5">of which Sugar, {props.product.nutritionalInfo?.carbohydrateSugar}g</div>
                  <div>Fiber: {props.product.nutritionalInfo?.fibre}g</div>
                  <div>Protein: {props.product.nutritionalInfo?.protein}g</div>
                  <div>Salt: {props.product.nutritionalInfo?.salt}g</div>
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
