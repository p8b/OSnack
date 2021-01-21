import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Container from '../../components/Container';
import { API_URL } from 'osnack-frontend-shared/src/_core/constant.Variables';
import { Category } from 'osnack-frontend-shared/src/_core/apiModels';
import Carousel from '../../components/Carousel';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { useAllPublicCategory } from 'osnack-frontend-shared/src/hooks/PublicHooks/useCategoryHook';
import { usePostNewsletter } from 'osnack-frontend-shared/src/hooks/PublicHooks/useNewsletterHook';
import { onImageError } from 'osnack-frontend-shared/src/_core/appFunc';
import { Input } from 'osnack-frontend-shared/src/components/Inputs/Input';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import Alert, { AlertObj, useAlert } from 'osnack-frontend-shared/src/components/Texts/Alert';

const Home = (props: IProps) => {
   const isUnmounted = useRef(false);
   const [email, setEmail] = useState("");
   const errorAlert = useAlert(new AlertObj());
   const [heroImgLoaded, setHeroImgLoaded] = useState(false);
   const [carouselItems, setCarouselItems] = useState<any[]>([]);
   const history = useHistory();

   useEffect(() => {
      var img = new Image();
      img.src = "public/images/hero-img.png";
      img.onload = () => {
         setHeroImgLoaded(true);
      };
      useAllPublicCategory().then(data => {
         if (isUnmounted.current) return;
         getCarouselItems(data.data);
      });
      return () => { isUnmounted.current = true; };
   }, []);

   const getCarouselItems = (categoryList: Category[]) => {
      let arr = [];
      for (var i = 0; i < categoryList.length; i++) {
         let category = categoryList[i];
         arr.push(
            <div className="shop-card-category ml-auto mr-auto">
               <a className="col link-shop-card-img m-0 justify-text-center"
                  onClick={() => {
                     history.push(`/Shop/Category/${encodeURIComponent(category.name || "")}`);
                  }} >
                  <img src={`${API_URL}\\${category.imagePath}`}
                     alt={category.name}
                     onError={onImageError.Category} />
                  <span>Shop Now</span>
               </a>
               <div className="pt-3 pb-2 h4">{category.name}</div>
            </div>
         );
      }
      setCarouselItems(arr);
   };

   const onSubscribe = () => {
      if (email == "")
         return;
      usePostNewsletter({ email: email })
         .then(result => errorAlert.setSingleSuccess("", result.data))
         .catch(errors => { errorAlert.set(errors); });
   };

   return (
      <Container className="wide-container pl-0 pr-0">
         <div className={`hero-container ${heroImgLoaded ? "imgLoaded" : ""} row`}>
            <h1 className="text-white col-12  text-center">Ready to osnack?</h1>
            <div className="text-white col-12 h3 text-center">
               We provide quality mediterranean products for you to enjoy.
            </div>
            <div className="col-12 text-center">
               <Button onClick={() => history.push("/Shop")} className='btn btn-orange'>Shop now</Button>
            </div>
         </div>
         <div className="col-12 my-5 py-5">
            <div className="col-12 display-4 mt-5 text-center">
               Treat yourself with <i style={{ fontFamily: "'Courgette', cursive" }}> delicious </i> and <i style={{ fontFamily: "'Courgette', cursive" }}> healthy </i> snacks.
            </div>
            <div className="col-12 col-md-7 display-6 my-5 mx-auto text-center">
               Here at OSnack, we aim to select and provide the best quality snack
               so you can just enjoy the wonderful taste.
            </div>
         </div>
         {carouselItems.length > 0 &&
            <div className="col-12 categories-section bg-white">
               <PageHeader className="line-header-lg" title="Categories" />
               <Carousel items={carouselItems} />
            </div>
         }
         <Container >
            <div className="row my-5 py-5 justify-content-center">
               <div><img src="public/images/Satisfactionpng.png" alt="Satisfaction" /></div>
               <div style={{ fontFamily: "'Courgette', cursive" }} className="col-12 text-center h1">Your Satisfation is our piority</div>
            </div>
            <div className="row  mt-5 mb-5 pt-3 pb-3 justify-content-center">
               <div><img src="public/images/QualityFood.png" alt="Quality Food" /></div>
               <div style={{ fontFamily: "'Courgette', cursive" }} className="col-12 text-center h1">Our mission is to provide quality snacks</div>
            </div>
         </Container>
         <div className="col-12 sign-up-bg pt-4 pb-4 mt-4 mb-4">
            <Container >
               <div className="row pt-5 pb-5">
                  <div className="col-12 col-md-6 mt-auto">
                     <div className="col-12 h2 px-0">Newsletter</div>
                     <div className="col-12 display-6 my-3 mt-md-5 px-0">
                        Stay up to date with our latest promotions and products
                     </div>
                  </div>
                  <div className="col-12 col-md-6 my-auto">
                     <Alert alert={errorAlert.alert}
                        className="col-12"
                        onClosed={() => { errorAlert.clear(); }}
                     />
                     <Input className="col-12 p-0"
                        placeholder="Email"
                        value={email}
                        showDanger={errorAlert.checkExist("email")}
                        onChange={(e) => setEmail(e.target.value)}
                     />
                     <Button className="col-12  btn-white" children="Sign up" onClick={onSubscribe} />
                  </div>
               </div>
            </Container>
         </div>
      </Container >
   );
};
declare type IProps = {
};
export default Home;
