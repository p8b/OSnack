import React from 'react';

const Slider = (props: IProps) => {
   return (
      <input type="range" min={props.min} max={props.max} step={props.step} value={props.value} className={`slider ${props.className}`}
         onChange={(i) => { props.onChange(i.target.value as unknown as number); }} />
   );
};

declare type IProps = {
   min: number;
   max: number;
   step: number;
   value: number;
   className?: string;
   onChange: (value: number) => void;
};

export default Slider;
