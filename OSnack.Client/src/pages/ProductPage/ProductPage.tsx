import React, { useContext, useEffect, useRef, useState } from 'react';

import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';
import { Product, ProductUnitType } from 'osnack-frontend-shared/src/_core/apiModels';
import { useProductAndRelateProduct } from 'osnack-frontend-shared/src/hooks/PublicHooks/useProductHook';
import { Redirect, useHistory } from 'react-router-dom';
import { API_URL } from 'osnack-frontend-shared/src/_core/appConst';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import Container from '../../components/Container';
import QuantityInput from 'osnack-frontend-shared/src/components/Inputs/QuantityInput';
import Tabs from './Tabs';
import ShopItem from '../Shop/ShopItem';
import { ShopContext } from '../../_core/Contexts/shopContext';
import Carousel from '../../components/Carousel';
import { StarRating } from 'osnack-frontend-shared/src/components/Inputs/StarRating';

const ProductPage = (props: IProps) => {
   const isUnmounted = useRef(false);
   const errorAlert = useAlert(new AlertObj());
   const [product, setProduct] = useState(new Product());
   const [redirectToShop, setRedirectToShop] = useState<boolean>(false);
   const [carousel, setCarousel] = useState<any>();
   const history = useHistory();
   const basket = useContext(ShopContext);

   useEffect(() => () => { isUnmounted.current = true; }, []);

   useEffect(() => {
      loadProduct(true);
   }, [window.location.pathname]);

   const loadProduct = (scrollToTop?: boolean) => {
      errorAlert.pleaseWait(isUnmounted);
      const uriPathNameArr = window.location.pathname.split('/').filter(val => val.length > 0);
      if (uriPathNameArr.length === 4 && uriPathNameArr[1].toLowerCase() == "product") {
         useProductAndRelateProduct(uriPathNameArr[2], decodeURI(uriPathNameArr[3]))
            .then(result => {
               if (isUnmounted.current) return;
               setProduct(result.data.product!);
               if (scrollToTop)
                  window.scrollTo(0, 0);
               setCarousel(<Carousel items={getCarouselItems(result.data.relatedProductList!)} />);
               errorAlert.clear();
            }).catch(errors => {
               if (isUnmounted.current) return;
               errorAlert.set(errors);
            });
      } else {
         setRedirectToShop(true);
      }
   };

   const getCarouselItems = (productList: Product[]) => {
      let arr: any[] = [];
      productList.map((product => {
         arr.push(<ShopItem className="col-12 mx-auto no-border" key={product.id} product={product} />);
      }));
      return arr;
   };
   if (redirectToShop)
      return <Redirect to="/Shop" />;

   return (
      <Container className="wide-container m-0">
         <PageHeader title="Product Details" />
         <Container className="bg-white px-0">
            <Alert className="col-12" alert={errorAlert.alert} />
            {product.id! > 0 &&
               <div className="col-12 p-3 ">
                  <nav>
                     <ol className="breadcrumb">
                        <li className="breadcrumb-item" onClick={() => { history.push("/Shop"); }}>Shop</li>
                        <li className="breadcrumb-item" onClick={() => { history.push(`/Shop/Category/${product.category.name}`); }}>{product.category.name}</li>
                        <li className="breadcrumb-item active" >{product.name}</li>
                     </ol>
                  </nav>
                  <div className="row ">
                     <div className="row pm-0 col-12 col-sm-5 p-4 justify-text-center">
                        <div className="col-12 pm-0 mx-auto">
                           <img className="shop-card-img" src={`${API_URL}/${product.imagePath}`} alt={product.name} />
                        </div>
                        {product.score != -1 &&
                           <StarRating className="col-auto pm-0 mx-auto stars-lg" rate={product.score} readonly />
                        }
                     </div>
                     <div className="col-12 col-sm-7 p-4 pl-md-5">
                        <h1>{product.name}</h1>
                        <p>Category: {product.category.name}</p>
                        <p className="pt-4 pb-4">{product.description}</p>
                        <b className="mb-5">£{product.price} ({product.unitQuantity} {ProductUnitType[product.unitType]})</b>
                        <QuantityInput
                           btnOnZeroTitle="Add"
                           btnOnZeroClassName=" btn-green cart-icon"
                           btnMinusClassName=""
                           btnPlusClassName=""
                           value={basket.getQuantity(product)}
                           onChange={(val) => { basket.set(product, val); }}
                           className="col-12 col-md-6 pt-3 pb-3"
                           isDisabled={product.stockQuantity <= 0}
                           disabledMessage="out of stock"
                        />
                     </div>
                  </div>
                  <Tabs product={product} refreshProduct={loadProduct} />
                  <div className="row pm-0 col-12 justify-content-center py-5">
                     <PageHeader title="Related Products" className="line-header-lg col-12 p-0" />
                     {carousel}
                  </div>
               </div>
            }
         </Container>
      </Container>
   );
};

declare type IProps = {
};
export default ProductPage;
