import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { Product, ProductUnitType } from 'osnack-frontend-shared/src/_core/apiModels';
import { onImageError } from 'osnack-frontend-shared/src/_core/appFunc';
import { API_URL } from 'osnack-frontend-shared/src/_core/appConst';
import QuantityInput from 'osnack-frontend-shared/src/components/Inputs/QuantityInput';
import { ShopContext } from '../../_core/shopContext';

const ShopItem = (props: IProps) => {
   const history = useHistory();
   const basket = useContext(ShopContext);
   return (
      <div key={props.product.id} className={`${props.className || ""} shop-card`}>
         <a className="col link-shop-card-img m-0 justify-text-center"
            onClick={() => {
               history.push(`/Shop/Product/${encodeURIComponent(props.product.category.name || "")}/${encodeURIComponent(props.product.name || "")}`);
            }} >
            <img src={`${API_URL}\\${props.product.imagePath}`}
               onError={onImageError.Product}
               alt={props.product.name} />
            <span>Details</span>
         </a>
         {  !props.isQuantityDisabled &&
            <QuantityInput
               btnOnZeroTitle=""
               btnOnZeroClassName=" btn-green cart-icon"
               btnMinusClassName=""
               btnPlusClassName=""
               value={basket.getQuantity(props.product)}
               onChange={(val) => { basket.set(props.product, val); }}
               className="col-12"
               disabledMessage="out of stock"
               isDisabled={props.product.stockQuantity <= 0}
            />
         }
         <div className="pt-3">
            <b>£{props.product.price}</b><span> - {props.product.unitQuantity} {ProductUnitType[props.product.unitType]}</span>
         </div>
         <div className="pt-2 pb-1 h4">{props.product.name}</div>
      </div>
   );
};

declare type IProps = {
   product: Product;
   isQuantityDisabled?: boolean;
   className?: string;
};
export default ShopItem;
