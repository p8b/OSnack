import React, { useEffect, useState } from 'react';
import PageHeader from 'osnack-frontend-shared/src/components/Texts/PageHeader';
import { Input } from 'osnack-frontend-shared/src/components/Inputs/Input';
import { Button } from 'osnack-frontend-shared/src/components/Buttons/Button';
import Modal from 'osnack-frontend-shared/src/components/Modals/Modal';
import { NutritionalInfo } from 'osnack-frontend-shared/src/_core/apiModels';
const ProductNutritionalInfoModal = (props: IProps) => {
   const [nutritionalInfo, setNutritionalInfo] = useState(props.nutritionalInfo || new NutritionalInfo());

   useEffect(() => {
      if (props.nutritionalInfo == null)
         setNutritionalInfo(new NutritionalInfo());
      else
         setNutritionalInfo(props.nutritionalInfo);
   }, [props.nutritionalInfo]);

   return (
      <Modal className="col-12 col-sm-11 col-md-9 col-lg-6"
         isOpen={props.isOpen}>
         <PageHeader title={"Nutritional Information"} />
         <b className="mb-3">**Information per 100g</b>
         {/***** Fat, Saturate Fat, Carbohydrate,  Carbohydrate Sugar ****/}
         <div className="row">
            <Input label="Energy KJ"
               type="number"
               positiveNumbersOnly
               value={nutritionalInfo.energyKJ}
               onChange={i => { setNutritionalInfo({ ...nutritionalInfo, energyKJ: i.target.value as unknown as number }); }}
               className="col-12 col-sm-6"
               showDanger={props.alert.checkExist("NutritionalInfo.EnergyKJ")} />
            <Input label="Energy Kcal"
               type="number"
               positiveNumbersOnly
               value={nutritionalInfo.energyKcal}
               onChange={i => { setNutritionalInfo({ ...nutritionalInfo, energyKcal: i.target.value as unknown as number }); }}
               className="col-12 col-sm-6"
               showDanger={props.alert.checkExist("NutritionalInfo.EnergyKcal")} />
         </div>
         <div className="row">
            <Input label="Fat"
               type="number"
               positiveNumbersOnly
               value={nutritionalInfo.fat}
               onChange={i => { setNutritionalInfo({ ...nutritionalInfo, fat: i.target.value as unknown as number }); }}
               className="col-12 col-sm-6"
               inputRightLable="grams"
               showDanger={props.alert.checkExist("NutritionalInfo.Fat")}
            />
            <Input label="Saturate Fat"
               type="number"
               positiveNumbersOnly
               value={nutritionalInfo.saturateFat}
               onChange={i => { setNutritionalInfo({ ...nutritionalInfo, saturateFat: i.target.value as unknown as number }); }}
               className="col-12 col-sm-6"
               inputRightLable="grams"
               showDanger={props.alert.checkExist("NutritionalInfo.SaturateFat")} />
         </div>
         <div className="row">
            <Input label="Carbohydrate"
               type="number"
               positiveNumbersOnly
               value={nutritionalInfo.carbohydrate}
               onChange={i => { setNutritionalInfo({ ...nutritionalInfo, carbohydrate: i.target.value as unknown as number }); }}
               className="col-12 col-sm-6"
               inputRightLable="grams"
               showDanger={props.alert.checkExist("NutritionalInfo.Carbohydrate")} />

            <Input label="Carbohydrate Sugar"
               type="number"
               positiveNumbersOnly
               value={nutritionalInfo.carbohydrateSugar}
               onChange={i => { setNutritionalInfo({ ...nutritionalInfo, carbohydrateSugar: i.target.value as unknown as number }); }}
               className="col-12 col-sm-6"
               inputRightLable="grams"
               showDanger={props.alert.checkExist("NutritionalInfo.CarbohydrateSugar")} />

         </div>
         {/***** Fibre, Protein, Salt ****/}
         <div className="row">
            <Input label="Fibre"
               type="number"
               positiveNumbersOnly
               value={nutritionalInfo.fibre}
               onChange={i => { setNutritionalInfo({ ...nutritionalInfo, fibre: i.target.value as unknown as number }); }}
               className="col-12 col-sm-6"
               inputRightLable="grams"
               showDanger={props.alert.checkExist("NutritionalInfo.Fibre")} />
            <Input label="Protein"
               type="number"
               positiveNumbersOnly
               value={nutritionalInfo.protein}
               onChange={i => { setNutritionalInfo({ ...nutritionalInfo, protein: i.target.value as unknown as number }); }}
               className="col-12 col-sm-6"
               inputRightLable="grams"
               showDanger={props.alert.checkExist("NutritionalInfo.Protein")} />
         </div>
         <div className="row">
            <Input label="Salt"
               type="number"
               positiveNumbersOnly
               value={nutritionalInfo.salt}
               onChange={i => { setNutritionalInfo({ ...nutritionalInfo, salt: i.target.value as unknown as number }); }}
               className="col-12 col-sm-6"
               inputRightLable="grams"
               showDanger={props.alert.checkExist("NutritionalInfo.Salt")} />

            {/***** buttons ****/}
            <div className="col-12 col-sm-6  mt-auto mb-auto">
               <Button children="close"
                  className={`col-12 btn-white btn-lg`}
                  onClick={() => { props.onSubmit(nutritionalInfo); }} />
            </div>
         </div>
      </Modal >
   );
};

declare type IProps = {
   isOpen: boolean;
   onSubmit: (nutritionalInfo: NutritionalInfo) => void;
   nutritionalInfo?: NutritionalInfo;
   alert: any;
};
export default ProductNutritionalInfoModal;
