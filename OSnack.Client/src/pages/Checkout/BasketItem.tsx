import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { OrderItem, ProductUnitType } from 'osnack-frontend-shared/src/_core/apiModels';
import { onImageError } from 'osnack-frontend-shared/src/_core/appFunc';
import { API_URL } from 'osnack-frontend-shared/src/_core/constant.Variables';
import QuantityInput from 'osnack-frontend-shared/src/components/Inputs/QuantityInput';
import { ShopContext } from '../../_core/shopContext';

const BasketItem = (props: IProps) => {
   const history = useHistory();
   const basket = useContext(ShopContext);

   useEffect(() => {
      console.log(props.orderItem);
   }, []);
   return (
      <div className="row">
         <div className="col-12 col-sm-5 pb-4 p-sm-4 justify-text-center">
            <img className="shop-card-img" onError={onImageError.Product}
               src={`${API_URL}/${props.orderItem.imagePath}`} alt={name} />
         </div>
         <div className="row col-12 col-sm-7 p-sm-4  ">
            <div className="col-12 h5">{props.orderItem.name} ({props.orderItem.productCategoryName})</div>
            <div className="col-12 h6 mb-1">£{props.orderItem.price} ({props.orderItem.unitQuantity} {ProductUnitType[props.orderItem.unitType]}) :  <b>£{(props.orderItem.price * props.orderItem.quantity).toFixed(2)}</b></div>
            <QuantityInput
               btnMinusClassName="radius-none"
               btnPlusClassName="radius-none"
               value={props.orderItem.quantity}
               onChange={(val) => { basket.updateOrderItem(props.orderItem, val); props.onChange(val); }}
               className="col-12   mt-auto"
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
