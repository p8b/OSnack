import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Product } from 'osnack-frontend-shared/src/_core/apiModels';
import { enumToArray, onProductImageError } from 'osnack-frontend-shared/src/_core/appFunc';
import { API_URL, DefaultProductImage, ProductUnitType } from 'osnack-frontend-shared/src/_core/constant.Variables';
import QuantityInput from 'osnack-frontend-shared/src/components/Inputs/QuantityInput';

const ShopItem = (props: IProps) => {
   const history = useHistory();
   useEffect(() => {
   }, []);
   return (
      <div key={props.product.id} className="col-12 col-sm-6 col-md-4 p-0 pb-2 shop-card ">
         <a className="col link-shop-card-img m-0 justify-text-center"
            onClick={() => {
               history.push(`/Shop/Product/${encodeURIComponent(props.product.category.name || "")}/${encodeURIComponent(props.product.name || "")}`);
            }} >
            <img src={`${API_URL}\\${props.product.imagePath}`}
               onError={onProductImageError}
               alt={props.product.name} />
            <span>Details</span>
         </a>
         <QuantityInput
            btnOnZeroTitle=""
            btnOnZeroClassName="radius-none btn-green cart-icon"
            btnMinusClassName="radius-none-t"
            btnPlusClassName="radius-none-t"
            value={0}
            onChange={(val) => { }}
            className="col-12"
         />
         <div className="pt-3 pb-2 h4">{props.product.name}</div>
         <b>£{props.product.price}</b><span> - {props.product.unitQuantity} {enumToArray(ProductUnitType).filter(t => t.id == props.product.unitType)[0]?.name}</span>
      </div>
   );
};

declare type IProps = {
   product: Product;
};
export default ShopItem;
