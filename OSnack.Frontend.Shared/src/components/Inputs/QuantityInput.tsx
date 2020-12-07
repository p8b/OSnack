import React, { useState } from 'react';
import { Button } from '../Buttons/Button';
import { Input } from './Input';

const QuantityInput = (props: IProps) => {
   const [id] = useState(Math.random().toString());
   const PlusOne = async () => {
      console.log(props.value);
      if (!props.disabled)
         props.onChange((props.value || 0) * 1 + 1);
   };
   const MinusOne = async () => {
      if (!props.disabled)
         props.onChange((props.value || 0) * 1 - 1);
   };
   const manualChanged = async (val: number) => {
      if (!props.disabled)
         props.onChange(val);
   };
   return (
      <div className={props.className}>
         <div className="row">
            {props.btnOnZeroTitle != undefined && (props.value == 0 || props.value == undefined) && document.activeElement?.id !== id &&
               <Button className={`col-12 btn-lg m-0 ${props.btnOnZeroClassName}`}
                  onClick={PlusOne} children={props.btnOnZeroTitle} />
            }
            {(props.value && props.value > 0 || document.activeElement?.id === id) &&
               <>
                  {!props.disabled &&
                     <Button className={`col-3 btn-lg btn-danger minus-icon radius-none-r  ${props.btnMinusClassName}`}
                        onClick={MinusOne} />
                  }
                  <Input id={id} type="number" positiveNumbersOnly value={props.value}
                     className="col-6 p-0 mb-0 d-flex align-items-end"
                     inputClassName={`text-center form-control-lg ${props.inputClassName}`}
                     onBlur={(i) => { manualChanged(i.target.value as unknown as number); }}
                     onChange={(i) => { props.onChange(i.target.value as unknown as number); }}
                  />
                  {!props.disabled &&
                     <Button className={`col-3 btn-lg btn-success plus-icon radius-none-l ${props.btnPlusClassName}`}
                        onClick={PlusOne}
                     />
                  }
               </>
            }
         </div>
      </div>
   );
};

declare type IProps = {
   btnOnZeroTitle?: string;
   btnOnZeroClassName?: string;
   btnPlusClassName?: string;
   btnMinusClassName?: string;
   inputClassName?: string;
   className: string;
   value?: number,
   disabled?: boolean,
   onChange: (value: number) => void;

};
export default QuantityInput;
