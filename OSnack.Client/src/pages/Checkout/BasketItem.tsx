import React, { useContext } from 'react';

import { OrderItem, ProductUnitType } from 'osnack-frontend-shared/src/_core/apiModels';
import { onImageError } from 'osnack-frontend-shared/src/_core/appFunc';
import { API_URL } from 'osnack-frontend-shared/src/_core/constant.Variables';
import QuantityInput from 'osnack-frontend-shared/src/components/Inputs/QuantityInput';
import { ShopContext } from '../../_core/shopContext';

const BasketItem = (props: IProps) => {
   const basket = useContext(ShopContext);
   return (
      <div className="row mt-4 mb-4">
         <div className="col-4 col-sm-5">
            <img className="shop-card-img" onError={onImageError.Product}
               src={`${API_URL}/${props.orderItem.imagePath}`} alt={name} />
         </div>
         <div className="row col-8 col-sm-7">
            <div className="col-12 p-0 "><span className="h5">{props.orderItem.name}</span> ({props.orderItem.productCategoryName})</div>
            <div className="col-12 p-0 h6 mb-1">£{props.orderItem.price} ({props.orderItem.unitQuantity} {ProductUnitType[props.orderItem.unitType]}) :  <b>£{(props.orderItem.price * props.orderItem.quantity).toFixed(2)}</b></div>
            <QuantityInput
               btnMinusClassName="radius-none"
               btnPlusClassName="radius-none"
               value={props.orderItem.quantity}
               onChange={(val) => { basket.updateOrderItem(props.orderItem, val); props.onChange(val); }}
               className="col-12 mt-3 mt-sm-auto"
            />
         </div>

      </div>
   );
};

declare type IProps = {
   orderItem: OrderItem;
   onChange: (value: number) => void;
};
export default BasketItem;
